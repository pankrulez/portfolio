
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize with opaque canvas if possible
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      'rgba(16, 185, 129, ', // Emerald
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(99, 102, 241, ', // Indigo
      'rgba(139, 92, 246, '  // Violet
    ];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      density: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobileRef.current ? 1 : 2) + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        const alpha = Math.random() * 0.3 + 0.1;
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        this.color = `${colorBase}${alpha})`;
        this.density = (Math.random() * 30) + 1;
      }

      update(width: number, height: number, mouseX: number, mouseY: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Skip heavy mouse math on mobile
        if (!isMobileRef.current && mouseX > -500) {
          let dx = mouseX - this.x;
          let dy = mouseY - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let maxDistance = 200;

          if (distance < maxDistance) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density * 0.3;
            let directionY = forceDirectionY * force * this.density * 0.3;
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      
      // Drastically reduce particle count for mobile performance
      const baseCount = isMobileRef.current ? 50 : 250;
      const particleCount = Math.min(baseCount, Math.floor((canvas.width * canvas.height) / 8000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      // Use fillRect instead of clearRect for potentially better performance on some GPUs
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      const wasMobile = isMobileRef.current;
      isMobileRef.current = window.innerWidth < 768;
      if (wasMobile !== isMobileRef.current) init();
      else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (!isMobileRef.current) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ imageRendering: 'auto' }}
      />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </>
  );
};

export default Background;
