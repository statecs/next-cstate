import {Analytics} from '@vercel/analytics/react';
import localFont from 'next/font/local';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import SiteMenu from '@/components/SiteMenu';
import SiteMenuMobile from '@/components/SiteMenu/Mobile';
import config from '@/utils/config';
import './globals.css';

const titleFont = localFont({
    display: 'swap',
    src: '../../public/fonts/PPEiko-Medium.woff2',
    weight: '500',
    variable: '--font-title'
});
const bodyFont = localFont({
    display: 'swap',
    src: '../../public/fonts/NeueMontreal-Regular.woff2',
    weight: '300',
    variable: '--font-body'
});

const RootLayout = async ({children}: {children: React.ReactNode}) => (
    <html
        lang="en"
        className={`flex flex-grow flex-col bg-white antialiased md:min-h-full dark:bg-custom-light-gray ${titleFont.variable} ${bodyFont.variable}`}
    >
        <body className="sm:min-h-full md:flex md:flex-grow md:flex-row">
            <div className="relative z-[100] flex-shrink-0 flex-grow-0 px-4 md:flex md:w-[240px] md:flex-grow md:flex-col lg:w-[260px]">
                <SiteHeader />
                <div className="hidden flex-grow flex-col justify-between space-y-8 md:flex">
                    <SiteMenu />
                    <footer className="hidden md:sticky md:bottom-0 md:block">
                        <div className="absolute bottom-6 z-50 hidden h-10 w-full bg-gradient-to-t from-white via-white to-transparent transition duration-200 ease-out md:block dark:from-black dark:via-black" />
                        <SiteFooter />
                    </footer>
                </div>
            </div>
            <SiteMenuMobile />
            <main className="animate-fadeIn p-4 md:mt-0 md:flex md:w-[calc(100%-260px)] md:flex-grow md:flex-col lg:w-[calc(100%-300px)]">
                {children}
                <div className="-mb-4 mt-10 md:hidden">
                    <SiteFooter />
                </div>
            </main>
            {process.env.NODE_ENV !== 'development' && (
                <>
                    <Analytics />
                </>
            )}
        </body>
    </html>
);

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || ''),
    ...config.seo
};

export default RootLayout;
