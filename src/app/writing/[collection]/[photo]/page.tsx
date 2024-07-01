import {draftMode} from 'next/headers';
import {redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PhotoCarousel from '@/components/PhotoCarousel';
import config from '@/utils/config';
import {fetchAllWritings, fetchWriting} from '@/utils/contentful';
import {getPhotoSeo} from '@/utils/helpers';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';

interface Props {
    params: {collection: string; photo: string};
}

const getCollectionAndPhoto = async (
    collectionSlug: string,
    photoSlug: string,
    preview: boolean = false
) => {
    const collection = await fetchWriting(collectionSlug, preview);
    const photo = collection?.photosCollection.items.find(p => p.slug === photoSlug);

    return {collection, photo};
};

const PhotoPage = async ({params}: Props) => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const {collection} = await getCollectionAndPhoto(
        params.collection,
        params.photo,
        isDraftModeEnabled
    );
    if (!collection) redirect('/');

    return (
        <>
        <FloatingHeader scrollTitle={collection.title} goBackLink={`/writing/${collection.slug}`}></FloatingHeader>
            <div className="flex flex-grow flex-col h-screen border-spacing-4 py-4 px-8 md:justify-center">
                <PageHeader
                    animate={false}
                    backUrl={`${collection.slug}`}
                    title={collection.title}
                    currentPage="writing"
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
    const allCollections = await fetchAllWritings();
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

export const generateMetadata = async ({params}: Props) => {
    const {collection, photo} = await getCollectionAndPhoto(params.collection, params.photo);
    if (!collection || !photo) return null;

    return {...config.seo, ...getPhotoSeo(collection, photo)};
};

export const revalidate = 60;

export default PhotoPage;
