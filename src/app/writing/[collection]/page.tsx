import React from 'react';
import {draftMode} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';
import PhotoCollection from '@/components/PhotoCollection';
import { fetchAllCollections, fetchCollection } from '@/utils/contentful';
import {getCollectionSeo} from '@/utils/helpers';
import config from '@/utils/config';


  interface Props {
    params: {collection: string};
}
const WritingSlug = async ({params}: Props) => {
  const {isEnabled: isDraftModeEnabled} = draftMode();

  const collection = await fetchCollection(params.collection, isDraftModeEnabled);

  if (!collection) return notFound();

  return (
    <>
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="TEST" goBackLink="/writing"></FloatingHeader>
      <div className="flex flex-grow border-spacing-4 py-4 px-3 md:justify-center overflow-auto">
          <div className="flex flex-col space-y-2">
              <div className="max-w-[700px]">

                    <div className="content-wrapper">
                          <article className="content">
                          <div className={params.collection === 'home' ? 'md:hidden' : ''}>
                                <PageHeader
                                    {...collection}
                                    description={collection?.showDescription ? collection.description : null}
                                />
                            </div>
                            <PhotoCollection {...collection} key={collection.slug} />
                          </article>
                        </div>
                  </div>
            </div>
      </div>
    </ScrollArea>
    </>
  );
};

export const generateStaticParams = async () => {
    const allCollections = await fetchAllCollections();
    if (!allCollections) return [];

    return allCollections.map(collection => ({collection: collection.slug}));
};

export const generateMetadata = async ({params}: Props) => {
  const collection = await fetchCollection(params.collection);
  if (!collection) return null;

  const collectionSeo = getCollectionSeo(collection);
  return {...config.seo, ...collectionSeo};
};

export const revalidate = 60;

export default WritingSlug;
