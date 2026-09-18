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
  const rootRef = useRef<HTMLDivElement>(null);
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  // A modal in every sense: the page behind is inert to keyboard and screen
  // readers, Tab cycles within the dialog, focus lands on the dialog so its
  // name and status are announced, and goes back to the opener afterwards.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== root
    );
    const restore = siblings.map(el => ({ el, inert: el.inert, hidden: el.getAttribute('aria-hidden') }));
    siblings.forEach(el => {
      el.inert = true;
      el.setAttribute('aria-hidden', 'true');
    });

    root.focus({ preventScroll: true });

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(el => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEndRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    // Anything that still manages to focus outside (e.g. VoiceOver's cursor
    // on a browser without inert) is pulled back in.
    const onFocusIn = (e: FocusEvent) => {
      if (!root.contains(e.target as Node)) {
        e.stopPropagation();
        (focusables()[0] ?? root).focus();
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
      restore.forEach(({ el, inert, hidden }) => {
        el.inert = inert;
        if (hidden === null) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', hidden);
      });
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

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
          onClick={mode === 'speaking' ? onInterrupt : undefined}
          aria-disabled={mode !== 'speaking'}
          aria-label="Interrupt"
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
