'use client';

import { useLayoutEffect, useState } from 'react';

interface CaseStudyHeaderProps {
    title: string;
    titleHighlight?: string;
    subtitle?: string;
    tags?: string[];
    metaRole?: string;
    metaTools?: string;
    metaDuration?: string;
    metaResponses?: string;
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
}: CaseStudyHeaderProps) => {
    const [animate, setAnimate] = useState(false);

    useLayoutEffect(() => {
        setAnimate(true);
    }, []);

    const parts = titleHighlight ? title.split(titleHighlight) : [title];

    const metaItems = [
        { label: 'Role', value: metaRole },
        { label: 'Tools', value: metaTools },
        { label: 'Duration', value: metaDuration },
        { label: 'Responses', value: metaResponses },
    ].filter(item => item.value);

    return (
        <div className="bg-gray-900 dark:bg-zinc-950 text-white px-4 sm:px-8 py-20 sm:py-28">
            <div className="max-w-5xl mx-auto">
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
            </div>
        </div>
    );
};
