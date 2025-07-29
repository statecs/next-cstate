'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

type Props = Pick<PhotoCollection, 'photosCollection' | 'slug'>;

const BannerPhotoCollection: React.FC<Props> = ({ photosCollection, slug }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const pathname = usePathname();
  const isWriting = pathname.startsWith('/writing');
  const basePath = isWriting ? '/writing' : '/projects';

  const photos = photosCollection?.items || [];
  
  if (photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentImageIndex];
  const hasMultipleImages = photos.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-full mb-8 animate-fadeIn animate-duration-1000">
      {/* Main Banner Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
        <Link
          href={`${basePath}/${currentPhoto.collection || slug}/${currentPhoto.slug}`}
          className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 rounded-2xl"
        >
          <Image
            src={currentPhoto.fullSize.url}
            alt={currentPhoto.description || currentPhoto.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            quality={90}
            placeholder={currentPhoto.base64 ? 'blur' : 'empty'}
            blurDataURL={currentPhoto.base64}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Image Title Overlay */}
          {currentPhoto.title && (
            <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-semibold text-lg sm:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight drop-shadow-lg">
                {currentPhoto.title}
              </h3>
            </div>
          )}
        </Link>

        {/* Navigation Arrows for Multiple Images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-800 dark:text-gray-200" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {currentImageIndex + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {hasMultipleImages && (
        <div className="flex justify-center mt-4 space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentImageIndex
                  ? "bg-black dark:bg-white scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip for Multiple Images */}
      {hasMultipleImages && photos.length > 1 && (
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={clsx(
                "relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105",
                index === currentImageIndex
                  ? "ring-2 ring-black dark:ring-white shadow-lg"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={photo.fullSize.url}
                alt={photo.description || photo.title}
                fill
                className="object-cover"
                sizes="100px"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerPhotoCollection;