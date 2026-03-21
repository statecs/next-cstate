interface ResultsListProps {
    resultsHeading?: string;
    resultsSummary?: string;
    resultsBullets?: string[];
}

export const ResultsList = ({ resultsHeading, resultsSummary, resultsBullets }: ResultsListProps) => {
    if (!resultsHeading && !resultsSummary && !resultsBullets?.length) return null;

    return (
        <section className="py-12 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto">
                {resultsHeading && (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {resultsHeading}
                    </h2>
                )}
                {resultsSummary && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {resultsSummary}
                    </p>
                )}
                {resultsBullets?.length ? (
                    <ul className="space-y-3">
                        {resultsBullets.map((bullet, i) => (
                            <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-200">
                                <span className="mt-1 text-yellow-400 shrink-0">✦</span>
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </section>
    );
};
