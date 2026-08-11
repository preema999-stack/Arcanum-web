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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f172a] text-slate-100 rounded-lg p-6 sm:p-8 max-w-3xl w-full border border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#2384ba]/20 text-[#2384ba] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Technical Brochure Vault</h3>
              <span className="text-xs font-mono text-slate-400">OFFICIAL ARCANUM IT DOCUMENTATION</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List of Brochures */}
        <div className="overflow-y-auto pr-2 space-y-3 flex-1 mb-6">
          {BROCHURES_LIST.map((b) => (
            <div
              key={b.title}
              className="bg-slate-900/90 p-4 rounded border border-slate-800 hover:border-[#2384ba]/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-[#2384ba] shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white font-display">{b.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{b.category}</span>
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

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
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
