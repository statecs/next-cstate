'use client';

import React, { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { responseMessageLengthAtom } from '@/utils/store';

interface ClientPaddingProps {
    children: ReactNode;
}

const ClientPadding: React.FC<ClientPaddingProps> = ({ children }) => {
    const [responseLength] = useAtom(responseMessageLengthAtom);
    const addExtraPadding = responseLength > 450;

    return (
        <div className="flex h-[calc(100vh-110px)] overflow-hidden">
            <div className={`flex flex-grow border-spacing-4 items-center justify-center overflow-scroll ${addExtraPadding ? 'pt-80 md:pt-0' : ''}`}>
                {children}
             </div>
        </div>
    );
};

export default ClientPadding;
