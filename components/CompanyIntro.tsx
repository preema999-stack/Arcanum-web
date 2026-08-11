'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Award, ArrowUpRight } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';

export function CompanyIntro() {
  const values = [
    {
      title: 'Architectural Precision',
      description: 'Clean modular codebases with strict type safety, zero-trust security layers, and zero technical debt.',
      icon: Cpu,
    },
    {
      title: 'Legacy Modernization',
      description: 'Methodologies for refactoring heavy legacy Oracle Forms applications into scalable cloud microservices.',
      icon: Database,
    },
    {
      title: 'Statutory Compliance',
      description: 'Native adherence to UAE WPS payroll standards, ISO 8583 banking switches, and clinical EMR protocols.',
      icon: ShieldCheck,
    },
    {
      title: 'Professional Execution',
      description: 'Employing highly-skilled senior engineers who execute complex IT assignments elegantly and on schedule.',
      icon: Award,
    },
  ];

  return (
    <section id="company" className="py-28 bg-[#f8fafc] editorial-grid border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-3">
              02 / ENGINEERING PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0f172a] leading-tight">
              An IT Engineering Firm Built on Rigor and Reliability.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-slate-600 text-base leading-relaxed font-sans">
            <p>
              Arcanum Information Technology is a professionally managed software development firm headquartered in the UAE. 
              We employ highly-skilled engineers capable of executing mission-critical IT projects professionally, 
              elegantly, and with architectural clarity.
            </p>
            <p>
              We provide the market with innovative, flexible, and smart software solutions that allow organizations 
              to scale seamlessly across financial management, educational administration, clinical care, and corporate governance.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
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
