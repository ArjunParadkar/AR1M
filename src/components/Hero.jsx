import ArendaLogoMark from './ArendaLogoMark';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TAGLINE = 'Build The Future';

const Hero = () => {
  const logoRef = useRef(null);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const titleRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    const q = sel => logoRef.current.querySelectorAll(sel);

    // Gold sparkle runs around every line of the logo, then the mark fills in
    tl.to(q('.logo-tail'), { attr: { 'stroke-dashoffset': -1 }, duration: 2.4, ease: 'power1.inOut', stagger: 0.07 }, 0)
      .to(q('.logo-spark'), { attr: { 'stroke-dashoffset': -1.148 }, duration: 2.4, ease: 'power1.inOut', stagger: 0.07 }, 0)
      .to(q('.logo-fill'), { attr: { 'fill-opacity': 1 }, duration: 0.9, ease: 'power2.out', stagger: 0.04 }, 2.0)
      .set(q('.logo-tail, .logo-spark'), { opacity: 0 }, 3.4);

    // Electric flicker appearance for "Arenda Innovations"
    tl.set(titleRef.current, { opacity: 0, textShadow: 'none' })
      // first strike
      .to(titleRef.current, { opacity: 1, duration: 0.04 })
      .to(titleRef.current, { textShadow: '0 0 10px #fff, 0 0 40px #fff, 0 0 80px #fff, 0 0 140px #fff', duration: 0.06 })
      .to(titleRef.current, { opacity: 0.1, textShadow: 'none', duration: 0.05 })
      // second strike
      .to(titleRef.current, { opacity: 1, duration: 0.04 })
      .to(titleRef.current, { textShadow: '0 0 15px #fff, 0 0 50px #fff, 0 0 100px #fff', duration: 0.07 })
      .to(titleRef.current, { opacity: 0.2, textShadow: 'none', duration: 0.04 })
      // third strike
      .to(titleRef.current, { opacity: 1, duration: 0.03 })
      .to(titleRef.current, { textShadow: '0 0 20px #fff, 0 0 60px #fff, 0 0 110px #fff', duration: 0.06 })
      .to(titleRef.current, { opacity: 0.15, textShadow: 'none', duration: 0.05 })
      // fourth strike — slightly longer hold
      .to(titleRef.current, { opacity: 1, duration: 0.05 })
      .to(titleRef.current, { textShadow: '0 0 12px #fff, 0 0 35px #fff, 0 0 75px #fff, 0 0 130px #fff', duration: 0.10 })
      .to(titleRef.current, { opacity: 0.3, textShadow: 'none', duration: 0.06 })
      // settle into steady glow
      .to(titleRef.current, {
        opacity: 1,
        textShadow: '0px 0px -60px rgb(255,255,255), 0px 0px 18px rgb(255,255,255), 20px 20px 40px rgba(200,220,255,0.55)',
        duration: 0.45,
        ease: 'power1.out',
      })
      // Dust sweep: each char fades in from left with blur, left→right
      .fromTo(
        charsRef.current.filter(Boolean),
        { opacity: 0, x: -22, filter: 'blur(8px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '+=0.15'
      );

    // Hero is its own pinned page: on scroll it zooms out and dims with
    // resistance (smoothed scrub) while the next section slides over it.
    gsap.to(stageRef.current, {
      scale: 0.55,
      opacity: 0.15,
      filter: 'blur(6px)',
      ease: 'power2.in',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
        scrub: 1.5,
        anticipatePin: 1,
      },
    });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-screen bg-black relative overflow-hidden" id="hero">
      <div ref={stageRef} className="absolute inset-0 flex flex-col items-center justify-center will-change-transform">
        <ArendaLogoMark ref={logoRef} className="relative z-10 h-[42vh] w-auto aspect-square mt-16" />

        <div className="relative z-10 flex flex-col items-center gap-3 px-5 -mt-2">
          <h1 ref={titleRef} className="arenda-electric-title" style={{ marginTop: 0 }}>
            Arenda Innovations
          </h1>
          <div className="flex flex-wrap justify-center">
            {TAGLINE.split('').map((char, i) => (
              <span
                key={i}
                ref={el => { charsRef.current[i] = el; }}
                className="tagline-char"
                style={{ opacity: 0, whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
