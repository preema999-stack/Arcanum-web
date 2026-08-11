'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Server, BarChart3, TrendingUp } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';

export function MetricsSection() {
  const metricCards = [
    {
      label: 'SLA SYSTEM UPTIME',
      value: '99.99%',
      subtitle: 'Continuous 365-day availability',
      icon: Activity,
      highlight: true,
      sparkline: [99.9, 99.95, 99.98, 99.99, 99.99, 99.99, 100],
    },
    {
      label: 'ENTERPRISE MODULES',
      value: '22+',
      subtitle: 'Production software suites',
      icon: Server,
      highlight: false,
      sparkline: [12, 14, 16, 18, 20, 21, 22],
    },
    {
      label: 'MICROSERVICE LATENCY',
      value: '< 12ms',
      subtitle: 'Sub-millisecond DB response',
      icon: Zap,
      highlight: false,
      sparkline: [24, 18, 15, 14, 12, 11, 9],
    },
    {
      label: 'SECURITY COMPLIANCE',
      value: 'ISO 27001',
      subtitle: 'AES-256 + OAuth2 / SAML',
      icon: ShieldCheck,
      highlight: false,
      sparkline: [90, 92, 95, 98, 99, 100, 100],
    },
  ];

  return (
    <section id="metrics" className="py-24 bg-[#0f172a] text-slate-100 dark-technical-grid border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-2">
              04 / PERFORMANCE & TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Empirical Operational Metrics
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>REAL-TIME AUDIT AUDITED BY UAE INFRASTRUCTURE</span>
          </div>
        </div>

        {/* 4 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-lg border transition-all duration-300 relative overflow-hidden group ${
                  card.highlight
                    ? 'bg-slate-900/90 border-[#2384ba]/60 shadow-glow'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center ${
                      card.highlight ? 'bg-[#2384ba] text-white' : 'bg-slate-800 text-[#2384ba]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mb-4">
                  <span
                    className={`text-3xl sm:text-4xl font-bold font-mono tracking-tight block ${
                      card.highlight ? 'text-[#2384ba]' : 'text-white'
                    }`}
                  >
                    {card.value}
                  </span>
                  <span className="text-xs text-slate-400 font-sans mt-1 block">
                    {card.subtitle}
                  </span>
                </div>

                {/* Minimal Sparkline Chart */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <svg className="w-24 h-6 text-[#2384ba]" viewBox="0 0 100 24" fill="none">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      points={card.sparkline
                        .map((val, i) => `${(i / (card.sparkline.length - 1)) * 100},${24 - (val / 100) * 20}`)
                        .join(' ')}
                    />
                  </svg>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 inline" />
                    <span>+100% SLA</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Performance Bar Comparison */}
        <div className="mt-12 p-6 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <span className="font-mono text-xs text-slate-300 uppercase">
              LATENCY COMPARISON: ARCANUM ENGINE VS TRADITIONAL MONOLITH
            </span>
            <span className="font-mono text-[11px] text-[#2384ba]">BENCHMARK RUN: 2026</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span className="text-[#2384ba] font-semibold">ARCANUM MICROSERVICE ARCHITECTURE</span>
                <span>8.4 ms avg</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2384ba] rounded-full w-[12%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>CONVENTIONAL MONOLITH ERP</span>
                <span>142.0 ms avg</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
