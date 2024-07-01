import {draftMode} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import NewBadge from '@/components/PhotoCollection/New';
import ThumbnailImage from '@/components/PhotoCollection/ThumbnailImage';
import config from '@/utils/config';
import {fetchAllCollections} from '@/utils/contentful';
import {getEditorialSeo, isCollectionNew} from '@/utils/helpers';

const CollectionsPage = async () => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const collections = await fetchAllCollections(isDraftModeEnabled);
    if (!collections) redirect('/');

    const sortedCollections = (collections || [])
        .filter(collection => collection.slug !== collection.category && collection.slug !== 'home')
        .sort((a, b) => a.slug.localeCompare(b.slug));

    return (
        <main className="flex flex-grow h-[calc(100vh-110px)] border-spacing-4 py-4 px-8 md:justify-center">
            <div className="flex flex-col space-y-2">
                <div className="max-w-[700px]">
                    <PageHeader
                        description="All the collections"
                        title="All collections"
                    />
                    <section aria-label="Photo collections">
                        <ul className="grid animate-fadeIn grid-cols-2 gap-3 animate-duration-1000 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 list-none p-0">
                            {sortedCollections.map(collection => (
                                <li key={collection.slug}>
                                    <Link
                                        className="group w-full block"
                                        href={`/projects/${collection.slug}`}
                                        aria-label={`View ${collection.title} collection`}
                                    >
                                        <ThumbnailImage
                                            {...collection.photosCollection.items[0]?.fullSize}
                                            base64={collection.photosCollection.items[0]?.base64}
                                        />
                                         <span className="flex flex-row justify-between space-x-4 pb-2 pt-2 sm:pb-4">
                                            <span className="text-sm tracking-wide text-gray-600 underline-offset-4 group-hover:underline group-focus:underline dark:text-gray-400 dark:group-hover:text-white">
                                            {collection.title}     
                                            </span>
                                            <span>
                                                {isCollectionNew(collection.sys?.published) && <NewBadge />}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
};

export const generateMetadata = async () => {
    return {
        ...config.seo,
        ...getEditorialSeo({slug: 'collections', title: 'All photo collections'})
    };
};

export const revalidate = 60;

export default CollectionsPage;