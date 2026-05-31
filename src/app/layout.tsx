import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@/components/Analytics'
import { GA_TRACKING_ID } from '@/lib/gtag'
import Script from 'next/script'
import localFont from 'next/font/local';
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono, Inter, Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import AuroraNav from '@/components/AuroraNav';
import AuroraBackground from '@/components/AuroraBackground';
import AuroraFooter from '@/components/AuroraFooter';
import AuroraReveal from '@/components/AuroraReveal';
import AuroraMagnetic from '@/components/AuroraMagnetic';
import SkipLink from '@/components/SkipLink';
import { MainWrapper } from '@/components/MainWrapper';
import config from '@/utils/config';
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

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-serif',
});

const sans = Hanken_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-sans',
});

const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    display: 'swap',
    variable: '--font-mono',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-inter',
});

const fraunces = Fraunces({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-fraunces',
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-jakarta',
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`aurora flex flex-grow flex-col antialiased md:min-h-full ${titleFont.variable} ${bodyFont.variable} ${serif.variable} ${sans.variable} ${mono.variable} ${inter.variable} ${fraunces.variable} ${plusJakarta.variable}`}
        >
            <body className="aurora sm:min-h-full md:flex md:flex-grow md:flex-col">
                <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('cs-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();` }} />
                <AuthWrapper>
                    <SkipLink />
                    <AuroraBackground />
                    <AuroraNav />
                    <MainWrapper>
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <div id="main" className="flex flex-col flex-1 overflow-auto">
                                <div className="flex-1">
                                    {children}
                                </div>
                                <AuroraFooter />
                            </div>
                        </div>
                    </MainWrapper>
                    <AuroraReveal />
                    <AuroraMagnetic />
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
