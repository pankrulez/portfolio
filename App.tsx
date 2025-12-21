
import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ExperienceModal from './components/ExperienceModal';
import AIAssistant from './components/AIAssistant';
import Magnetic from './components/Magnetic';
import { PROJECTS, SKILLS, EXPERIENCES } from './constants';
import { Project, Experience, Skill } from './types';
import { generateHeroImage } from './services/imageService';

const CV_LINK = "https://drive.google.com/uc?export=download&id=1FyOlK9FpdVwd79QaYyWZbNOEG8EDhjai";

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Data Science' | 'Mobile' | 'Web'>('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?auto=format&fit=crop&q=80&w=2000');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [activeSkillTab, setActiveSkillTab] = useState<Skill['category']>('Languages');

  useEffect(() => {
    const handleFilterEvent = (e: any) => {
      const filter = e.detail || 'All';
      setActiveFilter(filter);
      setIsExpanded(true);
      const target = document.getElementById('projects');
      if (target) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };
    window.addEventListener('filterProjects', handleFilterEvent);
    return () => window.removeEventListener('filterProjects', handleFilterEvent);
  }, []);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeFilter]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    generateHeroImage().then(img => { if(img) setHeroImage(img); setIsImageLoading(false); });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setScrollProgress((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kapripankaj@proton.me');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? PROJECTS 
      : PROJECTS.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const displayLimit = useMemo(() => {
    return isExpanded ? filteredProjects.length : (windowWidth >= 1280 ? 3 : 2);
  }, [isExpanded, filteredProjects.length, windowWidth]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, displayLimit);
  }, [filteredProjects, displayLimit]);

  const hasMore = filteredProjects.length > displayLimit;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Use environment variable for the Formspree ID, fallback to the placeholder
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
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const skillTabs: Skill['category'][] = ['Languages', 'Frameworks', 'AI & Systems', 'DevOps'];
  const filteredSkills = useMemo(() => {
    return SKILLS.filter(skill => skill.category === activeSkillTab);
  }, [activeSkillTab]);

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-emerald-400 via-cyan-400 via-indigo-500 to-violet-500 z-[100]" style={{ width: `${scrollProgress}%` }} />

      <Background />
      <Navbar scrolled={scrolled} />
      
      {/* Hero Section */}
      <header className="relative pt-24 md:pt-40 pb-12 md:pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6 md:mb-10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for New Opportunities
          </div>
          
          <div className="reveal stagger-1 flex flex-col items-center gap-3 md:gap-4 mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black font-outfit tracking-tighter leading-[1.1] text-white px-2">
              Architecting <span className="text-gradient">Intelligent Systems</span>
            </h1>
            <h2 className="text-lg md:text-2xl font-medium text-gray-400 tracking-tight font-outfit">
              Hi, I'm <span className="text-white font-black">Pankaj Kapri</span>
            </h2>
          </div>
          
          <p className="reveal stagger-2 max-w-xl text-[13px] md:text-lg text-gray-400 mb-10 md:mb-12 leading-relaxed px-4 break-words hyphens-auto">
            Experienced Software Engineer and Data Scientist specializing in high-performance predictive analytics and full-stack solutions.
          </p>
          
          <div className="reveal stagger-3 flex flex-col sm:flex-row gap-4 md:gap-6 items-center w-full sm:w-auto px-6 sm:px-0">
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a 
                href="#projects" 
                className="block text-center relative overflow-hidden px-8 py-4 md:py-3.5 rounded-full bg-indigo-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 hover:bg-white hover:text-gray-950 hover:scale-105 active:scale-95 shadow-indigo-500/30 group"
              >
                <span className="relative z-10">View Portfolio</span>
                <div className="shimmer-overlay opacity-30"></div>
              </a>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a 
                href={CV_LINK} 
                target="_blank" 
                className="block text-center relative overflow-hidden px-8 py-4 md:py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-gray-950 hover:scale-105 active:scale-95 group"
              >
                <span className="relative z-10">Get Resume</span>
                <div className="shimmer-overlay opacity-30"></div>
              </a>
            </Magnetic>
          </div>

          <div className="reveal mt-12 md:mt-20 relative w-full max-w-4xl group mx-auto px-2 md:px-0">
             <div className="absolute inset-0 blur-[40px] md:blur-[80px] bg-indigo-500/10 rounded-full opacity-60"></div>
             <div className="relative glass p-1 rounded-2xl md:rounded-[2.2rem] border-white/10 overflow-hidden aspect-video shadow-2xl">
                {isImageLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-black/20">
                    <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img src={heroImage} className="w-full h-full object-cover rounded-2xl md:rounded-[2.2rem] transition-transform duration-[15s] group-hover:scale-105" alt="Tech Architecture" />
                )}
             </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                <div className="h-[1px] w-6 md:w-8 bg-indigo-500/50"></div>
                <div className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[9px]">Case Studies</div>
              </div>
              <h2 className="text-2xl md:text-5xl font-black font-outfit mb-6 md:mb-7 text-white tracking-tight">Recent <span className="text-gradient">Work</span></h2>
              <div className="flex flex-wrap gap-2 md:gap-2.5 bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-fit overflow-x-auto">
                {['All', 'Data Science', 'Mobile', 'Web'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setActiveFilter(f as any)} 
                    className={`flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div key={activeFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {visibleProjects.map(p => (
              <div key={p.id} className="reveal opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-forwards">
                <ProjectCard project={p} onClick={setSelectedProject} />
              </div>
            ))}
          </div>
          
          {hasMore && (
             <div className="mt-12 md:mt-14 flex justify-center">
                <button onClick={() => setIsExpanded(true)} className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-3.5 rounded-xl glass border-white/10 text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-white/10 transition-all active:scale-95 shadow-lg">Load More Work</button>
             </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 md:py-32 px-4 max-w-5xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block"></div>
        <div className="reveal text-center mb-16 md:mb-24">
           <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 md:mb-6 font-bold uppercase tracking-[0.2em] text-[7px] md:text-[8px] text-cyan-400">Career Timeline</div>
           <h2 className="text-3xl md:text-5xl font-black font-outfit mb-6 md:mb-7 text-white tracking-tighter">Experience<span className="text-cyan-500">.</span></h2>
        </div>
        <div className="space-y-10 md:space-y-20 relative">
          {EXPERIENCES.map((exp, idx) => (
            <div key={exp.id} onClick={() => setSelectedExperience(exp)} className={`reveal flex flex-col md:flex-row gap-6 md:gap-12 items-center cursor-pointer group ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="md:w-[45%] flex justify-center md:justify-end group-even:md:justify-start w-full">
                 <div className="glass p-6 md:p-9 rounded-2xl border-white/10 group-hover:border-cyan-500/20 transition-all group-hover:bg-white/[0.03] w-full shadow-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 md:w-1.5 h-full ${exp.isBreak ? 'bg-indigo-500' : 'bg-cyan-500'}`}></div>
                    <span className="text-cyan-400 font-bold text-[7px] md:text-[8px] uppercase tracking-widest mb-2 md:mb-3 block opacity-70">{exp.period}</span>
                    <h3 className="text-base md:text-xl font-bold mb-1.5 md:mb-2 text-white group-hover:text-cyan-400 transition-colors leading-tight">{exp.role}</h3>
                    <p className="text-gray-500 font-bold text-[8px] md:text-[9px] mb-4 md:mb-5 uppercase tracking-widest">{exp.company}</p>
                    <p className="text-gray-400 text-[12px] md:text-sm line-clamp-2 leading-relaxed opacity-70 break-words">{exp.description}</p>
                 </div>
              </div>
              <div className="hidden md:flex w-10 h-10 rounded-full glass border-white/10 items-center justify-center relative z-10 bg-[#020617] group-hover:scale-110 group-hover:border-cyan-500/40 transition-all shadow-lg">
                <div className={`w-2.5 h-2.5 rounded-full ${exp.isBreak ? 'bg-indigo-500' : 'bg-cyan-500'} shadow-sm shadow-cyan-500/20`}></div>
              </div>
              <div className="md:w-[45%]"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-4 max-w-7xl mx-auto overflow-visible relative">
        <div className="reveal relative group max-w-5xl mx-auto">
           <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-indigo-500/10 rounded-2xl md:rounded-[2.5rem] blur-[1px]"></div>
           
           <div className="relative glass rounded-2xl md:rounded-[2.5rem] p-6 md:p-14 lg:p-16 flex flex-col lg:flex-row gap-10 lg:gap-20 overflow-hidden border-white/5 shadow-2xl">
             
             <div className="lg:w-[42%] relative z-10 flex flex-col justify-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6 md:mb-8 shadow-sm w-fit">
                   <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Open for Discussion
                   </span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black font-outfit mb-8 md:mb-10 leading-tight text-white tracking-tighter">
                   Start a <br/>
                   <span className="text-gradient">Professional Inquiry.</span>
                </h2>
                
                <div className="space-y-6 md:space-y-8">
                   <div onClick={handleCopyEmail} className="flex items-center gap-4 md:gap-5 group cursor-pointer w-fit p-2.5 -m-2.5 rounded-xl hover:bg-white/5 transition-all">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                         <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={1.2}/></svg>
                      </div>
                      <div className="overflow-hidden">
                         <div className="text-[7px] md:text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Node {copied && <span className="text-emerald-400 ml-2 animate-pulse">(Copied)</span>}</div>
                         <div className="text-sm md:text-lg font-bold text-white font-outfit opacity-90 truncate">kapripankaj@proton.me</div>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-3 md:gap-4 pt-6 md:pt-10 border-t border-white/5">
                      {[
                        { name: 'LinkedIn', url: 'https://linkedin.com/in/pankajkapri', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                        { name: 'GitHub', url: 'https://github.com/pankrulez', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-11386 8.199-11386 0-6627-5373-12-12-12z"/></svg> },
                        { name: 'Kaggle', url: 'https://www.kaggle.com/pankajkapri', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.825 23.859c-.022.028-.118.141-.253.141h-2.619c-.24 0-.445-.139-.567-.303l-5.69-8.429-2.443 2.381v5.749c0 .242-.202.443-.448.443H4.448C4.202 24 4 23.799 4 23.557V.443C4 .201 4.202 0 4.448 0h2.353c.246 0 .448.201.448.443v13.395l7.085-7.366c.127-.131.307-.209.504-.209h2.905c.199 0 .351.155.351.341 0 .044-.012.087-.036.129l-7.896 8.116 8.238 12.199c.125.17.114.391-.03.56c-.012.015-.024.03-.04.047z"/></svg> }
                      ].map((s) => (
                        <Magnetic strength={0.2} key={s.name}>
                          <a 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/20 hover:text-white shadow-md"
                            aria-label={s.name}
                          >
                            <span className="relative z-10 transition-transform group-hover:scale-110">{s.icon}</span>
                          </a>
                        </Magnetic>
                      ))}
                   </div>
                </div>
             </div>

             <div className="lg:w-[58%] relative z-10">
                <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6 bg-gray-950/40 p-5 md:p-10 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-xl backdrop-blur-2xl">
                   <div className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                         <div className="space-y-2 group/field">
                           <label className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-gray-500 ml-3">Identity</label>
                           <input required name="name" type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 focus:border-indigo-500/50 outline-none text-white transition-all text-xs md:text-sm font-medium placeholder:text-gray-700" />
                         </div>
                         <div className="space-y-2 group/field">
                           <label className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-gray-500 ml-3">Endpoint</label>
                           <input required name="email" type="email" placeholder="example@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 focus:border-indigo-500/50 outline-none text-white transition-all text-xs md:text-sm font-medium placeholder:text-gray-700" />
                         </div>
                      </div>
                      <div className="space-y-2 group/field">
                         <label className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-gray-500 ml-3">Engagement Specifics</label>
                         <textarea required name="message" placeholder="Project goals or message..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 focus:border-indigo-500/50 outline-none text-white resize-none transition-all text-xs md:text-sm font-medium placeholder:text-gray-700"></textarea>
                      </div>
                   </div>
                   
                   <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={formStatus === 'submitting'} 
                        className={`w-full py-4 md:py-5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-4 active:scale-[0.98] relative overflow-hidden shadow-xl ${
                          formStatus === 'success' ? 'bg-emerald-600' : 
                          formStatus === 'error' ? 'bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {formStatus === 'submitting' ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : formStatus === 'success' ? (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            <span>Transmission Success</span>
                          </>
                        ) : (
                          <span>Dispatch Request</span>
                        )}
                        <div className="shimmer-overlay opacity-5"></div>
                      </button>
                   </div>
                </form>
             </div>
           </div>
        </div>
      </section>

      <footer className="py-12 md:py-20 text-center border-t border-white/5 bg-black/40 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-6">
           <div className="text-xl md:text-2xl font-black mb-4 md:mb-5 font-outfit tracking-tighter opacity-80 uppercase">Pankaj Kapri</div>
           <p className="text-gray-600 text-[8px] md:text-[10px] max-w-sm md:max-w-xl mx-auto leading-loose opacity-40 uppercase tracking-[0.3em] px-4 font-bold">
             Engineered with Resilience • Built for Excellence
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
