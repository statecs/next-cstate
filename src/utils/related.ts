/**
 * Related-content matching.
 *
 * Tags live in two shapes in Contentful: `category` on collections and writings
 * is a comma-separated string, `tags` on case studies is already a list. Both
 * normalize to the same lowercase set so a project and an article can match.
 */

export type RelatedKind = 'project' | 'case-study' | 'writing';

export interface RelatedItem {
    slug: string;
    title: string;
    subtitle?: string | null;
    tags: string[];
    kind: RelatedKind;
    date?: string | null;
    isPublic?: boolean | null;
}

/** Splits a `category` string or passes a `tags` array through, trimmed and de-duped. */
export const normalizeTags = (input?: string | string[] | null): string[] => {
    if (!input) return [];
    const raw = Array.isArray(input) ? input : input.split(',');
    const seen = new Set<string>();

    return raw
        .map(tag => tag?.trim())
        .filter((tag): tag is string => Boolean(tag))
        .filter(tag => {
            const key = tag.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
};

const hrefFor = (item: RelatedItem) =>
    item.kind === 'writing' ? `/writing/${item.slug}` : `/projects/${item.slug}`;

export interface RelatedMatch extends RelatedItem {
    href: string;
    /** Tags this item has in common with the current one, in the current item's order. */
    sharedTags: string[];
}

interface FindRelatedOptions {
    /** Max items returned. */
    limit?: number;
    /** When false, items marked `isPublic: false` are dropped. */
    includePrivate?: boolean;
    /**
     * Backfill with the most recent items when too few share a tag, so the
     * section never renders half-empty. Off by default.
     */
    fillWithRecent?: boolean;
}

/**
 * Ranks `candidates` by how many tags they share with `current`.
 *
 * Ties break on recency, then title, so the order is stable between builds
 * rather than following whatever order Contentful returned.
 */
export const findRelated = (
    current: { slug: string; tags: string[]; kind?: RelatedKind },
    candidates: RelatedItem[],
    { limit = 3, includePrivate = false, fillWithRecent = false }: FindRelatedOptions = {}
): RelatedMatch[] => {
    const currentTags = current.tags.map(tag => tag.toLowerCase());
    const currentTagSet = new Set(currentTags);

    const time = (item: RelatedItem) => (item.date ? new Date(item.date).getTime() : 0);

    const eligible = candidates.filter(item => {
        if (!item?.slug || item.slug === current.slug) return false;
        if (!includePrivate && item.isPublic === false) return false;
        return true;
    });

    const scored = eligible
        .map(item => {
            const sharedTags = item.tags.filter(tag => currentTagSet.has(tag.toLowerCase()));
            return { ...item, href: hrefFor(item), sharedTags };
        })
        .filter(item => item.sharedTags.length > 0)
        .sort(
            (a, b) =>
                b.sharedTags.length - a.sharedTags.length ||
                time(b) - time(a) ||
                a.title.localeCompare(b.title)
        );

    if (!fillWithRecent || scored.length >= limit) {
        return scored.slice(0, limit);
    }

    const taken = new Set(scored.map(item => item.slug));
    const recent = eligible
        .filter(item => !taken.has(item.slug))
        .sort((a, b) => time(b) - time(a) || a.title.localeCompare(b.title))
        .map(item => ({ ...item, href: hrefFor(item), sharedTags: [] as string[] }));

    return [...scored, ...recent].slice(0, limit);
};
