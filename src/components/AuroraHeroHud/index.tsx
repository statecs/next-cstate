'use client';

import { useEffect, useState } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Stockholm',
});

/** Decorative corner readouts in the hero: coordinates + live Stockholm time. */
const AuroraHeroHud: React.FC = () => {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const tick = () => setTime(fmt.format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="aurora-hud" aria-hidden="true">
            <span>59.3293°N — 18.0686°E</span>
            <span>STHLM {time ?? '--:--:--'}</span>
        </div>
    );
};

export default AuroraHeroHud;
