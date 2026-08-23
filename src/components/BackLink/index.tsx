import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackLinkProps {
    href: string;
    label: string;
    className?: string;
}

/**
 * Way back out of a detail page to the index it belongs to. Below `lg` the
 * FloatingHeader's fixed pill already opens that index, so pages place this in
 * the flow of their desktop header rather than pinning it to the viewport.
 */
const BackLink: React.FC<BackLinkProps> = ({ href, label, className = '' }) => (
    <Link href={href} className={`aurora-back ${className}`.trim()}>
        <ArrowLeft size={14} aria-hidden="true" />
        <span>{label}</span>
    </Link>
);

export default BackLink;
