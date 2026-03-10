'use client';

import React from 'react';
import Image from 'next/image';

const SimpleHero: React.FC = () => {
  const scrollToContent = () => {
    // Find the main scroll container
    const mainElement = document.getElementById('main');

    if (mainElement) {
      // Find the next section after the hero
      const sections = mainElement.querySelectorAll('section');
      if (sections.length > 1) {
        // Scroll to the second section (first one after hero)
        sections[1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll by viewport height
        mainElement.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    } else {
      // Fallback to window scroll
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black dark:bg-custom-dark-gray px-4 py-20 animate-fadeIn">
      <div className="max-w-4xl mx-auto text-center">
        {/* Profile Image */}
        <div className="mb-8 flex justify-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-gray-800 dark:ring-gray-700">
            <Image
              src="/images/me.jpeg"
              alt="Christopher State"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-serif text-white mb-6 animate-fadeIn"
          style={{ animationDelay: '400ms', lineHeight: '1.1' }}
        >
          Hi, I&apos;m Christopher State.
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl sm:text-2xl md:text-3xl text-gray-300 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-fadeIn"
          style={{ animationDelay: '600ms' }}
        >
          Building accessible products — from concept to code.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToContent}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white text-black rounded-full font-semibold text-lg hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl animate-fadeIn"
          style={{ animationDelay: '800ms' }}
          aria-label="Scroll to view my work"
        >
          View My Work
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Optional: Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fadeIn"
          style={{ animationDelay: '1000ms' }}
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gray-600 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;
