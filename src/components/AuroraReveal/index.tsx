'use client';

import { useEffect } from 'react';

const AuroraReveal: React.FC = () => {
    useEffect(() => {
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const noanim = document.body.classList.contains('noanim');

        if (reduce || noanim) {
            document.querySelectorAll('.aurora-reveal').forEach(el => el.classList.add('in'));
            return;
        }

        const io = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        const observe = () => {
            document.querySelectorAll('.aurora-reveal:not(.in)').forEach(el => io.observe(el));
        };

        observe();
        const mo = new MutationObserver(() => observe());
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, []);

    return null;
};

export default AuroraReveal;
