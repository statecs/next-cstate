interface StatsStripProps {
    stats: CaseStudyStatItem[];
}

export const StatsStrip = ({ stats }: StatsStripProps) => {
    if (!stats?.length) return null;

    return (
        <div className="grid grid-cols-2 gap-x-7 content-start items-start">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className={`py-6 ${i >= 2 ? 'border-t border-[var(--aurora-line)]' : ''}`}
                >
                    <div
                        className="font-serif leading-none tracking-[-0.02em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(38px, 4.5vw, 58px)' }}
                    >
                        {stat.num}
                    </div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mt-2.5 leading-snug whitespace-pre-line">
                        {stat.desc}
                    </div>
                </div>
            ))}
        </div>
    );
};
