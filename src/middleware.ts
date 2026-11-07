import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pages that used to live at the top level, listed explicitly because these
// redirects are permanent and get cached: they must not rest on a guess.
const LEGACY_PROJECT_SLUGS = new Set([
    'ai-for-accessibility', 'altvision', 'bubble-catch-game', 'doctrin',
    'evolving-design-system', 'flowfactory', 'ica', 'intranet-minbutik',
    'mapiful', 'notely-ai', 'sj', 'studs', 'ths', 'vattenfall-erp-sap-elearning'
]);
const LEGACY_WRITING_SLUGS = new Set([
    'building-ai-powered-transcription-app-journey',
    'designing-for-context-mcps-and-ai-products',
    'developer-guide-focus-indicators',
    'digital-accessibility-insights-pts-sis-accessibleeu',
    'gpt-5-2-incremental-progress-or-road-to-agi',
    'how-does-an-ai-watermark-its-words',
    'how-rl-shapes-modern-ai-models',
    'openai-o3-paradigm-shift-artificial-intelligence',
    'the-limits-of-mathematical-reasoning',
    'the-web-content-accessibility-guidelines',
    'understanding-ai-and-rag',
    'understanding-aria-basics-to-best-practices',
    'understanding-gpt-and-transformer-models',
    'vibe-coding-the-art-of-writing-code',
    'what-is-web-accessibility',
    'when-a-government-can-switch-off-your-ai-model-overnight',
    'when-ai-agents-form-a-swarm',
    'why-ai-is-solving-the-wrong-problem',
    'why-are-tokens-so-expensive'
]);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ============================================================================
    // Security: Block malformed Server Action requests
    // ============================================================================
    // Bots and attackers send POST requests with invalid 'next-action' headers.
    // Legitimate Server Action IDs are 40+ character cryptographic hashes.
    // Short values like "x", "test", "1" are clearly malicious/malformed.
    // Blocking these prevents "Failed to find Server Action" errors in logs.
    if (request.method === 'POST') {
        const nextAction = request.headers.get('next-action');

        if (nextAction && nextAction.length < 10) {
            return new NextResponse('Bad Request', { status: 400 });
        }
    }

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

    const segments = pathname.split('/').filter(Boolean);

    // Old top-level URLs, with or without an image slug after them
    if (segments.length === 1 || segments.length === 2) {
        const section = LEGACY_PROJECT_SLUGS.has(segments[0])
            ? 'projects'
            : LEGACY_WRITING_SLUGS.has(segments[0]) ? 'writing' : null;

        if (section) {
            return NextResponse.redirect(
                new URL(`/${section}${pathname}${request.nextUrl.search}`, request.url),
                308
            );
        }
    }

    // Only process single-segment paths (no slashes after first char)
    if (segments.length !== 1) {
        return NextResponse.next();
    }

    const slug = segments[0];

    // Skip static file paths (sitemap.xml, robots.txt, etc.)
    if (slug.includes('.')) {
        return NextResponse.next();
    }

    // Exclude known routes. '/about' is no longer a page but must stay listed:
    // middleware runs before next.config redirects, so without it /about would be
    // rewritten to /projects/about instead of reaching the /home#about redirect.
    const excludedRoutes = [
        'home', 'about', 'dashboard', 'contact',
        'writing', 'links', 'collections', 'projects',
        'api', 'images', 'login', 'voice', 'voicemode', 'privacy'
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
