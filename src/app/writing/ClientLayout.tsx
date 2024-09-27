// ClientLayout.tsx
'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import { ListLayout } from '@/components/ListLayout/ListLayout';

interface ClientLayoutProps {
  children: ReactNode;
  posts: any[];
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, posts }) => {
  const [isListVisible, setIsListVisible] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);


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
      <div className="lg:bg-dots flex-1 h-[calc(100vh-110px)] lg:h-[calc(100vh)] overflow-scroll">
        {children}
      </div>
    </div>
  </div>
  );
};

export default ClientLayout;