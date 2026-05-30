'use client';

import React from 'react';

interface MarqueeItem {
    name: string;
    logo?: string;
    height?: number;
}

interface AuroraMarqueeProps {
    items: MarqueeItem[];
}

const AuroraMarquee: React.FC<AuroraMarqueeProps> = ({ items }) => {
    const doubled = [...items, ...items];
    return (
        <>
            {/* Desktop: scrolling marquee */}
            <div className="aurora-marquee" aria-label="Selected partners">
                <div className="aurora-mtrack">
                    {doubled.map((item, i) =>
                        item.logo ? (
                            <div key={i} className="aurora-mtrack-logo">
                                <img
                                    src={item.logo}
                                    alt={item.name}
                                    style={{ height: item.height ?? 44 }}
                                />
                            </div>
                        ) : (
                            <span key={i}>{item.name}</span>
                        )
                    )}
                </div>
            </div>

            {/* Mobile: static 2-column grid */}
            <div className="aurora-logo-grid" aria-label="Selected partners">
                {items.map((item, i) =>
                    item.logo ? (
                        <div key={i} className="aurora-logo-box">
                            <img src={item.logo} alt={item.name} />
                        </div>
                    ) : null
                )}
            </div>
        </>
    );
};

export default AuroraMarquee;
