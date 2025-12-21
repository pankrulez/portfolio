
import React, { useRef, useState } from 'react';
import { Project } from '../types';

interface Props {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768 || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const getThemeColors = () => {
    switch (project.category) {
      case 'Data Science': return {
        bg: 'bg-emerald-600/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        shadow: 'rgba(16, 185, 129, 0.3)',
        btn: 'bg-emerald-600'
      };
      case 'Web': return {
        bg: 'bg-cyan-600/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        shadow: 'rgba(6, 182, 212, 0.3)',
        btn: 'bg-cyan-600'
      };
      case 'Mobile': return {
        bg: 'bg-violet-600/20',
        text: 'text-violet-400',
        border: 'border-violet-500/30',
        shadow: 'rgba(139, 92, 246, 0.3)',
        btn: 'bg-violet-600'
      };
      default: return {
        bg: 'bg-indigo-600/20',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        shadow: 'rgba(99, 102, 241, 0.3)',
        btn: 'bg-indigo-600'
      };
    }
  };

  const theme = getThemeColors();

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      style={{
        transform: rotate.x !== 0 ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` : 'none',
        transition: rotate.x === 0 ? 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
        boxShadow: rotate.x !== 0 ? `0 40px 100px -25px ${theme.shadow}` : 'none'
      }}
      className="group relative glass rounded-[1.2rem] md:rounded-[1.8rem] overflow-hidden flex flex-col h-full cursor-pointer transition-shadow duration-700 border-white/5 hover:border-white/10"
    >
      {/* Visual Header */}
      <div className="relative h-44 md:h-56 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>
        
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-0.5 md:px-3 md:py-1 text-[7px] md:text-[8px] font-black uppercase tracking-widest backdrop-blur-2xl rounded-md md:rounded-lg border shadow-xl transition-all duration-500 ${theme.bg} ${theme.text} ${theme.border}`}>
            {project.category}
          </span>
        </div>
      </div>
      
      {/* Project Body - Removed negative margin on mobile to prevent overlap */}
      <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 md:-mt-8 bg-transparent">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[6px] md:text-[7px] font-bold uppercase tracking-wider rounded bg-white/5 border border-white/5 text-gray-500 group-hover:text-white transition-all">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-base md:text-xl font-black mb-3 font-outfit text-white transition-all leading-tight tracking-tight">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-[11px] md:text-sm mb-5 leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${theme.text}`}>
            VIEW CASE
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-gray-950 transition-all shadow-sm">
               <svg className="w-3 md:w-3.5 h-3 md:h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
