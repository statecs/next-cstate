import {fetchCollection} from '@/utils/contentful';
import {getOgImage} from '@/utils/og';

const handler = async ({params}: {params: {collection: string}}) => {
    const collection = await fetchCollection(params.collection);
    if (!collection) return;

    const photos = collection.photosCollection.items.filter((photo, index) => {
        return photo.fullSize.width > photo.fullSize.height && index < 4;
    });
    if (!photos) return;

    return getOgImage(photos.map(photo => photo.fullSize.url));
};

export const runtime = 'edge';
export default handler;
