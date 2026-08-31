import 'server-only';
import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server';

/**
 * Kinde has no admin role — every signed-in user carries the default
 * `new-users` role — so the allowlist lives in CACHE_ADMIN_EMAILS as a
 * comma-separated list. An unset or empty list means nobody is an admin.
 */
const adminEmails = (): string[] =>
    (process.env.CACHE_ADMIN_EMAILS || '')
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(Boolean);

/**
 * True when the current Kinde session belongs to an allowlisted admin.
 * Every admin-only route must call this — the client is never trusted.
 */
export const isAdminSession = async (): Promise<boolean> => {
    const allowed = adminEmails();
    if (allowed.length === 0) return false;

    const {isAuthenticated, getUser} = getKindeServerSession();
    if (!(await isAuthenticated())) return false;

    const user = await getUser();
    const email = user?.email?.trim().toLowerCase();

    return Boolean(email && allowed.includes(email));
};
