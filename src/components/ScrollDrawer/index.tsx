'use client';

import { useEffect, useState, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerClose } from './Drawer';
import { drawerScrollAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import { PlusIcon, ArrowUpRightIcon, XIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';

type Collection = any;
type CollectionsByYear = { [year: string]: Collection[] };
type ImageType = {
  url: string;
  description?: string;
};

const ScrollDrawer = () => {
  const [isOpen, setIsOpen] = useAtom(drawerScrollAtom);
  const [content, setContent] = useState<{ allCollections: CollectionsByYear; page: any } | null>(null);
  const [loadedContent, setLoadedContent] = useState({});
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const drawerRef =  useRef<HTMLDivElement>(null);

 // This effect ensures the drawer is open when the component mounts
  setIsOpen(true);

  // Function to close the drawer
  const handleCloseClick = () => {
    if (drawerRef.current) {
      // Setting up the transition properties
      drawerRef.current.style.transition = `transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)`;
      
      // Determining the direction based on a 'direction' state or prop
      const direction = 'bottom'; // Assuming the drawer slides from bottom to top
  
      // Applying the transform based on the direction
      drawerRef.current.style.transform = direction === 'bottom' ? `translate3d(0, 100%, 0)` : `translate3d(0, -100%, 0)`;
    }
  };
  

   // Fetch data once on component mount
   useEffect(() => {
    setIsOpen(true);
    const fetchData = async () => {
      try {
        const response = await fetch('/api/journey');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.allCollections) {
          setContent({ allCollections: data.allCollections, page: data.page });
          loadInitialContent(data.allCollections);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, [setIsOpen]);

  // Load initial content
  const loadInitialContent = (allCollections: CollectionsByYear) => {
    const years = Object.keys(allCollections).sort((a, b) => b.localeCompare(a));
    let initialContent: CollectionsByYear = {};

    for (let i = 0; i < 2 && i < years.length; i++) {
      const yearToLoad = years[i];
      initialContent[yearToLoad] = allCollections[yearToLoad];
    }

    setLoadedContent(initialContent);
  };

  // Handle scroll to dynamically load more content
  const handleScroll = (e: Event) => {
    if (!(e.target instanceof HTMLDivElement)) return;
  
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (content && content.allCollections) {
      const threshold = 500; // Pixels from the bottom
      if (scrollTop + clientHeight + threshold >= scrollHeight) {
        const years = Object.keys(content.allCollections).sort((a, b) => b.localeCompare(a));
        
        setLoadedContent((prevContent: CollectionsByYear) => {
          let updatedContent = { ...prevContent };
          const loadCount = 2;
          let loadedYearsCount = Object.keys(updatedContent).length;
  
          for (let i = 0; i < loadCount && (loadedYearsCount + i) < years.length; i++) {
            const yearToLoad = years[loadedYearsCount + i];
            updatedContent[yearToLoad] = content.allCollections[yearToLoad];
          }
  
          return updatedContent;
        });
      }
    }
  };

  // Attach and detach scroll event listener
  useEffect(() => {
    const drawerContent = drawerContentRef.current;
    if (drawerContent) {
      drawerContent.addEventListener('scroll', handleScroll);
      return () => drawerContent.removeEventListener('scroll', handleScroll);
    }
  }, [drawerContentRef.current]);


  return (
    <Drawer
      snapPoints={["200px", 1]}
      dismissible={true}
      open={isOpen}
      closeThreshold={0}
      modal={false}
      shouldScaleBackground={false}
      onOpenChange={setIsOpen}
    >
      <DrawerContent ref={drawerRef} className="h-[80%]" >
      <DrawerClose
          className="rounded-full p-2 bg-zinc-50 dark:bg-custom-dark-gray absolute right-5 top-5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 dark:data-[state=open]:bg-gray-800"
          onClick={handleCloseClick} 
        >
          <XIcon size={16} aria-label="Close" />
        </DrawerClose>
        <DrawerHeader id="title">{content?.page?.title}</DrawerHeader>
        <div ref={drawerContentRef} className="overflow-y-auto p-4 drawer-content-class">
          <div className="prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base dark:prose-invert prose-p:text-gray-500 lg:max-w-5xl lg:prose-p:leading-relaxed lg:prose-p:tracking-wide dark:prose-p:text-gray-400">
            {content?.page?.content?.json?.content.map((block: BlockNode, index: number) => (
              block.nodeType === 'paragraph' && (
                <p key={index}>
                  {block.content.map((text, textIndex) => 
                    text.nodeType === 'text' && <span key={textIndex}>{text.value}</span>
                  )}
                </p>
              )
            ))}
          </div>
          <div className="max-w-[800px] animate-fadeIn">
            <h2 className="max-w-5xl pb-4 sm:pb-8 space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">
              Journey
            </h2>
            {content && Object.entries(loadedContent)
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
                      {(collections as Collection[]).map((collection, index) => (
                        <div key={index} className="relative flex pb-8 last:pb-0">
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
                              {collection.imageCollection && collection.imageCollection.items.map((image: ImageType, imgIdx: number) => (
                                <div key={imgIdx} className="mt-2.5 overflow-hidden rounded-xl bg-white shadow">
                                  <Image
                                    src={image.url}
                                    alt={image.description || ''}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ScrollDrawer;
