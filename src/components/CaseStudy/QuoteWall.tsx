interface QuoteWallProps {
    quotes: CaseStudyQuote[];
}

export const QuoteWall = ({ quotes }: QuoteWallProps) => {
    if (!quotes?.length) return null;

    return (
        <section className="py-12 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-500 mb-2">
                    QUALITATIVE FEEDBACK
                </p>
                <h2 className="text-3xl font-bold text-white mb-2">Voice of the learner</h2>
                <p className="text-sm text-zinc-500 mb-8">
                    Selected verbatim comments from learners across all modules.
                </p>
                <div className="flex flex-wrap gap-3">
                    {quotes.map((q, i) => {
                        const isLike = q.type === 'like';
                        const chipBg = isLike ? 'bg-green-900/60 text-green-400' : 'bg-orange-900/60 text-orange-400';
                        return (
                            <div
                                key={i}
                                className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-4 w-full sm:w-[calc(50%-0.375rem)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 hover:border-zinc-600/70"
                            >
                                <p className="text-xs text-zinc-600 font-mono mb-2">#{i + 1}</p>
                                <p className="text-sm text-gray-200 leading-relaxed mb-3">
                                    &ldquo;{q.text}&rdquo;
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">{q.label}</span>
                                    {q.type && (
                                        <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded ${chipBg}`}>
                                            {q.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
