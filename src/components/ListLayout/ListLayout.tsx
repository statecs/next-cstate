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

type FilterType = typeof FILTERS[keyof typeof FILTERS] | string;

const FilterButton: React.FC<{
  filter: FilterType;
  activeFilter: FilterType | null;
  onClick: (filter: FilterType) => void;
  isCategory?: boolean;
}> = ({ filter, activeFilter, onClick, isCategory = false }) => (
  <button 
    className={cn(
      "px-2 py-1 rounded font-medium",
      isCategory ? "text-[10px]" : "text-xs",
      activeFilter === filter 
        ? "bg-black dark:bg-zinc-200 dark:text-custom-dark-gray text-gray-200" 
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
  const [categories, setCategories] = useState<string[]>([]);

  const isWriting = pathname.startsWith('/writing');
  const navLabel = isWriting ? "Writing navigation" : "Projects navigation";

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(
      list.flatMap(post => post.category?.split(', ') || [])
    ));
    setCategories(uniqueCategories);
  }, [list]);

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
    if (categories.includes(activeFilter)) {
      return post.category?.split(', ').includes(activeFilter);
    }
    return true;
  }), [list, activeFilter, categories]);

  return (
    <>
   {isWriting && isAuthenticated && (
  <div className="flex flex-col gap-2 pb-2 px-1 lg:px-0 py-2">
    <div className="flex rounded-md shadow-sm w-full" role="group">
      {(Object.values(FILTERS) as FilterType[]).map((filter, index) => (
        <button
          key={filter}
          type="button"
          onClick={() => toggleFilter(filter)}
          className={`
            flex-1 px-2 py-2 text-xs font-medium
            ${index === 0 ? 'rounded-l-md' : ''}
            ${index === Object.values(FILTERS).length - 1 ? 'rounded-r-md' : ''}
            ${activeFilter === filter 
              ? 'bg-gray-200 text-gray-800 dark:bg-zinc-300 dark:text-black' 
              : 'bg-white text-gray-700 hover:text-black dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-300'}
            border border-gray-200 dark:border-gray-600
            focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-gray-700
            transition-colors duration-200
          `}
        >
          {filter}
        </button>
      ))}
    </div>
    <div className="flex flex-wrap gap-1 py-1 px-0">
      {categories.map(category => (
        <FilterButton
          key={category}
          filter={category}
          activeFilter={activeFilter}
          onClick={toggleFilter}
          isCategory
        />
      ))}
    </div>
  </div>
)}
      {!isWriting && (
        <div className="flex flex-wrap gap-1 p-4 lg:pb-4 lg:pt-1">
        {categories.map(category => (
          <FilterButton
            key={category}
            filter={category}
            activeFilter={activeFilter}
            onClick={toggleFilter}
            isCategory
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