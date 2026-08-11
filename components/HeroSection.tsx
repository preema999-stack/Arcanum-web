'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Download, ShieldCheck, Activity } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';

interface HeroSectionProps {
  onOpenContact: () => void;
  onOpenBrochures: () => void;
}

export function HeroSection({ onOpenContact, onOpenBrochures }: HeroSectionProps) {
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden editorial-grid">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2384ba]/8 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Technical Marker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between border-b border-slate-200/80 pb-4 mb-10 text-xs font-mono text-slate-500"
        >
          <div className="flex items-center space-x-3">
            <span className="text-[#2384ba] font-semibold tracking-widest uppercase">
              01 / ARCHITECTURE & CAPABILITY
            </span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-600">ARCANUM INFORMATION TECHNOLOGY</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-slate-700">
              <Activity className="w-3.5 h-3.5 text-[#2384ba]" />
              <span>SLA: 99.99%</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">REGION: UAE & INTERNATIONAL</span>
          </div>
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Main Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Category Marker */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#2384ba]/10 text-[#2384ba] rounded font-mono text-xs font-semibold w-fit mb-6">
              <span>UAE SOFTWARE DEVELOPMENT FIRM</span>
            </div>

            {/* Massive H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#0f172a] leading-[1.08] mb-6">
              Engineering High-Performance{' '}
              <span className="text-[#2384ba] font-semibold relative inline-block">
                Software Systems
              </span>{' '}
              for Enterprise Growth.
            </h1>

            {/* Editorial Body Text */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-8 font-sans">
              Arcanum Information Technology is a professionally managed software engineering firm in the UAE. 
              We design and execute custom ERPs, banking integrations, clinical management engines, and legacy 
              Oracle Forms modernizations with architectural rigor and operational longevity.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="group flex items-center space-x-2.5 px-6 py-3.5 bg-[#0f172a] hover:bg-[#2384ba] text-white text-xs font-mono font-medium uppercase tracking-wider rounded transition-all duration-300 shadow-md"
              >
                <span>Initiate Technical Review</span>
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={onOpenBrochures}
                className="flex items-center space-x-2 px-5 py-3.5 border border-slate-300 hover:border-[#2384ba]/60 text-slate-800 hover:text-[#2384ba] text-xs font-mono font-medium rounded bg-white transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-[#2384ba]" />
                <span>Explore Technical PDF Vault</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="mt-12 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 font-mono">
              <div>
                <span className="block text-2xl font-semibold text-[#0f172a]">22+</span>
                <span className="text-[11px] text-slate-500 font-sans">Enterprise Solutions</span>
              </div>
              <div>
                <span className="block text-2xl font-semibold text-[#2384ba]">99.99%</span>
                <span className="text-[11px] text-slate-500 font-sans">System SLA Uptime</span>
              </div>
              <div>
                <span className="block text-2xl font-semibold text-[#0f172a]">150K+</span>
                <span className="text-[11px] text-slate-500 font-sans">Active Enterprise Users</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Custom Generated Editorial Visual Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-[#0f172a] rounded-xl p-4 shadow-2xl border border-slate-800 relative overflow-hidden group">
              {/* Image Frame */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-slate-800">
                <img
                  src="/hero_infrastructure.png"
                  alt="Arcanum Cloud Infrastructure Architecture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200 backdrop-blur-md bg-slate-950/70 p-2.5 rounded border border-slate-800">
                  <span className="text-[#2384ba] font-medium">INFRASTRUCTURE ARCHITECTURE</span>
                  <span className="text-emerald-400">LATENCY &lt;12ms</span>
                </div>
              </div>

              {/* Bottom Specs Bar */}
              <div className="mt-4 px-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2384ba]" />
                  <span>AES-256 ISO 27001 READY</span>
                </span>
                <span>ARCANUM IT UAE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
