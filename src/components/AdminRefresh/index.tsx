'use client';

import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {AlertCircle, Check, RefreshCw} from 'lucide-react';

type Status = 'idle' | 'working' | 'done' | 'error';

const LABELS: Record<Status, string> = {
    idle: 'Refresh content',
    working: 'Refreshing…',
    done: 'Content refreshed',
    error: 'Refresh failed'
};

/**
 * Clears the Contentful cache and revalidates, for admins who just published
 * an edit and don't want to wait on the webhook. Renders nothing for everyone
 * else. Lives inside the account dropdown, so the admin check only runs once
 * the menu is opened rather than on every page view.
 */
const AdminRefresh: React.FC<{onDone?: () => void}> = ({onDone}) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [status, setStatus] = useState<Status>('idle');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const controller = new AbortController();

        fetch('/api/admin/status', {signal: controller.signal})
            .then(res => res.json())
            .then(data => setIsAdmin(Boolean(data?.isAdmin)))
            .catch(() => {
                // Not an admin, or the check failed — either way, stay hidden.
            });

        return () => controller.abort();
    }, []);

    if (!isAdmin) return null;

    const refresh = async () => {
        if (status === 'working') return;
        setStatus('working');

        try {
            const res = await fetch('/api/admin/revalidate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({path: pathname})
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setStatus('done');
            // Pull the freshly rebuilt payload for the page we're on.
            router.refresh();
            setTimeout(() => {
                setStatus('idle');
                onDone?.();
            }, 1200);
        } catch (error) {
            console.error('[AdminRefresh]', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2400);
        }
    };

    const Icon = status === 'done' ? Check : status === 'error' ? AlertCircle : RefreshCw;

    return (
        <li>
            <button
                type="button"
                onClick={refresh}
                disabled={status === 'working'}
                className="flex w-full items-center px-4 py-2 text-left hover:bg-white/5 disabled:cursor-wait"
                style={{color: 'var(--aurora-text)'}}
                title="Clear the Contentful cache and rebuild the site"
            >
                <Icon
                    className={`w-4 h-4 mr-2 ${status === 'working' ? 'animate-spin' : ''}`}
                    style={{
                        color:
                            status === 'done'
                                ? 'var(--aurora-accent, currentColor)'
                                : status === 'error'
                                ? '#f87171'
                                : undefined
                    }}
                />
                <span aria-live="polite">{LABELS[status]}</span>
            </button>
        </li>
    );
};

export default AdminRefresh;
