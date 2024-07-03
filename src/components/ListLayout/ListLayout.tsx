'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LinkList } from './LinkList';
import { cn } from '@/utils/helpers';
import { useAuthStatus } from '@/contexts/AuthContext';

interface ListLayoutProps {
  list: Post[];
  isMobile: boolean;
}

const FILTERS = {
  IS_PUBLIC: 'Public',
  SIGNED_IN: 'Free Access',
  MEMBERS: 'Paid'
} as const;

type FilterType = typeof FILTERS[keyof typeof FILTERS];

const FilterButton: React.FC<{
  filter: FilterType;
  activeFilter: FilterType | null;
  onClick: (filter: FilterType) => void;
}> = ({ filter, activeFilter, onClick }) => (
  <button 
    className={cn("px-2 py-1 rounded text-xs font-medium", 
      activeFilter === filter 
        ? "dark:bg-zinc-200 dark:text-custom-dark-gray text-gray-200" 
        : "bg-gray-100 dark:text-white dark:bg-zinc-700 dark:border-custom-light-gray text-gray-500"
    )}
    onClick={() => onClick(filter)}
    aria-pressed={activeFilter === filter}
    aria-label={`Filter by ${filter}`}
  >
    {filter}
  </button>
);

export const ListLayout: React.FC<ListLayoutProps> = ({ list, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { isAuthenticated, loading } = useAuthStatus();
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

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

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const filteredList = useMemo(() => list.filter(post => {
    if (!activeFilter) return true;
    if (activeFilter === FILTERS.SIGNED_IN && (post.isPublic !== null || post.isMembersOnly !== null)) return false;
    if (activeFilter === FILTERS.MEMBERS && !post.isMembersOnly) return false;
    if (activeFilter === FILTERS.IS_PUBLIC && !post.isPublic) return false;
    return true;
  }), [list, activeFilter]);

  return (
    <>
      {isWriting && isAuthenticated && (
        <div className="flex space-x-2 p-2 mb-4">
          {(Object.values(FILTERS) as FilterType[]).map(filter => (
            <FilterButton
              key={filter}
              filter={filter}
              activeFilter={activeFilter}
              onClick={toggleFilter}
            />
          ))}
        </div>
      )}
      <nav aria-label={navLabel}>
        {filteredList.length > 0 ? (
          <ul className={cn('list-none p-0', isMobile ? 'animate-fadeIn' : 'flex flex-col gap-1 text-sm')}>
            {filteredList.map((post, index) => (
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
    </>
  );
};