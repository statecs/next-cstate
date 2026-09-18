'use client';

import { useEffect, useRef } from 'react';
import { STOPS_DARK, STOPS_LIGHT, ramp } from '@/components/AuroraCanvas';

export type OrbMode = 'connecting' | 'listening' | 'thinking' | 'speaking' | 'paused' | 'error';

interface VoiceOrbProps {
  mode: OrbMode;
  /** Mic loudness, 0..~1, sampled each frame. */
  getMicLevel: () => number;
  /** Speaker loudness, 0..~1, sampled each frame. */
  getOutputLevel: () => number;
  size?: number;
}

/**
 * The site's aurora, gathered into a sphere. The same flow field drifts inside
 * a circle; sound moves the rings around it — inward while it hears you,
 * outward while it speaks — so the direction of the waves says who is talking.
 */
const VoiceOrb: React.FC<VoiceOrbProps> = ({ mode, getMicLevel, getOutputLevel, size = 320 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  const levelsRef = useRef({ getMicLevel, getOutputLevel });

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { levelsRef.current = { getMicLevel, getOutputLevel }; }, [getMicLevel, getOutputLevel]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer:coarse)').matches;
    const DPR = Math.min(devicePixelRatio || 1, 2);
    // The square canvas is larger than the orb so rings have room to travel.
    const S = size * DPR;
    cv.width = S;
    cv.height = S;
    cv.style.width = size + 'px';
    cv.style.height = size + 'px';
    const C = S / 2;
    const R = S * 0.34;
    const RING_FAR = S * 0.47;

    // Trails persist on an offscreen canvas that only ever shows through the circle.
    const inner = document.createElement('canvas');
    inner.width = S;
    inner.height = S;
    const ictx = inner.getContext('2d')!;

    const isLight = () => document.documentElement.classList.contains('light');
    const motionOff = () => reduce || document.documentElement.classList.contains('noanim');

    const n = coarse ? 90 : 150;
    const parts = Array.from({ length: n }, () => spawn());
    function spawn() {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * R;
      return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, hue: Math.random(), sp: 0.5 + Math.random() * 0.8 };
    }

    const rings: { r: number; a: number; dir: 1 | -1 }[] = [];
    let raf = 0;
    let t = 0;
    let mic = 0;
    let out = 0;
    let breathe = 0;
    let ringClock = 0;
    let running = true;
    // With motion off the sphere still gets its aurora texture: the field runs
    // for a moment at start, then freezes.
    let warmup = 0;

    const frame = () => {
      const light = isLight();
      const stops = light ? STOPS_LIGHT : STOPS_DARK;
      const m = modeRef.current;
      const still = motionOff();

      // Fast attack, slow release — a level that reads as sound, not as jitter.
      const rawMic = m === 'listening' ? Math.min(1, levelsRef.current.getMicLevel() * 6) : 0;
      const rawOut = m === 'speaking' ? Math.min(1, levelsRef.current.getOutputLevel() * 4) : 0;
      mic += (rawMic - mic) * (rawMic > mic ? 0.5 : 0.08);
      out += (rawOut - out) * (rawOut > out ? 0.5 : 0.1);
      const level = Math.max(mic, out);
      const target = m === 'paused' || m === 'error' ? -0.03 : level * 0.09;
      breathe += (target - breathe) * 0.12;

      const paintInner = !still || warmup < 80;
      if (paintInner) warmup++;
      t += still && warmup >= 80 ? 0 : (m === 'speaking' ? 0.010 : m === 'thinking' ? 0.012 : 0.0045);
      const scale = 1 + breathe + (still ? 0 : Math.sin(t * 2.4) * 0.008);
      const r = R * scale;

      ctx.clearRect(0, 0, S, S);

      // Halo — the orb's light spilling onto the backdrop, louder when louder.
      const hc = ramp(stops, t * 0.06);
      // Outer radius stays inside the canvas so the glow fades to nothing
      // before the edge — otherwise the canvas's square shows as a box.
      const haloR = Math.min(C - 1, r * (1.35 + level * 0.12));
      const halo = ctx.createRadialGradient(C, C, r * 0.6, C, C, haloR);
      const haloA = light ? 0.10 + level * 0.14 : 0.16 + level * 0.28;
      halo.addColorStop(0, `rgba(${hc[0] | 0},${hc[1] | 0},${hc[2] | 0},${haloA})`);
      halo.addColorStop(1, `rgba(${hc[0] | 0},${hc[1] | 0},${hc[2] | 0},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, S, S);

      // Rings: spawned by sound, travelling in the direction sound travels.
      if (!still) {
        ringClock += 1;
        const gate = m === 'listening' ? mic : m === 'speaking' ? out : 0;
        const every = Math.max(4, 22 - gate * 18);
        if (gate > 0.08 && ringClock >= every) {
          ringClock = 0;
          rings.push(m === 'listening'
            ? { r: RING_FAR, a: 0.15 + gate * 0.55, dir: -1 }
            : { r: r, a: 0.15 + gate * 0.55, dir: 1 });
        }
      }
      ctx.lineWidth = DPR * 1;
      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        g.r += g.dir * DPR * 1.15;
        g.a *= 0.965;
        const done = g.dir < 0 ? g.r <= r : g.r >= RING_FAR;
        if (g.a < 0.01 || done) { rings.splice(i, 1); continue; }
        const rc = ramp(stops, t * 0.06 + (g.dir < 0 ? 0.3 : 0));
        ctx.strokeStyle = `rgba(${rc[0] | 0},${rc[1] | 0},${rc[2] | 0},${g.a})`;
        ctx.beginPath();
        ctx.arc(C, C, g.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Inside the sphere: atmosphere, then the drifting aurora strokes.
      if (paintInner) {
        ictx.globalCompositeOperation = 'source-over';
        ictx.fillStyle = light ? 'rgba(238,241,244,0.16)' : 'rgba(6,10,16,0.13)';
        // In the frozen version, the last frames skip the fade so the strokes
        // settle into trails instead of specks.
        if (!still || warmup < 50) ictx.fillRect(0, 0, S, S);

        const ax = C + Math.cos(t * 0.7) * R * 0.35;
        const ay = C + Math.sin(t * 0.9) * R * 0.3;
        ictx.globalCompositeOperation = light ? 'source-over' : 'lighter';
        const bc = ramp(stops, t * 0.06 + 0.5);
        const bg = ictx.createRadialGradient(ax, ay, 0, ax, ay, R * 1.1);
        bg.addColorStop(0, `rgba(${bc[0] | 0},${bc[1] | 0},${bc[2] | 0},${light ? 0.05 : 0.09 + level * 0.06})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ictx.fillStyle = bg;
        ictx.fillRect(0, 0, S, S);

        {
          const drift = (m === 'speaking' ? 1.6 : m === 'thinking' ? 1.3 : 0.7) + level * 1.2;
          ictx.lineWidth = DPR * (light ? 2 : 1.1);
          const hShift = t * 0.1;
          for (const p of parts) {
            const ang = (Math.sin(p.x * 0.012 + t * 0.6) + Math.cos(p.y * 0.012 - t * 0.4)) * Math.PI;
            let vx = Math.cos(ang) * p.sp * DPR * drift;
            let vy = Math.sin(ang) * p.sp * DPR * drift;
            const adx = ax - p.x;
            const ady = ay - p.y;
            const ad = Math.hypot(adx, ady) || 1;
            vx += (adx / ad) * 0.18 * DPR * drift;
            vy += (ady / ad) * 0.18 * DPR * drift;
            const ox = p.x;
            const oy = p.y;
            p.x += vx;
            p.y += vy;
            if (Math.hypot(p.x - C, p.y - C) > R) {
              const np = spawn();
              p.x = np.x;
              p.y = np.y;
              continue;
            }
            const c = ramp(stops, p.hue + hShift);
            ictx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${light ? 0.45 : 0.5})`;
            ictx.beginPath();
            ictx.moveTo(ox, oy);
            ictx.lineTo(p.x, p.y);
            ictx.stroke();
          }
        }
      }

      // Composite the sphere: clip to the circle, scaled by the breath.
      ctx.save();
      ctx.beginPath();
      ctx.arc(C, C, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(C, C);
      ctx.scale(scale, scale);
      ctx.drawImage(inner, -C, -C);

      // Bright mass low in the sphere, like the reference: a lit cloud bank.
      // Drawn here, not on the trail canvas, so it doesn't accumulate to white.
      const cy = R * 0.6 + Math.sin(t * 1.7) * R * 0.05;
      const cloud = ctx.createRadialGradient(0, cy, 0, 0, cy, R * 1.0);
      cloud.addColorStop(0, light ? 'rgba(255,255,255,0.7)' : `rgba(225,238,250,${0.42 + level * 0.2})`);
      cloud.addColorStop(0.55, light ? 'rgba(255,255,255,0.25)' : `rgba(200,222,245,${0.14 + level * 0.08})`);
      cloud.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = cloud;
      ctx.fillRect(-C, -C, S, S);
      ctx.restore();

      // Rim: a thin edge so the sphere reads as an object, not a hole.
      const rim = ctx.createRadialGradient(C, C, r * 0.86, C, C, r);
      rim.addColorStop(0, 'rgba(0,0,0,0)');
      rim.addColorStop(1, light ? 'rgba(29,78,126,0.22)' : 'rgba(141,192,235,0.30)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(C, C, r, 0, Math.PI * 2);
      ctx.fill();

      if (m === 'paused' || m === 'error') {
        ctx.fillStyle = light ? 'rgba(238,241,244,0.45)' : 'rgba(6,10,16,0.45)';
        ctx.beginPath();
        ctx.arc(C, C, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(frame);
    };

    frame();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [size]);

  return <canvas ref={ref} className="aurora-voice-orb" aria-hidden="true" />;
};

export default VoiceOrb;
