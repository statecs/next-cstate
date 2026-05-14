interface QuoteWallProps {
    quotes: CaseStudyQuote[];
}

export const QuoteWall = ({ quotes }: QuoteWallProps) => {
    if (!quotes?.length) return null;

    return (
        <section id="section-3" className="border-b border-zinc-900 dark:border-zinc-700 py-16 px-8 bg-[#F4F1EA] dark:bg-zinc-950">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 pt-1">
                    <span className="text-red-600 dark:text-red-500">§03</span>
                    {' · VOICES'}
                </div>
                <h2
                    className="font-serif leading-[0.94] tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                    style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                >
                    What they actually said.
                </h2>
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:text-right pt-1">
                    Verbatim · All modules
                </div>
            </div>

            {/* Quotes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-zinc-900 dark:border-zinc-700">
                {quotes.map((q, i) => {
                    const isLike = q.type === 'like';
                    const badgeCls = isLike
                        ? 'bg-zinc-900 text-[#F4F1EA] dark:bg-zinc-50 dark:text-zinc-900'
                        : 'bg-red-600 text-white dark:bg-red-500';
                    const isLastRow = i >= quotes.length - (quotes.length % 2 === 0 ? 2 : 1);
                    const isRightCol = i % 2 === 1;

                    return (
                        <article
                            key={i}
                            className={`p-6 ${isRightCol ? '' : 'border-r border-zinc-900 dark:border-zinc-700'} ${isLastRow ? '' : 'border-b border-zinc-900 dark:border-zinc-700'}`}
                        >
                            {/* Top row: ref + badge */}
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.08em]">
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
                                className="font-serif leading-snug text-zinc-900 dark:text-zinc-50 mb-6"
                                style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}
                            >
                                <span className="text-red-600 dark:text-red-500 italic">&ldquo;</span>
                                {q.text}
                                <span className="text-red-600 dark:text-red-500 italic">&rdquo;</span>
                            </p>

                            {/* Footer */}
                            <footer className="border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-3">
                                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
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
