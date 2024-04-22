'use client';
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { footerVisibilityAtom } from '@/utils/store';
import Image from 'next/image';
import Link from 'next/link';

const AboutSection: React.FC = () => {
const [isFooterVisible] = useAtom(footerVisibilityAtom);
const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


  return (
    <>
      {(!isMobile || (isMobile && isFooterVisible)) && (
         <>
            <div className="link-card transition duration-500 ease-in-out inline-flex justify-center items-center gap-2 p-2">
              <Image
                src="/images/me.jpeg"
                alt="A smiling person with glasses in a striped shirt against a gray background."
                width={0}
                height={0}
                sizes="(max-width: 768px) 250px, 100vw"
                style={{ width: '120px', height: '120px' }}
                loading="lazy"
                className="rounded-full border shadow-sm"
                />
            </div>
            <Link
              className="group w-full"
              href={`/about`}
            >
              <div className="link-card inline-flex justify-center items-center gap-2 p-2">
                  <div className="flex flex-col">
                  <h1 className="font-serif text-xl text-black sm:text-2xl dark:text-white">Christopher State</h1>
                  <span className="text-gray-600 dark:text-gray-400">Design Technologist</span>
                  </div>
              </div>
            </Link>
        </>
      )}
    </>
  );

};

export default AboutSection;
