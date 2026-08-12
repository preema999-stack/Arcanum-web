'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animationFrameId = requestAnimationFrame(raf);
    window.__lenis = lenis;

    // Recalculate scroll dimensions on window resize
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    // Initial resize after mount to ensure accurate bounds
    const timeoutId = setTimeout(() => {
      lenis.resize();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
