'use client';

import SocialLinks from '@/components/SiteMenu/SocialLinks';
import UnderlineLink from '@/components/UnderlineLink';
import { useAtom } from 'jotai';
import { drawerAtom, footerVisibilityAtom } from '@/utils/store';

export const LINKS = [
  { label: 'About', url: '/about' },
  { label: 'Projects', url: '/projects' },
  { label: 'Contact', url: '/contact' },
];

const SiteFooter: React.FC = () => {
  const [, setIsOpen] = useAtom(drawerAtom);
  const closeDrawer = () => setIsOpen(false);
  const [isFooterVisible] = useAtom(footerVisibilityAtom);

  return (
    <>
      {isFooterVisible && (
        <nav className="relative py-5 z-50 flex justify-center space-x-3 border-t dark:border-zinc-800 pb-4 items-center">
          {LINKS.map(link => (
            <UnderlineLink href={link.url} key={link.url} className="text-sm" onClick={closeDrawer}>
              {link.label}
            </UnderlineLink>
          ))}
          <SocialLinks />
        </nav>
      )}
    </>
  );
};

export default SiteFooter;
