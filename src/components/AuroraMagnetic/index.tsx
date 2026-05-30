'use client';

import { useEffect } from 'react';

const AuroraMagnetic: React.FC = () => {
    useEffect(() => {
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const bind = (el: HTMLElement) => {
            if ((el as any)._auroraMag) return;
            (el as any)._auroraMag = true;
            const onMove = (e: PointerEvent) => {
                if (document.body.classList.contains('noanim')) return;
                const r = el.getBoundingClientRect();
                const dx = (e.clientX - r.left - r.width / 2) * 0.25;
                const dy = (e.clientY - r.top - r.height / 2) * 0.3;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            };
            const onLeave = () => {
                el.style.transform = '';
            };
            el.addEventListener('pointermove', onMove);
            el.addEventListener('pointerleave', onLeave);
        };

        const scan = () => {
            document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(bind);
        };

        scan();
        const mo = new MutationObserver(scan);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            mo.disconnect();
        };
    }, []);

    return null;
};

export default AuroraMagnetic;
