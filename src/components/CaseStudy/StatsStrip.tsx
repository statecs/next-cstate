interface StatsStripProps {
    stats: CaseStudyStatItem[];
}

export const StatsStrip = ({ stats }: StatsStripProps) => {
    if (!stats?.length) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-[var(--aurora-line2)] mt-8 bg-[var(--aurora-bg2)]">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className={`p-5 ${i < stats.length - 1 ? 'border-r border-[var(--aurora-line2)]' : ''}`}
                >
                    <div
                        className="font-serif leading-none tracking-[-0.025em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
                    >
                        {stat.num}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mt-2.5 leading-snug">
                        {stat.desc}
                    </div>
                </div>
            ))}
        </div>
    );
};
