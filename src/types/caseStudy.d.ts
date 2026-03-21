interface CaseStudyStatItem {
    num: string;
    desc: string;
}

interface CaseStudyChartData {
    labels: string[];
    data: number[];
}

interface CaseStudyQuote {
    text: string;
    type: 'like' | 'improve';
    label: string;
}

interface CaseStudyMethodologyCard {
    icon: string;
    name: string;
    steps: string;
}

interface CaseStudy {
    title: string;
    titleHighlight?: string;
    subtitle?: string;
    slug: string;
    tags?: string[];
    isPublic?: boolean;
    metaRole?: string;
    metaTools?: string;
    metaDuration?: string;
    metaResponses?: string;
    backgroundLabel?: string;
    backgroundHeading?: string;
    backgroundBody?: string;
    stats?: CaseStudyStatItem[];
    ratingDistributionData?: CaseStudyChartData;
    avgRatingPerModuleData?: CaseStudyChartData;
    responseVolumeData?: CaseStudyChartData;
    quotes?: CaseStudyQuote[];
    methodologyCards?: CaseStudyMethodologyCard[];
    resultsHeading?: string;
    resultsSummary?: string;
    resultsBullets?: string[];
    seoDescription?: string;
    coverImage?: {
        url: string;
        width: number;
        height: number;
        description?: string;
    };
    sys?: {
        publishedAt: string;
        firstPublishedAt: string;
    };
}
