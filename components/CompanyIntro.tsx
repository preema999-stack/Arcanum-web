'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Award, CheckCircle } from 'lucide-react';
import { useCms } from '@/lib/cmsContext';

const iconMap: Record<string, any> = {
  Cpu,
  Database,
  ShieldCheck,
  Award,
  CheckCircle,
};

export function CompanyIntro() {
  const { content } = useCms();
  const info = content?.info;
  const values = content?.values || [];

  return (
    <section id="company" className="py-28 bg-[#f8fafc] editorial-grid border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-3">
              {info?.aboutBadge || '02 / ENGINEERING PHILOSOPHY'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0f172a] leading-tight">
              {info?.aboutTitle || 'An Enterprise IT Engineering Firm Built on'}{' '}
              <span className="text-[#2384ba] font-semibold">{info?.aboutTitleHighlight || 'Rigor and Reliability.'}</span>
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-slate-600 text-base leading-relaxed font-sans">
            <p>
              {info?.aboutDescription1 ||
                'Arcanum Information Technology is a professionally managed software development firm headquartered in the UAE. We employ senior engineers capable of executing mission-critical IT projects professionally, elegantly, and with architectural clarity.'}
            </p>
            <p>
              {info?.aboutDescription2 ||
                'We provide the market with innovative, flexible, and smart software solutions that allow organizations to scale seamlessly across financial management, educational administration, clinical care, and corporate governance.'}
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = iconMap[v.iconName] || Cpu;
            return (
              <motion.div
                key={v.id || v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-subtle hover:shadow-editorial hover:border-[#2384ba]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-slate-900 text-[#2384ba] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0f172a] mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-sans">{v.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
