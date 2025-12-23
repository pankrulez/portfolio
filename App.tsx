
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ExperienceModal from './components/ExperienceModal';
import AIAssistant from './components/AIAssistant';
import Magnetic from './components/Magnetic';
import { PROJECTS, EXPERIENCES, SKILLS } from './constants';
import { Project, Experience } from './types';
import { generateHeroImage } from './services/imageService';

const CV_LINK = "https://drive.google.com/uc?export=download&id=1FyOlK9FpdVwd79QaYyWZbNOEG8EDhjai";

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Data Science' | 'Mobile' | 'Web'>('All');
  const [visibleCount, setVisibleCount] = useState(3);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?auto=format&fit=crop&q=80&w=1200');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleFilterEvent = (e: any) => {
      const filter = e.detail || 'All';
      setActiveFilter(filter);
      setVisibleCount(PROJECTS.length);
      const target = document.getElementById('projects');
      if (target) {
        const offset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    };
    window.addEventListener('filterProjects', handleFilterEvent);
    return () => window.removeEventListener('filterProjects', handleFilterEvent);
  }, []);

  useEffect(() => {
    const initial = windowWidth >= 1024 ? 3 : 2;
    setVisibleCount(initial);
  }, [activeFilter, windowWidth]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    generateHeroImage().then(img => { if(img) setHeroImage(img); setIsImageLoading(false); });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setScrollProgress((window.scrollY / totalHeight) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText('kapripankaj@proton.me');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, []);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? PROJECTS 
      : PROJECTS.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = filteredProjects.length > visibleCount;

  const showAll = () => {
    setVisibleCount(filteredProjects.length);
  };

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('projects');
    if (target) {
      const offset = 80;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const skillsByCategory = useMemo(() => {
    return SKILLS.reduce((acc: any, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    const formId = process.env.FORMSPREE_ID || 'mqaeobon';
    const formEndpoint = `https://formspree.io/f/${formId}`;
    const form = e.currentTarget;
    try {
      const response = await fetch(formEndpoint, { 
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 overflow-x-hidden w-full">
      <div className="fixed top-0 left-0 h-[2px] bg-indigo-500 z-[110] will-change-transform" style={{ width: `${scrollProgress}%`, transition: 'width 0.1s ease-out' }} />

      <Background />
      <Navbar scrolled={scrolled} />
      
      {/* Hero Section */}
      <header className="relative pt-24 md:pt-40 pb-12 md:pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available
          </div>
          
          <div className="reveal flex flex-col items-center gap-2 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-[1] text-white">
              Architecting <br className="md:hidden"/><span className="text-gradient">Intelligent Systems</span>
            </h1>
            <h2 className="text-lg md:text-2xl font-medium text-gray-400 tracking-tight font-outfit mt-2">
              Hi, I'm <span className="text-white font-black">Pankaj Kapri</span>
            </h2>
          </div>
          
          <p className="reveal max-w-xl text-sm md:text-lg text-gray-400 mb-10 leading-relaxed px-4 opacity-80">
            Experienced Software Engineer and Data Scientist specializing in high-performance predictive analytics and full-stack solutions.
          </p>
          
          <div className="reveal flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-10 sm:px-0">
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <button onClick={handlePortfolioClick} className="block text-center relative overflow-hidden px-10 py-3.5 rounded-full bg-indigo-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-gray-950 group w-full sm:w-auto">
                <span className="relative z-10">Portfolio</span>
              </button>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a href={CV_LINK} target="_blank" className="block text-center relative overflow-hidden px-10 py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-gray-950 w-full sm:w-auto">
                <span className="relative z-10">Resume</span>
              </a>
            </Magnetic>
          </div>

          <div className="reveal mt-12 md:mt-20 relative w-full max-w-4xl group mx-auto px-4 md:px-0">
             <div className="absolute inset-0 blur-[40px] md:blur-[80px] bg-indigo-500/5 rounded-full opacity-30"></div>
             <div className="relative glass p-1 rounded-xl md:rounded-[2rem] border-white/5 overflow-hidden aspect-video shadow-2xl">
                {isImageLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-black/10">
                    <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img src={heroImage} className="w-full h-full object-cover rounded-xl md:rounded-[2rem] transition-transform duration-[20s] lg:group-hover:scale-105" alt="Tech Architecture" loading="eager" />
                )}
             </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-28 px-4 md:px-8 relative w-full max-w-full">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-6 bg-indigo-500/50"></div>
                <div className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[8px]">Case Studies</div>
              </div>
              <h2 className="text-3xl md:text-6xl font-black font-outfit mb-6 text-white tracking-tight">Recent <span className="text-gradient">Work</span></h2>
              <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5 w-full md:w-fit overflow-x-auto no-scrollbar">
                {['All', 'Data Science', 'Mobile', 'Web'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setActiveFilter(f as any)} 
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 stagger-grid">
            {visibleProjects.map(p => (
              <div key={p.id} className="reveal">
                <ProjectCard project={p} onClick={setSelectedProject} />
              </div>
            ))}
          </div>
          
          {hasMore && (
             <div className="mt-12 flex justify-center">
                <button onClick={showAll} className="w-full sm:w-auto px-10 py-3 rounded-xl glass border-white/10 text-white font-bold uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all active:scale-95 shadow-xl">Show All Projects</button>
             </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 md:py-32 px-6 max-w-6xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block"></div>
        <div className="reveal text-center mb-16 md:mb-28">
           <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 font-bold uppercase tracking-[0.2em] text-[8px] text-cyan-400">Timeline</div>
           <h2 className="text-4xl md:text-6xl font-black font-outfit text-white tracking-tighter">Experience<span className="text-cyan-500">.</span></h2>
        </div>
        <div className="space-y-10 md:space-y-24 relative">
          {EXPERIENCES.map((exp, idx) => {
            const isLatest = idx === 0;
            const themeClass = isLatest ? 'bg-emerald-500' : (exp.isBreak ? 'bg-rose-500' : 'bg-cyan-500');
            const borderThemeClass = isLatest ? 'group-hover:border-emerald-500/20' : 'group-hover:border-cyan-500/20';
            const textThemeClass = isLatest ? 'text-emerald-400' : 'text-cyan-400';

            return (
              <div key={exp.id} onClick={() => setSelectedExperience(exp)} className={`reveal flex flex-col md:flex-row gap-6 md:gap-12 items-center cursor-pointer group ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="md:w-[45%] flex w-full">
                  <div className={`glass p-6 md:p-8 rounded-2xl border-white/5 ${borderThemeClass} transition-all group-hover:bg-white/[0.04] w-full shadow-xl relative overflow-hidden`}>
                      <div className={`absolute top-0 left-0 w-1 h-full ${themeClass}`}></div>
                      <span className={`${textThemeClass} font-bold text-[8px] uppercase tracking-widest mb-2 block opacity-70`}>{exp.period}</span>
                      <h3 className={`text-xl md:text-2xl font-bold mb-1 text-white group-hover:${textThemeClass} transition-colors leading-tight`}>{exp.role}</h3>
                      <p className="text-gray-500 font-bold text-[9px] mb-4 uppercase tracking-widest">{exp.company}</p>
                      <p className="text-gray-400 text-sm md:text-base line-clamp-2 leading-relaxed opacity-60 break-words">{exp.description}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full glass border-white/10 items-center justify-center relative z-10 bg-[#020617] transition-all group-hover:scale-110">
                  <div className={`w-2.5 h-2.5 rounded-full ${themeClass} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}></div>
                </div>
                <div className="md:w-[45%]"></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="stack" className="py-16 md:py-32 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="reveal text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 font-bold uppercase tracking-[0.3em] text-[8px] text-indigo-400">Capabilities</div>
          <h2 className="text-4xl md:text-6xl font-black font-outfit text-white tracking-tighter">The Tech <span className="text-gradient">Stack</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(skillsByCategory).map(([category, skills]: any, idx: number) => {
            const colors = ['text-emerald-400', 'text-cyan-400', 'text-indigo-400', 'text-violet-400'];
            const accentColor = colors[idx % colors.length];
            
            return (
              <div key={category} className="reveal glass p-6 md:p-8 rounded-3xl border-white/5 hover:border-white/10 transition-all group">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-8 ${accentColor}`}>{category}</h4>
                <div className="space-y-6">
                  {skills.map((skill: any) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs md:text-sm font-bold text-gray-200">{skill.name}</span>
                        <span className="text-[9px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{skill.level}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out rounded-full opacity-60 group-hover:opacity-100 ${accentColor.replace('text', 'bg')}`}
                          style={{ width: `${skill.level}%`, transitionDelay: `${idx * 100}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-32 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="reveal relative max-w-5xl mx-auto">
           <div className="relative glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-20 overflow-hidden border-white/5 shadow-2xl">
             
             <div className="lg:w-[40%] flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 w-fit">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   Inquiries Open
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black font-outfit mb-8 leading-[1] text-white tracking-tighter">
                   Let's start a <br/>
                   <span className="text-gradient">conversation.</span>
                </h2>
                
                <div className="space-y-4">
                   <Magnetic strength={0.15}>
                      <div onClick={handleCopyEmail} className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all shadow-lg">
                         <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={1.5}/></svg>
                         </div>
                         <div className="min-w-0">
                            <div className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Contact {copied && <span className="text-emerald-400 ml-2 animate-pulse">(Copied)</span>}</div>
                            <div className="text-xs md:text-base font-bold text-white font-outfit truncate">kapripankaj@proton.me</div>
                         </div>
                      </div>
                   </Magnetic>

                   <div className="flex gap-3 pt-6 border-t border-white/5">
                      {[
                        { name: 'LinkedIn', url: 'https://linkedin.com/in/pankajkapri', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                        { name: 'GitHub', url: 'https://github.com/pankrulez', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                        { name: 'Kaggle', url: 'https://kaggle.com/pankajkapri', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.825 23.859c-.022.028-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .199-.087.356-.261.471-.174.114-.348.172-.522.172h-3.12c-.174 0-.327-.058-.456-.172-.128-.115-.192-.272-.192-.471v-23.34c0-.199.064-.356.192-.471.129-.115.282-.172.456-.172h3.12c.174 0 .348.057.522.172.174.115.261.272.261.471v13.294l6.641-6.304c.106-.101.233-.152.381-.152h3.411c.16 0 .289.052.39.158.1.105.151.243.151.412 0 .15-.035.282-.104.396l-6.44 6.12 7.074 9.01c.106.136.16.276.16.421 0 .148-.045.293-.136.434z"/></svg> }
                      ].map((s) => (
                        <Magnetic strength={0.3} key={s.name}>
                          <a 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-all hover:bg-indigo-600 hover:text-white"
                            aria-label={s.name}
                          >
                            {s.icon}
                          </a>
                        </Magnetic>
                      ))}
                   </div>
                </div>
             </div>

             <div className="lg:w-[60%] flex flex-col justify-center">
                {formStatus === 'success' ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 animate-in zoom-in duration-500">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-black font-outfit text-white mb-2">Success</h3>
                    <p className="text-gray-400 text-xs max-w-xs leading-relaxed opacity-80">Message routed. I'll get back to you shortly.</p>
                    <button onClick={() => setFormStatus('idle')} className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Start New</button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className={`space-y-4 transition-opacity duration-300 w-full ${formStatus === 'submitting' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Identity</label>
                          <input required name="name" type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:border-indigo-500/50 outline-none text-white transition-all text-xs font-medium placeholder:text-gray-700" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Endpoint</label>
                          <input required name="email" type="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:border-indigo-500/50 outline-none text-white transition-all text-xs font-medium placeholder:text-gray-700" />
                       </div>
                    </div>
                    
                    <div className="space-y-1.5">
                       <label className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Message</label>
                       <textarea required name="message" placeholder="Describe your inquiry..." rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:border-indigo-500/50 outline-none text-white resize-none transition-all text-xs font-medium placeholder:text-gray-700"></textarea>
                    </div>
                    
                    <div className="pt-2">
                       <button 
                         type="submit" 
                         disabled={formStatus === 'submitting'} 
                         className={`w-full py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden ${
                           formStatus === 'error' ? 'bg-rose-600' : 'bg-indigo-600 hover:bg-white hover:text-gray-950'
                         }`}
                       >
                         <span className="relative z-10 flex items-center gap-2">
                           {formStatus === 'submitting' ? (
                             <>
                               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                               <span>Sending...</span>
                             </>
                           ) : formStatus === 'error' ? (
                             <span>Retry</span>
                           ) : (
                             <>
                               <span>Initialize Contact</span>
                               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2.5}/></svg>
                             </>
                           )}
                         </span>
                       </button>
                    </div>
                  </form>
                )}
             </div>
           </div>
        </div>
      </section>

      <footer className="py-16 md:py-24 text-center border-t border-white/5 bg-black/40 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-6">
           <div className="text-xl md:text-2xl font-black mb-4 font-outfit tracking-tighter opacity-90 uppercase">Pankaj Kapri</div>
           <p className="text-gray-600 text-[8px] max-w-sm md:max-w-xl mx-auto leading-loose opacity-50 uppercase tracking-[0.3em] px-4 font-bold">
             Engineered with Resilience
           </p>
        </div>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <ExperienceModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />
      <AIAssistant />
    </div>
  );
};

export default App;
