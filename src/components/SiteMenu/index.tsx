'use client';

import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/utils/store';
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAuthAndRoles } from '@/hooks/useAuthAndRoles';

const SiteMenu: React.FC = () => {
    const [, setIsOpen] = useAtom(drawerAtom);
    const closeDrawer = () => setIsOpen(false);
    const { isAuthenticated, loading } = useAuthStatus();

    const AuthenticatedComponent = () => {
        const { user, roles } = useAuthAndRoles();
        return null;
      };

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? (
        // Authenticated navigation structure
        <nav aria-label="Authenticated user navigation" className="py-2 sm:mb-16 space-y-0.5 sm:py-8 sm:space-y-0 md:sticky md:top-16 md:py-0">
            <div>
                <div className="mt-2 max-w-[160px] border-t border-gray-200 pt-2 dark:border-zinc-700">
                    <Link className="underline-offset-4 transition duration-200 hover:duration-500 py-0.5 text-sm tracking-[0.5px] outline-none duration-200 ease-out text-black hover:underline dark:text-white" onClick={closeDrawer} href="/collections">All collections</Link>
                    <div className="py-4 flex flex-row dark:text-gray-400 text-xs w-full justify-left items-center">
                        <div className="flex flex-col">
                            {isAuthenticated && <AuthenticatedComponent />}
                            <Link href="/dashboard">Dashboard</Link>
                            <LogoutLink>Log out</LogoutLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    ) : (
        // Non-authenticated navigation structure
        <nav aria-label="Guest navigation" className="py-2 sm:mb-16 space-y-0.5 sm:py-8 sm:space-y-0 md:sticky md:top-16 md:py-0">
            <div>
                <div className="mt-2 max-w-[160px] border-t border-gray-200 pt-2 dark:border-zinc-700">
                    <Link className="underline-offset-4 transition duration-200 hover:duration-500 py-0.5 text-sm tracking-[0.5px] outline-none duration-200 ease-out text-black hover:underline dark:text-white" onClick={closeDrawer} href="/collections">All collections</Link>
                    <div className="py-4 flex flex-row dark:text-gray-400 text-xs w-full justify-left items-center">
                        <div className="flex flex-row">
                            <LoginLink postLoginRedirectURL="/dashboard" className="flex">Login <ArrowUpRightIcon size={16} /></LoginLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SiteMenu;