import React from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import WritingGrid from '@/components/WritingGrid';
import {getEditorialSeo} from '@/utils/helpers';
import PageHeader from '@/components/PageHeader';

import {fetchWritingNavigation} from '@/utils/contentful';

const WritingPage = async () => {
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
      <div className="flex flex-grow h-[calc(100vh-110px)] overflow-hidden">
        <div className="w-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Custom Enhanced Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 tracking-tight font-serif leading-tight">
              Writing
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Thoughts, insights, and stories from my journey in design and technology
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-500 mx-auto rounded-full"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <WritingGrid posts={posts} />
          </Suspense>
          </div>
        </div>
      </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('writing') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default WritingPage;
