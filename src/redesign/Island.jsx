import { useEffect, useRef, useState } from 'react';
import Weather, { WEATHER_OF } from './Weather';

// Arenda, one place per page. Each scene is a painting in /assets/island
// (landscape 21:9 plus a tall 9:16 reframing for phones):
//   capital        the capital on its lake, at sunset          → /hub
//   ocean          the ocean city                               → /explore/companies
//   cyber          a rainy night street inside the capital      → /explore/research
//   snow           the mountain city                            → /explore/projects
//   bay            the first painting: the quiet bay at sunset   → /founder
//   capital-night  the capital after the sun has gone           → /contact
// Changing scene is a journey: the old painting slides off and falls back, the
// new one arrives from the right and settles, with a brief warm bloom between.
// `tone` only picks the legibility scrim (dusk / afterglow / golden).
export const SCENES = {
  capital: 'The capital, on the lake',
  ocean: 'The island network',
  cyber: 'The capital, street level, in the rain',
  snow: 'The mountain town, in the snow',
  bay: 'The bay, at sunset',
  'capital-night': 'The capital, after dark',
};
const TONES = ['dusk', 'afterglow', 'golden'];
const BASE = '/assets/island';
const V = '?v=10'; // bump when a painting is replaced under the same name
const TRAVEL_MS = 1800;

const Painting = ({ scene, state, priority }) => (
  <picture className="isl-pic" data-state={state}>
    <source media="(max-aspect-ratio: 4/5)" type="image/avif" srcSet={`${BASE}/${scene}-tall-1080.avif${V}`} />
    <source media="(max-aspect-ratio: 4/5)" type="image/webp" srcSet={`${BASE}/${scene}-tall-1080.webp${V}`} />
    <source type="image/avif" srcSet={`${BASE}/${scene}-1600.avif${V} 1600w, ${BASE}/${scene}-2560.avif${V} 2560w`} sizes="100vw" />
    <source type="image/webp" srcSet={`${BASE}/${scene}-1600.webp${V} 1600w, ${BASE}/${scene}-2560.webp${V} 2560w`} sizes="100vw" />
    <img src={`${BASE}/${scene}-1600.webp${V}`} alt="" decoding="async" fetchpriority={priority ? 'high' : 'low'} draggable="false" />
  </picture>
);

export default function Island({ scene = 'capital', tone = 'dusk' }) {
  const root = useRef(null);
  const [leaving, setLeaving] = useState(null);   // the scene on its way out, during a journey
  const [journeys, setJourneys] = useState(0);    // counts scene changes (0 = first arrival)
  const [warm, setWarm] = useState(false);        // other scenes may be fetched now
  const current = useRef(scene);

  useEffect(() => {
    if (current.current === scene) return undefined;
    const from = current.current; current.current = scene;
    setLeaving(from); setJourneys(n => n + 1);
    const t = setTimeout(() => setLeaving(null), TRAVEL_MS + 100);
    return () => clearTimeout(t);
  }, [scene]);

  useEffect(() => { const t = setTimeout(() => setWarm(true), 2500); return () => clearTimeout(t); }, []);

  // pointer parallax: -1..1 in --px/--py on the island root
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return undefined;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      el.style.setProperty('--px', cx.toFixed(4)); el.style.setProperty('--py', cy.toFixed(4));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1; ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); };
  }, []);

  const layer = (priority) => (
    <>
      {leaving && <Painting key={`${leaving}-out-${journeys}`} scene={leaving} state="out" />}
      <Painting key={`${scene}-${journeys}`} scene={scene} state={journeys ? 'in' : 'here'} priority={priority} />
    </>
  );

  return (
    <div ref={root} className="isl" data-scene={scene} data-tone={tone} aria-hidden="true">
      <div className="isl-lqip" style={{ backgroundImage: `url(${BASE}/${scene}-lqip.jpg${V})` }} />
      <div className="isl-bg">{layer(true)}</div>
      <div className="isl-fg">{layer(false)}</div>
      {/* the sea moves: the foreground copy of the ocean scene is masked to the water and run through a slowly breathing displacement */}
      <svg className="isl-defs" aria-hidden="true" focusable="false">
        <filter id="isl-waves" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.028" numOctaves="2" seed="4" result="n">
            <animate attributeName="baseFrequency" values="0.006 0.028;0.0075 0.034;0.006 0.028" dur="11s" repeatCount="indefinite" />
          </feTurbulence>
          <feOffset in="n" dx="0" dy="0" result="m">
            <animate attributeName="dy" values="0;40" dur="14s" repeatCount="indefinite" />
          </feOffset>
          <feDisplacementMap in="SourceGraphic" in2="m" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Weather key={`w-${scene}`} kind={WEATHER_OF[scene]} />
      {journeys > 0 && <div key={journeys} className="isl-bloom" />}
      {TONES.map(t => <div key={`s-${t}`} className="isl-scrim" data-phase={t} data-active={t === tone || undefined} />)}
      {warm && (
        <div className="isl-warm">
          {Object.keys(SCENES).filter(s => s !== scene && s !== leaving).map(s => <Painting key={s} scene={s} state="warm" />)}
        </div>
      )}
    </div>
  );
}
