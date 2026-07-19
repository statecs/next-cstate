import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import BannerPhotoCollection from '@/components/BannerPhotoCollection';
import config from '@/utils/config';
import {fetchAllCollections, fetchAllCaseStudies, fetchCaseStudy, fetchCollection, fetchRelatedIndex} from '@/utils/contentful';
import {getCollectionSeo} from '@/utils/helpers';
import {findRelated, normalizeTags} from '@/utils/related';
import RelatedPosts from '@/components/RelatedPosts';
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

        const {projects} = await fetchRelatedIndex(isDraftModeEnabled);
        const related = findRelated(
            {slug: caseStudy.slug, tags: normalizeTags(caseStudy.tags)},
            projects,
            {includePrivate: authStatus}
        );

        return (
            <div className="aurora-enter-page">
                <CaseStudyPage
                    caseStudy={caseStudy}
                    related={<RelatedPosts items={related} heading="Related work" />}
                />
            </div>
        );
    }

    if (collection?.isPublic == false && !authStatus) {
        const baseUrl = process.env.NEXT_PUBLIC_URL;
        redirect(`${baseUrl}/api/auth/login?post_login_redirect_url=${baseUrl}/projects`);
    }

    const {projects} = await fetchRelatedIndex(isDraftModeEnabled);
    const relatedProjects = (
        <RelatedPosts
            items={findRelated(
                {slug: collection.slug, tags: normalizeTags(collection.category)},
                projects,
                {includePrivate: authStatus}
            )}
            heading="Related work"
        />
    );

    if (collection.coverImage) {
        return (
            <ScrollArea useScrollAreaId>
                <FloatingHeader scrollTitle="Projects" goBackLink="/projects" />
                <div className="aurora-enter-page">
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
                    <div className="max-w-3xl mx-auto px-6 pb-12">
                        <PageHeader
                            description={collection?.showDescription ? collection.description : null}
                        />
                    </div>
                                    {/* Photo slider at the bottom — hidden on mobile, hero handles it */}
                <div className="hidden sm:flex flex-grow px-4 sm:px-8 md:justify-center">
                    <div className="max-w-6xl mx-auto w-full">
                        <BannerPhotoCollection {...collection} key={collection.slug} />
                    </div>
                </div>
                </div>
                {relatedProjects}
                </div>

            </ScrollArea>
        );
    }

    const heroPhoto = collection.photosCollection?.items?.[0];

    return (
        <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Projects" goBackLink="/projects"></FloatingHeader>

        {/* Mobile hero — first photo as background with title */}
        {heroPhoto && (
            <div className="relative sm:hidden h-[55vw] min-h-[240px] max-h-[380px] overflow-hidden">
                <Image
                    src={heroPhoto.fullSize.url}
                    alt={heroPhoto.description || collection.title}
                    fill
                    className="object-cover"
                    priority
                    placeholder={heroPhoto.base64 ? 'blur' : 'empty'}
                    blurDataURL={heroPhoto.base64}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h1
                        className="font-serif leading-[0.88] tracking-[-0.04em] text-white"
                        style={{ fontSize: 'clamp(28px, 8vw, 52px)' }}
                    >
                        {collection.title}
                    </h1>
                </div>
            </div>
        )}

        <div className="flex flex-grow py-8 px-4 sm:px-8 md:justify-center">
            <div className="flex flex-col space-y-8 w-full">
                <div className="max-w-6xl mx-auto w-full">
                    {/* Banner Photo Collection — hidden on mobile when hero shown */}
                    <div className={heroPhoto ? 'hidden sm:block' : ''}>
                        <BannerPhotoCollection {...collection} key={collection.slug} />
                    </div>

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
        {relatedProjects}
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
