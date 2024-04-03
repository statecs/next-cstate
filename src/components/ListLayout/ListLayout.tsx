'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LinkList } from './LinkList';
import { cn } from '@/utils/helpers';


export const ListLayout: React.FC<ListLayoutProps> = ({ list, isMobile }) => {
  const pathname = usePathname();

  return (
    <div className={cn(isMobile ? '' : 'flex flex-col gap-1 text-sm')}>
      {list.length > 0 ? (
        list.map((post) => {
          const basePath = `/projects${post.url}`;
          const isActive = pathname === basePath || pathname.startsWith(`${basePath}/`);

          return (
            <LinkList key={post.url} post={post} isMobile={isMobile} isActive={isActive} />
          );
        })
      ) : (
        <div>No posts available.</div>
      )}
    </div>
  );
};
