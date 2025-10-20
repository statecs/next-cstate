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
}

export const NavigationLink = memo<NavigationLinkProps>(({ href, label, icon }) => {
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
        className="flex font-serif items-center gap-3 rounded-lg p-2 group text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold"
      >
        {iconCmp}
        <span>{label}</span>
        <div className="flex-grow"></div>
        <ArrowUpRightIcon size={16} />
      </a>
    );
    
  }

  let isActive = (pathname.startsWith(href) && href !== "/") || (href === "/" && pathname === "/");
  
  return (
    <Link 
      href={href} 
      passHref 
      onClick={closeDrawer} 
      aria-current={isActive ? 'page' : undefined}>
    <span
      className={cn(
        'group cursor-pointer flex gap-3 items-center rounded-lg p-2 font-bold',
        isActive ? 'bg-black text-white dark:bg-zinc-700' : 'text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
      )}
    >
      {iconCmp}
      <span className={cn('', isActive ? 'text-white' : '')}>{label}</span>

    </span>
  </Link>
  
  );
});

NavigationLink.displayName = 'NavigationLink';
