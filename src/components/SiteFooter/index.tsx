'use client';

import SocialLinks from '@/components/SiteMenu/SocialLinks';
import UnderlineLink from '@/components/UnderlineLink';
import { useAtom } from 'jotai';
import { drawerAtom, footerVisibilityAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const visibleLinks = LINKS.filter(link =>
    link.label !== 'Writing' || isAuthenticated
  );

  return (
    <footer
      className={`
        relative z-10 border-t dark:border-zinc-800
        transition-opacity duration-300
        ${isFooterVisible ? 'opacity-100' : 'opacity-0 sm:opacity-100'}
      `}
    >
      <div
        className="py-5"
        style={{
          backgroundColor: isDark ? '#1c1c1c' : 'white',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          position: 'relative',
          zIndex: 1
        }}
      >
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
      </div>
    </footer>
  );
};

export default SiteFooter;