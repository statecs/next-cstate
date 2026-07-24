'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { loadLikeStat, toggleLike, type LikeStat } from './likesClient';
import styles from './LikeableImage.module.css';

interface LikeableImageProps {
    imageId: string;
    src: string;
    alt: string;
    priority?: boolean;
}

const DOUBLE_TAP_MS = 300;

export default function LikeableImage({ imageId, src, alt, priority = false }: LikeableImageProps) {
    const [stat, setStat] = useState<LikeStat>({ count: 0, liked: false });
    const [ready, setReady] = useState(false);
    const [burst, setBurst] = useState(false);

    const lastTap = useRef(0);
    const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Guards against overlapping requests clobbering each other.
    const inFlight = useRef(false);

    useEffect(() => {
        let active = true;
        loadLikeStat(imageId).then(s => {
            if (active) {
                setStat(s);
                setReady(true);
            }
        });
        return () => {
            active = false;
            if (burstTimer.current) clearTimeout(burstTimer.current);
        };
    }, [imageId]);

    const showBurst = useCallback(() => {
        setBurst(false);
        // Force a reflow-free re-trigger of the animation.
        requestAnimationFrame(() => {
            setBurst(true);
            if (burstTimer.current) clearTimeout(burstTimer.current);
            burstTimer.current = setTimeout(() => setBurst(false), 900);
        });
    }, []);

    const applyLike = useCallback(
        async (nextLiked: boolean) => {
            if (inFlight.current || nextLiked === stat.liked) return;
            inFlight.current = true;

            // Optimistic update.
            const prev = stat;
            setStat(s => ({ liked: nextLiked, count: Math.max(0, s.count + (nextLiked ? 1 : -1)) }));

            try {
                const fresh = await toggleLike(imageId, nextLiked ? 'like' : 'unlike');
                setStat(fresh);
            } catch {
                setStat(prev); // revert on failure
            } finally {
                inFlight.current = false;
            }
        },
        [imageId, stat]
    );

    // Desktop double-click.
    const handleDoubleClick = useCallback(() => {
        showBurst();
        applyLike(true);
    }, [showBurst, applyLike]);

    // Touch double-tap (dblclick is unreliable on touch devices).
    const handleTouchEnd = useCallback(() => {
        const now = Date.now();
        if (now - lastTap.current < DOUBLE_TAP_MS) {
            lastTap.current = 0;
            showBurst();
            applyLike(true);
        } else {
            lastTap.current = now;
        }
    }, [showBurst, applyLike]);

    const handleHeartClick = useCallback(() => {
        const next = !stat.liked;
        if (next) showBurst();
        applyLike(next);
    }, [stat.liked, showBurst, applyLike]);

    return (
        <div
            className={styles.wrap}
            onDoubleClick={handleDoubleClick}
            onTouchEnd={handleTouchEnd}
        >
            <Image
                src={src}
                alt={alt}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, 700px"
                style={{ width: '100%', height: 'auto' }}
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
                className="w-full object-cover"
                draggable={false}
            />

            <svg
                className={`${styles.burst} ${burst ? styles.burstOn : ''}`}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>

            <div className={`${styles.controls} ${stat.liked ? styles.liked : ''}`}>
                <button
                    type="button"
                    className={styles.heartBtn}
                    onClick={handleHeartClick}
                    aria-pressed={stat.liked}
                    aria-label={stat.liked ? 'Unlike this image' : 'Like this image'}
                >
                    <svg className={styles.heartIcon} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                    </svg>
                </button>
                <span className={styles.count} aria-live="polite">
                    {ready ? stat.count : ''}
                </span>
                {ready && stat.count === 0 && !stat.liked && (
                    <span className={styles.hint}>Double-tap to like</span>
                )}
            </div>
        </div>
    );
}
