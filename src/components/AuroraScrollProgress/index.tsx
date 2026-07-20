'use client';

import { useEffect, useRef } from 'react';

const AuroraScrollProgress: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bar = ref.current;
        if (!bar) return;
        let raf = 0;

        const update = () => {
            raf = 0;
            const doc = document.documentElement;
            const main = document.getElementById('main');
            const useMain = !!main && main.scrollHeight > main.clientHeight + 4;
            const top = useMain ? main!.scrollTop : window.scrollY || doc.scrollTop;
            const max = useMain
                ? main!.scrollHeight - main!.clientHeight
                : doc.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${max > 0 ? Math.min(top / max, 1) : 0})`;
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        // capture: the scroll container varies per route (#main or the window)
        addEventListener('scroll', onScroll, { capture: true, passive: true });
        addEventListener('resize', onScroll, { passive: true });
        update();

        return () => {
            cancelAnimationFrame(raf);
            removeEventListener('scroll', onScroll, true);
            removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div className="aurora-progress" aria-hidden="true">
            <div ref={ref} className="bar" />
        </div>
    );
};

export default AuroraScrollProgress;
