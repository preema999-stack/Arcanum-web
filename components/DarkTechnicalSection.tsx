'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Cpu, Smartphone, Globe, RefreshCw, Lock, Terminal } from 'lucide-react';

export function DarkTechnicalSection() {
  const capabilities = [
    {
      title: 'Legacy Oracle Forms Modernization',
      tag: 'INFRASTRUCTURE REFACTORING',
      description:
        'Proven methodologies for extracting legacy PL/SQL business logic and refactoring heavy Oracle Forms 12c monoliths into decoupled microservice architecture.',
      icon: Database,
      details: ['PL/SQL Logic Isolation', 'Containerized Deployment', 'Zero Data-Loss Guarantee'],
    },
    {
      title: 'Banking & Financial Core Integrations',
      tag: 'ISO 8583 & ATM SWITCH',
      description:
        'Custom interface modules for co-operative and retail banks including ISO 8583 ATM switch bridging, automated SMS notifications, and secure customer portals.',
      icon: Lock,
      details: ['ATM Switch Interface', 'HSM Cryptographic Hardware', 'Real-time Transaction Audit'],
    },
    {
      title: 'Native Mobile & Web Engine',
      tag: 'CROSS-PLATFORM ENGINEERING',
      description:
        'Converting complex enterprise web platforms into high-speed native iOS and Android applications with offline sync, biometric auth, and push notifications.',
      icon: Smartphone,
      details: ['Native iOS / Android Runtimes', 'Biometric SSO Authentication', 'Offline Storage Engine'],
    },
  ];

  return (
    <section className="py-28 bg-[#0f172a] text-slate-100 dark-technical-grid relative overflow-hidden border-b border-slate-800">
      {/* Glow Effect */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#2384ba]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-2">
            06 / CORE CAPABILITIES & LEGACY MODERNIZATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Solving Complex Technical & Legacy Challenges
          </h2>
          <p className="text-slate-400 text-base font-sans leading-relaxed">
            We specialize in mission-critical software engineering where stability, zero-downtime migrations, 
            and enterprise security are non-negotiable requirements.
          </p>
        </div>

        {/* 3 Large Capability Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-slate-900/90 rounded-lg p-8 border border-slate-800 hover:border-[#2384ba]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[#2384ba] font-mono text-[11px] uppercase tracking-wider font-semibold">
                      {cap.tag}
                    </span>
                    <div className="w-10 h-10 rounded bg-slate-800 text-[#2384ba] flex items-center justify-center group-hover:bg-[#2384ba] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 font-display">{cap.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 space-y-2">
                  {cap.details.map((d) => (
                    <div key={d} className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2384ba]" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Callout Banner */}
        <div className="mt-16 bg-slate-950/90 rounded-lg p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded bg-[#2384ba]/10 text-[#2384ba] flex items-center justify-center shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-display mb-1">
                Require Custom Oracle Forms Refactoring or Banking Switch Setup?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl">
                Our principal engineers offer direct technical discovery sessions to audit legacy PL/SQL, ISO 8583 interfaces, and enterprise database topologies.
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-medium text-xs font-mono rounded tracking-wider uppercase transition-colors shrink-0"
          >
            Schedule Discovery Audit
          </a>
        </div>
      </div>
    </section>
  );
}
