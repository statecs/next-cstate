'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LinkList } from './LinkList';
import Link from 'next/link'
import Image from 'next/image';
import { cn } from '@/utils/helpers';
import { useAuthStatus } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';

interface ListLayoutProps {
  list: Post[];
  isMobile: boolean;
  onMinimizeChange?: (isMinimized: boolean) => void;
}

const FILTERS = {
  IS_PUBLIC: 'Public',
  SIGNED_IN: 'Members',
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

export const ListLayout: React.FC<ListLayoutProps> = ({ list, isMobile, onMinimizeChange }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { isAuthenticated, loading } = useAuthStatus();
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize with the correct state based on pathname
  const isWriting = pathname.startsWith('/writing');
  const basePath = isWriting ? '/writing' : '/projects';

  const [isListMinimized, setIsListMinimized] = useState(() => {
    // Check if there's a manual override in localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('listMenuManualState');
      if (stored !== null) {
        return stored === 'minimized';
      }
    }
    // Default: Initialize as minimized if we're viewing a specific project/article
    return pathname !== '/projects' && pathname !== '/writing';
  });

  const [manualOverride, setManualOverride] = useState(() => {
    // Check if manual override exists in localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('listMenuManualState') !== null;
    }
    return false;
  });

  const navLabel = isWriting ? "Writing navigation" : "Projects navigation";

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(
      list.flatMap(post => post.category?.split(', ') || [])
    ));
    setCategories(uniqueCategories);
  }, [list]);

  useEffect(() => {
    // Don't auto-minimize if user manually toggled the state
    if (manualOverride) {
      return;
    }

    const shouldMinimize = pathname !== '/projects' && pathname !== '/writing';
    // Only update if the state actually needs to change
    setIsListMinimized(prev => {
      if (prev !== shouldMinimize) {
        if (onMinimizeChange) {
          onMinimizeChange(shouldMinimize);
        }
        return shouldMinimize;
      }
      return prev;
    });
  }, [pathname, onMinimizeChange, manualOverride]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (list.length === 0 || isListMinimized) return;

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
  }, [list, isWriting, router, pathname, isListMinimized]);

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

  const toggleMinimize = () => {
    const newMinimizedState = !isListMinimized;
    setIsListMinimized(newMinimizedState);
    setManualOverride(true);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('listMenuManualState', newMinimizedState ? 'minimized' : 'expanded');
    }

    if (onMinimizeChange) {
      onMinimizeChange(newMinimizedState);
    }
  };

  const renderMinimizedItem = (post: Post, index: number) => {
    const currentUrl = pathname;
    const isActive = `${basePath}${post.url}` === currentUrl;
    const isFocused = index === focusedIndex;
    
    return (
      <Tooltip
        content={
          <div>
            <h3 className="font-bold">{post.title}</h3>
          </div>
        }
      >
        <div className={cn(
          "w-12 h-12 relative rounded-full overflow-hidden",
          (isActive || isFocused) ? "ring-2 ring-black dark:ring-white" : ""
        )}>
          <Link
            href={`${basePath}${post.url}`}
            className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
          >
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className={cn(
                  "transition-opacity duration-300",
                  (isActive || isFocused) ? "opacity-100" : "opacity-70 hover:opacity-100"
                )}
              />
            ) : (
              <div className={cn(
                "w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 transition-colors duration-300",
                (isActive || isFocused) ? "bg-black text-white dark:bg-zinc-700" : "hover:bg-gray-200 dark:hover:bg-zinc-700"
              )}>
                No img
              </div>
            )}
          </Link>
        </div>
      </Tooltip>
    );
  };


  return (
    <>
     
      <div className="relative bg-zinc-50 font-serif dark:bg-custom-light-gray dark:text-white p-3 lg:p-0">
        <div className="flex justify-between items-center mb-2">
          
        {!isListMinimized && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded-md text-xs font-medium transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-zinc-600"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFilter && ' (1)'}
          </button>
        )}
          <button
            onClick={toggleMinimize}
            className={cn(
              "hidden lg:block px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded-md text-xs font-medium transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-zinc-600",
              isListMinimized ? "mt-2 mb-4" : ""
            )}
            aria-label={isListMinimized ? "Expand list" : "Minimize list"}
          >
            {isListMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {isWriting && !isListMinimized && showFilters && (
        <div className="flex flex-col gap-2 bg-zinc-50 font-serif dark:bg-custom-light-gray dark:text-white p-3 lg:p-0">
          {showFilters && (
            <>
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
                      focus:z-10 focus:ring-2 focus:ring-gray-500
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
            </>
          )}
        </div>
      )}

        {showFilters && !isListMinimized && !isWriting && (
          <div className="flex flex-wrap gap-1 p-4 lg:pb-4 lg:pt-1 overflow-hidden animate-fadeIn">
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
      </div>

      <nav aria-label={navLabel}>
        {filteredList.length > 0 ? (
          <ul className={cn(
            'list-none p-0',
            isListMinimized ? 'flex flex-col gap-2' : 'flex flex-col gap-1',
            isMobile ? 'animate-fadeIn' : ''
          )}>
            {filteredList.map((post, index) => (
              <li key={post.url} className={isListMinimized ? 'w-12 h-12' : 'w-full'}>
                {isListMinimized ? (
                  renderMinimizedItem(post, index)
                ) : (
                  <LinkList 
                    post={post} 
                    isMobile={isMobile} 
                    isActive={pathname.startsWith(`/${isWriting ? 'writing' : 'projects'}${post.url}`)}
                    isFocused={index === focusedIndex}
                    onFocus={() => setFocusedIndex(index)}
                  />
                )}
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