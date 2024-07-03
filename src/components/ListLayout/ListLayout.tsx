'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LinkList } from './LinkList';
import { cn } from '@/utils/helpers';

export const ListLayout: React.FC<ListLayoutProps> = ({ list, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isWriting = pathname.startsWith('/writing');
  const navLabel = isWriting ? "Writing navigation" : "Projects navigation";

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prevIndex) => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : list.length - 1;
          itemRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prevIndex) => {
          const newIndex = prevIndex < list.length - 1 ? prevIndex + 1 : 0;
          itemRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
    }
  }, [list.length]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, list.length);
  }, [list]);

  return (
    <nav aria-label={navLabel} onKeyDown={handleKeyDown}>
      {list.length > 0 ? (
        <ul 
          className={cn(
            'list-none p-0',
            isMobile ? 'animate-fadeIn' : 'flex flex-col gap-1 text-sm'
          )}
        >
          {list.map((post, index) => {
            const basePath = isWriting ? `/writing${post.url}` : `/projects${post.url}`;
            const isActive = pathname === basePath || pathname.startsWith(`${basePath}/`);

            return (
              <li key={post.url}>
                <LinkList 
                  post={post} 
                  isMobile={isMobile} 
                  isActive={isActive}
                  isFocused={index === focusedIndex}
                  ref={(el) => itemRefs.current[index] = el}
                  onFocus={() => setFocusedIndex(index)}
                />
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