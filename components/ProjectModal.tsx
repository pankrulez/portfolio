
import React, { useEffect, useState } from 'react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) {
      setActiveProject(project);
      setIsAnimatingOut(false);
      setIsShareMenuOpen(false);
      setCopied(false);
      document.body.style.overflow = 'hidden';
    } else if (activeProject) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setActiveProject(null);
        document.body.style.overflow = 'auto';
        setIsAnimatingOut(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [project, activeProject]);

  if (!activeProject) return null;

  const handleClose = () => {
    onClose();
  };

  const handleMoreProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    handleClose();
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  };

  const hasValidLink = activeProject.link && activeProject.link !== '#' && activeProject.link !== '';
  const hasValidGithub = activeProject.github && activeProject.github !== '#' && activeProject.github !== '';
  const allTags = [...activeProject.tags, ...(activeProject.moreTags || [])];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 pointer-events-auto overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-950/95 md:bg-gray-950/90 backdrop-blur-xl md:cursor-none ${isAnimatingOut ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className={`relative w-full md:max-w-5xl bg-[#0a0f1d] glass border-0 md:border md:border-white/10 rounded-none md:rounded-[24px] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col md:flex-row h-full md:h-[85vh] md:max-h-[750px] ${isAnimatingOut ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
        
        {/* Close Button Mobile */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-[60] md:hidden w-9 h-9 rounded-full bg-black/50 backdrop-blur-lg flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Project Imagery & Dynamic Tags */}
        <div className="md:w-[40%] relative h-56 md:h-full overflow-hidden shrink-0 group/img">
          <img 
            src={activeProject.image} 
            alt={activeProject.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 opacity-70 md:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/40 to-transparent"></div>
          
          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-8 right-6 md:right-8">
            <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4 max-h-16 md:max-h-20 overflow-hidden">
              {activeProject.tags.map((tag, idx) => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-outfit text-white leading-tight mb-3">
              {activeProject.title}
            </h2>
            <div className="w-10 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Right: Detailed Case Study Content */}
        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto flex flex-col custom-scrollbar relative bg-white/[0.01]">
          {/* Close Button Desktop */}
          <button 
            onClick={handleClose}
            className="hidden md:flex absolute top-8 right-8 text-gray-500 hover:text-white transition-all hover:rotate-90 hover:scale-110 duration-500 ease-out z-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-8 md:space-y-10 max-w-2xl pb-6">
            <section className="animate-slide-in-bottom-subtle">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3 md:mb-4">The Concept</h4>
              <p className="text-sm md:text-lg text-gray-200 font-medium font-outfit leading-relaxed">
                {activeProject.description}
              </p>
            </section>

            <section className="animate-slide-in-bottom-subtle" style={{ animationDelay: '150ms' }}>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3 md:mb-4">Technical Deep-Dive</h4>
              <p className="text-gray-400 leading-relaxed text-xs md:text-base">
                {activeProject.longDescription || "A robust end-to-end solution developed focusing on scalability, reliability, and user-centric architecture."}
              </p>
            </section>

            <section className="animate-slide-in-bottom-subtle" style={{ animationDelay: '250ms' }}>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">Core Stack</h4>
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {allTags.map((tag) => (
                  <div 
                    key={tag} 
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2.5 hover:bg-white/10 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-300">{tag}</span>
                  </div>
                ))}
              </div>
            </section>

            {activeProject.outcome && (
              <section className="animate-fade-in" style={{ animationDelay: '600ms' }}>
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3 md:mb-4">The Outcome</h4>
                <div className="p-5 md:p-8 rounded-xl bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 group">
                  <p className="text-sm md:text-lg font-bold font-outfit text-white leading-relaxed">
                    "{activeProject.outcome}"
                  </p>
                </div>
              </section>
            )}

            <div className="pt-4 md:pt-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {hasValidLink && (
                  <a 
                    href={activeProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/btn relative px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/20 active:scale-95"
                  >
                    Launch Demo
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2}/></svg>
                  </a>
                )}
                {hasValidGithub && (
                  <a 
                    href={activeProject.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all flex items-center justify-center gap-2.5"
                  >
                    Codebase
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
              </div>

              <div className="pt-6 border-t border-white/5">
                <button 
                  onClick={handleMoreProjects}
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-indigo-400 font-black tracking-[0.2em] uppercase text-[9px] md:text-xs hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all flex items-center justify-center gap-3 group/more"
                >
                  Explore Others
                  <svg className="w-4 h-4 transition-transform group-hover/more:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2}/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
