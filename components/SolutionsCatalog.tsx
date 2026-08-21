'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, CheckCircle2, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { ARCANUM_MODULES, ModuleItem } from '@/data/arcanumData';

interface SolutionsCatalogProps {
  onOpenBrochures: () => void;
}

export function SolutionsCatalog({ onOpenBrochures }: SolutionsCatalogProps) {
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);

  // Show 4 flagship solutions for clean editorial presentation
  const flagshipModules = ARCANUM_MODULES.filter((m) =>
    ['oms', 'erp', 'banking', 'oracle'].includes(m.id)
  );

  return (
    <section id="solutions" className="py-28 bg-[#f8fafc] editorial-grid border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-3">
              04 / CURATED ENTERPRISE SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] font-display">
              Flagship Enterprise Systems
            </h2>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm font-sans max-w-md mt-4 md:mt-0 leading-relaxed">
            Our modular platforms power governance, financial ledgers, banking switches, and educational platforms across the UAE.
          </p>
        </div>

        {/* 4 Flagship Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {flagshipModules.map((module) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 border border-slate-200 shadow-subtle hover:shadow-editorial hover:border-[#2384ba]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2384ba] bg-[#2384ba]/10 px-3 py-1 rounded">
                    {module.category}
                  </span>
                  {module.badge && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {module.badge}
                    </span>
                  )}
                </div>

                <Link href={`/solutions/${module.id}`}>
                  <h3 className="text-xl font-bold text-[#0f172a] group-hover:text-[#2384ba] transition-colors font-display mb-2">
                    {module.title}
                  </h3>
                </Link>
                <p className="text-xs font-mono text-slate-500 mb-4">{module.subtitle}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
                  {module.description}
                </p>

                <div className="space-y-2 mb-6">
                  {module.features.slice(0, 3).map((f) => (
                    <div key={f} className="flex items-center space-x-2 text-xs text-slate-700 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#2384ba] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                {module.brochureUrl && (
                  <a
                    href={module.brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-800 hover:text-[#2384ba] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#2384ba]" />
                    <span>Download PDF</span>
                  </a>
                )}

                <Link
                  href={`/solutions/${module.slug || module.id}`}
                  className="text-xs font-mono font-medium text-[#2384ba] hover:underline flex items-center space-x-1"
                >
                  <span>Inspect Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Modal Spec Viewer */}
        <AnimatePresence>
          {selectedModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <img src="/logo.png" alt="Arcanum Logo" className="w-5 h-5 object-contain" />
                    <span className="text-xs font-mono font-bold text-[#2384ba] uppercase">
                      {selectedModule.category} SPECIFICATION
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-mono"
                  >
                    [CLOSE ✕]
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-[#0f172a] mb-1 font-display">
                  {selectedModule.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 mb-4">{selectedModule.subtitle}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
                  {selectedModule.description}
                </p>

                <h4 className="text-xs font-mono font-bold text-[#0f172a] uppercase mb-3">
                  COMPLETE FEATURE CAPABILITIES
                </h4>
                <div className="space-y-2 mb-6">
                  {selectedModule.features.map((f) => (
                    <div key={f} className="flex items-center space-x-2 text-xs text-slate-700 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#2384ba] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  {selectedModule.brochureUrl && (
                    <a
                      href={selectedModule.brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#0f172a] text-white hover:bg-[#2384ba] text-xs font-mono font-medium rounded transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Official PDF</span>
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-mono rounded"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
