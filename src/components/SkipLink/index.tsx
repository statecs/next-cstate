'use client';

import React from 'react';

const SkipLink: React.FC = () => {
    return (
        <a 
            href="#main" 
            className="skip-link absolute left-[-9999px] top-0 z-50 focus:left-10 focus:top-3 focus:z-50 focus:bg-black focus:text-white focus:p-4 focus:border focus:border-white"
            onFocus={(e) => e.currentTarget.style.left = '10px'} // Ensures visibility on focus
            onBlur={(e) => e.currentTarget.style.left = '-9999px'} // Hides the link when not focused
        >
            Skip to content
        </a>
    );
};

export default SkipLink;
