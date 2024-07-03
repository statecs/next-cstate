import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ListLayout } from '@/components/ListLayout/ListLayout';
import {getEditorialSeo} from '@/utils/helpers';
import { SideMenu } from '@/components/SideMenu/SideMenu';

import {fetchWritingNavigation} from '@/utils/contentful';


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
    published: link.published || 'Not specified', 
  }));

    return (
      <>
        <SideMenu title="Writing" isInner >
            <Suspense fallback={<LoadingSpinner />}>
              <ListLayout list={posts} isMobile />
            </Suspense>
          </SideMenu>
        <div className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-scroll">{children}</div>
      </>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('writing') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default Layout;
