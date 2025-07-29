'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/helpers';
import NewBadge from '@/components/PhotoCollection/New';
import { isCollectionNew } from '@/utils/helpers';

interface WritingGridProps {
  posts: Post[];
}

const WritingGrid: React.FC<WritingGridProps> = ({ posts }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTags, setExpandedTags] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(
      posts.flatMap(post => post.category?.split(', ') || [])
    ));
    setCategories(uniqueCategories);
  }, [posts]);

  const toggleFilter = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const filteredPosts = useMemo(() => posts.filter(post => {
    if (!activeFilter) return true;
    return post.category?.split(', ').includes(activeFilter);
  }), [posts, activeFilter]);

  const FilterButton: React.FC<{
    filter: string;
    activeFilter: string | null;
    onClick: (filter: string) => void;
  }> = ({ filter, activeFilter, onClick }) => (
    <button 
      className={cn(
        "px-4 py-2 rounded-full font-medium text-sm border transition-all duration-200 hover:scale-105 hover:shadow-sm",
        activeFilter === filter 
          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md" 
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
      )}
      onClick={() => onClick(filter)}
      aria-pressed={activeFilter === filter}
      aria-label={`Filter by ${filter}`}
    >
      {filter}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fadeIn animate-duration-700">
      {/* Enhanced Filter Section */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2">
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </div>
            {activeFilter && (
              <span className="flex items-center justify-center w-5 h-5 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full font-bold">
                1
              </span>
            )}
          </button>
        </div>
        
        {showFilters && (
          <div className="animate-fadeIn">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Filter by Category
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map(category => (
                  <FilterButton
                    key={category}
                    filter={category}
                    activeFilter={activeFilter}
                    onClick={toggleFilter}
                  />
                ))}
              </div>
              {activeFilter && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.slug} className="group">
            <Link 
              href={`/writing${post.url}`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 rounded-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900 aspect-square shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* New badge */}
                {isCollectionNew(post.date) && (
                  <div className="absolute top-3 right-3 z-10">
                    <NewBadge />
                  </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-white/70 text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-light leading-relaxed">
                      {post.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Title below image */}
              <div className="mt-4 px-1">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg sm:text-xl md:text-xl line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors duration-200 leading-snug">
                  {post.title}
                </h3>
                {post.category && (() => {
                  const tags = post.category.split(', ').map(tag => tag.trim());
                  const postKey = post.slug;
                  const showAllTags = expandedTags[postKey] || false;
                  const visibleTags = showAllTags ? tags : tags.slice(0, 2);
                  const hasMoreTags = tags.length > 2;

                  return (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {visibleTags.map((tag, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFilter(tag);
                            }}
                            className={cn(
                              "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md border cursor-pointer",
                              activeFilter === tag
                                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                                : "bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/70 border-gray-200/50 dark:border-gray-700/50"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                        {hasMoreTags && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setExpandedTags(prev => ({
                                ...prev,
                                [postKey]: !showAllTags
                              }));
                            }}
                            className="inline-flex items-center px-2 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                          >
                            {showAllTags ? '−' : `+${tags.length - 2}`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <p className="text-gray-500 dark:text-gray-400">
            {activeFilter ? `No posts found for "${activeFilter}"` : 'No posts available'}
          </p>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingGrid;