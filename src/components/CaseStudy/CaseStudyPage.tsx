'use client';

import Link from 'next/link';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { BackgroundSection } from './BackgroundSection';
import { CaseStudyHeader } from './CaseStudyHeader';
import { ChartsSection } from './ChartsSection';
import { MethodologyCards } from './MethodologyCards';
import { QuoteWall } from './QuoteWall';
import { ResultsList } from './ResultsList';

interface CaseStudyPageProps {
    caseStudy: CaseStudy;
}

const TOC_ITEMS = [
    { label: 'Background', section: 1 },
    { label: 'Approach', section: 2 },
    { label: 'Data', section: 3 },
    { label: 'Voices', section: 4 },
    { label: 'Impact', section: 5 },
];

export const CaseStudyPage = ({ caseStudy }: CaseStudyPageProps) => {
    const filed = caseStudy.sys?.firstPublishedAt
        ? new Date(caseStudy.sys.firstPublishedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : null;
    const revised = caseStudy.sys?.publishedAt
        ? new Date(caseStudy.sys.publishedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : null;

    return (
        <ScrollArea useScrollAreaId>
            <div className="aurora-main min-h-screen pb-24">
                <FloatingHeader scrollTitle="Projects" goBackLink="/projects" />

                <CaseStudyHeader
                    title={caseStudy.title}
                    titleHighlight={caseStudy.titleHighlight}
                    subtitle={caseStudy.subtitle}
                    tags={caseStudy.tags}
                    metaRole={caseStudy.metaRole}
                    metaTools={caseStudy.metaTools}
                    metaDuration={caseStudy.metaDuration}
                    metaResponses={caseStudy.metaResponses}
                    coverImage={caseStudy.coverImage?.url}
                    coverImageDescription={caseStudy.coverImage?.description}
                    slug={caseStudy.slug}
                />

                <div className="max-w-6xl mx-auto">

                {/* Sticky TOC */}
                <nav className="sticky top-0 z-20 flex items-center overflow-x-auto bg-[var(--aurora-bg)]/90 backdrop-blur-md border-b border-[var(--aurora-line2)] font-mono text-[11px] uppercase tracking-[0.1em]">
                    {TOC_ITEMS.map((item) => (
                        <a
                            key={item.section}
                            href={`#section-${item.section}`}
                            className="px-4 py-3 border-r border-[var(--aurora-line2)] whitespace-nowrap text-[var(--aurora-muted)] hover:text-[var(--aurora-text)] transition-colors"
                        >
                            <span className="text-[var(--aurora-peri)] mr-2">§0{item.section}</span>
                            {item.label}
                        </a>
                    ))}
                </nav>

                <BackgroundSection
                    backgroundLabel={caseStudy.backgroundLabel}
                    backgroundHeading={caseStudy.backgroundHeading}
                    backgroundBody={caseStudy.backgroundBody}
                    stats={caseStudy.stats}
                />

                {caseStudy.methodologyCards?.length ? (
                    <MethodologyCards methodologyCards={caseStudy.methodologyCards} />
                ) : null}

                {(caseStudy.ratingDistributionData ||
                    caseStudy.avgRatingPerModuleData ||
                    caseStudy.responseVolumeData) && (
                    <ChartsSection
                        ratingDistributionData={caseStudy.ratingDistributionData}
                        avgRatingPerModuleData={caseStudy.avgRatingPerModuleData}
                        responseVolumeData={caseStudy.responseVolumeData}
                        metaResponses={caseStudy.metaResponses}
                    />
                )}

                {caseStudy.quotes?.length ? <QuoteWall quotes={caseStudy.quotes} /> : null}

                {(caseStudy.resultsHeading ||
                    caseStudy.resultsSummary ||
                    caseStudy.resultsBullets?.length) ? (
                    <ResultsList
                        resultsHeading={caseStudy.resultsHeading}
                        resultsSummary={caseStudy.resultsSummary}
                        resultsBullets={caseStudy.resultsBullets}
                    />
                ) : null}

                {/* Colophon */}
                <div className="border-b border-[var(--aurora-line2)] p-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-10 items-end">
                    <div>
                        <div
                            className="font-serif leading-[0.95] tracking-[-0.03em] text-[var(--aurora-text)] mb-6"
                            style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}
                        >
                            End of file —<br />
                            <em className="text-[var(--aurora-peri)] not-italic">everything passes,</em>{' '}
                            eventually.
                        </div>
                        <Link
                            href="/projects"
                            className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] hover:text-[var(--aurora-text)] transition-colors border-b border-[var(--aurora-line2)] pb-0.5"
                        >
                            ← Back to all projects
                        </Link>
                    </div>
                    <aside className="font-mono text-[11px] tracking-[0.04em] text-[var(--aurora-faint)] flex gap-8 sm:flex-col sm:gap-3 sm:text-right">
                        {filed && (
                            <div>
                                <div className="uppercase tracking-[0.1em] text-[10px] mb-0.5">Filed</div>
                                <div className="text-[var(--aurora-muted)]">{filed}</div>
                            </div>
                        )}
                        {revised && (
                            <div>
                                <div className="uppercase tracking-[0.1em] text-[10px] mb-0.5">Revised</div>
                                <div className="text-[var(--aurora-muted)]">{revised}</div>
                            </div>
                        )}
                        {caseStudy.slug && (
                            <div>
                                <div className="uppercase tracking-[0.1em] text-[10px] mb-0.5">Ref</div>
                                <div className="text-[var(--aurora-text)]">{caseStudy.slug}</div>
                            </div>
                        )}
                    </aside>
                </div>
                </div>
            </div>
        </ScrollArea>
    );
};
