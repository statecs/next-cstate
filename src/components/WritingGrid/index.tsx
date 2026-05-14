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
        "px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.08em] border transition-colors duration-150",
        activeFilter === filter
          ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
          : "text-zinc-600 dark:text-zinc-400 border-zinc-400 dark:border-zinc-600 hover:border-zinc-700 dark:hover:border-zinc-400"
      )}
      onClick={() => onClick(filter)}
      aria-pressed={activeFilter === filter}
      aria-label={`Filter by ${filter}`}
    >
      {filter}
    </button>
  );

  return (
    <div className="w-full">
      <div className="max-w-[60%] mx-auto py-10">
        {/* Filter toggle row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
          >
            {showFilters ? 'Hide filters' : 'Filter'}
            {activeFilter && <span className="ml-1 text-zinc-900 dark:text-zinc-100">[1]</span>}
          </button>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter buttons */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <FilterButton
                key={category}
                filter={category}
                activeFilter={activeFilter}
                onClick={toggleFilter}
              />
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.slug} className="group">
              <Link
                href={`/writing${post.url}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:ring-offset-2"
              >
                <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-square shadow-sm hover:shadow-md transition-shadow duration-300">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em]">No Image</span>
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
                    <h3 className="text-white font-serif text-lg sm:text-xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
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
                  <h3 className="text-zinc-900 dark:text-zinc-100 font-serif text-lg sm:text-xl line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors duration-200 leading-snug">
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
                                "px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.06em] border transition-colors duration-150 cursor-pointer",
                                activeFilter === tag
                                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                                  : "text-zinc-500 dark:text-zinc-400 border-zinc-400/50 dark:border-zinc-600 hover:border-zinc-600 dark:hover:border-zinc-400"
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
                              className="font-mono text-[10px] uppercase tracking-[0.06em] text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors duration-150"
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
          <div className="py-16">
            <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.1em]">
              {activeFilter ? `No posts found for "${activeFilter}"` : 'No posts available'}
            </p>
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingGrid;
