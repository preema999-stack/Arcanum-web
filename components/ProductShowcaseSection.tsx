'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Layers,
  Landmark,
  UtensilsCrossed,
  Users,
  HeartPulse,
  LineChart,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Cpu,
  Server,
  Calendar,
  Coins,
  Globe,
  Terminal,
  Activity,
  Pencil,
} from 'lucide-react';
import { useCms } from '@/lib/cmsContext';
import { useAuth } from '@/lib/authContext';
import {
  ARCANUM_MODULES,
  DEFAULT_SHOWCASE_ITEMS,
  ShowcaseItem,
} from '@/data/arcanumData';
import { GsapTextSplit } from '@/components/GsapTextSplit';
import { getModuleIcon } from '@/components/IconPickerModal';

export function ProductShowcaseSection() {
  const { content } = useCms();
  const { user } = useAuth();
  const info = content?.info;
  const modulesList = content?.modules && content.modules.length > 0 ? content.modules : ARCANUM_MODULES;

  const showcaseList: ShowcaseItem[] =
    content?.showcaseItems && content.showcaseItems.length > 0
      ? content.showcaseItems
      : DEFAULT_SHOWCASE_ITEMS;

  const [activeTabId, setActiveTabId] = useState<string>(showcaseList[0]?.id || 'erp');

  const activeItem = showcaseList.find((p) => p.id === activeTabId) || showcaseList[0];

  // Optional match with module for custom brochure or deeper specs
  const matchedModule = modulesList.find(
    (m) => m.id === activeItem?.id || m.slug === activeItem?.id
  );

  const title = activeItem?.title || matchedModule?.title || 'Enterprise System';
  const category = activeItem?.category || matchedModule?.category || 'Enterprise';
  const subtitle = activeItem?.subtitle || matchedModule?.subtitle || '';
  const description = activeItem?.description || matchedModule?.description || '';
  const imageSrc = activeItem?.imageSrc || matchedModule?.imageSrc || '/hero_erp.jpg';
  const productSlug = activeItem?.id || matchedModule?.slug || matchedModule?.id || 'erp';
  const techStack = activeItem?.techStack || ['TypeScript', 'PostgreSQL', 'Docker'];
  const metrics = activeItem?.metrics || [
    { label: 'LATENCY', value: '< 8ms' },
    { label: 'SYSTEM SLA', value: '99.99%' },
    { label: 'COMPLIANCE', value: 'Verified' },
  ];
  const capabilities = activeItem?.capabilities || [];

  return (
    <section id="showcase" className="relative bg-[#0b1120] py-24 md:py-32 overflow-hidden border-t border-b border-white/10">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2384ba]/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2384ba] block mb-3">
              {info?.showcaseBadge || '03 / Flagship Product Showcase'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight font-display">
              <GsapTextSplit
                text={info?.showcaseTitle || "Enterprise Software We"}
                highlightText={info?.showcaseTitleHighlight || "Build & Deploy."}
                variant="heading-3d"
                triggerOnScroll
              />
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              {info?.showcaseDescription ||
                'Explore our production-proven enterprise software engines — crafted for high transaction volume, strict statutory compliance, and resilient multi-tenant architectures.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            {user && (
              <Link
                href="/admin/showcase-designer"
                className="px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-semibold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Showcase (CMS)</span>
              </Link>
            )}
            <Link
              href="/demo"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2384ba] to-[#1a648e] text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#2384ba]/30 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Dedicated Demo</span>
            </Link>
          </div>
        </div>

        {/* Product Switcher Tabs */}
        <div className="mb-10 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex items-center gap-2 min-w-max bg-slate-950/70 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            {showcaseList.map((prod) => {
              const IconComp = getModuleIcon(prod.iconName || prod.capabilities?.[0]?.iconName, prod.category);
              const isActive = activeTabId === prod.id;

              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveTabId(prod.id)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold shadow-lg shadow-[#2384ba]/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeShowcaseTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2384ba] to-[#1a648e] border border-[#2384ba]/60"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#2384ba]'}`} />
                  </span>
                  <span className="relative z-10">{prod.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Product Showcase Window */}
        {activeItem && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left: Device Mockup / Live Screen Preview */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/60 group">
                {/* Window Title Bar */}
                <div className="px-5 py-3.5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-3 font-mono text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                      arcanum.cloud/systems/{productSlug}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-[10px]">
                    <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ONLINE • SLA 99.99%</span>
                    </span>
                  </div>
                </div>

                {/* Main Image Showcase with Hover Flare */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/hero_erp.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Floating Telemetry Chips */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 font-mono text-[10px] flex items-center space-x-2 shadow-lg"
                      >
                        <span className="text-slate-400 uppercase">{m.label}:</span>
                        <span className="text-cyan-300 font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Links */}
                <div className="p-6 bg-slate-900/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 font-mono text-[10px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/solutions/${productSlug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#2384ba] hover:text-white font-semibold transition-colors"
                  >
                    <span>Explore Interactive Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right: Architecture & Capabilities Details */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-white/15 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#2384ba] font-bold px-2.5 py-1 rounded bg-[#2384ba]/15 border border-[#2384ba]/30">
                      {category}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      ID: {activeItem.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-2">
                    {title}
                  </h3>
                  <p className="font-mono text-xs text-cyan-300 mb-4 font-semibold">
                    {subtitle}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    {description}
                  </p>

                  {/* 4 Architectural Capability Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {capabilities.map((cap, idx) => {
                      const Icon = getModuleIcon(cap.iconName);
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-[#2384ba]/40 transition-colors"
                        >
                          <div className="flex items-center space-x-2.5 mb-1.5">
                            <div className="p-1.5 rounded-lg bg-[#2384ba]/20 text-[#2384ba]">
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-white font-display truncate">
                              {cap.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                            {cap.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/solutions/${productSlug}`}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2384ba] to-[#1a648e] hover:from-[#1b6b96] hover:to-[#144f72] text-white font-mono text-xs font-semibold text-center transition-all shadow-lg shadow-[#2384ba]/20 hover:shadow-[#2384ba]/40 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-cyan-300" />
                    <span>Explore Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/demo?product=${productSlug}`}
                    className="px-4 py-3 rounded-xl border border-white/15 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Book Demo</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
