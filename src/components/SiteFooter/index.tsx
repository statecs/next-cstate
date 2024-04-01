'use client';

import SocialLinks from '@/components/SiteMenu/SocialLinks';
import UnderlineLink from '@/components/UnderlineLink';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/utils/store';

export const LINKS = [
  { label: 'About', url: '/about' },
  { label: 'Contact', url: '/contact' },
  { label: 'Links', url: '/links' }
];

const SiteFooter: React.FC = () => {
  const [, setIsOpen] = useAtom(drawerAtom);
  const closeDrawer = () => setIsOpen(false);

  return (
    <nav className="relative z-50 flex items-end space-x-3 border-t-2 border-transparent pb-4">
      {LINKS.map(link => (
        <UnderlineLink href={link.url} key={link.url} className="text-sm" onClick={closeDrawer}>
          {link.label}
        </UnderlineLink>
      ))}
      <SocialLinks />
    </nav>
  );
};

export default SiteFooter;
