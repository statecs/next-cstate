'use client';

import React from 'react';

const AuroraAskCta: React.FC = () => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const target = document.getElementById('ama');
        target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

        document.dispatchEvent(new CustomEvent('aurora:ask-show'));

        const focusDelay = reduce ? 0 : 600;
        window.setTimeout(() => {
            const input = document.getElementById('queryInput') as HTMLInputElement | null;
            input?.focus({ preventScroll: true });
        }, focusDelay);
    };

    return (
        <a
            href="#ama"
            className="aurora-btn"
            data-magnetic
            onClick={handleClick}
        >
            Ask me anything
        </a>
    );
};

export default AuroraAskCta;
