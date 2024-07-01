'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NavigationLink } from './NavigationLink';
import { PROFILES, LINKS } from '@/utils/constants';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/utils/store';

interface LinkItem {
  href: string;
  label: string;
  icon: JSX.Element; // Assuming icon is a JSX element, adjust as necessary based on actual data structure
  shortcutNumber?: number;
}

interface Profile {
  url: string;
  title: string;
  icon?: React.ReactElement; // Making icon optional or ensure it's always provided
}

export const MenuContent: React.FC = () => {
  const [, setIsOpen] = useAtom(drawerAtom);
  const closeDrawer = () => setIsOpen(false);
  
  return (
    <nav aria-label="Main navigation" className="flex w-full flex-col text-sm">
      <div className="flex flex-col gap-4 font-serif">
        <Link href="/" passHref onClick={closeDrawer} className="link-card inline-flex items-center gap-2 p-2">
          <Image
            src="/images/me.jpeg"
            alt="Christopher State"
            width={40}
            height={40}
            loading="lazy"
            className="rounded-full border shadow-sm"
          />
          <div>
            <span className="font-semibold tracking-tight">Christopher State</span>
            <p className="text-gray-600 dark:text-gray-400">UX/UI Engineer & Accessibility Specialist</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-1 pb-4 list-none">
          {LINKS.map((link: LinkItem, linkIndex: number) => (
            <li key={link.href}>
              <NavigationLink
                href={link.href}
                label={link.label}
                icon={link.icon}
                shortcutNumber={linkIndex + 1}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2 text-sm dark:border-zinc-700 border-t pt-4">
        <ul className="flex flex-col gap-1 list-none">
          {Object.values(PROFILES).map((profile: Profile) => (
            <li key={profile.url}>
              <NavigationLink href={profile.url} label={profile.title} icon={profile.icon} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
