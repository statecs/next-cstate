'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ShimmerImage from '@/components/ShimmerImage';
import { cn } from '@/utils/helpers';
import NewBadge from '@/components/PhotoCollection/New';
import { isCollectionNew } from '@/utils/helpers';

interface WritingGridProps {
  posts: Post[];
}

/**
 * Categories arrive as one comma-separated string per post, and a few carry
 * stray whitespace ("AI " vs "AI"), which would otherwise show up as two
 * separate tags. Splitting in one place keeps the chips and the filter match
 * in agreement.
 */
const postCategories = (post: Post): string[] =>
  post.category?.split(',').map(c => c.trim()).filter(Boolean) || [];

const WritingGrid: React.FC<WritingGridProps> = ({ posts }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedTags, setExpandedTags] = useState<{ [key: string]: boolean }>({});

  // Derived, not effect state: an effect would leave the tag row empty in the
  // server-rendered HTML and pop it in after hydration. Ordered by how many
  // posts carry each tag, so the useful ones come first in a row that scrolls.
  const categories = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach(post => {
      postCategories(post).forEach(tag => {
        freq[tag] = (freq[tag] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [posts]);

  const toggleFilter = (filter: string) =>
    setActiveFilter(prev => (prev === filter ? null : filter));

  const filteredPosts = useMemo(() => posts.filter(post => {
    if (!activeFilter) return true;
    return postCategories(post).includes(activeFilter);
  }), [posts, activeFilter]);

  return (
    <div className="w-full pb-[clamp(60px,10vh,120px)]">
      {categories.length > 0 && (
        <div className="aurora-filters">
          <div role="group" aria-label="Filter by tag" className="aurora-filters-group">
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              aria-pressed={activeFilter === null}
            >
              Any tag
            </button>
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => toggleFilter(category)}
                aria-pressed={activeFilter === category}
              >
                {category}
              </button>
            ))}
          </div>
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
                  <ShimmerImage
                    src={post.image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105"
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
                  const tags = postCategories(post);
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
                              "px-[9px] py-[4px] text-[0.72rem] rounded-md transition-colors duration-150 cursor-pointer",
                              activeFilter === tag
                                ? "bg-[var(--aurora-text)] text-[var(--aurora-bg)]"
                                : "bg-white/[0.04] text-[var(--aurora-faint)] hover:text-[var(--aurora-text)]"
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
