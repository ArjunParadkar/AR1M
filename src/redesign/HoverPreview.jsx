import { useEffect, useRef, useState } from 'react';
import { createChamber, present } from './chamberEngine';

// A small pane in the sky above a hub label where the category's items take shape in turn.
const HoverPreview = ({ category }) => {
  const host = useRef(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const eng = createChamber(host.current, { count: 5000, zoom: 0.62, lookY: 0 });
    let i = 0, dead = false, timer;
    const show = async () => {
      const item = category.items[i % category.items.length];
      setName(item.title);
      try { await present(eng, item, () => dead); } catch (e) { console.error(e); }
      i += 1;
      timer = setTimeout(show, 3600);
    };
    timer = setTimeout(show, 250);
    return () => { dead = true; clearTimeout(timer); eng.dispose(); };
  }, [category]);

  return (
    <div className="hv" aria-hidden="true">
      <span className="hv-tag">{category.label}</span>
      <div ref={host} className="absolute inset-0" />
      <span className="hv-name">{name}</span>
    </div>
  );
};

export default HoverPreview;
