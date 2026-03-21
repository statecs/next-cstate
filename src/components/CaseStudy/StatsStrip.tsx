interface StatsStripProps {
    stats: CaseStudyStatItem[];
}

export const StatsStrip = ({ stats }: StatsStripProps) => {
    if (!stats?.length) return null;

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="rounded-xl bg-gray-50 dark:bg-zinc-800/60 p-4 text-center"
                >
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.num}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line leading-snug">
                        {stat.desc}
                    </div>
                </div>
            ))}
        </div>
    );
};
