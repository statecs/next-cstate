'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { useAudioBufferManager } from '../../hooks/useAudioBufferManager';
import VoiceOverlay from './VoiceOverlay';
import type { OrbMode } from './VoiceOrb';

interface VoiceInputProps {
  onVoiceInput: (input: string) => void;
  onAssistantResponse: (response: string) => void;
  onVoiceInputStateChange: (state: boolean) => void;
}

type Mode = 'idle' | OrbMode;

const SOCKET_URL = 'wss://api2.cstate.se/audio-stream';

// Barge-in: what counts as the user talking over the assistant. Echo of our
// own playback leaks through the mic even with echo cancellation, so the bar
// is an adaptive floor measured during playback, and speech has to sit above
// it for a stretch — not a couple of 5 ms frames.
const BARGE_MIN_RMS = 0.035;
const BARGE_FLOOR_RATIO = 2.5;
const BARGE_SUSTAIN_MS = 220;
// Echo cancellers need a moment to converge once the speakers start.
const BARGE_ARM_DELAY_MS = 400;
// After playback ends, the room is still ringing; keep that out of the server VAD.
const POST_PLAYBACK_MUTE_MS = 250;
// Audio kept while deciding whether the user is interrupting, flushed to the
// server once they are — so their first word isn't lost to the decision.
const PRE_ROLL_MS = 320;

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, onAssistantResponse, onVoiceInputStateChange }) => {
  const [mode, setMode] = useState<Mode>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userText, setUserText] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const modeRef = useRef<Mode>('idle');

  const socketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  const micLevelRef = useRef(0);
  const echoFloorRef = useRef(0);
  const speechMsRef = useRef(0);
  const preRollRef = useRef<ArrayBuffer[]>([]);

  const {
    isPlayingRef, playbackStartedAtRef, playbackEndedAtRef,
    addAudioChunk, stopAudio, closeAudio, getOutputLevel,
    setOnPlaybackStart, setOnPlaybackComplete,
  } = useAudioBufferManager();

  const callbacksRef = useRef({ onVoiceInput, onAssistantResponse, onVoiceInputStateChange });
  useEffect(() => {
    callbacksRef.current = { onVoiceInput, onAssistantResponse, onVoiceInputStateChange };
  }, [onVoiceInput, onAssistantResponse, onVoiceInputStateChange]);

  const changeMode = useCallback((next: Mode) => {
    modeRef.current = next;
    setMode(next);
  }, []);

  useEffect(() => {
    setOnPlaybackStart(() => {
      echoFloorRef.current = 0;
      speechMsRef.current = 0;
      preRollRef.current = [];
      if (modeRef.current === 'listening' || modeRef.current === 'thinking') changeMode('speaking');
    });
    setOnPlaybackComplete(() => {
      if (modeRef.current === 'speaking') changeMode('listening');
    });
  }, [setOnPlaybackStart, setOnPlaybackComplete, changeMode]);

  const send = (data: ArrayBuffer | object) => {
    const s = socketRef.current;
    if (!s || s.readyState !== WebSocket.OPEN) return;
    s.send(data instanceof ArrayBuffer ? data : JSON.stringify(data));
  };

  const teardownMic = () => {
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    mediaStreamRef.current = null;
    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    micLevelRef.current = 0;
  };

  const bargeIn = () => {
    stopAudio();
    send({ type: 'interrupt' });
    send({ type: 'reset' });
    for (const buf of preRollRef.current) send(buf);
    preRollRef.current = [];
    speechMsRef.current = 0;
    changeMode('listening');
  };

  const handleMicFrame = (audioData: Float32Array) => {
    const sampleRate = audioContextRef.current?.sampleRate ?? 24000;
    const frameMs = (audioData.length / sampleRate) * 1000;
    const rms = calculateRMS(audioData);
    micLevelRef.current = Math.max(rms, micLevelRef.current * 0.85);

    if (modeRef.current === 'paused') return;

    if (isPlayingRef.current) {
      const now = Date.now();
      if (now - playbackStartedAtRef.current < BARGE_ARM_DELAY_MS) return;

      const pcm = floatTo16BitPCM(audioData);
      preRollRef.current.push(pcm);
      const maxFrames = Math.ceil(PRE_ROLL_MS / frameMs);
      if (preRollRef.current.length > maxFrames) preRollRef.current.shift();

      const floor = echoFloorRef.current;
      echoFloorRef.current = floor === 0 ? rms : floor + (rms - floor) * 0.02;
      const threshold = Math.max(BARGE_MIN_RMS, echoFloorRef.current * BARGE_FLOOR_RATIO);
      if (rms > threshold) {
        speechMsRef.current += frameMs;
        if (speechMsRef.current >= BARGE_SUSTAIN_MS) bargeIn();
      } else {
        speechMsRef.current = Math.max(0, speechMsRef.current - frameMs * 1.5);
      }
      return;
    }

    if (Date.now() - playbackEndedAtRef.current < POST_PLAYBACK_MUTE_MS) return;
    send(floatTo16BitPCM(audioData));
  };

  const setupAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      // The socket may have closed, or the session ended, while the permission prompt was up.
      if (modeRef.current === 'idle' || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      mediaStreamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') await ctx.resume();
      await ctx.audioWorklet.addModule('/audio-worklet-processor.js');

      const source = ctx.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(ctx, 'audio-processor');
      node.port.onmessage = (event: MessageEvent<Float32Array>) => handleMicFrame(event.data);
      source.connect(node);
      node.connect(ctx.destination);
      workletNodeRef.current = node;

      changeMode(isPlayingRef.current ? 'speaking' : 'listening');
    } catch (err) {
      console.error('Error setting up audio stream:', err);
      setError('Microphone access is needed for a voice conversation');
      changeMode('error');
    }
  };

  const startListening = () => {
    setError(null);
    setUserText('');
    setAssistantText('');
    changeMode('connecting');
    callbacksRef.current.onVoiceInputStateChange(true);

    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    const socket = new WebSocket(SOCKET_URL);
    socket.binaryType = 'arraybuffer';
    socketRef.current = socket;

    socket.onmessage = async (event) => {
      if (event.data instanceof ArrayBuffer) {
        if (modeRef.current === 'paused' || modeRef.current === 'idle') return;
        const chunk = new Float32Array(event.data);
        if (chunk.length > 0) addAudioChunk(chunk);
        return;
      }
      let message: any;
      try { message = JSON.parse(event.data); } catch { return; }

      switch (message.type) {
        case 'ready':
          await setupAudioStream();
          break;
        case 'speech_started':
          setAssistantText('');
          break;
        case 'speech_stopped':
          setUserText('');
          if (modeRef.current === 'listening') changeMode('thinking');
          break;
        case 'transcription':
          setUserText(message.text);
          callbacksRef.current.onVoiceInput(message.text);
          break;
        case 'assistant_delta':
          setAssistantText(prev => prev + message.text);
          break;
        case 'assistant_response':
          setAssistantText(message.text);
          callbacksRef.current.onAssistantResponse(message.text);
          break;
        default:
          if (message.error) {
            console.error('Voice session error:', message.error, message.details);
            setError('The voice service is unavailable right now');
            changeMode('error');
          }
      }
    };

    socket.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('Could not reach the voice service');
      changeMode('error');
    };

    socket.onclose = () => {
      if (modeRef.current !== 'idle' && modeRef.current !== 'error') {
        setError('The connection was lost');
        changeMode('error');
      }
      teardownMic();
      stopAudio();
    };
  };

  const stopListening = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.onmessage = null;
      socketRef.current.close();
      socketRef.current = null;
    }
    teardownMic();
    closeAudio();
    preRollRef.current = [];
    changeMode('idle');
    callbacksRef.current.onVoiceInputStateChange(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeAudio, changeMode]);

  useEffect(() => () => stopListening(), [stopListening]);

  const togglePause = async () => {
    if (modeRef.current === 'paused') {
      send({ type: 'reset' });
      changeMode('connecting');
      await setupAudioStream();
      return;
    }
    stopAudio();
    send({ type: 'interrupt' });
    teardownMic();
    changeMode('paused');
  };

  const getMicLevel = useCallback(() => micLevelRef.current, []);

  return (
    <div className="absolute right-12 bottom-3 md:bottom-1.5 md:bottom-2.5">
      <button
        type="button"
        onClick={startListening}
        className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 cursor-pointer"
        aria-label="Start a voice conversation"
      >
        <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
      </button>

      {mode !== 'idle' && (
        <VoiceOverlay
          mode={mode}
          error={error}
          userText={userText}
          assistantText={assistantText}
          getMicLevel={getMicLevel}
          getOutputLevel={getOutputLevel}
          onTogglePause={togglePause}
          onEnd={stopListening}
        />
      )}
    </div>
  );
};

const calculateRMS = (buffer: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
};

const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
};

export default VoiceInput;
