import {draftMode} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import NewBadge from '@/components/PhotoCollection/New';
import ThumbnailImage from '@/components/PhotoCollection/ThumbnailImage';
import config from '@/utils/config';
import {fetchAllData} from '@/utils/contentful';
import {getEditorialSeo, isCollectionNew} from '@/utils/helpers';

const CollectionsPage = async () => {
    const {isEnabled: isDraftModeEnabled} = draftMode();
    const {collections, writings} = await fetchAllData(isDraftModeEnabled);
    if (!collections && !writings) redirect('/');

    const allItems = [
        ...(collections || []).map(item => ({ ...item, type: 'collection' })),
        ...(writings || []).map(item => ({ ...item, type: 'writing' })),
    ];

    const sortedItems = allItems
        .filter(item => item && item.slug && item.slug !== 'home')
        .sort((a, b) => {
            // Sort by publication date, most recent first
            const dateA = a.sys?.published ? new Date(a.sys.published) : new Date(0);
            const dateB = b.sys?.published ? new Date(b.sys.published) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

    return (
        <main className="flex flex-grow h-[calc(100vh-110px)] border-spacing-4 py-4 px-8 md:justify-center">
            <div className="flex flex-col space-y-2">
                <div className="max-w-[700px]">
                    <PageHeader
                        description="All collections and writings"
                        title="All collections"
                    />
                    <section aria-label="All content">
                        <ul className="grid animate-fadeIn grid-cols-2 gap-3 animate-duration-1000 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 list-none p-0">
                            {sortedItems.map(item => (
                                <li key={item.slug}>
                                    <Link
                                        className="group w-full block"
                                        href={item.type === 'writing' ? `/writing/${item.slug}` : `/projects/${item.slug}`}
                                        aria-label={`View ${item.title}`}
                                    >
                                        <ThumbnailImage
                                            {...item.photosCollection.items[0]?.fullSize}
                                            base64={item.photosCollection.items[0]?.base64}
                                        />
                                         <span className="flex flex-row justify-between space-x-4 pb-2 pt-2 sm:pb-4">
                                            <span className="text-sm tracking-wide text-gray-600 underline-offset-4 group-hover:underline group-focus:underline dark:text-gray-400 dark:group-hover:text-white">
                                            {item.title}     
                                            </span>
                                            <span>
                                                {isCollectionNew(item.sys?.published) && <NewBadge />}
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
        ...getEditorialSeo({slug: 'collections', title: 'All collections'})
    };
};

export const revalidate = 60;

export default CollectionsPage;