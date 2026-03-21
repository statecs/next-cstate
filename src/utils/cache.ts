import {promises as fs} from 'fs';
import path from 'path';
import crypto from 'crypto';

// Cache configuration
interface CacheConfig {
    enabled: boolean;
    basePath: string;
    defaultTTL: number;
    bypassPreview: boolean;
}

// Cache metadata stored alongside each cache entry
interface CacheMetadata {
    key: string;
    timestamp: number;
    ttl: number;
    contentType: string;
    preview: boolean;
}

// Cache statistics for monitoring
export interface CacheStats {
    totalFiles: number;
    totalSize: number;
    byContentType: {
        [key: string]: {
            files: number;
            size: number;
            oldestTimestamp: number;
            newestTimestamp: number;
        };
    };
}

// TTL configuration by content type (in milliseconds)
const CACHE_TTL: {[key: string]: number} = {
    editorial: 7 * 24 * 60 * 60 * 1000, // 7 days
    navigation: 7 * 24 * 60 * 60 * 1000, // 7 days
    collections: 7 * 24 * 60 * 60 * 1000, // 7 days
    writings: 7 * 24 * 60 * 60 * 1000, // 7 days
    journeys: 7 * 24 * 60 * 60 * 1000, // 7 days
    links: 7 * 24 * 60 * 60 * 1000, // 7 days
    caseStudies: 7 * 24 * 60 * 60 * 1000, // 7 days
    sitemap: 24 * 60 * 60 * 1000, // 1 day
    preview: 0, // Never cache preview
    generic: 7 * 24 * 60 * 60 * 1000 // 7 days default
};

// Main cache configuration
const CACHE_CONFIG: CacheConfig = {
    enabled: process.env.CONTENTFUL_CACHE_ENABLED !== 'false' && process.env.NODE_ENV === 'production',
    basePath: process.env.CONTENTFUL_CACHE_PATH || './.contentful-cache',
    defaultTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
    bypassPreview: true
};

/**
 * Generate a unique cache key from query string and preview flag
 */
export function generateCacheKey(query: string, preview: boolean): string {
    const data = `${query}${preview}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Get the file path for a cache entry
 */
export function getCachePath(key: string, contentType: string = 'generic'): string {
    const safeContentType = contentType.replace(/[^a-z0-9-]/gi, '_');
    return path.join(CACHE_CONFIG.basePath, safeContentType, `${key}.json`);
}

/**
 * Get the metadata file path for a cache entry
 */
function getMetaPath(key: string, contentType: string = 'generic'): string {
    const cachePath = getCachePath(key, contentType);
    return `${cachePath}.meta.json`;
}

/**
 * Check if a cache entry is still valid based on TTL
 */
export function isCacheValid(metadata: CacheMetadata): boolean {
    const now = Date.now();
    const age = now - metadata.timestamp;
    return age < metadata.ttl;
}

/**
 * Read cached data for a given key
 * Returns null if cache doesn't exist, is invalid, or read fails
 */
export async function readCache<T>(key: string, contentType: string = 'generic'): Promise<T | null> {
    if (!CACHE_CONFIG.enabled) {
        return null;
    }

    try {
        const metaPath = getMetaPath(key, contentType);
        const cachePath = getCachePath(key, contentType);

        // Read metadata first
        const metaContent = await fs.readFile(metaPath, 'utf-8');
        const metadata: CacheMetadata = JSON.parse(metaContent);

        // Check if cache is still valid
        if (!isCacheValid(metadata)) {
            // Delete expired cache entry
            await deleteCacheEntry(key, contentType).catch(() => {});
            return null;
        }

        // Read and return cached data
        const dataContent = await fs.readFile(cachePath, 'utf-8');
        return JSON.parse(dataContent) as T;

    } catch (error) {
        // Cache miss or corrupted - clean up and return null
        if (process.env.CONTENTFUL_CACHE_DEBUG === 'true') {
            console.warn(`[Cache] Failed to read cache for ${contentType}/${key.substring(0, 8)}:`, error);
        }
        await deleteCacheEntry(key, contentType).catch(() => {});
        return null;
    }
}

/**
 * Write data to cache with metadata
 * Uses atomic write pattern (temp file + rename) with retry logic
 */
export async function writeCache<T>(
    key: string,
    data: T,
    contentType: string = 'generic',
    preview: boolean = false
): Promise<void> {
    // Don't cache if disabled or in preview mode
    if (!CACHE_CONFIG.enabled || (preview && CACHE_CONFIG.bypassPreview)) {
        return;
    }

    const maxRetries = 3;
    const baseDelay = 50; // milliseconds

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const cachePath = getCachePath(key, contentType);
            const metaPath = getMetaPath(key, contentType);
            const cacheDir = path.dirname(cachePath);

            // Ensure directory exists
            await fs.mkdir(cacheDir, {recursive: true});

            // Small delay to allow filesystem to sync (especially important for parallel builds)
            if (attempt > 0) {
                await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
            }

            // Prepare metadata
            const metadata: CacheMetadata = {
                key,
                timestamp: Date.now(),
                ttl: CACHE_TTL[contentType] || CACHE_CONFIG.defaultTTL,
                contentType,
                preview
            };

            // Write to temporary files first (atomic write pattern)
            const tempDataPath = `${cachePath}.tmp`;
            const tempMetaPath = `${metaPath}.tmp`;

            await fs.writeFile(tempDataPath, JSON.stringify(data));
            await fs.writeFile(tempMetaPath, JSON.stringify(metadata));

            // Atomic rename with retry on ENOENT
            try {
                await fs.rename(tempDataPath, cachePath);
                await fs.rename(tempMetaPath, metaPath);
            } catch (renameError: any) {
                // If rename fails, clean up temp files
                await fs.unlink(tempDataPath).catch(() => {});
                await fs.unlink(tempMetaPath).catch(() => {});
                throw renameError;
            }

            if (process.env.CONTENTFUL_CACHE_DEBUG === 'true') {
                console.log(`[Cache] Wrote cache for ${contentType}/${key.substring(0, 8)}`);
            }

            // Success - exit retry loop
            return;

        } catch (error: any) {
            const isLastAttempt = attempt === maxRetries - 1;

            // Retry on ENOENT errors (race conditions)
            if (error?.code === 'ENOENT' && !isLastAttempt) {
                if (process.env.CONTENTFUL_CACHE_DEBUG === 'true') {
                    console.warn(`[Cache] Retry ${attempt + 1}/${maxRetries} for ${contentType}/${key.substring(0, 8)}`);
                }
                continue;
            }

            // Don't throw - cache write failures shouldn't break the app
            if (isLastAttempt) {
                console.error(`[Cache] Failed to write cache for ${contentType}/${key.substring(0, 8)}:`, error);
            }
            return;
        }
    }
}

/**
 * Delete a specific cache entry
 */
async function deleteCacheEntry(key: string, contentType: string = 'generic'): Promise<void> {
    const cachePath = getCachePath(key, contentType);
    const metaPath = getMetaPath(key, contentType);

    await Promise.all([
        fs.unlink(cachePath).catch(() => {}),
        fs.unlink(metaPath).catch(() => {})
    ]);
}

/**
 * Invalidate cache entries matching a pattern
 * @param pattern - Optional glob-style pattern (e.g., 'collections/*', 'writings/*')
 *                  If omitted, clears all cache
 */
export async function invalidateCache(pattern?: string): Promise<void> {
    if (!CACHE_CONFIG.enabled) {
        return;
    }

    try {
        if (!pattern) {
            // Clear all cache
            await fs.rm(CACHE_CONFIG.basePath, {recursive: true, force: true});
            console.log('[Cache] Cleared all cache');
            return;
        }

        // Parse pattern (e.g., 'collections/*' -> contentType: 'collections')
        const parts = pattern.split('/');
        const contentType = parts[0];

        if (contentType && parts[1] === '*') {
            // Clear all entries for this content type
            const contentTypeDir = path.join(CACHE_CONFIG.basePath, contentType);
            await fs.rm(contentTypeDir, {recursive: true, force: true});
            console.log(`[Cache] Cleared cache for content type: ${contentType}`);
        } else {
            // Clear specific file
            const cachePath = path.join(CACHE_CONFIG.basePath, pattern);
            await fs.unlink(cachePath).catch(() => {});
            await fs.unlink(`${cachePath}.meta.json`).catch(() => {});
            console.log(`[Cache] Cleared cache file: ${pattern}`);
        }

    } catch (error) {
        console.error('[Cache] Failed to invalidate cache:', error);
    }
}

/**
 * Get cache statistics for monitoring
 */
export async function getCacheStats(): Promise<CacheStats> {
    const stats: CacheStats = {
        totalFiles: 0,
        totalSize: 0,
        byContentType: {}
    };

    if (!CACHE_CONFIG.enabled) {
        return stats;
    }

    try {
        // Check if cache directory exists
        await fs.access(CACHE_CONFIG.basePath);

        // Read all content type directories
        const contentTypes = await fs.readdir(CACHE_CONFIG.basePath);

        for (const contentType of contentTypes) {
            const contentTypeDir = path.join(CACHE_CONFIG.basePath, contentType);
            const dirStats = await fs.stat(contentTypeDir);

            if (!dirStats.isDirectory()) continue;

            const files = await fs.readdir(contentTypeDir);
            const dataFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('.meta.json'));

            let typeSize = 0;
            let oldestTimestamp = Date.now();
            let newestTimestamp = 0;

            for (const file of dataFiles) {
                const filePath = path.join(contentTypeDir, file);
                const fileStats = await fs.stat(filePath);
                typeSize += fileStats.size;

                // Check metadata for timestamps
                const metaPath = `${filePath}.meta.json`;
                try {
                    const metaContent = await fs.readFile(metaPath, 'utf-8');
                    const metadata: CacheMetadata = JSON.parse(metaContent);
                    if (metadata.timestamp < oldestTimestamp) oldestTimestamp = metadata.timestamp;
                    if (metadata.timestamp > newestTimestamp) newestTimestamp = metadata.timestamp;
                } catch {
                    // Skip if metadata can't be read
                }
            }

            stats.byContentType[contentType] = {
                files: dataFiles.length,
                size: typeSize,
                oldestTimestamp,
                newestTimestamp
            };

            stats.totalFiles += dataFiles.length;
            stats.totalSize += typeSize;
        }

    } catch (error) {
        // Return empty stats if cache directory doesn't exist
        if (process.env.CONTENTFUL_CACHE_DEBUG === 'true') {
            console.warn('[Cache] Could not read cache stats:', error);
        }
    }

    return stats;
}

/**
 * Debug log helper
 */
function debugLog(...args: any[]) {
    if (process.env.CONTENTFUL_CACHE_DEBUG === 'true') {
        console.log('[Cache Debug]', ...args);
    }
}
