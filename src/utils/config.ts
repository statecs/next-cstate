// Bundled rather than served from /public: production nginx serves /images/
// from a legacy folder outside the app, so new files there never reach it.
import ogImage from '@/assets/og.png';

const ogImageUrl = `https://cstate.se${ogImage.src}`;

const config = {
    seo: {
        title: {
            default: 'Christopher State',
            template: '%s | Design Engineer'
        },
        description:
            'Burning passion in creating solutions that makes a difference.',
        canonical: 'https://www.cstate.se',
        openGraph: {
            images: [
                {
                    alt: "Christopher State, Design Engineer: Hi, I'm Christopher.",
                    height: 630,
                    url: ogImageUrl,
                    width: 1200
                }
            ],
            locale: 'en_GB',
            siteName: 'Christopher State | Design Engineer',
            type: 'website',
            url: 'https://www.cstate.se'
        },
        twitter: {
            card: 'summary_large_image',
            creator: '@statecs',
            images: [ogImageUrl],
            site: '@statecs',
            title: 'Christopher State | Design Engineer'
        },
        icons: {
            shortcut: '/images/favicon-32x32.png'
        }
    }
};

export default config;
