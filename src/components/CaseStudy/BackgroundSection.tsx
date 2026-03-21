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
        <section className="py-16 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto">
                {backgroundLabel && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-yellow-500 mb-3">
                        {backgroundLabel}
                    </p>
                )}
                {backgroundHeading && (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                        {backgroundHeading}
                    </h2>
                )}
                {backgroundBody && (
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-8 text-gray-600 dark:text-gray-300">
                        {backgroundBody.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                )}
                {stats?.length ? (
                    <div className="mt-8">
                        <StatsStrip stats={stats} />
                    </div>
                ) : null}
            </div>
        </section>
    );
};
