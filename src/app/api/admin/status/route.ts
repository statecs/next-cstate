import {NextResponse} from 'next/server';
import {isAdminSession} from '@/utils/admin';

/**
 * Tells the nav whether to render the admin-only refresh control.
 * Cosmetic only — /api/admin/revalidate re-checks before doing any work.
 */
export async function GET() {
    return NextResponse.json(
        {isAdmin: await isAdminSession()},
        {headers: {'Cache-Control': 'no-store'}}
    );
}
