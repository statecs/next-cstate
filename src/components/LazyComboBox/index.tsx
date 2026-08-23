'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SkelBar } from '@/components/Skeletons';

/**
 * The chat UI pulls in the thread service, voice input and speech playback —
 * the heaviest chunk on /home, sitting at the very bottom of the page. Loading
 * it on demand keeps that weight off the initial page load.
 */
const ComboBox = dynamic(() => import('@/components/ComboBox'), {
    ssr: false,
    loading: () => <Placeholder />,
});

const Placeholder = () => (
    <div className="w-full" aria-hidden="true">
        <SkelBar h={52} round />
    </div>
);

const LazyComboBox = () => {
    const [show, setShow] = useState(false);
    const host = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show) return;

        // The hero's "Ask me anything" button scrolls here and focuses the input
        // shortly after, so mount on its signal too rather than waiting for the
        // observer to catch up.
        const onAsk = () => setShow(true);
        document.addEventListener('aurora:ask-show', onAsk);

        const node = host.current;
        const io = node
            ? new IntersectionObserver(
                  entries => {
                      if (entries.some(e => e.isIntersecting)) setShow(true);
                  },
                  { rootMargin: '400px 0px' }
              )
            : null;

        if (node && io) io.observe(node);

        return () => {
            document.removeEventListener('aurora:ask-show', onAsk);
            io?.disconnect();
        };
    }, [show]);

    return (
        <div ref={host} style={{ minHeight: 64 }}>
            {show ? <ComboBox /> : <Placeholder />}
        </div>
    );
};

export default LazyComboBox;
