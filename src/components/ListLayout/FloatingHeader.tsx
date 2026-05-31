'use client';

import { memo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutList } from 'lucide-react';

interface FloatingHeaderProps {
  scrollTitle?: string;
  title?: string;
  goBackLink?: string;
  bookmarks?: any[]; // Define a more specific type based on the structure of bookmarks
  currentBookmark?: any; // Define a more specific type based on the structure of the bookmark
  children?: ReactNode;
}

export const FloatingHeader = memo<FloatingHeaderProps>(({ scrollTitle, title, goBackLink, children }) => {
  const pathname = usePathname();
  const isProjectsPath = pathname.startsWith('/projects');
  const isWritingPath = pathname.startsWith('/writing');
  
  return (
    <header className="sticky inset-x-0 top-1 z-10 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#1e1e1e]/70 backdrop-blur-md dark:text-white text-sm font-medium lg:hidden mt-2 animate-fadeIn animate-duration-500">
      <div className="flex h-full w-full items-center px-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event('toggleMobileMenu'))}
              aria-label="Toggle navigation list"
              className="shrink-0 link-card inline-flex items-center p-2"
            >
              <LayoutList size={20} />
            </button>
            <div className="flex flex-1 items-center justify-between">
              {scrollTitle && (
                <span
                  className="line-clamp-2 font-semibold tracking-tight"
                >
                  {scrollTitle}
                </span>
              )}
              {title && (
                  <span className="line-clamp-2 font-semibold tracking-tight">{title}</span>
              )}
            </div>
          </div>
          {scrollTitle && (isProjectsPath || isWritingPath) && <div className="flex min-w-[50px] justify-end">{children}</div>}
        </div>
      </div>
    </header>
  );
});

FloatingHeader.displayName = 'FloatingHeader';