'use client';

import {ReactNode} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';

interface Props {
    children: ReactNode;
    className?: string;
    href?: string;
    [key: string]: any;
}

const UnderlineLink: React.FC<Props> = ({className = '', href = '', children, ...props}) => {
    const pathname = usePathname();
    const isActive = href && href !== '/' && pathname === href;
    const baseClassName = clsx(
        'outline-none duration-200 ease-in-out font-serif inline-flex space-x-1 items-center transition underline-offset-4 text-black dark:text-white focus:underline',
        {'underline decoration-2': isActive, 'hover:underline': !isActive}
    );

    if (href) {
        return (
            <Link href={href} className={`${className} ${baseClassName}`} {...props}>
                {children}
            </Link>
        );
    } else {
        return (
            <button className={`${className} ${baseClassName}`} {...props}>
                {children}
            </button>
        );
    }
};

export default UnderlineLink;
