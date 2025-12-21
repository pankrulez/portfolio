
import React, { useEffect, useState } from 'react';
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
      document.body.style.overflow = 'hidden';
    } else if (activeExp) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setActiveExp(null);
        document.body.style.overflow = 'auto';
        setIsAnimatingOut(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [experience, activeExp]);

  if (!activeExp) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8 pointer-events-auto">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-950/90 backdrop-blur-xl cursor-none ${isAnimatingOut ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-3xl bg-[#0a0f1d] glass border border-white/10 rounded-[20px] md:rounded-[32px] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col h-fit max-h-[85vh] ${isAnimatingOut ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
        
        {/* Header Section */}
        <div className="p-6 md:p-10 border-b border-white/5 relative">
          <button 
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-white transition-all hover:rotate-90 duration-500 ease-out"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${activeExp.isBreak ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'}`}>
                {activeExp.period}
              </span>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">•</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{activeExp.location}</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-black font-outfit text-white leading-tight">
              {activeExp.role}
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-indigo-500 rounded-full"></div>
              <h3 className="text-lg md:text-xl font-bold text-indigo-400 font-outfit">{activeExp.company}</h3>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white/[0.01]">
          <div className="space-y-8">
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-3">Detailed Mandate</h4>
              <p className="text-base md:text-lg text-gray-200 font-medium font-outfit leading-relaxed">
                {activeExp.longDescription || activeExp.description}
              </p>
            </section>

            {activeExp.achievements && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">Key Contributions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeExp.achievements.map((item, idx) => (
                    <div key={idx} className="flex gap-3.5 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeExp.skills && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {activeExp.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 text-[9px] md:text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-white/5">
            <button 
              onClick={handleClose}
              className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-black tracking-widest uppercase text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2.5"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;
