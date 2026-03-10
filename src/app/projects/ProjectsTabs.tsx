'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Folder, FileText } from 'lucide-react';
import { cn } from '@/utils/helpers';
import ProjectsGrid from '@/components/ProjectsGrid';
import WritingGrid from '@/components/WritingGrid';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProjectsTabsProps {
  projects: Post[];
  writings: Post[];
}

type TabType = 'projects' | 'writing';

const ProjectsTabs: React.FC<ProjectsTabsProps> = ({ projects, writings }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read tab from URL, default to 'projects'
  const currentTab: TabType = (searchParams.get('tab') as TabType) || 'projects';

  // Handle tab changes with URL update
  const handleTabChange = useCallback((newTab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove param for default tab (cleaner URLs)
    if (newTab === 'projects') {
      params.delete('tab');
    } else {
      params.set('tab', newTab);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Update URL without page reload, scroll: false maintains scroll position
    router.push(newUrl, { scroll: false });
  }, [router, pathname, searchParams]);

  // Update document title when tab changes
  useEffect(() => {
    const titles = {
      projects: 'Projects | Christopher State',
      writing: 'Writing | Christopher State'
    };

    document.title = titles[currentTab];
  }, [currentTab]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleTabChange('projects');
    } else if (e.key === 'ArrowRight') {
      handleTabChange('writing');
    }
  };

  return (
    <div className="flex flex-grow h-[calc(100vh-110px)] overflow-hidden">
      <div className="w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* Page Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight font-serif"
                style={{ lineHeight: '1.2', paddingBottom: '0.1em' }}>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                    style={{ display: 'inline-block', paddingBottom: '0.08em' }}>
                Projects & Writing
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Creative work, experiments, and thoughts on design and technology
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-500 mx-auto rounded-full"></div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center items-center mb-12">
            <div role="tablist"
                 aria-label="Content categories"
                 className="inline-flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                 onKeyDown={handleKeyDown}>

              {/* Projects Tab */}
              <button
                role="tab"
                aria-selected={currentTab === 'projects'}
                aria-controls="projects-panel"
                id="projects-tab"
                onClick={() => handleTabChange('projects')}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium text-sm sm:text-base transition-all duration-200",
                  currentTab === 'projects'
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                <Folder size={20} className="hidden sm:block" />
                <Folder size={18} className="sm:hidden" />
                <span>Projects</span>
              </button>

              {/* Writing Tab */}
              <button
                role="tab"
                aria-selected={currentTab === 'writing'}
                aria-controls="writing-panel"
                id="writing-tab"
                onClick={() => handleTabChange('writing')}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium text-sm sm:text-base transition-all duration-200",
                  currentTab === 'writing'
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                <FileText size={20} className="hidden sm:block" />
                <FileText size={18} className="sm:hidden" />
                <span>Writing</span>
              </button>

            </div>
          </div>

          {/* Tab Panels - use show/hide to preserve filter state */}
          <div
            role="tabpanel"
            id="projects-panel"
            aria-labelledby="projects-tab"
            className={cn(
              "animate-fadeIn animate-duration-300",
              currentTab === 'projects' ? 'block' : 'hidden'
            )}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectsGrid projects={projects} />
            </Suspense>
          </div>

          <div
            role="tabpanel"
            id="writing-panel"
            aria-labelledby="writing-tab"
            className={cn(
              "animate-fadeIn animate-duration-300",
              currentTab === 'writing' ? 'block' : 'hidden'
            )}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <WritingGrid posts={writings} />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectsTabs;
