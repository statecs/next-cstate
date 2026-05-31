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
          ? "bg-[var(--aurora-text)] text-[var(--aurora-bg)] border-[var(--aurora-text)]"
          : "text-[var(--aurora-muted)] border-[var(--aurora-line2)] hover:border-[var(--aurora-text)]"
      )}
      onClick={() => onClick(filter)}
      aria-pressed={activeFilter === filter}
      aria-label={`Filter by ${filter}`}
    >
      {filter}
    </button>
  );

  return (
    <div className="w-full pb-[clamp(60px,10vh,120px)]">
      {/* Filter toggle row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="aurora-mono hover:text-[var(--aurora-text)] transition-colors duration-150"
        >
          {showFilters ? 'Hide filters' : 'Filter'}
          {activeFilter && <span className="ml-1 text-[var(--aurora-text)]">[1]</span>}
        </button>
        {activeFilter && (
          <button
            onClick={() => setActiveFilter(null)}
            className="aurora-mono hover:text-[var(--aurora-text)] transition-colors duration-150"
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
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-lav)] focus-visible:ring-offset-2"
            >
              <div className="relative overflow-hidden bg-[var(--aurora-bg2)] aspect-square shadow-sm hover:shadow-md transition-shadow duration-300">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--aurora-faint)]">
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
                <h3 className="text-[var(--aurora-text)] font-serif text-lg sm:text-xl line-clamp-2 group-hover:text-[var(--aurora-lav)] transition-colors duration-200 leading-snug">
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
                                ? "bg-[var(--aurora-text)] text-[var(--aurora-bg)] border-[var(--aurora-text)]"
                                : "text-[var(--aurora-muted)] border-[var(--aurora-line2)] hover:border-[var(--aurora-text)]"
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
                            className="aurora-mono hover:text-[var(--aurora-text)] transition-colors duration-150"
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
          <p className="aurora-mono">
            {activeFilter ? `No posts found for "${activeFilter}"` : 'No posts available'}
          </p>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="mt-3 aurora-mono hover:text-[var(--aurora-text)] transition-colors duration-150"
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
