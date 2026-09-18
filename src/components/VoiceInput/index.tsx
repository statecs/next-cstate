'use client';

import React from 'react';
import { Mic } from 'lucide-react';
import VoiceOverlay from './VoiceOverlay';
import { useVoiceSession, VoiceSessionCallbacks } from './useVoiceSession';

type VoiceInputProps = Required<VoiceSessionCallbacks>;

const VoiceInput: React.FC<VoiceInputProps> = (callbacks) => {
  const session = useVoiceSession(callbacks);

  return (
    <div className="absolute right-12 bottom-3 md:bottom-1.5 md:bottom-2.5">
      <button
        type="button"
        onClick={session.start}
        className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 cursor-pointer"
        aria-label="Start a voice conversation"
      >
        <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
      </button>

      {session.mode !== 'idle' && (
        <VoiceOverlay
          mode={session.mode}
          error={session.error}
          userText={session.userText}
          assistantText={session.assistantText}
          getMicLevel={session.getMicLevel}
          getOutputLevel={session.getOutputLevel}
          onTogglePause={session.togglePause}
          onInterrupt={session.interrupt}
          onEnd={session.stop}
        />
      )}
    </div>
  );
};

export default VoiceInput;
