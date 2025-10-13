'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface FeaturedItem {
  title: string;
  description?: string;
  image: string;
  url: string;
  category?: string;
  type: 'project' | 'writing';
}

interface FeaturedBannerProps {
  items: FeaturedItem[];
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 animate-fadeIn" style={{ animationDelay: '200ms' }}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-serif">
          Featured Work
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Highlights from my latest projects and writings
        </p>
      </div>

      <div className="relative group">
        {/* Main Banner */}
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Link
            href={currentItem.url}
            className="block w-full h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-4 rounded-3xl"
          >
            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 lg:p-16">
              {/* Category Badge */}
              {currentItem.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {currentItem.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight font-serif transform transition-transform duration-300 group-hover:translate-x-2">
                {currentItem.title}
              </h3>

              {/* Description */}
              {currentItem.description && (
                <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed font-light transform transition-transform duration-300 group-hover:translate-x-2">
                  {currentItem.description}
                </p>
              )}

              {/* Type Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {currentItem.type === 'project' ? 'Project' : 'Article'}
              </div>
            </div>
          </Link>

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/30 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/30 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>
            </>
          )}

          {/* Progress Bar */}
          {items.length > 1 && isAutoPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / items.length) * 100}%`
                }}
              />
            </div>
          )}
        </div>

        {/* Dot Indicators */}
        {items.length > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  index === currentIndex
                    ? "w-12 h-3 bg-black dark:bg-white"
                    : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                )}
                aria-label={`Go to slide ${index + 1}: ${item.title}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        )}

        {/* Thumbnail Strip (Desktop) */}
        {items.length > 1 && items.length <= 5 && (
          <div className="hidden lg:flex gap-4 mt-8 overflow-x-auto pb-2">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105",
                  index === currentIndex
                    ? "ring-4 ring-black dark:ring-white shadow-xl scale-105"
                    : "opacity-60 hover:opacity-100 shadow-md"
                )}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="150px"
                  quality={60}
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent",
                  index === currentIndex ? "opacity-0" : ""
                )} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBanner;
