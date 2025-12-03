import React, { useEffect, useRef } from 'react';

interface Particle {
 x: number;
 y: number;
 vx: number;
 vy: number;
 size: number;
 color: string;
}

const ParticleBackground = () => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const particlesRef = useRef<Particle[]>([]);
 const animationRef = useRef<number>();

 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create particles
  const particleCount = 50;
  const particles: Particle[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  for (let i = 0; i < particleCount; i++) {
   particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 3 + 1,
    color: colors[Math.floor(Math.random() * colors.length)]
   });
  }

  particlesRef.current = particles;

  const animate = () => {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   particlesRef.current.forEach((particle) => {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off walls
    if (particle.x < 0 || particle.x > canvas.width) {
     particle.vx = -particle.vx;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
     particle.vy = -particle.vy;
    }

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
   });

   // Draw connections
   particlesRef.current.forEach((particle, i) => {
    particlesRef.current.slice(i + 1).forEach((otherParticle) => {
     const distance = Math.sqrt(
      Math.pow(particle.x - otherParticle.x, 2) +
      Math.pow(particle.y - otherParticle.y, 2)
     );

     if (distance < 150) {
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(otherParticle.x, otherParticle.y);
      ctx.strokeStyle = particle.color;
      ctx.globalAlpha = 0.2 * (1 - distance / 150);
      ctx.stroke();
      ctx.globalAlpha = 1;
     }
    });
   });

   animationRef.current = requestAnimationFrame(animate);
  };

  animate();

  return () => {
   window.removeEventListener('resize', resizeCanvas);
   if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
   }
  };
 }, []);

 return (
  <canvas
   ref={canvasRef}
   className="fixed inset-0 pointer-events-none z-0"
   style={{ opacity: 0.3 }}
  />
 );
};

export default ParticleBackground;
