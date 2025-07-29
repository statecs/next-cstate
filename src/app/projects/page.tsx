import React from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ProjectsGrid from '@/components/ProjectsGrid';
import {getEditorialSeo} from '@/utils/helpers';
import PageHeader from '@/components/PageHeader';

import {fetchCollectionNavigation} from '@/utils/contentful';

const ProjectPage = async () => {
  const links = await fetchCollectionNavigation();

  const posts: Post[] = links.map((link) => ({
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
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageHeader
            title="Projects"
            description="A showcase of my creative work and projects"
          />
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectsGrid projects={posts} />
          </Suspense>
        </div>
      </main>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('projects') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default ProjectPage;
