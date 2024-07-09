/** @type {import('next').NextConfig} */
// https://nextjs.org/docs/advanced-features/security-headers
const securityHeaders = [
    {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
    {key: 'X-Content-Type-Options', value: 'nosniff'},
    {key: 'X-Frame-Options', value: 'DENY'},
    {key: 'X-XSS-Protection', value: '1; mode=block'},
    {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; " +
               "img-src 'self' data: https://images.ctfassets.net https://oaidalleapiprodscus.blob.core.windows.net https://*.google-analytics.com https://*.googletagmanager.com; " +
               "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
               "style-src 'self' 'unsafe-inline'; " +
               "font-src 'self' data:; " +
               "connect-src 'self' https://vitals.vercel-insights.com " + process.env.API_BASE_URL + " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; " +
               "frame-src 'self' https://www.youtube.com https://youtube.com https://youtu.be; " +
               "frame-ancestors 'self' https://app.contentful.com;" +
               "media-src 'self' blob:;"
    }    
];

module.exports = {
    env: {
        API_BASE_URL: process.env.API_BASE_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        KINDE_DOMAIN: process.env.KINDE_DOMAIN,
        KINDE_MANAGEMENT_CLIENT_ID: process.env.KINDE_MANAGEMENT_CLIENT_ID,
        KINDE_MANAGEMENT_CLIENT_SECRET: process.env.KINDE_MANAGEMENT_CLIENT_SECRET,
        INSTRUCTION_TEXT: process.env.INSTRUCTION_TEXT,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders
            }
        ];
    },
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/images/photos/:path*',
                    destination: 'https://images.ctfassets.net/:path*'
                },
                {source: '/', destination: '/home'}
            ]
        };
    },
    async redirects() {
        return [
            {source: '/x', destination: '/project/x', permanent: true},
            {source: '/login', destination: '/api/auth/login', permanent: true},
        ];
    },
    images: {
        formats: ['image/webp'],
        minimumCacheTTL: 31536000, // 1 year
        remotePatterns: [
            {protocol: 'https', hostname: 'images.ctfassets.net'},
            {protocol: 'https', hostname: 'downloads.ctfassets.net'}
        ]
    },
    reactStrictMode: true,
    swcMinify: true
};
