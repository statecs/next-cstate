interface QuoteWallProps {
    quotes: CaseStudyQuote[];
}

export const QuoteWall = ({ quotes }: QuoteWallProps) => {
    if (!quotes?.length) return null;

    const likes = quotes.filter(q => q.type === 'like');
    const improvements = quotes.filter(q => q.type === 'improve');

    const renderGroup = (items: CaseStudyQuote[], label: string, accent: string) => {
        if (!items.length) return null;
        return (
            <div>
                <h3 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${accent}`}>
                    {label}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {items.map((q, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4"
                        >
                            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
                                &ldquo;{q.text}&rdquo;
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {q.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className="py-12 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto space-y-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Learner Feedback
                </h2>
                {renderGroup(likes, 'What they liked', 'text-green-500')}
                {renderGroup(improvements, 'What to improve', 'text-orange-400')}
            </div>
        </section>
    );
};
