'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/utils/store';
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowUpRightIcon, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';
import {CoffeeIcon} from '@/components/Icon';
import Link from 'next/link';
import { useAuthStatus } from '@/contexts/AuthContext';
import { useAuthAndRoles } from '@/hooks/useAuthAndRoles';
import { userAtom, rolesAtom } from '@/utils/store';

const SiteMenu: React.FC = () => {
    const [, setIsOpen] = useAtom(drawerAtom);
    const closeDrawer = () => setIsOpen(false);
    const { isAuthenticated, loading: authStatusLoading } = useAuthStatus();
    const { loading: authAndRolesLoading } = useAuthAndRoles();

    const [user] = useAtom(userAtom);
    const [roles] = useAtom(rolesAtom);

    const isNewUser = roles.some(role => role.key === 'new-users');

    if (authStatusLoading || authAndRolesLoading) {
        return <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>;
    }

    const linkClass = "font-serif text-xs tracking-tight text-black duration-200 ease-out hover:opacity-60 focus:outline-dotted focus:outline-2 focus:outline-offset-2 focus:outline-black dark:text-white dark:focus:outline-white flex items-center space-x-1";

    return isAuthenticated ? (
        <nav aria-label="Authenticated user navigation" className="py-2 sm:mb-16 space-y-0.5 sm:py-8 sm:space-y-0 md:sticky md:top-16 md:py-0">
            <div>
                <div className="mt-2 border-t border-gray-200 pt-4 dark:border-zinc-700">
                    <Link className="underline-offset-4 transition duration-200 hover:duration-500 py-0.5 text-sm tracking-[0.5px] duration-200 ease-out text-black dark:text-white" onClick={closeDrawer} href="/collections">All collections</Link>
                    <div className="border-t dark:border-zinc-700 mt-4"></div>
                    <div className="py-4 flex flex-col dark:text-gray-300 text-sm w-full justify-left items-start space-y-3">
                        {user && (
                             <Link href="/dashboard" className={linkClass} onClick={closeDrawer}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <UserCircle size={24} className="text-gray-500 dark:text-gray-400" />
                                    <span className="font-medium">{user.given_name} {user.family_name}  
                                    {roles.length > 0 && ( 
                                        <div>{roles.map(role => (
                                            <span key={role.id} className="text-xs text-gray-400">{role.name} </span>
                                        ))}</div>
                                    )}
                                    </span>
                                </div>
                            </Link>
                        )}
                        {isNewUser && (
                            <>
                                <a 
                                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-800 bg-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff813f] transition duration-150 ease-in-out"
                                    target="_blank"
                                    href="https://www.buymeacoffee.com/cstate"
                                    rel="noopener noreferrer"
                                >
                                    <CoffeeIcon className="size-4 transition duration-200 ease-out" />
                                    <span className="font-serif">Buy me a coffee</span>
                                </a>
                                <div className="mb-4"></div>
                            </>
                        )}
                        
                        <Link href="/dashboard" className={linkClass} onClick={closeDrawer}>
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                        </Link>
                        <LogoutLink className={linkClass}>
                            <LogOut size={16} />
                            <span>Log out</span>
                        </LogoutLink>
                    </div>
                </div>
            </div>
        </nav>
    ) : (
        // Non-authenticated navigation structure
        <nav aria-label="Guest navigation" className="py-2 sm:mb-16 space-y-0.5 sm:py-8 sm:space-y-0 md:sticky md:top-16 md:py-0">
            <div>
                <div className="mt-2 border-t border-gray-200 pt-4 dark:border-zinc-700">
                    <Link className="underline-offset-4 transition duration-200 py-0.5 text-sm tracking-[0.5px] duration-200 ease-out text-black dark:text-white" onClick={closeDrawer} href="/collections">All collections</Link>
                    <div className="border-t dark:border-zinc-700 mt-4"></div>
                    <div className="py-4 flex flex-row dark:text-gray-300 text-sm w-full justify-left items-center">
                        <LoginLink postLoginRedirectURL="/dashboard" className={linkClass}>
                            <span>Login</span>
                            <ArrowUpRightIcon size={16} />
                        </LoginLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SiteMenu;