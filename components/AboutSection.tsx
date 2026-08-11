'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Database, ShieldCheck, BadgeCheck } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';

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

export function AboutSection() {
  const stats = ARCANUM_INFO.stats;

  return (
    <section id="about" className="relative bg-[#0f172a] py-24 md:py-32 overflow-hidden dark-technical-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-14"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2384ba]">
            02 / Who We Are
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            An IT Engineering Firm Built on{' '}
            <span className="text-[#2384ba]">Rigor & Reliability.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <p className="text-base leading-relaxed text-slate-300 mb-5">
              Arcanum Information Technology is a professionally managed software engineering firm operating across three key global centers: 
              <strong className="text-white"> Abu Dhabi (UAE)</strong>, <strong className="text-white">Kerala (India)</strong>, and <strong className="text-white">Gujarat (India)</strong>. We employ senior software architects and engineers delivering enterprise-grade software.
            </p>

            {/* 3 Locations Cards */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <div className="flex items-center space-x-1.5 text-[#2384ba] font-bold mb-1">
                  <span className="text-sm">🇦🇪</span>
                  <span>ABU DHABI</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">Global HQ & Strategy</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <div className="flex items-center space-x-1.5 text-[#2384ba] font-bold mb-1">
                  <span className="text-sm">🇮🇳</span>
                  <span>KERALA</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">Engineering & R&D Hub</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <div className="flex items-center space-x-1.5 text-[#2384ba] font-bold mb-1">
                  <span className="text-sm">🇮🇳</span>
                  <span>GUJARAT</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">Tech & Operations Center</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-2xl font-semibold text-[#2384ba]">{s.value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 shadow-2xl">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
                <img
                  src="/hero_infrastructure.png"
                  alt="Arcanum cloud infrastructure architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200 backdrop-blur-md bg-slate-950/70 p-2.5 rounded border border-white/10">
                  <span className="text-[#2384ba] font-medium">INFRASTRUCTURE ARCHITECTURE</span>
                  <span className="text-emerald-400">LATENCY &lt;12ms</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl transition-colors hover:border-[#2384ba]/50"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2384ba]/20 text-[#2384ba]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-white">{v.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{v.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
