'use client';

import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * Makes a portalled element a modal in every sense: the page behind is inert to
 * keyboard and screen readers and cannot scroll, Tab cycles within the dialog,
 * Escape closes it, and focus goes back to whatever opened it.
 *
 * Focus lands on the root unless something inside already took it on mount
 * (an input that focuses itself, say), so the dialog's name is announced either
 * way.
 *
 * Dialogs can stack — the chat's mic opens the voice dialog over the ask dialog.
 * The upper one makes the lower one inert, and an inert dialog ignores keys and
 * focus moves until it is uncovered.
 */
export const useModalDialog = (rootRef: RefObject<HTMLElement>, onClose: () => void) => {
    // Read during the first render, before any child effect can move focus.
    const [opener] = useState<HTMLElement | null>(() =>
        typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null)
    );
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        const siblings = Array.from(document.body.children).filter(
            (el): el is HTMLElement => el instanceof HTMLElement && el !== root
        );
        const restore = siblings.map(el => ({ el, inert: el.inert, hidden: el.getAttribute('aria-hidden') }));
        siblings.forEach(el => {
            el.inert = true;
            el.setAttribute('aria-hidden', 'true');
        });

        if (!root.contains(document.activeElement)) root.focus({ preventScroll: true });

        const focusables = () =>
            Array.from(
                root.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => el.offsetParent !== null);

        const onKey = (e: KeyboardEvent) => {
            if (root.inert) return;
            if (e.key === 'Escape') {
                // A popup inside the dialog (the chat's suggestion list) may
                // have used this Escape already.
                if (e.defaultPrevented) return;
                e.preventDefault();
                onCloseRef.current();
                return;
            }
            if (e.key !== 'Tab') return;
            const items = focusables();
            if (items.length === 0) {
                e.preventDefault();
                root.focus();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && (active === first || active === root || !root.contains(active))) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || !root.contains(active))) {
                e.preventDefault();
                first.focus();
            }
        };

        // Anything that still manages to focus outside (e.g. VoiceOver's cursor
        // on a browser without inert) is pulled back in.
        const onFocusIn = (e: FocusEvent) => {
            if (root.inert) return;
            if (!root.contains(e.target as Node)) {
                e.stopPropagation();
                (focusables()[0] ?? root).focus();
            }
        };

        document.addEventListener('keydown', onKey);
        document.addEventListener('focusin', onFocusIn);
        return () => {
            document.documentElement.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('focusin', onFocusIn);
            restore.forEach(({ el, inert, hidden }) => {
                el.inert = inert;
                if (hidden === null) el.removeAttribute('aria-hidden');
                else el.setAttribute('aria-hidden', hidden);
            });
            opener?.focus?.({ preventScroll: true });
        };
    }, [rootRef, opener]);
};
