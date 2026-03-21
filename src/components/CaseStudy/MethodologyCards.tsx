interface MethodologyCardsProps {
    methodologyCards: CaseStudyMethodologyCard[];
}

export const MethodologyCards = ({ methodologyCards }: MethodologyCardsProps) => {
    if (!methodologyCards?.length) return null;

    return (
        <section className="py-12 px-4 sm:px-8 bg-gray-50 dark:bg-zinc-900/50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Methodology
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {methodologyCards.map((card, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5"
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
