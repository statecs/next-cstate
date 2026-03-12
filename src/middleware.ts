import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip root path explicitly - let rewrite handle it
    if (pathname === '/' || pathname === '') {
        return NextResponse.next();
    }

    // Skip Next.js internal paths
    if (pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // Only process single-segment paths (no slashes after first char)
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length !== 1) {
        return NextResponse.next();
    }

    const slug = segments[0];

    // Exclude known routes
    const excludedRoutes = [
        'home', 'about', 'dashboard', 'contact',
        'writing', 'links', 'collections', 'projects',
        'api', 'images', 'login'
    ];

    if (excludedRoutes.includes(slug)) {
        return NextResponse.next();
    }

    // Count hyphens in slug
    const hyphenCount = (slug.match(/-/g) || []).length;

    // 3+ hyphens → writing
    if (hyphenCount >= 3) {
        return NextResponse.redirect(
            new URL(`/writing/${slug}`, request.url),
            302 // Temporary redirect for easier testing
        );
    }

    // Otherwise → projects
    return NextResponse.redirect(
        new URL(`/projects/${slug}`, request.url),
        302 // Temporary redirect for easier testing
    );
}

// No matcher - handle all filtering in the middleware function itself
