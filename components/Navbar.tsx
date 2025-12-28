
import React, { useState, useEffect } from 'react';
import Magnetic from './Magnetic';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = ['Projects', 'Experience', 'Stack'];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const sections = ['projects', 'experience', 'stack', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const hero = document.querySelector('header');
    if (hero) {
      hero.id = 'home';
      observer.observe(hero);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id.toLowerCase() === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out ${
      scrolled 
        ? 'bg-gray-950/80 backdrop-blur-2xl border-b border-white/10 py-3 md:py-4 shadow-2xl' 
        : 'bg-transparent py-6 md:py-10 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        
        {/* Neural Prism Home Button */}
        <Magnetic strength={0.25}>
          <div 
            className="cursor-pointer group flex items-center gap-4 py-2" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Neural Prism Logo Mark */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              {/* Outer Hexagon Shell */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl bg-white/[0.02] group-hover:bg-indigo-600/10 group-hover:border-indigo-500/30 transition-all duration-500 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"></div>
              
              {/* Animated Synapses */}
              <svg className="absolute inset-0 w-full h-full p-2.5 opacity-40 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 100">
                <path d="M50 20 L50 80 M20 50 L80 50 M30 30 L70 70 M70 30 L30 70" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-indigo-500/50 group-hover:text-indigo-400">
                  <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Connection Nodes */}
                <circle cx="50" cy="50" r="1.5" className="fill-white" />
                <circle cx="20" cy="50" r="1" className="fill-indigo-500 group-hover:fill-white" />
                <circle cx="80" cy="50" r="1" className="fill-indigo-500 group-hover:fill-white" />
                <circle cx="50" cy="20" r="1" className="fill-emerald-500 group-hover:fill-white" />
                <circle cx="50" cy="80" r="1" className="fill-emerald-500 group-hover:fill-white" />
              </svg>

              {/* Glowing Core */}
              <div className="relative w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#fff] group-hover:shadow-[0_0_20px_rgba(99,102,241,1)] transition-all duration-500">
                 <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></div>
              </div>
            </div>
            
            {/* Branding Typography */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-base md:text-xl font-black tracking-tighter font-outfit text-white group-hover:text-indigo-400 transition-colors uppercase">
                  PANKAJ KAPRI
                </span>
              </div>
            </div>
          </div>
        </Magnetic>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const itemId = item.toLowerCase();
            const isActive = activeSection === itemId;
            return (
              <a 
                key={item} 
                href={`#${itemId}`}
                onClick={(e) => handleNavClick(e, itemId)}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative group py-2 ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item}</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-indigo-500 transition-all duration-500 ease-out rounded-full ${
                  isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                }`}></span>
              </a>
            );
          })}
          <div className="h-6 w-[1px] bg-white/5 mx-2"></div>
          <Magnetic strength={0.15}>
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`relative overflow-hidden px-8 py-3.5 rounded-xl transition-all duration-500 active:scale-95 text-[9px] font-black uppercase tracking-[0.2em] btn-vibrant-glow ${
                activeSection === 'contact' 
                  ? 'bg-white text-gray-950' 
                  : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-transparent'
              }`}
            >
              <span className="relative z-10">Connect</span>
            </a>
          </Magnetic>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-white w-10 h-10 flex items-center justify-center rounded-xl glass border-white/10 active:scale-90 transition-transform"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-3 flex flex-col justify-between items-center relative">
            <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 top-[65px] bg-gray-950/98 backdrop-blur-3xl transition-all duration-700 ease-in-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <div className="flex flex-col items-center justify-center h-full p-8 gap-10 text-center">
          {navItems.map((item, idx) => {
            const itemId = item.toLowerCase();
            const isActive = activeSection === itemId;
            return (
              <a 
                key={idx} 
                href={`#${itemId}`}
                className={`text-4xl font-black font-outfit transition-all duration-500 uppercase tracking-tighter ${
                  isActive ? 'text-indigo-400 scale-110' : 'text-gray-600 hover:text-white'
                }`}
                onClick={(e) => handleNavClick(e, itemId)}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {item}
              </a>
            );
          })}
          <div className="pt-6 w-full max-w-xs">
            <a 
              href="#contact"
              className="relative overflow-hidden w-full block text-center py-6 rounded-2xl bg-indigo-600 text-white font-black text-xl uppercase tracking-[0.2em] shadow-2xl active:scale-[0.95] transition-all btn-vibrant-glow"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
