import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** The model behind each tab of the "Ask me anything" box. The worker only opens these to the site. */
const MODELS = {
    gpt: 'gpt-5-4',
    claude: 'claude-sonnet-5',
} as const;

const MAX_MESSAGE_CHARS = 2000;

/**
 * Forwards an "Ask me anything" question to the chat worker and streams the reply back.
 * The worker gives requests that carry AMA_SITE_KEY the site's own weekly allowance,
 * counted per visitor, so the key stays on the server and the visitor's address is
 * passed along for the count.
 */
export async function POST(request: NextRequest) {
    const base = process.env.API_BASE_URL;
    const siteKey = process.env.AMA_SITE_KEY;
    if (!base || !siteKey) {
        console.error('[ama] API_BASE_URL or AMA_SITE_KEY is not set');
        return NextResponse.json({ error: 'The assistant is not available right now.' }, { status: 503 });
    }

    const body = await request.json().catch(() => null);
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const model = body?.model === 'claude' ? 'claude' : 'gpt';
    if (!message) return NextResponse.json({ error: 'Ask a question first.' }, { status: 400 });
    if (message.length > MAX_MESSAGE_CHARS) {
        return NextResponse.json({ error: `Keep the question under ${MAX_MESSAGE_CHARS} characters.` }, { status: 400 });
    }

    // Cloudflare sits in front of the site and sets CF-Connecting-IP itself, so a visitor can't choose it.
    const visitorIp =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-real-ip') ||
        request.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ||
        'unknown';

    let upstream: Response;
    try {
        upstream = await fetch(`${base}/responses/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Site-Key': siteKey,
                'X-Visitor-IP': visitorIp,
            },
            body: JSON.stringify({
                message,
                modelId: MODELS[model],
                instructionText: process.env.INSTRUCTION_TEXT,
            }),
            cache: 'no-store',
        });
    } catch (error) {
        console.error('[ama] could not reach the worker:', error);
        return NextResponse.json({ error: 'The assistant is not available right now.' }, { status: 502 });
    }

    if (!upstream.ok || !upstream.body) {
        // The worker's JSON says why (e.g. this week's limit is used up); pass its message on.
        const detail = await upstream.json().catch(() => null);
        return NextResponse.json(
            { error: typeof detail?.error === 'string' ? detail.error : 'The assistant is not available right now.' },
            { status: upstream.status === 429 ? 429 : 502 }
        );
    }

    return new Response(upstream.body, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
        },
    });
}
