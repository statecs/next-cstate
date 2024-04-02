'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ScrollArea } from './ScrollArea';
import { useKeyPress } from '@/hooks/useKeyPress';
import { cn } from '@/utils/helpers';

const keyCodePathnameMapping: { [key: string]: string | undefined } = {
  Digit1: '/',
  Digit2: '/about',
  Digit3: '/writing',
  Digit4: '/journey',
  Digit5: '/links',
  Digit6: '/bookmarks',
  Digit7: '/contact',
};

interface SideMenuProps {
  children: React.ReactNode;
  title?: string;
  isInner?: boolean;
  className?: string; // Add this line if className should be accepted
}

export const SideMenu: React.FC<SideMenuProps> = ({ children, title, isInner }) => {
  const router = useRouter();
  const pathname = usePathname();
  useKeyPress(onKeyPress, Object.keys(keyCodePathnameMapping));

  function onKeyPress(event: KeyboardEvent) {
    const key = event.code;
    const targetPathname = keyCodePathnameMapping[key];
    if (targetPathname && targetPathname !== pathname) router.push(targetPathname);
  }

  return (
    <ScrollArea
      className={cn(
        'hidden bg-zinc-50 dark:bg-custom-dark-gray lg:flex lg:flex-col',
        isInner ? 'lg:w-80 xl:w-96' : 'lg:w-60 xl:w-72'
      )}
    >
      
      {title && (
        <div className="sticky top-0 z-10 border-b bg-zinc-50 dark:text-white dark:bg-custom-light-gray px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tight">{title}</span>
          </div>
        </div>
      )}
      <div className="bg-zinc-50 dark:bg-custom-dark-gray dark:text-white p-3">{children}</div>
    </ScrollArea>
  );
};
