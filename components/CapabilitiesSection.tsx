'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCms } from '@/lib/cmsContext';

const defaultCaps = [
  {
    step: '01',
    title: 'Enterprise Systems & ERP Architecture',
    subtitle: 'FINANCE, PAYROLL & GOVERNANCE',
    description:
      'Integrating core business processes across finance, supply chain, asset management, and HR. Our ARC ERP and Payroll applications enforce strict compliance with UAE WPS regulations.',
    image: '/hero_infrastructure.png',
    tags: ['ARC ERP', 'WPS Payroll', 'OMS Governance', 'Multi-currency'],
  },
  {
    step: '02',
    title: 'Banking & Financial Switch Add-ons',
    subtitle: 'ISO 8583 & MOBILE BANKING',
    description:
      'Financial technology solutions engineered for retail and co-operative banks. Features include ISO 8583 ATM switch bridging, automated SMS notification gateways, and Transa Mobile Banking.',
    image: '/banking_fintech.png',
    tags: ['ISO 8583 Switch', 'Transa Mobile Banking', 'ATM Bridge', 'Deposit Analytics'],
  },
  {
    step: '03',
    title: 'Legacy Oracle Forms Modernization',
    subtitle: 'PL/SQL TO CLOUD REFRACTORING',
    description:
      'Proven methodologies for decoupling legacy Oracle Forms 12c monoliths into modern microservice REST APIs, preserving legacy database integrity while delivering responsive modern web interfaces.',
    image: '/oracle_modernization.png',
    tags: ['Oracle Forms 12c', 'PL/SQL Refactoring', 'REST APIs', 'Zero-downtime'],
  },
];

export function CapabilitiesSection() {
  const { content } = useCms();
  const rawCaps = content?.capabilities || [];

  const capabilities = rawCaps.length > 0
    ? rawCaps.map((c, idx) => ({
        step: `0${idx + 1}`,
        title: c.title,
        subtitle: c.tag,
        description: c.description,
        image: idx === 0 ? '/hero_infrastructure.png' : idx === 1 ? '/banking_fintech.png' : '/oracle_modernization.png',
        tags: c.details || [],
      }))
    : defaultCaps;

  return (
    <section id="capabilities" className="py-28 bg-[#0f172a] text-slate-100 dark-technical-grid border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-3">
            03 / CORE CAPABILITIES & DOMAINS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Architectural Solutions Engineered for Scale
          </h2>
          <p className="text-slate-400 text-base font-sans mt-3 leading-relaxed">
            We deliver enterprise certainty across critical sectors through specialized engineering teams and proven architectural frameworks.
          </p>
        </div>

        {/* 3 Large Visual Capability Cards */}
        <div className="space-y-16">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Frame */}
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-slate-800 bg-slate-900 group">
                  <img
                    src={cap.image}
                    alt={cap.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                  <span className="absolute top-4 left-4 font-mono text-xs font-bold text-[#2384ba] bg-slate-950/80 px-3 py-1 rounded border border-slate-800">
                    {cap.subtitle}
                  </span>
                </div>
              </div>

              {/* Text Specs */}
              <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                  PILLAR {cap.step}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {cap.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                  {cap.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-900 text-slate-300 font-mono text-xs rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
