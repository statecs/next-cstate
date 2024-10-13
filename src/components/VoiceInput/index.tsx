import React, { useState, useRef, useEffect } from 'react';
import { Mic, X } from 'lucide-react';
import { useAudioBufferManager } from '../../hooks/useAudioBufferManager';

interface VoiceInputProps {
  onVoiceInput: (input: string) => void;
  assistantId: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, assistantId }) => {
  const [isListening, setIsListening] = useState(false);
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

  const startListening = async () => {
    setError(null);
    setIsListening(true);
    setDropdownVisible(true);

    try {
      socketRef.current = new WebSocket('wss://api2.cstate.se/audio-stream');
      socketRef.current.binaryType = 'arraybuffer';

      socketRef.current.onopen = async () => {
        console.log('WebSocket connection opened');
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const source = audioContext.createMediaStreamSource(mediaStreamRef.current);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          const audioData = e.inputBuffer.getChannelData(0);
          const int16Data = floatTo16BitPCM(audioData);
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(int16Data);
          }
        };
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
          console.error('Received non-binary data from WebSocket');
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

  const stopListening = () => {
    setDropdownVisible(false);
    setIsListening(false);
    stopAudio();

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
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
              <animate
                attributeName="stroke-dashoffset"
                from="251.2"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {isPlaying ? 'Playing...' : 'Listening...'}
          </p>
        </div>
      )}

      {error && <div className="fixed mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default VoiceInput;