'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationLink } from './NavigationLink';
import { PROFILES, LINKS } from '@/utils/constants';
import { useAtom } from 'jotai';
import { drawerAtom, userAtom, rolesAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';
import { ChevronDown, LayoutDashboard, LogOut, LogIn, X, UserCircle } from 'lucide-react';
import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface LinkItem {
  href: string;
  label: string;
  icon: JSX.Element;
  shortcutNumber?: number;
}

interface Profile {
  url: string;
  title: string;
  icon?: React.ReactElement;
}

export const MenuContent: React.FC = () => {
  const [, setIsOpen] = useAtom(drawerAtom);
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const { isAuthenticated } = useAuthStatus();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('showWelcomeMessage');
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDrawer = () => setIsOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const filteredLinks = LINKS.filter(link => link.href !== '/writing' || isAuthenticated);

  const userName = user ? `${user.given_name} ${user.family_name}` : 'Christopher State';
  const userRole = roles.length > 0 ? roles[0].name : 'UX & Accessibility Specialist';
  const userEmail = user?.email || 'No email available';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    // Update localStorage when showWelcomeMessage changes
    localStorage.setItem('showWelcomeMessage', JSON.stringify(showWelcomeMessage));
  }, [showWelcomeMessage]);

  const toggleWelcomeMessage = () => {
    setShowWelcomeMessage((prev: boolean) => !prev);
  };

  const handleButtonClick = () => {
    closeDrawer();
    toggleDropdown();
  };

  return (
    <nav aria-label="Main navigation" className="flex w-full flex-col text-sm">
      <div className="flex flex-col gap-4 font-serif">
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="link-card inline-flex items-center gap-2 p-2 w-full text-left mt-4 lg:mt-0"
            >          
              <UserCircle size={30} className="text-gray-500 dark:text-gray-300 opacity-50" />
              <div className="flex-grow">
                <span className="font-semibold tracking-tight">{userName}</span>
                <p className="text-gray-600 dark:text-gray-400">{userRole}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white dark:bg-[#2f2f2f] rounded-lg shadow-lg z-10 border border-gray-200 dark:border-[#ffffff1a]">
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                  <div className="font-medium">{userRole}</div>
                  <div className="truncate">{userEmail}</div>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link onClick={handleButtonClick} href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </li>
                </ul>
                <div className="py-2 border-t border-gray-200 dark:border-gray-600">
                  <LogoutLink className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </LogoutLink>
                </div>
              </div>
            )}
          </div>
        ) : showWelcomeMessage ? (
          <button
          onClick={toggleWelcomeMessage}
          className="link-card inline-flex items-center gap-2 p-2 w-full text-left mt-4 lg:mt-0"
        >
          <Image src="/images/me.jpeg" alt={userName} width={40} height={40} loading="lazy" className="rounded-full border shadow-sm" />
          <div className="flex-grow">
            <span className="font-semibold tracking-tight">{userName}</span>
            <p className="text-gray-600 dark:text-gray-400">{userRole}</p>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

         
        ) : (
          <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md mt-6 lg:mt-0">
          <button
            onClick={toggleWelcomeMessage}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            aria-label="Close welcome message"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-white mb-2">Welcome to My Site</h2>
          <p className="text-white mb-4">Sign in to access all features and personalize your experience.</p>
          <LoginLink className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition duration-300 ease-in-out">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </LoginLink>
        </div>
        )}

        <ul className="flex flex-col gap-1 list-none">
          {filteredLinks.map((link: LinkItem, linkIndex: number) => (
            <li key={link.href}>
              <NavigationLink href={link.href} label={link.label} icon={link.icon} shortcutNumber={linkIndex + 1} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};