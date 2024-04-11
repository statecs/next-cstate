import { fetchAllJourneys, fetchEditorialPage } from '@/utils/contentful';

export const GET = async (request: Request) => {
 
    const allCollections = await fetchAllJourneys();
    const page = await fetchEditorialPage('about');
    return new Response(JSON.stringify({ allCollections, page }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
};
