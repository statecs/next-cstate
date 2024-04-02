'use client';

import { memo, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, RadioIcon } from 'lucide-react';

import { MobileDrawer } from '@/components/MobileDrawer';
import { SCROLL_AREA_ID, MOBILE_SCROLL_THRESHOLD } from '@/utils/constants';

interface FloatingHeaderProps {
  scrollTitle?: string;
  title?: string;
  goBackLink?: string;
  bookmarks?: any[]; // Define a more specific type based on the structure of bookmarks
  currentBookmark?: any; // Define a more specific type based on the structure of the bookmark
  children?: ReactNode;
}

export const FloatingHeader = memo<FloatingHeaderProps>(({ scrollTitle, title, goBackLink, children }) => {
  const [transformValues, setTransformValues] = useState({ translateY: 0, opacity: scrollTitle ? 0 : 1 });
  const pathname = usePathname();
  const isWritingPath = pathname.startsWith('/writing');

  useEffect(() => {
    const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollY = target.scrollTop;
    
      const translateY = Math.max(100 - scrollY, 0);
      const opacity = Math.min(Math.max((scrollY - MOBILE_SCROLL_THRESHOLD) / MOBILE_SCROLL_THRESHOLD, 0), 1);
    
      setTransformValues({ translateY: translateY, opacity: Number(opacity.toFixed(2)) });
    };
    

    if (scrollTitle) {
      scrollAreaElem?.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => scrollAreaElem?.removeEventListener('scroll', onScroll);
  }, [scrollTitle]);

  return (
    <header className="sticky inset-x-0 top-0 z-10 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b dark:border-zinc-700 bg-white dark:bg-custom-light-gray dark:text-white text-sm font-medium lg:hidden">
      <div className="flex h-full w-full items-center px-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1">
            {goBackLink ? (
                <Link href={goBackLink} title="Go back">
                  <ArrowLeftIcon size={16} />
                </Link>
            ) : ''
            }
            <div className="flex flex-1 items-center justify-between">
              {scrollTitle && (
                <span
                  className="line-clamp-2 font-semibold tracking-tight"
                  style={{
                    transform: `translateY(${transformValues.translateY}%)`,
                    opacity: transformValues.opacity
                  }}
                >
                  {scrollTitle}
                </span>
              )}
              {title && (
                  <span className="line-clamp-2 font-semibold tracking-tight">{title}</span>
              )}
            </div>
          </div>
          {scrollTitle && isWritingPath && <div className="flex min-w-[50px] justify-end">{children}</div>}
        </div>
      </div>
    </header>
  );
});

FloatingHeader.displayName = 'FloatingHeader';
