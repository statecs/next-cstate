import {draftMode} from 'next/headers';
import {redirect} from 'next/navigation';
import Link from 'next/link';
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
          <FloatingHeader scrollTitle={collection.title} goBackLink={`/writing/${collection.slug}`} />
          <div className="bg-[#F4F1EA] dark:bg-zinc-950 min-h-screen">
            {/* Kicker header */}
            <div className="px-8 pt-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                  <Link href={`/writing/${collection.slug}`}>
                    <span className="text-red-600 dark:text-red-500">§</span>
                    {' — '}{collection.title}
                  </Link>
                </div>
              </div>
            </div>
            {/* Carousel */}
            <div className="px-8 py-6">
              <div className="max-w-6xl mx-auto">
                <PhotoCarousel photo={params.photo} collection={collection} />
              </div>
            </div>
            {/* Description / CTA */}
            <div className="px-8 pb-10">
              <div className="max-w-6xl mx-auto">
                {collection.photosCollection.items.map((photo, index) =>
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
                )}
              </div>
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

export const revalidate = 86400; // 24 hours

export default PhotoPage;
