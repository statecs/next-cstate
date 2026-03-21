interface MethodologyCardsProps {
    methodologyCards: CaseStudyMethodologyCard[];
}

export const MethodologyCards = ({ methodologyCards }: MethodologyCardsProps) => {
    if (!methodologyCards?.length) return null;

    return (
        <section className="py-12 px-4 sm:px-8 bg-gray-50 dark:bg-zinc-900/50">
            <div className="max-w-5xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-500 mb-2">
                    APPROACH
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Methodology
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {methodologyCards.map((card, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700/50 dark:bg-zinc-800/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 hover:border-gray-300 dark:hover:border-zinc-600/70"
                        >
                            <div className="text-2xl mb-3">{card.icon}</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {card.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {card.steps}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
