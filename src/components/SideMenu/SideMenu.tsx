'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ScrollArea } from './ScrollArea';
import { useKeyPress } from '@/hooks/useKeyPress';
import { cn } from '@/utils/helpers';
import React, { useState, useEffect, ReactElement } from 'react';
import { ListLayout } from '@/components/ListLayout/ListLayout';

interface SideMenuProps {
  children: React.ReactNode;
  title?: string;
  isInner?: boolean;
  className?: string;
  onMinimizeChange?: (isMinimized: boolean) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ children, title, isInner, onMinimizeChange }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize minimize state based on pathname
  const [isMinimized, setIsMinimized] = useState(() => {
    return pathname !== '/projects' && pathname !== '/writing';
  });

  const handleMinimizeChange = (minimized: boolean) => {
    setIsMinimized(minimized);
    if (onMinimizeChange) {
      onMinimizeChange(minimized);
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === ListLayout) {
      return React.cloneElement(child as ReactElement<any>, { onMinimizeChange: handleMinimizeChange });
    }
    return child;
  });

  return (
    <ScrollArea
      className={cn(
        'bg-zinc-50 dark:bg-custom-light-gray flex flex-col h-[calc(100vh)] w-full',
        isMinimized ? 'items-center' : ''
      )}
    >
      {title && !isMinimized && (
        <div className={cn(
          "sticky top-0 z-10 border-b dark:border-zinc-700 bg-zinc-50 dark:text-white dark:bg-custom-light-gray px-5 py-3",
          isMinimized ? "px-2" : ''
        )}>
          <div className="flex items-center justify-between">
            {!isMinimized && <h1 className="text-sm font-semibold tracking-tight">{title}</h1>}
          </div>
        </div>
      )}
        <div className={cn(
          "bg-zinc-50 justify-between dark:bg-custom-light-gray dark:text-white p-3",
          isMinimized ? "p-2 flex flex-col items-center": ''
        )}>
          {childrenWithProps}
        </div>
    </ScrollArea>
  );
};