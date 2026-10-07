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
    title: 'ARC X1 ERP — Next-Gen Enterprise Resource Planning',
    client: 'Enterprise Conglomerates & Multi-Entity Groups (UAE)',
    category: 'Enterprise & Finance Core',
    year: '2026',
    tagline: 'Multi-Entity Financial Ledger, Supply Chain & Automated UAE VAT',
    summary:
      'The next evolution of Arcanum’s flagship ERP suite. Engineered for high transaction velocity, multi-company consolidation, dual-authorization audit trails, automated UAE VAT filing, and synchronized multi-warehouse logistics.',
    imageSrc: '/hero_erp.jpg',
    mockUrl: 'https://x1-erp.arcanum.ae',
    deliverables: [
      'Double-Entry Multi-Currency Financial Ledger',
      'Automated UAE VAT Tax & Corporate Tax Filing',
      'Multi-Warehouse Logistics & Serial/Batch Tracking',
      'End-to-End Procurement, RFQ & 3-Way Invoice Matching',
      'Role-Based Dual Authorization & Immutable Audit Logs',
    ],
    techStack: ['PostgreSQL', 'TypeScript', 'Next.js 14', 'Docker', 'Redis', 'GraphQL', 'TLS 1.3'],
    metrics: [
      { label: 'TRANSACTION LATENCY', value: '< 6ms' },
      { label: 'SYSTEM SLA', value: '99.995%' },
      { label: 'STATUTORY AUDIT', value: '100% UAE VAT' },
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
    title: 'ARC RMS — Restaurant & Hospitality Management System',
    client: 'Fine Dining Groups, Multi-Branch Chains & Cloud Kitchens',
    category: 'Hospitality & F&B POS',
    year: '2026',
    tagline: 'Interactive Table Floorplans, Sub-Second KDS Sync & Gram-Level Recipe Costing',
    summary:
      'A comprehensive, hyper-responsive restaurant and hospitality management suite. Combines visual table floorplan layouts with seat-level bill splitting, live Kitchen Display System (KDS) coordination, ingredient-level inventory deduction, and 100% offline-resilient operations.',
    imageSrc: '/hero_restaurant.jpg',
    mockUrl: 'https://rms.arcanum.ae',
    deliverables: [
      'Interactive Visual Table Floorplans & Reservations',
      'Color-Coded Kitchen Display System (KDS)',
      'Gram-Level Recipe & Ingredient Inventory Costing',
      '100% Offline-Resilient POS Engine with Cloud Auto-Sync',
      'Multi-Branch Menu Matrix & Thermal ESC/POS Printing',
    ],
    techStack: ['Next.js 14', 'WebSockets', 'SQLite Sync', 'Thermal ESC/POS', 'PostgreSQL', 'PWA'],
    metrics: [
      { label: 'KDS SYNC LATENCY', value: '< 20ms' },
      { label: 'OFFLINE CONTINUITY', value: '100% Resilient' },
      { label: 'BRANCH ARCHITECTURE', value: 'Multi-Tenant' },
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
    title: 'Emirates Drug Store — Pharma Commerce & Supply Chain',
    client: 'Emirates Drug Store / UAE Healthcare & Pharmacy Distributors',
    category: 'Pharma Supply Chain & Healthcare',
    year: '2026',
    tagline: 'MOHAP-Compliant Pharmaceutical Distribution, B2B Portal & Cold-Chain Tracking',
    summary:
      'A bespoke pharmaceutical distribution and commerce platform built for the UAE healthcare sector. Features MOHAP/Tatmeen regulatory batch compliance, real-time expiry and lot tracking, temperature-controlled cold-chain logistics telemetry, automated B2B pharmacy reordering, and integrated prescription fulfilment.',
    imageSrc: '/hero_clinic.jpg',
    mockUrl: 'https://emiratesdrugstore.ae',
    deliverables: [
      'MOHAP & Tatmeen Serialization & Regulatory Traceability',
      'Pharmaceutical Batch, Lot & Expiry Life-Cycle Engine',
      'B2B Wholesale Pharmacy Ordering Portal & ERP Sync',
      'Cold-Chain Temperature Sensor Telemetry & Alerts',
      'Electronic Prescription Dispatch & Dispensation Flow',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'HL7 / FHIR', 'Node.js', 'Redis', 'Docker', 'REST / GraphQL'],
    metrics: [
      { label: 'REGULATORY COMPLIANCE', value: 'MOHAP / Tatmeen' },
      { label: 'TRACEABILITY', value: '100% Batch/Serial' },
      { label: 'ORDER FULFILMENT', value: 'Real-Time Auto-Route' },
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
    id: 'hrms',
    number: '04',
    title: 'Synapse Enterprise HRMS & WPS Payroll',
    client: 'UAE Regional Enterprises & Corporate Groups',
    category: 'Workforce & HRMS',
    year: '2026',
    tagline: 'Automated UAE WPS SIF Generation & Employee Self-Service',
    summary:
      'Complete workforce operations engine providing 100% automated UAE Wages Protection System (WPS) bank file generation, biometric shift attendance, and gratuity calculations.',
    imageSrc: '/hero_hrms.jpg',
    mockUrl: 'https://synapse.arcanum.ae',
    deliverables: [
      'Automated UAE WPS SIF Generator',
      'Biometric Time & Attendance Tracking',
      'Employee Self-Service (ESS) Portal',
      'Statutory Gratuity & Leave Engine',
    ],
    techStack: ['Next.js 14', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [
      { label: 'WPS COMPLIANCE', value: '100% Automated' },
      { label: 'ACTIVE EMPLOYEES', value: '150K+ Users' },
      { label: 'PAYROLL PROCESSING', value: '< 2 Minutes' },
    ],
    liveStatus: 'UAE Ministry Verified',
    architecture: {
      runtime: 'Node.js & Next.js 14 Fullstack',
      database: 'PostgreSQL with Redis Session Cache',
      security: 'Encrypted UAE National ID & Bank Data',
      scalability: '150,000+ Employee Monthly Runs',
    },
  },
  {
    id: 'sls',
    number: '05',
    title: 'Aether Enterprise CRM & Lead Pipeline',
    client: 'Commercial Sales Organizations & Real Estate Firms',
    category: 'Sales Automation & CRM',
    year: '2026',
    tagline: 'Real-Time Kanban Pipeline, Quotations & WhatsApp Cloud API',
    summary:
      'Accelerate deal closures with unified omnichannel pipeline management. Ingest leads from WhatsApp, generate instant PDF quotations, and monitor sales representative quotas in real-time.',
    imageSrc: '/hero_crm.jpg',
    mockUrl: 'https://aether.arcanum.ae',
    deliverables: [
      'Multi-Stage Visual Kanban Pipeline',
      '1-Click PDF Quotation & Invoicing',
      'WhatsApp Cloud API Automated Follow-ups',
      'Executive Revenue Forecasting HUD',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'WhatsApp Cloud API', 'SendGrid', 'Docker'],
    metrics: [
      { label: 'QUOTE CREATION', value: '< 60 Seconds' },
      { label: 'PIPELINE TRACKING', value: 'Real-Time Stream' },
      { label: 'FOLLOW-UP AUTOMATION', value: 'WhatsApp Cloud' },
    ],
    liveStatus: 'Omnichannel Active',
    architecture: {
      runtime: 'Next.js 14 & WebSocket Ingestion',
      database: 'PostgreSQL & Redis Pub/Sub',
      security: 'Webhook Signature Verification, RBAC',
      scalability: '500,000+ Monthly WhatsApp Triggers',
    },
  },
  {
    id: 'oms',
    number: '06',
    title: 'Organization Management System (OMS)',
    client: 'Holding Groups, Sovereign Entities & Multi-Branch Orgs',
    category: 'Enterprise Governance',
    year: '2026',
    tagline: 'Multi-Tenant Entity Hierarchy & Granular RBAC Mesh',
    summary:
      'A master governance engine enabling multi-company group management, dynamic holding trees, threshold-based approval matrices, and centralized identity & access management (IAM).',
    imageSrc: '/hero-topsection/ezgif-frame-105.jpg',
    mockUrl: 'https://oms.arcanum.ae',
    deliverables: [
      'Hierarchical Entity & Subsidiary Topology',
      'Dynamic Multi-Stage Approval Matrix',
      'Enterprise SSO & SAML 2.0 Identity Mesh',
      'Immutable User Activity Audit Logs',
    ],
    techStack: ['Node.js', 'PostgreSQL', 'OAuth2 / SAML', 'Docker', 'Redis', 'gRPC'],
    metrics: [
      { label: 'AUTH LATENCY', value: '< 3ms' },
      { label: 'TENANCY SUPPORT', value: 'Unlimited Orgs' },
      { label: 'ACCESS CONTROL', value: 'Granular RBAC' },
    ],
    liveStatus: 'Active Multi-Tenant',
    architecture: {
      runtime: 'Go & Node.js Microservices',
      database: 'PostgreSQL Multi-Schema Sharding',
      security: 'SAML 2.0, OAuth2, FIDO2 Hardware Keys',
      scalability: 'Unlimited Subsidiary Hierarchies',
    },
  },
  {
    id: 'oracle',
    number: '07',
    title: 'Legacy Oracle Forms Modernization Suite',
    client: 'Government Ministries & Legacy Enterprise Systems',
    category: 'Cloud Migration & AST',
    year: '2026',
    tagline: 'PL/SQL Business Logic Decoupling to Cloud Microservices',
    summary:
      'Turn obsolete Oracle Forms 6i/11g/12c systems into responsive web applications. Preserves battle-tested PL/SQL packages while replacing outdated Java applets with modern web interfaces.',
    imageSrc: '/oracle_modernization.png',
    mockUrl: 'https://modernize.arcanum.ae',
    deliverables: [
      'PL/SQL Business Logic Extraction',
      'Web-Native Responsive Interface',
      'Zero Downtime Parallel Cutover',
      'Modern GraphQL & REST API Layer',
    ],
    techStack: ['Oracle DB 19c', 'PL/SQL', 'Next.js 14', 'Node.js', 'gRPC', 'Docker'],
    metrics: [
      { label: 'ZERO DATA LOSS', value: '100% Guaranteed' },
      { label: 'DB INTEGRITY', value: '100% Preserved' },
      { label: 'INTERFACE SPEED', value: '10x Faster UX' },
    ],
    liveStatus: 'Migration Certified',
    architecture: {
      runtime: 'Next.js 14 Frontend & gRPC Bridge',
      database: 'Oracle Database 19c Enterprise',
      security: 'Legacy PL/SQL Package Preservation',
      scalability: 'Stateless Cloud Worker Containers',
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
    { label: 'All Systems', value: 'All' },
    { label: '🔥 Active in Build (3)', value: 'Active Build', highlight: true },
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600/15 selection:text-blue-900 flex flex-col antialiased">
      {/* Subtle Warm Studio Background Gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-50/60 via-slate-100/40 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* ========================================================= */}
      {/* 1. STANDALONE LIGHT-MODE TOP NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="h-20 bg-white/90 border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 z-40 backdrop-blur-xl sticky top-0 shadow-sm">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 flex items-center justify-center shadow-md shadow-blue-500/20">
              <img src="/logo.png" alt="Arcanum" className="h-full w-full object-contain filter invert brightness-200" />
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

          {/* Active Projects in Build Pill */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 font-mono text-xs text-amber-900">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">ACTIVE IN BUILD: ARC X1 ERP • ARC RMS • EMIRATES DRUG STORE</span>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-3 font-mono text-xs">
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
      <div className="bg-white/80 border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar font-mono text-xs backdrop-blur-md">
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
      <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
            {/* Left Column: Project Case Study Specs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Index & Year Stamp */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="text-4xl font-black text-blue-600 font-display">
                  {activeProject.number}
                </span>
                <div className="h-7 w-px bg-slate-300" />
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 uppercase text-[10px] tracking-wider">
                  {activeProject.category}
                </span>

                {activeProject.isCurrentlyBuilding && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center space-x-1.5 shadow-sm shadow-amber-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span>CURRENTLY BUILDING</span>
                  </span>
                )}
              </div>

              {/* Title & Client */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
                  {activeProject.title}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-blue-700 mt-2 font-semibold">
                  {activeProject.tagline}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1 font-medium">
                  Client Profile: <strong className="text-slate-800">{activeProject.client}</strong>
                </p>
              </div>

              {/* Summary */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
                {activeProject.summary}
              </p>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 font-mono text-center shadow-sm">
                {activeProject.metrics.map((m, mi) => (
                  <div key={mi} className="border-r last:border-r-0 border-slate-100 px-1">
                    <span className="text-base sm:text-lg font-bold text-slate-900 block font-display">
                      {m.value}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block mt-1 font-medium">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 block font-bold">
                  CORE DELIVERABLES &amp; CAPABILITIES:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-xs">
                  {activeProject.deliverables.map((item, ii) => (
                    <div key={ii} className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="truncate font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeProject.techStack.map((tech, ti) => (
                  <span
                    key={ti}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
                <button
                  onClick={() => setBlueprintModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/25 group"
                >
                  <span>Inspect System Blueprint</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setRfpModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5 text-blue-600" />
                  <span>Request Proposal</span>
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
                          src={activeProject.imageSrc}
                          alt="Tablet View"
                          className="w-full h-full object-cover object-center"
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
                          src={activeProject.imageSrc}
                          alt="Mobile View"
                          className="w-full h-full object-cover object-center"
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
                        src={activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-center"
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
                        src={activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-center"
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
                    <span className="text-xs truncate max-w-[120px]">
                      {p.id === 'arc-x1-erp'
                        ? 'ARC X1 ERP'
                        : p.id === 'arc-rms'
                        ? 'ARC RMS'
                        : p.id === 'emirates-drug-store'
                        ? 'Emirates Drug'
                        : p.title.split(' ')[0]}
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
      <footer className="mt-16 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl shrink-0 font-sans">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
            {/* Brand & Showcase Statement */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <img src="/logo.png" alt="Arcanum" className="h-full w-full object-contain filter invert brightness-200" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 tracking-tight font-display text-sm">
                    ARCANUM CLIENT SHOWCASE
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 block font-semibold">
                    ENTERPRISE DIGITAL ARCHITECTURE
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Dedicated client portfolio and technical showcase of production systems and custom platforms engineered by Arcanum Information Technology.
              </p>
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>CONFIDENTIAL CLIENT DEMONSTRATION • UAE STATUTORY VERIFIED</span>
              </div>
            </div>

            {/* Direct Client Contact Information */}
            <div className="md:col-span-4 space-y-3 font-mono text-xs text-slate-600">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                DIRECT CLIENT COMMUNICATIONS
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Email:</span>
                  <a href="mailto:info@arcanum.ae" className="text-blue-600 hover:underline font-semibold">
                    info@arcanum.ae
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Phone:</span>
                  <a href="tel:+97143975002" className="text-slate-800 hover:text-blue-600 font-semibold">
                    +971 4 397 5002
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">HQ Office:</span>
                  <span className="text-slate-700">P.O. Box 27150, Dubai, United Arab Emirates</span>
                </div>
              </div>
            </div>

            {/* Fast Action */}
            <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                PROJECT ENGAGEMENT
              </span>
              <button
                onClick={() => setRfpModalOpen(true)}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Request Project RFP</span>
              </button>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-3">
            <span>© {new Date().getFullYear()} Arcanum Information Technology. All rights reserved.</span>
            <span>Independent Systems &amp; Web Platform Catalog</span>
          </div>
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
