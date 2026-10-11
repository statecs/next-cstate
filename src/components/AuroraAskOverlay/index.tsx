'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { SkelBar } from '@/components/Skeletons';
import { useModalDialog } from '@/hooks/useModalDialog';

/** Same chunk as the chat at the bottom of the page, so it loads only once. */
export const loadComboBox = () => import('@/components/ComboBox');

const ComboBox = dynamic(loadComboBox, {
    ssr: false,
    loading: () => (
        <div className="w-full" aria-hidden="true">
            <SkelBar h={52} round />
        </div>
    ),
});

/**
 * The hero's "Ask me anything", as a dialog over the page rather than a scroll
 * to the chat at the bottom. It holds a second copy of the same chat, started
 * empty; an answer given here is also shown down there afterwards.
 */
const AuroraAskOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    useModalDialog(rootRef, onClose);

    return createPortal(
        <div
            ref={rootRef}
            className="aurora-ask"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aurora-ask-title"
            tabIndex={-1}
            // A click on the backdrop, not inside the card, closes it.
            onMouseDown={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="aurora-ama aurora-ask-card">
                <button type="button" className="aurora-ask-close" onClick={onClose} aria-label="Close">
                    <X aria-hidden="true" />
                </button>
                {/* The card holds the spinning border ring, so it stays put and
                    this inner part scrolls when an answer runs long. */}
                <div className="aurora-ask-body">
                    <span className="aurora-pill">
                        <span className="dot" aria-hidden="true" />
                        <span>AI Assistant</span>
                    </span>
                    <h2 id="aurora-ask-title">Ask Me Anything</h2>
                    <p>Have questions? Chat with my AI assistant, trained on my work and experience.</p>
                    <ComboBox inputId="aurora-ask-input" fresh />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AuroraAskOverlay;
