interface MethodologyCardsProps {
    methodologyCards: CaseStudyMethodologyCard[];
}

export const MethodologyCards = ({ methodologyCards }: MethodologyCardsProps) => {
    if (!methodologyCards?.length) return null;

    return (
        <section id="section-2" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* Section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 mb-14 items-end">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-faint)]">
                    <span className="text-[var(--aurora-peri)]">02</span>
                    {' · Approach'}
                </div>
                <h2
                    className="font-serif leading-[1.02] tracking-[-0.02em] text-[var(--aurora-text)]"
                    style={{ fontSize: 'clamp(30px, 4.2vw, 54px)' }}
                >
                    Methodology.
                </h2>
            </div>

            {/* Connected timeline — reads as a process, not a spec table */}
            <div className="flex flex-col sm:flex-row">
                {methodologyCards.map((card, i) => (
                    <div
                        key={i}
                        className={`relative flex-1 pr-7 ${
                            i > 0 ? 'mt-9 pt-9 border-t border-dashed border-[var(--aurora-line)] sm:mt-0 sm:pt-0 sm:border-t-0 sm:border-l sm:border-dashed sm:border-[var(--aurora-line)] sm:pl-7' : ''
                        }`}
                    >
                        {i < methodologyCards.length - 1 && (
                            <span
                                className="hidden sm:block absolute top-6 left-0 right-0 h-px"
                                style={{
                                    background:
                                        'repeating-linear-gradient(90deg, var(--aurora-line2) 0 6px, transparent 6px 12px)',
                                }}
                            />
                        )}
                        <div className="w-12 h-12 rounded-full border border-[var(--aurora-line2)] bg-[var(--aurora-bg2)] flex items-center justify-center font-serif text-lg text-[var(--aurora-peri)] mb-7 relative z-10">
                            {card.icon || String(i + 1).padStart(2, '0')}
                        </div>
                        <h3 className="font-serif text-[23px] leading-tight tracking-[-0.01em] text-[var(--aurora-text)] mb-2.5">
                            {card.name}
                        </h3>
                        <p className="text-[14px] text-[var(--aurora-muted)] leading-relaxed">
                            {card.steps}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
