import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@/components/Analytics'
import { GA_TRACKING_ID } from '@/lib/gtag'
import Script from 'next/script'
import localFont from 'next/font/local';
import SiteFooter from '@/components/SiteFooter';
import MobileFooter from '@/components/MobileFooter';
import SkipLink from '@/components/SkipLink';
import SiteHeader from '@/components/SiteHeader';
import TopNav from '@/components/TopNav';
import config from '@/utils/config';
import styles from './rootLayout.module.css';
import './globals.css';
import { AuthWrapper } from '@/contexts//AuthWrapper';

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


const RootLayout = async ({children}: {children: React.ReactNode}) => {

    return (
        <html
          lang="en" 
          className={`flex flex-grow flex-col bg-white antialiased md:min-h-full dark:bg-custom-dark-gray ${titleFont.variable} ${bodyFont.variable}`}
        >
          <body style={{
            background: 'black'
          }} className="sm:min-h-full md:flex md:flex-grow md:flex-col bg-white dark:bg-custom-dark-gray">
            <AuthWrapper>
              <SkipLink />
              <div className="lg:hidden sticky top-0 z-50">
                <SiteHeader />
              </div>
              <main id="topElement" tabIndex={-1} vaul-drawer-wrapper=""
                    className={`${styles.responsiveStyle} md:mt-0 flex flex-col flex-grow w-full bg-white dark:bg-custom-dark-gray`}>
                <TopNav />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div id="main" className="flex flex-col flex-1 overflow-auto">
                    <div className="flex-1">
                      {children}
                    </div>
                    <div className="lg:hidden sticky bottom-0 w-full lg:relative lg:w-auto shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-gray-100 before:to-transparent dark:before:from-custom-dark-gray dark:before:to-transparent">
                      <SiteFooter />
                    </div>
                  </div>
                </div>
                <MobileFooter />
              </main>
              {process.env.NODE_ENV !== 'development' && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
              <GoogleAnalytics gaId={GA_TRACKING_ID} />
              <Analytics />
            </>
          )}
            </AuthWrapper>
          </body>
        </html>
      );
};

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || ''),
    ...config.seo
};

export default RootLayout;