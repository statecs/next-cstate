'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { MobileDrawer } from '@/components/MobileDrawer'

const SiteHeader: React.FC = () => {

    return (
        <header className="top-0 flex h-8 pt-4 md:sticky md:z-50 md:h-10">
            <div className="absolute top-0 z-50 hidden h-10 w-full transition duration-200 ease-out md:block" />
            <div className="absolute top-6 z-50 hidden h-10 w-full transition duration-200 ease-out md:block dark:from-black" />
            <div className="flex w-full items-center justify-between">
                <Link
                    aria-label="Home"
                    className="group relative z-50 outline-none"
                    href="/"
                >
                    <Logo
                        className="h-auto w-[100px] text-black text-current transition duration-200 ease-in-out group-hover:opacity-40 dark:text-white"
                        hasStrapline={false}
                    />
                </Link>
                <MobileDrawer />
            </div>
        </header>
    );
};

export default SiteHeader;
