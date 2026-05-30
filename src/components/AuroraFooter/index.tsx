import React from 'react';
import Link from 'next/link';

const AuroraFooter: React.FC = () => {
    return (
        <footer className="aurora-footer">
            <div className="aurora-foot-card aurora-reveal">
                <div>
                    <h2>Let&apos;s Work Together</h2>
                    <p>Have a project in mind or want to collaborate? I&apos;d love to hear from you.</p>
                </div>
                <Link href="/contact" className="aurora-foot-btn" data-magnetic>
                    Start a conversation
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
            <div className="aurora-foot-meta">
                <span>© {new Date().getFullYear()} Christopher State · Stockholm</span>
                <span>Aurora · Flux</span>
            </div>
        </footer>
    );
};

export default AuroraFooter;
