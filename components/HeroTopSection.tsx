'use client';

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { scrollToId } from '@/components/scrollTo';

const FRAME_START = 84;
const FRAME_END = 125;
const FRAME_COUNT = FRAME_END - FRAME_START + 1;
const TRACK_HEIGHT = '240vh';

const frameUrl = (i: number) =>
  `/hero-topsection/ezgif-frame-${String(FRAME_START + i).padStart(3, '0')}.jpg`;

interface HeroTopSectionProps {
  onOpenContact: () => void;
}

export function HeroTopSection({ onOpenContact }: HeroTopSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (reducedMotion) return;

    const loaded: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      loaded.push(img);
    }

    const unsub = scrollYProgress.on('change', (v) => {
      const i = Math.round(v * (FRAME_COUNT - 1));
      const img = loaded[i];
      if (img && imgRef.current && img.src !== imgRef.current.src) {
        imgRef.current.src = img.src;
      }
    });

    return unsub;
  }, [scrollYProgress, reducedMotion]);

  // Smooth content phase transitions as user scrolls through the 42 frames
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.22, 0.32], [1, 1, 0, 0]);
  const phase1Y = useTransform(scrollYProgress, [0.22, 0.32], [0, -25]);

  const phase2Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.56, 0.65], [0, 1, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.28, 0.38, 0.56, 0.65], [25, 0, 0, -25]);

  const phase3Opacity = useTransform(scrollYProgress, [0.62, 0.72, 0.88, 0.98], [0, 1, 1, 0]);
  const phase3Y = useTransform(scrollYProgress, [0.62, 0.72], [25, 0]);

  const contentOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0.88, 1], [0, -35]);

  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={trackRef} className="relative" style={{ height: TRACK_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0f172a]">
        {/* Full-bleed background motion frame sequence */}
        <img
          ref={imgRef}
          src={frameUrl(0)}
          alt="Arcanum enterprise software architecture in motion"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />

        {/* Minimal left gradient overlay to guarantee text legibility without blocking video */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0f172a] to-transparent" />

        {/* Main Content Overlay - Clean, Unboxed & Full Bleed */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-20"
        >
          <div className="w-full max-w-5xl">
            {/* Subtle Tag */}
            <div className="mb-6 flex items-center space-x-2 font-mono text-xs tracking-widest text-[#2384ba]">
              <span className="h-2 w-2 rounded-full bg-[#2384ba] animate-pulse" />
              <span className="uppercase font-semibold">UAE SOFTWARE DEVELOPMENT FIRM</span>
            </div>

            {/* Phased Headlines Area */}
            <div className="relative min-h-[220px] sm:min-h-[260px] flex flex-col justify-center">
              {/* Phase 1 */}
              <motion.div style={{ opacity: phase1Opacity, y: phase1Y }} className="absolute inset-x-0">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[1.05] mb-4">
                  If You Have an Idea,
                </h1>
                <p className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-[#2384ba] leading-tight">
                  We Will Make It a Reality.
                </p>
              </motion.div>

              {/* Phase 2 */}
              <motion.div style={{ opacity: phase2Opacity, y: phase2Y }} className="absolute inset-x-0 max-w-4xl">
                <h2 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[1.05] mb-6">
                  From Bold Vision to{' '}
                  <span className="text-[#2384ba]">Enterprise Reality.</span>
                </h2>
                <p className="text-base sm:text-xl leading-relaxed text-slate-300 max-w-2xl font-sans font-normal">
                  We engineer custom ERPs, core banking engines, clinical platforms, and cloud infrastructure — 
                  built with architectural rigor and operational longevity.
                </p>
              </motion.div>

              {/* Phase 3 */}
              <motion.div style={{ opacity: phase3Opacity, y: phase3Y }} className="absolute inset-x-0 max-w-4xl">
                <h2 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[1.05] mb-6">
                  And We Build Systems{' '}
                  <span className="text-[#2384ba]">That Endure.</span>
                </h2>
                <p className="text-base sm:text-xl leading-relaxed text-slate-300 max-w-2xl font-sans font-normal">
                  Secure, scalable, and backed by senior engineers across the UAE — so your 
                  software keeps evolving as your business grows.
                </p>
              </motion.div>
            </div>

            {/* Clean Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                onClick={onOpenContact}
                className="group flex items-center space-x-2.5 px-7 py-4 bg-[#2384ba] hover:bg-[#1b6ca1] text-white text-xs font-mono font-medium uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg shadow-[#2384ba]/25 hover:shadow-[#2384ba]/40"
              >
                <span>Start Your Project</span>
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => scrollToId('solutions')}
                className="group flex items-center space-x-2 px-6 py-4 border border-white/20 hover:border-[#2384ba] text-slate-200 hover:text-white text-xs font-mono font-medium rounded-lg bg-white/5 backdrop-blur-md transition-all"
              >
                <span>Explore Enterprise Catalog</span>
                <ArrowUpRight className="w-4 h-4 text-[#2384ba] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sleek Minimal Scroll Progress Line (Bottom Right) */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            SCROLL
          </span>
          <div className="h-[2px] w-24 overflow-hidden rounded-full bg-white/20">
            <motion.div
              style={{ scaleX: barScale }}
              className="h-full w-full origin-left bg-[#2384ba]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
