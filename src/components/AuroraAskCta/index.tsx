'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import AuroraAskOverlay, { loadComboBox } from '@/components/AuroraAskOverlay';

interface AuroraAskCtaProps {
    /** Render as one segment of a joined pill instead of a standalone button. */
    segment?: boolean;
}

/**
 * iPhone Safari raises the keyboard only for a focus made inside the tap, but
 * the chat input mounts a moment later, after its code loads. Focus an
 * invisible stand-in input during the tap; moving focus on to the real input
 * then keeps the keyboard up.
 */
const focusStandIn = () => {
    const input = document.createElement('input');
    input.setAttribute('data-focus-proxy', '');
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    // 16px keeps Safari from zooming in on focus.
    input.style.cssText =
        'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;font-size:16px;pointer-events:none;';
    document.body.appendChild(input);
    input.focus({ preventScroll: true });
    return input;
};

/**
 * Opens the chat in a dialog over the hero. It stays a link to the chat section
 * so it still goes somewhere useful before the page has hydrated.
 */
const AuroraAskCta: React.FC<AuroraAskCtaProps> = ({ segment = false }) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const standIn = useRef<HTMLInputElement | null>(null);

    const dropStandIn = useCallback(() => {
        standIn.current?.remove();
        standIn.current = null;
    }, []);

    const close = useCallback(() => {
        dropStandIn();
        setOpen(false);
    }, [dropStandIn]);

    // The stand-in has done its job once focus lands anywhere else; the
    // timeout covers the chat failing to load.
    useEffect(() => {
        if (!open) return;
        const onFocusIn = (e: FocusEvent) => {
            if (e.target !== standIn.current) dropStandIn();
        };
        const t = window.setTimeout(dropStandIn, 6000);
        document.addEventListener('focusin', onFocusIn);
        return () => {
            document.removeEventListener('focusin', onFocusIn);
            window.clearTimeout(t);
            dropStandIn();
        };
    }, [open, dropStandIn]);

    // Start fetching the chat as soon as the pointer or focus is on the
    // button, so the dialog usually opens with the input already there.
    const warm = () => {
        loadComboBox().catch(() => { /* retried on open */ });
    };

    return (
        <>
            <a
                ref={buttonRef}
                href="#ama"
                className={segment ? 'aurora-btn aurora-btn-seg' : 'aurora-btn'}
                data-magnetic={segment ? undefined : ''}
                aria-haspopup="dialog"
                onPointerEnter={warm}
                onFocus={warm}
                onClick={e => {
                    e.preventDefault();
                    if (open) return;
                    standIn.current = focusStandIn();
                    setOpen(true);
                }}
            >
                Ask me anything
            </a>
            {open && <AuroraAskOverlay onClose={close} returnFocusTo={buttonRef.current} />}
        </>
    );
};

export default AuroraAskCta;
