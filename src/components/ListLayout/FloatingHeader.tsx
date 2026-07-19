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

export const FloatingHeader = memo<FloatingHeaderProps>(({ scrollTitle, title, children }) => {
  const pathname = usePathname();
  const isProjectsPath = pathname.startsWith('/projects');
  const isWritingPath = pathname.startsWith('/writing');

  // The pill opens the index of the section you're in, so label it by section
  // rather than by the entry you happen to be reading.
  const label = isWritingPath ? 'All writing' : isProjectsPath ? 'All projects' : scrollTitle || title;

  return (
    <header className="aurora-subnav lg:hidden">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event('toggleMobileMenu'))}
        aria-label={`Open ${label}`}
        className="aurora-subnav-pill"
      >
        <LayoutList size={16} />
        <span>{label}</span>
      </button>
      {(isProjectsPath || isWritingPath) && children}
    </header>
  );
});

FloatingHeader.displayName = 'FloatingHeader';
