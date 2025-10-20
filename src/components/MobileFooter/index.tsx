'use client';

import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';

const MobileFooter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mainElement = document.getElementById('main');
    if (!mainElement) {
      console.log('MobileFooter: main element not found');
      return;
    }

    console.log('MobileFooter: main element found', mainElement);

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      console.log('MobileFooter: scroll detected on', target.id || target.className, 'scrollTop:', scrollTop);
      // Show footer after scrolling down 200px
      const shouldShow = scrollTop > 200;
      console.log('MobileFooter: shouldShow', shouldShow);
      setIsVisible(shouldShow);
    };

    // Add listener to main element
    mainElement.addEventListener('scroll', handleScroll);
    console.log('MobileFooter: scroll listener added to main');

    // Also try finding nested scroll containers and add listeners
    const nestedScrollContainers = mainElement.querySelectorAll('.overflow-auto, .overflow-scroll, .overflow-y-auto, .overflow-y-scroll');
    console.log('MobileFooter: found nested scroll containers:', nestedScrollContainers.length);

    nestedScrollContainers.forEach((container, index) => {
      console.log(`MobileFooter: adding listener to nested container ${index}:`, container.className);
      container.addEventListener('scroll', handleScroll);
    });

    // Check initial scroll position
    const initialScrollTop = mainElement.scrollTop;
    console.log('MobileFooter: initial scrollTop', initialScrollTop);
    setIsVisible(initialScrollTop > 200);

    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
      nestedScrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

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
