'use client';

import { useState } from 'react';
import Link from 'next/link';
import NewBadge from '@/components/PhotoCollection/New';
import ThumbnailImage from '@/components/PhotoCollection/ThumbnailImage';
import { isCollectionNew } from '@/utils/helpers';
import { Item } from '@/types/items.d';  // Import the shared type

const FILTERS = {
  ALL: 'All',
  COLLECTIONS: 'Projects',
  WRITINGS: 'Writings'
} as const;

type FilterType = typeof FILTERS[keyof typeof FILTERS];

interface FilterButtonProps {
  filter: FilterType;
  activeFilter: FilterType;
  onClick: (filter: FilterType) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ filter, activeFilter, onClick }) => (
  <button
    onClick={() => onClick(filter)}
    className={`
      px-4 py-2 text-xs font-medium rounded-md
      ${activeFilter === filter 
        ? 'bg-gray-200 text-gray-800 dark:bg-zinc-300 dark:text-black' 
        : 'bg-white text-gray-700 hover:text-black dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-300'}
      border border-gray-200 dark:border-gray-600
      transition-colors duration-200
    `}
  >
    {filter}
  </button>
);


interface FilterableCollectionsProps {
  items: Item[];
}

const FilterableCollections: React.FC<FilterableCollectionsProps> = ({ items }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(FILTERS.ALL);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const filteredItems = items.filter(item => 
    activeFilter === FILTERS.ALL || 
    (activeFilter === FILTERS.COLLECTIONS && item.type === 'collection') ||
    (activeFilter === FILTERS.WRITINGS && item.type === 'writing')
  );

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            mb-2 px-4 py-2 
            ${activeFilter !== FILTERS.ALL ? 'w-[7.5rem]' : 'w-[6.5rem]'}
            bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200 
            rounded-md text-xs font-medium 
            transition-colors duration-200 
            hover:bg-gray-300 hover:text-gray-900 
            dark:hover:bg-zinc-600 dark:hover:text-white
          `}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {activeFilter !== FILTERS.ALL && ' (1)'}
        </button>
        {showFilters && (
          <div className="flex space-x-2 mt-2">
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
      </div>
      <section aria-label="All content">
        <ul className="grid animate-fadeIn grid-cols-2 gap-3 animate-duration-1000 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 list-none p-0">
          {filteredItems.map(item => (
            <li key={item.slug}>
              <Link
                className="group w-full block"
                href={item.type === 'writing' ? `/writing/${item.slug}` : `/projects/${item.slug}`}
                aria-label={`View ${item.title}`}
              >
                <ThumbnailImage
                  {...item.photosCollection.items[0]?.fullSize}
                  base64={item.photosCollection.items[0]?.base64}
                />
                <span className="flex flex-row justify-between space-x-4 pb-2 pt-2 sm:pb-4">
                  <span className="text-sm tracking-wide text-gray-600 underline-offset-4 group-hover:underline group-focus:underline dark:text-gray-400 dark:group-hover:text-white">
                    {item.title}     
                  </span>
                  <span>
                    {isCollectionNew(item.sys?.published) && <NewBadge />}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default FilterableCollections;