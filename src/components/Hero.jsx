import { heroVideo } from '../utils';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const TAGLINE = 'Build The Future';

const Hero = () => {
  const videoSrc = heroVideo;
  const [videoEnded, setVideoEnded] = useState(false);
  const titleRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    if (!videoEnded) return;

    const tl = gsap.timeline();

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
  }, [videoEnded]);

  return (
    <section className="w-full bg-black relative flex flex-col" id="hero">
      <div className="flex flex-col w-full">
        <div className="w-full flex-center">
          <div className="md:w-10/12 w-9/12 flex-center">
            <video
              className="pointer-events-none"
              autoPlay
              muted
              playsInline
              onTimeUpdate={e => {
                const v = e.target;
                if (!videoEnded && v.duration && v.currentTime >= v.duration - 4) {
                  setVideoEnded(true);
                }
              }}
              onEnded={() => setVideoEnded(true)}
              key={videoSrc}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="flex flex-col items-center pb-10 gap-3 -mt-[80px] relative z-10">
        <h1 ref={titleRef} className="arenda-electric-title">
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