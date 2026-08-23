import React, { ReactNode } from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import { fetchEditorialPage, fetchCollectionNavigation, fetchAllCaseStudies } from '@/utils/contentful';
import { CaseStudySkeleton } from '@/components/CaseStudy/CaseStudySkeleton';
import { getEditorialSeo } from '@/utils/helpers';
import ClientLayout from '../ClientLayout';
import { buildProjectIndex } from '@/utils/projectIndex';

interface LayoutProps {
  children: ReactNode;
}

const CollectionLayout: React.FC<LayoutProps> = async ({ children }) => {
  try {
    const [links, caseStudies] = await Promise.all([
      fetchCollectionNavigation(),
      fetchAllCaseStudies(),
    ]);

    // Same list, same order as the grid on /projects. LinkList prefixes the
    // section, so entries are addressed from it rather than absolutely.
    const posts = buildProjectIndex(links, caseStudies).map(post => ({
      ...post,
      url: `/${post.slug}`,
    }));

    return (
      <ClientLayout posts={posts} key="projects-layout">
        <Suspense fallback={<CaseStudySkeleton />}>
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
          <Suspense fallback={<CaseStudySkeleton />}>
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