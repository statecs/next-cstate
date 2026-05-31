'use client';

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
    { label: 'Data', section: 2 },
    { label: 'Voices', section: 3 },
    { label: 'Approach', section: 4 },
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
                <nav className="sticky top-0 z-20 flex items-center overflow-x-auto bg-[var(--aurora-bg)] border-b border-[var(--aurora-line2)] font-mono text-[11px] uppercase tracking-[0.1em]">
                    {TOC_ITEMS.map((item) => (
                        <a
                            key={item.section}
                            href={`#section-${item.section}`}
                            className="px-4 py-3 border-r border-[var(--aurora-line2)] whitespace-nowrap text-[var(--aurora-muted)] hover:text-[var(--aurora-text)] transition-colors"
                        >
                            <span className="text-red-500 mr-2">§0{item.section}</span>
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

                {caseStudy.methodologyCards?.length ? (
                    <MethodologyCards methodologyCards={caseStudy.methodologyCards} />
                ) : null}

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
                <div className="border-b border-[var(--aurora-line2)] p-8 grid grid-cols-1 sm:grid-cols-[1fr_320px] gap-10 bg-[var(--aurora-bg)]">
                    <div
                        className="font-serif leading-[0.95] tracking-[-0.03em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(46px, 6vw, 88px)' }}
                    >
                        End of file —<br />
                        <em className="text-red-500 not-italic">everything passes,</em><br />
                        eventually.
                    </div>
                    <aside className="font-mono text-[11px] tracking-[0.04em] text-[var(--aurora-muted)] border border-[var(--aurora-line2)] p-5 self-start space-y-3">
                        {filed && (
                            <div>
                                <div className="uppercase tracking-[0.1em] text-[10px] text-[var(--aurora-faint)] mb-0.5">Filed</div>
                                <div>{filed}</div>
                            </div>
                        )}
                        {revised && (
                            <div>
                                <div className="uppercase tracking-[0.1em] text-[10px] text-[var(--aurora-faint)] mb-0.5">Revised</div>
                                <div>{revised}</div>
                            </div>
                        )}
                        {caseStudy.slug && (
                            <div>
                                <div className="uppercase tracking-[0.1em] text-[10px] text-[var(--aurora-faint)] mb-0.5">Ref</div>
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
