import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function LoginAnimations() {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Animate pill badge
      const pill = document.querySelector('.login-page-pill');
      if (pill) {
        gsap.set(pill, { scale: 0.8, y: -20 });
        tl.to(pill, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.5)',
        });
      }

      // Title animates via AnimatedText component (with blur)
      // Just need to account for it in timeline

      // Animate form card wrapper
      const cardWrapper = document.querySelector('.login-card-wrapper');
      if (cardWrapper) {
        gsap.set(cardWrapper, { y: 30 });
        tl.to(cardWrapper, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, '-=0.2');
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      gsap.killTweensOf('*');
    };
  }, []);

  return null;
}

