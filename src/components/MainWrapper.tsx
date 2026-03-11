'use client';

import { useEffect, useRef } from 'react';
import styles from '@/app/rootLayout.module.css';

interface MainWrapperProps {
  children: React.ReactNode;
}

export const MainWrapper: React.FC<MainWrapperProps> = ({ children }) => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Disable transitions on initial load to prevent flash during hydration
    if (mainRef.current) {
      mainRef.current.classList.add('disable-transitions');

      // Remove the class after 2 animation frames to ensure hydration completes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (mainRef.current) {
            mainRef.current.classList.remove('disable-transitions');
          }
        });
      });
    }
  }, []);

  return (
    <main
      id="topElement"
      tabIndex={-1}
      vaul-drawer-wrapper=""
      ref={mainRef}
      className={`${styles.responsiveStyle} md:mt-0 flex flex-col flex-grow w-full bg-white dark:bg-custom-dark-gray`}
    >
      {children}
    </main>
  );
};
