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
               "connect-src 'self' https://vitals.vercel-insights.com " + 
               process.env.API_BASE_URL + " " +
               "https://*.google-analytics.com https://*.analytics.google.com " +
               "https://*.googletagmanager.com https://api.openai.com https://cstate.se https://*.cstate.se ws://*.cstate.se " +
               "https://*.workers.dev " +
               "http://localhost:3001 ws://localhost:3001; " + 
               "frame-src 'self' https://www.youtube.com https://youtube.com https://youtu.be; " +
               "frame-ancestors 'self' https://app.contentful.com;" +
               "media-src 'self' blob:;"
    }    
];
module.exports = {
    // release.js builds into a separate folder and swaps it in only if the build succeeds
    distDir: process.env.NEXT_DIST_DIR || '.next',
    env: {
        API_BASE_URL: process.env.API_BASE_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        KINDE_DOMAIN: process.env.KINDE_DOMAIN,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
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
                    source: '/images/photos/6ss3uxgp4reb/:path*',
                    destination: 'https://images.ctfassets.net/6ss3uxgp4reb/:path*'
                },
                {source: '/', destination: '/home'}
            ]
        };
    },
    async redirects() {
        return [
            {source: '/login', destination: '/api/auth/login', permanent: true},
            // /about is now a section of /home
            {source: '/about', destination: '/home#about', permanent: true},
            {source: '/voicemode', destination: '/voice', permanent: true},
        ];
    },
    images: {
        formats: ['image/webp'],
        minimumCacheTTL: 31536000, // 1 year
        remotePatterns: [
            // Only this site's Contentful space, so the optimizer can't be used on other spaces' files.
            // Also rejects Screenshot_2026-* and later: an automated client requests real assets with
            // a recent date swapped into the filename (first 2026-10-27, then 2026-11-07), and each
            // 403 from Contentful logs an error. No real screenshot asset is dated 2026 or later, and
            // new uploads should not be named Screenshot_*. This is the place to block it, as
            // middleware and rewrites don't run for /_next/image.
            {protocol: 'https', hostname: 'images.ctfassets.net', pathname: '/6ss3uxgp4reb/*/*/!(Screenshot_202[6-9]-*)'},
            {protocol: 'https', hostname: 'downloads.ctfassets.net', pathname: '/6ss3uxgp4reb/*/*/!(Screenshot_202[6-9]-*)'}
        ]
    },
    reactStrictMode: true,
};
