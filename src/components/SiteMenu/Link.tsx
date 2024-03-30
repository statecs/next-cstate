'use client';

import {useTransition} from 'react';
import clsx from 'clsx';
import {useAtom} from 'jotai';
import Link from 'next/link';
import {useSelectedLayoutSegments} from 'next/navigation';
import NewBadge from '@/components/PhotoCollection/New';
import {isCollectionNew} from '@/utils/helpers';
import {isMenuOpenAtom} from '@/utils/store';

const SiteMenuLink: React.FC<Link> = ({published, title, url}) => {
    const [collection] = useSelectedLayoutSegments();
    const [isPending, startTransition] = useTransition();
    const [_, setIsMenuOpen] = useAtom(isMenuOpenAtom);
    // This ensures we capture nested pages, but also ensuring '/about' does not match
    // to, for example, '/about-town'.
    const isActive = url.includes(collection) && collection.length >= url.slice(0, 1).length;

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Adding a delay to the menu closing to prevent 'flickering' between
        // the menu closing and the new page loading.
        startTransition(() => {
            setTimeout(() => setIsMenuOpen(false), 100);
        });
    };

    return (
        <Link
            href={url}
            className={clsx(
                'group flex items-center space-x-2 py-0.5 text-sm tracking-[0.5px] outline-none duration-200 ease-out',
                {'animate-pulse': isPending}
            )}
            onClick={handleClick}
        >
            <span
                className={clsx('underline-offset-4 transition duration-200 hover:duration-500', {
                    'text-gray-500 group-hover:text-black group-hover:underline group-focus:text-black  group-focus:underline dark:hover:text-white dark:group-hover:text-white dark:group-focus:text-white':
                        !isActive,
                    'text-black underline dark:text-white': isActive
                })}
            >
                {title}
            </span>
            {isCollectionNew(published) && <NewBadge isActive={isActive} />}
        </Link>
    );
};

export default SiteMenuLink;
