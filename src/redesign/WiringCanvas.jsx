import { useEffect, useRef } from 'react';

// Circuit traces that grow out of the point where the sun meets the horizon and
// spread across the ground plane. Drawn foreshortened (squashed in y) so they read
// as a city of light seen from above the horizon, then carry slow pulses forever.
const SPEED = 480; // ground-units per second
const DIRS = Array.from({ length: 8 }, (_, i) => [Math.cos((i * Math.PI) / 4), Math.sin((i * Math.PI) / 4)]);
// 0 right · 1 down-right · 2 down · 3 down-left · 4 left (5–7 point up into the sky: never used)

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ground = (d, rng) => (d === 5 ? 4 : d === 7 ? 0 : d === 6 ? (rng() < 0.5 ? 0 : 4) : d);

function buildNetwork(w, gh, ox, startDelay) {
  const rng = mulberry(11);
  const traces = [];
  const limitX = w + 80, limitY = gh + 80;

  const walk = (x, y, d, start, depth, maxLen) => {
    const pts = [{ x, y }], cum = [0];
    let len = 0;
    const trace = { pts, cum, start, len: 0, depth };
    traces.push(trace);
    let guard = 0;
    while (len < maxLen && guard++ < 40) {
      const dot = DIRS[d][0] * (x - ox) + DIRS[d][1] * y;
      const r = rng();
      if (dot < 0) d = (d + (rng() < 0.5 ? 1 : 7)) % 8;
      else if (r < 0.3) d = (d + (rng() < 0.5 ? 1 : 7)) % 8;
      else if (r < 0.37) d = (d + (rng() < 0.5 ? 2 : 6)) % 8;
      d = ground(d, rng);
      if (y < 90 && (d === 0 || d === 4)) d = d === 0 ? 1 : 3; // leave the horizon before running along it
      const seg = 40 + rng() * 170;
      x += DIRS[d][0] * seg; y += DIRS[d][1] * seg;
      len += seg;
      pts.push({ x, y }); cum.push(len);
      if (y > limitY || x < -80 || x > limitX) break;
      if (traces.length < 210 && depth < 3 && rng() < 0.27) {
        const bd = ground((d + (rng() < 0.5 ? 1 : 7)) % 8, rng);
        walk(x, y, bd, start + len / SPEED, depth + 1, 140 + rng() * 480);
      }
      if (depth > 0 && rng() < 0.08) break;
    }
    trace.len = len;
  };

  const trunks = 26;
  for (let i = 0; i < trunks; i++) {
    const u = (i + 0.5) / trunks;                       // 0..1 across the lit stretch of horizon
    const sx = ox + (u - 0.5) * w * 0.34 + (rng() - 0.5) * 30; // spread either side of the sun
    const ang = 0.08 * Math.PI + u * 0.84 * Math.PI + (rng() - 0.5) * 0.3; // lower half-plane only
    const d = ground(Math.round(ang / (Math.PI / 4)) % 8, rng);
    walk(sx, 2 + rng() * 10, d === 2 && rng() < 0.6 ? (rng() < 0.5 ? 1 : 3) : d === 0 ? 1 : d === 4 ? 3 : d, startDelay + Math.abs(u - 0.5) * 0.5 + rng() * 0.08, 0, 650 + rng() * 950);
  }
  return traces;
}

function pointAt(trace, L) {
  const { pts, cum } = trace;
  for (let i = 1; i < cum.length; i++) {
    if (L <= cum[i]) {
      const f = (L - cum[i - 1]) / (cum[i] - cum[i - 1]);
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f, i };
    }
  }
  const p = pts[pts.length - 1];
  return { x: p.x, y: p.y, i: pts.length - 1 };
}

export default function WiringCanvas({ startDelay = 0.4, still = false, originX = 0.68, squash = 0.58, rgb = '255,150,92', className = '' }) {
  const ref = useRef(null);
  const api = useRef({});
  const stillRef = useRef(still);

  useEffect(() => {
    stillRef.current = still;
    api.current.start?.();
  }, [still]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, gh = 0, traces = [], pulses = [], raf = 0, cache = null, doneAt = 0;
    const t0 = performance.now();
    window.__wiringStart = t0;

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight; gh = h / squash;
      canvas.width = w * dpr; canvas.height = h * dpr;
      traces = buildNetwork(w, gh, w * originX, startDelay);
      doneAt = Math.max(...traces.map(tr => tr.start + tr.len / SPEED)) + 0.2;
      pulses = []; cache = null;
    };
    resize();
    window.addEventListener('resize', resize);
    const view = c => c.setTransform(dpr, 0, 0, dpr * squash, 0, 0);

    const drawBase = (c, t, heads) => {
      c.beginPath();
      for (const tr of traces) {
        const head = Math.min(Math.max((t - tr.start) * SPEED, 0), tr.len);
        if (head <= 0) continue;
        c.moveTo(tr.pts[0].x, tr.pts[0].y);
        for (let i = 1; i < tr.pts.length && tr.cum[i - 1] < head; i++) {
          if (tr.cum[i] <= head) c.lineTo(tr.pts[i].x, tr.pts[i].y);
          else { const p = pointAt(tr, head); c.lineTo(p.x, p.y); }
        }
        if (head < tr.len) heads?.push(pointAt(tr, head));
        else { const e = tr.pts[tr.pts.length - 1]; c.moveTo(e.x + 3, e.y); c.arc(e.x, e.y, 3, 0, 6.283); }
      }
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.strokeStyle = `rgba(${rgb},0.10)`; c.lineWidth = 5; c.stroke();
      c.strokeStyle = `rgba(${rgb},0.52)`; c.lineWidth = 1.2; c.stroke();
    };

    const buildCache = () => {
      cache = document.createElement('canvas');
      cache.width = w * dpr; cache.height = h * dpr;
      const c = cache.getContext('2d'); view(c);
      c.globalCompositeOperation = 'lighter';
      drawBase(c, 1e9);
    };

    const rng = mulberry(99);
    const spawnPulse = (t) => {
      const ready = traces.filter(tr => t - tr.start > tr.len / SPEED + 0.1);
      if (!ready.length) return null;
      const trace = ready[Math.floor(rng() * ready.length)];
      return { trace, pos: 0, speed: 150 + rng() * 220, trail: 70 + rng() * 90 };
    };

    const frame = () => {
      raf = 0;
      const t = (performance.now() - t0) / 1000;
      if (stillRef.current && !cache) buildCache();
      if (!cache && t > doneAt) buildCache();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      view(ctx);

      const heads = [];
      if (cache) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(cache, 0, 0); view(ctx); }
      else drawBase(ctx, t, heads);

      for (const p of heads) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
        g.addColorStop(0, 'rgba(255,240,215,0.9)');
        g.addColorStop(0.3, `rgba(${rgb},0.45)`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(p.x - 14, p.y - 14, 28, 28);
      }

      if (stillRef.current && cache) return; // frozen: one draw, then zero cost

      const want = t > startDelay + 1.4 ? 16 : 0;
      while (pulses.length < want) { const p = spawnPulse(t); if (!p) break; pulses.push(p); }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.pos += p.speed / 60;
        if (p.pos > p.trace.len + p.trail) { const n = spawnPulse(t); if (n) pulses[k] = n; else pulses.splice(k, 1); continue; }
        const tail = Math.max(0, p.pos - p.trail), headL = Math.min(p.pos, p.trace.len);
        if (headL <= tail) continue;
        const a = pointAt(p.trace, tail), b = pointAt(p.trace, headL);
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(${rgb},0)`);
        grad.addColorStop(1, 'rgba(255,232,205,0.9)');
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        for (let i = a.i; i <= b.i; i++) if (p.trace.cum[i] > tail && p.trace.cum[i] < headL) ctx.lineTo(p.trace.pts[i].x, p.trace.pts[i].y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke();
        if (p.pos <= p.trace.len) { ctx.fillStyle = 'rgba(255,244,225,0.95)'; ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, 6.283); ctx.fill(); }
      }
      raf = requestAnimationFrame(frame);
    };
    api.current.start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    api.current.start();
    return () => { cancelAnimationFrame(raf); raf = 0; api.current.start = null; window.removeEventListener('resize', resize); };
  }, [startDelay, originX, squash, rgb]);

  return <canvas ref={ref} className={`absolute inset-0 w-full h-full ${className}`} />;
}
