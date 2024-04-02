import { Suspense } from 'react'
import { PlusIcon } from 'lucide-react'

import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import PageHeader from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {fetchAllJourneys} from '@/utils/contentful';


async function fetchData() {
    const collections = await fetchAllJourneys();
  
    // If collections is not an array, handle the error or return
    if (!Array.isArray(collections)) {
      console.error('Fetched data is not an array:', collections);
      return { allCollections: {} };
    }
  
    const allCollections = collections.reduce<CollectionsByYear>((acc, log) => {
      const year = new Date(log.year).getFullYear().toString(); // Use year as a key
  
      if (!acc[year]) {
        acc[year] = [];
      }
  
      acc[year].push({ ...log, year });
  
      return acc;
    }, {});
  
    return { allCollections };
  }

export default async function Journey() {
  const allCollections = await fetchData();

  return (
    <div className="flex flex-grow h-[calc(100vh-110px)] border-spacing-4 py-4 px-3 md:justify-center">
        <div className="max-w-[700px]">
            <div className="lg:col-span-3">
            <PageHeader title="Journey" />
            </div>
            <ScrollArea useScrollAreaId>
            <div className="content-wrapper dark:text-white">
                <div className="content">
                <Suspense fallback={<LoadingSpinner />}>
                    <div className="flex flex-col items-stretch gap-12">
                    {Object.entries(allCollections.allCollections).length > 0 ? (
                        Object.entries(allCollections.allCollections).sort(([yearA], [yearB]) => yearB.localeCompare(yearA)).map(([year, events], index) => (
                            Array.isArray(events) && (
                            <div key={index} className="flex flex-col items-baseline gap-6 md:flex-row md:gap-12">
                                <div className="flex items-center">
                                    <h2>{year}</h2>
                                    <hr className="my-0 ml-4 flex-1 border-dashed border-gray-200" />
                                </div>
                                <section>
                                    {events.map((item, itemIndex) => (
                                    <div key={itemIndex} className="relative flex pb-8 last:pb-0">
                                        <div className="absolute inset-0 flex w-6 items-center justify-center">
                                            <div className="pointer-events-none h-full w-px border-l-[1px] border-gray-200 dark:border-zinc-700"></div>
                                        </div>

                                        <div className="z-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black align-middle text-white">
                                            <PlusIcon size={16} />
                                        </div>

                                        <div className="flex-grow pl-8">
                                            <span className="font-semibold tracking-tight">{item.title}</span>
                                            {item.description ? (
                                            <div className="text-sm">
                                                {item.description}
                                            </div>
                                            ) : (
                                            <p className="text-sm text-gray-500">Description not available.</p>
                                            )}
                                            {Array.isArray(item.imageCollection?.items) && item.imageCollection.items.map((image: Image, imgIndex: number) => (
                                            <div key={imgIndex} className="mt-2.5 overflow-hidden rounded-xl bg-white shadow">
                                                <img
                                                src={image.url}
                                                alt={image.description || 'Relevant descriptive text'}
                                                width="100%"
                                                height="auto"
                                                loading={imgIndex < 3 ? 'eager' : 'lazy'}
                                                className="animate-reveal w-full object-cover"
                                                />
                                            </div>
                                            ))}
                                        </div>
                                    
                                    </div>
                                    ))}
                                </section>
                            </div>
                            )
                        ))
                        ) : (
                        <div>No collections to display.</div>
                        )}

                    </div>
                </Suspense>
                </div>
            </div>
            </ScrollArea>
    </div>
</div>

  )
}

