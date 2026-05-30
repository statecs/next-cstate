'use client';

import React from 'react';

interface AuroraMarqueeProps {
    items: string[];
}

const AuroraMarquee: React.FC<AuroraMarqueeProps> = ({ items }) => {
    const doubled = [...items, ...items];
    return (
        <div className="aurora-marquee" aria-label="Selected partners">
            <div className="aurora-mtrack">
                {doubled.map((item, i) => (
                    <span key={i}>{item}</span>
                ))}
            </div>
        </div>
    );
};

export default AuroraMarquee;
