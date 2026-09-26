'use client';

import { useEffect, useState } from 'react';
import AuroraSocialIcons from '@/components/AuroraSocialIcons';

const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Stockholm',
});

/** Hero corner readouts: coordinates, and social links over the live Stockholm time. */
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
            <span className="aurora-hud-readout" aria-hidden="true">59.3293°N — 18.0686°E</span>
            <div className="aurora-hud-right">
                <AuroraSocialIcons />
                <span className="aurora-hud-readout" aria-hidden="true">STHLM {time ?? '--:--:--'}</span>
            </div>
        </div>
    );
};

export default AuroraHeroHud;
