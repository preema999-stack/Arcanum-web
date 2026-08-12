'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { BROCHURES_LIST } from '@/data/arcanumData';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;

    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (window.__lenis) {
      window.__lenis.stop();
    }

    return () => {
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
      if (window.__lenis) {
        window.__lenis.start();
        window.__lenis.resize();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      data-lenis-prevent="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        data-lenis-prevent="true"
        className="bg-[#0f172a] text-slate-100 rounded-2xl max-w-3xl w-full border border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col overflow-y-auto overscroll-contain min-w-0"
      >
        {/* Header - sticky so the close control stays reachable while scrolling */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800 bg-[#0f172a] shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded bg-[#2384ba]/20 text-[#2384ba] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white font-display truncate">Technical Brochure Vault</h3>
              <span className="text-[10px] sm:text-xs font-mono text-slate-400 block truncate">OFFICIAL ARCANUM IT DOCUMENTATION</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded focus:outline-none shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List of Brochures */}
        <div
          className="px-4 sm:px-6 py-4 sm:py-6 space-y-2.5 flex-1 min-w-0"
        >
          {BROCHURES_LIST.map((b) => (
            <div
              key={b.title}
              className="bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800 hover:border-[#2384ba]/50 transition-colors flex items-center justify-between gap-3 min-w-0"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1 overflow-hidden">
                <FileText className="w-4 h-4 text-[#2384ba] shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-white font-display truncate">{b.title}</h4>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block truncate">{b.category}</span>
                </div>
              </div>

              <a
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2384ba] hover:bg-[#1b6ca1] text-white text-xs font-mono rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer - sticky so the footer actions stay reachable while scrolling */}
        <div className="sticky bottom-0 z-10 px-4 sm:px-6 py-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2384ba]" />
            <span>VERIFIED DIGITAL SIGNATURES</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded text-xs"
          >
            Close Vault
          </button>
        </div>
      </motion.div>
    </div>
  );
}
