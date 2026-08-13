'use client';

import React, { useEffect } from 'react';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    let lenisInstance: any = null;
    let animationFrameId: number;

    import('lenis').then(({ default: Lenis }) => {
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
        animationFrameId = requestAnimationFrame(raf);
      }

      animationFrameId = requestAnimationFrame(raf);
      window.__lenis = lenis;
      lenisInstance = lenis;

      const handleResize = () => {
        lenis.resize();
      };
      window.addEventListener('resize', handleResize);
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (lenisInstance) {
        lenisInstance.destroy();
        delete window.__lenis;
      }
    };
  }, []);

  return <>{children}</>;
}

