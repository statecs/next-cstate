'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Coffee, Code, Heart, Zap, Rocket, Star, Music, Book, Camera, Palette } from 'lucide-react';

interface AboutSnippetProps {
  title?: string;
  description?: string;
}

const AboutSnippet: React.FC<AboutSnippetProps> = ({
  title = "About Me",
  description
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showEmojiRain, setShowEmojiRain] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const funFacts = [
    { icon: <Coffee className="w-4 h-4" />, text: "Powered by coffee ☕" },
    { icon: <Code className="w-4 h-4" />, text: "10,000+ lines of code" },
    { icon: <Heart className="w-4 h-4" />, text: "Obsessed with accessibility" },
    { icon: <Zap className="w-4 h-4" />, text: "Fast learner, faster coder" },
    { icon: <Rocket className="w-4 h-4" />, text: "Always shipping! 🚀" },
    { icon: <Star className="w-4 h-4" />, text: "Pixel perfectionist ✨" },
    { icon: <Music className="w-4 h-4" />, text: "Coding to lo-fi beats 🎵" },
    { icon: <Book className="w-4 h-4" />, text: "Learning something new 📚" },
    { icon: <Camera className="w-4 h-4" />, text: "Photography enthusiast 📸" },
    { icon: <Palette className="w-4 h-4" />, text: "Design is my passion 🎨" }
  ];

  const emojiList = ['🎉', '✨', '🚀', '💫', '⚡', '🌟', '💥', '🎊', '🎈', '🔥', '💖', '🌈', '⭐', '🎯', '🏆'];

  // Rotate fun facts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSayHiClick = () => {
    setShowConfetti(true);
    setClickCount(prev => prev + 1);

    // Easter egg after 5 clicks
    if (clickCount === 4) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 5000);
    }

    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handlePhotoHover = () => {
    setShowEmojiRain(true);
    setTimeout(() => setShowEmojiRain(false), 3000);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '300ms' }}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Animated Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 dark:opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
            animationDuration: '4s'
          }} />
        </div>

        {/* Floating Orbs - MORE OF THEM! */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />

        {/* Easter Egg Celebration */}
        {showEasterEgg && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-6xl sm:text-8xl animate-bounce">
              🎉 WOW! 🎉
            </div>
          </div>
        )}

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 sm:p-12">
          {/* Left Column - Interactive Badge Area */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative group">
              {/* Emoji Rain on hover */}
              {showEmojiRain && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-2xl animate-float-up"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '100%',
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '3s'
                      }}
                    >
                      {emojiList[Math.floor(Math.random() * emojiList.length)]}
                    </div>
                  ))}
                </div>
              )}

              {/* Animated particles */}
              <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>

              {/* Rainbow glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-yellow-400 to-pink-400 rounded-3xl blur-2xl opacity-40 animate-pulse" style={{ animationDuration: '2s' }} />
              </div>

              {/* Regular glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300 rounded-3xl blur-2xl opacity-30 group-hover:opacity-0 transition-opacity duration-300 animate-pulse" style={{ animationDuration: '3s' }} />

              {/* Interactive container with gradient background */}
              <div className="relative">
                <div
                  className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 cursor-pointer flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
                  onMouseEnter={handlePhotoHover}
                >
                  {/* Large initials or icon */}
                  <div className="text-white text-8xl font-bold font-serif">CS</div>
                </div>

                {/* Floating badge with MEGA confetti */}
                <button
                  onClick={handleSayHiClick}
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 rounded-2xl shadow-xl p-4 border-2 border-white dark:border-gray-700 hover:scale-125 transition-all duration-300 cursor-pointer group/badge animate-pulse hover:animate-none"
                  style={{ animationDuration: '2s' }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white group-hover/badge:animate-spin" />
                    <span className="text-sm font-bold text-white">Say hi!</span>
                  </div>

                  {/* MEGA Confetti effect */}
                  {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 rounded-full animate-ping"
                          style={{
                            backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF4500', '#9370DB', '#00FF00', '#FF1493'][i % 7],
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translate(${Math.cos(i * 0.209) * 80}px, ${Math.sin(i * 0.209) * 80}px)`,
                            animationDuration: '1.5s',
                            animationDelay: `${i * 0.03}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>

                {/* Rotating fun fact badge - ENHANCED */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-2xl p-3 border-2 border-white dark:border-gray-700 animate-bounce hover:animate-none hover:scale-110 transition-all cursor-pointer" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2 text-white">
                    <div className="transition-all duration-300 animate-pulse">
                      {funFacts[currentFactIndex].icon}
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">
                      {funFacts[currentFactIndex].text}
                    </span>
                  </div>
                </div>

                {/* Click counter easter egg hint */}
                {clickCount > 0 && clickCount < 5 && (
                  <div className="absolute top-0 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                    {5 - clickCount} more...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm mb-4 hover:scale-110 transition-all duration-200 animate-pulse cursor-pointer" style={{ animationDuration: '2s' }}>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Get to know me</span>
              </div>

              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4"
                style={{
                  lineHeight: '1.3',
                  paddingBottom: '0.1em'
                }}
              >
                <span
                  className="bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 dark:from-white dark:via-pink-400 dark:to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
                  style={{
                    display: 'inline-block',
                    paddingBottom: '0.08em'
                  }}
                >
                  {title}
                </span>
              </h2>
            </div>

            {description && (
              <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="line-clamp-4">
                  {description}
                </p>
              </div>
            )}

            {!description && (
              <div className="space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  I&apos;m a UX & Accessibility Specialist passionate about creating inclusive digital experiences
                  that work beautifully for everyone.
                </p>
                <p className="line-clamp-2">
                  With over 8 years of experience in design and development, I focus on bridging the gap
                  between aesthetic excellence and universal usability.
                </p>
              </div>
            )}

            {/* ENHANCED Quick Stats with animations */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group/stat bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse" style={{ animationDuration: '2s' }}>8+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
              </div>
              <div className="relative group/stat bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse" style={{ animationDuration: '2.5s' }}>100%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Accessibility</div>
                </div>
              </div>
            </div>

            {/* ENHANCED CTA Button */}
            <div className="pt-4">
              <Link
                href="/about"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white text-white dark:text-black rounded-full font-bold hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Read Full Story</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating emoji animation */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
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

export default AboutSnippet;
