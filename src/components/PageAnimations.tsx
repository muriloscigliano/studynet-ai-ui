import { useEffect } from 'react';
import { gsap } from 'gsap';

// Track if sidebar has already animated (persists across sessions)
const SIDEBAR_ANIMATED_KEY = 'studynet_sidebar_animated';

export default function PageAnimations() {
  useEffect(() => {
    const sidebarAlreadyAnimated = localStorage.getItem(SIDEBAR_ANIMATED_KEY);
    
    // Set initial states IMMEDIATELY (synchronously) to prevent flash
    if (!sidebarAlreadyAnimated) {
      gsap.set('.sidebar', { x: -100, opacity: 0 });
    }
    
    // Get elements
    const planPill = document.querySelector('.plan-pill');
    const headlines = document.querySelectorAll('.headline');
    const subcopy = document.querySelectorAll('.subcopy');
    const composerWrapper = document.querySelector('.composer-wrapper');
    const composer = document.querySelector('.composer:not(.plan-card)');
    const chips = document.querySelectorAll('.chip');
    const planCards = document.querySelectorAll('.plan-card');

    // Set initial hidden states immediately
    if (planPill) gsap.set(planPill, { opacity: 0, scale: 0.8, y: -20 });
    if (headlines.length) gsap.set(headlines, { opacity: 0, filter: 'blur(30px)' });
    if (subcopy.length) gsap.set(subcopy, { opacity: 0, filter: 'blur(30px)' });
    if (composerWrapper || composer) gsap.set([composerWrapper, composer].filter(Boolean), { y: 50, opacity: 0 });
    if (chips.length) gsap.set(chips, { opacity: 0, y: 10 });
    if (planCards.length) gsap.set(planCards, { opacity: 0, y: 30 });

    // Small delay before starting animations (DOM might still be updating)
    const timer = setTimeout(() => {
      // Timeline for coordinated animations
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Sidebar slides in from left (only first time)
      if (!sidebarAlreadyAnimated) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          tl.to(sidebar, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            onComplete: () => {
              localStorage.setItem(SIDEBAR_ANIMATED_KEY, 'true');
            },
          });
        }
      }

      // 2. Plan pill
      if (planPill) {
        tl.to(planPill, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.5)',
        }, sidebarAlreadyAnimated ? '+=0' : '-=0.5');
      }

      // 3. Headline with blur
      if (headlines.length) {
        tl.to(headlines, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power3.out',
        }, '-=0.25');
      }

      // 4. Subcopy with blur
      if (subcopy.length) {
        tl.to(subcopy, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power3.out',
        }, '-=0.3');
      }

      // 5. Composer from bottom (exclude plan cards)
      if (composerWrapper || composer) {
        tl.to([composerWrapper, composer].filter(Boolean), {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.3');
      }

      // 6. Chips stagger
      if (chips.length) {
        tl.to(chips, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.out',
        }, '-=0.4');
      }

      // 7. Plan cards (for pricing page)
      if (planCards.length) {
        tl.to(planCards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power2.out',
        }, '-=0.3');
      }
    }, 10); // Very small delay just to ensure React finished rendering

    // Cleanup
    return () => {
      clearTimeout(timer);
      // Kill any running animations
      gsap.killTweensOf('*');
    };
  }, []);

  return null;
}
