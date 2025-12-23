
import React, { useEffect, useState } from 'react';
import { EXPERIENCES } from '../constants';
import { Experience } from '../types';

interface ExperienceModalProps {
  experience: Experience | null;
  onClose: () => void;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ experience, onClose }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [activeExp, setActiveExp] = useState<Experience | null>(null);

  useEffect(() => {
    if (experience) {
      setActiveExp(experience);
      setIsAnimatingOut(false);
      // Modern scroll lock: just hide overflow. 
      // scrollbar-gutter: stable in index.html prevents layout shift.
      document.body.style.overflow = 'hidden';
    } else if (activeExp) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setActiveExp(null);
        setIsAnimatingOut(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [experience, activeExp]);

  if (!activeExp) return null;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onClose();
  };

  const isLatest = activeExp.id === EXPERIENCES[0].id;
  const textThemeClass = isLatest ? 'text-emerald-400' : 'text-indigo-400';
  const bgThemeClass = isLatest ? 'bg-emerald-500/20' : 'bg-indigo-600/20';
  const borderThemeClass = isLatest ? 'border-emerald-500/30' : 'border-indigo-500/30';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-8 pointer-events-auto">
      <div 
        className={`absolute inset-0 bg-gray-950/95 md:backdrop-blur-2xl ${isAnimatingOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onClick={() => handleClose()}
      />
      
      <div className={`relative w-full max-w-4xl bg-[#0a0f1d] glass border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-fit max-h-[85vh] ${isAnimatingOut ? 'scale-95 opacity-0 translate-y-8' : 'scale-100 opacity-100 translate-y-0'} transition-all duration-500 ease-out`}>
        
        <div className="p-8 md:p-14 border-b border-white/5 relative bg-white/[0.01]">
          <button 
            onClick={() => handleClose()}
            className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all hover:rotate-90 duration-500"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full ${bgThemeClass} ${textThemeClass} border ${borderThemeClass}`}>
                {activeExp.period}
              </span>
              <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">•</span>
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{activeExp.location}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black font-outfit text-white leading-none tracking-tighter">
              {activeExp.role}
            </h2>
            
            <div className="flex items-center gap-4">
              <div className={`w-12 h-1.5 ${isLatest ? 'bg-emerald-500' : 'bg-indigo-500'} rounded-full`}></div>
              <h3 className={`text-xl md:text-2xl font-black ${textThemeClass} font-outfit uppercase tracking-tight`}>{activeExp.company}</h3>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 overflow-y-auto custom-scrollbar bg-black/20">
          <div className="space-y-12 max-w-3xl">
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-5">Professional Context</h4>
              <p className="text-lg md:text-2xl text-gray-200 font-medium font-outfit leading-snug tracking-tight">
                {activeExp.longDescription || activeExp.description}
              </p>
            </section>

            {activeExp.achievements && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Strategic Milestones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeExp.achievements.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item">
                      <div className={`w-8 h-8 rounded-lg ${bgThemeClass} flex items-center justify-center shrink-0 ${textThemeClass} group-hover/item:scale-110 transition-transform`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeExp.skills && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-5">Deployed Expertise</h4>
                <div className="flex flex-wrap gap-2.5">
                  {activeExp.skills.map((skill, idx) => {
                    const colors = [
                      'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
                      'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
                      'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                      'border-violet-500/30 text-violet-400 bg-violet-500/5'
                    ];
                    return (
                      <span key={skill} className={`px-4 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest border rounded-xl ${colors[idx % colors.length]}`}>
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="mt-14 pt-8 border-t border-white/5 flex justify-center">
            <button 
              onClick={() => handleClose()}
              className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black tracking-[0.3em] uppercase text-[10px] hover:text-white hover:bg-white/10 transition-all"
            >
              Conclude Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;
