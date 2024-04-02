import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { WritingListLayout } from '@/components/ListLayout/WritingListLayout';
import {getEditorialSeo} from '@/utils/helpers';
import { SideMenu } from '@/components/SideMenu/SideMenu';

import {fetchCollectionNavigation} from '@/utils/contentful';

interface Post {
  url: string;
  title: string;
  slug: string;
  published: string;
}

interface WritingLayoutProps {
  children: ReactNode;
}

const WritingLayout: React.FC<WritingLayoutProps> = async ({ children }) => {

  const links = await fetchCollectionNavigation();

  const posts: Post[] = links.map((link) => ({
    url: link.url,
    title: link.title, 
    slug: link.url, 
    published: link.published || 'Not specified', 
  }));

    return (
      <>
        <SideMenu title="Writing" isInner >
            <Suspense fallback={<LoadingSpinner />}>
              <WritingListLayout list={posts} isMobile />
            </Suspense>
          </SideMenu>
        <div className="lg:bg-dots flex-1">{children}</div>
      </>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default WritingLayout;
