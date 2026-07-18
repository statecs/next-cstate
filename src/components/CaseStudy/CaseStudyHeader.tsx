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

            {/* Desktop editorial header */}
            <div className={coverImage ? 'hidden sm:block' : ''}>
                <div className="px-8 pt-16 pb-12 border-b border-[var(--aurora-line2)]">
                    <div className="max-w-6xl mx-auto">
                        {/* Kicker row */}
                        <div className="aurora-mono hidden sm:flex items-center justify-between mb-10">
                            <span>
                                § 00
                                {' — Case file'}
                                {slug ? ` · ${slug}` : ''}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--aurora-lav)] inline-block" />
                                    Active
                                </span>
                                {tags?.length ? (
                                    <span className="hidden sm:flex items-center gap-2">
                                        {tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="border border-[var(--aurora-line2)] px-2 py-0.5 text-[10px]">
                                                {tag}
                                            </span>
                                        ))}
                                    </span>
                                ) : null}
                            </div>
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
                                className="font-serif text-[var(--aurora-muted)] max-w-[720px]"
                                style={{ fontSize: 'clamp(18px, 2.5vw, 26px)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Cover image — desktop only */}
            {coverImage && (
                <div className="max-w-6xl mx-auto hidden sm:block">
                    <div className="relative bg-[var(--aurora-bg2)] border-b border-[var(--aurora-line2)]">
                        <div className="relative w-full aspect-[16/7] overflow-hidden">
                            <Image
                                src={coverImage}
                                alt={coverImageDescription ?? title}
                                fill
                                className="object-cover opacity-90"
                                priority
                            />
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

            {/* Meta grid — CTA fills the trailing column on desktop to save vertical space */}
            {(metaItems.length > 0 || (ctaLabel && ctaUrl)) && (
                <div className="max-w-6xl mx-auto">
                    <dl className="grid grid-cols-2 sm:grid-cols-4 border-b border-[var(--aurora-line2)]">
                        {metaItems.map((item, i) => (
                            <div
                                key={item.label}
                                className={`p-6 ${
                                    i < metaItems.length - 1
                                        ? 'border-r border-[var(--aurora-line2)]'
                                        : ctaLabel && ctaUrl
                                            ? 'sm:border-r sm:border-[var(--aurora-line2)]'
                                            : ''
                                }`}
                            >
                                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] mb-2">
                                    {item.label}
                                </dt>
                                <dd className="font-serif text-lg leading-snug text-[var(--aurora-text)]">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                        {ctaLabel && ctaUrl && (
                            <div className="hidden sm:flex p-6 items-center">
                                <Link
                                    href={ctaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--aurora-line2)] text-[var(--aurora-text)] text-xs font-semibold uppercase tracking-widest hover:bg-[var(--aurora-text)] hover:text-[var(--aurora-bg)] transition-colors duration-200"
                                >
                                    <span>{ctaLabel}</span>
                                    <ExternalLinkIcon size={14} />
                                </Link>
                            </div>
                        )}
                    </dl>
                </div>
            )}

            {/* Mobile keeps the full-width CTA below the meta grid */}
            {ctaLabel && ctaUrl && (
                <div className="sm:hidden max-w-6xl mx-auto p-6">
                    <Link
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--aurora-line2)] text-[var(--aurora-text)] text-xs font-semibold uppercase tracking-widest hover:bg-[var(--aurora-text)] hover:text-[var(--aurora-bg)] transition-colors duration-200"
                    >
                        <span>{ctaLabel}</span>
                        <ExternalLinkIcon size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
};
