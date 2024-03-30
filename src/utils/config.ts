const config = {
    seo: {
        title: {
            default: 'Christopher State',
            template: '%s | Design Technologist'
        },
        description:
            'Burning passion in creating solutions that makes a difference.',
        canonical: 'https://www.cstate.se',
        openGraph: {
            images: [
                {
                    alt: '',
                    height: 630,
                    url: 'https://cstate.se/images/chris-placeholder.jpg',
                    width: 1200
                }
            ],
            locale: 'en_GB',
            siteName: 'Christopher State | Design Technologist',
            type: 'website',
            url: 'https://www.cstate.se'
        },
        twitter: {
            card: 'summary_large_image',
            creator: '@statecs',
            image: 'https://cstate.se/images/chris-placeholder.jpg',
            site: '@statecs',
            title: 'Christopher State | Design Technologist'
        },
        icons: {
            shortcut: '/images/favicon-32x32.png'
        }
    }
};

export default config;
