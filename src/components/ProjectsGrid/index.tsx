'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/helpers';
import NewBadge from '@/components/PhotoCollection/New';
import { isCollectionNew } from '@/utils/helpers';

interface ProjectsGridProps {
  projects: Post[];
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTags, setExpandedTags] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(
      projects.flatMap(project => project.category?.split(', ') || [])
    ));
    setCategories(uniqueCategories);
  }, [projects]);

  const toggleFilter = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const filteredProjects = useMemo(() => projects.filter(project => {
    if (!activeFilter) return true;
    return project.category?.split(', ').includes(activeFilter);
  }), [projects, activeFilter]);

  const FilterButton: React.FC<{
    filter: string;
    activeFilter: string | null;
    onClick: (filter: string) => void;
  }> = ({ filter, activeFilter, onClick }) => (
    <button 
      className={cn(
        "px-2 py-1 rounded font-medium text-[10px]",
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
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fadeIn animate-duration-700">
      {/* Filter Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 dark:text-gray-200 rounded-md text-xs font-medium transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-zinc-600"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {activeFilter && ' (1)'}
        </button>
        {showFilters && (
          <div className="flex flex-wrap gap-1 py-1 px-0 animate-fadeIn">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.slug} className="group">
            <Link 
              href={`/projects${project.url}`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 rounded-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900 aspect-square shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
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
                {isCollectionNew(project.date) && (
                  <div className="absolute top-3 right-3 z-10">
                    <NewBadge />
                  </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl sm:text-2xl md:text-2xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-white/70 text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-light leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Title below image */}
              <div className="mt-4 px-1">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg sm:text-xl md:text-xl line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors duration-200 leading-snug">
                  {project.title}
                </h3>
                {project.category && (() => {
                  const tags = project.category.split(', ').map(tag => tag.trim());
                  const projectKey = project.slug;
                  const showAllTags = expandedTags[projectKey] || false;
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
                                [projectKey]: !showAllTags
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
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <p className="text-gray-500 dark:text-gray-400">
            {activeFilter ? `No projects found for "${activeFilter}"` : 'No projects available'}
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

export default ProjectsGrid;