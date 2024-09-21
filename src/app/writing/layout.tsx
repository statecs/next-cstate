import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage, fetchWritingNavigation} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {getEditorialSeo} from '@/utils/helpers';

import ClientLayout from './ClientLayout';

const Layout: React.FC<LayoutProps> = async ({ children }) => {

  const links = await fetchWritingNavigation();
  
  const posts: Post[] = links.map((link) => ({
    url: link.url,
    title: link.title, 
    slug: link.url, 
    image: link.image,
    description: link.description,
    date: link.date,
    isPublic: link.isPublic,
    isMembersOnly: link.isMembersOnly,
    category: link.category,
    published: link.published || 'Not specified', 
  }));

  return (
    <ClientLayout posts={posts}>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </ClientLayout>
  );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('writing') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default Layout;
