import React from 'react';
import { Suspense } from 'react'
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import { CardGridSkeleton } from '@/components/Skeletons';
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
    <div className="aurora-main aurora-page-shell aurora-enter-page">
      <div className="aurora-wrap">
        <div className="aurora-page-head">
          <p className="aurora-mono">§ 01 — Index of writing</p>
          <h1>
            Writing &amp; <em>ideas.</em>
          </h1>
        </div>

        <Suspense fallback={<CardGridSkeleton />}>
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
