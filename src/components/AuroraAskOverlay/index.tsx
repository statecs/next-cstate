'use client';

import { useEffect, useRef } from 'react';
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
interface Props {
    onClose: () => void;
    /** Where focus goes on close: the button that opened it. */
    returnFocusTo?: HTMLElement | null;
}

const AuroraAskOverlay: React.FC<Props> = ({ onClose, returnFocusTo }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    useModalDialog(rootRef, onClose, { returnFocusTo });

    // iPhone Safari shrinks its toolbar and raises the keyboard when the input
    // takes focus, but a fixed inset:0 layer keeps the old height, so the page
    // shows through below it. Track the visible viewport instead.
    useEffect(() => {
        const root = rootRef.current;
        const vv = window.visualViewport;
        if (!root || !vv) return;
        const sync = () => {
            root.style.setProperty('--ask-vv-top', `${vv.offsetTop}px`);
            root.style.setProperty('--ask-vv-height', `${vv.height}px`);
        };
        sync();
        vv.addEventListener('resize', sync);
        vv.addEventListener('scroll', sync);
        return () => {
            vv.removeEventListener('resize', sync);
            vv.removeEventListener('scroll', sync);
        };
    }, []);

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
