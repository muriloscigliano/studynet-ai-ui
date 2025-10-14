import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create smooth gradient mesh
    const animate = () => {
      if (!canvas || !ctx) return;
      
      time += 0.003; // Very slow time increment for subtle movement

      const width = canvas.width;
      const height = canvas.height;

      // Create a beautiful gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#111321');
      gradient.addColorStop(1, '#0f1120');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw multiple gradient circles with smooth movement
      const circles = [
        {
          x: width * 0.2 + Math.sin(time * 0.5) * 100,
          y: height * 0.3 + Math.cos(time * 0.3) * 80,
          radius: 400,
          color1: 'rgba(155, 32, 100, 0.08)',
          color2: 'rgba(155, 32, 100, 0)',
        },
        {
          x: width * 0.8 + Math.sin(time * 0.4) * 120,
          y: height * 0.6 + Math.cos(time * 0.6) * 90,
          radius: 450,
          color1: 'rgba(178, 74, 131, 0.06)',
          color2: 'rgba(178, 74, 131, 0)',
        },
        {
          x: width * 0.5 + Math.sin(time * 0.6) * 80,
          y: height * 0.7 + Math.cos(time * 0.4) * 100,
          radius: 380,
          color1: 'rgba(44, 47, 74, 0.12)',
          color2: 'rgba(44, 47, 74, 0)',
        },
        {
          x: width * 0.7 + Math.sin(time * 0.35) * 90,
          y: height * 0.2 + Math.cos(time * 0.5) * 70,
          radius: 350,
          color1: 'rgba(33, 35, 57, 0.15)',
          color2: 'rgba(33, 35, 57, 0)',
        },
      ];

      // Enable smooth blending
      ctx.globalCompositeOperation = 'screen';

      circles.forEach((circle) => {
        const radialGradient = ctx.createRadialGradient(
          circle.x,
          circle.y,
          0,
          circle.x,
          circle.y,
          circle.radius
        );
        radialGradient.addColorStop(0, circle.color1);
        radialGradient.addColorStop(0.5, circle.color2);
        radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, width, height);
      });

      // Add subtle noise/grain texture overlay
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillRect(x, y, 1, 1);
      }

      ctx.globalCompositeOperation = 'source-over';

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

