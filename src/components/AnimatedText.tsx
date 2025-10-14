import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const words = text.split(' ');
    textRef.current.innerHTML = words
      .map((word) => `<span class="word" style="display:inline-block; overflow:hidden;"><span class="word-inner" style="display:inline-block;">${word}&nbsp;</span></span>`)
      .join('');

    const wordInners = textRef.current.querySelectorAll('.word-inner');

    gsap.set(wordInners, {
      y: 100,
      opacity: 0,
      filter: 'blur(8px)',
    });

    gsap.to(wordInners, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.03,
      ease: 'power2.out',
      delay,
    });
  }, [text, delay]);

  return <div ref={textRef} className={className}></div>;
}

