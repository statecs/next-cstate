'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { QrCode, ChevronDown } from 'lucide-react';
import QRCodeModal from '@/components/QRCodeModal';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

// Orbital element configuration - buttons above name, social icons below
const orbitalElements = [
  // Buttons above (top half - 90° spread to prevent overlap)
  { id: 'ask', angle: 270, radius: 240, type: 'button', label: 'Ask Me Anything', href: '#ask-me-anything' },  // Top center (focal point)
  { id: 'projects', angle: 225, radius: 240, type: 'button', label: 'View Projects', href: '/projects' },      // Top-left (45° from center)
  { id: 'writing', angle: 315, radius: 240, type: 'button', label: 'Read Writing', href: '/writing' },        // Top-right (45° from center)

  // Subtitle below name
  { id: 'subtitle', angle: 180, radius: 140, type: 'text' },                                                  // Directly below name

  // Social icons below (bottom half - tight horizontal row)
  { id: 'linkedin', angle: 105, radius: 260, type: 'social', label: 'LinkedIn', href: 'https://linkedin.com/in/state' }, // Bottom-right
  { id: 'qr', angle: 90, radius: 260, type: 'social', label: 'LinkedIn QR Code' },                               // Bottom center
  { id: 'github', angle: 75, radius: 260, type: 'social', label: 'GitHub', href: 'https://github.com/statecs' },    // Bottom-left


];

// Convert polar coordinates to cartesian
const toCartesian = (angle: number, radius: number) => ({
  x: Math.cos((angle * Math.PI) / 180) * radius,
  y: Math.sin((angle * Math.PI) / 180) * radius,
});

// Responsive radius scaling hook
const useResponsiveRadius = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setScale(0.6);        // Mobile
      else if (window.innerWidth < 1024) setScale(0.8); // Tablet
      else setScale(1);                                   // Desktop
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  



  return scale;
};

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

// Magnetic pull effect hook
const useMagneticPull = (
  elementRef: React.RefObject<HTMLElement>,
  mouseX: MotionValue<number>,
  mouseY: MotionValue<number>,
  strength: number = 0.25,
  range: number = 200
) => {
  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const unsubscribe = mouseX.on('change', () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX.get() - centerX;
      const dy = mouseY.get() - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < range) {
        const pullStrength = (range - distance) / range;
        x.set(dx * strength * pullStrength);
        y.set(dy * strength * pullStrength);
      } else {
        x.set(0);
        y.set(0);
      }
    });

    return unsubscribe;
  }, [elementRef, mouseX, mouseY, strength, range, x, y]);

  return { x, y };
};

// Center name expansion animation
const centerVariant = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.12, 0.38, 0.99],
      delay: 0.2,
    },
  },
};

// Orbital element spiral animation (only handles opacity, scale, rotate - not position)
const createOrbitalVariant = (index: number) => {
  return {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.5 + index * 0.1,
      },
    },
  };
};

// Drag configuration
const dragConfig = {
  drag: true as const,
  dragConstraints: { left: -80, right: 80, top: -80, bottom: 80 },
  dragElastic: 0.7,
  dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
  whileDrag: { scale: 1.15, zIndex: 50, cursor: 'grabbing' },
};

// Orbital Element Component
interface OrbitalElementProps {
  element: typeof orbitalElements[0];
  position: { x: number; y: number };
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  prefersReducedMotion: boolean;
  onQRClick: () => void;
}

const OrbitalElement: React.FC<OrbitalElementProps> = ({
  element,
  position,
  index,
  mouseX,
  mouseY,
  prefersReducedMotion,
  onQRClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const magneticPull = useMagneticPull(ref, mouseX, mouseY, 0.25, 200);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const variant = createOrbitalVariant(index);

  // Create motion values for position
  const finalX = useMotionValue(position.x);
  const finalY = useMotionValue(position.y);

  // Mark animation as complete after it finishes
  useEffect(() => {
    const animationDelay = 500 + index * 100;
    const animationDuration = 800;

    const timeout = setTimeout(() => {
      setIsAnimationComplete(true);
    }, animationDelay + animationDuration);

    return () => clearTimeout(timeout);
  }, [index]);

  // Update position when magnetic pull changes (only after animation complete)
  useEffect(() => {
    if (!prefersReducedMotion && isAnimationComplete) {
      const unsubX = magneticPull.x.on('change', (latest) => {
        finalX.set(position.x + latest);
      });
      const unsubY = magneticPull.y.on('change', (latest) => {
        finalY.set(position.y + latest);
      });
      return () => {
        unsubX();
        unsubY();
      };
    } else {
      finalX.set(position.x);
      finalY.set(position.y);
    }
  }, [magneticPull.x, magneticPull.y, position.x, position.y, prefersReducedMotion, isAnimationComplete, finalX, finalY]);

  const renderContent = () => {
    switch (element.type) {
      case 'button':
        // Special handling for "Ask Me Anything" button
        if (element.id === 'ask') {
          const scrollToAskSection = () => {
            const mainElement = document.getElementById('main');
            if (mainElement) {
              const aiSection = mainElement.querySelector('section:has(.inline-flex .animate-pulse)');
              if (aiSection) {
                aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Focus the input field after scroll completes
                setTimeout(() => {
                  const inputElement = document.getElementById('queryInput') as HTMLInputElement;
                  if (inputElement) {
                    inputElement.focus();
                  }
                }, 500); // Delay to allow smooth scroll to complete
              }
            }
          };

          return (
            <button
              onClick={scrollToAskSection}
              className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-base lg:text-lg hover:scale-105 transition-transform shadow-xl whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {element.label}
            </button>
          );
        }

        return (
          <Link
            href={element.href!}
            className="px-7 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-base lg:text-lg hover:scale-105 transition-transform shadow-xl whitespace-nowrap"
          >
            {element.label}
          </Link>
        );

      case 'social':
        if (element.id === 'qr') {
          return (
            <button
              onClick={onQRClick}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-transform shadow-lg text-gray-700 dark:text-gray-300"
              aria-label={element.label}
            >
              <QrCode className="w-6 h-6" />
            </button>
          );
        }

        const Icon = element.id === 'github' ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );

        return (
          <a
            href={element.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-transform shadow-lg text-gray-700 dark:text-gray-300"
            aria-label={element.label}
          >
            {Icon}
          </a>
        );



      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        x: finalX,
        y: finalY,
        translateX: '-50%',
        translateY: '-50%',
        willChange: 'transform',
      }}
      variants={variant}
      initial="hidden"
      animate="visible"
      {...(prefersReducedMotion ? {} : dragConfig)}
    >
      {renderContent()}
    </motion.div>
  );
};

// Simplified Mobile Hero
const SimplifiedHeroMobile: React.FC<{ onQRClick: () => void }> = ({ onQRClick }) => (
  <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/60 dark:from-custom-dark-gray dark:via-gray-900/95 dark:to-black/98">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 text-center max-w-lg"
    >
      <h1 className="text-5xl font-serif font-bold leading-tight">
        <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-50 dark:to-white bg-clip-text text-transparent">
          Christopher
        </span>
        <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-50 dark:to-white bg-clip-text text-transparent">
          State
        </span>
      </h1>

      <p className="text-base text-gray-700/90 dark:text-gray-200/90 leading-loose">
        Building accessible products — from concept to code.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/projects"
          className="px-7 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold transition-transform hover:scale-105"
        >
          View Projects
        </Link>
        <button
          onClick={() => {
            const mainElement = document.getElementById('main');
            if (mainElement) {
              const aiSection = mainElement.querySelector('section:has(.inline-flex .animate-pulse)');
              if (aiSection) {
                aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Focus the input field after scroll completes
                setTimeout(() => {
                  const inputElement = document.getElementById('queryInput') as HTMLInputElement;
                  if (inputElement) {
                    inputElement.focus();
                  }
                }, 500); // Delay to allow smooth scroll to complete
              }
            }
          }}
          className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold transition-transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Ask Me Anything
        </button>
        <Link
          href="/writing"
          className="px-7 py-3.5 border-2 border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 rounded-full font-semibold transition-transform hover:scale-105"
        >
          Read Writing
        </Link>
      </div>

      <div className="flex gap-4 justify-center">
        <a
          href="https://github.com/statecs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 hover:scale-110 transform"
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
          className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 hover:scale-110 transform"
          aria-label="LinkedIn"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <button
          onClick={onQRClick}
          className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 hover:scale-110 transform"
          aria-label="Show LinkedIn QR Code"
        >
          <QrCode className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  </section>
);

// Main Hero Section Component
const HeroSection: React.FC = () => {
  const { x: mouseX, y: mouseY } = useMousePosition();
  const prefersReducedMotion = useReducedMotion();
  const radiusScale = useResponsiveRadius();
  const isMobile = useIsMobile(768);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <SimplifiedHeroMobile onQRClick={() => setIsQRModalOpen(true)} />
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          url="https://linkedin.com/in/state"
          title="Connect on LinkedIn"
        />
      </>
    );
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50/80 to-gray-100/60 dark:from-custom-dark-gray dark:via-gray-900/95 dark:to-black/98"
      style={{
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translate3d(0,0,0)',
      }}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent dark:via-white/5 animate-pulse" style={{ animationDuration: '3s' }} />

      {/* Center: Name */}
      <motion.div
        className="relative z-20 pointer-events-none"
        variants={centerVariant}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-center leading-tight">
          <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-50 dark:to-white bg-clip-text text-transparent">
            Christopher
          </span>
          <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-50 dark:to-white bg-clip-text text-transparent">
            State
          </span>

          <p className="text-base mt-4 lg:text-lg text-gray-700 dark:text-gray-300 text-center font-light leading-relaxed px-4">
            Building accessible products — from concept to code.
          </p>
        </h1>
      </motion.div>

      {/* Orbital Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative pointer-events-auto w-0 h-0">
          {/* Debug: Center crosshair (remove after testing) */}
          {process.env.NODE_ENV !== 'development' && (
            <>
              <div className="absolute w-20 h-0.5 bg-red-500 -translate-x-1/2 z-50" />
              <div className="absolute h-20 w-0.5 bg-red-500 -translate-y-1/2 z-50" />
              <div
                className="absolute border-2 border-blue-500/30 rounded-full pointer-events-none"
                style={{
                  width: `${240 * radiusScale * 2}px`,
                  height: `${240 * radiusScale * 2}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </>
          )}

          {orbitalElements.map((element, i) => {
            const { x, y } = toCartesian(element.angle, element.radius * radiusScale);
            return (
              <OrbitalElement
                key={element.id}
                element={element}
                position={{ x, y }}
                index={i}
                mouseX={mouseX}
                mouseY={mouseY}
                prefersReducedMotion={prefersReducedMotion}
                onQRClick={() => setIsQRModalOpen(true)}
              />
            );
          })}
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

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url="https://linkedin.com/in/state"
        title="Connect on LinkedIn"
      />
    </section>
  );
};

export default HeroSection;
