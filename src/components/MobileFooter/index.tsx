'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { footerVisibilityAtom } from '@/utils/store';
import SiteFooter from '@/components/SiteFooter';

const MobileFooter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setFooterVisible] = useAtom(footerVisibilityAtom);

  useEffect(() => {
    const mainElement = document.getElementById('main');
    if (!mainElement) {
      return;
    }

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      // Show footer after scrolling down 200px
      const shouldShow = scrollTop > 200;
      setIsVisible(shouldShow);
      setFooterVisible(shouldShow);  // Sync with global footer visibility atom
    };

    // Add listener to main element
    mainElement.addEventListener('scroll', handleScroll);

    // Also try finding nested scroll containers and add listeners
    const nestedScrollContainers = mainElement.querySelectorAll('.overflow-auto, .overflow-scroll, .overflow-y-auto, .overflow-y-scroll');

    nestedScrollContainers.forEach((container, index) => {
      container.addEventListener('scroll', handleScroll);
    });

    // Check initial scroll position
    const initialScrollTop = mainElement.scrollTop;
    const initialShouldShow = initialScrollTop > 200;
    setIsVisible(initialShouldShow);
    setFooterVisible(initialShouldShow);  // Sync initial state with global atom

    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
      nestedScrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [setFooterVisible]);

  // Don't render the fixed footer wrapper if not visible
  if (!isFooterVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 w-full shadow-lg
        z-50
        transition-all duration-300 ease-in-out
        lg:!hidden
        ${isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'}
      `}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)'
      }}
    >
      <SiteFooter />
    </div>
  );
};

export default MobileFooter;
