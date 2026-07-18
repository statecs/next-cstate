'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

interface CaseStudyHeaderProps {
    title: string;
    titleHighlight?: string;
    subtitle?: string;
    tags?: string[];
    metaRole?: string;
    metaTools?: string;
    metaDuration?: string;
    metaResponses?: string;
    coverImage?: string;
    coverImageDescription?: string;
    slug?: string;
    ctaLabel?: string;
    ctaUrl?: string;
}

export const CaseStudyHeader = ({
    title,
    titleHighlight,
    subtitle,
    tags,
    metaRole,
    metaTools,
    metaDuration,
    metaResponses,
    coverImage,
    coverImageDescription,
    slug,
    ctaLabel,
    ctaUrl,
}: CaseStudyHeaderProps) => {
    const parts = titleHighlight ? title.split(titleHighlight) : [title];

    const metaItems = [
        { label: 'Role', value: metaRole },
        { label: 'Tools', value: metaTools },
        { label: 'Duration', value: metaDuration },
        { label: 'Responses', value: metaResponses },
    ].filter(item => item.value);

    const cta = ctaLabel && ctaUrl && (
        <Link
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--aurora-text)] text-[var(--aurora-bg)] text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap transition-transform duration-150 hover:-translate-y-px hover:opacity-90"
        >
            <span>{ctaLabel}</span>
            <ExternalLinkIcon size={14} />
        </Link>
    );

    return (
        <div>
            {/* Mobile hero — cover image as background with title overlaid */}
            {coverImage && (
                <div className="relative sm:hidden h-[55vw] min-h-[240px] max-h-[380px] overflow-hidden">
                    <Image
                        src={coverImage}
                        alt={coverImageDescription ?? title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <h1
                            className="font-serif leading-[0.88] tracking-[-0.04em] text-white"
                            style={{ fontSize: 'clamp(28px, 8vw, 52px)' }}
                        >
                            {titleHighlight ? (
                                <>
                                    {parts[0]}
                                    <em className="text-[var(--aurora-lav)]">{titleHighlight}</em>
                                    {parts[1]}
                                </>
                            ) : title}
                        </h1>
                    </div>
                </div>
            )}
            {coverImage && tags?.length ? (
                <div className="sm:hidden flex flex-wrap gap-2 px-5 pt-4">
                    {tags.slice(0, 4).map(tag => (
                        <span
                            key={tag}
                            className="font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-[var(--aurora-line2)] text-[var(--aurora-muted)]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}

            {/* Desktop editorial header — title/subtitle/tags above the image, like a magazine spread */}
            <div className={coverImage ? 'hidden sm:block' : ''}>
                <div className="px-8 pt-16 max-w-6xl mx-auto">
                    {/* Kicker row */}
                    <div className="aurora-mono hidden sm:flex items-center gap-2.5 mb-9">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--aurora-aqua)] shadow-[0_0_10px_var(--aurora-aqua)] inline-block" />
                        Case file · 01
                        {slug ? <span className="opacity-40"> — {slug}</span> : null}
                    </div>

                    {/* H1 */}
                    <h1
                        className="font-serif leading-[0.86] tracking-[-0.045em] text-[var(--aurora-text)] mb-6"
                        style={{ fontSize: 'clamp(48px, 10vw, 140px)' }}
                    >
                        {titleHighlight ? (
                            <>
                                {parts[0]}
                                <em className="text-[var(--aurora-lav)]">{titleHighlight}</em>
                                {parts[1]}
                            </>
                        ) : (
                            title
                        )}
                    </h1>

                    {/* Lede */}
                    {subtitle && (
                        <p
                            className="font-serif italic text-[var(--aurora-muted)] max-w-[640px] mb-7"
                            style={{ fontSize: 'clamp(18px, 2.2vw, 24px)' }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* Tags */}
                    {tags?.length ? (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.slice(0, 5).map((tag, i) => (
                                <span
                                    key={tag}
                                    className={
                                        i === 0
                                            ? 'font-mono text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-full bg-[var(--aurora-lav)] text-[var(--aurora-bg)] font-semibold'
                                            : 'font-mono text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-full border border-[var(--aurora-line2)] text-[var(--aurora-muted)]'
                                    }
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Cover image — desktop only, full-bleed within the wrap */}
            {coverImage && (
                <div className="max-w-6xl mx-auto hidden sm:block px-8 pt-9">
                    <div className="relative shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)]">
                        <div className="relative w-full aspect-[16/7.3] overflow-hidden">
                            <Image
                                src={coverImage}
                                alt={coverImageDescription ?? title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--aurora-bg)]/55 via-transparent to-transparent" />
                            {/* Corner marks */}
                            <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/60 pointer-events-none" />
                            <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/60 pointer-events-none" />
                            <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/60 pointer-events-none" />
                            <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/60 pointer-events-none" />
                            {coverImageDescription && (
                                <div className="absolute bottom-4 left-4 bg-zinc-900/80 text-white font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1">
                                    Fig. 01 — {coverImageDescription}
                                </div>
                            )}
                            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/50 uppercase tracking-[0.08em]">
                                {slug ?? 'CS'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Meta strip — single row under the image, CTA folded in to save vertical space */}
            {(metaItems.length > 0 || cta) && (
                <div className="max-w-6xl mx-auto px-8 py-6 hidden sm:flex items-center justify-between gap-6 flex-wrap border-b border-[var(--aurora-line2)]">
                    {metaItems.length > 0 && (
                        <dl className="flex items-baseline gap-7 flex-wrap">
                            {metaItems.map(item => (
                                <div key={item.label}>
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-faint)] mb-1">
                                        {item.label}
                                    </dt>
                                    <dd className="font-serif text-base text-[var(--aurora-text)]">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {cta}
                </div>
            )}

            {/* Mobile — meta list + CTA stacked below the hero */}
            {(metaItems.length > 0 || cta) && (
                <div className="sm:hidden px-5 py-6 border-b border-[var(--aurora-line2)] space-y-5">
                    {metaItems.length > 0 && (
                        <dl className="grid grid-cols-2 gap-4">
                            {metaItems.map(item => (
                                <div key={item.label}>
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-faint)] mb-1">
                                        {item.label}
                                    </dt>
                                    <dd className="font-serif text-base text-[var(--aurora-text)]">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {cta}
                </div>
            )}
        </div>
    );
};
