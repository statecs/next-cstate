import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PhotoCollection from '@/components/PhotoCollection';
import config from '@/utils/config';
import {fetchAllCollections, fetchCollection} from '@/utils/contentful';
import {getCollectionSeo} from '@/utils/helpers';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const dynamic = 'force-dynamic';

interface Props {
    params: {collection: string};
}

const CollectionPage = async ({params}: Props) => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const collection = await fetchCollection(params.collection, isDraftModeEnabled);
    const { isAuthenticated } = getKindeServerSession();
    const authStatus = await isAuthenticated();

    if (collection?.isPublic == false && !authStatus) {
        const baseUrl = process.env.NEXT_PUBLIC_URL;
        redirect(`${baseUrl}/api/auth/login?post_login_redirect_url=${baseUrl}/projects`);
    }
    if (!collection) return notFound();

    return (
        <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Projects" goBackLink="/projects"></FloatingHeader>
        <div className="flex flex-grow border-spacing-4 py-4 px-8 md:justify-center">
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
    const allCollections = await fetchAllCollections();
    if (!allCollections) return [];

    return allCollections.map(collection => ({
        params: { collection: collection.slug }
    }));
};

export const generateMetadata = async ({params}: Props) => {
    const collection = await fetchCollection(params.collection);
    if (!collection) return null;

    const collectionSeo = getCollectionSeo(collection);
    return {...config.seo, ...collectionSeo};
};

export const revalidate = 60;

export default CollectionPage;
