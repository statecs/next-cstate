import { fetchAllJourneys, fetchEditorialPage } from '@/utils/contentful';
import { JOURNEY_PAGE_SIZE, orderJourneys, toJourneyYear } from '@/utils/journey';

interface Journey {
    year: string;
}

interface CollectionsByYear {
    [year: string]: Journey[];
}

/**
 * Reading search params makes this handler dynamic, so lean on HTTP caching to
 * keep the paged requests cheap — the journey changes about as often as the
 * page that embeds it.
 */
const CACHE_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
};

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const skipParam = searchParams.get('skip');
    const limitParam = searchParams.get('limit');

    // Paginated mode: /home renders the first page server-side and pulls the
    // rest in as the reader scrolls, so the initial payload stays small.
    if (skipParam !== null || limitParam !== null) {
        const skip = Math.max(0, Number(skipParam) || 0);
        const limit = Math.min(50, Math.max(1, Number(limitParam) || JOURNEY_PAGE_SIZE));

        const collections = await fetchAllJourneys();
        const all = Array.isArray(collections) ? orderJourneys(collections) : [];
        const items = all.slice(skip, skip + limit);

        return new Response(
            JSON.stringify({ items, total: all.length, hasMore: skip + limit < all.length }),
            { headers: CACHE_HEADERS, status: 200 }
        );
    }

    const collections = await fetchAllJourneys();
    const page = await fetchEditorialPage('about');

    if (!Array.isArray(collections)) {
        console.error('Fetched data is not an array:', collections);
        return new Response(JSON.stringify({ allCollections: {}, page }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    const allCollections = collections.reduce<CollectionsByYear>((acc, log) => {
        const year = toJourneyYear(log.year); // Use year as a key

        if (!acc[year]) {
            acc[year] = [];
        }

        acc[year].push({ ...log, year });

        return acc;
    }, {});

    return new Response(JSON.stringify({ allCollections, page }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
};
