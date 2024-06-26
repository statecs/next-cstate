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
               "img-src 'self' data: https://images.ctfassets.net; " +
               "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; " +
               "style-src 'self' 'unsafe-inline'; " +
               "font-src 'self' data:; " +
               "connect-src 'self' https://vitals.vercel-insights.com " + process.env.API_BASE_URL + "; " +
               "frame-src 'self' https://www.youtube.com https://youtube.com https://youtu.be; " +
               "frame-ancestors 'self' https://app.contentful.com;"
    }    
];

module.exports = {
    env: {
        API_BASE_URL: process.env.API_BASE_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
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
