import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import ArendaLogoMark from '../components/ArendaLogoMark';

const TAGLINE = 'Build the future';
const EMBER = '#ff8a5b';
const IVORY = '#f5ecdf';

// Intro: an ember traces the mark, it fills warm, cools to ivory, the name rises
// under it, and the whole thing hands over to the hub as the sun comes up there.
// Click or any key skips. `/?loop` replays forever (for a screen at an expo).
const Landing = () => {
  const logoRef = useRef(null);
  const wrapRef = useRef(null);
  const titleRef = useRef(null);
  const tagRef = useRef(null);
  const nav = useNavigate();
  const { search } = useLocation();
  const loop = search.includes('loop');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !loop) { nav('/hub', { replace: true }); return undefined; }
    const q = sel => logoRef.current.querySelectorAll(sel);
    const chars = tagRef.current.children;

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(q('.logo-tail'), { attr: { 'stroke-dashoffset': -1 }, duration: 1.7, ease: 'power1.inOut', stagger: 0.04 }, 0)
      .to(q('.logo-spark'), { attr: { 'stroke-dashoffset': -1.148 }, duration: 1.7, ease: 'power1.inOut', stagger: 0.04 }, 0)
      .to(q('.logo-fill'), { attr: { 'fill-opacity': 1 }, duration: 0.8, ease: 'power2.out', stagger: 0.03 }, 1.3)
      .to(logoRef.current, { filter: 'drop-shadow(0 0 26px rgba(255,120,70,0.55))', duration: 1 }, 1.5)
      .set(q('.logo-tail, .logo-spark'), { opacity: 0 }, 2.7)
      .to(q('.logo-fill'), { attr: { fill: IVORY }, duration: 1.2, ease: 'power1.inOut' }, 2.9)
      .to(logoRef.current, { filter: 'drop-shadow(0 0 18px rgba(255,200,150,0.35))', duration: 1.2 }, 2.9)
      .fromTo(titleRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 3.5)
      .fromTo(chars, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power2.out' }, 3.95)
      .to(wrapRef.current, { opacity: 0, duration: 1.0, ease: 'power2.inOut', onComplete: () => { if (loop) gsap.delayedCall(0.6, () => tl.restart()); else nav('/hub'); } }, '+=1.5');

    const skip = () => { if (loop) return; tl.kill(); gsap.to(wrapRef.current, { opacity: 0, duration: 0.4, onComplete: () => nav('/hub') }); };
    window.addEventListener('keydown', skip);
    wrapRef.current.addEventListener('click', skip);
    const el = wrapRef.current;
    return () => { tl.kill(); window.removeEventListener('keydown', skip); el?.removeEventListener('click', skip); };
  }, [nav, loop]);

  return (
    <div ref={wrapRef} className="intro" role="button" tabIndex={0} aria-label="Skip intro">
      <ArendaLogoMark ref={logoRef} fill={EMBER} tail={EMBER} spark="#fff1d2" outline="rgba(255,200,160,0.12)" className="w-[min(30vmin,340px)] h-auto" />
      <div className="px-5">
        <h1 ref={titleRef} className="intro-title">Arenda Innovations</h1>
        <div ref={tagRef} className="intro-tag" aria-label={TAGLINE}>
          {TAGLINE.split('').map((c, i) => <span key={i} style={{ opacity: 0, whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>)}
        </div>
      </div>
      <span className="intro-hint">{loop ? 'Looping' : 'Click to skip'}</span>
    </div>
  );
};

export default Landing;
