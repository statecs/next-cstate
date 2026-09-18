'use client';

import React from 'react';

/** How long to keep looking for the chat input, which mounts on demand. */
const FOCUS_WINDOW_MS = 4000;
const FOCUS_POLL_MS = 80;

interface AuroraAskCtaProps {
    /** Render as one segment of a joined pill instead of a standalone button. */
    segment?: boolean;
}

const AuroraAskCta: React.FC<AuroraAskCtaProps> = ({ segment = false }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';

        // Tell the timeline to stop paging and the chat panel to mount before
        // moving — rows landing above the target mid-scroll would drag it away.
        const announce = () => document.dispatchEvent(new CustomEvent('aurora:ask-show'));

        const reveal = () => {
            const el = document.getElementById('ama');
            if (!el) return;

            // Centre the card, unless it is tall enough that centring would
            // push its heading off the top.
            const scroller = el.closest('#main');
            const viewport = scroller ? scroller.clientHeight : window.innerHeight;
            const block: ScrollLogicalPosition = el.offsetHeight > viewport * 0.9 ? 'start' : 'center';

            el.scrollIntoView({ behavior, block });
        };

        announce();
        reveal();

        // The chat panel is code-split, so until it mounts the card is a
        // fraction of its final height and the page is too short to scroll it
        // into place — the first attempt clamps at the bottom. Wait for the
        // real input, then focus it and settle onto the final position.
        const deadline = Date.now() + FOCUS_WINDOW_MS;
        const settle = () => {
            const input = document.getElementById('queryInput') as HTMLInputElement | null;

            if (input) {
                input.focus({ preventScroll: true });
                // Re-announce so the timeline stays paused through this second
                // move, and let the focus-driven layout change flush first.
                announce();
                requestAnimationFrame(() => requestAnimationFrame(reveal));
                return;
            }

            if (Date.now() < deadline) window.setTimeout(settle, FOCUS_POLL_MS);
        };

        window.setTimeout(settle, reduce ? 0 : 350);
    };

    return (
        <a
            href="#ama"
            className={segment ? 'aurora-btn aurora-btn-seg' : 'aurora-btn'}
            data-magnetic={segment ? undefined : ''}
            onClick={handleClick}
        >
            Ask me anything
        </a>
    );
};

export default AuroraAskCta;
