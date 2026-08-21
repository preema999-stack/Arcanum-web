'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useCms } from '@/lib/cmsContext';
import {
  DEFAULT_SHOWCASE_ITEMS,
  ShowcaseItem,
  SiteInfo,
} from '@/data/arcanumData';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Link2,
  Check,
  X,
  Layers,
  Building2,
  Landmark,
  UtensilsCrossed,
  Users,
  HeartPulse,
  LineChart,
  Database,
  ShieldCheck,
  Zap,
  Cpu,
  Server,
  ArrowUpRight,
  RefreshCw,
  Coins,
  Globe,
  Terminal,
  Activity,
  Calendar,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { IconPickerModal, getModuleIcon } from '@/components/IconPickerModal';

const PRESET_GALLERY_IMAGES = [
  { label: 'ARC ERP Financial Core', url: '/hero_erp.jpg' },
  { label: 'CulinaryOS Restaurant POS', url: '/hero_restaurant.jpg' },
  { label: 'AuraCare Clinical EMR', url: '/hero_clinic.jpg' },
  { label: 'Synapse HRMS & WPS Payroll', url: '/hero_hrms.jpg' },
  { label: 'Aether Enterprise CRM', url: '/hero_crm.jpg' },
  { label: 'Core Banking & FinTech Switch', url: '/banking_fintech.png' },
  { label: 'Oracle Forms Modernizer', url: '/oracle_modernization.png' },
  { label: 'Global OMS Cyber Hub', url: '/hero-topsection/ezgif-frame-105.jpg' },
];

export default function ShowcaseDesignerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { content, updateCmsContent, isFirebaseLoaded } = useCms();

  const [items, setItems] = useState<ShowcaseItem[]>(
    content?.showcaseItems && content.showcaseItems.length > 0
      ? content.showcaseItems
      : DEFAULT_SHOWCASE_ITEMS
  );

  const [headerInfo, setHeaderInfo] = useState({
    showcaseBadge: content?.info?.showcaseBadge || '03 / Flagship Product Showcase',
    showcaseTitle: content?.info?.showcaseTitle || 'Enterprise Software We',
    showcaseTitleHighlight: content?.info?.showcaseTitleHighlight || 'Build & Deploy.',
    showcaseDescription:
      content?.info?.showcaseDescription ||
      'Explore our production-proven enterprise software engines — crafted for high transaction volume, strict statutory compliance, and resilient multi-tenant architectures.',
  });

  const [activeTabId, setActiveTabId] = useState<string>(items[0]?.id || 'erp');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<'url' | 'upload' | 'gallery'>('gallery');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [newTechTag, setNewTechTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Icon Picker Target State (for tabs or capability cards)
  const [iconPickerTarget, setIconPickerTarget] = useState<{
    type: 'tab' | 'capability';
    tabIndex?: number;
    capIndex?: number;
    currentIcon: string;
    title: string;
  } | null>(null);

  // Sync with loaded CMS content once
  useEffect(() => {
    if (content?.showcaseItems && content.showcaseItems.length > 0) {
      setItems(content.showcaseItems);
      if (!content.showcaseItems.some((i) => i.id === activeTabId)) {
        setActiveTabId(content.showcaseItems[0].id);
      }
    }
    if (content?.info) {
      setHeaderInfo({
        showcaseBadge: content.info.showcaseBadge || '03 / Flagship Product Showcase',
        showcaseTitle: content.info.showcaseTitle || 'Enterprise Software We',
        showcaseTitleHighlight: content.info.showcaseTitleHighlight || 'Build & Deploy.',
        showcaseDescription:
          content.info.showcaseDescription ||
          'Explore our production-proven enterprise software engines — crafted for high transaction volume, strict statutory compliance, and resilient multi-tenant architectures.',
      });
    }
  }, [content]);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const activeItemIndex = items.findIndex((i) => i.id === activeTabId);
  const activeItem = items[activeItemIndex] || items[0];

  const updateActiveItem = (updater: (prev: ShowcaseItem) => ShowcaseItem) => {
    setItems((prev) => {
      const next = [...prev];
      if (activeItemIndex >= 0 && activeItemIndex < next.length) {
        next[activeItemIndex] = updater(next[activeItemIndex]);
      }
      return next;
    });
  };

  const handleAddNewProduct = () => {
    const newId = `product-${Date.now()}`;
    const newItem: ShowcaseItem = {
      id: newId,
      tabLabel: 'New Engine',
      title: 'New Enterprise Engine Architecture',
      category: 'Enterprise & Cloud',
      subtitle: 'Next-Gen High-Throughput Microservice Architecture',
      description:
        'A custom enterprise engine engineered for high-availability workloads, strict data security, and seamless multi-region deployment.',
      imageSrc: '/hero_erp.jpg',
      techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'Redis', 'TLS 1.3'],
      metrics: [
        { label: 'LATENCY', value: '< 10ms' },
        { label: 'UPTIME SLA', value: '99.99%' },
        { label: 'SECURITY', value: 'Zero-Trust' },
      ],
      capabilities: [
        {
          title: 'High-Throughput Ingestion',
          description: 'Sub-millisecond event streaming and distributed transaction commits.',
          iconName: 'Zap',
        },
        {
          title: 'Role-Based Security Mesh',
          description: 'Granular access policies with biometric MFA and cryptographic tokens.',
          iconName: 'ShieldCheck',
        },
        {
          title: 'Real-Time Audit Ledger',
          description: 'Immutable logging across operational nodes with zero data loss.',
          iconName: 'Server',
        },
        {
          title: 'Cloud Auto-Scaling Engine',
          description: 'Containerized Kubernetes deployment with automated load balancing.',
          iconName: 'Cpu',
        },
      ],
    };

    setItems((prev) => [...prev, newItem]);
    setActiveTabId(newId);
  };

  const handleDeleteCurrentProduct = () => {
    if (items.length <= 1) {
      alert('You must keep at least one showcase product tab.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${activeItem?.tabLabel}" from the showcase?`)) {
      const nextItems = items.filter((i) => i.id !== activeItem.id);
      setItems(nextItems);
      setActiveTabId(nextItems[0].id);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all showcase tabs and text to factory defaults?')) {
      setItems(DEFAULT_SHOWCASE_ITEMS);
      setActiveTabId(DEFAULT_SHOWCASE_ITEMS[0].id);
      setHeaderInfo({
        showcaseBadge: '03 / Flagship Product Showcase',
        showcaseTitle: 'Enterprise Software We',
        showcaseTitleHighlight: 'Build & Deploy.',
        showcaseDescription:
          'Explore our production-proven enterprise software engines — crafted for high transaction volume, strict statutory compliance, and resilient multi-tenant architectures.',
      });
    }
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updatedInfo: SiteInfo = {
        ...(content?.info || {}),
        ...headerInfo,
      } as SiteInfo;

      const success = await updateCmsContent({
        ...content,
        info: updatedInfo,
        showcaseItems: items,
      });

      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert('Could not save to Firebase. Please check your network connection.');
      }
    } catch (err: any) {
      console.error('Save Showcase Error:', err);
      alert('Error saving showcase: ' + (err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload with Canvas Compression
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        updateActiveItem((prev) => ({ ...prev, imageSrc: compressedBase64 }));
        setImageModalOpen(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-cyan-400 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin mr-3" />
        Loading Showcase Visual Designer...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#2384ba]/30">
      {/* Top Sticky Wix Command Bar */}
      <header className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Link>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-wide font-display">
                Showcase Wix Visual Designer
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                LIVE WYSIWYG
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle Preview / Edit Mode */}
            <button
              onClick={() => setIsPreviewMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                isPreviewMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPreviewMode ? 'Exit Preview' : 'Live Preview Mode'}</span>
            </button>

            {/* Reset to Defaults */}
            <button
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors"
              title="Reset to factory default showcase configuration"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            {/* Save and Publish */}
            <button
              onClick={handleSaveAndPublish}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2384ba] to-cyan-500 hover:from-[#1b6b96] hover:to-cyan-400 text-white text-xs font-bold font-mono shadow-lg shadow-[#2384ba]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving & Publishing...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Published to Live Site!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Editor Floating Hint */}
      {!isPreviewMode && (
        <div className="bg-cyan-950/40 border-b border-cyan-500/20 py-2 px-4 text-center text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            <strong>Wix Visual Mode Active:</strong> Click directly on text, badges, capability cards, and metrics to edit in real time. Hover over the screen mockup to change images.
          </span>
        </div>
      )}

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SECTION HEADER (INLINE EDITABLE) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            {/* Badge */}
            {isPreviewMode ? (
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2384ba] block mb-3">
                {headerInfo.showcaseBadge}
              </span>
            ) : (
              <div className="mb-3">
                <input
                  type="text"
                  value={headerInfo.showcaseBadge}
                  onChange={(e) => setHeaderInfo((prev) => ({ ...prev, showcaseBadge: e.target.value }))}
                  className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400 bg-slate-900/80 border border-cyan-500/30 rounded-lg px-2.5 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="03 / Flagship Product Showcase"
                />
              </div>
            )}

            {/* Title & Highlight */}
            {isPreviewMode ? (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight font-display">
                {headerInfo.showcaseTitle}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#2384ba]">
                  {headerInfo.showcaseTitleHighlight}
                </span>
              </h2>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Title Prefix
                  </label>
                  <input
                    type="text"
                    value={headerInfo.showcaseTitle}
                    onChange={(e) => setHeaderInfo((prev) => ({ ...prev, showcaseTitle: e.target.value }))}
                    className="text-xl sm:text-2xl font-bold text-white bg-slate-900/80 border border-white/20 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-[#2384ba]"
                    placeholder="Enterprise Software We"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Title Highlight
                  </label>
                  <input
                    type="text"
                    value={headerInfo.showcaseTitleHighlight}
                    onChange={(e) =>
                      setHeaderInfo((prev) => ({ ...prev, showcaseTitleHighlight: e.target.value }))
                    }
                    className="text-xl sm:text-2xl font-bold text-cyan-400 bg-slate-900/80 border border-cyan-500/40 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Build & Deploy."
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {isPreviewMode ? (
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
                {headerInfo.showcaseDescription}
              </p>
            ) : (
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={headerInfo.showcaseDescription}
                  onChange={(e) =>
                    setHeaderInfo((prev) => ({ ...prev, showcaseDescription: e.target.value }))
                  }
                  className="text-sm text-slate-300 bg-slate-900/80 border border-white/20 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#2384ba]"
                  placeholder="Section description..."
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{items.length} Showcase Engines Active</span>
            </div>
          </div>
        </div>

        {/* TAB BAR & TAB CONTROLS */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 flex-1">
            <div className="flex items-center gap-2 min-w-max bg-slate-950/80 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
              {items.map((item, idx) => {
                const isActive = item.id === activeTabId;
                const IconComponent = getModuleIcon(item.iconName || item.capabilities?.[0]?.iconName, item.category);

                return (
                  <div key={item.id} className="relative group/tab flex items-center">
                    <button
                      onClick={() => setActiveTabId(item.id)}
                      className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'text-white font-semibold shadow-lg shadow-[#2384ba]/20 bg-gradient-to-r from-[#2384ba] to-[#1a648e] border border-[#2384ba]/60'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                      <span>{item.tabLabel}</span>
                    </button>
                    {!isPreviewMode && isActive && (
                      <button
                        type="button"
                        onClick={() =>
                          setIconPickerTarget({
                            type: 'tab',
                            tabIndex: idx,
                            currentIcon: item.iconName || item.capabilities?.[0]?.iconName || 'Layers',
                            title: item.tabLabel,
                          })
                        }
                        className="ml-1 px-1.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono transition-all cursor-pointer"
                        title="Change Tab Icon"
                      >
                        Icon ▾
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add New Tab Button */}
              {!isPreviewMode && (
                <button
                  onClick={handleAddNewProduct}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-semibold transition-all cursor-pointer"
                  title="Add New Showcase Product Tab"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tab</span>
                </button>
              )}
            </div>
          </div>

          {/* Current Tab Management Controls */}
          {!isPreviewMode && activeItem && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDeleteCurrentProduct}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono transition-all cursor-pointer"
                title="Delete this tab"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Tab</span>
              </button>
            </div>
          )}
        </div>

        {/* ACTIVE PRODUCT WIX WORKSPACE */}
        {activeItem && (
          <div className="space-y-12">
            {/* Tab Label Inline Editor */}
            {!isPreviewMode && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold uppercase">Active Tab Settings:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tab Label:</span>
                  <input
                    type="text"
                    value={activeItem.tabLabel}
                    onChange={(e) => updateActiveItem((prev) => ({ ...prev, tabLabel: e.target.value }))}
                    className="bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tab Label..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tab Icon:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = items.findIndex((i) => i.id === activeItem.id);
                      setIconPickerTarget({
                        type: 'tab',
                        tabIndex: idx,
                        currentIcon: activeItem.iconName || activeItem.capabilities?.[0]?.iconName || 'Layers',
                        title: activeItem.tabLabel,
                      });
                    }}
                    className="flex items-center gap-2 px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-white/20 hover:border-cyan-500 rounded-lg text-xs text-white font-mono transition-all cursor-pointer group"
                    title="Click to pick icon for this showcase tab"
                  >
                    <div className="w-5 h-5 rounded bg-[#2384ba]/20 text-cyan-400 flex items-center justify-center">
                      {(() => {
                        const TabIcon = getModuleIcon(activeItem.iconName || activeItem.capabilities?.[0]?.iconName, activeItem.category);
                        return <TabIcon className="w-3.5 h-3.5" />;
                      })()}
                    </div>
                    <span className="text-cyan-300 font-semibold">{activeItem.iconName || activeItem.capabilities?.[0]?.iconName || 'Layers'}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-cyan-400">Pick ▾</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Slug / ID:</span>
                  <span className="text-slate-300 font-mono bg-slate-950 px-2 py-1 rounded border border-white/10">
                    {activeItem.id}
                  </span>
                </div>
              </div>
            )}

            {/* 2-COLUMN PRODUCT DISPLAY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: LIVE MACOS MOCKUP WINDOW & TELEMETRY */}
              <div className="lg:col-span-6 space-y-6">
                <div className="relative rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-2xl group/mockup">
                  {/* macOS Titlebar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                        arcanum.cloud/systems/{activeItem.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ONLINE
                      </span>

                      {/* Change Image Button in Mockup */}
                      {!isPreviewMode && (
                        <button
                          onClick={() => {
                            setTempImageUrl(activeItem.imageSrc);
                            setImageModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Change Screen</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device Screen Frame with Zoom Flare */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group">
                    <img
                      src={activeItem.imageSrc || '/hero_erp.jpg'}
                      alt={activeItem.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/hero_erp.jpg';
                      }}
                    />

                    {/* Gradient Screen Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                    {/* Change Image Hover Banner */}
                    {!isPreviewMode && (
                      <div
                        onClick={() => {
                          setTempImageUrl(activeItem.imageSrc);
                          setImageModalOpen(true);
                        }}
                        className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <div className="px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span>Click to Upload or Select Gallery Preset</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3 LIVE TELEMETRY CHIPS (INLINE EDITABLE) */}
                  <div className="p-4 bg-slate-950 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-2">
                      {activeItem.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-center"
                        >
                          {isPreviewMode ? (
                            <>
                              <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400 truncate">
                                {metric.label}
                              </div>
                              <div className="mt-1 font-mono text-xs sm:text-sm font-bold text-cyan-300 truncate">
                                {metric.value}
                              </div>
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={metric.label}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateActiveItem((prev) => {
                                    const nextM = [...prev.metrics];
                                    nextM[idx] = { ...nextM[idx], label: val };
                                    return { ...prev, metrics: nextM };
                                  });
                                }}
                                className="font-mono text-[9px] uppercase tracking-wider text-slate-400 bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1"
                                placeholder="LABEL"
                              />
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateActiveItem((prev) => {
                                    const nextM = [...prev.metrics];
                                    nextM[idx] = { ...nextM[idx], value: val };
                                    return { ...prev, metrics: nextM };
                                  });
                                }}
                                className="mt-1 font-mono text-xs font-bold text-cyan-300 bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1"
                                placeholder="VALUE"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TECH STACK PILLS (INLINE EDITABLE) */}
                <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
                      Core Technology Stack
                    </span>
                    {!isPreviewMode && (
                      <button
                        onClick={() => setIsAddingTag((v) => !v)}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Tech Tag</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeItem.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 font-mono text-xs text-slate-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{tech}</span>
                        {!isPreviewMode && (
                          <button
                            onClick={() => {
                              updateActiveItem((prev) => ({
                                ...prev,
                                techStack: prev.techStack.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"
                            title="Remove tag"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}

                    {/* New Tag Input */}
                    {!isPreviewMode && isAddingTag && (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newTechTag}
                          onChange={(e) => setNewTechTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTechTag.trim()) {
                              updateActiveItem((prev) => ({
                                ...prev,
                                techStack: [...prev.techStack, newTechTag.trim()],
                              }));
                              setNewTechTag('');
                              setIsAddingTag(false);
                            }
                          }}
                          className="bg-slate-900 border border-cyan-500/50 rounded-lg px-2.5 py-1 font-mono text-xs text-white focus:outline-none"
                          placeholder="e.g. Docker, GraphQL..."
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (newTechTag.trim()) {
                              updateActiveItem((prev) => ({
                                ...prev,
                                techStack: [...prev.techStack, newTechTag.trim()],
                              }));
                              setNewTechTag('');
                              setIsAddingTag(false);
                            }
                          }}
                          className="px-2 py-1 bg-cyan-500 text-white rounded text-xs font-mono"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PRODUCT SPECIFICATIONS & 4 CAPABILITY CARDS */}
              <div className="lg:col-span-6 space-y-6">
                {/* Category & Title */}
                <div>
                  {isPreviewMode ? (
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 block mb-2">
                      {activeItem.category}
                    </span>
                  ) : (
                    <div className="mb-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={activeItem.category}
                        onChange={(e) => updateActiveItem((prev) => ({ ...prev, category: e.target.value }))}
                        className="font-mono text-xs uppercase tracking-widest text-cyan-400 bg-slate-900 border border-cyan-500/30 rounded-lg px-2.5 py-1 w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="Enterprise & Finance"
                      />
                    </div>
                  )}

                  {isPreviewMode ? (
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
                      {activeItem.title}
                    </h3>
                  ) : (
                    <div className="mb-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={activeItem.title}
                        onChange={(e) => updateActiveItem((prev) => ({ ...prev, title: e.target.value }))}
                        className="text-xl sm:text-2xl font-bold text-white bg-slate-900 border border-white/20 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-[#2384ba]"
                        placeholder="Product Title..."
                      />
                    </div>
                  )}

                  {isPreviewMode ? (
                    <div className="text-sm font-medium text-[#2384ba] mt-1 font-mono">
                      {activeItem.subtitle}
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={activeItem.subtitle}
                        onChange={(e) => updateActiveItem((prev) => ({ ...prev, subtitle: e.target.value }))}
                        className="text-sm font-medium text-cyan-300 bg-slate-900 border border-cyan-500/30 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="Subtitle..."
                      />
                    </div>
                  )}

                  {isPreviewMode ? (
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4 font-sans">
                      {activeItem.description}
                    </p>
                  ) : (
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Overview Description
                      </label>
                      <textarea
                        rows={3}
                        value={activeItem.description}
                        onChange={(e) =>
                          updateActiveItem((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="text-sm text-slate-300 bg-slate-900 border border-white/20 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#2384ba]"
                        placeholder="Product description..."
                      />
                    </div>
                  )}
                </div>

                {/* 4 ARCHITECTURAL CAPABILITY CARDS (INLINE EDITABLE) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
                      Key Architectural Capabilities ({activeItem.capabilities.length})
                    </span>
                    {!isPreviewMode && (
                      <button
                        onClick={() => {
                          updateActiveItem((prev) => ({
                            ...prev,
                            capabilities: [
                              ...prev.capabilities,
                              {
                                title: 'New Capability Pillar',
                                description: 'Description of architectural capability...',
                                iconName: 'ShieldCheck',
                              },
                            ],
                          }));
                        }}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Capability</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeItem.capabilities.map((cap, idx) => {
                      const IconComp = getModuleIcon(cap.iconName);

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-white/10 bg-slate-900/70 hover:border-cyan-500/40 transition-all space-y-2 group/card relative"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {!isPreviewMode ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const tabIdx = items.findIndex((i) => i.id === activeItem.id);
                                    setIconPickerTarget({
                                      type: 'capability',
                                      tabIndex: tabIdx,
                                      capIndex: idx,
                                      currentIcon: cap.iconName || 'ShieldCheck',
                                      title: cap.title || 'Capability Icon',
                                    });
                                  }}
                                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-[#2384ba]/20 hover:bg-[#2384ba]/30 border border-[#2384ba]/40 hover:border-cyan-400 text-cyan-400 transition-all cursor-pointer group/capicon"
                                  title="Click to pick capability icon"
                                >
                                  <IconComp className="w-4 h-4 group-hover/capicon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-mono text-cyan-300 truncate max-w-[90px]">
                                    {cap.iconName || 'ShieldCheck'}
                                  </span>
                                  <span className="text-[9px] text-cyan-400/70">▾</span>
                                </button>
                              ) : (
                                <div className="p-2 rounded-lg bg-[#2384ba]/20 text-cyan-400">
                                  <IconComp className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {!isPreviewMode && (
                              <button
                                onClick={() => {
                                  updateActiveItem((prev) => ({
                                    ...prev,
                                    capabilities: prev.capabilities.filter((_, i) => i !== idx),
                                  }));
                                }}
                                className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                                title="Remove capability"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Capability Title */}
                          {isPreviewMode ? (
                            <h4 className="text-sm font-semibold text-white font-display">
                              {cap.title}
                            </h4>
                          ) : (
                            <input
                              type="text"
                              value={cap.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateActiveItem((prev) => {
                                  const nextCaps = [...prev.capabilities];
                                  nextCaps[idx] = { ...nextCaps[idx], title: val };
                                  return { ...prev, capabilities: nextCaps };
                                });
                              }}
                              className="text-xs font-bold text-white bg-slate-950 border border-white/20 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              placeholder="Capability Title"
                            />
                          )}

                          {/* Capability Description */}
                          {isPreviewMode ? (
                            <p className="text-xs text-slate-400 font-sans leading-relaxed">
                              {cap.description}
                            </p>
                          ) : (
                            <textarea
                              rows={2}
                              value={cap.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateActiveItem((prev) => {
                                  const nextCaps = [...prev.capabilities];
                                  nextCaps[idx] = { ...nextCaps[idx], description: val };
                                  return { ...prev, capabilities: nextCaps };
                                });
                              }}
                              className="text-[11px] text-slate-300 bg-slate-950 border border-white/10 rounded p-1.5 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              placeholder="Description..."
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DIRECT ACTION CTA BUTTONS */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 font-mono text-xs">
                  <Link
                    href={`/solutions/${activeItem.id}`}
                    target="_blank"
                    className="px-5 py-3 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-bold flex items-center gap-2 shadow-lg shadow-[#2384ba]/20 hover:scale-[1.02] transition-all"
                  >
                    <Zap className="w-4 h-4 text-cyan-300" />
                    <span>Explore Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/demo?product=${activeItem.id}`}
                    target="_blank"
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white font-bold flex items-center gap-2 transition-all"
                  >
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Book Demo</span>
                  </Link>

                  <Link
                    href={`/admin/designer/${activeItem.id}`}
                    className="px-4 py-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 ml-auto transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open Product Page Wix Designer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* HERO IMAGE MODAL (URL, UPLOAD, GALLERY PRESETS) */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-white/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm font-display">
                  Set Showcase Mockup Image — {activeItem?.tabLabel}
                </h3>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/10 bg-slate-900/40 px-6 pt-3 gap-4 font-mono text-xs">
              <button
                onClick={() => setImageTab('gallery')}
                className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
                  imageTab === 'gallery'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Enterprise 8K Gallery Presets
              </button>
              <button
                onClick={() => setImageTab('url')}
                className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
                  imageTab === 'url'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Direct Image URL
              </button>
              <button
                onClick={() => setImageTab('upload')}
                className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors ${
                  imageTab === 'upload'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload from Computer
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {imageTab === 'gallery' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_GALLERY_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        updateActiveItem((prev) => ({ ...prev, imageSrc: preset.url }));
                        setImageModalOpen(false);
                      }}
                      className="group text-left rounded-xl border border-white/10 bg-slate-900/80 hover:border-cyan-500 overflow-hidden transition-all focus:outline-none"
                    >
                      <div className="aspect-[16/10] bg-slate-800 overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-[11px] font-bold text-white truncate font-mono">
                          {preset.label}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">{preset.url}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {imageTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Paste Public HTTPS Image URL
                    </label>
                    <input
                      type="url"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      placeholder="https://example.com/screenshot.jpg"
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {tempImageUrl && (
                    <div className="rounded-xl border border-white/10 bg-slate-900 p-2">
                      <div className="text-[10px] font-mono text-slate-400 mb-1">Preview:</div>
                      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-950">
                        <img
                          src={tempImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/hero_erp.jpg';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        if (tempImageUrl) {
                          updateActiveItem((prev) => ({ ...prev, imageSrc: tempImageUrl }));
                          setImageModalOpen(false);
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-mono text-xs font-bold"
                    >
                      Apply Image URL
                    </button>
                  </div>
                </div>
              )}

              {imageTab === 'upload' && (
                <div className="space-y-4 text-center">
                  <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-colors bg-cyan-950/10">
                    <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-white mb-1">
                      Upload Screenshot or Product Mockup
                    </p>
                    <p className="text-xs text-slate-400 font-mono mb-4">
                      PNG, JPG, or WEBP. Automatically compressed and stored into CMS.
                    </p>
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-mono text-xs font-bold cursor-pointer shadow-lg">
                      <Upload className="w-4 h-4" />
                      <span>Choose Local File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={!!iconPickerTarget}
        onClose={() => setIconPickerTarget(null)}
        selectedIconName={iconPickerTarget?.currentIcon}
        moduleTitle={iconPickerTarget?.title}
        onSelectIcon={(newIconName) => {
          if (!iconPickerTarget) return;
          if (iconPickerTarget.type === 'tab' && iconPickerTarget.tabIndex !== undefined) {
            const nextItems = [...items];
            if (nextItems[iconPickerTarget.tabIndex]) {
              nextItems[iconPickerTarget.tabIndex] = {
                ...nextItems[iconPickerTarget.tabIndex],
                iconName: newIconName,
              };
              setItems(nextItems);
            }
          } else if (
            iconPickerTarget.type === 'capability' &&
            iconPickerTarget.tabIndex !== undefined &&
            iconPickerTarget.capIndex !== undefined
          ) {
            const nextItems = [...items];
            const targetItem = nextItems[iconPickerTarget.tabIndex];
            if (targetItem && targetItem.capabilities[iconPickerTarget.capIndex]) {
              const nextCaps = [...targetItem.capabilities];
              nextCaps[iconPickerTarget.capIndex] = {
                ...nextCaps[iconPickerTarget.capIndex],
                iconName: newIconName,
              };
              nextItems[iconPickerTarget.tabIndex] = {
                ...targetItem,
                capabilities: nextCaps,
              };
              setItems(nextItems);
            }
          }
        }}
      />
    </div>
  );
}
