import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {invalidateCache} from '@/utils/cache';
import {isAdminSession} from '@/utils/admin';

/**
 * Manual "pull the latest from Contentful" for signed-in admins.
 *
 * The Contentful webhook at /api/revalidate covers the normal path, but it is
 * gated on CONTENTFUL_WEBHOOK_SECRET and so can't be called from a browser.
 * This route does the same work off a Kinde session instead, for when a
 * webhook was missed or an entry was edited without one firing.
 */
export async function POST(request: NextRequest) {
    if (!(await isAdminSession())) {
        // Same answer whether signed out or merely not allowlisted.
        return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }

    // The page the editor is looking at, so it can come back fresh right away.
    let path: string | null = null;
    try {
        const body = await request.json();
        if (typeof body?.path === 'string' && body.path.startsWith('/')) {
            path = body.path;
        }
    } catch {
        // No body is fine — fall through to the site-wide refresh.
    }

    try {
        // Drop every .contentful-cache entry, then let the next request to
        // each route rebuild it from the Contentful API.
        await invalidateCache();
        revalidatePath('/', 'layout');
        if (path) revalidatePath(path);

        console.log(`[Admin] Cache cleared and revalidated${path ? ` (from ${path})` : ''}`);

        return NextResponse.json(
            {ok: true, path, timestamp: Date.now()},
            {headers: {'Cache-Control': 'no-store'}}
        );
    } catch (error) {
        console.error('[Admin] Refresh failed:', error);
        return NextResponse.json(
            {error: 'Refresh failed', message: String(error)},
            {status: 500}
        );
    }
}
