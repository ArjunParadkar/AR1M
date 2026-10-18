import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { CATEGORIES } from './data';
import { createChamber, present } from './chamberEngine';

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'left' ? <path d="M10 3 5 8l5 5" /> : <path d="m6 3 5 5-5 5" />}
  </svg>
);

// One category at a time. The first item takes shape as soon as you arrive; arrows,
// the rail on the right, or ← → move between them.
const Chamber = () => {
  const { cat } = useParams();
  const category = CATEGORIES[cat];
  const host = useRef(null);
  const engine = useRef(null);
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const token = useRef(0);

  const select = useCallback(async (i) => {
    if (!category || !engine.current) return;
    const n = category.items.length;
    const next = ((i % n) + n) % n;
    const mine = ++token.current;
    setIdx(next); setBusy(true);
    try {
      await present(engine.current, category.items[next], () => mine !== token.current);
    } catch (e) {
      console.error('chamber item failed', e);
    } finally { if (mine === token.current) setBusy(false); }
  }, [category]);

  useEffect(() => {
    if (!category) return undefined;
    engine.current = createChamber(host.current);
    setIdx(0);
    const t = setTimeout(() => select(0), 350);
    return () => { clearTimeout(t); token.current++; engine.current?.dispose(); engine.current = null; };
  }, [cat, category, select]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') select(idx + 1);
      if (e.key === 'ArrowLeft') select(idx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, select]);

  if (!category) return <Navigate to="/hub" replace />;
  const item = category.items[idx];
  const n = category.items.length;

  return (
    <div className="absolute inset-0">
      <div ref={host} className="ch-host" />

      <nav className="ch-tabs" aria-label="Categories">
        {Object.entries(CATEGORIES).map(([k, c]) => (
          <NavLink key={k} to={`/explore/${k}`}>{c.label}</NavLink>
        ))}
      </nav>

      {n > 1 && (
        <>
          <button type="button" aria-label="Previous" onClick={() => select(idx - 1)} className="ch-arrow" style={{ left: 'var(--gutter)' }}><Arrow dir="left" /></button>
          <button type="button" aria-label="Next" onClick={() => select(idx + 1)} className="ch-arrow" style={{ right: 'var(--gutter)' }}><Arrow dir="right" /></button>
        </>
      )}

      {n > 1 && (
        <div className="ch-rail" role="list" aria-label={`${category.label} list`}>
          {category.items.map((it, i) => (
            <button key={it.id} type="button" onClick={() => select(i)} aria-current={i === idx ? 'true' : undefined}>{it.title}</button>
          ))}
        </div>
      )}

      <div className="ch-caption" aria-live="polite">
        <span className="ch-kicker">{category.label}{n > 1 && <> · {idx + 1} of {n}</>}</span>
        <h2 className="ch-title">{item.title}</h2>
        <p className="ch-sub">{item.sub}</p>
        <p className="ch-blurb">{item.blurb}</p>
        {item.href && (
          <a href={item.href} target="_blank" rel="noreferrer" className="ch-link">
            {item.href.endsWith('.pdf') ? 'Read the paper' : 'Visit the site'} <span aria-hidden="true">↗</span>
          </a>
        )}
        {busy && <span className="ch-busy">Loading</span>}
      </div>
    </div>
  );
};

export default Chamber;
