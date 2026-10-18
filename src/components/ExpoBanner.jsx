import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Midpoint-displacement lightning on canvas ──────────────────────────────
function bolt(ctx, x1, y1, x2, y2, depth, alpha) {
  if (depth === 0) {
    // Core bright line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(180, 230, 255, ${alpha})`;
    ctx.stroke();
    // Wide glow
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = `rgba(80, 180, 255, ${alpha * 0.18})`;
    ctx.stroke();
    return;
  }

  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 40 * depth;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 40 * depth;

  bolt(ctx, x1, y1, mx, my, depth - 1, alpha);
  bolt(ctx, mx, my, x2, y2, depth - 1, alpha);

  // Random branch
  if (Math.random() > 0.55 && depth >= 2) {
    const bx = mx + (Math.random() - 0.5) * 120;
    const by = my + (Math.random() - 0.5) * 120;
    bolt(ctx, mx, my, bx, by, depth - 2, alpha * 0.45);
  }
}

const ExpoBanner = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let bolts = [];
    let raf;

    const spawnBolt = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.5;
      // Radiate from the center-ish text area outward in all directions
      const angle = Math.random() * Math.PI * 2;
      const startR = 80 + Math.random() * 100;   // start near the text
      const endR   = 180 + Math.random() * 260;  // reach far out
      bolts.push({
        x1: cx + Math.cos(angle) * startR,
        y1: cy + Math.sin(angle) * startR * 0.45,
        x2: cx + Math.cos(angle) * endR,
        y2: cy + Math.sin(angle) * endR  * 0.45,
        life: 2 + Math.floor(Math.random() * 4),
        alpha: 0.7 + Math.random() * 0.3,
        depth: 3 + Math.floor(Math.random() * 2),
      });
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.22) spawnBolt();
      if (Math.random() < 0.10) spawnBolt(); // occasional double-strike

      bolts = bolts.filter(b => {
        const a = b.alpha * (b.life / 6);
        bolt(ctx, b.x1, b.y1, b.x2, b.y2, b.depth, a);
        b.life--;
        return b.life > 0;
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="expo-banner-section">
      {/* Background gradient */}
      <div className="expo-banner-bg" />

      {/* Lightning canvas */}
      <canvas ref={canvasRef} className="expo-banner-canvas" />

      {/* Content */}
      <div className="expo-banner-content">
        <p className="expo-banner-eyebrow">Arenda Innovations Presents</p>

        <h1 className="expo-banner-title">
          ARENDA<br />EXPO
        </h1>

        <p className="expo-banner-quote">"the coolest thing that ever happened to Northwest Arkansas"</p>
        <p className="expo-banner-quote-attr">— Someone, June 2026</p>

        <p className="expo-banner-date">June 27th, 2026</p>

        <Link to="/expo">
          <button className="expo-banner-btn">
            Learn More
          </button>
        </Link>
      </div>

      {/* Bottom fade into hero */}
      <div className="expo-banner-fade" />
    </section>
  );
};

export default ExpoBanner;
