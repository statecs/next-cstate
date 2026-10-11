'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, X } from 'lucide-react';
import VoiceOrb, { OrbMode } from './VoiceOrb';
import { useModalDialog } from '@/hooks/useModalDialog';

interface VoiceOverlayProps {
  mode: OrbMode;
  error: string | null;
  userText: string;
  assistantText: string;
  getMicLevel: () => number;
  getOutputLevel: () => number;
  onTogglePause: () => void;
  onInterrupt: () => void;
  onEnd: () => void;
  /** Shown in the idle state (the /voice page) to begin a session. */
  onStart?: () => void;
}

const STATUS: Record<OrbMode, string> = {
  idle: 'Talk to me',
  connecting: 'Connecting',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  paused: 'Muted',
  error: 'Something went wrong',
};

const HINT: Record<OrbMode, string> = {
  idle: 'Tap the orb to start a live voice conversation',
  connecting: 'Setting up the microphone',
  listening: 'Go ahead — you can interrupt me at any time',
  thinking: '',
  speaking: 'Start talking, or tap the orb, to interrupt',
  paused: 'Unmute to keep talking',
  error: '',
};

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  mode, error, userText, assistantText, getMicLevel, getOutputLevel, onTogglePause, onInterrupt, onEnd, onStart,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  useModalDialog(rootRef, onEnd);

  const caption = assistantText || userText;
  const captionIsUser = !assistantText && !!userText;

  return createPortal(
    <div
      ref={rootRef}
      className="aurora-voice"
      role="dialog"
      aria-modal="true"
      aria-label="Voice conversation"
      aria-describedby="aurora-voice-status aurora-voice-hint"
      tabIndex={-1}
    >
      <div className="aurora-voice-stage">
        {/* Stays in the tab order while inactive (aria-disabled, not disabled)
            so focus isn't dropped when the assistant stops speaking. */}
        <button
          type="button"
          className="aurora-voice-orb-btn"
          onClick={mode === 'idle' ? onStart : mode === 'speaking' ? onInterrupt : undefined}
          aria-disabled={mode !== 'idle' && mode !== 'speaking'}
          aria-label={mode === 'idle' ? 'Start talking' : 'Interrupt'}
        >
          <VoiceOrb mode={mode} getMicLevel={getMicLevel} getOutputLevel={getOutputLevel} />
        </button>
        <p id="aurora-voice-status" className="aurora-voice-status" role="status" aria-live="polite">
          {error ?? STATUS[mode]}
        </p>
        <p id="aurora-voice-hint" className="aurora-voice-hint">{error ? 'Close and try again' : HINT[mode]}</p>
      </div>

      <div className="aurora-voice-caption" data-user={captionIsUser || undefined} aria-live="polite">
        {caption && <p>{caption}</p>}
      </div>

      <div className="aurora-voice-controls">
        {mode !== 'idle' && (
          <button
            type="button"
            onClick={onTogglePause}
            disabled={mode === 'connecting' || mode === 'error'}
            aria-pressed={mode === 'paused'}
            aria-label={mode === 'paused' ? 'Unmute microphone' : 'Mute microphone'}
          >
            {mode === 'paused' ? <MicOff /> : <Mic />}
          </button>
        )}
        <button
          type="button"
          onClick={onEnd}
          className="aurora-voice-end"
          aria-label={mode === 'idle' ? 'Close' : 'End voice conversation'}
        >
          <X />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default VoiceOverlay;
