'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { WritingLink } from './WritingLink';
import { cn } from '@/utils/helpers';

interface Post {
  url: string;
  title: string;
  slug: string;
  published: string;
}

interface WritingListLayoutProps {
  list: (Post)[];
  isMobile: boolean;
}

export const WritingListLayout: React.FC<WritingListLayoutProps> = ({ list, isMobile }) => {
  const pathname = usePathname();

  return (
    <div className={cn(isMobile ? '' : 'flex flex-col gap-1 text-sm')}>
      {list.length > 0 ? (
        list.map((post) => {
          const isActive = pathname === `/writing/${post.url}`;
          return (
            <WritingLink key={post.url} post={post} isMobile={isMobile} isActive={isActive} />
          );
        })
      ) : (
        <div>No posts available.</div>
      )}
    </div>
  );
};
