'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, FileText, Menu, X } from 'lucide-react';
import { scrollToId } from '@/components/scrollTo';

interface HeaderProps {
  onOpenBrochures: () => void;
  onOpenContact: () => void;
}

const NAV = [
  { label: 'Who We Are', id: 'about' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Global Hubs', id: 'locations' },
  { label: 'Catalog', id: 'catalog' },
  { label: 'Contact', id: 'contact' },
];

export function Header({ onOpenBrochures, onOpenContact }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
          ? 'border-b border-white/10 bg-slate-950/80 backdrop-blur-xl'
          : 'bg-transparent'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand */}
          <a href="#" className="group flex items-center gap-3 focus:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#2384ba]/50 group-hover:shadow-[0_0_15px_rgba(35,132,186,0.3)]">
              <img src="/logo.png" alt="Arcanum IT Logo" className="h-full w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#2384ba]">ARCANUM</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                Information Technology
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToId(item.id)}
                className="font-mono text-xs uppercase tracking-widest text-slate-300 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={onOpenBrochures}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <FileText className="h-3.5 w-3.5 text-[#2384ba]" />
              Brochures
            </button>
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2384ba] px-4 py-2 font-mono text-xs font-semibold text-white shadow-lg shadow-[#2384ba]/25 transition-colors hover:bg-[#1b6ca1]"
            >
              Initiate Contact
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="p-2 text-white md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-slate-950/95 px-4 py-6 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {NAV.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToId(item.id);
                  }}
                  className="text-left font-mono text-sm uppercase tracking-widest text-slate-200 hover:text-[#2384ba]"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenBrochures();
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 py-2.5 font-mono text-xs text-white"
                >
                  <FileText className="h-4 w-4 text-[#2384ba]" />
                  Brochures
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenContact();
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#2384ba] py-2.5 font-mono text-xs font-semibold text-white"
                >
                  Initiate Contact
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
