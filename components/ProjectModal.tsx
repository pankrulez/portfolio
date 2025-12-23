
import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { summarizeText } from '../services/geminiService';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (project) {
      setActiveProject(project);
      setIsAnimatingOut(false);
      setSummary(null);
      document.body.style.overflow = 'hidden';
    } else if (activeProject) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setActiveProject(null);
        setIsAnimatingOut(false);
        setSummary(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [project, activeProject]);

  if (!activeProject) return null;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onClose();
  };

  const handleSummarize = async () => {
    if (!activeProject.longDescription || isSummarizing) return;
    setIsSummarizing(true);
    const result = await summarizeText(activeProject.longDescription);
    setSummary(result);
    setIsSummarizing(false);
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-6 pointer-events-auto overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gray-950/98 md:bg-gray-950/90 md:backdrop-blur-xl ${isAnimatingOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onClick={() => handleClose()}
      />
      
      <div className={`relative w-full h-full sm:h-auto sm:max-h-[90vh] md:max-w-6xl bg-[#0a0f1d] glass border-0 md:border md:border-white/10 rounded-none sm:rounded-3xl overflow-hidden flex flex-col md:flex-row ${isAnimatingOut ? 'translate-y-full opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'} transition-all duration-400 ease-out`}>
        
        {/* Unified Close Button for Desktop (Fixed in Modal) */}
        <button 
          onClick={() => handleClose()}
          className="hidden md:flex absolute top-8 right-8 z-[70] w-12 h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => handleClose()}
          className="absolute top-4 right-4 z-[70] w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white md:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-[35%] relative h-48 sm:h-64 md:h-full overflow-hidden shrink-0">
          <img 
            src={activeProject.image} 
            alt={activeProject.title} 
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
            <div className="flex flex-wrap gap-1.5 mb-2 md:mb-4">
              {activeProject.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`px-2 py-0.5 text-[7px] md:text-[8px] font-black uppercase tracking-widest ${theme.bg} ${theme.text} border ${theme.border} rounded-md`}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl md:text-4xl font-black font-outfit text-white leading-tight tracking-tighter">
              {activeProject.title}
            </h2>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-14 overflow-y-auto custom-scrollbar flex flex-col bg-white/[0.01]">
          <div className="space-y-8 md:space-y-12 max-w-2xl pb-8">
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 md:pr-14">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500">Core Thesis</h4>
                <div className="flex gap-2 flex-wrap">
                  {activeProject.longDescription && (
                    <button 
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isSummarizing ? 'Summarizing...' : 'Summarize AI'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm md:text-xl text-gray-200 font-medium leading-relaxed font-outfit">
                  {activeProject.longDescription || activeProject.description}
                </p>
                
                {summary && (
                  <div className="p-4 rounded-xl bg-indigo-600/5 border border-indigo-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">AI Insight</div>
                    <p className="text-xs md:text-sm text-indigo-100 font-bold leading-relaxed">{summary}</p>
                  </div>
                )}
              </div>
            </section>

            {activeProject.keyFeatures && (
              <section>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Features & Logic</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {activeProject.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                       <div className={`w-8 h-8 rounded-xl bg-${theme.accent}-500/10 flex items-center justify-center shrink-0 text-${theme.accent}-400`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
                       </div>
                       <span className="text-xs text-gray-300 font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {activeProject.technicalChallenges && (
                <section>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500 mb-4">Challenge</h4>
                  <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      {activeProject.technicalChallenges}
                    </p>
                  </div>
                </section>
              )}

              {activeProject.outcome && (
                <section>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Outcome</h4>
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 font-bold leading-relaxed">
                      {activeProject.outcome}
                    </p>
                  </div>
                </section>
              )}
            </div>

            <section>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-5">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, idx) => {
                  const colors = [
                    'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                    'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
                    'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
                    'border-violet-500/30 text-violet-400 bg-violet-500/5'
                  ];
                  return (
                    <span key={tag} className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold ${colors[idx % colors.length]}`}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            </section>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {hasValidLink && (
                <a href={activeProject.link} target="_blank" className="flex-1 text-center py-4 rounded-xl bg-indigo-600 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-950 transition-all shadow-xl">
                  Launch Deployment
                </a>
              )}
              {hasValidGithub && (
                <a href={activeProject.github} target="_blank" className="flex-1 text-center py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
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
