'use client';

import SocialLinks from '@/components/SiteMenu/SocialLinks';
import UnderlineLink from '@/components/UnderlineLink';
import { useAtom } from 'jotai';
import { drawerAtom, footerVisibilityAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';

const LINKS = [
  { label: 'About', url: '/about' },
  { label: 'Projects', url: '/projects' },
  { label: 'Writing', url: '/writing' },
  { label: 'Contact', url: '/contact' },
];

const SiteFooter: React.FC = () => {
  const [, setIsOpen] = useAtom(drawerAtom);
  const closeDrawer = () => setIsOpen(false);
  const [isFooterVisible] = useAtom(footerVisibilityAtom);
  const { isAuthenticated } = useAuthStatus();

  const visibleLinks = LINKS.filter(link => 
    link.label !== 'Writing' || isAuthenticated
  );

  return (
    <footer className={`
      relative py-5 z-50 border-t dark:border-zinc-800
      transition-opacity duration-300
      ${isFooterVisible ? 'opacity-100' : 'opacity-0 sm:opacity-100'}
    `}>
    
          <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center items-center gap-3">
            <ul className="flex flex-wrap justify-center items-center gap-3 list-none">
              {visibleLinks.map(link => (
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
  );
};

export default SiteFooter;