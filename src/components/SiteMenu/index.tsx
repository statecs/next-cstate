'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/utils/store';
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowUpRightIcon, UserCircle, LayoutDashboard, LogOut, ChevronDown, LogIn } from 'lucide-react';
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
    const [showUSPs, setShowUSPs] = React.useState(false);

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
                <div>
                    <div className="py-4 flex flex-col dark:text-gray-300 text-sm w-full justify-left items-start space-y-3">

                        {isNewUser && (
                            <>
                                <a 
                                    className="inline-flex items-center px-2 py-2 text-xs font-medium text-white dark:text-gray-800 bg-black dark:bg-gray-200 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff813f] transition duration-150 ease-in-out"
                                    target="_blank"
                                    href="https://www.buymeacoffee.com/cstate"
                                    rel="noopener noreferrer"
                                >
                                    <CoffeeIcon className="size-4 transition duration-200 ease-out" />
                                    <span className="px-1 font-serif">Buy me a coffee</span>
                                </a>
                            </>
                        )}
                        {isNewUser && (
                         <button 
                                onClick={() => setShowUSPs(!showUSPs)}
                                className="flex items-left justify-left w-full text-xs lg:text-[10px] text-gray-400 hover:text-zinc-50"
                            >
                                <span>Why buy me a coffee?</span>
                                <ChevronDown className={`ml-1 text-xs transform transition-transform ${showUSPs ? 'rotate-180' : ''}`} size={16} />
                            </button>
                        )}
                            {showUSPs && isNewUser && (
                                <ul className="mt-2 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                    <li>• Get access to exclusive content and latest news in Accessibility, AI and UX</li>
                                    <li>• Support and help me continue to be dedicated to learning more in these fields</li>
                                    <li>• Join a community of like-minded individuals passionate about cutting-edge technology</li>
                                    <li>• Receive early access to new articles and resources</li>
                                </ul>
                            )}
                        
                    </div>
                </div>
            </div>
        </nav>
    ) : null;
};

export default SiteMenu;