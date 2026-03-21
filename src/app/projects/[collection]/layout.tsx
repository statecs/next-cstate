import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import { fetchEditorialPage, fetchCollectionNavigation, fetchAllCaseStudies } from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getEditorialSeo } from '@/utils/helpers';
import ClientLayout from '../ClientLayout';

interface LayoutProps {
  children: ReactNode;
}

const CollectionLayout: React.FC<LayoutProps> = async ({ children }) => {
  try {
    const [links, caseStudies] = await Promise.all([
      fetchCollectionNavigation(),
      fetchAllCaseStudies(),
    ]);

    const navPosts: Post[] = (links || []).map((link) => ({
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

    const caseStudyPosts: Post[] = (caseStudies || []).map((cs) => ({
      url: `/${cs.slug}`,
      title: cs.title,
      slug: `/${cs.slug}`,
      image: cs.coverImage?.url || '',
      date: undefined,
      isPublic: cs.isPublic,
      category: cs.tags?.join(', ') || '',
      published: cs.sys?.firstPublishedAt || 'Not specified',
    }));

    const seen = new Set(navPosts.map(p => p.url));
    const posts = [
      ...navPosts,
      ...caseStudyPosts.filter(p => !seen.has(p.url)),
    ].sort((a, b) => (b.published > a.published ? 1 : -1));

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

export const revalidate = 86400; // 24 hours

export default CollectionLayout;