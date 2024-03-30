'use client';

import clsx from 'clsx';
import {useAtom} from 'jotai';
import {LINKS} from '@/components/SiteFooter';
import SiteMenuLink from '@/components/SiteMenu/Link';
import SocialLinks from '@/components/SiteMenu/SocialLinks';
import UnderlineLink from '@/components/UnderlineLink';
import {isMenuOpenAtom} from '@/utils/store';

interface Props {
    links: Link[];
}

const SiteMenuMobile: React.FC<Props> = ({links}) => {
    const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom);

    return (
        <>
            <div
                className={clsx('absolute top-10 z-[100] w-full md:hidden', {
                    'animate-menu-open': isMenuOpen,
                    'animate-menu-closed': !isMenuOpen
                })}
                style={{
                    height: isMenuOpen ? '100vh' : '0',
                    opacity: isMenuOpen ? 1 : 0.8,
                    overflow: isMenuOpen ? 'visible' : 'hidden'
                }}
            >
                <div className="bg-white px-4 py-8 md:hidden dark:bg-black">
                    <div
                        className={clsx('flex space-x-10', {
                            'animate-menu-open': isMenuOpen,
                            'animate-menu-closed': !isMenuOpen
                        })}
                        style={{opacity: isMenuOpen ? 1 : 0}}
                    >
                        <nav
                            key={isMenuOpen ? 'collections-open' : 'collections-closed'}
                            className="flex-grow animate-fadeInUp space-y-1 sm:columns-2"
                        >
                            {links?.map(link => (
                                <SiteMenuLink key={link.url} {...link} />
                            ))}
                            <div>
                                <div className="mt-4 w-[160px] border-t-2 border-gray-200 pt-2 dark:border-gray-800">
                                    <SiteMenuLink title="All collections" url="/collections" />
                                </div>
                            </div>
                        </nav>
                        <nav
                            key={isMenuOpen ? 'pages-open' : 'pages-closed'}
                            className="flex min-w-[100px] animate-fadeInUp flex-col items-end space-y-2 opacity-0 animate-delay-75 md:hidden"
                        >
                            {LINKS.map(link => (
                                <UnderlineLink
                                    href={link.url}
                                    key={link.url}
                                    className="text-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </UnderlineLink>
                            ))}
                            <div className="pt-4">
                                <SocialLinks />
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="h-44 bg-gradient-to-b from-white dark:from-black" />
            </div>
            <div
                className={clsx(
                    'fixed left-0 right-0 top-0 z-[99] h-0 bg-white md:hidden dark:bg-black',
                    {
                        'animate-menu-open-overlay': isMenuOpen,
                        'animate-menu-closed-overlay': !isMenuOpen
                    }
                )}
                style={{height: isMenuOpen ? '100vh' : '0', opacity: isMenuOpen ? 0.8 : 0}}
            />
        </>
    );
};

export default SiteMenuMobile;
