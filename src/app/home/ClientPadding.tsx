'use client';

import React, { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { responseMessageLengthAtom, footerVisibilityAtom } from '@/utils/store';

interface ClientPaddingProps {
    children: ReactNode;
}

const ClientPadding: React.FC<ClientPaddingProps> = ({ children }) => {
    const [responseLength] = useAtom(responseMessageLengthAtom);
    const [footerVisible] = useAtom(footerVisibilityAtom);
    const addExtraPadding = responseLength > 1;

    return (
        <div className={`
            ${footerVisible ? 'min-h-screen md:h-40 md:overflow-scroll' : 'h-full md:min-h-screen mt-20'}
            w-full
            flex flex-col
            ${addExtraPadding ? 'md:mt-auto' : 'md:mt-auto'}
        `}>
            <main className={`
                flex-grow
                flex
                items-start 
                justify-center 
                w-full 
                px-4 
                sm:px-6 
                md:px-8
                ${addExtraPadding ? 'pt-20 pb-32' : 'py-20'}
                max-h-[calc(100vh-110px)] md:max-h-none
                overflow-y-auto
            `}>
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ClientPadding;