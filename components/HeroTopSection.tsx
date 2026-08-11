'use client';

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
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

function FrameCounter({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = String(Math.round(v * (FRAME_COUNT - 1)) + 1).padStart(3, '0');
      }
    });
    return unsub;
  }, [progress]);

  return (
    <span ref={ref} className="tabular-nums">
      001
    </span>
  );
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

  // Content phases that shift as the hero frames scrub.
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.22, 0.35], [1, 1, 0, 0]);
  const phase2Opacity = useTransform(scrollYProgress, [0.24, 0.36, 0.52, 0.64], [0, 1, 1, 0]);
  const phase3Opacity = useTransform(scrollYProgress, [0.53, 0.66, 0.82, 0.92], [0, 1, 1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0.85, 1], [0, -40]);

  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={trackRef} className="relative" style={{ height: TRACK_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0f172a]">
        {/* Scrolled hero image sequence */}
        <img
          ref={imgRef}
          src={frameUrl(0)}
          alt="Arcanum enterprise software in motion"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/65 to-[#0f172a]/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f172a] to-transparent" />
        <div className="vignette absolute inset-0" />

        {/* Top marker */}
        <div className="absolute top-0 inset-x-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-32 text-xs font-mono text-slate-400 md:pt-36">
              <div className="flex items-center space-x-3">
                <span className="text-[#2384ba] font-semibold tracking-widest uppercase">
                  01 / HERO
                </span>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="hidden sm:inline text-slate-500">
                  ARCANUM INFORMATION TECHNOLOGY · UAE
                </span>
              </div>
              <span className="hidden sm:inline text-slate-500">SCROLL TO EXPLORE</span>
            </div>
          </div>
        </div>

        {/* Inspiring content */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex flex-col justify-center px-6"
        >
          <div className="mx-auto w-full max-w-7xl">
            {/* Phase 1 */}
            <motion.div style={{ opacity: phase1Opacity }}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#2384ba]/15 text-[#2384ba] rounded font-mono text-xs font-semibold w-fit mb-6 border border-[#2384ba]/20">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2384ba] animate-pulse" />
                <span>UAE SOFTWARE DEVELOPMENT FIRM</span>
              </div>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[1.06] mb-5">
                If You Have an Idea,
              </h1>
              <p className="text-2xl sm:text-4xl xl:text-5xl font-medium tracking-tight text-[#2384ba] leading-tight">
                We Will Make It a Reality.
              </p>
            </motion.div>

            {/* Phase 2 */}
            <motion.div style={{ opacity: phase2Opacity }} className="max-w-4xl">
              <h2 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[1.06] mb-6">
                From Bold Vision to{' '}
                <span className="text-[#2384ba]">Enterprise Reality.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl font-sans">
                We engineer the ERPs, banking engines, clinical systems, and cloud platforms that
                turn your ambitions into dependable software — built with precision and built to
                last.
              </p>
            </motion.div>

            {/* Phase 3 */}
            <motion.div style={{ opacity: phase3Opacity }} className="max-w-4xl">
              <h2 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[1.06] mb-6">
                And We Build It{' '}
                <span className="text-[#2384ba]">to Endure.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl font-sans">
                Secure, scalable, and maintained by senior engineers across the UAE — so your
                software keeps working as your business grows.
              </p>
            </motion.div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="group flex items-center space-x-2.5 px-6 py-3.5 bg-[#2384ba] hover:bg-[#1b6ca1] text-white text-xs font-mono font-medium uppercase tracking-wider rounded transition-all duration-300 shadow-lg shadow-[#2384ba]/25"
              >
                <span>Start Your Project</span>
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
              <button
                onClick={() => scrollToId('solutions')}
                className="flex items-center space-x-2 px-5 py-3.5 border border-white/20 hover:border-[#2384ba]/60 text-white hover:text-[#2384ba] text-xs font-mono font-medium rounded bg-white/5 backdrop-blur-md transition-all"
              >
                <span>Explore What We Build</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* HUD: frame counter (bottom left) */}
        <div className="absolute bottom-6 left-6 z-20 hidden items-center gap-3 font-mono text-[11px] text-white/70 sm:flex">
          <span className="h-px w-10 bg-white/30" />
          <span>FRAME</span>
          <FrameCounter progress={scrollYProgress} />
          <span>/</span>
          <span>{FRAME_COUNT}</span>
        </div>

        {/* HUD: scroll progress (bottom right) */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Scroll
          </span>
          <div className="h-[3px] w-24 overflow-hidden rounded-full bg-white/20">
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
