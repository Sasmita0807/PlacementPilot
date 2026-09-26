import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

interface AnimatedBackgroundProps {
  intensity?: 'high' | 'medium' | 'subtle';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particlesEnabled, setParticlesEnabled] = useState(true);

  useEffect(() => {
    if (!particlesEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 35 : 75;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      glowColor: string;
      alpha: number;
      alphaSpeed: number;
    }

    const colors = [
      { fill: 'rgba(6, 182, 212, ', glow: 'rgba(6, 182, 212, 0.4)' },    // Cyan
      { fill: 'rgba(168, 85, 247, ', glow: 'rgba(168, 85, 247, 0.4)' },  // Purple
      { fill: 'rgba(99, 102, 241, ', glow: 'rgba(99, 102, 241, 0.4)' },   // Indigo
      { fill: 'rgba(56, 189, 248, ', glow: 'rgba(56, 189, 248, 0.4)' },   // Sky
    ];

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 0.8,
        color: colorScheme.fill,
        glowColor: colorScheme.glow,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const maxDistance = isMobile ? 80 : 125;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connective links
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const linkAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${linkAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw moving neon particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Pulse alpha
        p.alpha += p.alphaSpeed;
        if (p.alpha <= 0.15 || p.alpha >= 0.85) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particlesEnabled]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Space Base Navy/Purple Radial Gradients */}
      <div className="absolute inset-0 bg-[#060814]" />
      <div className="absolute inset-0 bg-radial-[at_top_right] from-[#18113a] via-[#090b1e] to-[#04060e] opacity-90" />
      <div className="absolute inset-0 bg-radial-[at_bottom_left] from-[#111936] via-transparent to-transparent opacity-80" />

      {/* 2. Floating Glowing Giant Ambient Orbs with CSS Keyframe Physics */}
      {/* Orb 1: Cyan / Neon Blue */}
      <div
        className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-sky-600/15 to-transparent blur-[120px] animate-orbFloat1"
      />

      {/* Orb 2: Electric Purple / Magenta */}
      <div
        className="absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-purple-600/25 via-indigo-600/15 to-transparent blur-[130px] animate-orbFloat2"
      />

      {/* Orb 3: Deep Indigo / Violet (Center Bottom) */}
      <div
        className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-indigo-700/25 via-blue-600/15 to-transparent blur-[140px] animate-orbFloat3"
      />

      {/* 3. Animated Cyber Grid Lines */}
      <div className="absolute inset-0 cyber-grid animate-gridScroll opacity-40 mix-blend-screen" />

      {/* 4. Flowing Light Beam / Cosmic Aurora sweeping diagonally */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="w-[200%] h-48 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent blur-2xl transform -rotate-12 animate-lightBeam" />
      </div>

      {/* 5. Live HTML5 Canvas for Neon Floating Particles & Synapse Links */}
      {particlesEnabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      )}

      {/* 6. Subtle Vignette & Scanline Overlay */}
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-black/20 to-black/60 pointer-events-none" />
    </div>
  );
};
