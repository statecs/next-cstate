import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Pause, Play } from 'lucide-react';
import { useAudioBufferManager } from '../../hooks/useAudioBufferManager';

interface VoiceInputProps {
  onVoiceInput: (input: string) => void;
  onAssistantResponse: (response: string) => void;
  assistantId: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, onAssistantResponse, assistantId }) => {
  const [isListening, setIsListening] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const isInterruptedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { isPlaying, addAudioChunk, stopAudio, setOnPlaybackComplete } = useAudioBufferManager();

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    setOnPlaybackComplete(() => {
      if (isListening) {
        startListening();
      }
    });
  }, [isListening, setOnPlaybackComplete]);

  useEffect(() => {
    isInterruptedRef.current = isInterrupted;
  }, [isInterrupted]);

  const startListening = async () => {
    setError(null);
    setIsListening(true);
    setIsInterrupted(false);
    setDropdownVisible(true);

    try {
      socketRef.current = new WebSocket('ws://localhost:3001/audio-stream');
      socketRef.current.binaryType = 'arraybuffer';

      socketRef.current.onopen = async () => {
        console.log('WebSocket connection opened');
        await setupAudioStream();
      };

      socketRef.current.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          const float32Data = new Float32Array(event.data);
          if (float32Data.length > 0) {
            addAudioChunk(float32Data);
          } else {
            console.warn('Received empty audio chunk from WebSocket');
          }
        } else {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'transcription') {
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
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
  
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
  
      processorRef.current.onaudioprocess = (e) => {
        if (!isInterruptedRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          const audioData = e.inputBuffer.getChannelData(0);
          const int16Data = floatTo16BitPCM(audioData);
          socketRef.current.send(int16Data);
        }
      };
    } catch (err) {
      console.error('Error setting up audio stream:', err);
      setError('Failed to set up audio stream. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setDropdownVisible(false);
    setIsListening(false);
    setIsInterrupted(false);
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
  
    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect();
      audioContextRef.current.close();
      processorRef.current = null;
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
    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect();
      audioContextRef.current.close();
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
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className="-ml-32 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 cursor-pointer"
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
        ) : (
          <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
        )}
      </button>

      {dropdownVisible && (
        <div className="absolute z-50 -ml-36 mt-2 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700">
          <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3B82F6"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#93C5FD"
              strokeWidth="8"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset="251.2"
            >
              {!isInterrupted && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="251.2"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </svg>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {isInterrupted ? 'Paused' : (isPlaying ? 'Playing...' : 'Listening...')}
          </p>
          <button
            onClick={isInterrupted ? resumeVoiceInput : interruptVoiceInput}
            className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            {isInterrupted ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
            {isInterrupted ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}

      {error && <div className="fixed mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};

  export default VoiceInput;