'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

export interface AuroraProjectCardProps {
    href: string;
    number: string;
    badge: string;
    badgeVariant?: 'default' | 'case-study' | 'writing';
    title: string;
    blurb?: string;
    tags?: string[];
    year?: string | number;
}

const AuroraProjectCard: React.FC<AuroraProjectCardProps> = ({
    href,
    number,
    badge,
    badgeVariant = 'default',
    title,
    blurb,
    tags = [],
    year,
}) => {
    const ref = useRef<HTMLAnchorElement>(null);

    const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };

    const badgeClass =
        badgeVariant === 'case-study'
            ? 'aurora-badge cs'
            : badgeVariant === 'writing'
                ? 'aurora-badge writing'
                : 'aurora-badge';

    return (
        <Link
            ref={ref}
            href={href}
            className="aurora-card aurora-reveal"
            onPointerMove={onMove}
        >
            <div className="top">
                <span className="num">№ {number}</span>
                <span className={badgeClass}>{badge}</span>
            </div>
            <h3>{title}</h3>
            {blurb && <p className="blurb">{blurb}</p>}
            <div className="card-foot">
                {tags.length > 0 && (
                    <div className="tags">
                        {tags.slice(0, 4).map(t => (
                            <span key={t}>{t}</span>
                        ))}
                    </div>
                )}
                {year && <span className="yr">{year}</span>}
            </div>
        </Link>
    );
};

export default AuroraProjectCard;
