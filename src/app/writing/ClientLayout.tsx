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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Listen for mobile menu toggle events
  useEffect(() => {
    const handleToggleMobileMenu = () => {
      setIsMobileMenuOpen(prev => !prev);
    };

    window.addEventListener('toggleMobileMenu', handleToggleMobileMenu);
    return () => window.removeEventListener('toggleMobileMenu', handleToggleMobileMenu);
  }, []);

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
    <div className="flex relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={listRef}
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          top-0 lg:top-auto
          left-0 lg:left-auto
          h-full lg:h-auto
          z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${isMinimized ? "overflow-visible" : "overflow-scroll"}
        `}
        style={{
          width: isMinimized ? '80px' : '384px',
          minWidth: isMinimized ? '80px' : '384px',
          maxWidth: isMinimized ? '80px' : '384px',
          flexShrink: 0,
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