'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Boxes,
} from 'lucide-react';
import { ARCANUM_MODULES, ModuleItem, ShowcaseItem } from '@/data/arcanumData';
import { useCms } from '@/lib/cmsContext';
import { getModuleIcon } from '@/components/IconPickerModal';

interface SolutionsSectionProps {
  onOpenBrochures?: () => void;
}

export function SolutionsSection({ onOpenBrochures }: SolutionsSectionProps) {
  const { content } = useCms();
  const info = content?.info;

  // Automatically link catalog modules with any showcase items not yet in catalog
  const modulesList: ModuleItem[] = useMemo(() => {
    const base: ModuleItem[] =
      Array.isArray(content?.modules) && content.modules.length > 0
        ? content.modules
        : ARCANUM_MODULES;

    const showcases: ShowcaseItem[] = Array.isArray(content?.showcaseItems)
      ? content.showcaseItems
      : [];

    const extraFromShowcase: ModuleItem[] = [];

    showcases.forEach((s) => {
      const exists = base.some(
        (m) =>
          m.id?.toLowerCase() === s.id?.toLowerCase() ||
          m.slug?.toLowerCase() === s.id?.toLowerCase() ||
          (m.title && s.title && m.title.toLowerCase() === s.title.toLowerCase())
      );

      if (!exists) {
        extraFromShowcase.push({
          id: s.id,
          slug: s.id,
          title: s.title || s.tabLabel,
          category: (s.category as any) || 'Enterprise',
          subtitle: s.subtitle || '',
          description: s.description || '',
          features: s.capabilities?.map((c) => c.title) || [],
          techStack: s.techStack || ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
          imageSrc: s.imageSrc || '/hero_erp.jpg',
          iconName: s.iconName || 'Zap',
          badge: 'Flagship Solution',
        });
      }
    });

    return [...base, ...extraFromShowcase];
  }, [content?.modules, content?.showcaseItems]);

  return (
    <section id="catalog" className="relative bg-[#0f172a] py-16 md:py-24 overflow-hidden scroll-mt-24">
      {/* Full Catalog */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-8 backdrop-blur-xl sm:p-10 shadow-2xl"
        >
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2384ba]">
              {info?.catalogBadge || '04 / Full Product Catalog'}
            </span>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl font-display">
              All {modulesList.length} Modules
            </h3>
          </div>

          {modulesList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <Boxes className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
              <p className="text-sm text-slate-400 font-mono">No enterprise modules currently published in catalog.</p>
              <p className="text-xs text-slate-600 mt-1">Add or publish modules via the CMS admin cockpit.</p>
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {modulesList.map((m) => {
                const Icon = getModuleIcon(m.iconName, m.category);
                const targetHref = `/solutions/${m.slug || m.id}`;
                return (
                  <Link
                    key={m.id}
                    href={targetHref}
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 transition-colors hover:border-[#2384ba]/60 hover:bg-slate-900"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2384ba]/15 text-[#2384ba] group-hover:bg-[#2384ba] group-hover:text-white transition-all">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-white group-hover:text-[#2384ba] transition-colors">
                        {m.title}
                      </div>
                      <div className="truncate font-mono text-[11px] text-slate-400">
                        {m.category}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[#2384ba]" />
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

