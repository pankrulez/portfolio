
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Project } from '../types';
import { generateProjectImage } from '../services/imageService';

interface Props {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayImage, setDisplayImage] = useState(project.image);
  const [isAiImageLoading, setIsAiImageLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Optimization: Only use AI generation for specific projects
  useEffect(() => {
    if (isInView && (project.id === 'adw' || project.id === 'legal-eagle')) {
      setIsAiImageLoading(true);
      generateProjectImage(project.id).then(aiImage => {
        if (aiImage) {
          setDisplayImage(aiImage);
        }
        setIsAiImageLoading(false);
      });
    }
  }, [isInView, project.id]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(project);
    }
  };

  const theme = useMemo(() => {
    switch (project.category) {
      case 'Data Science': return { 
        bg: 'bg-emerald-500/20', 
        text: 'text-emerald-400', 
        border: 'border-emerald-500/40', 
        tagBorder: 'border-emerald-500/50',
        gradient: 'from-emerald-500/20 to-indigo-500/10'
      };
      case 'Web': return { 
        bg: 'bg-cyan-500/20', 
        text: 'text-cyan-400', 
        border: 'border-cyan-500/40', 
        tagBorder: 'border-cyan-500/50',
        gradient: 'from-cyan-500/20 to-blue-500/10'
      };
      case 'Mobile': return { 
        bg: 'bg-violet-500/20', 
        text: 'text-violet-400', 
        border: 'border-violet-500/40', 
        tagBorder: 'border-violet-500/50',
        gradient: 'from-violet-500/20 to-rose-500/10'
      };
      default: return { 
        bg: 'bg-indigo-500/20', 
        text: 'text-indigo-400', 
        border: 'border-indigo-500/40', 
        tagBorder: 'border-indigo-500/50',
        gradient: 'from-indigo-500/20 to-purple-500/10'
      };
    }
  }, [project.category]);

  const isPriority = project.id === 'finsight';

  return (
    <div 
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`View case study: ${project.title}`}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      style={{
        transform: !isMobile && rotate.x !== 0 ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` : 'none',
        transition: rotate.x === 0 ? 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
      }}
      className="group relative glass rounded-[2rem] overflow-hidden flex flex-col h-full cursor-pointer border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="scan-line"></div>
      
      <div className={`relative h-48 md:h-60 overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-full h-full shimmer-overlay opacity-50"></div>
            {(isAiImageLoading || isPriority) && !isLoaded && (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <span className="text-[7px] font-black uppercase tracking-widest text-indigo-400/50">Initialising...</span>
               </div>
            )}
          </div>
        )}
        
        <img 
          src={displayImage} 
          alt="" 
          aria-hidden="true"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 image-blur-up ${isLoaded ? 'loaded opacity-100' : 'opacity-0'}`}
          loading={isPriority ? "eager" : "lazy"}
          decoding={isPriority ? "sync" : "async"}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>
        <div className="absolute top-5 left-5">
          <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest backdrop-blur-xl rounded-lg border ${theme.bg} ${theme.text} ${theme.border} shadow-lg shadow-black/20`}>
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-1 relative">
        {/* Swipable Tag Container */}
        <div 
          className="mb-4 flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar mask-gradient-x pb-1"
          aria-label="Technologies used in this project"
        >
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              aria-label={`Built with ${tag}`}
              title={tag}
              className={`flex-none px-2.5 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-md ${theme.bg} border ${theme.tagBorder} ${theme.text} backdrop-blur-md group-hover:brightness-125 transition-all shadow-sm whitespace-nowrap`}
            >
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
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-gray-950 transition-all" aria-hidden="true">
               <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
