import { navLists } from '../constants';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MobileNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile navigation includes project categories as regular nav items
  const mobileNavLists = ["Home", "AI", "Engineering", "Social Impact", "Founders", "Contact"];

  useEffect(() => {
    const root = document.documentElement;
    if (isMobileMenuOpen) {
      root.style.setProperty('--navbar-height', '32rem');
    } else {
      root.style.setProperty('--navbar-height', '5rem');
    }

    return () => {
      root.style.setProperty('--navbar-height', '5rem');
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLink = (nav) => {
    const mobileClasses = "px-8 py-4 text-lg cursor-pointer text-gray-500 hover:text-white transition-all border-b border-gray-700 last:border-b-0";
    
    if (nav === "Contact") {
      return (
        <Link to="/contact" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else if (nav === "Home") {
      return (
        <Link to="/" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else if (nav === "Founders") {
      return (
        <Link to="/founder" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else if (nav === "AI") {
      return (
        <Link to="/ai" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else if (nav === "Engineering") {
      return (
        <Link to="/engineering" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else if (nav === "Social Impact") {
      return (
        <Link to="/social-impact" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else if (nav === "Labs") {
      return (
        <Link to="/labs" onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </Link>
      );
    } else {
      return (
        <a href={`#${nav.toLowerCase()}`} onClick={closeMobileMenu}>
          <div className={mobileClasses}>{nav}</div>
        </a>
      );
    }
  };

  return (
    <div className="sm:hidden relative">
      {/* Mobile Menu Button */}
      <button
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50 relative"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Mobile Menu Dropdown */}
      <div 
        id="mobile-menu"
        className={`sm:hidden absolute top-12 right-0 w-screen overflow-hidden transition-all duration-300 bg-black/95 backdrop-blur-md shadow-lg ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          transform: 'translateX(calc(-100vw + 100%))'
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col items-center justify-start space-y-0 w-full">
          {mobileNavLists.map((nav) => (
            <div key={nav} className="w-full text-center">
              {renderNavLink(nav)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
