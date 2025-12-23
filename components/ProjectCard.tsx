
import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../types';

interface Props {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const getThemeColors = () => {
    switch (project.category) {
      case 'Data Science': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
      case 'Web': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' };
      case 'Mobile': return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' };
      default: return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' };
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
        transform: !isMobile && rotate.x !== 0 ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` : 'none',
        transition: rotate.x === 0 ? 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
      }}
      className="group relative glass rounded-[2rem] overflow-hidden flex flex-col h-full cursor-pointer border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
    >
      <div className="relative h-48 md:h-60 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        <div className="absolute top-5 left-5">
          <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest backdrop-blur-xl rounded-lg border ${theme.bg} ${theme.text} ${theme.border}`}>
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest rounded bg-white/5 border border-white/5 text-gray-500 group-hover:text-gray-300 transition-all">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl md:text-2xl font-black mb-3 font-outfit text-white group-hover:text-indigo-400 transition-colors leading-tight tracking-tight">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-1 opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 ${theme.text}`}>
            EXPLORE CASE
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-gray-950 transition-all">
               <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
