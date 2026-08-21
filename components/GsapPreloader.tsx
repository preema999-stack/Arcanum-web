'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function GsapPreloader({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent scrolling during intro loader animation
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          if (window.__lenis) {
            window.__lenis.start();
            window.__lenis.resize();
          }
          if (onComplete) onComplete();
        },
      });

      // 1. Logo & Badge Entrance
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, filter: 'blur(12px)', y: 20 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.4'
        )
        // 2. Animate counter 0 -> 100
        .to(
          {},
          {
            duration: 1.4,
            ease: 'power2.inOut',
            onUpdate: function () {
              const prog = Math.round(this.progress() * 100);
              setCounter(prog);
            },
          },
          '-=0.3'
        )
        .to(
          lineRef.current,
          { scaleX: 1, duration: 1.4, ease: 'power2.inOut' },
          '<'
        )
        // 3. Exit curtain animation
        .to([logoRef.current, textRef.current], {
          opacity: 0,
          y: -30,
          duration: 0.5,
          ease: 'power2.in',
        })
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
        });
    }, containerRef);

    return () => {
      document.body.style.overflow = '';
      if (window.__lenis) {
        window.__lenis.start();
        window.__lenis.resize();
      }
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#080d1a] px-6 py-12 text-white select-none pointer-events-auto"
    >
      {/* Top Telemetry Header */}
      <div className="w-full max-w-7xl flex items-center justify-between font-mono text-xs text-slate-400 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-[#2384ba] animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">ARCANUM INFORMATION TECHNOLOGY</span>
        </div>
        <div className="hidden sm:block text-[11px] tracking-wider text-slate-400">
          GLOBAL HUBS: 🇦🇪 ABU DHABI • 🇮🇳 KERALA • 🇮🇳 GUJARAT
        </div>
        <div className="font-bold text-[#2384ba]">
          <span ref={countRef}>{String(counter).padStart(3, '0')}</span>%
        </div>
      </div>

      {/* Center Kinetic Logo & System Init Details */}
      <div className="flex flex-col items-center justify-center text-center max-w-lg my-auto">
        <div ref={logoRef} className="relative mb-8">
          <div className="absolute -inset-4 bg-[#2384ba]/30 rounded-2xl blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl shadow-2xl">
            <img src="/logo.png" alt="Arcanum Logo" className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(35,132,186,0.5)]" />
          </div>
        </div>

        <div ref={textRef} className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            ARCANUM INFORMATION TECHNOLOGY
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-[#2384ba]">
            {counter < 40
              ? '[ INITIALIZING ENTERPRISE CORE... ]'
              : counter < 80
              ? '[ SYNCING NODES: ABU DHABI | KERALA | GUJARAT ]'
              : '[ ARCHITECTURE READY ]'}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar Line */}
      <div className="w-full max-w-md">
        <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
          <div
            ref={lineRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#2384ba] via-cyan-400 to-teal-300 scale-x-0"
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>SYSTEM VERIFICATION</span>
          <span>LATENCY &lt;12MS</span>
        </div>
      </div>
    </div>
  );
}
