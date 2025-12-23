
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
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
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
    if (isExpanded) return filteredProjects.length;
    return windowWidth >= 1024 ? 3 : (windowWidth >= 640 ? 2 : 2);
  }, [isExpanded, filteredProjects.length, windowWidth]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, displayLimit);
  }, [filteredProjects, displayLimit]);

  const hasMore = filteredProjects.length > displayLimit;

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
      <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 z-[110]" style={{ width: `${scrollProgress}%` }} />

      <Background />
      <Navbar scrolled={scrolled} />
      
      {/* Hero Section */}
      <header className="relative pt-28 md:pt-44 pb-16 md:pb-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for New Projects
          </div>
          
          <div className="reveal flex flex-col items-center gap-4 mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-[1] text-white">
              Architecting <br className="md:hidden"/><span className="text-gradient">Intelligent Systems</span>
            </h1>
            <h2 className="text-lg md:text-2xl font-medium text-gray-400 tracking-tight font-outfit">
              Hi, I'm <span className="text-white font-black">Pankaj Kapri</span>
            </h2>
          </div>
          
          <p className="reveal max-w-xl text-sm md:text-lg text-gray-400 mb-12 leading-relaxed px-4 opacity-80">
            Experienced Software Engineer and Data Scientist specializing in high-performance predictive analytics and full-stack solutions.
          </p>
          
          <div className="reveal flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-10 sm:px-0">
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a href="#projects" className="block text-center relative overflow-hidden px-10 py-4 rounded-full bg-indigo-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-white hover:text-gray-950 group w-full sm:w-auto">
                <span className="relative z-10">Portfolio</span>
                <div className="shimmer-overlay opacity-20"></div>
              </a>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a href={CV_LINK} target="_blank" className="block text-center relative overflow-hidden px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-gray-950 w-full sm:w-auto">
                <span className="relative z-10">Resume</span>
                <div className="shimmer-overlay opacity-20"></div>
              </a>
            </Magnetic>
          </div>

          <div className="reveal mt-16 md:mt-24 relative w-full max-w-5xl group mx-auto px-4 md:px-0">
             <div className="absolute inset-0 blur-[60px] md:blur-[100px] bg-indigo-500/10 rounded-full opacity-40"></div>
             <div className="relative glass p-1 rounded-2xl md:rounded-[3rem] border-white/5 overflow-hidden aspect-video shadow-2xl">
                {isImageLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-black/10">
                    <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img src={heroImage} className="w-full h-full object-cover rounded-2xl md:rounded-[3rem] transition-transform duration-[20s] group-hover:scale-105" alt="Tech Architecture" />
                )}
             </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="py-20 md:py-32 px-4 md:px-8 relative w-full max-w-full">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-indigo-500/50"></div>
                <div className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[9px]">Case Studies</div>
              </div>
              <h2 className="text-3xl md:text-6xl font-black font-outfit mb-8 text-white tracking-tight">Recent <span className="text-gradient">Work</span></h2>
              <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-full md:w-fit overflow-x-auto no-scrollbar">
                {['All', 'Data Science', 'Mobile', 'Web'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setActiveFilter(f as any)} 
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div key={activeFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {visibleProjects.map(p => (
              <div key={p.id} className="reveal">
                <ProjectCard project={p} onClick={setSelectedProject} />
              </div>
            ))}
          </div>
          
          {hasMore && (
             <div className="mt-16 flex justify-center">
                <button onClick={() => setIsExpanded(true)} className="w-full sm:w-auto px-12 py-4 rounded-2xl glass border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all active:scale-95 shadow-2xl">Browse More Work</button>
             </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 md:py-40 px-6 max-w-6xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block"></div>
        <div className="reveal text-center mb-20 md:mb-32">
           <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 font-bold uppercase tracking-[0.2em] text-[8px] text-cyan-400">Career History</div>
           <h2 className="text-4xl md:text-6xl font-black font-outfit text-white tracking-tighter">Timeline<span className="text-cyan-500">.</span></h2>
        </div>
        <div className="space-y-12 md:space-y-28 relative">
          {EXPERIENCES.map((exp, idx) => (
            <div key={exp.id} onClick={() => setSelectedExperience(exp)} className={`reveal flex flex-col md:flex-row gap-8 md:gap-16 items-center cursor-pointer group ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="md:w-[45%] flex w-full">
                 <div className="glass p-8 md:p-10 rounded-3xl border-white/5 group-hover:border-cyan-500/20 transition-all group-hover:bg-white/[0.04] w-full shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${exp.isBreak ? 'bg-indigo-500' : 'bg-cyan-500'}`}></div>
                    <span className="text-cyan-400 font-bold text-[9px] uppercase tracking-widest mb-3 block opacity-70">{exp.period}</span>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors leading-tight">{exp.role}</h3>
                    <p className="text-gray-500 font-bold text-[10px] mb-5 uppercase tracking-widest">{exp.company}</p>
                    <p className="text-gray-400 text-sm md:text-base line-clamp-2 leading-relaxed opacity-60 break-words">{exp.description}</p>
                 </div>
              </div>
              <div className="hidden md:flex w-12 h-12 rounded-full glass border-white/10 items-center justify-center relative z-10 bg-[#020617] group-hover:scale-110 group-hover:border-cyan-500/40 transition-all">
                <div className={`w-3 h-3 rounded-full ${exp.isBreak ? 'bg-indigo-500' : 'bg-cyan-500'} shadow-[0_0_10px_rgba(6,182,212,0.5)]`}></div>
              </div>
              <div className="md:w-[45%]"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-40 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="reveal relative max-w-6xl mx-auto">
           <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-violet-500/5 rounded-[3rem] blur-3xl"></div>
           
           <div className="relative glass rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row gap-16 lg:gap-24 overflow-hidden border-white/5 shadow-2xl">
             
             <div className="lg:w-[40%] flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-10 w-fit">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   Project Board Open
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black font-outfit mb-10 leading-[1] text-white tracking-tighter">
                   Let's start a <br/>
                   <span className="text-gradient">conversation.</span>
                </h2>
                
                <div className="space-y-6">
                   <Magnetic strength={0.15}>
                      <div onClick={handleCopyEmail} className="flex items-center gap-5 group cursor-pointer p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all shadow-xl">
                         <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={1.5}/></svg>
                         </div>
                         <div className="min-w-0">
                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Direct Message {copied && <span className="text-emerald-400 ml-2 animate-pulse">(Copied)</span>}</div>
                            <div className="text-sm md:text-lg font-bold text-white font-outfit truncate">kapripankaj@proton.me</div>
                         </div>
                      </div>
                   </Magnetic>

                   <div className="flex gap-4 pt-10 border-t border-white/5">
                      {[
                        { name: 'LinkedIn', url: 'https://linkedin.com/in/pankajkapri', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                        { name: 'GitHub', url: 'https://github.com/pankrulez', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> }
                      ].map((s) => (
                        <Magnetic strength={0.3} key={s.name}>
                          <a 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all hover:bg-indigo-600 hover:text-white shadow-xl"
                            aria-label={s.name}
                          >
                            {s.icon}
                          </a>
                        </Magnetic>
                      ))}
                   </div>
                </div>
             </div>

             <div className="lg:w-[60%] min-h-[420px] flex flex-col justify-center">
                {formStatus === 'success' ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center p-10 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/20 animate-in zoom-in duration-700">
                    <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-3xl font-black font-outfit text-white mb-4 tracking-tighter">Transmission Successful</h3>
                    <p className="text-gray-400 text-sm max-w-xs leading-relaxed opacity-80">Message routed through secure channels. I'll get back to you within 24 standard business hours.</p>
                    <button onClick={() => setFormStatus('idle')} className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 hover:text-white transition-colors">Start New Session</button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className={`space-y-6 transition-opacity duration-300 w-full ${formStatus === 'submitting' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">Identity</label>
                          <input required name="name" type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500/50 outline-none text-white transition-all text-sm font-medium placeholder:text-gray-700" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">Endpoint</label>
                          <input required name="email" type="email" placeholder="example@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500/50 outline-none text-white transition-all text-sm font-medium placeholder:text-gray-700" />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">Message Payload</label>
                       <textarea required name="message" placeholder="Describe your inquiry..." rows={6} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500/50 outline-none text-white resize-none transition-all text-sm font-medium placeholder:text-gray-700"></textarea>
                    </div>
                    
                    <div className="pt-4">
                       <button 
                         type="submit" 
                         disabled={formStatus === 'submitting'} 
                         className={`w-full py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-4 group/btn relative overflow-hidden shadow-2xl ${
                           formStatus === 'error' ? 'bg-rose-600' : 'bg-indigo-600 hover:bg-white hover:text-gray-950'
                         }`}
                       >
                         <span className="relative z-10 flex items-center gap-3">
                           {formStatus === 'submitting' ? (
                             <>
                               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                               <span>Encrypting...</span>
                             </>
                           ) : formStatus === 'error' ? (
                             <span>Retry Submission</span>
                           ) : (
                             <>
                               <span>Initialize Contact</span>
                               <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2.5}/></svg>
                             </>
                           )}
                         </span>
                         <div className="shimmer-overlay opacity-20"></div>
                       </button>
                    </div>
                  </form>
                )}
             </div>
           </div>
        </div>
      </section>

      <footer className="py-20 md:py-32 text-center border-t border-white/5 bg-black/40 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-6">
           <div className="text-2xl md:text-3xl font-black mb-6 font-outfit tracking-tighter opacity-90 uppercase">Pankaj Kapri</div>
           <p className="text-gray-600 text-[9px] max-w-sm md:max-w-xl mx-auto leading-loose opacity-50 uppercase tracking-[0.4em] px-4 font-bold">
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
