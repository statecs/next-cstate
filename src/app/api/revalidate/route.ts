import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {invalidateCache} from '@/utils/cache';
import {fetchPhotosLinkedCollections} from '@/utils/contentful';

/**
 * POST handler for Contentful webhook revalidation
 * Triggered when content is published/unpublished/deleted in Contentful
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Verify webhook secret
        const authHeader = request.headers.get('authorization');
        const expectedToken = `Bearer ${process.env.CONTENTFUL_WEBHOOK_SECRET}`;

        if (!authHeader || authHeader !== expectedToken) {
            console.error('[Webhook] Unauthorized request');
            return NextResponse.json(
                {error: 'Unauthorized'},
                {status: 401}
            );
        }

        // 2. Parse Contentful webhook payload
        const payload = await request.json();
        const {sys} = payload;

        // Extract content type and entry ID
        const contentType = sys?.contentType?.sys?.id;
        const entryId = sys?.id;
        const action = request.headers.get('x-contentful-topic') || 'unknown';

        console.log(`[Webhook] ${action} - ${contentType} - ${entryId}`);

        // 3. Selective cache invalidation based on content type
        switch (contentType) {
            case 'collection': {
                // Invalidate collection cache
                await invalidateCache('collections/*');

                // Revalidate related pages
                try {
                    // Get collection slugs that contain this photo
                    const collectionSlugs = await fetchPhotosLinkedCollections(entryId);

                    // Revalidate each collection page
                    for (const slug of collectionSlugs) {
                        await revalidatePath(`/projects/${slug}`);
                        console.log(`[Webhook] Revalidated /projects/${slug}`);
                    }

                    // Revalidate main projects page
                    await revalidatePath('/projects');

                    // Revalidate photo pages would require knowing photo slugs
                    // For simplicity, we'll revalidate the whole layout
                    await revalidatePath('/projects', 'layout');
                } catch (error) {
                    console.error('[Webhook] Error revalidating collection paths:', error);
                }

                // Invalidate navigation cache (collections appear in nav)
                await invalidateCache('navigation/*');
                await revalidatePath('/home');

                break;
            }

            case 'writing': {
                // Invalidate writing cache
                await invalidateCache('writings/*');

                // Revalidate related pages
                try {
                    // Revalidate main writing page and layout
                    await revalidatePath('/writing');
                    await revalidatePath('/writing', 'layout');
                } catch (error) {
                    console.error('[Webhook] Error revalidating writing paths:', error);
                }

                // Invalidate navigation cache (writings appear in nav)
                await invalidateCache('navigation/*');
                await revalidatePath('/home');

                break;
            }

            case 'editorial': {
                // Invalidate editorial cache
                await invalidateCache('editorial/*');

                // Try to extract slug from payload fields
                const slug = payload?.fields?.slug?.['en-US'];
                if (slug) {
                    await revalidatePath(`/${slug}`);
                    console.log(`[Webhook] Revalidated /${slug}`);
                }

                // Revalidate common editorial pages
                await revalidatePath('/home');
                await revalidatePath('/about');

                break;
            }

            case 'linksPage': {
                // Invalidate links cache
                await invalidateCache('links/*');
                await revalidatePath('/links');

                break;
            }

            case 'journey': {
                // Invalidate journeys cache
                await invalidateCache('journeys/*');
                await revalidatePath('/about');
                await revalidatePath('/home');

                break;
            }

            case 'collectionNavigation': {
                // Invalidate navigation cache
                await invalidateCache('navigation/*');
                await revalidatePath('/projects');
                await revalidatePath('/home');
                await revalidatePath('/collections');

                break;
            }

            case 'writingNavigation': {
                // Invalidate navigation cache
                await invalidateCache('navigation/*');
                await revalidatePath('/writing');
                await revalidatePath('/home');
                await revalidatePath('/collections');

                break;
            }

            case 'photo': {
                // Photo was updated - invalidate collections that contain it
                await invalidateCache('collections/*');
                await invalidateCache('writings/*');

                // Revalidate all project and writing pages
                await revalidatePath('/projects', 'layout');
                await revalidatePath('/writing', 'layout');

                break;
            }

            default:
                // Unknown content type - do full cache invalidation
                console.warn(`[Webhook] Unknown content type: ${contentType}`);
                await invalidateCache();
                await revalidatePath('/', 'layout');
        }

        return NextResponse.json({
            revalidated: true,
            contentType,
            action,
            entryId,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('[Webhook] Error processing webhook:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: String(error)},
            {status: 500}
        );
    }
}

/**
 * GET handler for manual full cache clear
 * Usage: curl -X GET https://cstate.se/api/revalidate \
 *             -H "Authorization: Bearer {secret}"
 */
export async function GET(request: NextRequest) {
    try {
        // Verify auth
        const authHeader = request.headers.get('authorization');
        const expectedToken = `Bearer ${process.env.CONTENTFUL_WEBHOOK_SECRET}`;

        if (!authHeader || authHeader !== expectedToken) {
            console.error('[Manual Clear] Unauthorized request');
            return NextResponse.json(
                {error: 'Unauthorized'},
                {status: 401}
            );
        }

        console.log('[Manual Clear] Clearing all cache...');

        // Clear all cache
        await invalidateCache();

        // Revalidate all paths
        await revalidatePath('/', 'layout');

        console.log('[Manual Clear] Complete');

        return NextResponse.json({
            cleared: true,
            message: 'All cache cleared and paths revalidated',
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('[Manual Clear] Error:', error);
        return NextResponse.json(
            {error: 'Failed to clear cache', message: String(error)},
            {status: 500}
        );
    }
}
