'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Boxes,
  Building2,
  CheckCircle2,
  Database,
  Download,
  FileText,
  Landmark,
  Layers,
} from 'lucide-react';
import { ARCANUM_MODULES } from '@/data/arcanumData';
import { scrollToId } from '@/components/scrollTo';
import { GsapTextSplit } from '@/components/GsapTextSplit';

type IconComponent = React.ComponentType<{ className?: string }>;

const CATEGORY_ICONS: Record<string, IconComponent> = {
  Enterprise: Building2,
  Banking: Landmark,
  Healthcare: Building2,
  Education: Building2,
  Infrastructure: Database,
  Workspace: Boxes,
};

const FLAGSHIP_ICONS: Record<string, IconComponent> = {
  oms: Building2,
  erp: Layers,
  banking: Landmark,
  oracle: Database,
};

const FLAGSHIP_IMAGES: Record<string, string> = {
  oms: '/hero-topsection/ezgif-frame-105.jpg',
  erp: '/hero_infrastructure.png',
  banking: '/banking_fintech.png',
  oracle: '/oracle_modernization.png',
};

interface SolutionsSectionProps {
  onOpenBrochures: () => void;
}

export function SolutionsSection({ onOpenBrochures }: SolutionsSectionProps) {
  const flagship = ARCANUM_MODULES.filter((m) =>
    ['oms', 'erp', 'banking', 'oracle'].includes(m.id)
  );

  return (
    <section id="solutions" className="relative bg-[#0f172a] py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2384ba] block mb-3">
              03 / Flagship Solutions
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              <GsapTextSplit
                text="Enterprise Systems We"
                highlightText="Engineer."
                variant="heading-3d"
                triggerOnScroll
              />
            </h2>
          </div>
          <button
            onClick={() => scrollToId('catalog')}
            className="hidden items-center gap-2 font-mono text-xs text-white/80 transition-colors hover:text-white md:flex"
          >
            View all {ARCANUM_MODULES.length} modules
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Flagship Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flagship.map((m, idx) => {
            const Icon = FLAGSHIP_ICONS[m.id] ?? Building2;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl transition-colors hover:border-[#2384ba]/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={FLAGSHIP_IMAGES[m.id]}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#2384ba]/90 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    {m.category}
                  </span>
                  <h3 className="mb-3 mt-1.5 text-base font-semibold text-white">{m.title}</h3>
                  <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-400">
                    {m.description}
                  </p>
                  <ul className="mb-5 space-y-1.5">
                    {m.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2384ba]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {m.brochureUrl && (
                    <a
                      href={m.brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#2384ba] transition-colors hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Brochure
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Catalog */}
      <div id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 md:mt-24 relative z-10 scroll-mt-24 min-w-0 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-8 lg:p-10 backdrop-blur-xl w-full min-w-0 overflow-hidden shadow-2xl"
        >
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#2384ba]">
                04 / Full Product Catalog
              </span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                All {ARCANUM_MODULES.length} Modules
              </h3>
            </div>
            <button
              onClick={onOpenBrochures}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 sm:px-5 sm:py-2.5 font-mono text-xs text-white backdrop-blur-md transition-colors hover:bg-white/20 shrink-0 w-fit"
            >
              <FileText className="h-3.5 w-3.5 text-[#2384ba]" />
              <span>Brochure Vault</span>
            </button>
          </div>

          <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 min-w-0 w-full">
            {ARCANUM_MODULES.map((m) => {
              const Icon = CATEGORY_ICONS[m.category] ?? Boxes;
              return (
                <a
                  key={m.id}
                  href={m.brochureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-white/10 bg-slate-900/60 p-3 sm:px-4 sm:py-3 transition-all hover:border-[#2384ba]/60 hover:bg-slate-900 min-w-0 w-full overflow-hidden"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2384ba]/15 text-[#2384ba]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="truncate text-xs sm:text-sm font-medium text-white group-hover:text-[#2384ba] transition-colors">
                      {m.title}
                    </div>
                    <div className="truncate font-mono text-[10px] sm:text-[11px] text-slate-400">
                      {m.category}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[#2384ba]" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
