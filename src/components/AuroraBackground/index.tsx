'use client';

import AuroraCanvas from '@/components/AuroraCanvas';
import AuroraCursor from '@/components/AuroraCursor';

const AuroraBackground: React.FC = () => {
    return (
        <>
            <AuroraCanvas />
            <div className="aurora-grain" aria-hidden="true" />
            <div className="aurora-vignette" aria-hidden="true" />
            <AuroraCursor />
        </>
    );
};

export default AuroraBackground;
