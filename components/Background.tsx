
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let lastTime = 0;
    
    const fps = isMobileRef.current ? 15 : 60; 
    const fpsInterval = 1000 / fps;
    const scaleFactor = isMobileRef.current ? 0.4 : 1;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = (Math.random() * (isMobileRef.current ? 0.3 : 1.0) + 0.1) * scaleFactor;
        this.speedX = (Math.random() * 0.08 - 0.04) * scaleFactor;
        this.speedY = (Math.random() * 0.08 - 0.04) * scaleFactor;
        const colors = ['rgba(16, 185, 129, 0.06)', 'rgba(6, 182, 212, 0.06)', 'rgba(99, 102, 241, 0.06)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(width: number, height: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width) this.x = 0; else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0; else if (this.y < 0) this.y = height;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const init = () => {
      const w = Math.floor(window.innerWidth * scaleFactor);
      const h = Math.floor(window.innerHeight * scaleFactor);
      canvas.width = w;
      canvas.height = h;
      particles = [];
      const particleCount = isMobileRef.current ? 12 : 80;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(w, h));
      }
    };

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw(ctx);
      }
    };

    init();
    animationFrameId = requestAnimationFrame(animate);

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
        init();
      }, 500);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          width: '100vw', 
          // Fix: removed duplicate height property that caused TypeScript error
          height: 'calc(var(--vh, 1vh) * 100)',
          imageRendering: isMobileRef.current ? 'auto' : 'pixelated' 
        }} 
      />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.01] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </>
  );
};

export default Background;
