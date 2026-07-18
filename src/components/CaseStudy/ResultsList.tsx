interface ResultsListProps {
    resultsHeading?: string;
    resultsSummary?: string;
    resultsBullets?: string[];
}

export const ResultsList = ({ resultsHeading, resultsSummary, resultsBullets }: ResultsListProps) => {
    if (!resultsHeading && !resultsSummary && !resultsBullets?.length) return null;

    return (
        <section id="section-5" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* Section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 mb-11 items-end">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-faint)]">
                    <span className="text-[var(--aurora-peri)]">05</span>
                    {' · Impact'}
                </div>
                {resultsHeading && (
                    <h2
                        className="font-serif leading-[1.02] tracking-[-0.02em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(30px, 4.2vw, 54px)' }}
                    >
                        {resultsHeading}
                    </h2>
                )}
            </div>

            <div className={`grid gap-16 ${resultsBullets?.length ? 'sm:grid-cols-[0.9fr_1.1fr]' : ''}`}>
                {resultsSummary && (
                    <p className="text-[17px] text-[var(--aurora-muted)] leading-[1.75] max-w-[50ch]">
                        {resultsSummary}
                    </p>
                )}

                {resultsBullets?.length ? (
                    <ul className="space-y-0">
                        {resultsBullets.map((bullet, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-4 py-[18px] border-b border-[var(--aurora-line)] last:border-b-0"
                            >
                                <span className="w-[26px] h-[26px] rounded-full bg-[color-mix(in_srgb,var(--aurora-aqua)_16%,transparent)] text-[var(--aurora-aqua)] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                    ✓
                                </span>
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
