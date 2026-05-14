interface ResultsListProps {
    resultsHeading?: string;
    resultsSummary?: string;
    resultsBullets?: string[];
}

export const ResultsList = ({ resultsHeading, resultsSummary, resultsBullets }: ResultsListProps) => {
    if (!resultsHeading && !resultsSummary && !resultsBullets?.length) return null;

    return (
        <section id="section-5" className="border-b border-zinc-900 dark:border-zinc-700 py-16 px-8 bg-[#F4F1EA] dark:bg-zinc-950">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 pt-1">
                    <span className="text-red-600 dark:text-red-500">§05</span>
                    {' · IMPACT'}
                </div>
                {resultsHeading && (
                    <h2
                        className="font-serif leading-[0.94] tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                        style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                    >
                        {resultsHeading}
                    </h2>
                )}
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:text-right pt-1" />
            </div>

            {/* Content */}
            <div className="max-w-[720px]">
                {resultsSummary && (
                    <p className="text-[17px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                        {resultsSummary}
                    </p>
                )}
                {resultsBullets?.length ? (
                    <ul className="space-y-0">
                        {resultsBullets.map((bullet, i) => (
                            <li
                                key={i}
                                className="grid grid-cols-[28px_1fr] items-baseline border-b border-dashed border-zinc-200 dark:border-zinc-700 py-3"
                            >
                                <span className="font-mono text-red-600 dark:text-red-500 text-sm">→</span>
                                <span className="text-[16px] text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                    {bullet}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </section>
    );
};
