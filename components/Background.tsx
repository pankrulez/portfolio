
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let lastTime = 0;
    
    const fps = isMobileRef.current ? 15 : 45; 
    const fpsInterval = 1000 / fps;
    const scaleFactor = isMobileRef.current ? 0.4 : 1;
    const connectionDistance = isMobileRef.current ? 50 : 120;

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
        this.size = (Math.random() * (isMobileRef.current ? 0.3 : 1.2) + 0.2) * scaleFactor;
        this.speedX = (Math.random() * 0.4 - 0.2) * scaleFactor;
        this.speedY = (Math.random() * 0.4 - 0.2) * scaleFactor;
        const colors = ['rgba(16, 185, 129, 0.15)', 'rgba(6, 182, 212, 0.15)', 'rgba(99, 102, 241, 0.15)'];
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
      const particleCount = isMobileRef.current ? 20 : 70;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(w, h));
      }
    };

    const drawConnections = () => {
      ctx.lineWidth = 0.5 * scaleFactor;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.1;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawConnections();
      
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw(ctx);
      }
    };

    init();
    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
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
          height: 'calc(var(--vh, 1vh) * 100)',
          imageRendering: 'auto'
        }} 
      />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </>
  );
};

export default Background;
