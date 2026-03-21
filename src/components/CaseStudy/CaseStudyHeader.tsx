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
    const parts = titleHighlight ? title.split(titleHighlight) : [title];

    const metaItems = [
        { label: 'Role', value: metaRole },
        { label: 'Tools', value: metaTools },
        { label: 'Duration', value: metaDuration },
        { label: 'Responses', value: metaResponses },
    ].filter(item => item.value);

    return (
        <div className="bg-gray-900 dark:bg-zinc-950 text-white px-4 sm:px-8 py-16">
            <div className="max-w-3xl mx-auto">
                {tags?.length ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map(tag => (
                            <span
                                key={tag}
                                className="rounded-full border border-zinc-600 px-3 py-0.5 text-xs text-zinc-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}

                <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-4">
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
                    <p className="text-lg text-zinc-300 mb-8">{subtitle}</p>
                )}

                {metaItems.length ? (
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 mt-10 border-t border-zinc-700 pt-8">
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
