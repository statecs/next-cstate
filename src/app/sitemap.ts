import {type MetadataRoute} from 'next';
import {fetchCollectionsForSitemap, fetchWritingForSitemap} from '@/utils/contentful';

export const revalidate = 3600; // Revalidate every hour

const getLastModifiedDate = (date?: string) => {
    if (!date) return new Date();
    return new Date(date);
};

const getCollectionSeo = async (): Promise<MetadataRoute.Sitemap> => {
    const allCollections = await fetchCollectionsForSitemap();
    if (!allCollections?.length) return [];

    const filteredCollections = allCollections.filter(
        (collection: any) => collection.photosCollection?.items?.length > 0
    );
    if (!filteredCollections?.length) return [];

    const items = filteredCollections.reduce((acc: any[], collection: any) => {
        const collectionItem = {
            url: `${process.env.NEXT_PUBLIC_URL}/projects/${
                collection.slug === 'home' ? '' : collection.slug
            }`,
            priority: collection.slug === 'home' || collection.isFeatured ? 1 : 0.8,
            lastModified: getLastModifiedDate(collection?.sys?.publishedAt).toISOString(),
            changeFrequency:
                collection.publishedAt === collection.firstPublishedAt ? 'monthly' : 'weekly'
        };
        const filteredPhotoItems = collection.photosCollection?.items?.filter((i: any) => i);

        if (collection.slug === 'home' || !filteredPhotoItems.length) {
            return [...acc, collectionItem];
        }

        const photoItems =
            filteredPhotoItems.map((photo: any) => ({
                url: `${process.env.NEXT_PUBLIC_URL}/projects/${collection.slug}/${photo.slug}`,
                priority: collection.slug === 'home' || collection.isFeatured ? 1 : 0.8,
                lastModified: getLastModifiedDate(photo?.sys?.publishedAt).toISOString(),
                changeFrequency: photo.publishedAt === photo.firstPublishedAt ? 'monthly' : 'weekly'
            })) || [];

        return [...acc, collectionItem, ...photoItems];
    }, [] as any[]);

    return items;
};

const getWritingSeo = async (): Promise<MetadataRoute.Sitemap> => {
    const allWritings = await fetchWritingForSitemap();
    if (!allWritings?.length) return [];

    // Filter out private or members-only writings
    const filteredWritings = allWritings.filter(
        (writing: any) => writing.isPublic && !writing.isMembersOnly
    );
    if (!filteredWritings?.length) return [];

    const items = filteredWritings.map((writing: any) => ({
        url: `${process.env.NEXT_PUBLIC_URL}/writing/${writing.slug}`,
        priority: writing.isFeatured ? 1 : 0.8,
        lastModified: getLastModifiedDate(writing?.sys?.publishedAt).toISOString(),
        changeFrequency:
            writing.publishedAt === writing.firstPublishedAt ? 'monthly' : 'weekly'
    }));

    return items;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [collections, writings] = await Promise.all([
        getCollectionSeo(),
        getWritingSeo()
    ]);

    return [...collections, ...writings];
}
