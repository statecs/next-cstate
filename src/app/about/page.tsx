import { Suspense } from 'react'
import { PlusIcon, ArrowUpRightIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import config from '@/utils/config';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import PageHeader from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchAllJourneys, fetchEditorialPage } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('about') || {};
    return { ...config.seo, ...getEditorialSeo(page) };
};

export const revalidate = 60;

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
  const page = await fetchEditorialPage('about') || {};

  return (
    <div className="flex flex-grow h-[calc(100vh-110px)] overflow-hidden">
        <div className="w-full overflow-y-auto">
            <div className="flex justify-center pr-4">
                <div className="flex flex-col space-y-2 max-w-[700px] py-4 px-8">    
                
                        <PageHeader description={page.content} title={page.title} />
                        
                        {page.photo && 
                            <Image
                            alt={page.photo?.description}
                            className="max-w-full sm:max-w-[260px] pb-6 py-3"
                            height={page.photo?.height}
                            placeholder="empty"
                            priority={false}
                            quality={90}
                            sizes="(max-width: 768px) 250px, 100vw"
                            src={page.photo?.url}
                            width={page.photo?.width}
                            />
                        }
                     
                        <div className="max-w-[800px] animate-fadeIn">
                            <div className="lg:col-span-3">
                                <h2 className="max-w-5xl pb-4 sm:pb-8 space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">Journey</h2>
                            </div>
                            <ScrollArea useScrollAreaId>
                            <div className="content-wrapper dark:text-gray-300">
                                <div className="content">
                                <Suspense fallback={<LoadingSpinner />}>
                                    <div className="flex flex-col items-stretch gap-12">
                                    {Object.entries(allCollections.allCollections).length > 0 ? (
                                        Object.entries(allCollections.allCollections).sort(([yearA], [yearB]) => yearB.localeCompare(yearA)).map(([year, events], index) => (
                                            Array.isArray(events) && (
                                            <div key={index} className="flex flex-col items-baseline gap-6 md:flex-row md:gap-12">
                                                <div className="flex items-center">
                                                    <h3>{year}</h3>
                                                    <hr className="my-0 ml-4 flex-1 border-dashed border-gray-200 " />
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
                                                            {item.url ? (
                                                                <Link href={item.url} className="hover:underline underline-offset-4 transition duration-200">
                                                                    <h4 className="flex font-semibold text-l sm:text-xl tracking-tight font-serif pb-4">{item.title} <ArrowUpRightIcon size={28} /></h4>
                                                                </Link>
                                                            ) : (
                                                                <h4 className="font-semibold text-l sm:text-xl tracking-tight font-serif pb-4">{item.title}</h4>
                                                            )}
                                                            {item.description ? (
                                                            <div className="text-sm prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base">
                                                                {item.description}
                                                            </div>
                                                            ) : (
                                                            <h3 className="text-sm text-gray-500">Description not available.</h3>
                                                            )}
                                                            {Array.isArray(item.imageCollection?.items) && item.imageCollection.items.map((image: Image, imgIndex: number) => (
                                                            <div key={imgIndex} className="mt-2.5 overflow-hidden rounded-xl bg-white shadow">
                                                                <Suspense fallback={<LoadingSpinner />}>
                                                                    <Image
                                                                    src={image.url}
                                                                    alt={image.description || ''}
                                                                    width={0}
                                                                    height={0}
                                                                    sizes="(max-width: 768px) 250px, 100vw"
                                                                    style={{ width: '100%', height: 'auto' }}
                                                                    loading={imgIndex < 3 ? 'eager' : 'lazy'}
                                                                    className="animate-reveal w-full object-cover"
                                                                    />
                                                                </Suspense>
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
                </div>
            </div>
        </div>

  )
}