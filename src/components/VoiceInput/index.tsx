import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onVoiceInput: (input: string) => void;
  assistantId: string;
}

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

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, assistantId }) => {
  const [isListening, setIsListening] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }
    };
  }, []);
  

  const startListening = () => {
    setError(null);
    setIsListening(true);
    setDropdownVisible(true);
    
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition is not supported in this browser.");
      }
      
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          onVoiceInput(transcript);
          stopListening();
          await sendSpeechToSpeech(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
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

  const sendSpeechToSpeech = async (transcript: string) => {
    try {
      // Convert the transcript to an ArrayBuffer
      const encoder = new TextEncoder();
      const audioData = encoder.encode(transcript);

      // Convert ArrayBuffer to Base64
      const uint8Array = new Uint8Array(audioData);
      const numberArray = Array.from(uint8Array);
      const base64Audio = btoa(String.fromCharCode.apply(null, numberArray));
      
      const response = await fetch('https://api2.cstate.se/speech-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          threadId: 'thread_s3dkWqL2T4WwfTHTVL391fyD',
          assistantId: assistantId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to process speech-to-speech request: ${response.status}`);
      }
  
      if (response.status === 204) {
        console.log("No audio response received");
        return;
      }
      console.log(response);
  
      await streamAudio(response);
    } catch (error) {
      console.error('Error in speech-to-speech:', error);
      setError('Failed to process speech. Please try again.');
    }
  };

  const streamAudio = async (response: Response) => {
    const reader = response.body!.getReader();
    let chunks: Uint8Array[] = [];
    
    try {
      // Read all chunks and concatenate them into a single buffer
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        console.log("Raw audio chunk (encoded):", value);
        chunks.push(new Uint8Array(value)); // Collect chunks
      }
  
      // Concatenate all the chunks into one Uint8Array
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combinedBuffer = new Uint8Array(totalLength);
      let offset = 0;
  
      for (const chunk of chunks) {
        combinedBuffer.set(chunk, offset);
        offset += chunk.length;
      }
  
      console.log("Combined audio buffer length:", combinedBuffer.length);
  
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
  
      // Decode the combined buffer
      const audioBuffer = await audioContextRef.current.decodeAudioData(combinedBuffer.buffer);
      playAudioBuffer(audioBuffer);
      
    } catch (error) {
      console.error('Error decoding audio data:', error);
      setError('Failed to decode audio. Please try again.');
    }
  };
  
  
  
  const playAudioBuffer = (audioBuffer: AudioBuffer) => {
    if (audioContextRef.current) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();  // Ensure it is disconnected from destination
      }
      audioSourceRef.current = audioContextRef.current.createBufferSource();
      audioSourceRef.current.buffer = audioBuffer;
      audioSourceRef.current.connect(audioContextRef.current.destination);
      audioSourceRef.current.start();
      setIsPlaying(true);
      audioSourceRef.current.onended = () => {
        setIsPlaying(false);
        audioSourceRef.current = null;  // Clear the reference after playback ends
      };
    }
  };

  const handlePlayPause = async () => {
    if (audioContextRef.current && audioSourceRef.current) {
      if (isPlaying) {
        if (audioContextRef.current.state === 'running') {
          await audioContextRef.current.suspend();
        }
      } else {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className="-ml-32 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 cursor-pointer"
        aria-label={isListening ? "Stop listening" : "Start voice input"}
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
            Listening...
          </p>
        
        </div>
      )}
     
      {audioSourceRef.current && (
        <button
          onClick={handlePlayPause}
          className="mt-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          <Volume2 className="h-4 w-4 text-white" />
        </button>
      )}
        {error && (
            <div className="fixed mt-2 text-sm text-red-500">{error}</div>
          )}
    </div>
  );
};

export default VoiceInput;