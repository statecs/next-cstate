interface QuoteWallProps {
    quotes: CaseStudyQuote[];
}

export const QuoteWall = ({ quotes }: QuoteWallProps) => {
    if (!quotes?.length) return null;

    return (
        <section id="section-3" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-[var(--aurora-line)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] pt-1">
                    <span className="text-[var(--aurora-peri)]">§03</span>
                    {' · VOICES'}
                </div>
                <h2
                    className="font-serif leading-[0.94] tracking-[-0.025em] text-[var(--aurora-text)]"
                    style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                >
                    What they actually said.
                </h2>
                <div className="font-mono text-[11px] text-[var(--aurora-faint)] sm:text-right pt-1">
                    Verbatim · All modules
                </div>
            </div>

            {/* Quotes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-[var(--aurora-line2)]">
                {quotes.map((q, i) => {
                    const isLike = q.type === 'like';
                    const badgeCls = isLike
                        ? 'bg-[var(--aurora-text)] text-[var(--aurora-bg)]'
                        : 'bg-[var(--aurora-peri)] text-[var(--aurora-bg)]';
                    const isLastRow = i >= quotes.length - (quotes.length % 2 === 0 ? 2 : 1);
                    const isRightCol = i % 2 === 1;

                    return (
                        <article
                            key={i}
                            className={`p-6 ${isRightCol ? '' : 'border-r border-[var(--aurora-line2)]'} ${isLastRow ? '' : 'border-b border-[var(--aurora-line2)]'}`}
                        >
                            {/* Top row: ref + badge */}
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-mono text-[10px] text-[var(--aurora-faint)] uppercase tracking-[0.08em]">
                                    #{String(i + 1).padStart(2, '0')}
                                </span>
                                {q.type && (
                                    <span className={`font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 ${badgeCls}`}>
                                        {q.type === 'like' ? 'Positive' : 'Improve'}
                                    </span>
                                )}
                            </div>

                            {/* Quote text */}
                            <p
                                className="font-serif leading-snug text-[var(--aurora-text)] mb-6"
                                style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}
                            >
                                <span className="text-[var(--aurora-peri)] italic">&ldquo;</span>
                                {q.text}
                                <span className="text-[var(--aurora-peri)] italic">&rdquo;</span>
                            </p>

                            {/* Footer */}
                            <footer className="border-t border-dashed border-[var(--aurora-line)] pt-3">
                                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--aurora-muted)]">
                                    {q.label}
                                </span>
                            </footer>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};
