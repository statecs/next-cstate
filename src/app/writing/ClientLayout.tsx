'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import { ListLayout } from '@/components/ListLayout/ListLayout';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
  children: ReactNode;
  posts: any[];
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, posts }) => {
  const [isListVisible, setIsListVisible] = useState(true);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Initialize minimize state based on pathname
  const [isMinimized, setIsMinimized] = useState(() => {
    return pathname !== '/projects' && pathname !== '/writing';
  });

  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMinimizeChange = (minimized: boolean) => {
    setIsMinimized(minimized);
  };

  // Only sync minimize state when pathname actually changes (navigation), not on manual toggle
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      const shouldMinimize = pathname !== '/projects' && pathname !== '/writing';
      setIsMinimized(shouldMinimize);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (contentRef.current) {
      const h1Element = contentRef.current.querySelector('h1');

      if (h1Element instanceof HTMLElement) {
        h1Element.tabIndex = -1;
        h1Element.classList.add('outline-none');
        h1Element.focus();
      } else {
        const focusableElement = contentRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElement instanceof HTMLElement) {
          focusableElement.focus();
        }
      }
    }
  }, [isListVisible, pathname]);

  return (
    <div className="flex">
      <div
        ref={listRef}
        className={isMinimized ? "overflow-visible" : "overflow-scroll"}
        style={{
          width: isMinimized ? '80px' : '384px',
          minWidth: isMinimized ? '80px' : '384px',
          maxWidth: isMinimized ? '80px' : '384px',
          flexShrink: 0,
          transition: 'width 0.3s ease-in-out'
        }}
      >
        <SideMenu title="Writing" isInner onMinimizeChange={handleMinimizeChange}>
          <ListLayout list={posts} isMobile={false} />
        </SideMenu>
      </div>
      <div className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-hidden">
        <div
          ref={contentRef}
          className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-scroll"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;