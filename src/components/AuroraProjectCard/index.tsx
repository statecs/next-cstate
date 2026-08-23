'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import ShimmerImage from '@/components/ShimmerImage';

export interface AuroraProjectCardProps {
    href: string;
    number: string;
    badge: string;
    badgeVariant?: 'default' | 'case-study' | 'writing';
    title: string;
    blurb?: string;
    tags?: string[];
    /** Already-formatted for display — the card only prints what it is handed. */
    dateLabel?: string;
    /** Cover image for the entry. Omitted, the card renders as a plain panel. */
    image?: string;
    /** Stagger for the reveal transition, e.g. `{'--reveal-delay': '120ms'}`. */
    style?: React.CSSProperties;
}

const AuroraProjectCard: React.FC<AuroraProjectCardProps> = ({
    href,
    number,
    badge,
    badgeVariant = 'default',
    title,
    blurb,
    tags = [],
    dateLabel,
    image,
    style,
}) => {
    const ref = useRef<HTMLAnchorElement>(null);

    const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
        if (
            document.documentElement.classList.contains('noanim') ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
        )
            return;
        el.style.setProperty('--rx', `${(((e.clientX - r.left) / r.width) - 0.5) * 7}deg`);
        el.style.setProperty('--ry', `${(0.5 - ((e.clientY - r.top) / r.height)) * 7}deg`);
    };

    const onLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
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
            style={style}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
        >
            {image && (
                <div className="media">
                    <ShimmerImage
                        src={image}
                        // Decorative: the title sits directly below, so naming
                        // the entry again only repeats it for a screen reader.
                        alt=""
                        fill
                        loading="lazy"
                        sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 380px"
                    />
                </div>
            )}
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
                {dateLabel && <span className="yr">{dateLabel}</span>}
            </div>
        </Link>
    );
};

export default AuroraProjectCard;
