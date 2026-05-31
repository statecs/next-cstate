interface ResultsListProps {
    resultsHeading?: string;
    resultsSummary?: string;
    resultsBullets?: string[];
}

export const ResultsList = ({ resultsHeading, resultsSummary, resultsBullets }: ResultsListProps) => {
    if (!resultsHeading && !resultsSummary && !resultsBullets?.length) return null;

    return (
        <section id="section-5" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-[var(--aurora-line)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] pt-1">
                    <span className="text-[var(--aurora-peri)]">§05</span>
                    {' · IMPACT'}
                </div>
                {resultsHeading && (
                    <h2
                        className="font-serif leading-[0.94] tracking-[-0.025em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                    >
                        {resultsHeading}
                    </h2>
                )}
                <div className="font-mono text-[11px] text-[var(--aurora-faint)] sm:text-right pt-1" />
            </div>

            {/* Content */}
            <div className="max-w-[720px]">
                {resultsSummary && (
                    <p className="text-[17px] text-[var(--aurora-muted)] leading-relaxed mb-8">
                        {resultsSummary}
                    </p>
                )}
                {resultsBullets?.length ? (
                    <ul className="space-y-0">
                        {resultsBullets.map((bullet, i) => (
                            <li
                                key={i}
                                className="grid grid-cols-[28px_1fr] items-baseline border-b border-dashed border-[var(--aurora-line)] py-3"
                            >
                                <span className="font-mono text-[var(--aurora-peri)] text-sm">→</span>
                                <span className="text-[16px] text-[var(--aurora-text)] leading-relaxed">
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
