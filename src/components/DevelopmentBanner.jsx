import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-3 px-4 relative z-10 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em' }}>
            ⚡ ARENDA EXPO — JUNE 27TH !!!
          </span>
          <Link to="/expo">
            <button className="text-xs border border-white/40 hover:border-white hover:bg-white hover:text-black transition-all px-3 py-1 rounded"
              style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.1em' }}>
              LEARN MORE
            </button>
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white transition-colors p-1 rounded"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
