import Link from 'next/link';
import Image from 'next/image';
import { NavigationLink } from './NavigationLink';
import { PROFILES, LINKS } from '@/utils/constants';

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
  return (
    <div className="flex w-full flex-col text-sm">
      <div className="flex flex-col gap-4">
        <Link href="/" passHref>
          <div className="link-card inline-flex items-center gap-2 p-2">
            <Image
              src="/images/me.jpeg"
              alt="Christopher State"
              width={40}
              height={40}
              loading="lazy"
              className="rounded-full border shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight">Christopher State</span>
              <span className="text-gray-400">Design Technologist</span>
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-1 pb-4">
          {LINKS.map((link: LinkItem, linkIndex: number) => (
            <NavigationLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              shortcutNumber={linkIndex + 1}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm dark:border-zinc-700 border-t pt-4">
        <div className="flex flex-col gap-1">
          {Object.values(PROFILES).map((profile: Profile) => (
            <NavigationLink key={profile.url} href={profile.url} label={profile.title} icon={profile.icon} />
          ))}
        </div>
      </div>
    </div>
  );
};
