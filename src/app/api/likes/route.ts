import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getStats, likeImage, unlikeImage, getStat } from '@/utils/likes-db';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'like_vid';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const MAX_IDS = 100;

function getVisitorId(request: NextRequest): { id: string; isNew: boolean } {
    const existing = request.cookies.get(COOKIE_NAME)?.value;
    if (existing && /^[a-f0-9-]{10,64}$/i.test(existing)) {
        return { id: existing, isNew: false };
    }
    return { id: crypto.randomUUID(), isNew: true };
}

function withVisitorCookie(response: NextResponse, id: string): NextResponse {
    response.cookies.set(COOKIE_NAME, id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: COOKIE_MAX_AGE
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
}

/**
 * GET /api/likes?ids=a,b,c
 * Returns { [imageId]: { count, liked } } for the requesting visitor.
 */
export async function GET(request: NextRequest) {
    const { id: visitorId } = getVisitorId(request);
    const idsParam = request.nextUrl.searchParams.get('ids') || '';
    const ids = idsParam
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, MAX_IDS);

    const stats = getStats(ids, visitorId);
    return withVisitorCookie(NextResponse.json(stats), visitorId);
}

/**
 * POST /api/likes  { imageId: string, action: 'like' | 'unlike' }
 * Applies the change for this visitor and returns the fresh { count, liked }.
 */
export async function POST(request: NextRequest) {
    const { id: visitorId } = getVisitorId(request);

    let body: { imageId?: unknown; action?: unknown };
    try {
        body = await request.json();
    } catch {
        return withVisitorCookie(
            NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
            visitorId
        );
    }

    const imageId = typeof body.imageId === 'string' ? body.imageId.trim() : '';
    const action = body.action;

    if (!imageId || imageId.length > 128 || (action !== 'like' && action !== 'unlike')) {
        return withVisitorCookie(
            NextResponse.json({ error: 'Expected { imageId, action: "like" | "unlike" }' }, { status: 400 }),
            visitorId
        );
    }

    if (action === 'like') {
        likeImage(imageId, visitorId);
    } else {
        unlikeImage(imageId, visitorId);
    }

    const stat = getStat(imageId, visitorId);
    return withVisitorCookie(NextResponse.json(stat), visitorId);
}
