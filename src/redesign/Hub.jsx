import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { CATEGORIES } from './data';
import HoverPreview from './HoverPreview';
import ArendaLogoMark from '../components/ArendaLogoMark';

// What sits under each shoreline label: the names when there are few, a count when many.
const meta = c => (c.items.length <= 3 ? c.items.map(i => i.title).join(' · ') : `${c.items.length} ${c.kicker.toLowerCase()}`);

const Hub = () => {
  const root = useRef(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const fresh = !window.__islandSeen;           // first arrival from the intro gets the slow reveal
    window.__islandSeen = true;
    const wait = fresh ? 0.9 : 0.1;
    const ctx = gsap.context(() => {
      gsap.from('.thesis > *', { opacity: 0, y: 26, duration: 1.2, stagger: 0.14, delay: wait, ease: 'power3.out' });
      gsap.from('.shore-item', { opacity: 0, y: 16, duration: 1, stagger: 0.12, delay: wait + 0.55, ease: 'power3.out' });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="absolute inset-0">
      <section className="thesis">
        <p className="thesis-kicker">A research and product studio</p>
        <h1>Build the <em>future.</em></h1>
        <p>Arenda Innovations is a young research and product studio out of Arkansas. We start companies, publish papers and build machines, working from first principles and keeping every result on the record.</p>
        <div className="thesis-foot"><span className="seal" aria-hidden="true"><ArendaLogoMark filled fill="#f5ecdf" outline="transparent" /></span><span>Bentonville · Fayetteville</span></div>
      </section>

      <nav className="shore" aria-label="Work">
        {Object.entries(CATEGORIES).map(([key, c], i) => (
          <div key={key} className="shore-slot" onMouseEnter={() => c.preview && setHover(key)} onMouseLeave={() => setHover(null)}>
            {hover === key && <HoverPreview category={c} />}
            <Link to={`/explore/${key}`} className="shore-item">
              <span className="shore-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="shore-label">{c.label}</span>
              <span className="shore-meta">{meta(c)}</span>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Hub;
