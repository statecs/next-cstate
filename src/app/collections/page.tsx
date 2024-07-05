import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import { fetchAllData } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import FilterableCollections from './FilterableCollections';
import { Item } from '@/types/items.d'; 

const CollectionsPage = async () => {
    const { isEnabled: isDraftModeEnabled } = draftMode();
    const { collections, writings } = await fetchAllData(isDraftModeEnabled);
    if (!collections && !writings) redirect('/');

    const allItems: Item[] = [
        ...(collections || []).map(item => ({
            ...item,
            type: 'collection' as const,  // Use 'as const' to narrow the type
            sys: item.sys ? { published: item.sys.published } : undefined
        })),
        ...(writings || []).map(item => ({
            ...item,
            type: 'writing' as const,  // Use 'as const' to narrow the type
            sys: item.sys ? { published: item.sys.published } : undefined
        })),
    ];

    const sortedItems = allItems
        .filter(item => item && item.slug && item.slug !== 'home')
        .sort((a, b) => {
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
                    <FilterableCollections items={sortedItems} />
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