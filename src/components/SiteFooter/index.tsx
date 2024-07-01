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
        <footer className="relative py-5 z-50 border-t dark:border-zinc-800 pb-4">
          <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center items-center gap-3">
            <ul className="flex flex-wrap justify-center items-center gap-3 list-none">
              {LINKS.map(link => (
                <li key={link.url}>
                  <UnderlineLink href={link.url} className="text-sm" onClick={closeDrawer}>
                    {link.label}
                  </UnderlineLink>
                </li>
              ))}
            </ul>
            <SocialLinks />
          </nav>
        </footer>
      )}
    </>
  );
};

export default SiteFooter;
