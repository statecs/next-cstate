'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRightIcon, AtSignIcon } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/utils/store';

interface NavigationLinkProps {
  href: string;
  label: string;
  icon?: JSX.Element;
  shortcutNumber?: number;
}

export const NavigationLink = memo<NavigationLinkProps>(({ href, label, icon, shortcutNumber }) => {
  const [, setIsOpen] = useAtom(drawerAtom);
  const closeDrawer = () => setIsOpen(false);
  const pathname = usePathname();
  const iconCmp = icon ?? <AtSignIcon size={16} />;

  const isInternal = href.startsWith('/');
  if (!isInternal) {
    return (
      <a
        key={href}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg p-2 group hover:bg-gray-200 dark:hover:bg-zinc-700"
      >
        {iconCmp}
        <span className="font-medium">{label}</span>
        <div className="flex-grow"></div>
        <ArrowUpRightIcon size={16} />
      </a>
    );
    
  }

  let isActive = (pathname.startsWith(href) && href !== "/") || (href === "/" && pathname === "/");
  
  return (
    <Link href={href} passHref onClick={closeDrawer}>
    <span
      className={cn(
        'group cursor-pointer flex gap-3 items-center rounded-lg p-2',
        isActive ? 'bg-black text-white dark:bg-zinc-700' : 'hover:bg-gray-200 dark:hover:bg-zinc-700'
      )}
    >
      {iconCmp}
      <span className={cn('font-medium', isActive ? 'text-white' : '')}>{label}</span>

      {shortcutNumber && (
        <span
          className={cn(
            'ml-auto hidden h-5 w-5 place-content-center rounded border border-gray-200 bg-gray-100 dark:text-white dark:bg-zinc-700 dark:border-custom-light-gray text-xs font-medium text-gray-500 transition-colors duration-200 group-hover:border-gray-300 group-hover:dark:border-zinc-600 lg:grid',
            isActive ? 'border-gray-600 bg-custom-dark-gray dark:bg-zinc-200 dark:text-custom-dark-gray text-gray-200 group-hover:border-gray-600' : ''
          )}
          title={`Shortcut key: ${shortcutNumber}`}
        >
          {shortcutNumber}
        </span>
      )}

    </span>
  </Link>
  
  );
});

NavigationLink.displayName = 'NavigationLink';
