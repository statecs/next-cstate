import { StatsStrip } from './StatsStrip';

interface BackgroundSectionProps {
    backgroundLabel?: string;
    backgroundHeading?: string;
    backgroundBody?: string;
    stats?: CaseStudyStatItem[];
}

export const BackgroundSection = ({
    backgroundLabel,
    backgroundHeading,
    backgroundBody,
    stats,
}: BackgroundSectionProps) => {
    if (!backgroundLabel && !backgroundHeading && !backgroundBody && !stats?.length) return null;

    return (
        <section id="section-1" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* Section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 mb-11 items-end">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-faint)]">
                    <span className="text-[var(--aurora-peri)]">01</span>
                    {' · '}
                    {backgroundLabel || 'Background'}
                </div>
                {backgroundHeading && (
                    <h2
                        className="font-serif leading-[1.02] tracking-[-0.02em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(30px, 4.2vw, 54px)' }}
                    >
                        {backgroundHeading}
                    </h2>
                )}
            </div>

            <div className={`grid gap-16 ${stats?.length ? 'sm:grid-cols-[1.3fr_0.9fr]' : ''}`}>
                {/* Prose */}
                {backgroundBody && (
                    <div className="text-[17px] leading-[1.75] text-[var(--aurora-muted)] space-y-5 max-w-[60ch]">
                        {backgroundBody.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {stats?.length ? <StatsStrip stats={stats} /> : null}
            </div>
        </section>
    );
};
