import React from 'react';
import { Suspense } from 'react'
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ListLayout } from '@/components/ListLayout/ListLayout';
import {getEditorialSeo} from '@/utils/helpers';

import {fetchWritingNavigation} from '@/utils/contentful';

const WritingPage = async () => {
  const links = await fetchWritingNavigation();

  const posts: Post[] = links.map((link) => ({
    url: link.url, 
    title: link.title,
    slug: link.url, 
    image: link.image,
    description: link.description,
    date: link.date,
    isPublic: link.isPublic,
    published: link.published || 'Not specified', 
  }));

    return (
      <>
      <ScrollArea className="lg:hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <ListLayout list={posts} isMobile />
        </Suspense>
      </ScrollArea>
      </>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('writing') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default WritingPage;
