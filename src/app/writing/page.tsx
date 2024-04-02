import React from 'react';
import { Suspense } from 'react'
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { WritingListLayout } from '@/components/ListLayout/WritingListLayout';
import {getEditorialSeo} from '@/utils/helpers';

import {fetchCollectionNavigation} from '@/utils/contentful';

interface Post {
  url: string;
  title: string;
  slug: string;
  published: string;
}

const Writing = async () => {
  const links = await fetchCollectionNavigation();

  const posts: Post[] = links.map((link) => ({
    url: link.url, 
    title: link.title,
    slug: link.url, 
    published: link.published || 'Not specified', 
  }));

    return (
      <>
      <ScrollArea className="lg:hidden">
        <FloatingHeader title="Writing" />
        <Suspense fallback={<LoadingSpinner />}>
          <WritingListLayout list={posts} isMobile />
        </Suspense>
      </ScrollArea>
      </>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default Writing;
