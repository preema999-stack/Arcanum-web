'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Layers, Database, ShieldCheck, BadgeCheck } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';
import { GsapTextSplit } from '@/components/GsapTextSplit';

type IconComponent = React.ComponentType<{ className?: string }>;

const VALUES: { title: string; description: string; icon: IconComponent }[] = [
  {
    title: 'Architectural Precision',
    description: 'Clean modular codebases with strict type safety and zero technical debt.',
    icon: Layers,
  },
  {
    title: 'Legacy Modernization',
    description: 'Refactoring legacy Oracle Forms into scalable cloud microservices.',
    icon: Database,
  },
  {
    title: 'Statutory Compliance',
    description: 'UAE WPS payroll, ISO 8583 banking switches, and clinical EMR protocols.',
    icon: ShieldCheck,
  },
  {
    title: 'Professional Execution',
    description: 'Senior engineers executing complex assignments elegantly, on schedule.',
    icon: BadgeCheck,
  },
];

// GSAP Counter component for statistics
function GsapCounter({ endValue, label }: { endValue: string; label: string }) {
  const countRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!countRef.current || !textRef.current) return;

    // Match numbers, decimals, and surrounding symbols (e.g., "22+", "99.99%", "< 12ms", "150K+")
    const match = endValue.match(/^([^0-9]*)([0-9.]+)(.*)$/);
    if (!match) {
      if (textRef.current) textRef.current.textContent = endValue;
      return;
    }

    const prefix = match[1];
    const targetNum = parseFloat(match[2]);
    const suffix = match[3];
    const isDecimal = match[2].includes('.');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetNum,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              if (textRef.current) {
                const formatted = isDecimal ? obj.val.toFixed(2) : Math.floor(obj.val).toString();
                textRef.current.textContent = `${prefix}${formatted}${suffix}`;
              }
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [endValue]);

  return (
    <div ref={countRef}>
      <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#2384ba]">
        <span ref={textRef}>0</span>
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
}

// GSAP Infinite Marquee Ticker
function GsapTextMarquee() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 28,
        ease: 'none',
      });
    });
    return () => ctx.revert();
  }, []);

  const marqueeText =
    'ARCHITECTURAL PRECISION • LEGACY ORACLE FORMS REFACTORING • UAE WPS PAYROLL COMPLIANCE • ISO 8583 BANKING SWITCHES • CLINICAL EMR PROTOCOLS • SUB-12MS MICROSERVICES • ';

  return (
    <div className="my-14 overflow-hidden border-y border-white/10 bg-slate-950/60 py-3.5 backdrop-blur-md">
      <div className="flex whitespace-nowrap" ref={tickerRef}>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2384ba]/90 font-medium select-none">
          {marqueeText.repeat(4)}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2384ba]/90 font-medium select-none">
          {marqueeText.repeat(4)}
        </span>
      </div>
    </div>
  );
}

// GSAP Staggered Hub Cards
function GsapHubCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const ctx = gsap.context(() => {
            const cards = containerRef.current?.querySelectorAll('.gsap-hub-card');
            if (cards?.length) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 20, scale: 0.95 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.6,
                  stagger: 0.12,
                  ease: 'back.out(1.4)',
                }
              );
            }
          }, containerRef);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
      <div className="gsap-hub-card group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all hover:border-[#2384ba]/50 hover:bg-white/10">
        <div className="flex items-center space-x-1.5 text-[#2384ba] font-bold mb-1">
          <span className="text-sm">🇦🇪</span>
          <span>ABU DHABI</span>
        </div>
        <div className="text-[10px] text-slate-400 font-sans group-hover:text-slate-200 transition-colors">
          Global HQ & Strategy
        </div>
      </div>
      <div className="gsap-hub-card group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all hover:border-[#2384ba]/50 hover:bg-white/10">
        <div className="flex items-center space-x-1.5 text-[#2384ba] font-bold mb-1">
          <span className="text-sm">🇮🇳</span>
          <span>KERALA</span>
        </div>
        <div className="text-[10px] text-slate-400 font-sans group-hover:text-slate-200 transition-colors">
          Engineering & R&D Hub
        </div>
      </div>
      <div className="gsap-hub-card group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all hover:border-[#2384ba]/50 hover:bg-white/10">
        <div className="flex items-center space-x-1.5 text-[#2384ba] font-bold mb-1">
          <span className="text-sm">🇮🇳</span>
          <span>GUJARAT</span>
        </div>
        <div className="text-[10px] text-slate-400 font-sans group-hover:text-slate-200 transition-colors">
          Tech & Operations Center
        </div>
      </div>
    </div>
  );
}

// GSAP Staggered Value Pillars
function GsapValuePillars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const ctx = gsap.context(() => {
            const cards = containerRef.current?.querySelectorAll('.gsap-value-card');
            if (cards?.length) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.65,
                  stagger: 0.1,
                  ease: 'power3.out',
                }
              );
            }
          }, containerRef);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {VALUES.map((v) => {
        const Icon = v.icon;
        return (
          <div
            key={v.title}
            className="gsap-value-card rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#2384ba]/60 hover:shadow-lg hover:shadow-[#2384ba]/10 hover:-translate-y-1 group"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2384ba]/20 text-[#2384ba] group-hover:bg-[#2384ba] group-hover:text-white transition-colors duration-300">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-white group-hover:text-[#2384ba] transition-colors">{v.title}</h3>
            <p className="text-xs leading-relaxed text-slate-400">{v.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export function AboutSection() {
  const stats = ARCANUM_INFO.stats;
  const paragraphRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  // GSAP animation for text paragraph and image card
  useEffect(() => {
    if (paragraphRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            gsap.fromTo(
              paragraphRef.current,
              { opacity: 0, y: 25, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(paragraphRef.current);
    }
  }, []);

  useEffect(() => {
    if (imageCardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            gsap.fromTo(
              imageCardRef.current,
              { opacity: 0, scale: 0.94, y: 30 },
              { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }
            );
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(imageCardRef.current);
    }
  }, []);

  return (
    <section id="about" className="relative bg-[#0f172a] py-24 md:py-32 overflow-hidden dark-technical-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with GSAP Text Split */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-[0.25em] text-[#2384ba] mb-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#2384ba] animate-ping" />
            <GsapTextSplit text="02 / Who We Are" variant="chars" triggerOnScroll />
          </div>

          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            <GsapTextSplit
              text="An IT Engineering Firm Built on"
              highlightText="Rigor & Reliability."
              variant="heading-3d"
              triggerOnScroll
              delay={0.1}
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Column */}
          <div className="lg:col-span-6">
            <div ref={paragraphRef} className="will-change-transform">
              <p className="text-base leading-relaxed text-slate-300 mb-5">
                Arcanum Information Technology is a professionally managed software engineering firm operating across three key global centers:{' '}
                <strong className="text-white">Abu Dhabi (UAE)</strong>,{' '}
                <strong className="text-white">Kerala (India)</strong>, and{' '}
                <strong className="text-white">Gujarat (India)</strong>. We employ senior software architects and engineers delivering enterprise-grade software.
              </p>
            </div>

            {/* 3 Locations Hub Cards with GSAP Stagger */}
            <GsapHubCards />

            {/* Animated GSAP Statistics */}
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <GsapCounter key={s.label} endValue={s.value} label={s.label} />
              ))}
            </div>
          </div>

          {/* Infrastructure Image Card with GSAP 3D reveal */}
          <div ref={imageCardRef} className="lg:col-span-6 relative will-change-transform">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
                <img
                  src="/hero_infrastructure.png"
                  alt="Arcanum cloud infrastructure architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200 backdrop-blur-md bg-slate-950/70 p-2.5 rounded border border-white/10">
                  <span className="text-[#2384ba] font-medium flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2384ba] animate-pulse" />
                    INFRASTRUCTURE ARCHITECTURE
                  </span>
                  <span className="text-emerald-400 font-semibold">LATENCY &lt;12ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GSAP Infinite Marquee Ticker */}
        <GsapTextMarquee />

        {/* Values Grid with GSAP Stagger */}
        <GsapValuePillars />

      </div>
    </section>
  );
}

