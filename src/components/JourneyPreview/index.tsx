'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

interface JourneyEvent {
  title: string;
  description?: string;
  year: string;
  url?: string;
}

interface JourneyPreviewProps {
  events: JourneyEvent[];
}

const JourneyPreview: React.FC<JourneyPreviewProps> = ({ events }) => {
  // Get most recent 4 events
  const recentEvents = events.slice(0, 4);

  if (recentEvents.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '500ms' }}>
      <div className="text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3"
          style={{
            lineHeight: '1.3',
            paddingBottom: '0.1em'
          }}
        >
          <span
            className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            style={{
              display: 'inline-block',
              paddingBottom: '0.08em'
            }}
          >
            My Journey
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Key milestones and achievements throughout my career
        </p>
      </div>

      <div className="relative">
        {/* Timeline container - Horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto pb-4 scrollbar-hide lg:overflow-visible">
          <div className="flex lg:grid lg:grid-cols-2 gap-6 min-w-max lg:min-w-0">
            {recentEvents.map((event, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0 w-[340px] sm:w-96 lg:w-auto animate-fadeIn"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                {/* Card */}
                <div className="relative h-full min-h-[200px] bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-white/10 overflow-hidden group-hover:scale-[1.02]">
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow-lg">
                      {event.year}
                    </div>
                  </div>

                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 dark:from-gray-500 dark:via-gray-300 dark:to-gray-500" />

                  {/* Content */}
                  <div className="p-5 pt-14">
                    {/* Timeline dot */}
                    <div className="absolute top-5 left-5 w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-lg">
                      <Plus className="w-3.5 h-3.5 text-white dark:text-black" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 font-serif leading-tight pr-16">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {/* Link indicator */}
                    {event.url && (
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Optional link wrapper */}
                {event.url && (
                  <Link
                    href={event.url}
                    className="absolute inset-0 z-20"
                    aria-label={`Learn more about ${event.title}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint for mobile */}
        <div className="lg:hidden flex justify-center items-center gap-2 mt-6 text-sm text-gray-400 dark:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <span>Scroll to see more</span>
        </div>
      </div>

      {/* View Full Journey CTA */}
      <div className="text-center mt-12">
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          View Full Journey
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default JourneyPreview;
