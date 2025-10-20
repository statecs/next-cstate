'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Check if we're in an iframe
    setIsInIframe(window.self !== window.top);

    // Check if screen is small (≤375px)
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 375);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <section
      className={`relative ${isInIframe || isSmallScreen ? 'min-h-[95vh]' : 'min-h-[85vh]'} md:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center px-4 py-6 md:py-12 lg:py-16 overflow-hidden`}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translate3d(0,0,0)'
      }}
    >
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-custom-dark-gray dark:via-gray-900 dark:to-black"
        style={{
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent dark:via-white/5 animate-pulse"
             style={{ animationDuration: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center animate-fadeIn">

        {/* Profile Image with Glow Effect */}
        <div className="mb-4 sm:mb-6 md:mb-8 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300 rounded-full blur-2xl opacity-40 animate-pulse"
                 style={{ animationDuration: '2s' }} />
            <div className="relative">
              <Image
                src="/images/me.jpeg"
                alt="Christopher State"
                width={120}
                height={120}
                className="sm:w-[140px] sm:h-[140px] rounded-full shadow-2xl ring-4 ring-white dark:ring-gray-800 hover:scale-105 transition-transform duration-300"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="mb-4 sm:mb-5 md:mb-6">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight font-serif mb-2 sm:mb-3 md:mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Christopher State
            </span>
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-600 dark:text-gray-400 tracking-wide">
            UX & Accessibility Specialist
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 font-light">
          Crafting inclusive digital experiences through thoughtful design,
          accessible interfaces, and human-centered solutions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
          <Link
            href="/projects"
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/writing"
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-gray-900 dark:hover:bg-gray-200 hover:text-white dark:hover:text-black hover:scale-105 hover:shadow-xl whitespace-nowrap"
          >
            Read Writing
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8">
          <a
            href="https://github.com/statecs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 hover:scale-110 transform"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/state"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 hover:scale-110 transform"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center animate-bounce hover:animate-none">
        <button
          onClick={scrollToContent}
          className="cursor-pointer group"
          aria-label="Scroll to content"
        >
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors duration-200">
            <span className="text-sm font-medium tracking-wide">Explore</span>
            <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-200" />
          </div>
        </button>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
