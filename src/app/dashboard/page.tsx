'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserCircle, PencilLineIcon, LogOut } from 'lucide-react';
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

    const isNewUser = roles.some(role => role.key === 'new-users');

    if (authStatusLoading || authAndRolesLoading) {
        return <div className="flex items-center justify-center w-full h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>;
    }

    const linkClass = "font-serif text-xs tracking-tight text-black duration-200 ease-out hover:opacity-60 focus:outline-dotted focus:outline-2 focus:outline-offset-2 focus:outline-black dark:text-white dark:focus:outline-white flex items-center space-x-1";

    return isAuthenticated ? (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
                <div className="flex flex-col items-center space-y-4">
                    <div className="space-y-0">
                    {user && (
                        <div className="flex items-center space-x-2 mb-2">
                            <UserCircle size={24} className="text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-black dark:text-white">{user.given_name} {user.family_name}</span>
                        </div>
                    )}
                    {roles.length > 0 && (
                        <div className="text-center mt-4">
                            {roles.map(role => (
                                <span key={role.id} className="text-xs text-gray-500 dark:text-gray-400 mr-2">{role.name}</span>
                            ))}
                        </div>
                    )}
                    </div>
                    {isNewUser && (
                        <a 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#5f7fff] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff813f] transition duration-150 ease-in-out"
                            target="_blank"
                            href="https://www.buymeacoffee.com/cstate"
                            rel="noopener noreferrer"
                        >
                            <CoffeeIcon className="size-5 mr-2 transition duration-200 ease-out" />
                            <span className="font-serif">Buy me a coffee</span>
                        </a>
                    )}
                    <Link href="/writing" className={`${linkClass} text-black dark:text-white`}>
                        <PencilLineIcon size={16} className="mr-2" />
                        <span>Read my articles</span>
                    </Link>
                    <LogoutLink className={`${linkClass} text-black dark:text-white`}>
                        <LogOut size={16} className="mr-2" />
                        <span>Log out</span>
                    </LogoutLink>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex items-center w-full justify-center h-screen">
            <div className="text-xl font-medium text-gray-800 dark:text-gray-200">
                This page is protected.
            </div>
        </div>
    );
};

export default Dashboard;