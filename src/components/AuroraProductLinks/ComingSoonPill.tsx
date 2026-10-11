'use client';

import { useEffect, useId, useState } from 'react';

interface Props {
    label: string;
    host: string;
    children: React.ReactNode;
}

/**
 * A product pill that is not linked yet. Hover and focus show a "Coming soon"
 * tooltip through CSS; a click or tap shows it for a moment too, since touch has
 * no hover.
 */
const ComingSoonPill: React.FC<Props> = ({ label, host, children }) => {
    // The pills render twice on the home page (hero and about), so the
    // tooltip id must be unique per copy.
    const id = useId();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => setOpen(false), 1800);
        return () => clearTimeout(t);
    }, [open]);

    return (
        <button
            type="button"
            className="soon"
            aria-disabled="true"
            aria-describedby={id}
            data-open={open || undefined}
            onClick={() => setOpen(true)}
        >
            {children}
            <span>{host}</span>
            <span role="tooltip" id={id} className="aurora-tip">
                {label} — coming soon
            </span>
        </button>
    );
};

export default ComingSoonPill;
