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
        <section id="section-1" className="border-b border-zinc-900 dark:border-zinc-700 py-16 px-8 bg-[#F4F1EA] dark:bg-zinc-950">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 pt-1">
                    <span className="text-red-600 dark:text-red-500">§01</span>
                    {backgroundLabel ? ` · ${backgroundLabel}` : ' · Background'}
                </div>
                {backgroundHeading && (
                    <h2
                        className="font-serif leading-[0.94] tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                        style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                    >
                        {backgroundHeading}
                    </h2>
                )}
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:text-right pt-1" />
            </div>

            {/* Prose */}
            {backgroundBody && (
                <div className="max-w-[720px] text-[17px] leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-4 mb-4">
                    {backgroundBody.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            )}

            {/* Stats */}
            {stats?.length ? <StatsStrip stats={stats} /> : null}
        </section>
    );
};
