'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAudioBufferManager } from '../../hooks/useAudioBufferManager';
import type { OrbMode } from './VoiceOrb';

export interface VoiceSessionCallbacks {
  onVoiceInput?: (input: string) => void;
  onAssistantResponse?: (response: string) => void;
  onVoiceInputStateChange?: (state: boolean) => void;
}

export type VoiceMode = 'idle' | OrbMode;
type Mode = VoiceMode;

const SOCKET_URL = 'wss://api2.cstate.se/audio-stream';

// Barge-in: what counts as the user talking over the assistant. Echo of our
// own playback leaks through the mic even with echo cancellation, and on
// phones the OS ducks the mic hard while the speaker plays — so a fixed
// threshold is either tripped by echo or never reached by ducked speech. The
// detector learns how much speaker output shows up in the mic (a coupling
// ratio), predicts the echo from the live output level, and counts as speech
// only what rises clearly above that prediction — for a stretch, not a
// couple of 5 ms frames.
const BARGE_MIN_RMS = 0.012;
const BARGE_ECHO_RATIO = 1.6;
const BARGE_AMBIENT_RATIO = 3;
const BARGE_SUSTAIN_MS = 200;
// Echo cancellers need a moment to converge once the speakers start.
const BARGE_ARM_DELAY_MS = 350;
const DEBUG = () => { try { return localStorage.getItem('cs-voice-debug') === '1'; } catch { return false; } };
// After playback ends, the room is still ringing; keep that out of the server VAD.
const POST_PLAYBACK_MUTE_MS = 250;
// Audio kept while deciding whether the user is interrupting, flushed to the
// server once they are — so their first word isn't lost to the decision.
const PRE_ROLL_MS = 320;
// After a cancel, chunks and transcript already in flight keep arriving for
// a moment; a new answer can't start this soon, so drop them.
const POST_BARGE_DROP_MS = 600;

/**
 * One live voice conversation: socket, microphone, playback, turn-taking and
 * barge-in. The UI on top of it (the mic button's overlay, the /voice page)
 * only renders what this reports.
 */
export const useVoiceSession = ({ onVoiceInput, onAssistantResponse, onVoiceInputStateChange }: VoiceSessionCallbacks = {}) => {
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
  const ambientRef = useRef(0.01);
  const couplingRef = useRef(0);
  const outEnvRef = useRef(0);
  const speechMsRef = useRef(0);
  const debugTickRef = useRef(0);
  const bargedAtRef = useRef(0);
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
      couplingRef.current = 0;
      outEnvRef.current = 0;
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
    bargedAtRef.current = Date.now();
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
      // Echo reaches the mic a little after the speaker: hold the output
      // level's peaks so the prediction covers that lag.
      const out = getOutputLevel();
      outEnvRef.current = Math.max(out, outEnvRef.current * 0.97);
      const outEnv = outEnvRef.current;
      if (now - playbackStartedAtRef.current < BARGE_ARM_DELAY_MS) return;

      const pcm = floatTo16BitPCM(audioData);
      preRollRef.current.push(pcm);
      const maxFrames = Math.ceil(PRE_ROLL_MS / frameMs);
      if (preRollRef.current.length > maxFrames) preRollRef.current.shift();

      const predictedEcho = couplingRef.current * outEnv;
      const threshold = Math.max(
        BARGE_MIN_RMS,
        ambientRef.current * BARGE_AMBIENT_RATIO,
        predictedEcho * BARGE_ECHO_RATIO + 0.004
      );
      const speech = rms > threshold;
      if (speech) {
        speechMsRef.current += frameMs;
      } else {
        speechMsRef.current = Math.max(0, speechMsRef.current - frameMs * 1.5);
        // Only quiet frames teach the coupling, so speech can't inflate it.
        if (outEnv > 0.01) {
          const ratio = Math.min(3, rms / outEnv);
          couplingRef.current = couplingRef.current === 0 ? ratio : couplingRef.current + (ratio - couplingRef.current) * 0.05;
        }
      }
      if (DEBUG() && ++debugTickRef.current % 20 === 0) {
        console.debug('[voice] rms', rms.toFixed(3), 'out', outEnv.toFixed(3), 'echo~', predictedEcho.toFixed(3), 'thr', threshold.toFixed(3), 'speechMs', speechMsRef.current | 0);
      }
      if (speechMsRef.current >= BARGE_SUSTAIN_MS) {
        if (DEBUG()) console.debug('[voice] barge-in');
        bargeIn();
      }
      return;
    }

    // Track the room's quiet level while listening: a floor that falls fast
    // and rises slowly, so the user's own speech doesn't drag it up.
    ambientRef.current = rms < ambientRef.current
      ? rms
      : ambientRef.current + (rms - ambientRef.current) * 0.002;

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
    callbacksRef.current.onVoiceInputStateChange?.(true);

    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    const socket = new WebSocket(SOCKET_URL);
    socket.binaryType = 'arraybuffer';
    socketRef.current = socket;

    socket.onmessage = async (event) => {
      const stale = Date.now() - bargedAtRef.current < POST_BARGE_DROP_MS;
      if (event.data instanceof ArrayBuffer) {
        if (modeRef.current === 'paused' || modeRef.current === 'idle' || stale) return;
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
          callbacksRef.current.onVoiceInput?.(message.text);
          break;
        case 'assistant_delta':
          if (!stale) setAssistantText(prev => prev + message.text);
          break;
        case 'assistant_response':
          setAssistantText(message.text);
          callbacksRef.current.onAssistantResponse?.(message.text);
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
    callbacksRef.current.onVoiceInputStateChange?.(false);
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

  const interrupt = () => {
    if (modeRef.current === 'speaking') bargeIn();
  };

  return {
    mode,
    error,
    userText,
    assistantText,
    start: startListening,
    stop: stopListening,
    togglePause,
    interrupt,
    getMicLevel,
    getOutputLevel,
  };
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

