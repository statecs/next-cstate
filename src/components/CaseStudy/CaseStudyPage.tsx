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

export const CaseStudyPage = ({ caseStudy }: CaseStudyPageProps) => {
    return (
        <ScrollArea useScrollAreaId>
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
            />
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
        </ScrollArea>
    );
};
