import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradient blob class
    class Blob {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;

      constructor(color: string) {
        this.x = Math.random() * (canvas?.width || 1920);
        this.y = Math.random() * (canvas?.height || 1080);
        this.radius = Math.random() * 300 + 200;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.color = color;
      }

      update() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < -this.radius || this.x > canvas.width + this.radius) {
          this.vx *= -1;
        }
        if (this.y < -this.radius || this.y > canvas.height + this.radius) {
          this.vy *= -1;
        }
      }

      draw() {
        if (!ctx || !canvas) return;
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Create blobs with theme colors
    const blobs = [
      new Blob('rgba(155, 32, 100, 0.15)'), // Primary pink
      new Blob('rgba(178, 74, 131, 0.12)'), // Primary border
      new Blob('rgba(33, 35, 57, 0.2)'),    // Panel border
      new Blob('rgba(44, 47, 74, 0.18)'),   // Panel border lighter
    ];

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear with background color
      ctx.fillStyle = 'rgba(17, 19, 33, 1)'; // --bg color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach((blob) => {
        blob.update();
        blob.draw();
      });
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

