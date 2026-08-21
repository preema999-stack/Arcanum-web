'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCms } from '@/lib/cmsContext';
import { ARCANUM_MODULES, ModuleItem } from '@/data/arcanumData';
import {
  getProductDetails,
  ProductDetailItem,
  PageThemeType,
  AccentColorType,
  HeroStyleType,
  InteractiveWidgetType,
  ProductSectionVisibility,
  ARCHETYPE_TEMPLATES,
} from '@/data/productDetailsData';
import { ProductPageView, THEME_TITLES } from '@/components/ProductPageView';
import {
  ArrowLeft,
  Palette,
  Sparkles,
  ExternalLink,
  Save,
  ChevronDown,
  Building2,
  Landmark,
  HeartPulse,
  GraduationCap,
  Database,
  Boxes,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Settings2,
  Check,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

import { IconPickerModal, getModuleIcon } from '@/components/IconPickerModal';

type ActiveModalType = null | 'theme' | 'sections' | 'metadata';

export default function ProductDesignerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { content, updateCmsContent } = useCms();

  const rawId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const fallbackModule: ModuleItem = useMemo(() => ({
    id: rawId || 'custom-solution',
    title: 'Enterprise Solution',
    category: 'Enterprise',
    subtitle: 'Custom Architecture Subsystem',
    description: 'Comprehensive enterprise-grade solution engineered with modular microservices and automated workflows.',
    features: ['Modular Architecture', 'High Throughput API', 'Strict RBAC Security'],
    iconName: 'Building2',
  }), [rawId]);

  const modulesList = useMemo(() => {
    return Array.isArray(content?.modules) && content.modules.length > 0
      ? content.modules
      : (ARCANUM_MODULES && ARCANUM_MODULES.length > 0 ? ARCANUM_MODULES : [fallbackModule]);
  }, [content?.modules, fallbackModule]);

  // Find module index
  const activeModuleIndex = useMemo(() => {
    if (!rawId) return 0;
    const idx = modulesList.findIndex(
      (m) =>
        m.id?.toLowerCase() === rawId.toLowerCase() ||
        m.slug?.toLowerCase() === rawId.toLowerCase() ||
        m.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId.toLowerCase()
    );
    return idx !== -1 ? idx : 0;
  }, [modulesList, rawId]);

  const activeModule: ModuleItem = modulesList[activeModuleIndex] || modulesList[0] || fallbackModule;

  const getSafePageDetails = (mod?: ModuleItem | null): ProductDetailItem => {
    const targetMod = mod || activeModule || fallbackModule;
    const defaults = getProductDetails(targetMod);
    if (!targetMod.pageDetails) return JSON.parse(JSON.stringify(defaults));
    const pd = targetMod.pageDetails;
    return {
      ...defaults,
      ...pd,
      heroBadge: pd.heroBadge || defaults.heroBadge,
      heroSubtitle: pd.heroSubtitle || targetMod.subtitle || defaults.heroSubtitle || targetMod.title,
      heroImage: pd.heroImage || targetMod.imageSrc || defaults.heroImage,
      ctaPrimaryText: pd.ctaPrimaryText || 'Book a Demo / Discovery',
      ctaSecondaryText: pd.ctaSecondaryText || 'Download PDF Spec',
      ctaSecondaryUrl: pd.ctaSecondaryUrl || targetMod.brochureUrl || '',
      showSecondaryCta: pd.showSecondaryCta !== false && pd.sectionVisibility?.secondaryCta !== false,
      brochureUrl: pd.brochureUrl || targetMod.brochureUrl || '',
      sectionVisibility: {
        hero: pd.sectionVisibility?.hero !== false,
        secondaryCta: pd.sectionVisibility?.secondaryCta !== false && pd.showSecondaryCta !== false,
        metrics: pd.sectionVisibility?.metrics !== false,
        widget: pd.sectionVisibility?.widget !== false,
        submodules: pd.sectionVisibility?.submodules !== false,
        industries: pd.sectionVisibility?.industries !== false,
        compliance: pd.sectionVisibility?.compliance !== false,
        faqs: pd.sectionVisibility?.faqs !== false,
        related: pd.sectionVisibility?.related !== false,
        ...(pd.sectionVisibility || {}),
      },
      customTitles: {
        ...(defaults.customTitles || {}),
        ...(pd.customTitles || {}),
      },
      architecture: {
        ...defaults.architecture,
        ...(pd.architecture || {}),
      },
      mockData: {
        ...defaults.mockData,
        ...(pd.mockData || {}),
        records: pd.mockData?.records?.length ? pd.mockData.records : defaults.mockData.records,
        systemLogs: pd.mockData?.systemLogs?.length ? pd.mockData.systemLogs : defaults.mockData.systemLogs,
        workflowSteps: pd.mockData?.workflowSteps?.length ? pd.mockData.workflowSteps : defaults.mockData.workflowSteps,
        codeDiff: pd.mockData?.codeDiff || defaults.mockData.codeDiff,
      },
      metrics: pd.metrics?.length ? pd.metrics : defaults.metrics,
      subModules: pd.subModules?.length ? pd.subModules : defaults.subModules,
      faqs: pd.faqs?.length ? pd.faqs : defaults.faqs,
      targetIndustry: pd.targetIndustry?.length ? pd.targetIndustry : defaults.targetIndustry,
      deploymentModes: pd.deploymentModes?.length ? pd.deploymentModes : defaults.deploymentModes,
      complianceList: pd.complianceList?.length ? pd.complianceList : defaults.complianceList,
    };
  };

  // Draft Data States for the current module
  const [moduleInfoDraft, setModuleInfoDraft] = useState<ModuleItem>({ ...activeModule });
  const [pageEditorDraft, setPageEditorDraft] = useState<ProductDetailItem>(() => getSafePageDetails(activeModule));

  // Global Configuration Modal State
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Re-sync drafts whenever the active module changes
  useEffect(() => {
    if (activeModule) {
      setModuleInfoDraft({ ...activeModule });
      setPageEditorDraft(getSafePageDetails(activeModule));
    }
  }, [activeModule?.id, activeModuleIndex]);

  // Lock body scroll and pause Lenis when any modal is open
  useEffect(() => {
    if (activeModal || isIconPickerOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if ((window as any).__lenis) {
        (window as any).__lenis.stop();
      }
      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        if ((window as any).__lenis) {
          (window as any).__lenis.start();
          (window as any).__lenis.resize();
        }
      };
    }
  }, [activeModal, isIconPickerOpen]);

  // Section Toggle Helper
  const handleToggleSectionVisibility = (sectionKey: keyof ProductSectionVisibility, visible: boolean) => {
    setPageEditorDraft((prev) => ({
      ...prev,
      sectionVisibility: {
        ...(prev.sectionVisibility || {}),
        [sectionKey]: visible,
      },
    }));
  };

  // Apply archetype preset content template
  const handleApplyArchetypeTemplate = (themeKey: PageThemeType) => {
    const template = ARCHETYPE_TEMPLATES[themeKey];
    if (!template) return;
    setPageEditorDraft((prev) => ({
      ...prev,
      ...template,
    }));
    setToastMessage(`✨ Applied "${THEME_TITLES[themeKey]}" template presets!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle saving changes to Firebase
  const handleSaveToFirebase = async () => {
    if (!activeModule) return;
    setSaveStatus('saving');

    const updatedModule: ModuleItem = {
      ...moduleInfoDraft,
      subtitle: pageEditorDraft.heroSubtitle || moduleInfoDraft.subtitle,
      pageDetails: pageEditorDraft,
    };

    const updatedModules = [...modulesList];
    updatedModules[activeModuleIndex] = updatedModule;

    const newContent = {
      ...content,
      modules: updatedModules,
    };

    try {
      const success = await updateCmsContent(newContent);
      if (success) {
        setSaveStatus('saved');
        setToastMessage(`✅ Successfully saved and updated "${updatedModule.title}" to Firebase!`);
        setTimeout(() => setSaveStatus('idle'), 3500);
      } else {
        setSaveStatus('saved');
        setToastMessage(`Saved locally to CMS state.`);
        setTimeout(() => setSaveStatus('idle'), 3500);
      }
    } catch (err) {
      console.error('Error saving to Firebase:', err);
      setSaveStatus('error');
      setToastMessage(`Failed to update to Firebase.`);
      setTimeout(() => setSaveStatus('idle'), 3500);
    }
  };

  const activeSlug = moduleInfoDraft.slug || moduleInfoDraft.id || activeModule.id;
  const CategoryIcon = getModuleIcon(moduleInfoDraft.iconName, moduleInfoDraft.category);
  const currentVisibility = pageEditorDraft.sectionVisibility || {};

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans flex flex-col selection:bg-[#2384ba]/30 selection:text-white">
      {/* ========================================================================= */}
      {/* STICKY TOP DESIGNER COMMAND BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Back Link & Quick Module Selector */}
          <div className="flex items-center space-x-3">
            <Link
              href="/admin"
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 text-xs font-mono flex items-center space-x-1.5 transition-all shadow-sm group"
              title="Return to Admin Dashboard"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Admin CMS</span>
            </Link>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(true)}
                className="h-9 w-9 rounded-xl bg-[#2384ba]/20 hover:bg-[#2384ba]/30 border border-[#2384ba]/40 hover:border-[#2384ba] flex items-center justify-center text-[#2384ba] shrink-0 transition-all cursor-pointer group/iconbtn"
                title="Change Module Icon"
              >
                <CategoryIcon className="h-4 w-4 group-hover/iconbtn:scale-110 transition-transform" />
              </button>

              {/* Quick Module Switcher Dropdown */}
              <div className="relative group">
                <select
                  value={activeModule.id}
                  onChange={(e) => {
                    const targetId = e.target.value;
                    router.push(`/admin/designer/${targetId}`);
                  }}
                  className="appearance-none bg-slate-950/90 hover:bg-slate-950 border border-white/15 hover:border-[#2384ba]/50 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-white font-mono cursor-pointer focus:outline-none focus:border-[#2384ba] transition-all shadow-inner"
                >
                  {modulesList.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.title} ({m.category}) {m.pageDetails ? '✨ Custom' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Action Controls: Layout Settings, Section Manager, Card Metadata, and Save */}
          <div className="flex items-center space-x-2 flex-wrap">
            {/* Section Visibility Manager */}
            <button
              onClick={() => setActiveModal('sections')}
              className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Show, hide, or remove any section from the page"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Section Manager</span>
            </button>

            {/* Layout Archetype & Themes */}
            <button
              onClick={() => setActiveModal('theme')}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Set layout archetype, hero style, neon accent, and interactive widget"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Theme & Layout</span>
            </button>

            {/* Card Metadata */}
            <button
              onClick={() => setActiveModal('metadata')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
              title="Edit Catalog Card Title, Category, URL slug, Brochure PDF link"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Card & Slug</span>
            </button>

            {/* Live Page Link */}
            <a
              href={`/solutions/${activeSlug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-mono hidden xl:flex items-center space-x-1.5 transition-colors"
              title="Open public live page in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#2384ba]" />
              <span>Live Page</span>
            </a>

            {/* Update to Firebase Button */}
            <button
              onClick={handleSaveToFirebase}
              disabled={saveStatus === 'saving'}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center space-x-2 transition-all shadow-xl shadow-emerald-900/40 active:scale-95 cursor-pointer"
            >
              {saveStatus === 'saving' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="h-4 w-4 text-emerald-200" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saveStatus === 'saving' ? 'Updating...' : saveStatus === 'saved' ? 'Updated!' : 'Update to Firebase'}</span>
            </button>
          </div>
        </div>

        {/* Visual Edit Helper Pill */}
        <div className="border-t border-white/5 bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-bold">WIX-STYLE DIRECT INLINE EDITING:</span>
            <span>Click and type directly into any text, headline, metric, or card on the page!</span>
          </div>
          <div className="hidden sm:block text-slate-500">
            Route: <span className="text-cyan-400">/solutions/{activeSlug}</span>
          </div>
        </div>
      </header>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[10000] max-w-md px-4 py-3 bg-emerald-950/95 border border-emerald-500/60 rounded-2xl text-emerald-100 text-xs font-mono flex items-center justify-between shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-emerald-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIRECT VISUAL PAGE WITH INLINE EDITING (NO TEXT POPUPS) */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full pb-32">
        <ProductPageView
          module={moduleInfoDraft}
          productDetails={pageEditorDraft}
          modulesList={modulesList}
          isPreview={true}
          isEditable={true}
          onOpenContact={() => {}}
          onOpenBrochures={() => {}}
          onUpdateProductDetails={(updater) => setPageEditorDraft((prev) => updater(prev))}
          onUpdateModule={(updater) => setModuleInfoDraft((prev) => updater(prev))}
          onOpenThemeSettings={() => setActiveModal('theme')}
          onOpenSectionManager={() => setActiveModal('sections')}
          onToggleSectionVisibility={handleToggleSectionVisibility}
        />
      </main>

      {/* ========================================================================= */}
      {/* GLOBAL CONFIGURATION MODALS WITH FIXED HEADER, FOOTER & ISOLATED SCROLL */}
      {/* ========================================================================= */}

      {/* MODAL 1: SECTION VISIBILITY MANAGER */}
      {activeModal === 'sections' && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Fixed Modal Header */}
            <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-2.5">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-white">Section Visibility & Removal Manager</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Toggle sections on or off to customize the page layout. Hidden sections will not appear on the live public page.
              </p>

              <div className="space-y-3">
                {[
                  { key: 'hero', title: '1. Hero & Executive Summary', desc: 'Main headline, SLA badge, narrative, CTAs & hero media.' },
                  { key: 'secondaryCta', title: '• Download PDF / Spec Button', desc: 'Secondary download CTA button with direct link in the hero.' },
                  { key: 'metrics', title: '2. Key Benchmark Performance Metrics', desc: 'KPI cards with values, labels, and trend badges.' },
                  { key: 'widget', title: '3. Interactive Mid-Page Feature Widget', desc: 'Live Telemetry, AST Code Diff, or Workflow stages.' },
                  { key: 'submodules', title: '4. Core Modular Subsystems & Capabilities', desc: 'Grid of subsystem cards with feature bullet points.' },
                  { key: 'industries', title: '5. Target Industries & Deployment Reach', desc: 'Sector tags and deployment topology list.' },
                  { key: 'compliance', title: '6. Regulatory Standards & Statutory Seals', desc: 'Certified compliance seals and statutory credentials.' },
                  { key: 'faqs', title: '7. Technical Enterprise FAQs', desc: 'Frequently asked questions and detailed answers.' },
                  { key: 'related', title: '8. Related Products in Catalog', desc: 'Cross-navigation cards to other Arcanum solutions.' },
                ].map((sec) => {
                  const isVisible = currentVisibility[sec.key as keyof ProductSectionVisibility] !== false;
                  return (
                    <div
                      key={sec.key}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isVisible ? 'bg-slate-950 border-white/15' : 'bg-rose-950/20 border-rose-500/20 opacity-70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${isVisible ? 'text-white' : 'text-rose-300'}`}>
                            {sec.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isVisible
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isVisible ? 'ACTIVE / VISIBLE' : 'HIDDEN / REMOVED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{sec.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility(sec.key as keyof ProductSectionVisibility, !isVisible)}
                        className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer ${
                          isVisible
                            ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isVisible ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide Section</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show Section</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fixed Modal Footer */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-3 z-10">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#2384ba] hover:bg-[#1b6ca1] text-white rounded-xl font-mono text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Apply Section Visibility
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LAYOUT ARCHETYPE, ACCENT & WIDGET */}
      {activeModal === 'theme' && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Fixed Modal Header */}
            <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-2.5">
                <Palette className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg text-white">Layout Architecture, Themes & Styles</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 overscroll-contain">
              {/* 1. Page Theme Archetype */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-slate-300 font-bold uppercase">
                    PAGE THEME ARCHETYPE
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    Select archetype & optionally apply rich content presets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'enterprise-erp', label: '💼 Enterprise ERP & Operations', desc: 'Deep architecture overview with modular swimlanes & KPIs.' },
                    { id: 'fintech', label: '⚡ High-Frequency Fintech & Switch', desc: 'Cyber telemetry, real-time TPS counters, settlement ticker.' },
                    { id: 'clinical-health', label: '🏥 Clinical Healthcare & EMR Hub', desc: 'Health vitals monitor, FHIR bridge, and patient lifecycle.' },
                    { id: 'academic-edu', label: '🎓 Academic SIS & Campus Engine', desc: '360° student lifecycle, multi-campus synchronizer.' },
                    { id: 'developer-dev', label: '💻 Developer & Legacy Modernization', desc: 'Side-by-side AST code diff viewer & CLI terminal.' },
                    { id: 'saas-modern', label: '🚀 Modern Digital Workspace SaaS', desc: 'Dynamic interactive feature grid & instant sandbox.' },
                  ].map((t) => {
                    const isSelected = (pageEditorDraft.theme || 'enterprise-erp') === t.id;
                    return (
                      <div
                        key={t.id}
                        className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#2384ba]/20 border-[#2384ba] shadow-lg ring-1 ring-[#2384ba]'
                            : 'bg-slate-950 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setPageEditorDraft({ ...pageEditorDraft, theme: t.id as PageThemeType })}
                          className="text-left w-full cursor-pointer"
                        >
                          <div className="font-bold text-xs text-white mb-1">{t.label}</div>
                          <div className="text-[11px] text-slate-400 leading-relaxed mb-2">{t.desc}</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyArchetypeTemplate(t.id as PageThemeType)}
                          className="mt-2 w-full py-1.5 bg-white/5 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Load authentic default headline, highlight, and narrative for this theme"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Load Template Content</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Accent Color Palette */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono text-slate-300 font-bold uppercase">
                  ACCENT COLOR PALETTE & NEON GLOW
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { id: 'blue', label: 'Electric Blue', hex: '#2384ba', border: 'border-[#2384ba]' },
                    { id: 'emerald', label: 'Cyber Emerald', hex: '#10b981', border: 'border-emerald-500' },
                    { id: 'violet', label: 'Quantum Violet', hex: '#8b5cf6', border: 'border-purple-500' },
                    { id: 'amber', label: 'Amber Gold', hex: '#f59e0b', border: 'border-amber-500' },
                    { id: 'cyan', label: 'High-Tech Cyan', hex: '#06b6d4', border: 'border-cyan-500' },
                    { id: 'rose', label: 'Radiant Rose', hex: '#f43f5e', border: 'border-rose-500' },
                  ].map((c) => {
                    const isSelected = (pageEditorDraft.accentColor || 'blue') === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setPageEditorDraft({ ...pageEditorDraft, accentColor: c.id as AccentColorType })}
                        className={`p-3 rounded-xl border flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                          isSelected ? `bg-white/10 ${c.border} ring-2 ring-white/40` : 'bg-slate-950 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: c.hex }} />
                        <span className="text-[11px] font-mono text-white">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Hero Section Presentation Style */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono text-slate-300 font-bold uppercase">
                  HERO SECTION PRESENTATION STYLE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {[
                    { id: 'split-console', label: 'Split Visual Simulator', desc: 'Two-column layout with product overview on left & interactive telemetry on right.' },
                    { id: 'command-hud', label: 'Full-Width Command HUD', desc: 'Panoramic header with real-time throughput status meters & high-impact badges.' },
                    { id: 'code-diff', label: 'AST Code Migration Diff', desc: 'Developer view featuring side-by-side legacy vs cloud native TypeScript code diff.' },
                    { id: 'workflow-pipeline', label: 'Multi-Stage Workflow Pipeline', desc: 'Interactive 4-stage operational process cards with latency metrics.' },
                  ].map((h) => {
                    const isSelected = (pageEditorDraft.heroStyle || 'split-console') === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setPageEditorDraft({ ...pageEditorDraft, heroStyle: h.id as HeroStyleType })}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected ? 'bg-[#2384ba]/20 border-[#2384ba] shadow-md ring-1 ring-[#2384ba]' : 'bg-slate-950 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold text-white mb-1">{h.label}</div>
                        <div className="text-[11px] text-slate-400 font-sans leading-relaxed">{h.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Primary Interactive Mid-Page Widget */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono text-slate-300 font-bold uppercase">
                  PRIMARY INTERACTIVE MID-PAGE WIDGET
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                  {[
                    { id: 'live-telemetry', label: 'Live Operations Table', desc: 'Filterable records + streaming live logs + health probe.' },
                    { id: 'code-transform', label: 'Code Refactoring Playground', desc: 'Interactive legacy vs modern microservice code comparison.' },
                    { id: 'workflow-pipeline', label: 'Interactive Process Pipeline', desc: 'Clickable stage cards with transaction breakdown.' },
                    { id: 'vital-monitor', label: 'Clinical Vitals Monitor', desc: 'Healthcare & EMR interoperability status nodes.' },
                    { id: 'campus-lifecycle', label: 'Campus Academic Lifecycle', desc: 'Student journey & multi-campus sync timeline.' },
                  ].map((w) => {
                    const isSelected = (pageEditorDraft.interactiveWidget || 'live-telemetry') === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setPageEditorDraft({ ...pageEditorDraft, interactiveWidget: w.id as InteractiveWidgetType })}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected ? 'bg-[#2384ba]/20 border-[#2384ba] shadow-md ring-1 ring-[#2384ba]' : 'bg-slate-950 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold text-white mb-1">{w.label}</div>
                        <div className="text-[10px] text-slate-400 font-sans leading-relaxed">{w.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fixed Modal Footer */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-3 z-10">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#2384ba] hover:bg-[#1b6ca1] text-white rounded-xl font-mono text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Apply Layout Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CARD & SLUG METADATA */}
      {activeModal === 'metadata' && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Fixed Modal Header */}
            <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-2.5">
                <Settings2 className="w-5 h-5 text-[#2384ba]" />
                <h3 className="font-bold text-lg text-white">Catalog Card & Metadata</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 overscroll-contain">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">CATALOG TITLE</label>
                  <input
                    type="text"
                    value={moduleInfoDraft.title}
                    onChange={(e) => setModuleInfoDraft({ ...moduleInfoDraft, title: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">CATEGORY</label>
                  <select
                    value={moduleInfoDraft.category}
                    onChange={(e) => setModuleInfoDraft({ ...moduleInfoDraft, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Banking">Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Workspace">Workspace</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">MODULE ICON</label>
                  <button
                    type="button"
                    onClick={() => setIsIconPickerOpen(true)}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-[#2384ba]/60 rounded-xl px-3.5 py-2 text-xs text-white flex items-center justify-between transition-all cursor-pointer group/pickbtn"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[#2384ba]/20 border border-[#2384ba]/40 text-[#2384ba] flex items-center justify-center shrink-0">
                        <CategoryIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono text-xs text-cyan-300 font-semibold truncate">
                        {moduleInfoDraft.iconName || 'Building2'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover/pickbtn:text-[#2384ba] transition-colors shrink-0 ml-1">
                      Pick ▾
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">URL SLUG (/solutions/[slug])</label>
                  <input
                    type="text"
                    placeholder={moduleInfoDraft.id}
                    value={moduleInfoDraft.slug || ''}
                    onChange={(e) =>
                      setModuleInfoDraft({ ...moduleInfoDraft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })
                    }
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">OFFICIAL BROCHURE PDF LINK</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={moduleInfoDraft.brochureUrl || ''}
                    onChange={(e) => setModuleInfoDraft({ ...moduleInfoDraft, brochureUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-slate-300 font-bold uppercase">HERO IMAGE (URL OR UPLOAD BASE64)</label>
                  {pageEditorDraft.heroImage && (
                    <button
                      type="button"
                      onClick={() => setPageEditorDraft({ ...pageEditorDraft, heroImage: '' })}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... or /hero_infrastructure.png or Base64"
                    value={pageEditorDraft.heroImage || ''}
                    onChange={(e) => setPageEditorDraft({ ...pageEditorDraft, heroImage: e.target.value })}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-[#2384ba]"
                  />

                  <label className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const maxDim = 1200;
                            let w = img.width;
                            let h = img.height;
                            if (w > maxDim || h > maxDim) {
                              if (w > h) {
                                h = Math.round((h * maxDim) / w);
                                w = maxDim;
                              } else {
                                w = Math.round((w * maxDim) / h);
                                h = maxDim;
                              }
                            }
                            canvas.width = w;
                            canvas.height = h;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, w, h);
                              const compressed = canvas.toDataURL('image/jpeg', 0.82);
                              setPageEditorDraft((prev) => ({ ...prev, heroImage: compressed }));
                              setModuleInfoDraft((prev) => ({ ...prev, imageSrc: compressed }));
                            } else {
                              const res = event.target?.result as string;
                              setPageEditorDraft((prev) => ({ ...prev, heroImage: res }));
                              setModuleInfoDraft((prev) => ({ ...prev, imageSrc: res }));
                            }
                          };
                          img.src = event.target?.result as string;
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>

                {pageEditorDraft.heroImage && (
                  <div className="mt-2 relative w-32 aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-white/15">
                    <img src={pageEditorDraft.heroImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">CATALOG DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={moduleInfoDraft.description}
                  onChange={(e) => setModuleInfoDraft({ ...moduleInfoDraft, description: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-[#2384ba]"
                />
              </div>
            </div>

            {/* Fixed Modal Footer */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-3 z-10">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#2384ba] hover:bg-[#1b6ca1] text-white rounded-xl font-mono text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Apply Metadata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        selectedIconName={moduleInfoDraft.iconName}
        moduleTitle={moduleInfoDraft.title}
        onSelectIcon={(newIconName) => {
          setModuleInfoDraft({ ...moduleInfoDraft, iconName: newIconName });
        }}
      />
    </div>
  );
}
