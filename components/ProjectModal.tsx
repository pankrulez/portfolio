
import React, { useEffect, useState } from 'react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (project) {
      setActiveProject(project);
      setIsAnimatingOut(false);
      // Modern scroll lock: just hide overflow. 
      // scrollbar-gutter: stable in index.html prevents layout shift.
      document.body.style.overflow = 'hidden';
    } else if (activeProject) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setActiveProject(null);
        setIsAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [project, activeProject]);

  if (!activeProject) return null;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onClose();
  };

  const hasValidLink = activeProject.link && activeProject.link !== '#' && activeProject.link !== '';
  const hasValidGithub = activeProject.github && activeProject.github !== '#' && activeProject.github !== '';
  const allTags = [...activeProject.tags, ...(activeProject.moreTags || [])];

  const getTagTheme = () => {
    switch (activeProject.category) {
      case 'Data Science': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', accent: 'emerald' };
      case 'Web': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', accent: 'cyan' };
      case 'Mobile': return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', accent: 'violet' };
      default: return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', accent: 'indigo' };
    }
  };

  const theme = getTagTheme();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-6 pointer-events-auto overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gray-950/98 md:bg-gray-950/90 md:backdrop-blur-xl ${isAnimatingOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onClick={() => handleClose()}
      />
      
      <div className={`relative w-full md:max-w-6xl bg-[#0a0f1d] glass border-0 md:border md:border-white/10 rounded-none md:rounded-3xl overflow-hidden flex flex-col md:flex-row h-full md:h-[90vh] md:max-h-[850px] ${isAnimatingOut ? 'translate-y-full opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'} transition-all duration-300 ease-out`}>
        
        <button 
          onClick={() => handleClose()}
          className="absolute top-4 right-4 z-[60] md:hidden w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-[35%] relative h-56 md:h-full overflow-hidden shrink-0">
          <img 
            src={activeProject.image} 
            alt={activeProject.title} 
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeProject.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${theme.bg} ${theme.text} border ${theme.border} rounded-md`}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-4xl font-black font-outfit text-white leading-tight tracking-tighter">
              {activeProject.title}
            </h2>
            <div className={`mt-6 h-1 w-20 bg-${theme.accent}-500 rounded-full`}></div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar flex flex-col bg-white/[0.01]">
          <button onClick={() => handleClose()} className="hidden md:block absolute top-10 right-10 text-gray-500 hover:text-white transition-all">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="space-y-12 max-w-2xl pb-8">
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">Core Thesis</h4>
              <p className="text-base md:text-xl text-gray-200 font-medium leading-relaxed font-outfit">
                {activeProject.longDescription || activeProject.description}
              </p>
            </section>

            {activeProject.keyFeatures && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Key Architecture & Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeProject.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                       <div className={`w-10 h-10 rounded-xl bg-${theme.accent}-500/10 flex items-center justify-center shrink-0 text-${theme.accent}-400`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
                       </div>
                       <span className="text-sm text-gray-300 font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {activeProject.technicalChallenges && (
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-4">The Challenge</h4>
                  <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      {activeProject.technicalChallenges}
                    </p>
                  </div>
                </section>
              )}

              {activeProject.outcome && (
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">The Result</h4>
                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-sm text-emerald-400 font-bold leading-relaxed">
                      {activeProject.outcome}
                    </p>
                  </div>
                </section>
              )}
            </div>

            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-5">Full Technical Stack</h4>
              <div className="flex flex-wrap gap-2.5">
                {allTags.map((tag, idx) => {
                  const colors = [
                    'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                    'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
                    'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
                    'border-violet-500/30 text-violet-400 bg-violet-500/5',
                    'border-amber-500/30 text-amber-400 bg-amber-500/5'
                  ];
                  return (
                    <span key={tag} className={`px-3.5 py-1.5 rounded-xl border text-[10px] font-bold ${colors[idx % colors.length]}`}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            </section>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              {hasValidLink && (
                <a href={activeProject.link} target="_blank" className="flex-1 text-center py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-950 transition-all shadow-xl">
                  Launch Deployment
                </a>
              )}
              {hasValidGithub && (
                <a href={activeProject.github} target="_blank" className="flex-1 text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                  Repository Audit
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
