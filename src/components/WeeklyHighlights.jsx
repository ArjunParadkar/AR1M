import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 'aegis',
    type: 'pdf',
    src: '/assets/highlights/WhitePaperAEGIS.pdf',
    caption: 'Students develop novel flood prediction and warning system, reviewed by GIS',
  },
  {
    id: 'myproject',
    type: 'video',
    src: '/assets/highlights/MyProject.mp4',
    playbackRate: 2.5,
    muted: true,
    caption: 'A donut — JK. New topological layer on FNOs to predict and control instabilities in fusion reactors',
  },
  {
    id: 'drone',
    type: 'video',
    src: '/assets/highlights/TheDroneVideo.mp4',
    playbackRate: 1,
    muted: false,
    caption: 'Yet another drone',
  },
  {
    id: 'predator',
    type: 'stl',
    src: '/assets/highlights/Predator.stl',
    caption: 'Custom designed plane — maiden flight April 25th',
  },
  {
    id: 'highlight4',
    type: 'video',
    src: '/assets/highlights/highlight4.mp4',
    playbackRate: 1,
    muted: true,
    caption: 'Now we can build like Tony Stark',
  },
];

// ── Three.js STL viewer ────────────────────────────────────────────────────
const PredatorViewer = ({ active }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const w = el.clientWidth || 760;
    const h = el.clientHeight || 427;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 250);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.3);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    let mesh;
    new STLLoader().load('/assets/highlights/Predator.stl', geo => {
      geo.computeVertexNormals();
      mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.5, roughness: 0.4 })
      );
      geo.computeBoundingBox();
      const center = new THREE.Vector3();
      geo.boundingBox.getCenter(center);
      mesh.position.sub(center);
      const size = new THREE.Vector3();
      geo.boundingBox.getSize(size);
      mesh.scale.setScalar(150 / Math.max(size.x, size.y, size.z));
      scene.add(mesh);
    });

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (mesh) mesh.rotation.y += 0.008;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

// ── Video card ─────────────────────────────────────────────────────────────
const VideoCard = ({ slide, active }) => {
  const vidRef = useRef(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.playbackRate = slide.playbackRate ?? 1;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active, slide.playbackRate]);

  return (
    <video
      ref={vidRef}
      src={slide.src}
      className="w-full h-full object-cover"
      playsInline
      loop
      muted={slide.muted}
    />
  );
};

// ── Main ───────────────────────────────────────────────────────────────────
const WeeklyHighlights = () => {
  const sectionRef = useRef(null);
  const slideRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  // Fade-in on scroll
  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1, y: 0, duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
  }, []);

  // Auto-rotate when not hovered
  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      setActive(i => (i + 1) % SLIDES.length);
    }, 2000);
    return () => clearInterval(id);
  }, [hovered]);

  // Crossfade slide
  useEffect(() => {
    if (!slideRef.current) return;
    gsap.fromTo(slideRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });
  }, [active]);

  const prev = () => setActive(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setActive(i => (i + 1) % SLIDES.length);
  const slide = SLIDES[active];

  return (
    <section
      ref={sectionRef}
      className="bg-black w-full min-h-screen flex flex-col justify-center py-16 px-6 wh-snap"
      style={{ opacity: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="wh-heading">Weekly Highlights</h2>
        <div className="wh-rule" />
      </div>

      {/* Slide + arrows */}
      <div className="flex items-center justify-center gap-4 w-full">
        {/* Prev */}
        <button onClick={prev} className="wh-arrow-btn flex-shrink-0" aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Active slide */}
        <div
          ref={slideRef}
          className="rounded-2xl overflow-hidden border border-white/20 flex-shrink-0 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          style={{ width: 'min(80vw, 820px)', aspectRatio: '16/9', background: '#0a0a0a' }}
        >
          {slide.type === 'video' && <VideoCard key={slide.id} slide={slide} active={true} />}
          {slide.type === 'pdf' && (
            <embed
              key={slide.id}
              src={slide.src}
              type="application/pdf"
              className="w-full h-full"
            />
          )}
          {slide.type === 'stl' && <PredatorViewer key={slide.id} active={true} />}
        </div>

        {/* Next */}
        <button onClick={next} className="wh-arrow-btn flex-shrink-0" aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div className="text-center mt-6 px-4 max-w-2xl mx-auto">
        <p className="wh-caption">{slide.caption}</p>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`wh-dot transition-all duration-300 ${i === active ? 'wh-dot-active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};

export default WeeklyHighlights;
