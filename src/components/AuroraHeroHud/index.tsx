'use client';

import { useEffect, useState } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Stockholm',
});

/** Hero corner readouts: the coordinates and the live Stockholm time. */
const AuroraHeroHud: React.FC = () => {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const tick = () => setTime(fmt.format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="aurora-hud">
            <div className="aurora-hud-left">
                <span className="aurora-hud-readout" aria-hidden="true">59.3293°N — 18.0686°E</span>
            </div>
            <div className="aurora-hud-right">
                <span className="aurora-hud-readout" aria-hidden="true">STHLM {time ?? '--:--:--'}</span>
            </div>
        </div>
    );
};

export default AuroraHeroHud;
