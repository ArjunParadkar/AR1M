import { useEffect, useRef, useState } from 'react';
import { LOGO_PATHS } from '../components/ArendaLogoMark';

// The painted sky: kasumi cloud bands, layered hills, a sun with a bleeding
// watercolor edge, and (on the hub) the Arenda mark glowing between the clouds.
// Everything is one SVG sized to the sky, with the horizon at its bottom edge.
const H = 640;

function ridge(W, base, a1, f1, p1, a2, f2, p2) {
  const pts = [];
  for (let x = -40; x <= W + 40; x += 36) {
    const y = base - a1 * (0.5 + 0.5 * Math.sin(x * f1 + p1)) - a2 * (0.5 + 0.5 * Math.sin(x * f2 + p2));
    pts.push(`${x.toFixed(0)},${y.toFixed(1)}`);
  }
  return `M-40,${H + 40} L${pts.join(' L')} L${W + 40},${H + 40} Z`;
}

const Kasumi = ({ x, y, w, fill, filter = 'url(#wc)', className = '' }) => (
  <g className={className} filter={filter} fill={fill}>
    <rect x={x} y={y} width={w} height={26} rx={13} />
    <rect x={x + w * 0.16} y={y - 17} width={w * 0.56} height={22} rx={11} />
    <rect x={x + w * 0.42} y={y + 19} width={w * 0.5} height={22} rx={11} />
    <rect x={x - w * 0.08} y={y + 12} width={w * 0.3} height={18} rx={9} />
  </g>
);

export default function SkyArt({ phase = 'dusk', showMark = false }) {
  const ref = useRef(null);
  const [W, setW] = useState(1440);
  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => { const { width, height } = e.contentRect; if (height > 0) setW(Math.round((width / height) * H)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const narrow = W < 900;
  const sx = W * (narrow ? 0.74 : 0.68);
  const u = Math.min(1, Math.max(0.6, W / 1300));
  const mk = 260 * u;
  const my = 128 - (narrow ? 20 : 0);

  return (
    <svg ref={ref} className="sa" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="wc" x="-15%" y="-60%" width="130%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.02" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.4" />
        </filter>
        <filter id="wc-mist" x="-10%" y="-200%" width="120%" height="500%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="7" />
        </filter>
        <filter id="wc-hill" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sun-edge" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.6" />
        </filter>
        <filter id="mark-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="mark-glow-wide" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="46" /></filter>
        <radialGradient id="sun-fill" cx="50%" cy="42%" r="55%">
          <stop offset="0" stopColor="#fff6e4" /><stop offset=".45" stopColor="#ffd79b" /><stop offset=".85" stopColor="#ff9a62" /><stop offset="1" stopColor="#f26d4e" />
        </radialGradient>
        <radialGradient id="sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb074" stopOpacity=".42" /><stop offset=".5" stopColor="#ff8a5e" stopOpacity=".12" /><stop offset="1" stopColor="#ff7a5e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cloud-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe3d2" stopOpacity=".78" /><stop offset="1" stopColor="#e89aa0" stopOpacity=".5" /></linearGradient>
        <linearGradient id="cloud-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6c9c4" stopOpacity=".6" /><stop offset="1" stopColor="#b5667f" stopOpacity=".42" /></linearGradient>
        <linearGradient id="cloud-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd9b8" stopOpacity=".8" /><stop offset="1" stopColor="#f08a74" stopOpacity=".5" /></linearGradient>
        <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a4a6a" stopOpacity=".55" /><stop offset="1" stopColor="#5b2c4e" stopOpacity=".9" /></linearGradient>
        <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a2146" /><stop offset="1" stopColor="#2a1232" /></linearGradient>
        <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24102a" /><stop offset="1" stopColor="#140a1a" /></linearGradient>
      </defs>

      {/* far mist on the horizon */}
      <g className="sa-clouds">
        <rect x={-40} y={H - 150} width={W + 80} height={60} fill="#ffb790" opacity=".22" filter="url(#wc-mist)" />
      </g>

      {/* back clouds */}
      <g className="sa-clouds">
        <Kasumi className="sa-drift sa-d1" x={sx - 440 * u} y={my + 110 * u} w={520 * u} fill="url(#cloud-b)" />
        <Kasumi className="sa-drift sa-d2" x={sx + 70 * u} y={my + 190 * u} w={380 * u} fill="url(#cloud-a)" />
        {!narrow && <Kasumi className="sa-drift sa-d3" x={sx + 250 * u} y={my - 8 * u} w={300 * u} fill="url(#cloud-b)" />}
      </g>

      {/* the mark, glowing between the clouds (hub only) */}
      {showMark && (
        <g className="sa-mark" transform={`translate(${sx - mk / 2}, ${my}) scale(${mk / 300})`}>
          <g transform="translate(0,300) scale(0.1,-0.1)" fill="#ff9a62" filter="url(#mark-glow-wide)" className="sa-mark-aura">{LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
          <g transform="translate(0,300) scale(0.1,-0.1)" fill="#ffb982" filter="url(#mark-glow)" className="sa-mark-glow">{LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
          <g transform="translate(0,300) scale(0.1,-0.1)" fill="#fff1dc">{LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
        </g>
      )}

      {/* front clouds, crossing the mark */}
      <g className="sa-clouds">
        <Kasumi className="sa-drift sa-d4" x={sx - 300 * u} y={my + 232 * u} w={470 * u} fill="url(#cloud-c)" />
        <Kasumi className="sa-drift sa-d5" x={sx - 90 * u} y={my + 150 * u} w={230 * u} fill="url(#cloud-a)" />
      </g>

      {/* hills + sun, back to front */}
      <path d={ridge(W, H - 30, 26, 0.0042, 1.2, 14, 0.011, 4.0)} fill="url(#hill-far)" filter="url(#wc-hill)" />
      <g className="sa-sun">
        <circle cx={sx} cy={H - 34} r={300} fill="url(#sun-halo)" />
        <circle cx={sx} cy={H - 34} r={98} fill="none" stroke="#ffd6b0" strokeOpacity=".28" strokeWidth="1.2" />
        <circle cx={sx} cy={H - 34} r={128} fill="none" stroke="#ffc9a8" strokeOpacity=".12" strokeWidth="1" />
        <circle cx={sx} cy={H - 34} r={72} fill="url(#sun-fill)" filter="url(#sun-edge)" />
      </g>
      <path d={ridge(W, H - 16, 18, 0.0061, 3.1, 9, 0.016, 0.7)} fill="url(#hill-mid)" filter="url(#wc-hill)" />
      <g className="sa-clouds"><rect x={-40} y={H - 36} width={W + 80} height={26} fill="#f5a88c" opacity=".16" filter="url(#wc-mist)" /></g>
      <path d={ridge(W, H - 4, 10, 0.0085, 0.4, 6, 0.021, 2.2)} fill="url(#hill-near)" filter="url(#wc-hill)" />
    </svg>
  );
}
