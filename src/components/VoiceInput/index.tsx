import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Pause, Play } from 'lucide-react';
import { useAudioBufferManager } from '../../hooks/useAudioBufferManager';

interface VoiceInputProps {
  onVoiceInput: (input: string) => void;
  onAssistantResponse: (response: string) => void;
  onVoiceInputStateChange: (state: boolean) => void;
}

const SPEECH_RMS_THRESHOLD = 0.025;
const SPEECH_CONFIRM_FRAMES = 2;

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, onAssistantResponse, onVoiceInputStateChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const isInterruptedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const speechDetectionCounterRef = useRef(0);
  const lastAudioChunkTimeRef = useRef<number>(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { isPlaying, isPlayingRef, addAudioChunk, stopAudio, setOnPlaybackComplete } = useAudioBufferManager();

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    setOnPlaybackComplete(() => {
      // Playback done — mic is already active, server VAD handles next turn
    });
  }, [setOnPlaybackComplete]);

  useEffect(() => {
    isInterruptedRef.current = isInterrupted;
  }, [isInterrupted]);

  const startListening = async () => {
    setError(null);

    // Tear down any stale connection before starting fresh
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsListening(true);
    setIsInterrupted(false);
    setDropdownVisible(true);
    onVoiceInputStateChange(true);

    try {
      socketRef.current = new WebSocket('wss://api2.cstate.se/audio-stream');
      socketRef.current.binaryType = 'arraybuffer';

      socketRef.current.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socketRef.current.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          const float32Data = new Float32Array(event.data);
          if (float32Data.length > 0) {
            lastAudioChunkTimeRef.current = Date.now();
            addAudioChunk(float32Data);
          } else {
            console.warn('Received empty audio chunk from WebSocket');
          }
        } else {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'ready') {
              await setupAudioStream();
            } else if (message.type === 'transcription') {
              onVoiceInput(message.text);
            } else if (message.type === 'assistant_response') {
              onAssistantResponse(message.text);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket error occurred.');
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (err) {
      console.error('Error starting listening:', err);
      setError('Failed to start listening. Please try again.');
      setIsListening(false);
    }
  };

  const setupAudioStream = async () => {
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      // Guard: WebSocket may have closed while waiting for mic permission
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        return;
      }

      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      await audioContextRef.current.audioWorklet.addModule('/audio-worklet-processor.js');

      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'audio-processor');

      workletNodeRef.current.port.onmessage = (event) => {
        const audioData: Float32Array = event.data;

        if (isPlayingRef.current && !isInterruptedRef.current) {
          if (Date.now() - lastAudioChunkTimeRef.current < 1000) return;
          const rms = calculateRMS(audioData);
          if (rms > SPEECH_RMS_THRESHOLD) {
            speechDetectionCounterRef.current++;
            if (speechDetectionCounterRef.current >= SPEECH_CONFIRM_FRAMES) {
              speechDetectionCounterRef.current = 0;
              autoInterruptAndResume();
            }
          } else {
            speechDetectionCounterRef.current = 0;
          }
          return;
        }

        speechDetectionCounterRef.current = 0;

        if (!isInterruptedRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
          const int16Data = floatTo16BitPCM(audioData);
          socketRef.current.send(int16Data);
        }
      };

      source.connect(workletNodeRef.current);
      workletNodeRef.current.connect(audioContextRef.current.destination);
    } catch (err) {
      console.error('Error setting up audio stream:', err);
      setError('Failed to set up audio stream. Please try again.');
      setIsListening(false);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  };

  const stopListening = () => {
    setDropdownVisible(false);
    setIsListening(false);
    setIsInterrupted(false);
    onVoiceInputStateChange(false);
    isInterruptedRef.current = false;
    stopAudio();

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (workletNodeRef.current && audioContextRef.current) {
      workletNodeRef.current.disconnect();
      audioContextRef.current.close();
      workletNodeRef.current = null;
      audioContextRef.current = null;
    }
  };

  const interruptVoiceInput = () => {
    setIsInterrupted(true);
    isInterruptedRef.current = true;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'interrupt' }));
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (workletNodeRef.current && audioContextRef.current) {
      workletNodeRef.current.disconnect();
      audioContextRef.current.close();
      workletNodeRef.current = null;
      audioContextRef.current = null;
    }
    stopAudio();
  };

  const autoInterruptAndResume = async () => {
    stopAudio();
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'interrupt' }));
      socketRef.current.send(JSON.stringify({ type: 'reset' }));
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (workletNodeRef.current && audioContextRef.current) {
      workletNodeRef.current.disconnect();
      audioContextRef.current.close();
      workletNodeRef.current = null;
      audioContextRef.current = null;
    }
    try {
      await setupAudioStream();
    } catch (err) {
      console.error('Error auto-resuming after interrupt:', err);
    }
  };

  const resumeVoiceInput = async () => {
    setIsInterrupted(false);
    isInterruptedRef.current = false;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'reset' }));
    }
    try {
      await setupAudioStream();
    } catch (err) {
      console.error('Error resuming media stream:', err);
      setError('Failed to resume listening. Please try again.');
    }
  };

  const calculateRMS = (buffer: Float32Array): number => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  };

  const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  return (
    <div className="absolute right-12 bottom-3 md:bottom-1.5 md:bottom-2.5">
      <button
        onClick={isListening ? stopListening : startListening}
        className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 cursor-pointer"
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
        ) : (
          <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
        )}
      </button>

      {dropdownVisible && (
          <div className="relative inline-block">

          <div className="absolute z-50 -left-32 mt-3 w-32 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-between p-1" style={{ height: '2rem' }}>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="10" stroke="#93C5FD" strokeWidth="2" fill="none" strokeDasharray="62.8" strokeDashoffset="62.8">
              {!isInterrupted && (<animate attributeName="stroke-dashoffset" from="62.8" to="0" dur="2s" repeatCount="indefinite" />)}
              </circle>
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-300 mx-1">
              {isInterrupted ? 'Paused' : (isPlaying ? 'Playing' : 'Listening')}
            </span>
            <button
              onClick={isInterrupted ? resumeVoiceInput : interruptVoiceInput}
              className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              {isInterrupted ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {error && <div className="fixed mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default VoiceInput;
