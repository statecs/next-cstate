import React, { useState, useRef } from 'react';
import { Mic, X } from 'lucide-react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  start: () => void;
  stop: () => void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

const VoiceInput = ({ onVoiceInput }: { onVoiceInput: (input: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    setError(null);
    setIsListening(true);
    setDropdownVisible(true);
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition is not supported in this browser.");
      }
      
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onVoiceInput(transcript);
          stopListening();
        };

        recognitionRef.current.onerror = (event) => {
          setError(`Speech recognition error: ${event.error}`);
          stopListening();
        };
        
        recognitionRef.current.start();
      } else {
        throw new Error("Failed to initialize speech recognition.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      stopListening();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setDropdownVisible(false);
  };

  return (
    <div className="relative">
       <button
        onClick={dropdownVisible ? stopListening : startListening}
        className="-ml-32 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 cursor-pointer"
        aria-label={dropdownVisible ? "Stop listening" : "Start voice input"}
      >
         {dropdownVisible ? (
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
            Listening...
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;