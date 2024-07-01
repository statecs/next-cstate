import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PhotoCollection from '@/components/PhotoCollection';
import config from '@/utils/config';
import {fetchAllWritings, fetchWriting} from '@/utils/contentful';
import {getCollectionSeo} from '@/utils/helpers';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';

interface Props {
    params: {collection: string};
}

const CollectionPage = async ({params}: Props) => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const collection = await fetchWriting(params.collection, isDraftModeEnabled);

    if (!collection) return notFound();

    return (
        <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Writing" goBackLink="/writing"></FloatingHeader>
        <div className="flex flex-grow border-spacing-4 py-4 px-8 md:justify-left">
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
        </ScrollArea>
    );
};

export const generateStaticParams = async () => {
    const allCollections = await fetchAllWritings();
    if (!allCollections) return [];

    return allCollections.map(collection => ({
        params: { collection: collection.slug }
    }));
};

export const generateMetadata = async ({params}: Props) => {
    const collection = await fetchWriting(params.collection);
    if (!collection) return null;

    const collectionSeo = getCollectionSeo(collection);
    return {...config.seo, ...collectionSeo};
};

export const revalidate = 60;

export default CollectionPage;
