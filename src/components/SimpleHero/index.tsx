'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SimpleHero: React.FC = () => {
  const router = useRouter();

  const scrollToChat = () => {
    // Find the main scroll container
    const mainElement = document.getElementById('main');
    const chatSection = document.getElementById('ai-assistant');

    if (chatSection) {
      // Scroll to the AI assistant section by ID
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (mainElement) {
      // Fallback: scroll to AI section by index (4th section)
      const sections = mainElement.querySelectorAll('section');
      if (sections.length > 3) {
        sections[3].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Last resort: scroll to a calculated position
      window.scrollTo({
        top: window.innerHeight * 3,
        behavior: 'smooth'
      });
    }

    // Focus on the chat input field after scrolling
    setTimeout(() => {
      const chatInput = document.getElementById('queryInput');
      if (chatInput) {
        chatInput.focus();
      }
    }, 800); // Delay to allow smooth scroll to complete
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
              unoptimized
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

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Primary CTA - View My Work */}
          <button
            onClick={() => router.push('/projects')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white text-black rounded-full font-semibold text-lg hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl animate-fadeIn"
            style={{ animationDelay: '800ms' }}
            aria-label="View my projects"
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          {/* Secondary CTA - Ask Me Anything */}
          <button
            onClick={scrollToChat}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl animate-fadeIn"
            style={{ animationDelay: '1000ms' }}
            aria-label="Scroll to chat with AI assistant"
          >
            Ask me anything
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>

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
