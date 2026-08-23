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

/**
 * Body prose cut down to a search-result snippet. Google drops a description it
 * judges unhelpful and scrapes the page instead, so this avoids the tells: it
 * breaks on a word rather than mid-syllable, only ellipsises when it actually
 * cut something, and drops a decorative emoji lead-in.
 */
export const toMetaDescription = (text: string, limit = 155): string => {
    const clean = text
        .replace(/\s+/g, ' ')
        // Leading emoji/symbol: reads as noise where the snippet is truncated
        // to begin with, and some locales render it as a placeholder box.
        .replace(/^[\p{Extended_Pictographic}\p{So}\s]+/u, '')
        .trim();

    if (clean.length <= limit) return clean;

    const cut = clean.slice(0, limit);
    const lastSpace = cut.lastIndexOf(' ');
    // A limit-length run with no space is one long token; cutting at the limit
    // is the only option left.
    const truncated = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
    return `${truncated.replace(/[,;:.\u2014-]+$/, '')}…`;
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

    const body = contentIsCorrectType(page.content)
                      ? extractTextFromJson(page.content.json)
                      : (page.content || '');

    const description = toMetaDescription(body);

    return {
        alternates: {
            canonical: `${config.seo.canonical}/${page.slug}`
        },
        ...withDescription(description),
        title: page.title
    };
};

/**
 * Page metadata carrying one description across all three places that need it.
 * Spread after `getEditorialSeo` to override it — setting only the top-level
 * field leaves og and twitter still showing the scraped body text.
 *
 * The og and twitter blocks are merged rather than replaced: a bare
 * `openGraph: {description}` drops the rest of `config.seo.openGraph` with it,
 * which is how the site came to have no og:image.
 */
export const withDescription = (description: string) => ({
    description,
    openGraph: {...config.seo.openGraph, description},
    twitter: {...config.seo.twitter, description}
});

// A collection can be considered new if it's been published in the last 2 months.
export const isCollectionNew = (date: string | undefined) => {
    if (!date) return false;
    const now = new Date(date).getTime();
    const TwoMonthsAgo = new Date().setMonth(new Date().getMonth() - 1);
    return now > TwoMonthsAgo;
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
  