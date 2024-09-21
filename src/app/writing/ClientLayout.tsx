// ClientLayout.tsx
'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import { usePathname } from 'next/navigation';
import { ListLayout } from '@/components/ListLayout/ListLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ClientLayoutProps {
  children: ReactNode;
  posts: any[];
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, posts }) => {
  const [isListVisible, setIsListVisible] = useState(true);
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);

  const toggleList = () => {
    setIsListVisible(!isListVisible);
  };

  useEffect(() => {
    // Keep the list open only for the root "/projects" path
    if (pathname !== '/writing') {
      setIsListVisible(false);
    } else {
      setIsListVisible(true);
    }
  }, [pathname]);

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      const focusableElements = listElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach((el) => {
        if (isListVisible) {
          (el as HTMLElement).removeAttribute('tabindex');
        } else {
          (el as HTMLElement).setAttribute('tabindex', '-1');
        }
      });
    }
  }, [isListVisible]);

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
      <button
        onClick={toggleList}
        className="hidden lg:block p-2 bg-gray-200 dark:bg-zinc-700 self-start rounded-r-md text-white"
        aria-label={isListVisible ? "Hide writing list" : "Show writing list"}
        aria-expanded={isListVisible}
      >
        {isListVisible ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
      <div className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-scroll">
        {children}
      </div>
    </div>
  </div>
  );
};

export default ClientLayout;