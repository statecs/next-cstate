'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserCircle, PencilLineIcon, LogOut, ChevronDown } from 'lucide-react';
import { CoffeeIcon } from '@/components/Icon';
import Link from 'next/link';
import { useAuthStatus } from '@/contexts/AuthContext';
import { useAuthAndRoles } from '@/hooks/useAuthAndRoles';
import { userAtom, rolesAtom } from '@/utils/store';

const Dashboard: React.FC = () => {
    const { isAuthenticated, loading: authStatusLoading } = useAuthStatus();
    const { loading: authAndRolesLoading } = useAuthAndRoles();

    const [user] = useAtom(userAtom);
    const [roles] = useAtom(rolesAtom);
    const [showUSPs, setShowUSPs] = React.useState(false);

    const isNewUser = roles.some(role => role.key === 'new-users');

    if (authStatusLoading || authAndRolesLoading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-800"></div>
            </div>
        );
    }

    const linkClass = "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-custom-light-gray focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

    return isAuthenticated ? (
        <div className="flex flex-col items-center justify-start md:justify-center w-full min-h-screen px-4 py-8 font-serif">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center space-y-6">
                    {user && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 dark:bg-custom-light-gray rounded-full mb-4">
                                <UserCircle size={40} className="text-zinc-50 dark:text-zinc-50" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.given_name} {user.family_name}</h2>
                            {roles.length > 0 && (
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    {roles.map(role => (
                                        <span key={role.id} className="px-2 py-1 text-xs font-medium text-white dark:text-gray-800 bg-black dark:bg-white rounded-full opacity-50">{role.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {isNewUser && (
                        <div className="w-full space-y-3">
                            <a 
                                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white dark:text-gray-800 bg-black dark:bg-gray-200 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full justify-center"
                                target="_blank"
                                href="https://www.buymeacoffee.com/cstate"
                                rel="noopener noreferrer"
                            >
                                <CoffeeIcon className="w-5 h-5 mr-2" />
                                <span>Buy me a coffee</span>
                            </a>
                            <button 
                                onClick={() => setShowUSPs(!showUSPs)}
                                className="flex items-center justify-center w-full text-sm text-gray-400 dark:hover:text-zinc-50"
                            >
                                <span>Why buy me a coffee?</span>
                                <ChevronDown className={`ml-1 transform transition-transform ${showUSPs ? 'rotate-180' : ''}`} size={16} />
                            </button>
                            {showUSPs && (
                                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li>• Get access to exclusive content and latest news in Accessibility, AI and UX</li>
                                    <li>• Support and help me continue to be dedicated to learning more in these fields</li>
                                    <li>• Join a community of like-minded individuals passionate about cutting-edge technology</li>
                                    <li>• Receive early access to new articles and resources</li>
                                </ul>
                            )}
                        </div>
                    )}
                    <div className="w-full space-y-3">
                    <div className="w-full space-y-1">
                        <Link href="/writing" className={linkClass}>
                            <PencilLineIcon size={20} className="text-gray-600 dark:text-gray-300" />
                            <span className="flex-col left-align">
                                <span className="text-gray-800 dark:text-white">Explore My Writings</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Fresh insights on AI, UX, and Accessibility</p>
                            </span>
                        </Link>
                       
                    </div>
                        <LogoutLink className={linkClass}>
                            <LogOut size={20} className="text-gray-600 dark:text-gray-300" />
                            <span className="text-gray-800 dark:text-white">Log out</span>
                        </LogoutLink>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="text-xl font-medium text-gray-800 dark:text-gray-200 p-8">
                This page is protected.
            </div>
        </div>
    );
};

export default Dashboard;