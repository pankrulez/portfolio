
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ExperienceModal from './components/ExperienceModal';
import AIAssistant from './components/AIAssistant';
import Magnetic from './components/Magnetic';
import { PROJECTS, EXPERIENCES, SKILLS } from './constants';
import { Project, Experience } from './types';

const CV_LINK = "https://drive.google.com/uc?export=download&id=1FyOlK9FpdVwd79QaYyWZbNOEG8EDhjai";

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Data Science' | 'Mobile' | 'Web'>('All');
  const [visibleCount, setVisibleCount] = useState(3);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [stackVisible, setStackVisible] = useState(false);
  const stackRef = useRef<HTMLElement>(null);

  // Deep link handling on mount and popstate
  useEffect(() => {
    const handleUrlParams = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');
        if (projectId) {
          const project = PROJECTS.find(p => p.id === projectId);
          if (project) {
            setSelectedProject(project);
            setTimeout(() => {
              const target = document.getElementById('projects');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 300);
          }
        } else {
          setSelectedProject(null);
        }
      } catch (err) {
        console.warn("URL parameter handling failed", err);
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    return () => window.removeEventListener('popstate', handleUrlParams);
  }, []);

  // Sync URL with selected project state
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedProject) {
        if (url.searchParams.get('id') !== selectedProject.id) {
          url.searchParams.set('id', selectedProject.id);
          window.history.pushState({ projectId: selectedProject.id }, '', url.toString());
        }
      } else {
        if (url.searchParams.has('id')) {
          url.searchParams.delete('id');
          window.history.pushState({}, '', url.toString());
        }
      }
    } catch (err) {
      console.warn("History sync failed", err);
    }
  }, [selectedProject]);

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
    const initial = windowWidth >= 1024 ? 3 : (windowWidth >= 640 ? 2 : 1);
    setVisibleCount(initial);
  }, [activeFilter, windowWidth]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
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

  // Observer for Stack section progress bars
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setStackVisible(true);
      }
    }, { threshold: 0.2 });

    if (stackRef.current) {
      observer.observe(stackRef.current);
    }

    return () => observer.disconnect();
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
    const formId = (process.env?.FORMSPREE_ID as string) || 'mqaeobon';
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
      
      <header className="relative pt-24 sm:pt-32 md:pt-44 pb-16 md:pb-32 px-4 md:px-8 min-h-[500px] flex items-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center w-full">
          
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 md:mb-8 shadow-2xl backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Online
          </div>
          
          <div className="reveal flex flex-col items-center gap-2 md:gap-3 mb-6 md:mb-10 w-full px-2">
            <h1 className="fluid-heading font-black font-outfit tracking-widest leading-none text-white whitespace-nowrap overflow-visible">
              Architecting <span className="text-gradient">Intelligent Systems</span>
            </h1>
            <h2 className="text-[8px] sm:text-xs md:text-sm font-black text-indigo-400/60 tracking-[0.3em] font-outfit mt-1">
              Full-Stack Resilience • Data Science Precision
            </h2>
          </div>
          
          <div className="reveal max-w-3xl flex flex-col items-center">
            <p className="text-[11px] sm:text-sm md:text-base text-gray-400 mb-8 md:mb-10 leading-relaxed px-4 sm:px-6 opacity-90 font-medium">
              Hi, I'm <span className="text-white font-black">Pankaj Kapri</span>. 
              With 5+ years of engineering experience, I bridge the gap between 
              <span className="text-indigo-400"> performance architecture</span> and 
              <span className="text-emerald-400"> predictive intelligence</span>. 
              Focused on software that evolves.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 mb-12 w-full max-w-2xl px-4 sm:px-0">
               {[
                 { label: 'Engineering DNA', val: '5+', sub: 'Years Systems Dev' },
                 { label: 'AI Synthesis', val: '10+', sub: 'Deployed GenAI' },
                 { label: 'Architecture', val: '360°', sub: 'Stack Specialist' }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center p-4 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:border-indigo-500/30 transition-all hover:bg-white/[0.04] active:scale-95">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 group-hover:text-indigo-400 transition-colors">{stat.label}</span>
                    <span className="text-xl md:text-3xl font-black text-white font-outfit leading-none">{stat.val}</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">{stat.sub}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="reveal flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto px-6 sm:px-0">
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <button 
                onClick={handlePortfolioClick} 
                className="group relative px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-indigo-600 text-white text-[9px] md:text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-gray-950 w-full sm:w-auto btn-vibrant-glow"
              >
                <span className="relative z-10">Explore Work</span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-full"></div>
              </button>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a 
                href={CV_LINK} 
                target="_blank" 
                className="block text-center px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-white/5 border border-white/10 text-white text-[9px] md:text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-gray-950 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto backdrop-blur-md btn-vibrant-glow"
              >
                Download CV
              </a>
            </Magnetic>
          </div>

          <div className="reveal mt-12 md:mt-24 w-full overflow-hidden opacity-30 group">
             <div className="flex whitespace-nowrap gap-8 md:gap-16 animate-infinite-scroll">
                {[...SKILLS.slice(0, 10), ...SKILLS.slice(0, 10)].map((skill, i) => (
                  <span key={i} className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] text-gray-500 hover:text-white transition-colors cursor-default">
                    {skill.name}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </header>

      <section id="projects" className="py-12 md:py-28 px-4 md:px-8 relative w-full max-w-full">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-[1px] w-4 bg-indigo-500/50"></div>
                <div className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[7px] md:text-[8px]">Case Studies</div>
              </div>
              <h2 className="text-2xl md:text-6xl font-black font-outfit mb-6 text-white tracking-tight">Recent <span className="text-gradient">Work</span></h2>
              <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5 w-full md:w-fit overflow-x-auto no-scrollbar">
                {['All', 'Data Science', 'Mobile', 'Web'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setActiveFilter(f as any)} 
                    className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? 'bg-indigo-600 text-white glow-indigo' : 'text-gray-500 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 stagger-grid">
            {visibleProjects.map((p, idx) => (
              <div key={p.id} className="reveal" style={{ '--idx': idx } as any}>
                <ProjectCard project={p} onClick={setSelectedProject} />
              </div>
            ))}
          </div>
          
          {hasMore && (
             <div className="mt-12 flex justify-center">
                <button onClick={showAll} className="w-full sm:w-auto px-8 py-3 rounded-xl glass border-white/10 text-white font-bold uppercase tracking-widest text-[8px] md:text-[9px] hover:bg-white/10 transition-all active:scale-95 btn-vibrant-glow">Show All Projects</button>
             </div>
          )}
        </div>
      </section>

      <section id="experience" className="py-20 md:py-40 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="reveal text-center mb-16 md:mb-32">
             <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 font-bold uppercase tracking-[0.3em] text-[8px] text-indigo-400">Professional Conduit</div>
             <h2 className="text-4xl md:text-7xl font-black font-outfit text-white tracking-tighter">Career <span className="text-gradient">Timeline</span></h2>
          </div>

          <div className="absolute top-[350px] bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/5 hidden md:block">
             <div 
               className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
               style={{ height: `${Math.min(100, (scrollProgress - 30) * 2.5)}%` }}
             ></div>
          </div>

          <div className="space-y-12 md:space-y-40 relative">
            {EXPERIENCES.map((exp, idx) => {
              const isLatest = idx === 0;
              const isEven = idx % 2 === 0;
              const themeColor = isLatest ? 'emerald' : (exp.isBreak ? 'rose' : 'indigo');
              const yearRange = exp.period.split('-')[0].trim();

              const themeStyles = {
                emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', lightBg: 'bg-emerald-500/10', ping: 'bg-emerald-400' },
                rose: { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/20', lightBg: 'bg-rose-500/10', ping: 'bg-rose-400' },
                indigo: { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/20', lightBg: 'bg-indigo-500/10', ping: 'bg-indigo-400' },
              };
              const styles = themeStyles[themeColor as keyof typeof themeStyles];

              return (
                <div key={exp.id} onClick={() => setSelectedExperience(exp)} className="reveal relative flex flex-col md:flex-row items-center cursor-pointer group">
                  <div className={`hidden md:flex absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-[42%] h-full items-start ${isEven ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                    <div className="sticky top-1/2 -translate-y-1/2 text-right">
                       <span className={`text-6xl md:text-8xl font-black font-outfit opacity-5 group-hover:opacity-20 transition-all duration-700 ${isEven ? 'text-right' : 'text-left'}`}>
                         {yearRange}
                       </span>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full glass border-white/10 items-center justify-center z-20 bg-[#020617] transition-all duration-500 group-hover:scale-125 group-hover:border-white/30">
                     <div className={`w-3 h-3 rounded-full ${styles.bg} shadow-[0_0_15px_rgba(0,0,0,1)] relative`}>
                        <div className={`absolute inset-0 rounded-full ${styles.ping} animate-ping opacity-40`}></div>
                     </div>
                  </div>
                  <div className={`w-full md:w-[42%] ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className={`glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-white/5 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 group-hover:-translate-y-2 shadow-2xl relative overflow-hidden`}>
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${styles.bg} shadow-[2px_0_15px_rgba(0,0,0,0.3)]`}></div>
                        <div className="flex justify-between items-start mb-6">
                           <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${styles.lightBg} ${styles.text} border ${styles.border}`}>
                             {exp.period}
                           </span>
                           <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest opacity-40">{exp.location}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black mb-2 text-white font-outfit leading-tight">{exp.role}</h3>
                        <p className={`${styles.text} font-black text-[10px] mb-6 uppercase tracking-[0.2em]`}>{exp.company}</p>
                        <p className="text-gray-400 text-xs md:text-base leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity mb-8 line-clamp-3 md:line-clamp-none">
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {exp.skills?.slice(0, 3).map(skill => (
                             <span key={skill} className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-bold text-gray-400 uppercase tracking-wider">{skill}</span>
                           ))}
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stack" ref={stackRef} className="py-12 md:py-32 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="reveal text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 font-bold uppercase tracking-[0.3em] text-[7px] md:text-[8px] text-indigo-400">Capabilities</div>
          <h2 className="text-3xl md:text-6xl font-black font-outfit text-white tracking-tighter">The Tech <span className="text-gradient">Stack</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Object.entries(skillsByCategory).map(([category, skills]: any, idx: number) => {
            const colors = ['text-emerald-400', 'text-cyan-400', 'text-indigo-400', 'text-violet-400'];
            const accentColor = colors[idx % colors.length];
            return (
              <div key={category} className="reveal glass p-6 md:p-8 rounded-3xl border-white/5 hover:border-white/10 transition-all group" style={{ '--idx': idx } as any}>
                <h4 className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 ${accentColor}`}>{category}</h4>
                <div className="space-y-4 md:space-y-6">
                  {skills.map((skill: any, sIdx: number) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-gray-200">{skill.name}</span>
                        <span className="text-[8px] md:text-[9px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out rounded-full opacity-70 group-hover:opacity-100 ${accentColor.replace('text', 'bg')} relative`}
                          style={{ 
                            width: stackVisible ? `${skill.level}%` : '0%', 
                            transitionDelay: `${(idx * 200) + (sIdx * 100) + 300}ms`,
                            boxShadow: stackVisible ? `0 0 10px ${accentColor.replace('text-', '')}` : 'none'
                          }}
                        >
                           <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact" className="py-12 md:py-32 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="reveal relative max-w-5xl mx-auto">
           <div className="relative glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-10 lg:gap-20 overflow-hidden border-white/5 shadow-2xl">
             <div className="lg:w-[40%] flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 md:mb-8 w-fit">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   Inquiries Open
                </div>
                <h2 className="text-2xl md:text-5xl font-black font-outfit mb-6 md:mb-8 leading-[1.1] text-white tracking-tighter">
                   Let's start a <br className="hidden md:block"/>
                   <span className="text-gradient">conversation.</span>
                </h2>
                <div className="space-y-4">
                   <Magnetic strength={0.15}>
                      <div onClick={handleCopyEmail} className="flex items-center gap-4 group cursor-pointer p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all shadow-lg">
                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={1.5}/></svg>
                         </div>
                         <div className="min-w-0">
                            <div className="text-[6px] md:text-[7px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Contact {copied && <span className="text-emerald-400 ml-2 animate-pulse">(Copied)</span>}</div>
                            <div className="text-xs md:text-base font-bold text-white font-outfit truncate">kapripankaj@proton.me</div>
                         </div>
                      </div>
                   </Magnetic>
                   <div className="flex gap-2.5 pt-6 border-t border-white/5">
                      {[
                        { name: 'LinkedIn', url: 'https://linkedin.com/in/pankajkapri', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, hoverClass: 'hover:bg-[#0077b5]' },
                        { name: 'GitHub', url: 'https://github.com/pankrulez', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>, hoverClass: 'hover:bg-gray-800' },
                        { name: 'Kaggle', url: 'https://kaggle.com/pankajkapri', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.825 23.859c-.022.028-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .199-.087.356-.261.471-.174.114-.348.172-.522.172h-3.12c-.174 0-.327-.058-.456-.172-.128-.115-.192-.272-.192-.471v-23.34c0-.199.064-.356.192-.471.129-.115.282-.172.456-.172h3.12c.174 0 .348.057.522.172.174.115.261.272.261.471v13.294l6.641-6.304c.106-.101.233-.152.381-.152h3.411c.16 0 .289.052.39.158.1.105.151.243.151.412 0 .15-.035.282-.104.396l-6.44 6.12 7.074 9.01c.106.136.16.276.16.421 0 .148-.045.293-.136.434z"/></svg>, hoverClass: 'hover:bg-cyan-500' }
                      ].map((s) => (
                        <Magnetic strength={0.3} key={s.name}>
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-2xl hover:text-white ${s.hoverClass}`} aria-label={s.name}>
                            <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{s.icon}</div>
                          </a>
                        </Magnetic>
                      ))}
                   </div>
                </div>
             </div>
             <div className="lg:w-[60%] flex flex-col justify-center">
                {formStatus === 'success' ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 animate-in zoom-in duration-500">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-6 glow-emerald">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black font-outfit text-white mb-2">Success</h3>
                    <p className="text-gray-400 text-[10px] md:text-xs max-w-xs leading-relaxed opacity-80 uppercase tracking-widest font-bold">Message routed. I'll get back to you shortly.</p>
                    <button onClick={() => setFormStatus('idle')} className="mt-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 hover:text-white transition-colors">Start New</button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className={`space-y-4 transition-opacity duration-300 w-full ${formStatus === 'submitting' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Identity</label>
                          <input required name="name" type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:border-indigo-500/50 outline-none text-white transition-all text-xs font-medium placeholder:text-gray-700" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Endpoint</label>
                          <input required name="email" type="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:border-indigo-500/50 outline-none text-white transition-all text-xs font-medium placeholder:text-gray-700" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Message</label>
                       <textarea required name="message" placeholder="Describe your inquiry..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:border-indigo-500/50 outline-none text-white resize-none transition-all text-xs font-medium placeholder:text-gray-700"></textarea>
                    </div>
                    <div className="pt-2">
                       <button type="submit" disabled={formStatus === 'submitting'} className={`w-full py-4 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden btn-vibrant-glow ${formStatus === 'error' ? 'bg-rose-600' : 'bg-indigo-600 hover:bg-white hover:text-gray-950'}`}>
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

      <footer className="py-12 md:py-24 text-center border-t border-white/5 bg-black/40 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-6">
           <div className="text-lg md:text-2xl font-black mb-4 font-outfit tracking-tighter opacity-90 uppercase">Pankaj Kapri</div>
           <p className="text-gray-600 text-[7px] md:text-[8px] max-w-sm md:max-w-xl mx-auto leading-loose opacity-50 uppercase tracking-[0.3em] px-4 font-bold">
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
