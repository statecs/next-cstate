import { fetchAllJourneys, fetchEditorialPage } from '@/utils/contentful';

interface Journey {
    year: string; 
}

interface CollectionsByYear {
    [year: string]: Journey[];
}

export const GET = async (request: Request) => {
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
        const year = new Date(log.year).getFullYear().toString(); // Use year as a key

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
