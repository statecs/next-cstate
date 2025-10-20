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
      <div className="flex flex-grow h-[calc(100vh-110px)] overflow-hidden">
        <div className="w-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Custom Enhanced Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight font-serif"
              style={{
                lineHeight: '1.2',
                paddingBottom: '0.1em'
              }}
            >
              <span
                className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                style={{
                  display: 'inline-block',
                  paddingBottom: '0.08em'
                }}
              >
                Projects
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A curated collection of my creative work, experiments, and digital experiences
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-500 mx-auto rounded-full"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectsGrid projects={posts} />
          </Suspense>
          </div>
        </div>
      </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('projects') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default ProjectPage;
