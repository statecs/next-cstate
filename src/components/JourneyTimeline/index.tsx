'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TimelineSkeleton } from '@/components/Skeletons';
import JourneyItem, { type JourneyEntry } from './JourneyItem';

interface JourneyTimelineProps {
    /** First page, rendered on the server so the section is never empty. */
    initialItems: JourneyEntry[];
    total: number;
    pageSize: number;
}

/**
 * Renders the journey newest-first, pulling one page at a time as the reader
 * approaches the end. Only the first page ships in the initial payload — the
 * rest arrive on demand, which keeps the up-front HTML, the hydrated
 * LikeableImage instances, and the batched /api/likes lookup small.
 */
const JourneyTimeline = ({ initialItems, total, pageSize }: JourneyTimelineProps) => {
    const [items, setItems] = useState<JourneyEntry[]>(initialItems);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const sentinel = useRef<HTMLDivElement>(null);
    // Read inside the observer callback, which must not be re-created per item.
    const state = useRef({ count: initialItems.length, loading: false });

    const hasMore = items.length < total;

    const loadMore = useCallback(async () => {
        if (state.current.loading || state.current.count >= total) return;
        state.current.loading = true;
        setLoading(true);
        setFailed(false);

        try {
            const res = await fetch(`/api/journey?skip=${state.current.count}&limit=${pageSize}`);
            if (!res.ok) throw new Error(`Journey request failed: ${res.status}`);
            const data = await res.json();
            const next: JourneyEntry[] = Array.isArray(data.items) ? data.items : [];

            if (next.length === 0) {
                // Nothing came back; stop asking rather than spinning forever.
                state.current.count = total;
                setItems(current => current.slice(0, current.length));
            } else {
                state.current.count += next.length;
                setItems(current => [...current, ...next]);
            }
        } catch {
            setFailed(true);
        } finally {
            state.current.loading = false;
            setLoading(false);
        }
    }, [pageSize, total]);

    useEffect(() => {
        const node = sentinel.current;
        if (!node || !hasMore || failed) return;

        const io = new IntersectionObserver(
            entries => {
                if (entries.some(e => e.isIntersecting)) loadMore();
            },
            // Start fetching before the sentinel is on screen so the next rows
            // are usually in place by the time the reader gets there.
            { rootMargin: '600px 0px' }
        );

        io.observe(node);
        return () => io.disconnect();
    }, [hasMore, failed, loadMore]);

    return (
        <>
            <div className="aurora-timeline">
                {items.length > 0 ? (
                    items.map((item, i) => <JourneyItem key={`${item.year}-${item.title}-${i}`} item={item} index={i} />)
                ) : (
                    <p style={{ color: 'var(--aurora-muted)' }}>No journey entries to display.</p>
                )}
            </div>

            {hasMore && (
                <div ref={sentinel} className="pt-10" aria-live="polite">
                    {loading && <TimelineSkeleton count={2} />}
                    {failed && (
                        <button type="button" className="aurora-btn" onClick={loadMore}>
                            Couldn&apos;t load more — retry
                        </button>
                    )}
                    {/* Keyboard and no-JS-observer fallback: the list is still reachable. */}
                    {!loading && !failed && (
                        <button type="button" className="aurora-btn" onClick={loadMore}>
                            Load more
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default JourneyTimeline;
