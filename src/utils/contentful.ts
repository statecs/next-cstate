import {cache} from 'react';
import 'server-only';

const fetchContent = cache(async (query: string, preview: boolean = false) => {
    try {
        const data = await fetch(
            `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${
                        preview
                            ? process.env.CONTENTFUL_PREVIEW_API_KEY
                            : process.env.CONTENTFUL_DELIVERY_API_KEY
                    }`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query})
            }
        );
        const response = await data.json();
        return response;
    } catch (error) {
        console.log(error);
        throw new Error('Could not fetch data from Contentful!');
    }
});

const sortPhotos = (collection: PhotoCollection) => {
    const order = collection.photoSort || 'asc';

    return order === 'asc'
        ? collection.photosCollection.items
        : collection.photosCollection.items.reverse();
};

const addLinkedFromCollection = (items: any[]) => {
    const formattedCollection = items.map(photo => {
        // If there is only one linked collection then this photo is not
        // featured on the home or category collection pages.
        if (photo.linkedFrom?.collectionCollection?.items?.length > 1) {
            const categoryPages = ['home', 'street', 'travel', 'beer'];
            const filteredCollection = photo.linkedFrom.collectionCollection.items.find(
                (item: any) => !categoryPages.includes(item?.slug)
            );

            // In the case that the photo is featured on the home page only, it will
            // not return a filtered collection
            if (filteredCollection) {
                return {
                    ...photo,
                    collection: filteredCollection?.slug
                };
            }
        }

        return photo;
    });

    return formattedCollection;
};

const getFormattedCollection = (collection: any) => {
    // Sort photos by the order defined by the collection
    const sortedPhotos = sortPhotos(collection);

    // We want photos to link to their intended parent collection if
    // that collection is home or a category page.
    const formattedPhotos = addLinkedFromCollection(sortedPhotos);

    return formattedPhotos;
};

export const fetchEditorialPage = async (slug: string) => {
    const query = `query {
        editorialCollection(where: {slug: "${slug}"}, limit: 1) {
            items {
                title
                slug
                content {
                    json
                }
                ctaLabel
                ctaUrl
                openGraphImage: photo {
                    url(transform: {width: 1000})
                }
                photo {
                    height
                    url(transform: {format: WEBP, width: 1000})
                    width
                    description
                }
                photoNote
            }
        }
    }`;
    const response: any = await fetchContent(query);

    return response.data?.editorialCollection?.items?.[0] || null;
};

export const fetchLinksPage = async () => {
    const query = `query {
        linksPageCollection(limit: 1, order: [sys_publishedAt_DESC]) {
            items {
                text
                title
                linksCollection {
                    items {
                        ...on Link {
                            type: __typename
                            openGraphImage: photo {
                                url(transform: {width: 1000})
                            }
                            thumbnail: photo {
                                height
                                width
                                url(transform: {format: WEBP, width: 800})
                            }
                            text
                            title
                            url
                            sys {
                                publishedAt
                            }   
                        }
                    }
                }
            }
        }
    }`;
    const response: any = await fetchContent(query);

    return response.data?.linksPageCollection?.items?.[0] || null;
};

export const fetchCollectionNavigation = async (): Promise<Link[]> => {
    const query = `query {
        collectionNavigationCollection(limit: 1, order: [sys_publishedAt_DESC]) {
            items {
                collectionsCollection{
                    items {
                        title
                        slug
                        category
                        date
                        isPublic
                      	photosCollection(limit: 1){
                          items {
                            fullSize {
                                url
                                description
                            }
                          }
                        }
                        sys {
                            published: firstPublishedAt
                        }
                    }
                }
            }
        }
    }`;
    const response: any = await fetchContent(query);
    const items =
        response?.data?.collectionNavigationCollection?.items?.[0]?.collectionsCollection?.items?.map(
            (item: PhotoCollection) => ({
                published: item?.sys?.published,
                title: item.title,
                url: `/${item.slug}`,
                date: item.date,
                isPublic: item.isPublic,
                category: item.category,
                image: item.photosCollection.items[0]?.fullSize?.url || ''
            })
        );

    return items || [];
};

export const fetchAllCollections = async (
    preview: boolean = false,
    skip: number = 0,
    limit: number = 35
): Promise<PhotoCollection[] | null> => {
    const query = `query {
        collectionCollection(
            limit: ${limit},
            skip: ${skip},
            order: [date_DESC],
            preview: ${preview ? 'true' : 'false'},
            where: {category_not: ""}
        ) {
            items {
                title
                slug
                category
                ctaLabel
                ctaUrl
                isFeatured
                isPublic
                showDescription
                description {
                    json
                }
                photoSort
                photosCollection(limit: 50) {
                    items {
                        linkedFrom {
                            collectionCollection(limit: 3) {
                                items {
                                    title
                                    slug
                                }
                            }
                        }
                        title
                        slug
                        location
                        fullSize {
                            height
                            width
                            url(transform: {format: WEBP, width: 800})
                        }
                        base64
                    }
                }
                sys {
                    published: firstPublishedAt
                }
            }
            total
        }
    }`;
    const response: any = await fetchContent(query, preview);

    if (response.data?.collectionCollection?.items) {
        const formattedCollections = response.data.collectionCollection.items.map(
            (collection: any) => {
                const collectionPhotos = getFormattedCollection(collection);

                return {
                    ...collection,
                    photosCollection: {
                        items: collectionPhotos
                    }
                };
            }
        );

        // If there are more items, fetch the next batch
        if (formattedCollections.length < response.data.collectionCollection.total) {
            const nextBatch = await fetchAllCollections(preview, skip + limit, limit);
            return formattedCollections.concat(nextBatch || []);
        }

        return formattedCollections;
    }

    return null;
};

//https://www.contentful.com/blog/rich-text-field-tips-and-tricks/
export const fetchCollection = async (
    slug: string,
    preview: boolean = false
): Promise<PhotoCollection | null> => {
    // This call is used by both page ISR where we know the content slug and
    // in revalidation calls, where we only know the entry ID.
    const query = `query {
        collectionCollection(
            limit: 1,
            preview: ${preview ? 'true' : 'false'},
            where: {OR: [{slug: "${slug}"}, {sys: {id: "${slug}"}}]}
        ) {
            items {
                title
                slug
                category
                ctaLabel
                ctaUrl
                date
                description {
                    json
                    links {
                      assets { 
                        block {
                          sys {
                            id
                          }
                          url
                          title
                          width
                          height
                          description
                          contentType
                        }
                      }
                    }
                }
                isFeatured
                isPublic
                showDescription
                photoSort
                photosCollection(limit: 50) {
                    items {
                        linkedFrom {
                            collectionCollection(limit: 5) {
                                items {
                                    title
                                    slug
                                }
                            }
                        }
                        title
                        slug
                        description
                        location
                        date
                        instagramUrl
                        instagramLabel
                        fullSize {
                            height
                            width
                            description
                            url(transform: {format: WEBP, width: 1800})
                        }
                        openGraphImage: fullSize {
                            url(transform: {width: 1000})
                        }
                        base64
                    }
                }
            }
        }
    }`;
    const response: any = await fetchContent(query, preview);

    if (response?.data?.collectionCollection?.items?.length > 0) {
        const collection = response.data.collectionCollection.items[0];
        const collectionPhotos = getFormattedCollection(collection);

        return {
            ...collection,
            photosCollection: {
                items: collectionPhotos
            }
        };
    }

    return null;
};

// Fetch all collections that contain a specific photo
export const fetchPhotosLinkedCollections = async (entryId: string) => {
    const query = `query {
        photoCollection (where:{sys:{id:"${entryId}"}}) {
            items {
                linkedFrom {
                    collectionCollection(limit: 5) {
                        items {
                            slug
                        }
                    }
                }
            }
        }
    }`;
    const response: any = await fetchContent(query);
    const collectionSlugs =
        response.data?.photoCollection?.items?.[0]?.linkedFrom?.collectionCollection?.items?.map(
            (i: any) => i.slug
        ) || [];

    return collectionSlugs;
};

export const fetchCollectionsForSitemap = async () => {
    const query = `query {
        collectionCollection(where: {category_not: ""}, limit: 35) {
            items {
                title
                slug
                isFeatured
                isPublic
                photosCollection(limit: 50) {
                    items {
                        title
                        slug
                        fullSize {
                            url(transform: {format: WEBP, width: 800})
                        }
                        sys {
                            publishedAt
                            firstPublishedAt
                        }
                    }
                }
                sys {
                    publishedAt
                    firstPublishedAt
                }
            }
        }
    }`;
    const response: any = await fetchContent(query);

    return response.data?.collectionCollection?.items;
};

export const fetchAllJourneys = async (
    preview: boolean = false,
    skip: number = 0,
    limit: number = 35
): Promise<JourneyCollection[] | null> => {
    const query = `query {
        journeyCollection(
            limit: ${limit},
            skip: ${skip},
            order: [year_DESC],
            preview: ${preview ? 'true' : 'false'}
        ) {
            items {
                title
                description
                year
                url
                imageCollection {
                    items {
                        title
                        url
                        description
                    }
                }
                sys {
                    published: firstPublishedAt
                }
            }
            total
        }
    }`;
    
    const response: any = await fetchContent(query, preview);

    if (response.data?.journeyCollection?.items) {
        const formattedJourneys = response.data.journeyCollection.items.map(
            (journey: any) => ({
                ...journey,
                slug: journey.url, // Add slug for consistency with other content types
                photosCollection: { // Rename imageCollection to photosCollection for consistency
                    items: journey.imageCollection?.items.map((image: any) => ({
                        title: image.title,
                        fullSize: {
                            url: image.url,
                            height: 0, // You might want to add these to your journey query
                            width: 0,
                        },
                        base64: '', // You might want to add this to your journey query
                    })) || []
                }
            })
        );

        // If there are more items, fetch the next batch
        if (formattedJourneys.length < response.data.journeyCollection.total) {
            const nextBatch = await fetchAllJourneys(preview, skip + limit, limit);
            return formattedJourneys.concat(nextBatch || []);
        }

        return formattedJourneys;
    }

    return null;
};

export const fetchWritingNavigation = async (): Promise<Link[]> => {
    const query = `query {
        writingNavigationCollection(limit: 1, order: [sys_publishedAt_DESC]) {
            items {
                writingsCollection{
                    items {
                        title
                        slug
                        category
                        date
                        isPublic
                        isMembersOnly
                      	photosCollection(limit: 1){
                          items {
                            fullSize {
                                url
                                description
                            }
                          }
                        }
                        sys {
                            published: firstPublishedAt
                        }
                    }
                }
            }
        }
    }`;
    const response: any = await fetchContent(query);
    const items =
        response?.data?.writingNavigationCollection?.items?.[0]?.writingsCollection?.items?.map(
            (item: PhotoCollection) => ({
                published: item?.sys?.published,
                title: item?.title ?? 'Untitled',
                url: `/${item?.slug ?? ''}`,
                date: item?.date ?? null,
                isPublic: item?.isPublic ?? false,
                isMembersOnly: item?.isMembersOnly ?? false,
                category: item?.category ?? null,
                image: item?.photosCollection?.items?.[0]?.fullSize?.url ?? ''
            })
        );

    return items || [];
};

export const fetchAllWritings = async (
    preview: boolean = false,
    skip: number = 0,
    limit: number = 35
): Promise<PhotoCollection[] | null> => {
    const query = `query {
        writingCollection(
            limit: ${limit},
            skip: ${skip},
            order: [date_DESC],
            preview: ${preview ? 'true' : 'false'},
            where: {category_not: ""}
        ) {
            items {
                title
                slug
                category
                ctaLabel
                ctaUrl
                isFeatured
                isPublic
                isMembersOnly
                showDescription
                description {
                    json
                }
                photoSort
                photosCollection(limit: 50) {
                    items {
                        linkedFrom {
                            collectionCollection(limit: 3) {
                                items {
                                    title
                                    slug
                                }
                            }
                        }
                        title
                        slug
                        location
                        fullSize {
                            height
                            width
                            url(transform: {format: WEBP, width: 800})
                        }
                        base64
                    }
                }
                sys {
                    published: firstPublishedAt
                }
            }
            total
        }
    }`;
    const response: any = await fetchContent(query, preview);

    if (response.data?.writingCollection?.items) {
        const formattedWritings = response.data.writingCollection.items.map(
            (writing: any) => {
                const writingPhotos = getFormattedCollection(writing);

                return {
                    ...writing,
                    photosCollection: {
                        items: writingPhotos
                    }
                };
            }
        );

        // If there are more items, fetch the next batch
        if (formattedWritings.length < response.data.writingCollection.total) {
            const nextBatch = await fetchAllWritings(preview, skip + limit, limit);
            return formattedWritings.concat(nextBatch || []);
        }

        return formattedWritings;
    }

    return null;
};
//https://www.contentful.com/blog/rich-text-field-tips-and-tricks/
export const fetchWriting = async (
    slug: string,
    preview: boolean = false
): Promise<PhotoCollection | null> => {
    // This call is used by both page ISR where we know the content slug and
    // in revalidation calls, where we only know the entry ID.
    const query = `query {
        writingCollection(
            limit: 1,
            preview: ${preview ? 'true' : 'false'},
            where: {OR: [{slug: "${slug}"}, {sys: {id: "${slug}"}}]}
        ) {
            items {
                title
                slug
                category
                ctaLabel
                ctaUrl
                date
                description {
                    json
                    links {
                      assets { 
                        block {
                          sys {
                            id
                          }
                          url
                          title
                          width
                          height
                          description
                          contentType
                        }
                      }
                    }
                }
                isFeatured
                isPublic
                isMembersOnly
                showDescription
                photoSort
                photosCollection(limit: 50) {
                    items {
                        linkedFrom {
                            collectionCollection(limit: 5) {
                                items {
                                    title
                                    slug
                                }
                            }
                        }
                        title
                        slug
                        description
                        location
                        date
                        instagramUrl
                        instagramLabel
                        fullSize {
                            height
                            width
                            description
                            url(transform: {format: WEBP, width: 1800})
                        }
                        openGraphImage: fullSize {
                            url(transform: {width: 1000})
                        }
                        base64
                    }
                }
            }
        }
    }`;
    const response: any = await fetchContent(query, preview);

    if (response?.data?.writingCollection?.items?.length > 0) {
        const collection = response.data.writingCollection.items[0];
        const collectionPhotos = getFormattedCollection(collection);

        return {
            ...collection,
            photosCollection: {
                items: collectionPhotos
            }
        };
    }

    return null;
};

export const fetchWritingForSitemap = async (skip: number = 0, limit: number = 35): Promise<any[]> => {
    const query = `query {
        writingCollection(where: {category_not: ""}, limit: ${limit}, skip: ${skip}, order: [date_DESC]) {
            items {
                title
                slug
                isFeatured
                isPublic
                isMembersOnly
                photosCollection(limit: 50) {
                    items {
                        title
                        slug
                        fullSize {
                            url(transform: {format: WEBP, width: 800})
                        }
                        sys {
                            publishedAt
                            firstPublishedAt
                        }
                    }
                }
                sys {
                    publishedAt
                    firstPublishedAt
                }
            }
            total
        }
    }`;
    const response: any = await fetchContent(query);

    if (response.data?.writingCollection?.items) {
        const items = response.data.writingCollection.items;

        // If there are more items, fetch the next batch
        if (items.length < response.data.writingCollection.total) {
            const nextBatch = await fetchWritingForSitemap(skip + limit, limit);
            return items.concat(nextBatch || []);
        }

        return items;
    }

    return [];
};

export const fetchAllData = async (
    preview: boolean = false
): Promise<{ collections: PhotoCollection[] | null, writings: PhotoCollection[] | null }> => {
    const [collections, writings] = await Promise.all([
        fetchAllCollections(preview),
        fetchAllWritings(preview),
    ]);

    return { collections, writings };
};

