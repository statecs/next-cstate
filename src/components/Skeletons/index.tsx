import React from 'react';

/**
 * Route-level loading placeholders. Each one mirrors the layout of the page it
 * stands in for, so content lands where the skeleton was instead of snapping in
 * over a blank screen. Shimmer + reduced-motion handling live on `.aurora-skel`.
 */

interface BarProps {
    w?: number | string;
    h?: number | string;
    className?: string;
    round?: boolean;
}

/** One shimmering placeholder bar. */
export const SkelBar = ({ w = '100%', h = 14, className = '', round }: BarProps) => (
    <div
        className={`aurora-skel ${className}`}
        // radius inline: .aurora-skel's own border-radius would win over a utility class
        style={{ width: w, height: h, ...(round ? { borderRadius: 999 } : null) }}
    />
);

const PageHead = ({ eyebrow = 200, lines = [520, 340] }: { eyebrow?: number; lines?: number[] }) => (
    <div className="aurora-page-head">
        <SkelBar w={eyebrow} h={11} className="mb-[18px] max-w-full" />
        {lines.map((w, i) => (
            <SkelBar key={i} w={w} h="clamp(38px,7vw,72px)" className="mb-3 max-w-full" />
        ))}
    </div>
);

/** Card grid used by the projects and writing indexes. */
export const CardGridSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="aurora-grid" style={{ paddingBottom: 'clamp(60px,10vh,120px)' }}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="aurora-skel" style={{ height: 210, borderRadius: 'var(--aurora-r, 18px)' }} />
        ))}
    </div>
);

/** /projects and /writing — index of entries. `filters` matches the chip row. */
export const IndexSkeleton = ({ filters = true }: { filters?: boolean }) => (
    <div className="aurora-main aurora-page-shell" aria-busy="true" aria-label="Loading">
        <div className="aurora-wrap">
            <PageHead />
            {filters && (
                <>
                    <div className="flex flex-wrap gap-2.5 py-5">
                        {[120, 104, 88, 96, 112].map((w, i) => (
                            <SkelBar key={i} w={w} h={34} round />
                        ))}
                    </div>
                    <div className="flex justify-between py-4">
                        <SkelBar w={180} h={11} />
                        <SkelBar w={120} h={11} />
                    </div>
                </>
            )}
            <div className={filters ? '' : 'pt-8'}>
                <CardGridSkeleton />
            </div>
        </div>
    </div>
);

/** Journey rows on their own — used as the timeline's Suspense fallback. */
export const TimelineSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className="space-y-9">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="grid grid-cols-[56px_1fr] sm:grid-cols-[90px_1fr] gap-4 sm:gap-8">
                <SkelBar h={13} />
                <div className="space-y-3">
                    <SkelBar w="55%" h={20} />
                    <SkelBar w="90%" h={13} />
                    <SkelBar w="72%" h={13} />
                </div>
            </div>
        ))}
    </div>
);

/** /about — bio + side card, then the journey timeline. */
export const AboutSkeleton = () => (
    <div className="aurora-main aurora-page-shell" aria-busy="true" aria-label="Loading">
        <div className="aurora-wrap">
            <PageHead eyebrow={220} lines={[560, 460, 380]} />

            <div className="aurora-about-grid">
                <div className="space-y-3.5">
                    {[100, 96, 92, 70, 94, 88, 60].map((w, i) => (
                        <SkelBar key={i} w={`${w}%`} h={15} />
                    ))}
                </div>
                <div className="aurora-skel" style={{ height: 260, borderRadius: 20 }} />
            </div>

            <div style={{ padding: 'clamp(40px,8vh,90px) 0' }}>
                <div className="flex items-baseline justify-between mb-8">
                    <SkelBar w={160} h={30} />
                    <SkelBar w={110} h={11} />
                </div>
                <TimelineSkeleton />
            </div>
        </div>
    </div>
);

/** /home — centred hero, then the ask-me-anything card. */
export const HomeSkeleton = () => (
    <div className="aurora-main" aria-busy="true" aria-label="Loading">
        <section className="aurora-hero">
            <div className="aurora-hero-inner flex flex-col items-center gap-5">
                <SkelBar w="min(70vw, 560px)" h="clamp(48px,9vw,96px)" />
                <SkelBar w="min(52vw, 420px)" h="clamp(48px,9vw,96px)" />
                <SkelBar w="min(60vw, 460px)" h={18} className="mt-2" />
                <div className="flex gap-3 mt-4">
                    <SkelBar w={168} h={48} round />
                    <SkelBar w={148} h={48} round />
                </div>
            </div>
        </section>

        <section className="aurora-block">
            <div className="aurora-wrap">
                <div className="flex items-baseline justify-between mb-8">
                    <SkelBar w={210} h={28} />
                    <SkelBar w={130} h={11} />
                </div>
                <div className="flex gap-10 overflow-hidden">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <SkelBar key={i} w={110} h={30} />
                    ))}
                </div>
            </div>
        </section>

        <section className="aurora-block">
            <div className="aurora-wrap">
                <div className="aurora-skel" style={{ height: 340, borderRadius: 28 }} />
            </div>
        </section>
    </div>
);

export { CaseStudySkeleton as EntrySkeleton } from '@/components/CaseStudy/CaseStudySkeleton';
