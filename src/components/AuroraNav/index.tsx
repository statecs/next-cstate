'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { ChevronDown, LayoutDashboard, LogOut, UserCircle } from 'lucide-react';

const LINKS: { href: string; label: string }[] = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
];

const THEME_KEY = 'cs-theme';
const MOTION_KEY = 'cs-motion-off';

const AuroraNav: React.FC = () => {
    const pathname = usePathname();
    const [user] = useAtom(userAtom);
    const { isAuthenticated } = useAuthStatus();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const [motionOff, setMotionOff] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLight(localStorage.getItem(THEME_KEY) === 'light');
        const stored = localStorage.getItem(MOTION_KEY) === '1';
        setMotionOff(stored);
        document.body.classList.toggle('noanim', stored);
        document.dispatchEvent(new CustomEvent('cs:motion', { detail: stored }));
    }, []);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDropdownOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, []);

    const isActive = (href: string) => {
        if (href === '/home') return pathname === '/home' || pathname === '/';
        return pathname.startsWith(href);
    };

    const toggleMotion = () => {
        const next = !motionOff;
        setMotionOff(next);
        document.body.classList.toggle('noanim', next);
        localStorage.setItem(MOTION_KEY, next ? '1' : '0');
        document.dispatchEvent(new CustomEvent('cs:motion', { detail: next }));
    };

    const toggleTheme = () => {
        const next = !isLight;
        setIsLight(next);
        if (next) {
            document.documentElement.classList.add('light');
            localStorage.setItem(THEME_KEY, 'light');
        } else {
            document.documentElement.classList.remove('light');
            localStorage.setItem(THEME_KEY, 'dark');
        }
        document.dispatchEvent(new CustomEvent('cs:theme'));
    };

    const userName = user ? `${user.given_name} ${user.family_name}` : 'Christopher State';
    const userEmail = user?.email || '';

    return (
        <header className="aurora-nav">
            <Link href="/home" className="aurora-brand" aria-label="Christopher State — home">
                <span className="aurora-avatar" aria-hidden="true">CS</span>
                <span className="aurora-brand-txt">
                    <b>Christopher State</b>
                    <span>Design Engineer</span>
                </span>
            </Link>

            <nav aria-label="Primary" className="aurora-nav-links">
                {LINKS.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="aurora-nav-tools">
                <div className="hidden md:contents">
                    <button
                        type="button"
                        onClick={toggleMotion}
                        className="aurora-iconbtn"
                        aria-label={motionOff ? 'Enable animation' : 'Pause animation'}
                        aria-pressed={motionOff}
                        title={motionOff ? 'Enable animation' : 'Pause animation'}
                    >
                        {motionOff ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="aurora-iconbtn"
                    aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                    aria-pressed={isLight}
                    title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {isLight ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <circle cx="12" cy="12" r="3.2" />
                            <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" />
                        </svg>
                    )}
                </button>

                <Link
                    href="/contact"
                    className="aurora-btn"
                    style={{ padding: '11px 20px' }}
                    data-magnetic
                >
                    Let&apos;s talk
                </Link>

                {isAuthenticated && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(o => !o)}
                            className="aurora-iconbtn"
                            aria-label="Account menu"
                            aria-expanded={dropdownOpen}
                        >
                            <UserCircle className="w-5 h-5" />
                        </button>
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl z-50"
                                style={{
                                    background: 'var(--aurora-bg2)',
                                    border: '1px solid var(--aurora-line2)',
                                    backdropFilter: 'blur(14px)',
                                }}
                            >
                                <div className="px-4 py-3 text-sm border-b" style={{ borderColor: 'var(--aurora-line)' }}>
                                    <div className="font-medium" style={{ color: 'var(--aurora-text)' }}>{userName}</div>
                                    {userEmail && (
                                        <div className="truncate text-xs" style={{ color: 'var(--aurora-muted)' }}>{userEmail}</div>
                                    )}
                                </div>
                                <ul className="py-2 text-sm">
                                    <li>
                                        <Link
                                            onClick={() => setDropdownOpen(false)}
                                            href="/dashboard"
                                            className="flex items-center px-4 py-2 hover:bg-white/5"
                                            style={{ color: 'var(--aurora-text)' }}
                                        >
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </li>
                                </ul>
                                <div className="py-2 border-t" style={{ borderColor: 'var(--aurora-line)' }}>
                                    <LogoutLink
                                        className="flex items-center px-4 py-2 text-sm hover:bg-white/5"
                                        style={{ color: 'var(--aurora-text)' }}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign out
                                    </LogoutLink>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default AuroraNav;
