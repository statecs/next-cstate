import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import { fetchEditorialPage, fetchWritingNavigation } from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getEditorialSeo } from '@/utils/helpers';
import ClientLayout from '../ClientLayout';

interface LayoutProps {
  children: ReactNode;
}

const WritingCollectionLayout: React.FC<LayoutProps> = async ({ children }) => {
  try {
    const links = await fetchWritingNavigation();
    
    const posts: Post[] = (links || []).map((link) => ({
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
  } catch (error) {
    console.error('Error fetching writing navigation:', error);
    
    // Fallback without sidebar
    return (
      <div className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-hidden">
        <div className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-scroll">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </div>
      </div>
    );
  }
};

export const generateMetadata = async () => {
  const page = await fetchEditorialPage('writing') || {};
  return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default WritingCollectionLayout;