import removeMarkdown from 'remove-markdown';
import config from '@/utils/config';
import { twMerge } from 'tailwind-merge'
import { cx } from 'classix'

export const capitalize = (string: string = '') => {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getExternalUrl = (url: string = '') => {
    return `${url}?utm_source=cstate.se&utm_medium=referral`;
};

export const getTransformedContentfulImageUrl = (url: string = '') => {
    return url.replace(
        'https://images.ctfassets.net',
        'https://www.cstate.se/images/photos'
    );
};

export const getCollectionSeo = (collection: PhotoCollection) => {
    if (!collection) return {};

    const extractTextFromJson = (json: any) => {
        if (typeof json !== 'object' || !json.content) return '';
        let text = '';
        json.content.forEach((block: any) => {
            block.content.forEach((contentItem: any) => {
                if (contentItem.nodeType === 'text') {
                    text += contentItem.value + ' ';
                }
            });
        });
        return text.trim();
    };

    // Ensure TypeScript understands that description is an object with a json property
    const descriptionIsCorrectType = (desc: any): desc is { json: any } =>
        typeof desc === 'object' && desc !== null && 'json' in desc;

    const description = descriptionIsCorrectType(collection.description)
                        ? extractTextFromJson(collection.description.json) 
                        : (typeof collection.description === 'string' ? collection.description : '');

    const title = collection.title;

    return {
        alternates: {
            canonical: `${config.seo.canonical}${collection.slug === 'home' ? '' : `/${collection.slug}`}`
        },
        description,
        openGraph: {description},
        title,
        twitter: {card: 'summary_large_image', description, title}
    };
};

export const getPhotoSeo = (collection: PhotoCollection, photo: Photo) => {
    const extractTextFromJson = (json: any) => {
        let text = '';
        json.content.forEach((block: any) => {
            block.content.forEach((contentItem: any) => {
                if (contentItem.nodeType === 'text') {
                    text += contentItem.value + ' ';
                }
            });
        });
        return text.trim();
    };

    const descriptionIsCorrectType = (desc: any): desc is { json: any } =>
        typeof desc === 'object' && desc !== null && 'json' in desc;

    const description = descriptionIsCorrectType(photo.description)
                        ? extractTextFromJson(photo.description.json) 
                        : photo.description 
                        || (descriptionIsCorrectType(collection.description)
                            ? extractTextFromJson(collection.description.json) 
                            : collection.description || '');

    const title = `${photo.title} | ${collection.title}`;

    return {
        alternates: {
            canonical: `${config.seo.canonical}/${collection.slug}/${photo.slug}`
        },
        description,
        openGraph: {description},
        title,
        twitter: {card: 'summary_large_image', description, title}
    };
};

export const getEditorialSeo = (page: Editorial) => {
    const extractTextFromJson = (json: any) => {
        let text = '';
        json.content.forEach((block: any) => {
            block.content.forEach((contentItem: any) => {
                if (contentItem.nodeType === 'text') {
                    text += contentItem.value + ' ';
                }
            });
        });
        return text.trim();
    };

    const contentIsCorrectType = (content: any): content is { json: any } =>
        typeof content === 'object' && content !== null && 'json' in content;

    let description = contentIsCorrectType(page.content)
                      ? extractTextFromJson(page.content.json) 
                      : (page.content || '');

    description = `${description.substring(0, 160)}...`;

    return {
        alternates: {
            canonical: `${config.seo.canonical}/${page.slug}`
        },
        description,
        openGraph: {description},
        title: page.title,
        twitter: {description}
    };
};

// A collection can be considered new if it's been published in the last 4 months.
export const isCollectionNew = (date: string | undefined) => {
    if (!date) return false;
    const now = new Date(date).getTime();
    const fourMonthsAgo = new Date().setMonth(new Date().getMonth() - 4);
    return now > fourMonthsAgo;
};

/**
 * Combines and merges multiple CSS class names or values using the classix and tailwind-merge libraries.
 * This function takes any number of arguments and passes them to the cx function from classix,
 * which generates a combined class name string. The result is then passed to twMerge from tailwind-merge,
 * which merges any overlapping or duplicate classes into a final single string.
 *
 * @param args - The CSS class names or values to be combined and merged.
 * @returns - A merged string containing the combined CSS class names or values.
 */
export function cn(...args: (string | null | undefined)[]) {
    return twMerge(cx(...args));
  }
  