'use client';

import { useLayoutEffect, useState } from 'react';
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
    ctaLabel,
    ctaUrl,
}: CaseStudyHeaderProps) => {
    const [animate, setAnimate] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useLayoutEffect(() => {
        setAnimate(true);
    }, []);

    useLayoutEffect(() => {
        if (!coverImage) return;
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.src = coverImage;
    }, [coverImage]);

    const parts = titleHighlight ? title.split(titleHighlight) : [title];

    const metaItems = [
        { label: 'Role', value: metaRole },
        { label: 'Tools', value: metaTools },
        { label: 'Duration', value: metaDuration },
        { label: 'Responses', value: metaResponses },
    ].filter(item => item.value);

    return (
        <div
            className="relative text-white px-4 sm:px-8 py-20 sm:py-28 bg-gray-900 dark:bg-zinc-950 bg-cover bg-center"
            style={coverImage && imageLoaded ? { backgroundImage: `url(${coverImage})` } : undefined}
        >
            {coverImage && imageLoaded && (
                <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
            )}
            {coverImage && !imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
                </div>
            )}
            <div className="relative z-10 max-w-5xl mx-auto">
                {tags?.length ? (
                    <div className={`flex flex-wrap gap-2 mb-6 opacity-0${animate ? ' animate-fadeInUp' : ''}`}>
                        {tags.map(tag => (
                            <span
                                key={tag}
                                className="rounded border border-zinc-600 px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold text-zinc-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}

                <h1 className={`text-6xl sm:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-4 opacity-0${animate ? ' animate-fadeInUp animate-delay-[75ms]' : ''}`}>
                    {titleHighlight ? (
                        <>
                            {parts[0]}
                            <em className="text-yellow-400 not-italic">{titleHighlight}</em>
                            {parts[1]}
                        </>
                    ) : (
                        title
                    )}
                </h1>

                {subtitle && (
                    <p className={`text-base sm:text-lg text-zinc-400 mt-3 mb-0 opacity-0${animate ? ' animate-fadeInUp animate-delay-[150ms]' : ''}`}>{subtitle}</p>
                )}

                {metaItems.length ? (
                    <dl className={`grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 mt-10 border-t border-zinc-700 pt-8 opacity-0${animate ? ' animate-fadeInUp animate-delay-[225ms]' : ''}`}>
                        {metaItems.map(item => (
                            <div key={item.label}>
                                <dt className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                                    {item.label}
                                </dt>
                                <dd className="text-sm text-zinc-200">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                ) : null}

                {ctaLabel && ctaUrl && (
                    <div className={`mt-8 opacity-0${animate ? ' animate-fadeInUp animate-delay-[300ms]' : ''}`}>
                        <Link
                            href={ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200"
                        >
                            <span>{ctaLabel}</span>
                            <ExternalLinkIcon size={14} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
