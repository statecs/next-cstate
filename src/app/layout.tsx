import { GoogleAnalytics } from '@next/third-parties/google'
import localFont from 'next/font/local';
import SiteFooter from '@/components/SiteFooter';
import SiteMenu from '@/components/SiteMenu';
import SkipLink from '@/components/SkipLink';
import SiteHeader from '@/components/SiteHeader';
import { SideMenu, MenuContent } from '@/components/SideMenu';
import config from '@/utils/config';
import styles from './rootLayout.module.css';
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
        className={`flex flex-grow flex-col bg-white antialiased md:min-h-full dark:bg-custom-dark-gray ${titleFont.variable} ${bodyFont.variable}`}
    >
            <body style={{
           background: 'black'
          }} className="sm:min-h-full md:flex md:flex-grow md:flex-row bg-white dark:bg-custom-dark-gray overflow-hidden">

            <SkipLink />

            <main id="topElement" tabIndex={-1} vaul-drawer-wrapper=""  className={`${styles.responsiveStyle} animate-fadeIn md:mt-0 md:flex md:w-[calc(100%-260px)] md:flex-grow md:flex-col lg:w-[calc(100%-300px)] bg-white dark:bg-custom-dark-gray`}>
                <div className="lg:hidden">
                <SiteHeader />
                </div>
                <div className="lg:flex">
                    <SideMenu className="relative hidden lg:flex">
                        <MenuContent />
                        <SiteMenu />
                    </SideMenu>
                    <div id="main" className="flex flex-1 overflow-auto">{children}</div>
                </div>
                <div className="sticky bottom-0 w-full lg:hidden shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-gray-100 before:to-transparent dark:before:from-custom-dark-gray dark:before:to-transparent">
                    <SiteFooter />
                </div>
            </main>
            {process.env.NODE_ENV !== 'development' && (
                <>
                    <GoogleAnalytics gaId="G-J0TJFX3J0V" />
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
