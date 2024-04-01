'use client';

import {useAtom} from 'jotai';
import Link from 'next/link';
import {CrossIcon, MenuIcon} from '@/components/Icon';
import Logo from '@/components/Logo';
import {isMenuOpenAtom} from '@/utils/store';
import { MobileDrawer } from '@/components/MobileDrawer'

const SiteHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom);

    const toggleMenuClick = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="top-0 flex h-8 pt-4 md:sticky md:z-50 md:h-10">
            <div className="absolute top-0 z-50 hidden h-10 w-full transition duration-200 ease-out md:block" />
            <div className="absolute top-6 z-50 hidden h-10 w-full bg-gradient-to-b from-white via-white to-transparent transition duration-200 ease-out md:block dark:from-black" />
            <div className="flex w-full items-center justify-between">
                <Link
                    aria-label="Home"
                    className="group relative z-50 outline-none"
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <Logo
                        className="h-auto w-[100px] text-black text-current transition duration-200 ease-in-out group-hover:opacity-40 dark:text-white"
                        hasStrapline={false}
                    />
                </Link>
                <button
                    className="relative z-50 size-6 translate-y-[-2px] md:hidden"
                    onClick={toggleMenuClick}
                    type="button"
                >
                    {isMenuOpen ? (
                        <CrossIcon className="h-auto w-6 text-black dark:text-white" />
                    ) : (
                        <MenuIcon className="h-auto w-6 text-black dark:text-white" />
                    )}
                </button>
                <MobileDrawer />
            </div>
        </header>
    );
};

export default SiteHeader;
