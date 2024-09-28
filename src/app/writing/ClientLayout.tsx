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
  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
        className={`transition-all duration-300 ${isListVisible ? 'w-128' : 'w-0'} overflow-scroll`}
        aria-hidden={!isListVisible}
      >
        <SideMenu title="Writing" isInner>
          <ListLayout list={posts} isMobile />
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