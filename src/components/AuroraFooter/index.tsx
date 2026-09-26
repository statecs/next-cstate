'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github } from 'lucide-react';
import { SOCIAL_LINKS } from '@/utils/constants';

const HIDE_CARD_PATHS = ['/contact'];
const HIDE_FOOTER_PREFIXES = ['/writing/', '/projects/'];

const AuroraFooter: React.FC = () => {
    const pathname = usePathname();
    const hideCard = HIDE_CARD_PATHS.includes(pathname);
    const hideFooter = HIDE_FOOTER_PREFIXES.some(p => pathname.startsWith(p));

    if (hideFooter) return null;

    return (
        <footer className="aurora-footer">
            {!hideCard && (
                <div className="aurora-foot-card aurora-reveal">
                    <div>
                        <h2>Let&apos;s Work Together</h2>
                        <p>Have a project in mind or want to collaborate? I&apos;d love to hear from you.</p>
                    </div>
                    <Link href="mailto:hej@cstate.se" className="aurora-foot-btn" data-magnetic>
                        Start a conversation
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            )}
            <div className="aurora-foot-meta">
                <span>© {new Date().getFullYear()} Christopher State · Stockholm</span>
                <span className="aurora-foot-links">
                    {SOCIAL_LINKS.map(s => (
                        <a
                            key={s.url}
                            href={s.url}
                            className="aurora-foot-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {s.label}
                        </a>
                    ))}
                    <Link href="/privacy" className="aurora-foot-link">
                        Privacy
                    </Link>
                    <a
                        href="https://github.com/statecs/next-cstate"
                        className="aurora-foot-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Github size={12} aria-hidden="true" />
                        Open source — view the code
                        <span aria-hidden="true">↗</span>
                    </a>
                </span>
            </div>
        </footer>
    );
};

export default AuroraFooter;
