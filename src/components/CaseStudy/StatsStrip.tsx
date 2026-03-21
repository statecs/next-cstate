interface StatsStripProps {
    stats: CaseStudyStatItem[];
}

export const StatsStrip = ({ stats }: StatsStripProps) => {
    if (!stats?.length) return null;

    return (
        <div className="flex flex-wrap bg-gray-100 dark:bg-zinc-900">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className={`flex-1 py-8 px-6 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-zinc-800 ${i < stats.length - 1 ? 'border-r border-gray-200 dark:border-zinc-800' : ''}`}
                >
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">{stat.num}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1 whitespace-pre-line leading-snug">
                        {stat.desc}
                    </div>
                </div>
            ))}
        </div>
    );
};
