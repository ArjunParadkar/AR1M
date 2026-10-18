import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const EXPO_DATE = new Date('2026-06-27T09:00:00');

const pad = n => String(n).padStart(2, '0');

const Countdown = () => {
  const [time, setTime] = useState({});

  useEffect(() => {
    const tick = () => {
      const diff = EXPO_DATE - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'DAYS', val: time.days },
    { label: 'HOURS', val: time.hours },
    { label: 'MINS', val: time.minutes },
    { label: 'SECS', val: time.seconds },
  ];

  return (
    <div className="flex gap-6 justify-center flex-wrap">
      {units.map(({ label, val }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="expo-counter-box">{pad(val ?? 0)}</div>
          <span className="expo-counter-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

const ExpoPage = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div ref={heroRef} className="flex flex-col items-center justify-center text-center px-6 py-32" style={{ opacity: 0 }}>
        <p className="expo-eyebrow">Arenda Innovations Presents</p>
        <h1 className="expo-title">ARENDA EXPO</h1>
        <p className="expo-date-line">June 27th, 2026</p>

        <div className="mt-12 mb-4">
          <p className="expo-countdown-label">Countdown</p>
          <Countdown />
        </div>

        <Link to="/expo/signup" className="mt-8">
          <button className="expo-banner-btn">Register Now</button>
        </Link>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-16" style={{ opacity: 0 }}>

        <div className="expo-section">
          <h2 className="expo-section-title">What is Arenda Expo?</h2>
          <p className="expo-body">
            Arenda Expo is our flagship showcase event — a day where students, researchers, engineers,
            and innovators present their work to the world. Projects spanning AI, aerospace, biotech,
            and social impact will be on display. Expect live demos, presentations, and a look at
            what the next generation of builders is creating right now.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="expo-info-card">
            <h3 className="expo-info-title">Date</h3>
            <p className="expo-info-body">June 27th, 2026</p>
          </div>
          <div className="expo-info-card">
            <h3 className="expo-info-title">Location</h3>
            <p className="expo-info-body">Details coming soon</p>
          </div>
        </div>

        <div className="expo-section">
          <h2 className="expo-section-title">What to Expect</h2>
          <ul className="flex flex-col gap-4 mt-4">
            {[
              'Live project demonstrations from Arenda teams',
              'AI & hardware prototypes in action',
              'Presentations from student researchers',
              'Networking with engineers and industry guests',
              'Arenda Labs showcase',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="expo-bullet">→</span>
                <span className="expo-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign up cards */}
        <div className="expo-section">
          <h2 className="expo-section-title">Get Involved</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {[
              { label: 'Attend', path: '/expo/signup', desc: 'Reserve your spot at Arenda Expo.' },
              { label: 'Sponsor', path: '/expo/signup?type=sponsor', desc: 'Support the next generation of builders.' },
              { label: 'Present', path: '/expo/signup?type=present', desc: 'Showcase your project or research.' },
              { label: 'VIP', path: '/expo/signup?type=vip', desc: 'Exclusive access and investment opportunities.' },
            ].map(({ label, path, desc }) => (
              <Link key={label} to={path}>
                <div className="expo-info-card cursor-pointer hover:border-white/30 transition-colors">
                  <h3 className="expo-info-title">{label}</h3>
                  <p className="expo-body text-sm">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpoPage;
