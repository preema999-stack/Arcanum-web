'use client';

import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';
import { scrollToId } from '@/components/scrollTo';

interface FooterProps {
  onOpenBrochures: () => void;
  onOpenContact: () => void;
}

const LINKS = [
  { label: 'Who We Are', id: 'about' },
  { label: 'Flagship Solutions', id: 'solutions' },
  { label: 'Product Catalog', id: 'catalog' },
  { label: 'Contact', id: 'contact' },
];

export function Footer({ onOpenBrochures, onOpenContact }: FooterProps) {
  const scrollToTop = () => {
    const lenis = window.__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#0f172a] pt-16 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md">
                <img src="/logo.png" alt="Arcanum Logo" className="h-full w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                {ARCANUM_INFO.name}
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              Professionally managed software development firm delivering secure enterprise software
              across ERP, Banking, Healthcare, Education, and Cloud Infrastructure.
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>GLOBAL HUBS:</span>
              <span className="text-[#2384ba]">🇦🇪 ABU DHABI</span>
              <span>•</span>
              <span className="text-[#2384ba]">🇮🇳 KERALA</span>
              <span>•</span>
              <span className="text-[#2384ba]">🇮🇳 GUJARAT</span>
            </div>
          </div>

          {/* Sections */}
          <div className="lg:col-span-3">
            <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-wider text-[#2384ba]">
              Sections
            </span>
            <ul className="space-y-2.5 font-mono text-xs">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToId(link.id)}
                    className="text-slate-300 transition-colors hover:text-[#2384ba]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="lg:col-span-4">
            <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-wider text-[#2384ba]">
              Documentation & Contact
            </span>
            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={onOpenBrochures}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-slate-200 transition-colors hover:bg-white/10"
              >
                <span>Download PDF Brochures</span>
                <ArrowUpRight className="h-4 w-4 text-[#2384ba]" />
              </button>
              <button
                onClick={onOpenContact}
                className="flex w-full items-center justify-between rounded-lg bg-[#2384ba] p-3 font-medium text-white transition-colors hover:bg-[#1b6ca1]"
              >
                <span>Schedule Technical Review</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 font-mono text-xs text-slate-500 sm:flex-row">
          <div>
            © {new Date().getFullYear()} {ARCANUM_INFO.name}. All Rights Reserved. UAE.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-[#2384ba]"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
