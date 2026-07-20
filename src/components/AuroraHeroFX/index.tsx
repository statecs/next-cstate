'use client';

import { useEffect } from 'react';

/**
 * Pointer FX for the hero: writes --par-x/--par-y (-1..1, lerped) for parallax
 * and --spot-x/--spot-y (px, hero-local) for the cursor spotlight onto .aurora-hero.
 */
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
        let sx = 0;
        let sy = 0;
        let stx = 0;
        let sty = 0;
        let raf = 0;

        const loop = () => {
            cx += (tx - cx) * 0.07;
            cy += (ty - cy) * 0.07;
            sx += (stx - sx) * 0.12;
            sy += (sty - sy) * 0.12;
            hero.style.setProperty('--par-x', cx.toFixed(4));
            hero.style.setProperty('--par-y', cy.toFixed(4));
            hero.style.setProperty('--spot-x', `${sx.toFixed(1)}px`);
            hero.style.setProperty('--spot-y', `${sy.toFixed(1)}px`);
            const settled =
                Math.abs(tx - cx) + Math.abs(ty - cy) < 0.002 &&
                Math.abs(stx - sx) + Math.abs(sty - sy) < 0.5;
            raf = settled ? 0 : requestAnimationFrame(loop);
        };

        const onMove = (e: PointerEvent) => {
            if (document.body.classList.contains('noanim')) return;
            tx = (e.clientX / innerWidth) * 2 - 1;
            ty = (e.clientY / innerHeight) * 2 - 1;
            const r = hero.getBoundingClientRect();
            stx = e.clientX - r.left;
            sty = e.clientY - r.top;
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
