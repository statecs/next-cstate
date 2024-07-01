'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LinkList } from './LinkList';
import { cn } from '@/utils/helpers';

export const ListLayout: React.FC<ListLayoutProps> = ({ list, isMobile }) => {
  const pathname = usePathname();

  const isWriting = pathname.startsWith('/writing');
  const navLabel = isWriting ? "Writing navigation" : "Projects navigation";
  
  return (
    <nav aria-label={navLabel}>
      {list.length > 0 ? (
        <ul className={cn(
          'list-none p-0',
          isMobile ? 'animate-fadeIn' : 'flex flex-col gap-1 text-sm'
        )}>
          {list.map((post) => {
            const basePath = isWriting ? `/writing${post.url}` : `/projects${post.url}`;
            const isActive = pathname === basePath || pathname.startsWith(`${basePath}/`);

            return (
              <li key={post.url}>
                <LinkList post={post} isMobile={isMobile} isActive={isActive} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </nav>
  );
};