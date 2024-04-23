'use client';

import React, { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { responseMessageLengthAtom } from '@/utils/store';

interface ClientPaddingProps {
    children: ReactNode;  // This defines the type for children
}

const ClientPadding: React.FC<ClientPaddingProps> = ({ children }) => {

    const [responseLength] = useAtom(responseMessageLengthAtom);
    const addExtraPadding = responseLength > 450;  // Extra padding for more than 450 characters

    return (
        <div className={`flex h-[calc(100vh-110px)] flex-grow border-spacing-4 items-center justify-center ${addExtraPadding ? 'pt-80 md:pt-0' : ''}`}>
            {children}
        </div>
    );
};

export default ClientPadding;
