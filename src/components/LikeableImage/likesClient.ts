'use client';

export interface LikeStat {
    count: number;
    liked: boolean;
}

const EMPTY: LikeStat = { count: 0, liked: false };

// Ids waiting to be fetched -> the resolvers waiting on each.
const pending = new Map<string, Array<(stat: LikeStat) => void>>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
    flushTimer = null;
    const ids = Array.from(pending.keys());
    const resolvers = new Map(pending);
    pending.clear();

    try {
        const res = await fetch(`/api/likes?ids=${encodeURIComponent(ids.join(','))}`, {
            credentials: 'same-origin'
        });
        const data: Record<string, LikeStat> = res.ok ? await res.json() : {};
        for (const id of ids) {
            const stat = data[id] || EMPTY;
            resolvers.get(id)?.forEach(fn => fn(stat));
        }
    } catch {
        for (const id of ids) {
            resolvers.get(id)?.forEach(fn => fn(EMPTY));
        }
    }
}

/** Request the like stat for an image; requests within ~40ms are batched. */
export function loadLikeStat(imageId: string): Promise<LikeStat> {
    return new Promise(resolve => {
        const list = pending.get(imageId) || [];
        list.push(resolve);
        pending.set(imageId, list);
        if (!flushTimer) {
            flushTimer = setTimeout(flush, 40);
        }
    });
}

/** Apply a like/unlike and return the server-authoritative stat. */
export async function toggleLike(imageId: string, action: 'like' | 'unlike'): Promise<LikeStat> {
    const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ imageId, action })
    });
    if (!res.ok) {
        throw new Error(`Like request failed: ${res.status}`);
    }
    return res.json();
}
