interface MethodologyCardsProps {
    methodologyCards: CaseStudyMethodologyCard[];
}

export const MethodologyCards = ({ methodologyCards }: MethodologyCardsProps) => {
    if (!methodologyCards?.length) return null;

    return (
        <section id="section-4" className="border-b border-zinc-900 dark:border-zinc-700 py-16 px-8 bg-[#F4F1EA] dark:bg-zinc-950">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 pt-1">
                    <span className="text-red-600 dark:text-red-500">§04</span>
                    {' · APPROACH'}
                </div>
                <h2
                    className="font-serif leading-[0.94] tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                    style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                >
                    Methodology.
                </h2>
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:text-right pt-1" />
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-zinc-900 dark:border-zinc-700">
                {methodologyCards.map((card, i) => {
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    const totalRows = Math.ceil(methodologyCards.length / 3);
                    const isLastRow = row === totalRows - 1;
                    const isLastCol = col === 2 || i === methodologyCards.length - 1;

                    return (
                        <div
                            key={i}
                            className={`p-6 ${!isLastCol ? 'border-r border-zinc-900 dark:border-zinc-700' : ''} ${!isLastRow ? 'border-b border-zinc-900 dark:border-zinc-700' : ''}`}
                        >
                            {/* Head row */}
                            <div className="flex items-start justify-between mb-4">
                                <span
                                    className="font-serif leading-none tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                                    style={{ fontSize: '42px' }}
                                >
                                    <span className="text-red-600 dark:text-red-500">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500 mt-1">
                                    Phase
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-[26px] leading-tight tracking-[-0.015em] text-zinc-900 dark:text-zinc-50 mb-3">
                                {card.name}
                            </h3>

                            {/* Description */}
                            <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                {card.steps}
                            </p>

                            {/* Meta footer */}
                            <footer className="border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-3 flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
                                    Step {i + 1}/{methodologyCards.length}
                                </span>
                                {card.icon && (
                                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                                        {card.icon}
                                    </span>
                                )}
                            </footer>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
