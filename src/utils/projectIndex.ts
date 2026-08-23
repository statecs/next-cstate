/**
 * One ordering for the projects index, shared by the index page and the detail
 * pages. The cards are numbered by position in this list, and a detail page
 * prints its own number in the kicker — they have to agree, so both read the
 * list from here rather than each sorting its own copy.
 */

/** Contentful gives collections and case studies separately; this is the merge. */
export const buildProjectIndex = (
    links: Link[],
    caseStudies: CaseStudy[] | null
): Post[] => {
    const navProjects: Post[] = (links || []).map(link => ({
        url: link.url,
        title: link.title,
        slug: link.url.replace(/^\//, ''),
        image: link.image,
        description: link.description,
        date: link.date,
        isPublic: link.isPublic,
        category: link.category,
        published: link.published || 'Not specified',
        kind: 'project' as const,
    }));

    const caseStudyPosts: Post[] = (caseStudies || []).map(cs => ({
        url: `/projects/${cs.slug}`,
        title: cs.title,
        slug: cs.slug,
        image: cs.coverImage?.url || '',
        date: undefined,
        isPublic: cs.isPublic,
        category: cs.tags?.join(', ') || '',
        published: cs.sys?.firstPublishedAt || 'Not specified',
        kind: 'case-study' as const,
    }));

    // A case study curated into the navigation is already in navProjects; the
    // nav copy wins, since that is the one carrying the curated url.
    const seen = new Set(navProjects.map(p => p.slug));
    return [...navProjects, ...caseStudyPosts.filter(p => !seen.has(p.slug))].sort((a, b) =>
        b.published > a.published ? 1 : -1
    );
};

/** Card number for an entry, e.g. "007". Undefined if it is not in the index. */
export const projectNumber = (index: Post[], slug: string): string | undefined => {
    const position = index.findIndex(entry => entry.slug === slug);
    return position === -1 ? undefined : String(position + 1).padStart(3, '0');
};

/**
 * Day-level date, matching the form the case study pages use. Entries carry
 * either a Contentful publish timestamp or their own date field, and a few
 * carry the literal 'Not specified' — those get nothing rather than an
 * "Invalid Date".
 */
export const formatProjectDate = (entry: {published?: string; date?: string}): string | undefined => {
    const raw = entry.published && entry.published !== 'Not specified' ? entry.published : entry.date;
    if (!raw) return undefined;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
