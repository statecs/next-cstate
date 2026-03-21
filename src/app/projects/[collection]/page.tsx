import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import BannerPhotoCollection from '@/components/BannerPhotoCollection';
import config from '@/utils/config';
import {fetchAllCollections, fetchAllCaseStudies, fetchCaseStudy, fetchCollection} from '@/utils/contentful';
import {getCollectionSeo} from '@/utils/helpers';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CaseStudyPage } from '@/components/CaseStudy/CaseStudyPage';
import { CaseStudyHeader } from '@/components/CaseStudy/CaseStudyHeader';

export const dynamic = 'force-dynamic';

interface Props {
    params: {collection: string};
}

const CollectionPage = async ({params}: Props) => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const { isAuthenticated } = getKindeServerSession();
    const authStatus = await isAuthenticated();

    const collection = await fetchCollection(params.collection, isDraftModeEnabled);

    if (!collection) {
        const caseStudy = await fetchCaseStudy(params.collection, isDraftModeEnabled);
        if (!caseStudy) return notFound();

        if (caseStudy.isPublic === false && !authStatus) {
            const baseUrl = process.env.NEXT_PUBLIC_URL;
            redirect(`${baseUrl}/api/auth/login?post_login_redirect_url=${baseUrl}/projects`);
        }

        return <CaseStudyPage caseStudy={caseStudy} />;
    }

    if (collection?.isPublic == false && !authStatus) {
        const baseUrl = process.env.NEXT_PUBLIC_URL;
        redirect(`${baseUrl}/api/auth/login?post_login_redirect_url=${baseUrl}/projects`);
    }

    if (collection.coverImage) {
        return (
            <ScrollArea useScrollAreaId>
                <FloatingHeader scrollTitle="Projects" goBackLink="/projects" />
                <CaseStudyHeader
                    title={collection.title}
                    titleHighlight={collection.titleHighlight}
                    subtitle={collection.subtitle}
                    tags={collection.category?.split(',').map(t => t.trim())}
                    metaRole={collection.metaRole}
                    metaTools={collection.metaTools}
                    metaDuration={collection.metaDuration}
                    coverImage={collection.coverImage.url}
                    ctaLabel={collection.ctaLabel}
                    ctaUrl={collection.ctaUrl}
                />
                <div className="min-h-screen pb-24">
                    <div className="max-w-3xl mx-auto px-6 py-12">
                        <PageHeader
                            description={collection?.showDescription ? collection.description : null}
                        />
                    </div>
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Projects" goBackLink="/projects"></FloatingHeader>
        <div className="flex flex-grow py-8 px-4 sm:px-8 md:justify-center">
            <div className="flex flex-col space-y-8 w-full">
                <div className="max-w-5xl mx-auto w-full">
                    {/* Banner Photo Collection */}
                    <BannerPhotoCollection {...collection} key={collection.slug} />

                    {/* Page Header below banner */}
                    <div className={params.collection === 'home' ? 'md:hidden' : ''}>
                        <div className="rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                            <PageHeader
                                {...collection}
                                description={collection?.showDescription ? collection.description : null}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ScrollArea>
    );
};

export const generateStaticParams = async () => {
    const [allCollections, allCaseStudies] = await Promise.all([
        fetchAllCollections(),
        fetchAllCaseStudies(),
    ]);

    const collectionParams = (allCollections || []).map(c => ({ collection: c.slug }));
    const caseStudyParams = (allCaseStudies || []).map(c => ({ collection: c.slug }));

    return [...collectionParams, ...caseStudyParams];
};

export const generateMetadata = async ({params}: Props) => {
    const collection = await fetchCollection(params.collection);

    if (!collection) {
        const caseStudy = await fetchCaseStudy(params.collection);
        if (!caseStudy) return null;

        const baseUrl = process.env.NEXT_PUBLIC_URL;
        return {
            ...config.seo,
            title: caseStudy.title,
            description: caseStudy.seoDescription || caseStudy.subtitle || '',
            openGraph: {
                description: caseStudy.seoDescription || caseStudy.subtitle || '',
                images: caseStudy.coverImage
                    ? [{ url: caseStudy.coverImage.url, width: caseStudy.coverImage.width, height: caseStudy.coverImage.height }]
                    : undefined,
            },
            twitter: {
                card: 'summary_large_image',
                description: caseStudy.seoDescription || caseStudy.subtitle || '',
                title: caseStudy.title,
            },
            alternates: {
                canonical: `${baseUrl}/projects/${caseStudy.slug}`,
            },
        };
    }

    const collectionSeo = getCollectionSeo(collection);
    return {...config.seo, ...collectionSeo};
};

export const revalidate = 86400; // 24 hours

export default CollectionPage;
