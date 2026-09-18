'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, X } from 'lucide-react';
import VoiceOrb, { OrbMode } from './VoiceOrb';

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
}

const STATUS: Record<OrbMode, string> = {
  connecting: 'Connecting',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  paused: 'Muted',
  error: 'Something went wrong',
};

const HINT: Record<OrbMode, string> = {
  connecting: 'Setting up the microphone',
  listening: 'Go ahead — you can interrupt me at any time',
  thinking: '',
  speaking: 'Start talking, or tap the orb, to interrupt',
  paused: 'Unmute to keep talking',
  error: '',
};

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  mode, error, userText, assistantText, getMicLevel, getOutputLevel, onTogglePause, onInterrupt, onEnd,
}) => {
  const endRef = useRef<HTMLButtonElement>(null);
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  // Lock the page behind the session, hand focus to the controls, and give it
  // back to whatever opened the session when it closes.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    endRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEndRef.current();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  const caption = assistantText || userText;
  const captionIsUser = !assistantText && !!userText;

  return createPortal(
    <div className="aurora-voice" role="dialog" aria-modal="true" aria-label="Voice conversation">
      <div className="aurora-voice-stage">
        <button
          type="button"
          className="aurora-voice-orb-btn"
          onClick={onInterrupt}
          disabled={mode !== 'speaking'}
          aria-label="Interrupt"
        >
          <VoiceOrb mode={mode} getMicLevel={getMicLevel} getOutputLevel={getOutputLevel} />
        </button>
        <p className="aurora-voice-status" aria-live="polite">
          {error ?? STATUS[mode]}
        </p>
        <p className="aurora-voice-hint">{error ? 'Close and try again' : HINT[mode]}</p>
      </div>

      <div className="aurora-voice-caption" data-user={captionIsUser || undefined} aria-live="polite">
        {caption && <p>{caption}</p>}
      </div>

      <div className="aurora-voice-controls">
        <button
          type="button"
          onClick={onTogglePause}
          disabled={mode === 'connecting' || mode === 'error'}
          aria-pressed={mode === 'paused'}
          aria-label={mode === 'paused' ? 'Unmute microphone' : 'Mute microphone'}
        >
          {mode === 'paused' ? <MicOff /> : <Mic />}
        </button>
        <button
          ref={endRef}
          type="button"
          onClick={onEnd}
          className="aurora-voice-end"
          aria-label="End voice conversation"
        >
          <X />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default VoiceOverlay;
