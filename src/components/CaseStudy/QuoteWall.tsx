interface QuoteWallProps {
    quotes: CaseStudyQuote[];
}

export const QuoteWall = ({ quotes }: QuoteWallProps) => {
    if (!quotes?.length) return null;

    return (
        <section id="section-4" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* Section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 mb-11 items-end">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-faint)]">
                    <span className="text-[var(--aurora-peri)]">04</span>
                    {' · Voices'}
                </div>
                <h2
                    className="font-serif leading-[1.02] tracking-[-0.02em] text-[var(--aurora-text)]"
                    style={{ fontSize: 'clamp(30px, 4.2vw, 54px)' }}
                >
                    What they actually said.
                </h2>
            </div>

            {/* Asymmetric quote wall */}
            <div className="columns-1 sm:columns-2 gap-8">
                {quotes.map((q, i) => {
                    const isLike = q.type === 'like';
                    return (
                        <article
                            key={i}
                            className="break-inside-avoid mb-8 py-1 pl-6"
                            style={{
                                borderLeft: `2px solid ${isLike ? 'var(--aurora-lav)' : 'var(--aurora-peri)'}`,
                            }}
                        >
                            <span
                                className="block font-serif leading-none mb-1"
                                style={{
                                    fontSize: '52px',
                                    color: isLike
                                        ? 'color-mix(in srgb, var(--aurora-lav) 45%, transparent)'
                                        : 'color-mix(in srgb, var(--aurora-peri) 45%, transparent)',
                                }}
                            >
                                &ldquo;
                            </span>
                            <p
                                className="font-serif leading-snug text-[var(--aurora-text)] mb-4"
                                style={{ fontSize: 'clamp(18px, 2.1vw, 23px)' }}
                            >
                                {q.text}
                            </p>
                            <footer className="flex items-center gap-2.5">
                                {q.type && (
                                    <span
                                        className="font-mono text-[9px] uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                                        style={{
                                            color: isLike ? 'var(--aurora-lav)' : 'var(--aurora-peri)',
                                            background: isLike
                                                ? 'color-mix(in srgb, var(--aurora-lav) 16%, transparent)'
                                                : 'color-mix(in srgb, var(--aurora-peri) 16%, transparent)',
                                        }}
                                    >
                                        {isLike ? 'Positive' : 'Improve'}
                                    </span>
                                )}
                                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--aurora-faint)]">
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
