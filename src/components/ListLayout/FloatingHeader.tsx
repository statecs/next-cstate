'use client';

import { memo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, RadioIcon } from 'lucide-react';

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
  const basePath = isWritingPath ? '/writing' : '/projects';
  
  return (
    <header className="sticky inset-x-0 top-0 z-10 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b dark:border-zinc-700 bg-white dark:bg-custom-light-gray dark:text-white text-sm font-medium lg:hidden">
      <div className="flex h-full w-full items-center px-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1">
            {goBackLink ? (
                <Link href={`${basePath}${goBackLink}`} title="Go back">
                  <ArrowLeftIcon size={16} />
                </Link>
            ) : ''
            }
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