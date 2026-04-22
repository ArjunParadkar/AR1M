import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARTNERS = [
  { src: '/assets/images/UofA.webp', alt: 'University of Arkansas' },
];

const PartnersStrip = () => {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
  }, []);

  return (
    <section ref={ref} className="bg-black py-14 px-6 border-t border-white/5" style={{ opacity: 0 }}>
      <p className="text-center mb-8" style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '0.65rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
      }}>
        Partners &amp; Collaborators
      </p>
      <div className="flex flex-wrap items-center justify-center gap-12">
        {PARTNERS.map(p => (
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            className="max-h-20 max-w-[160px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
        ))}
      </div>
    </section>
  );
};

export default PartnersStrip;
