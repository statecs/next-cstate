'use client';

import { useEffect, useRef } from 'react';

const STOPS: Array<[number, number, number]> = [
    [201, 182, 255],
    [255, 111, 216],
    [106, 168, 255],
    [94, 234, 212],
];

const ramp = (h: number): [number, number, number] => {
    h = (h % 1 + 1) % 1;
    const n = STOPS.length;
    const f = h * n;
    const i = Math.floor(f);
    const u = f - i;
    const a = STOPS[i % n];
    const b = STOPS[(i + 1) % n];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
};

const AuroraCanvas: React.FC = () => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const cv = ref.current;
        if (!cv) return;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = matchMedia('(pointer:coarse)').matches;

        let W = 0;
        let H = 0;
        let DPR = 1;
        let raf = 0;
        let running = false;
        let t = 0;
        let parts: { x: number; y: number; hue: number; sp: number }[] = [];
        let mx = -9999;
        let my = -9999;
        let active = false;
        let idle = 0;
        let burst: { x: number; y: number; power: number } | null = null;

        const init = () => {
            const dens = innerWidth < 560 ? 9000 : 5600;
            const n = Math.min(coarse ? 120 : 360, Math.round((innerWidth * innerHeight) / dens));
            parts = Array.from({ length: n }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                hue: Math.random(),
                sp: 0.7 + Math.random() * 1.0,
            }));
        };

        const resize = () => {
            DPR = Math.min(devicePixelRatio || 1, coarse ? 1.6 : 1.5);
            W = cv.width = innerWidth * DPR;
            H = cv.height = innerHeight * DPR;
            cv.style.width = innerWidth + 'px';
            cv.style.height = innerHeight + 'px';
            init();
        };

        const setPointer = (x: number, y: number) => {
            mx = x * DPR;
            my = y * DPR;
            active = true;
            idle = 0;
        };

        const onMove = (e: PointerEvent) => {
            if (!running) return;
            setPointer(e.clientX, e.clientY);
        };
        const onDown = (e: PointerEvent) => {
            if (!running) return;
            burst = { x: e.clientX * DPR, y: e.clientY * DPR, power: 7.5 * DPR };
            setPointer(e.clientX, e.clientY);
        };

        addEventListener('pointermove', onMove, { passive: true });
        addEventListener('pointerdown', onDown, { passive: true });

        const fade = (a: number) => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(7,6,17,${a})`;
            ctx.fillRect(0, 0, W, H);
        };

        const frame = () => {
            t += 0.0019;
            fade(0.11);
            const AX = (0.5 + Math.cos(t * 0.7) * 0.3) * W;
            const AY = (0.5 + Math.sin(t * 0.9) * 0.27) * H;

            ctx.globalCompositeOperation = 'lighter';
            const bc = ramp(t * 0.06);
            const bg = ctx.createRadialGradient(AX, AY, 0, AX, AY, 0.42 * Math.min(W, H));
            bg.addColorStop(0, `rgba(${bc[0] | 0},${bc[1] | 0},${bc[2] | 0},.05)`);
            bg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            ctx.lineWidth = DPR * 1.1;
            const R = (coarse ? 120 : 155) * DPR;
            const hShift = t * 0.1;

            if (active) {
                idle++;
                if (idle > 90) active = false;
            }

            for (const p of parts) {
                const ang = (Math.sin(p.x * 0.0016 + t * 0.6) + Math.cos(p.y * 0.0016 - t * 0.4)) * Math.PI;
                let vx = Math.cos(ang) * p.sp * DPR;
                let vy = Math.sin(ang) * p.sp * DPR;
                const adx = AX - p.x;
                const ady = AY - p.y;
                const ad = Math.hypot(adx, ady) || 1;
                vx += (adx / ad) * 0.22 * DPR;
                vy += (ady / ad) * 0.22 * DPR;
                if (active) {
                    const dx = p.x - mx;
                    const dy = p.y - my;
                    const d = Math.hypot(dx, dy);
                    if (d < R && d > 0) {
                        const f = (1 - d / R) * 3.6;
                        vx += (dx / d) * f;
                        vy += (dy / d) * f;
                    }
                }
                if (burst && burst.power > 0.06) {
                    const dx = p.x - burst.x;
                    const dy = p.y - burst.y;
                    const d = Math.hypot(dx, dy) || 1;
                    const RB = 340 * DPR;
                    if (d < RB) {
                        const f = burst.power * (1 - d / RB);
                        vx += (dx / d) * f;
                        vy += (dy / d) * f;
                    }
                }
                const ox = p.x;
                const oy = p.y;
                p.x += vx;
                p.y += vy;
                if (p.x < 0) p.x += W;
                else if (p.x > W) p.x -= W;
                if (p.y < 0) p.y += H;
                else if (p.y > H) p.y -= H;
                if (Math.abs(p.x - ox) < 60 * DPR && Math.abs(p.y - oy) < 60 * DPR) {
                    const c = ramp(p.hue + hShift);
                    ctx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},.52)`;
                    ctx.beginPath();
                    ctx.moveTo(ox, oy);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            }
            if (burst) {
                burst.power *= 0.9;
                if (burst.power < 0.06) burst = null;
            }
            ctx.globalCompositeOperation = 'source-over';
            if (running) raf = requestAnimationFrame(frame);
        };

        const staticWash = () => {
            ctx.clearRect(0, 0, W, H);
            ctx.globalCompositeOperation = 'lighter';
            const blobs: Array<[number, number, number, number, number, number]> = [
                [201, 182, 255, 0.28, 0.3, 0.32],
                [255, 111, 216, 0.22, 0.72, 0.66],
                [106, 168, 255, 0.2, 0.6, 0.2],
                [94, 234, 212, 0.16, 0.2, 0.75],
            ];
            blobs.forEach(b => {
                const cx = b[4] * W;
                const cy = b[5] * H;
                const rad = 0.55 * Math.min(W, H);
                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
                g.addColorStop(0, `rgba(${b[0]},${b[1]},${b[2]},${b[3]})`);
                g.addColorStop(1, `rgba(${b[0]},${b[1]},${b[2]},0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(cx, cy, rad, 0, 6.28);
                ctx.fill();
            });
            ctx.globalCompositeOperation = 'source-over';
        };

        const start = () => {
            if (reduce || document.body.classList.contains('noanim')) {
                running = false;
                cancelAnimationFrame(raf);
                staticWash();
                return;
            }
            running = true;
            cancelAnimationFrame(raf);
            ctx.clearRect(0, 0, W, H);
            frame();
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
            staticWash();
        };

        const onResize = () => {
            resize();
            if (!running) staticWash();
        };

        const onMotion = (e: Event) => {
            const off = (e as CustomEvent<boolean>).detail;
            if (off) stop();
            else start();
        };

        resize();
        addEventListener('resize', onResize);
        document.addEventListener('cs:motion', onMotion);
        start();

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            removeEventListener('pointermove', onMove);
            removeEventListener('pointerdown', onDown);
            removeEventListener('resize', onResize);
            document.removeEventListener('cs:motion', onMotion);
        };
    }, []);

    return <canvas ref={ref} className="aurora-canvas" aria-hidden="true" />;
};

export default AuroraCanvas;
