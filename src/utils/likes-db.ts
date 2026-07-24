import 'server-only';
import fs from 'fs';
import path from 'path';

/**
 * Lightweight like store for Journey images.
 *
 * Storage: a single JSON file, no native dependencies. Shape is
 *   { [imageId]: { [visitorId]: likedAtMs } }
 * so a visitor counts once and can toggle off; an image's like count is just
 * the number of visitor keys.
 *
 * This is safe because `portfolio-prod` runs as a single PM2 fork — one Node
 * process, one event loop — so writes serialize naturally with no cross-process
 * races. An in-memory copy is kept for reads and every mutation is flushed to
 * disk with an atomic temp-file + rename.
 *
 * The path defaults to `<cwd>/.data/likes.json`. On the VPS this resolves to
 * `/var/www/cstate.se/portfolio/.data/likes.json`; release.js excludes `.data`
 * from the deploy upload, so the file survives releases. Override with
 * LIKES_DB_PATH to store it elsewhere.
 */

const dataPath = process.env.LIKES_DB_PATH || path.join(process.cwd(), '.data', 'likes.json');

type Store = Record<string, Record<string, number>>;

// Reuse a single in-memory store across hot-reloads / module re-evaluation.
const globalForStore = globalThis as unknown as { __likesStore?: Store };

function load(): Store {
    if (globalForStore.__likesStore) {
        return globalForStore.__likesStore;
    }

    let store: Store = {};
    try {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            store = parsed as Store;
        }
    } catch {
        // Missing or corrupt file -> start empty.
        store = {};
    }

    globalForStore.__likesStore = store;
    return store;
}

function persist(store: Store): void {
    try {
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        const tmp = `${dataPath}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(store));
        fs.renameSync(tmp, dataPath);
    } catch (error) {
        // A failed write shouldn't break the request.
        console.error('[likes] Failed to persist store:', error);
    }
}

export interface LikeStat {
    count: number;
    liked: boolean;
}

/** Record a like for (imageId, visitorId). Idempotent. */
export function likeImage(imageId: string, visitorId: string): void {
    const store = load();
    const entry = store[imageId] || (store[imageId] = {});
    if (!entry[visitorId]) {
        entry[visitorId] = Date.now();
        persist(store);
    }
}

/** Remove a like for (imageId, visitorId). Idempotent. */
export function unlikeImage(imageId: string, visitorId: string): void {
    const store = load();
    const entry = store[imageId];
    if (entry && entry[visitorId]) {
        delete entry[visitorId];
        if (Object.keys(entry).length === 0) {
            delete store[imageId];
        }
        persist(store);
    }
}

/** Current count + this visitor's liked state for a single image. */
export function getStat(imageId: string, visitorId: string): LikeStat {
    const entry = load()[imageId] || {};
    return { count: Object.keys(entry).length, liked: Boolean(entry[visitorId]) };
}

/** Batched counts + liked flags for many images. */
export function getStats(imageIds: string[], visitorId: string): Record<string, LikeStat> {
    const store = load();
    const result: Record<string, LikeStat> = {};
    for (const id of imageIds) {
        const entry = store[id] || {};
        result[id] = { count: Object.keys(entry).length, liked: Boolean(entry[visitorId]) };
    }
    return result;
}
