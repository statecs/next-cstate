import React from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import WritingGrid from '@/components/WritingGrid';
import {getEditorialSeo} from '@/utils/helpers';

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
      <div className="w-full overflow-y-auto bg-[#F4F1EA] dark:bg-zinc-950">
        {/* Header */}
        <div className="px-8 pt-16 pb-12 border-b border-zinc-900 dark:border-zinc-700">
          <div className="max-w-6xl mx-auto">
            {/* Kicker */}
            <div className="flex items-center justify-between mb-10 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
              <span><span className="text-red-600 dark:text-red-500">§ 00</span>{' — Writing'}</span>
              <span>{posts.length} entries</span>
            </div>
            {/* H1 */}
            <h1
              className="font-serif leading-[0.86] tracking-[-0.045em] text-zinc-900 dark:text-zinc-50 mb-6"
              style={{ fontSize: 'clamp(48px, 10vw, 140px)' }}
            >
              Writing
            </h1>
            {/* Lede */}
            <p
              className="font-serif text-zinc-600 dark:text-zinc-400"
              style={{ fontSize: 'clamp(18px, 2.5vw, 26px)' }}
            >
              Thoughts, insights, and stories from my journey in design and technology
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <WritingGrid posts={posts} />
        </Suspense>
      </div>
    </div>
  );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('writing') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 86400; // 24 hours

export default WritingPage;
