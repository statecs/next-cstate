'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileDrawer } from '@/components/MobileDrawer'
import { HomeIcon } from 'lucide-react'

const SiteHeader: React.FC = () => {
    const pathname = usePathname();

    return (
        <header className="sticky inset-x-0 top-0 z-10 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b dark:border-zinc-700 bg-white dark:bg-custom-light-gray dark:text-white text-sm font-medium lg:hidden">
            <div className="flex h-full w-full items-center px-2 justify-start">    
                <Link href="/" passHref>
                    <div className="link-card inline-flex items-center gap-2 p-2">
                        {pathname !== '/' && <HomeIcon size={20} />}
                    </div>
                </Link>
            </div>
            <div className="flex h-full w-full items-center px-3 justify-end">
                <MobileDrawer />
            </div>
        </header>
    );
};

export default SiteHeader;
