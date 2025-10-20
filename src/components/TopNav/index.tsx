'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PROFILES, LINKS } from '@/utils/constants';
import { useAtom } from 'jotai';
import { userAtom, rolesAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';
import { ChevronDown, LayoutDashboard, LogOut, LogIn, UserCircle, ArrowUpRightIcon } from 'lucide-react';
import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { cn } from '@/utils/helpers';

interface LinkItem {
  href: string;
  label: string;
  icon: JSX.Element;
}

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const { isAuthenticated } = useAuthStatus();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user ? `${user.given_name} ${user.family_name}` : 'Christopher State';
  const userRole = roles.length > 0 ? roles[0].name : 'UX & Accessibility Specialist';
  const userEmail = user?.email || 'No email available';

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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

  const isActive = (href: string) => {
    return (pathname.startsWith(href) && href !== "/") || (href === "/" && pathname === "/");
  };

  return (
    <nav className="hidden lg:flex items-center justify-between w-full px-6 py-4 border-b dark:border-zinc-700 bg-white dark:bg-custom-light-gray">
      {/* Left: Logo/Home Link */}
      <div className="flex items-center gap-6">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/images/me.jpeg" alt={userName} width={40} height={40} loading="lazy" className="rounded-full shadow-sm" unoptimized />
          <div className="text-left">
            <span className="font-semibold tracking-tight text-sm text-black dark:text-white">{userName}</span>
            <p className="text-xs text-gray-600 dark:text-gray-400">UX & Accessibility Specialist</p>
          </div>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <ul className="flex items-center gap-1">
        {LINKS.filter(link => link.href !== '/').map((link: LinkItem) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all',
                  active
                    ? 'bg-black text-white dark:bg-zinc-700'
                    : 'text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right: Secondary Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/collections"
          className="text-sm font-medium text-black dark:text-white hover:underline underline-offset-4"
        >
          All collections
        </Link>

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition font-bold text-sm"
            >
              <UserCircle className="w-4 h-4" />
              <span>{user?.given_name || 'Account'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#2f2f2f] rounded-lg shadow-lg z-50 border border-gray-200 dark:border-[#ffffff1a]">
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                  <div className="font-medium">{userName}</div>
                  <div className="truncate text-xs text-gray-600 dark:text-gray-400">{userEmail}</div>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link onClick={() => setDropdownOpen(false)} href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
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
        ) : (
          <LoginLink postLoginRedirectURL="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition font-bold text-sm">
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </LoginLink>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
