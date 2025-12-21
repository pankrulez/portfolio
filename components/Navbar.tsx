
import React, { useState, useEffect } from 'react';

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
        <div 
          className="text-lg md:text-2xl font-black tracking-tighter font-outfit cursor-pointer group flex items-center gap-2" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-rose-500 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20"></div>
          <span className="text-white">PANKAJ</span><span className="text-indigo-500 group-hover:text-rose-500 transition-colors">.</span><span className="text-white opacity-80 group-hover:opacity-100 transition-opacity">KAPRI</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item) => {
            const itemId = item.toLowerCase();
            const isActive = activeSection === itemId;
            return (
              <a 
                key={item} 
                href={`#${itemId}`}
                onClick={(e) => handleNavClick(e, itemId)}
                className={`text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 relative group py-2 ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item}</span>
                <span className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-rose-500 to-cyan-500 transition-all duration-500 ease-out rounded-full ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            );
          })}
          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className={`relative overflow-hidden px-10 py-4 rounded-[2rem] transition-all duration-500 active:scale-95 text-xs font-black uppercase tracking-[0.2em] shadow-2xl ${
              activeSection === 'contact' 
                ? 'bg-white text-gray-950 scale-105 shadow-white/10' 
                : 'bg-indigo-600 text-white hover:bg-white hover:text-gray-950 hover:scale-110 shadow-indigo-500/30'
            }`}
          >
            <span className="relative z-10">Connect</span>
            <div className="shimmer-overlay opacity-30"></div>
          </a>
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
        <div className="flex flex-col items-center justify-center h-full p-6 md:p-10 gap-8 md:gap-12 text-center">
          {navItems.map((item, idx) => {
            const itemId = item.toLowerCase();
            const isActive = activeSection === itemId;
            return (
              <a 
                key={idx} 
                href={`#${itemId}`}
                className={`text-3xl md:text-4xl font-black font-outfit transition-all duration-500 uppercase tracking-tighter ${
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
              className="relative overflow-hidden w-full block text-center py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] bg-indigo-600 text-white font-black text-xl md:text-2xl uppercase tracking-[0.2em] shadow-2xl active:scale-[0.95] transition-all"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              Contact
              <div className="shimmer-overlay opacity-30"></div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
