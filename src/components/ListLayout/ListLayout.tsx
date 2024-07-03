'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LinkList } from './LinkList';
import { cn } from '@/utils/helpers';

export const ListLayout: React.FC<ListLayoutProps> = ({ list, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const isWriting = pathname.startsWith('/writing');
  const navLabel = isWriting ? "Writing navigation" : "Projects navigation";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (list.length === 0) return;

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const currentIndex = list.findIndex(item => pathname.includes(item.url));
        const newIndex = event.key === 'ArrowUp'
          ? (currentIndex > 0 ? currentIndex - 1 : list.length - 1)
          : (currentIndex < list.length - 1 ? currentIndex + 1 : 0);
        
        const newPath = `/${isWriting ? 'writing' : 'projects'}${list[newIndex].url}`;
        router.push(newPath);
        setFocusedIndex(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [list, isWriting, router, pathname]);

  return (
    <nav aria-label={navLabel}>
      {list.length > 0 ? (
        <ul className={cn('list-none p-0', isMobile ? 'animate-fadeIn' : 'flex flex-col gap-1 text-sm')}>
          {list.map((post, index) => (
            <li key={post.url}>
              <LinkList 
                post={post} 
                isMobile={isMobile} 
                isActive={pathname.startsWith(`/${isWriting ? 'writing' : 'projects'}${post.url}`)}
                isFocused={index === focusedIndex}
                onFocus={() => setFocusedIndex(index)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </nav>
  );
};