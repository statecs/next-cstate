interface StatsStripProps {
    stats: CaseStudyStatItem[];
}

export const StatsStrip = ({ stats }: StatsStripProps) => {
    if (!stats?.length) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-zinc-900 dark:border-zinc-700 mt-8 bg-[#EDE8DE] dark:bg-zinc-900">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className={`p-5 ${i < stats.length - 1 ? 'border-r border-zinc-900 dark:border-zinc-700' : ''}`}
                >
                    <div
                        className="font-serif leading-none tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                        style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
                    >
                        {stat.num}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400 mt-2.5 leading-snug">
                        {stat.desc}
                    </div>
                </div>
            ))}
        </div>
    );
};
