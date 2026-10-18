import { useEffect, useRef } from 'react';

// The one thing in each painting that moves. A 2D canvas over the picture,
// under the scrim; a few hundred particles at most, so it costs nothing.
//   rain      → streaks falling fast with a slight slant, brief splashes on the ground band
//   snow      → slow flakes with sway, larger ones nearer
//   embers    → warm motes drifting up and sideways (capital at dusk / after dark)
//   glints    → sun sparkles winking on the water band (ocean)
//   fireflies → slow green-gold points blinking low over the grass (plains)
export const WEATHER_OF = {
  capital: 'embers',
  'capital-night': 'embers',
  ocean: 'glints',
  cyber: 'rain',
  snow: 'snow',
  bay: 'embers',
};

const rnd = Math.random;

const SETUP = {
  rain: (w, h) => Array.from({ length: Math.round(w / 3.2) }, () => ({ x: rnd() * w * 1.2 - w * 0.1, y: rnd() * h, l: 14 + rnd() * 22, v: 900 + rnd() * 500, a: 0.18 + rnd() * 0.3, z: rnd() })),
  snow: (w, h) => Array.from({ length: Math.round(w / 2.2) }, () => ({ x: rnd() * w, y: rnd() * h, r: 0.7 + rnd() * 2.6, v: 60 + rnd() * 120, s: rnd() * 6.28, a: 0.3 + rnd() * 0.55 })),
  embers: (w, h) => Array.from({ length: Math.round(w / 12) }, () => ({ x: rnd() * w, y: h * 0.3 + rnd() * h * 0.7, r: 0.7 + rnd() * 1.6, v: 6 + rnd() * 14, s: rnd() * 6.28, p: rnd() * 6.28, a: 0.3 + rnd() * 0.6 })),
  glints: (w, h) => Array.from({ length: Math.round(w / 9) }, () => ({ x: w * 0.3 + rnd() * w * 0.7, y: h * 0.48 + rnd() * h * 0.3, p: rnd() * 6.28, f: 0.6 + rnd() * 1.8, r: 0.6 + rnd() * 1.2 })),
  fireflies: (w, h) => Array.from({ length: Math.round(w / 20) }, () => ({ x: rnd() * w, y: h * 0.5 + rnd() * h * 0.48, p: rnd() * 6.28, f: 0.25 + rnd() * 0.6, s: rnd() * 6.28, r: 1 + rnd() * 1.4 })),
};

const DRAW = {
  rain(ctx, ps, w, h, dt, t) {
    ctx.strokeStyle = 'rgba(215,225,255,1)'; ctx.lineWidth = 1; ctx.lineCap = 'round';
    const slant = 0.16;
    for (const p of ps) {
      p.y += p.v * dt * (0.6 + p.z * 0.6); p.x += p.v * dt * slant * 0.5;
      if (p.y > h) { p.y = -p.l; p.x = rnd() * w * 1.2 - w * 0.1; }
      ctx.globalAlpha = p.a * (0.5 + p.z * 0.5);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.l * slant, p.y - p.l); ctx.stroke();
    }
    // splashes low in the frame
    ctx.globalAlpha = 0.22; ctx.strokeStyle = 'rgba(225,235,255,1)';
    for (let i = 0; i < 14; i++) {
      const k = ((t * 9 + i * 1.37) % 1), x = ((i * 977 + Math.floor(t * 9 + i * 1.37) * 131) % 1000) / 1000 * w, y = h * (0.82 + ((i * 37) % 17) / 100);
      ctx.beginPath(); ctx.arc(x, y, 1 + k * 7, 0, 6.283); ctx.globalAlpha = 0.22 * (1 - k); ctx.stroke();
    }
  },
  snow(ctx, ps, w, h, dt, t) {
    ctx.fillStyle = 'rgba(255,255,255,1)';
    // a blizzard: wind from the left in gusts, flakes streak with their speed
    const gust = 70 + 60 * Math.sin(t * 0.23) + 30 * Math.sin(t * 0.71);
    for (const p of ps) {
      const vy = p.v * (0.6 + p.r * 0.25), vx = gust * (0.5 + p.r * 0.3) + Math.sin(t * 0.9 + p.s) * 18;
      p.y += vy * dt; p.x += vx * dt;
      if (p.y > h + 4) { p.y = -4; p.x = rnd() * w; }
      if (p.x > w + 4) p.x = -4;
      ctx.globalAlpha = p.a;
      if (p.r > 1.8) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
      else { ctx.strokeStyle = 'rgba(255,255,255,1)'; ctx.lineWidth = p.r; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - vx * 0.03, p.y - vy * 0.03); ctx.stroke(); }
    }
  },
  embers(ctx, ps, w, h, dt, t) {
    for (const p of ps) {
      p.y -= p.v * dt; p.x += Math.sin(t * 0.5 + p.s) * 9 * dt;
      if (p.y < -4) { p.y = h + 4; p.x = rnd() * w; }
      const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + p.p);
      ctx.globalAlpha = p.a * tw;
      ctx.fillStyle = 'rgba(255,205,140,1)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
  },
  glints(ctx, ps, w, h, dt, t) {
    ctx.fillStyle = 'rgba(255,240,210,1)';
    for (const p of ps) {
      const k = Math.max(0, Math.sin(t * p.f + p.p));
      if (k < 0.55) continue;
      ctx.globalAlpha = (k - 0.55) * 1.8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.6 + k), 0, 6.283); ctx.fill();
    }
  },
  fireflies(ctx, ps, w, h, dt, t) {
    ctx.fillStyle = 'rgba(214,255,150,1)';
    for (const p of ps) {
      p.x += Math.sin(t * 0.3 + p.s) * 7 * dt; p.y += Math.cos(t * 0.37 + p.s) * 5 * dt;
      const k = Math.max(0, Math.sin(t * p.f + p.p));
      if (k < 0.3) continue;
      ctx.globalAlpha = (k - 0.3) * 1.1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
  },
};

export default function Weather({ kind }) {
  const ref = useRef(null);
  useEffect(() => {
    const draw = DRAW[kind];
    const canvas = ref.current;
    if (!draw || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, ps = [], raf = 0, last = performance.now(), t = 0;
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ps = SETUP[kind](w, h);
    };
    resize();
    window.addEventListener('resize', resize);
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      draw(ctx, ps, w, h, dt, t);
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);
    const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else { last = performance.now(); raf = requestAnimationFrame(frame); } };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', vis); };
  }, [kind]);
  if (!DRAW[kind]) return null;
  return <canvas ref={ref} className="isl-weather" data-kind={kind} aria-hidden="true" />;
}
