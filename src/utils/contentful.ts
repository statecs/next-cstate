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
                pageTitle
                content
                ctaLabel
                ctaUrl
                openGraphImage: photo {
                    url(transform: {width: 1000})
                }
                photo {
                    height
                    url(transform: {format: WEBP, width: 1000})
                    width
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
                url: `/${item.slug}`
            })
        );

    return items || [];
};

export const fetchAllCollections = async (
    preview: boolean = false
): Promise<PhotoCollection[] | null> => {
    // NB: We will need to batch fetch collections.
    // Because of the nesting involved with this query, Contentful errors because of
    // the max complexity allowed. Once we exceed this limit we will need to write the
    // batch multiple requests.
    const query = `query {
        collectionCollection(
            limit: 35,
            order: [date_DESC],
            preview: ${preview ? 'true' : 'false'},
            where: {category_not: ""}
        ) {
            items {
                title
                slug
                pageTitle
                category
                ctaLabel
                ctaUrl
                isFeatured
                showDescription
                description
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
                        url
                        thumbnail: photo {
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

        return formattedCollections;
    }

    return null;
};

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
                description
                isFeatured
                showDescription
                pageTitle
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
                        url
                        urlLabel
                        instagramUrl
                        instagramLabel
                        fullSize: photo {
                            height
                            width
                            url(transform: {format: WEBP, width: 1800})
                        }
                        openGraphImage: photo {
                            url(transform: {width: 1000})
                        }
                        thumbnail: photo {
                            height
                            width
                            url(transform: {format: WEBP, width: 1000})
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
                photosCollection(limit: 50) {
                    items {
                        title
                        slug
                        url
                        thumbnail: photo {
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
    preview: boolean = false
): Promise<JourneyCollection[] | null> => {

    const query = `query {
        journeyCollection(
            limit: 35,
            order: [year_DESC],
        ) {
            items {
                title
                description
              	year
              	imageCollection {
                  items{
                    title
                    url
                    description
                  }
                }
                sys {
                    published: firstPublishedAt
                }
            }
        }
    }`;
    const response: any = await fetchContent(query, preview);

    if (response.data?.journeyCollection?.items) {
        const formattedJourneys = response.data.journeyCollection.items.map(
            (journey: any) => {
                return {
                    ...journey,
                    journeyCollection: {
                        items: journey
                    }
                };
            }
        );

        return formattedJourneys;
    }

    return null;
};