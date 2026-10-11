'use client';

import React, { useCallback, useState } from 'react';
import AuroraAskOverlay, { loadComboBox } from '@/components/AuroraAskOverlay';

interface AuroraAskCtaProps {
    /** Render as one segment of a joined pill instead of a standalone button. */
    segment?: boolean;
}

/**
 * Opens the chat in a dialog over the hero. It stays a link to the chat section
 * so it still goes somewhere useful before the page has hydrated.
 */
const AuroraAskCta: React.FC<AuroraAskCtaProps> = ({ segment = false }) => {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);

    // Start fetching the chat as soon as the pointer or focus is on the
    // button, so the dialog usually opens with the input already there.
    const warm = () => {
        loadComboBox().catch(() => { /* retried on open */ });
    };

    return (
        <>
            <a
                href="#ama"
                className={segment ? 'aurora-btn aurora-btn-seg' : 'aurora-btn'}
                data-magnetic={segment ? undefined : ''}
                aria-haspopup="dialog"
                onPointerEnter={warm}
                onFocus={warm}
                onClick={e => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                Ask me anything
            </a>
            {open && <AuroraAskOverlay onClose={close} />}
        </>
    );
};

export default AuroraAskCta;
