'use client';
import { useRouter, usePathname } from 'next/navigation';
import { ScrollArea } from './ScrollArea';
import { useKeyPress } from '@/hooks/useKeyPress';
import { cn } from '@/utils/helpers';
import { useState, useEffect } from 'react';
import { useAuthStatus } from '@/contexts/AuthContext';

interface SideMenuProps {
  children: React.ReactNode;
  title?: string;
  isInner?: boolean;
  className?: string;
}

export const SideMenu: React.FC<SideMenuProps> = ({ children, title, isInner }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuthStatus();
  const [keyCodePathnameMapping, setKeyCodePathnameMapping] = useState<{ [key: string]: string | undefined }>({
    Digit1: '/',
    Digit2: '/about',
    Digit3: '/projects',
    Digit4: '/links',
    Digit5: '/contact',
  });

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        setKeyCodePathnameMapping(prevMapping => ({
          ...prevMapping,
          Digit5: '/writing',
          Digit6: '/contact'
        }));
      } else {
        setKeyCodePathnameMapping(prevMapping => ({
          ...prevMapping,
          Digit5: '/contact'
        }));
      }
    }
  }, [isAuthenticated, loading]);

  useKeyPress(onKeyPress, Object.keys(keyCodePathnameMapping));

  function onKeyPress(event: KeyboardEvent) {
    const key = event.code;
    const targetPathname = keyCodePathnameMapping[key];
    if (targetPathname && targetPathname !== pathname) router.push(targetPathname);
  }

  return (
    <ScrollArea
      className={cn(
        'hidden bg-zinc-50 dark:bg-custom-light-gray lg:flex lg:flex-col h-[calc(100vh)]',
        isInner ? 'lg:w-80 xl:w-96 border-l dark:border-zinc-700' : 'lg:w-60 xl:w-72'
      )}
    >
      {title && (
        <div className="sticky top-0 z-10 border-b dark:border-zinc-700 bg-zinc-50 dark:text-white dark:bg-custom-light-gray px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tight">{title}</span>
          </div>
        </div>
      )}
      <div className="bg-zinc-50 font-serif dark:bg-custom-light-gray dark:text-white p-3">{children}</div>
    </ScrollArea>
  );
};