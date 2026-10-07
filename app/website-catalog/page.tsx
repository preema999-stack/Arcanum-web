'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop,
  Tablet,
  Smartphone,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Cpu,
  Server,
  Building2,
  Landmark,
  UtensilsCrossed,
  HeartPulse,
  LineChart,
  Database,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  X,
  Send,
  Eye,
  Lock,
  Check,
  Globe,
  Briefcase,
  Flame,
  FileText,
  Boxes,
  HelpCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
} from 'lucide-react';

type DeviceMode = 'trio' | 'macbook' | 'ipad' | 'iphone';

export interface ClientCaseStudy {
  id: string;
  number: string;
  title: string;
  client: string;
  category: string;
  year: string;
  tagline: string;
  summary: string;
  imageSrc: string;
  tabletImageSrc?: string;
  mobileImageSrc?: string;
  mockUrl: string;
  deliverables: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  liveStatus: string;
  isCurrentlyBuilding?: boolean;
  architecture: {
    runtime: string;
    database: string;
    security: string;
    scalability: string;
  };
}

const LUXURY_PORTFOLIO_PROJECTS: ClientCaseStudy[] = [
  {
    id: 'arc-x1-erp',
    number: '01',
    title: 'ARC X1 ERP',
    client: 'Enterprise Conglomerates & Multi-Entity Groups (UAE)',
    category: 'Enterprise & Finance Core',
    year: '2026',
    tagline: 'Multi-Entity Financial Ledger & Supply Chain',
    summary:
      'High-velocity enterprise platform engineered for multi-company consolidation, automated UAE VAT compliance, and multi-warehouse logistics.',
    imageSrc: '/hero_erp.jpg',
    mockUrl: 'https://x1-erp.arcanum.ae',
    deliverables: [
      'Multi-Entity Ledger & Multi-Currency Consolidation',
      'Automated UAE VAT & Corporate Tax Filing',
      'Multi-Warehouse Logistics & Serial/Batch Tracking',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [
      { label: 'LATENCY', value: '< 6ms' },
      { label: 'UPTIME SLA', value: '99.99%' },
      { label: 'AUDIT', value: '100% UAE VAT' },
    ],
    liveStatus: 'Active Build • Q1 2026',
    isCurrentlyBuilding: true,
    architecture: {
      runtime: 'Next.js 14 & Node.js Microservices',
      database: 'PostgreSQL (Multi-Tenant Isolation) & Redis',
      security: 'Dual-Authorization RBAC, TLS 1.3, AES-256',
      scalability: 'Horizontal Kubernetes Auto-Scaling',
    },
  },
  {
    id: 'arc-rms',
    number: '02',
    title: 'ARC RMS',
    client: 'Fine Dining Groups, Multi-Branch Chains & Cloud Kitchens',
    category: 'Hospitality & F&B POS',
    year: '2026',
    tagline: 'Restaurant Management & Hospitality POS',
    summary:
      'Hyper-responsive hospitality suite combining visual table floorplans, sub-second Kitchen Display sync, recipe costing, and 100% offline resilience.',
    imageSrc: '/hero_restaurant.jpg',
    mockUrl: 'https://rms.arcanum.ae',
    deliverables: [
      'Interactive Table Floorplans & Seat-Level Billing',
      'Sub-Second Kitchen Display System (KDS) Sync',
      'Gram-Level Recipe & Inventory Costing Engine',
    ],
    techStack: ['Next.js 14', 'WebSockets', 'SQLite Sync', 'PostgreSQL'],
    metrics: [
      { label: 'SYNC', value: '< 20ms' },
      { label: 'OFFLINE', value: '100% Resilient' },
      { label: 'BRANCHES', value: 'Multi-Tenant' },
    ],
    liveStatus: 'Active Build • Q1 2026',
    isCurrentlyBuilding: true,
    architecture: {
      runtime: 'Next.js 14 Edge Runtime & WebSocket Core',
      database: 'PostgreSQL Cluster with Local SQLite Cache',
      security: 'Encrypted Biometric POS Auth, Role Isolation',
      scalability: 'Elastic Cloud Kitchen Routing',
    },
  },
  {
    id: 'emirates-drug-store',
    number: '03',
    title: 'Emirates Drug Store',
    client: 'Emirates Drug Store / UAE Healthcare & Pharmacy Distributors',
    category: 'Pharma Supply Chain & Healthcare',
    year: '2026',
    tagline: 'Pharmaceutical Supply Chain & B2B Portal',
    summary:
      'Bespoke pharmaceutical commerce platform with MOHAP/Tatmeen regulatory batch serialization, cold-chain telemetry, and automated B2B pharmacy reordering.',
    imageSrc: '/hero_clinic.jpg',
    mockUrl: 'https://emiratesdrugstore.ae',
    deliverables: [
      'MOHAP & Tatmeen Serialization & Regulatory Traceability',
      'Pharmaceutical Batch, Lot & Expiry Lifecycle Engine',
      'Cold-Chain Temperature Sensor Alerts & Telemetry',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'HL7 / FHIR', 'Node.js'],
    metrics: [
      { label: 'REGULATORY', value: 'MOHAP / Tatmeen' },
      { label: 'SERIAL TRACE', value: '100% Batch/Lot' },
      { label: 'DISPATCH', value: 'Real-Time Auto-Route' },
    ],
    liveStatus: 'Active Build • Q1 2026',
    isCurrentlyBuilding: true,
    architecture: {
      runtime: 'Next.js 14 & Distributed Event Microservices',
      database: 'TimescaleDB (IoT Cold-Chain) & PostgreSQL',
      security: 'HL7 / FHIR Privacy Compliance, Audit Trail',
      scalability: 'Nationwide Pharmacy Wholesale Grid',
    },
  },
  {
    id: 'al-fadli',
    number: '04',
    title: 'Al Fadli Printing Press',
    client: 'Al Madina Al Eqtisadia Printing Press (Riyadh, KSA)',
    category: 'Commercial Printing & Packaging',
    year: '2025',
    tagline: 'Best Printing Press in Riyadh Since 2005',
    summary:
      "Riyadh's go-to printing press for offset printing, packaging, event branding, and bulk corporate orders — serving businesses across Saudi Arabia since 2005 with fast turnarounds and wholesale pricing.",
    imageSrc: '/al_fadli_desktop.png',
    tabletImageSrc: '/al_fadli_tablet.png',
    mobileImageSrc: '/al_fadli_mobile.png',
    mockUrl: 'https://alfadlipress.com',
    deliverables: [
      'Offset Printing, Custom Packaging & Event Branding',
      'Instant WhatsApp Inquiry & Automated Order Dispatch',
      'Bilingual Arabic / English Commercial Web Experience',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'WhatsApp Business'],
    metrics: [
      { label: 'ESTABLISHED', value: 'Since 2005' },
      { label: 'LOCATION', value: 'Riyadh, KSA' },
      { label: 'CAPACITY', value: 'Bulk & Urgent' },
    ],
    liveStatus: 'Delivered • Live Website',
    architecture: {
      runtime: 'Next.js 14 Edge Runtime & SSR',
      database: 'Cloudflare Edge CDN & Headless Media Assets',
      security: 'Bilingual RTL/LTR Engine, SSL / TLS 1.3 Strict',
      scalability: 'Global Edge Network with Sub-Second Global Load',
    },
  },
  {
    id: 'tomato-tree-digital',
    number: '05',
    title: 'Tomatotree Digital',
    client: 'Tomatotree Digital (Kerala Startup Mission, Kochi)',
    category: 'Digital Agency & Performance Marketing',
    year: '2025',
    tagline: 'Best Digital Marketing Agency in Kerala That Drives Measurable Growth',
    summary:
      'We help businesses get more customers from Google, Google Maps, and AI search through data-driven SEO, performance marketing, and content strategies tied directly to revenue.',
    imageSrc: '/tomato_tree_desktop.png',
    mobileImageSrc: '/tomato_tree_mobile.png',
    mockUrl: 'https://tomatotreedigital.com',
    deliverables: [
      'Google SEO, Maps Visibility & AI Search Optimization',
      'Performance Marketing & Revenue Growth Systems',
      'Interactive Growth Audit & Multi-Channel Ingestion Funnel',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    metrics: [
      { label: 'OUTCOME', value: 'Measurable Growth' },
      { label: 'HUB', value: 'Kochi, Kerala' },
      { label: 'INCUBATED', value: 'KSUM Kochi' },
    ],
    liveStatus: 'Delivered • Live Website',
    architecture: {
      runtime: 'Next.js 14 App Router & Static Edge Generation',
      database: 'Serverless Lead Ingestion & Webhook Integrations',
      security: 'reCAPTCHA v3 & Strict CSP Security Headers',
      scalability: '100/100 Lighthouse Performance & Mobile-First Edge',
    },
  },
  {
    id: 'hrms',
    number: '06',
    title: 'Synapse HRMS',
    client: 'UAE Regional Enterprises & Corporate Groups',
    category: 'Workforce & HRMS',
    year: '2026',
    tagline: 'Workforce Management & WPS Payroll',
    summary:
      'Enterprise workforce operations suite providing 100% automated UAE WPS bank file generation, biometric attendance, and employee self-service.',
    imageSrc: '/hero_hrms.jpg',
    mockUrl: 'https://synapse.arcanum.ae',
    deliverables: [
      'Automated UAE WPS SIF Bank Generation',
      'Biometric Attendance & Shift Rostering',
      'Employee Self-Service (ESS) Portal',
    ],
    techStack: ['Next.js 14', 'Node.js', 'PostgreSQL', 'Docker'],
    metrics: [
      { label: 'WPS AUDIT', value: '100% Automated' },
      { label: 'PROCESSING', value: '< 2 Minutes' },
      { label: 'USERS', value: '150K+ Monthly' },
    ],
    liveStatus: 'UAE Ministry Verified',
    architecture: {
      runtime: 'Node.js & Next.js 14 Fullstack',
      database: 'PostgreSQL with Redis Session Cache',
      security: 'Encrypted UAE National ID & Bank Data',
      scalability: '150,000+ Employee Monthly Runs',
    },
  },
];

export default function StandaloneLightWebsiteCatalogPage() {
  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('trio');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [rfpModalOpen, setRfpModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);

  // Force Pure Light Mode on Body while in website-catalog
  React.useEffect(() => {
    const origBg = document.body.style.backgroundColor;
    const origColor = document.body.style.color;
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
    document.documentElement.classList.add('light');

    return () => {
      document.body.style.backgroundColor = origBg;
      document.body.style.color = origColor;
      document.documentElement.classList.remove('light');
    };
  }, []);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All') return LUXURY_PORTFOLIO_PROJECTS;
    if (selectedFilter === 'Active Build') {
      return LUXURY_PORTFOLIO_PROJECTS.filter((p) => p.isCurrentlyBuilding);
    }
    return LUXURY_PORTFOLIO_PROJECTS.filter((p) =>
      p.category.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  }, [selectedFilter]);

  const activeProject = filteredProjects[activeIndex] || filteredProjects[0] || LUXURY_PORTFOLIO_PROJECTS[0];

  const filterTabs = [
    { label: 'All Projects', value: 'All' },
    { label: '🔥 Active in Build (3)', value: 'Active Build', highlight: true },
    { label: 'Commercial Print', value: 'Printing' },
    { label: 'Digital Agency', value: 'Agency' },
    { label: 'Enterprise ERP', value: 'Enterprise' },
    { label: 'Restaurant & POS', value: 'Hospitality' },
    { label: 'Pharma & Health', value: 'Pharma' },
    { label: 'Workforce & HRMS', value: 'Workforce' },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  // RFP Form state
  const [rfpSubmitted, setRfpSubmitted] = useState(false);
  const [rfpSubmitting, setRfpSubmitting] = useState(false);
  const [rfpError, setRfpError] = useState('');
  const [rfpForm, setRfpForm] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });

  const handleRfpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRfpSubmitting(true);
    setRfpError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${rfpForm.name} (${rfpForm.organization || 'Client'})`,
          email: rfpForm.email,
          module: `[Client Catalog Light] ${activeProject.title}`,
          message: rfpForm.message || `Client requested proposal for ${activeProject.title}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRfpSubmitted(true);
        setTimeout(() => {
          setRfpSubmitted(false);
          setRfpModalOpen(false);
          setRfpForm({ name: '', email: '', organization: '', message: '' });
        }, 3500);
      } else {
        setRfpError(data.error || 'Failed to dispatch proposal request.');
      }
    } catch (err) {
      setRfpSubmitted(true);
      setTimeout(() => {
        setRfpSubmitted(false);
        setRfpModalOpen(false);
      }, 3500);
    } finally {
      setRfpSubmitting(false);
    }
  };

  // Fullscreen Presentation Mode State
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600/15 selection:text-blue-900 flex flex-col antialiased overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* Subtle Warm Studio Background Gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-50/60 via-slate-100/40 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* ========================================================= */}
      {/* 1. STANDALONE LIGHT-MODE TOP NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="h-16 bg-white/95 border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 flex items-center justify-between shrink-0 z-40 backdrop-blur-xl shadow-xs">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <img src="/logo.png" alt="Arcanum Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-base font-display text-slate-900">ARCANUM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  CLIENT SHOWCASE
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block font-medium">
                INDEPENDENT SYSTEMS &amp; WEBSITE CATALOG
              </span>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          {/* Fullscreen Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-sm font-semibold"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen Presentation'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden md:inline">Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden md:inline">Full Screen</span>
              </>
            )}
          </button>

          {/* Direct Email */}
          <a
            href="mailto:info@arcanum.ae"
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-sm font-semibold"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>info@arcanum.ae</span>
          </a>

          {/* Request Proposal */}
          <button
            onClick={() => setRfpModalOpen(true)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/25 transition-all flex items-center space-x-2"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Request Proposal</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. FILTER PILLS & MOCKUP SWITCHER BAR */}
      {/* ========================================================= */}
      <div className="bg-white/80 border-b border-slate-200 px-4 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar font-mono text-xs backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 mr-1 flex items-center space-x-1 font-semibold">
            <Filter className="h-3 w-3" />
            <span>DISCIPLINES:</span>
          </span>
          {filterTabs.map((tab) => {
            const isSelected = selectedFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setSelectedFilter(tab.value);
                  setActiveIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg border transition-all text-xs shrink-0 font-medium ${
                  isSelected
                    ? tab.highlight
                      ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm'
                      : 'bg-blue-600 text-white border-blue-700 font-bold shadow-sm'
                    : tab.highlight
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Device Switcher HUD */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest hidden md:inline font-semibold">
            RESPONSIVE MOCKUP:
          </span>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setDeviceMode('trio')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all ${
                deviceMode === 'trio'
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tri-Device Studio Composition"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">Trio Composition</span>
            </button>

            <button
              onClick={() => setDeviceMode('macbook')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'macbook'
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="MacBook Pro Mockup"
            >
              <Laptop className="h-4 w-4" />
            </button>

            <button
              onClick={() => setDeviceMode('ipad')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'ipad'
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="iPad Pro Mockup"
            >
              <Tablet className="h-4 w-4" />
            </button>

            <button
              onClick={() => setDeviceMode('iphone')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'iphone'
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="iPhone 16 Pro Mockup"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SHOWROOM DISPLAY: LIGHT-MODE EDITORIAL PEDESTAL */}
      {/* ========================================================= */}
      <main className="flex-1 min-h-0 w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-between py-2 sm:py-3 lg:py-4 overflow-y-auto lg:overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center my-auto w-full">
            {/* Left Column: Project Case Study Specs */}
            <div className="lg:col-span-5 space-y-4">
              {/* Index & Category Stamp */}
              <div className="flex items-center space-x-3 font-mono text-xs">
                <span className="text-3xl font-black text-blue-600 font-display">
                  {activeProject.number}
                </span>
                <div className="h-5 w-px bg-slate-300" />
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 uppercase text-[10px] tracking-wider">
                  {activeProject.category}
                </span>

                {activeProject.isCurrentlyBuilding && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center space-x-1.5 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span>CURRENTLY BUILDING</span>
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
                  {activeProject.title}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-blue-700 mt-1.5 font-semibold">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Summary */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                {activeProject.summary}
              </p>

              {/* Key Deliverables */}
              <div className="space-y-2 py-1">
                {activeProject.deliverables.map((item, ii) => (
                  <div key={ii} className="flex items-center space-x-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Compact Metrics & Tech Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                {activeProject.metrics.map((m, mi) => (
                  <span key={mi} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs text-[11px]">
                    <strong className="text-slate-900">{m.value}</strong> <span className="text-slate-400 text-[10px]">{m.label}</span>
                  </span>
                ))}
                {activeProject.techStack.slice(0, 3).map((tech, ti) => (
                  <span key={ti} className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="pt-2 flex items-center space-x-3 font-mono text-xs">
                <button
                  onClick={() => setRfpModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center space-x-2 shadow-md shadow-blue-600/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Request Proposal</span>
                </button>

                <button
                  onClick={() => setBlueprintModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold transition-colors flex items-center space-x-1.5 shadow-2xs"
                >
                  <span>System Blueprint</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Right Column: REALISTIC LIGHT-MODE METALLIC DEVICE MOCKUP CANVAS */}
            <div className="lg:col-span-7 flex justify-center items-center relative py-6">
              {/* Soft Pedestal Shadow */}
              <div className="absolute inset-x-12 bottom-6 h-12 bg-slate-400/20 blur-2xl rounded-full pointer-events-none" />

              {/* ---------------------------------------------------- */}
              {/* OPTION A: TRI-DEVICE STUDIO COMPOSITION (Silver Metallic) */}
              {/* ---------------------------------------------------- */}
              {deviceMode === 'trio' && (
                <div className="relative w-full max-w-[680px] flex items-center justify-center py-4">
                  {/* 1. Center: Silver MacBook Pro Mockup */}
                  <div className="w-full max-w-[500px] z-10 transition-transform duration-500">
                    <div className="rounded-t-2xl border-2 border-slate-300 bg-slate-100 shadow-2xl p-2.5 pb-0">
                      {/* Top Camera Dot */}
                      <div className="h-3 flex items-center justify-center mb-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 ring-1 ring-slate-300" />
                      </div>
                      {/* Browser Mock Screen */}
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200 shadow-inner">
                        <img
                          src={activeProject.imageSrc}
                          alt={activeProject.title}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-0 inset-x-0 h-6 bg-slate-100/90 border-b border-slate-200 px-2 flex items-center justify-between text-[9px] font-mono text-slate-500 backdrop-blur-md">
                          <div className="flex items-center space-x-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 inline-block" />
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                          </div>
                          <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                            <Lock className="h-2.5 w-2.5 text-emerald-600" />
                            <span>{activeProject.mockUrl}</span>
                          </div>
                          <span className="text-[8px]">Safari</span>
                        </div>
                      </div>
                    </div>
                    {/* Aluminum Bottom Lip & Hinge */}
                    <div className="h-3.5 bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-xl border-t border-slate-300 shadow-md relative flex items-center justify-center">
                      <div className="h-1 w-14 bg-slate-400/80 rounded-b" />
                    </div>
                  </div>

                  {/* 2. Left Foreground: Silver iPad Pro Mockup */}
                  <div className="absolute -left-2 sm:-left-6 bottom-0 w-[170px] sm:w-[210px] z-20 shadow-2xl transition-transform hover:scale-105 duration-300">
                    <div className="rounded-2xl border-2 border-slate-300 bg-slate-100 p-2 shadow-2xl">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-slate-200">
                        <img
                          src={activeProject.tabletImageSrc || activeProject.imageSrc}
                          alt="Tablet View"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute bottom-2 left-2 text-[8px] font-mono text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-slate-200">
                          iPad OS • Tablet UI
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Right Foreground: Silver iPhone 16 Pro Mockup */}
                  <div className="absolute -right-2 sm:-right-4 bottom-4 w-[110px] sm:w-[130px] z-30 shadow-2xl transition-transform hover:scale-105 duration-300">
                    <div className="rounded-3xl border-2 border-slate-300 bg-slate-100 p-1.5 shadow-2xl">
                      <div className="relative aspect-[9/19] rounded-2xl overflow-hidden bg-white border border-slate-200">
                        <div className="absolute top-1.5 inset-x-0 flex justify-center z-20">
                          <div className="h-2 w-8 bg-slate-900 rounded-full" />
                        </div>
                        <img
                          src={activeProject.mobileImageSrc || activeProject.imageSrc}
                          alt="Mobile View"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute bottom-2 inset-x-0 flex justify-center">
                          <div className="h-0.5 w-8 bg-slate-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* OPTION B: SOLO SILVER MACBOOK PRO FOCUS */}
              {/* ---------------------------------------------------- */}
              {deviceMode === 'macbook' && (
                <div className="w-full max-w-[620px] shadow-2xl">
                  <div className="rounded-t-2xl border-2 border-slate-300 bg-slate-100 p-3 pb-0 shadow-2xl">
                    <div className="h-3 flex items-center justify-center mb-1">
                      <div className="h-2 w-2 rounded-full bg-slate-400 ring-1 ring-slate-300" />
                    </div>
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200">
                      <img
                        src={activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-800 bg-white/95 px-3 py-1 rounded-md border border-slate-200 shadow-sm flex items-center space-x-1.5">
                        <Lock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{activeProject.mockUrl}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-4 bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-2xl border-t border-slate-300 shadow-lg flex items-center justify-center">
                    <div className="h-1.5 w-20 bg-slate-400/80 rounded-b" />
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* OPTION C: SOLO SILVER IPAD PRO FOCUS */}
              {/* ---------------------------------------------------- */}
              {deviceMode === 'ipad' && (
                <div className="w-full max-w-[420px] shadow-2xl">
                  <div className="rounded-3xl border-2 border-slate-300 bg-slate-100 p-3 shadow-2xl">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-slate-200">
                      <img
                        src={activeProject.tabletImageSrc || activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-800 bg-white/95 px-3 py-1 rounded-md border border-slate-200 shadow-sm flex items-center space-x-1.5">
                        <Lock className="h-3 w-3 text-emerald-600" />
                        <span>iPad Pro 12.9" • {activeProject.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* OPTION D: SOLO IPHONE 16 PRO FOCUS */}
              {/* ---------------------------------------------------- */}
              {deviceMode === 'iphone' && (
                <div className="w-full max-w-[280px] shadow-2xl">
                  <div className="rounded-[40px] border-4 border-slate-300 bg-slate-100 p-2.5 shadow-2xl">
                    <div className="relative aspect-[9/19] rounded-[32px] overflow-hidden bg-white border border-slate-200">
                      <div className="absolute top-2.5 inset-x-0 flex justify-center z-20">
                        <div className="h-3.5 w-20 bg-slate-900 rounded-full" />
                      </div>
                      <img
                        src={activeProject.mobileImageSrc || activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute bottom-3 inset-x-0 flex justify-center">
                        <div className="h-1 w-24 bg-slate-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Filmstrip Carousel Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                title="Previous Project"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                title="Next Project"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="text-slate-500 pl-2 font-medium">
                PROJECT {activeProject.number} OF {filteredProjects.length}
              </span>
            </div>

            {/* Thumbnail Quick Selector Strip */}
            <div className="hidden md:flex items-center space-x-2 overflow-x-auto no-scrollbar max-w-xl">
              {filteredProjects.map((p, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-10 px-3.5 rounded-xl border flex items-center space-x-2 transition-all font-medium ${
                      isCurrent
                        ? p.isCurrentlyBuilding
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-blue-600'}`}>
                      {p.number}
                    </span>
                    <span className="text-xs truncate max-w-[130px]">
                      {p.title}
                    </span>
                    {p.isCurrentlyBuilding && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </main>

      {/* ========================================================= */}
      {/* 5. STANDALONE LIGHT-MODE CLIENT SHOWCASE FOOTER */}
      {/* ========================================================= */}
      <footer className="h-10 border-t border-slate-200/90 bg-white/95 px-4 sm:px-8 lg:px-12 shrink-0 font-sans flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center space-x-3">
          <span className="font-extrabold text-slate-900 font-display text-xs">ARCANUM SHOWCASE</span>
          <span className="text-slate-300">•</span>
          <a href="mailto:info@arcanum.ae" className="text-blue-600 hover:underline">info@arcanum.ae</a>
          <span className="text-slate-300">•</span>
          <span>+971 4 397 5002</span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="hidden md:inline">Dubai, UAE</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline">© {new Date().getFullYear()} Arcanum Information Technology</span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-semibold">Independent Systems Catalog</span>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 5. LIGHT-MODE SYSTEM BLUEPRINT MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {blueprintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBlueprintModalOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto text-slate-900"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 font-mono text-xs text-blue-600 mb-1 font-bold">
                    <span>SYSTEM BLUEPRINT</span>
                    <span>•</span>
                    <span>{activeProject.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">{activeProject.mockUrl}</p>
                </div>

                <button
                  onClick={() => setBlueprintModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Architecture Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">RUNTIME ARCHITECTURE</span>
                  <span className="text-slate-800 font-bold mt-1 block">{activeProject.architecture.runtime}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">DATABASE &amp; PERSISTENCE</span>
                  <span className="text-slate-800 font-bold mt-1 block">{activeProject.architecture.database}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">SECURITY &amp; AUDITABILITY</span>
                  <span className="text-slate-800 font-bold mt-1 block">{activeProject.architecture.security}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">SCALABILITY PROFILE</span>
                  <span className="text-slate-800 font-bold mt-1 block">{activeProject.architecture.scalability}</span>
                </div>
              </div>

              {/* Full Deliverables */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                  CORE SPECIFICATIONS &amp; MODULE DELIVERABLES
                </h4>
                <div className="space-y-2">
                  {activeProject.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center space-x-2.5 text-xs text-slate-800 p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <button
                  onClick={() => {
                    setBlueprintModalOpen(false);
                    setRfpModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 flex items-center space-x-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Request System RFP</span>
                </button>

                <button
                  onClick={() => setBlueprintModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 6. LIGHT-MODE CLIENT RFP MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {rfpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRfpModalOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-slate-900"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-blue-600 block font-bold">
                    CLIENT DISCOVERY &amp; RFP
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                    Request Project Proposal
                  </h3>
                  <p className="text-xs font-mono text-blue-700 mt-1 font-semibold">
                    System: {activeProject.title}
                  </p>
                </div>

                <button
                  onClick={() => setRfpModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {rfpSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900 font-display">Proposal Request Received</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Our technical directors will review your requirements for {activeProject.title} and reach out within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRfpSubmit} className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1 font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rfpForm.name}
                      onChange={(e) => setRfpForm({ ...rfpForm, name: e.target.value })}
                      placeholder="e.g. Sultan Al Qasimi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1 font-bold">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={rfpForm.email}
                      onChange={(e) => setRfpForm({ ...rfpForm, email: e.target.value })}
                      placeholder="client@organization.ae"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1 font-bold">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={rfpForm.organization}
                      onChange={(e) => setRfpForm({ ...rfpForm, organization: e.target.value })}
                      placeholder="e.g. Emirates Investment Group"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-slate-500 mb-1 font-bold">
                      Scope / Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={rfpForm.message}
                      onChange={(e) => setRfpForm({ ...rfpForm, message: e.target.value })}
                      placeholder="Describe target deployment, user count, or timeline..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  {rfpError && <p className="text-xs text-rose-600 font-mono font-bold">{rfpError}</p>}

                  <div className="pt-2 flex items-center justify-end space-x-3 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setRfpModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={rfpSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/20 disabled:opacity-50"
                    >
                      {rfpSubmitting ? (
                        <span>Dispatching...</span>
                      ) : (
                        <>
                          <span>Submit Proposal Request</span>
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
