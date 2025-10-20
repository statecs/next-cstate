import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import { fetchEditorialPage, fetchCollectionNavigation } from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getEditorialSeo } from '@/utils/helpers';
import ClientLayout from '../ClientLayout';

interface LayoutProps {
  children: ReactNode;
}

const CollectionLayout: React.FC<LayoutProps> = async ({ children }) => {
  try {
    const links = await fetchCollectionNavigation();

    const posts: Post[] = (links || []).map((link) => ({
      url: link.url,
      title: link.title,
      slug: link.url,
      image: link.image,
      description: link.description,
      date: link.date,
      isPublic: link.isPublic,
      category: link.category,
      published: link.published || 'Not specified',
    }));

    return (
      <ClientLayout posts={posts} key="projects-layout">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </ClientLayout>
    );
  } catch (error) {
    console.error('Error fetching collection navigation:', error);

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
  const page = await fetchEditorialPage('home') || {};
  return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default CollectionLayout;