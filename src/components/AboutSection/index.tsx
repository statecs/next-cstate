'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon, ArrowUpRightIcon, ChevronUpIcon, ChevronRightIcon } from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  url?: string;
  title?: string;
  description?: string;
  imageCollection?: any;
}

type Collection = CollectionItem;
type CollectionsByYear = { [year: string]: Collection[] };

const AboutSection: React.FC = () => {
  const [content, setContent] = useState<{ allCollections: CollectionsByYear; page: any } | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/journey');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent({ allCollections: data.allCollections, page: data.page });
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    fetchData();

  }, []);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <div className={`overflow-y-auto ${showFullContent ? 'h-screen max-w-lg text-left' : ''}`}>
        <>
        {content && (
          <>
            {showFullContent && (
            <button 
              onClick={toggleContent} 
              className="flex items-center dark:text-white text-sm underline font-serif mb-4 transition-colors duration-200"
            >
              <ChevronUpIcon size={16} className="mr-1" />
              Read less
            </button>
          )}
          <div className="flex flex-col prose-sm max-w-lg text-balance leading-relaxed tracking-wide lg:prose-base dark:prose-invert prose-p:text-gray-500 lg:prose-p:leading-relaxed lg:prose-p:tracking-wide dark:prose-p:text-gray-400">
            {content.page?.content?.json?.content.map((block: any, index: number) => (
              block.nodeType === 'paragraph' && (
                <div key={index} className={`flex items-baseline justify-between w-full ${index !== 0 && !showFullContent ? 'hidden' : ''}`}>
                  <p className="flex-grow">
                    {block.content.map((text: any, textIndex: number) => 
                      text.nodeType === 'text' && <span key={textIndex}>{text.value}</span>
                    )}
                    {index === 0 && !showFullContent && (
                      <button onClick={toggleContent} className="text-sm font-serif ml-2 whitespace-nowrap">
                        <div className="flex justify-center items-center underline">Read more <ChevronRightIcon size={16} className="-ml-0.5" /></div>
                      </button>
                    )}
                  </p>
                </div>
              )
            ))}
          </div>
             
              {showFullContent && (
                <div className="mt-4 max-w-[800px] animate-fadeIn">
                  <h2 className="max-w-5xl pb-4 sm:pb-8 lg:pt-6 space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">
                    Journey
                  </h2>
                  {Object.entries(content.allCollections)
                    .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
                    .map(([year, collections]) => (
                      <div key={year} className="content-wrapper dark:text-gray-300">
                        <div className="content">
                          <div className="flex flex-col items-stretch gap-12">
                            <div className="flex flex-col items-baseline gap-6 md:flex-row md:gap-12">
                              <div className="flex items-center">
                                <h2>{year}</h2>
                                <hr className="my-0 ml-4 flex-1 border-dashed border-gray-200" />
                              </div>
                              <section>
                                {collections.map((collection, index) => (
                                  <div key={index} className="relative flex pb-8 md:pt-6 last:pb-0">
                                    <div className="absolute inset-0 flex w-6 items-center justify-center">
                                      <div className="pointer-events-none h-full w-px border-l-[1px] border-gray-200 dark:border-zinc-700"></div>
                                    </div>
                                    <div className="z-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black align-middle text-white">
                                      <PlusIcon size={16} />
                                    </div>
                                    <div className="flex-grow pl-8">
                                      {collection.url ? (
                                        <Link href={collection.url} className="hover:underline underline-offset-4 transition duration-200">
                                          <h3 className="flex font-semibold text-l sm:text-xl tracking-tight font-serif pb-4">
                                            {collection.title}
                                            <ArrowUpRightIcon size={28} />
                                          </h3>
                                        </Link>
                                      ) : (
                                        <h3 className="font-semibold text-l sm:text-xl tracking-tight font-serif pb-4">
                                          {collection.title}
                                        </h3>
                                      )}
                                      {collection.description && (
                                        <div className="text-sm prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base">
                                          {collection.description}
                                        </div>
                                      )}
                                      {collection.imageCollection && collection.imageCollection.items.map((image: any, imgIdx: number) => (
                                        <div key={imgIdx} className="mt-2.5 overflow-hidden rounded-xl bg-white shadow">
                                          <Image
                                            src={image.url}
                                            alt={image.description || ''}
                                            width={0}
                                            height={0}
                                            sizes="(max-width: 768px) 250px, 100vw"
                                            style={{ width: '100%', height: 'auto' }}
                                            loading={imgIdx < 3 ? 'eager' : 'lazy'}
                                            className="animate-reveal w-full object-cover"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </>
          )}
        </>
    </div>
  );
};

export default AboutSection;