import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PhotoCollection from '@/components/PhotoCollection';
import config from '@/utils/config';
import {fetchAllCollections, fetchCollection} from '@/utils/contentful';
import {getCollectionSeo} from '@/utils/helpers';

interface Props {
    params: {collection: string};
}

const CollectionPage = async ({params}: Props) => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const collection = await fetchCollection(params.collection, isDraftModeEnabled);

    if (!collection) return notFound();

    return (
        <div className="flex flex-grow border-spacing-4 py-4 px-3 md:justify-center">
            <div className="flex flex-col space-y-2">
            <div className=" max-w-[700px]">
                <div className={params.collection === 'home' ? 'md:hidden' : ''}>
                    <PageHeader
                        {...collection}
                        description={collection?.showDescription ? collection.description : null}
                    />
                </div>
                <PhotoCollection {...collection} key={collection.slug} />
            </div>
            </div>
        </div>
    );
};

export const generateStaticParams = async () => {
    const allCollections = await fetchAllCollections();
    if (!allCollections) return [];

    return allCollections.map(collection => ({collection: collection.slug}));
};

export const generateMetadata = async ({params}: Props) => {
    const collection = await fetchCollection(params.collection);
    if (!collection) return null;

    const collectionSeo = getCollectionSeo(collection);
    return {...config.seo, ...collectionSeo};
};

export const revalidate = 60;

export default CollectionPage;