import {fetchWriting} from '@/utils/contentful';
import {getOgImage} from '@/utils/og';

const handler = async ({params}: {params: {collection: string}}) => {

    const collection = await fetchWriting(params.collection);

    if (!collection) return new Response('Not found', {status: 404});

    const photos = collection.photosCollection.items.filter((photo, index) => {
        return index < 4;
    });
    if (photos.length === 0) return new Response('Not found', {status: 404});

    return getOgImage(photos.map(photo => photo.fullSize.url));
};

export default handler;
