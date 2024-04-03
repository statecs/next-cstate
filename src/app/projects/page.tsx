import React from 'react';
import { Suspense } from 'react'
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ListLayout } from '@/components/ListLayout/ListLayout';
import {getEditorialSeo} from '@/utils/helpers';

import {fetchCollectionNavigation} from '@/utils/contentful';

interface Post {
  url: string;
  title: string;
  slug: string;
  published: string;
}

const ProjectPage = async () => {
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
        <Suspense fallback={<LoadingSpinner />}>
          <ListLayout list={posts} isMobile />
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

export default ProjectPage;
