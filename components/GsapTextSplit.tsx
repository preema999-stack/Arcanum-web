'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export type GsapTextVariant = 'words' | 'chars' | 'lines' | 'heading-3d';

interface GsapTextSplitProps {
  text: string;
  highlightText?: string;
  className?: string;
  highlightClassName?: string;
  delay?: number;
  isActive?: boolean;
  variant?: GsapTextVariant;
  triggerOnScroll?: boolean;
}

export function GsapTextSplit({
  text,
  highlightText,
  className = '',
  highlightClassName = 'text-[#2384ba]',
  delay = 0,
  isActive = true,
  variant = 'words',
  triggerOnScroll = false,
}: GsapTextSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const runAnimation = () => {
      return gsap.context(() => {
        if (variant === 'chars') {
          const chars = containerRef.current?.querySelectorAll('.gsap-char');
          if (chars?.length) {
            gsap.fromTo(
              chars,
              {
                opacity: 0,
                y: 20,
                rotateX: -90,
                transformOrigin: '50% 0%',
                filter: 'blur(6px)',
              },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                duration: 0.55,
                delay: delay,
                stagger: 0.025,
                ease: 'back.out(1.5)',
              }
            );
          }
        } else if (variant === 'heading-3d') {
          const words = containerRef.current?.querySelectorAll('.gsap-word');
          if (words?.length) {
            gsap.fromTo(
              words,
              {
                opacity: 0,
                y: 40,
                rotateX: -65,
                filter: 'blur(12px)',
                transformOrigin: '50% 100%',
              },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                duration: 0.85,
                delay: delay,
                stagger: 0.045,
                ease: 'power4.out',
              }
            );
          }
        } else if (variant === 'lines') {
          const lines = containerRef.current?.querySelectorAll('.gsap-line-inner');
          if (lines?.length) {
            gsap.fromTo(
              lines,
              {
                yPercent: 100,
                opacity: 0,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                delay: delay,
                stagger: 0.12,
                ease: 'power3.out',
              }
            );
          }
        } else {
          // Default: 'words' blur-in
          const words = containerRef.current?.querySelectorAll('.gsap-word');
          if (words?.length) {
            gsap.fromTo(
              words,
              {
                opacity: 0,
                y: 28,
                filter: 'blur(10px)',
              },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.65,
                delay: delay,
                stagger: 0.035,
                ease: 'power3.out',
              }
            );
          }
        }
      }, containerRef);
    };

    if (triggerOnScroll) {
      let ctx: gsap.Context | null = null;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            ctx = runAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
        ctx?.revert();
      };
    } else {
      const ctx = runAnimation();
      return () => ctx.revert();
    }
  }, [isActive, delay, text, highlightText, variant, triggerOnScroll]);

  if (variant === 'chars') {
    const fullString = highlightText ? `${text} ${highlightText}` : text;
    const isHighlightChar = (charIndex: number) => {
      if (!highlightText) return false;
      return charIndex >= text.length;
    };

    return (
      <div ref={containerRef} className={`inline-block perspective-500 ${className}`}>
        {fullString.split('').map((char, idx) => (
          <span
            key={idx}
            className={`gsap-char inline-block opacity-0 will-change-transform ${
              char === ' ' ? 'w-[0.25em]' : ''
            } ${isHighlightChar(idx) ? highlightClassName : ''}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'lines') {
    return (
      <div ref={containerRef} className={`inline-block ${className}`}>
        <div className="overflow-hidden">
          <span className="gsap-line-inner block opacity-0 will-change-transform">{text}</span>
        </div>
        {highlightText && (
          <div className="overflow-hidden">
            <span className={`gsap-line-inner block opacity-0 will-change-transform ${highlightClassName}`}>
              {highlightText}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default: 'words' or 'heading-3d'
  const mainWords = text.split(' ');
  const highlightWords = highlightText ? highlightText.split(' ') : [];

  return (
    <div ref={containerRef} className={`inline-block flex-wrap perspective-1000 ${className}`}>
      {mainWords.map((word, idx) => (
        <span key={`main-${idx}`} className="gsap-word inline-block mr-[0.25em] opacity-0 will-change-transform">
          {word}
        </span>
      ))}
      {highlightWords.map((word, idx) => (
        <span
          key={`hl-${idx}`}
          className={`gsap-word inline-block mr-[0.25em] opacity-0 will-change-transform ${highlightClassName}`}
        >
          {word}
        </span>
      ))}
    </div>
  );
}


