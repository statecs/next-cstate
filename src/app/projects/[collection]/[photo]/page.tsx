import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PhotoCarousel from '@/components/PhotoCarousel';
import config from '@/utils/config';
import {fetchAllCollections, fetchCollection} from '@/utils/contentful';
import {getPhotoSeo} from '@/utils/helpers';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';

interface Props {
    params: Promise<{collection: string; photo: string}>;
}

const getCollectionAndPhoto = async (
    collectionSlug: string,
    photoSlug: string,
    preview: boolean = false
) => {
    const collection = await fetchCollection(collectionSlug, preview);
    const photo = collection?.photosCollection.items.find(p => p.slug === photoSlug);

    return {collection, photo};
};

const PhotoPage = async (props: Props) => {
    const params = await props.params;
    const {isEnabled: isDraftModeEnabled} = await draftMode();
    const {collection, photo} = await getCollectionAndPhoto(
        params.collection,
        params.photo,
        isDraftModeEnabled
    );
    if (!collection) redirect('/');
    if (!photo) notFound();

    return (
        <>
        <FloatingHeader scrollTitle={collection.title} goBackLink={`/projects/${collection.slug}`}></FloatingHeader>
            <div className="flex flex-grow flex-col h-screen border-spacing-4 py-4 px-8 md:justify-center aurora-enter-page">
                <PageHeader
                    animate={false}
                    backUrl={`${collection.slug}`}
                    title={collection.title}
                />
                <PhotoCarousel photo={params.photo} collection={collection} />
                <div>
                    {collection.photosCollection.items.map((photo, index) => (
                        photo.slug === params.photo && (
                            <div key={index}>
                                <PageHeader
                                    animate={false}
                                    backUrl={`/${collection.slug}`}
                                    ctaLabel={collection.ctaLabel}
                                    ctaUrl={collection.ctaUrl}
                                    description={photo.description}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>
            </>
    );
};

export const generateStaticParams = async () => {
    const allCollections = await fetchAllCollections();
    if (!allCollections) return [];

    return allCollections
        .map(collection => {
            return collection.photosCollection.items.map(photo => ({
                collection: collection.slug,
                photo: photo.slug
            }));
        })
        .flatMap(photo => photo);
};

export const generateMetadata = async (props: Props) => {
    const params = await props.params;
    const {collection, photo} = await getCollectionAndPhoto(params.collection, params.photo);
    if (!collection || !photo) return null;

    return {...config.seo, ...getPhotoSeo(collection, photo)};
};

export const revalidate = 86400; // 24 hours

export default PhotoPage;
