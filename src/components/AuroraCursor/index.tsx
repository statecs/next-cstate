'use client';

import { useEffect, useRef } from 'react';

const AuroraCursor: React.FC = () => {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const coarse = matchMedia('(pointer:coarse)').matches;
        if (coarse) return;

        const ring = ringRef.current;
        const dot = dotRef.current;
        if (!ring || !dot) return;

        let rx = 0;
        let ry = 0;
        let px = 0;
        let py = 0;
        let raf = 0;

        const onMove = (e: PointerEvent) => {
            px = e.clientX;
            py = e.clientY;
        };

        const onOver = (e: PointerEvent) => {
            const t = e.target as Element | null;
            if (t && t.closest('a,button,input,textarea,.aurora-card,.aurora-chip')) {
                document.body.classList.add('aurora-hovering');
            }
        };
        const onOut = (e: PointerEvent) => {
            const t = e.target as Element | null;
            if (t && t.closest('a,button,input,textarea,.aurora-card,.aurora-chip')) {
                document.body.classList.remove('aurora-hovering');
            }
        };

        const loop = () => {
            rx += (px - rx) * 0.2;
            ry += (py - ry) * 0.2;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            dot.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
            raf = requestAnimationFrame(loop);
        };

        addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerover', onOver);
        document.addEventListener('pointerout', onOut);
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerover', onOver);
            document.removeEventListener('pointerout', onOut);
            document.body.classList.remove('aurora-hovering');
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className="aurora-cursor-ring" aria-hidden="true" />
            <div ref={dotRef} className="aurora-cursor-dot" aria-hidden="true" />
        </>
    );
};

export default AuroraCursor;
