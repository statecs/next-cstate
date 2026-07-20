'use client';

import { useEffect } from 'react';

/** Pointer parallax for the hero: writes --par-x/--par-y (-1..1, lerped) onto .aurora-hero. */
const AuroraHeroFX: React.FC = () => {
    useEffect(() => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (matchMedia('(pointer: coarse)').matches) return;
        const hero = document.querySelector<HTMLElement>('.aurora-hero');
        if (!hero) return;

        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        let raf = 0;

        const loop = () => {
            cx += (tx - cx) * 0.07;
            cy += (ty - cy) * 0.07;
            hero.style.setProperty('--par-x', cx.toFixed(4));
            hero.style.setProperty('--par-y', cy.toFixed(4));
            raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0;
        };

        const onMove = (e: PointerEvent) => {
            if (document.body.classList.contains('noanim')) return;
            tx = (e.clientX / innerWidth) * 2 - 1;
            ty = (e.clientY / innerHeight) * 2 - 1;
            if (!raf) raf = requestAnimationFrame(loop);
        };

        addEventListener('pointermove', onMove, { passive: true });
        return () => {
            removeEventListener('pointermove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return null;
};

export default AuroraHeroFX;
