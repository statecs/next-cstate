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

    const sortedCollections = collections
        .filter(collection => collection.slug !== collection.category && collection.slug !== 'home')
        .sort((a, b) => a.slug.localeCompare(b.slug));

    return (
          <div className="flex flex-grow border-spacing-4 py-4 px-3 md:justify-center overflow-auto">
          <div className="flex flex-col space-y-2">
              <div className="max-w-[700px]">
                <PageHeader
                    description="All the collections"
                    title="All collections"
                />
                <div className="grid animate-fadeIn grid-cols-2 gap-3 animate-duration-1000 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {sortedCollections.map(collection => (
                        <Link
                            className="group w-full"
                            key={collection.slug}
                            href={`/${collection.slug}`}
                        >
                            <ThumbnailImage
                                {...collection.photosCollection.items[0]?.thumbnail}
                                base64={collection.photosCollection.items[0]?.base64}
                            />
                            <span className="flex flex-row justify-between space-x-4 pb-2 pt-2 sm:pb-4">
                                <span className="text-sm tracking-wide text-gray-600 underline-offset-4 group-hover:underline group-focus:underline dark:text-gray-400 dark:group-hover:text-white">
                                    {collection.pageTitle ? (
                                        <>
                                            <span className="hidden sm:inline-block">
                                                {collection.pageTitle}
                                            </span>
                                            <span className="sm:hidden">{collection.title}</span>
                                        </>
                                    ) : (
                                        collection.title
                                    )}
                                </span>
                                <span>
                                    {isCollectionNew(collection.sys?.published) && <NewBadge />}
                                </span>
                            </span>
                            <span className="hidden text-sm">{collection.description}</span>
                        </Link>
                    ))}
                    </div>
                </div>
            </div>
        </div>
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
