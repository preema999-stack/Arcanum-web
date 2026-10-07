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
  category: 'RMS' | 'Websites' | 'ERP';
  subcategory?: 'RMS' | 'POS' | 'Websites' | 'ERP' | 'HRMS';
  year: string;
  tagline: string;
  summary: string;
  imageSrc: string;
  tabletImageSrc?: string;
  mobileImageSrc?: string;
  videoSrc?: string;
  mockUrl?: string;
  liveUrl?: string;
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
    id: 'arc-rms',
    number: '01',
    title: 'ARC RMS',
    client: 'Multi-Branch Holding Groups & Restaurant Operators',
    category: 'RMS',
    subcategory: 'RMS',
    year: '2026',
    tagline: 'Multi-Branch Restaurant Management Console & Real-Time Operations',
    summary:
      'Executive restaurant management console providing holding administrators with live fulfillment revenue breakdowns (Dine-in 42%, Delivery 20%, Takeaway 20%, Fast Counter 18%), real-time dining room table status (9 Available, 7 Occupied, 2 Reserved), top-selling menu dish tracking, and centralized multi-branch operations.',
    imageSrc: '/arc_rms_console.png',
    deliverables: [
      'Multi-Branch Real-Time Sales & Fulfillment Channels (Dine, Delivery, Takeaway)',
      'Live Table Status & Occupancy Floorplan (9 Available, 7 Occupied, 2 Reserved)',
      'Top-Selling Menu Dish Tracking & Multi-Location Branch Controls',
    ],
    techStack: ['Next.js 14', 'WebSockets', 'PostgreSQL', 'Redis'],
    metrics: [
      { label: 'SALES TODAY', value: '1,474.5 AED' },
      { label: 'AVG TICKET', value: '46.08 AED' },
      { label: 'TABLE STATUS', value: 'Live Floorplan' },
    ],
    liveStatus: 'Active Build • Q1 2026',
    isCurrentlyBuilding: true,
    architecture: {
      runtime: 'Next.js 14 Edge Runtime & WebSocket Core',
      database: 'PostgreSQL Cluster with TimescaleDB Analytics',
      security: 'Encrypted Biometric Auth, Multi-Role Isolation',
      scalability: 'Elastic Cloud Kitchen Routing',
    },
  },
  {
    id: 'arc-pos',
    number: '02',
    title: 'ARC POS',
    client: 'Fast-Casual Chains, Dine-In Outlets & High-Volume Tills',
    category: 'RMS',
    subcategory: 'POS',
    year: '2026',
    tagline: 'High-Velocity Touchscreen Billing, Split Checks & Kitchen Dispatch',
    summary:
      'Hyper-responsive touch point-of-sale terminal with visual table ordering (Dine-in, Takeaway, Delivery), one-tap split check billing, quick-fire kitchen routing, promo discounts, and offline-first database synchronization.',
    imageSrc: '/arc_pos_desktop.png',
    tabletImageSrc: '/arc_pos_tablet.png',
    mobileImageSrc: '/arc_pos_mobile.png',
    deliverables: [
      'Touchscreen Order Matrix with Quick Menu Categories & Modifiers',
      'One-Tap Split Check, Discount Promotions & Multi-Tender Settlement',
      'Sub-Second Kitchen Dispatch (Fire Kitchen) & ESC/POS Receipt Printing',
    ],
    techStack: ['Next.js 14', 'SQLite Sync', 'WebSockets', 'ESC/POS'],
    metrics: [
      { label: 'SETTLEMENT', value: 'One-Tap Split' },
      { label: 'DISPATCH', value: '< 20ms Fire' },
      { label: 'OFFLINE', value: '100% Resilient' },
    ],
    liveStatus: 'Active Build • Q1 2026',
    isCurrentlyBuilding: true,
    architecture: {
      runtime: 'Next.js 14 Edge Runtime & Local-First Engine',
      database: 'Local SQLite Cache with PostgreSQL Cloud Sync',
      security: 'Encrypted Cash Drawer & Biometric POS Auth',
      scalability: 'Sub-Second Local Offline Resilience',
    },
  },
  {
    id: 'emirates-drug-store',
    number: '03',
    title: 'Emirates Drugs Store (EDS)',
    client: 'Emirates Drugs Store LLC (Ajman & UAE)',
    category: 'Websites',
    subcategory: 'Websites',
    year: '2026',
    tagline: 'Connecting Global Pharmaceutical Innovators with UAE Healthcare',
    summary:
      'Premier licensed pharmaceutical wholesaler and medicine supplier founded in 1993, empowering hospitals, clinics, and pharmacies across all 7 Emirates with temperature-controlled supply chain and Tatmeen GS1 compliance.',
    imageSrc: '/emirates_drugs_store_desktop.png',
    tabletImageSrc: '/emirates_drugs_store_tablet.png',
    mobileImageSrc: '/emirates_drugs_store_mobile.png',
    mockUrl: 'https://emiratesdrugstore.ae',
    deliverables: [
      'MOHAP Licensed & Tatmeen Regulatory Traceability',
      '24/7 Rapid Despatch for Clinical Emergency Medicine',
      'Central Bio-Vault & Temperature-Controlled Cold Chain',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'HL7 / FHIR', 'Node.js'],
    metrics: [
      { label: 'ESTABLISHED', value: '1993' },
      { label: 'OUTLETS', value: '450+ Outlets' },
      { label: 'VERIFIED', value: '100% Tatmeen' },
    ],
    liveStatus: 'Live Production Website',
    architecture: {
      runtime: 'Next.js 14 & Distributed Event Microservices',
      database: 'TimescaleDB (IoT Cold-Chain) & PostgreSQL',
      security: 'MOHAP GDP & Tatmeen Compliance, HL7 / FHIR Security',
      scalability: 'Nationwide Pharmacy Wholesale & Cold-Chain Grid',
    },
  },
  {
    id: 'capco-parts',
    number: '04',
    title: 'Central Auto Parts',
    client: 'Central Auto Parts Co. LLC (Est. 1975 • Abu Dhabi, UAE)',
    category: 'Websites',
    subcategory: 'Websites',
    year: '2026',
    tagline: 'Trusted European Truck Spare Parts Since 1975.',
    summary:
      'Supplying genuine & aftermarket European truck and trailer parts across UAE, GCC and Africa — with five decades of distribution expertise.',
    imageSrc: '/capco_desktop.png',
    tabletImageSrc: '/capco_tablet.png',
    mobileImageSrc: '/capco_mobile.png',
    mockUrl: 'https://capcollc.ae',
    liveUrl: 'https://capcollc.ae/',
    deliverables: [
      '5,000+ European Commercial Truck & Trailer Spare Parts Catalog',
      'Direct Head Office Dispatch & Quote Hotline (02 555 6900)',
      'Cross-Border UAE, GCC & Africa Logistics (Import • Export • Distribution)',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'Algolia Search', 'Tailwind / CSS'],
    metrics: [
      { label: 'YEARS TRUST', value: '50+' },
      { label: 'PRODUCT SKUS', value: '5,000+' },
      { label: 'GLOBAL BRANDS', value: '100+' },
      { label: 'COUNTRIES', value: '20+ Served' },
    ],
    liveStatus: 'Live Production Website',
    architecture: {
      runtime: 'Next.js 14 Edge CDN & High-Performance Headless CMS',
      database: 'PostgreSQL Enterprise with Elastic Parts Search Index',
      security: 'DDoS Mitigated, TLS 1.3, Enterprise Quotation Auth',
      scalability: 'Sub-Second SKU Query Across 50,000 Cross-References',
    },
  },
  {
    id: 'shakespeare-middle-east',
    number: '05',
    title: 'Shakespeare Middle East',
    client: 'Shakespeare Middle East Café & Restaurant (UAE)',
    category: 'Websites',
    subcategory: 'Websites',
    year: '2026',
    tagline: 'Fairytale Charm, Artisanal Patisserie & Seasonal Dining Since 2001',
    summary:
      'Shakespeare Middle East brings over two decades of fairytale charm, vintage elegance, warm chandeliers, and beloved cafe dining to Dubai and the UAE with handcrafted pastries, seasonal summer menus, and signature culinary creations.',
    imageSrc: '/shakespeare_desktop.png',
    tabletImageSrc: '/shakespeare_tablet.png',
    mobileImageSrc: '/shakespeare_mobile.png',
    mockUrl: 'https://shakespeare.ae',
    liveUrl: 'https://shakespeare.ae/',
    deliverables: [
      'Seasonal Summer Menus, Artisanal French Patisserie & Signature Pastas',
      'Interactive Multi-Branch Directory & Table Reservation Engine',
      'Heritage Storytelling: Fairytale Cafe Ambiance & Online Menu Explorer',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'Tailwind / CSS', 'Node.js'],
    metrics: [
      { label: 'HERITAGE', value: 'Since 2001' },
      { label: 'PATISSERIE', value: '100% Artisanal' },
      { label: 'BRANCHES', value: 'UAE & GCC' },
    ],
    liveStatus: 'Live Production Website',
    architecture: {
      runtime: 'Next.js 14 Edge Runtime & High-Resolution Visual CDN',
      database: 'PostgreSQL with Real-Time Table Reservation Scheduler',
      security: 'TLS 1.3, DDoS Shield & Secure Customer Booking Portal',
      scalability: 'Sub-Second Global Delivery for Media-Rich Menu Assets',
    },
  },
  {
    id: 'gibran-dining',
    number: '06',
    title: 'Gibran & Co.',
    client: 'Gibran & Co. Fine Dining (Bahrain, Abu Dhabi & Beirut)',
    category: 'Websites',
    subcategory: 'Websites',
    year: '2026',
    tagline: 'More Than Just a Meal — Good Food, Good Vibes, Great Company',
    summary:
      'A sanctuary where beautiful food, thoughtful design, and warm hospitality come together to create unforgettable moments. Featuring authentic Levantine culinary craft, charcoal stone ovens, unhurried dining, tailored cellar wine pairings, and bespoke table reservations across Bahrain, Abu Dhabi & Beirut.',
    imageSrc: '/gibran_desktop.png',
    tabletImageSrc: '/gibran_tablet.jpg',
    mobileImageSrc: '/gibran_mobile.jpg',
    videoSrc: '/gibraaan.mp4',
    mockUrl: 'https://gibran.ae',
    deliverables: [
      'Interactive Table Reservation & Sanctuary Guest Booking Engine',
      'Dynamic Culinary Storytelling: Charcoal, Vine Cuttings & Stone Oven Craft',
      'Tailored Cellar Wine Pairings & Seasonal Course Showcase',
    ],
    techStack: ['Next.js 14', 'Framer Motion', 'Tailwind / CSS', 'PostgreSQL'],
    metrics: [
      { label: 'EXPERIENCE', value: '12 Years' },
      { label: 'SEASONAL', value: '40+ Dishes' },
      { label: 'CELLAR', value: '18 Reserves' },
    ],
    liveStatus: 'Live Production Website',
    architecture: {
      runtime: 'Next.js 14 App Router & Fluid Cinematic Animation Engine',
      database: 'Cloud PostgreSQL with Live Reservation Slot Manager',
      security: 'PCI-DSS Compliant Deposit Processing, End-to-End Encryption',
      scalability: 'Global CDN Acceleration with WebP & High-Res Image Pipeline',
    },
  },
  {
    id: 'hrms',
    number: '07',
    title: 'Synapse HRMS & Workspace',
    client: 'UAE Regional Enterprises & Corporate Groups',
    category: 'Websites',
    subcategory: 'Websites',
    year: '2026',
    tagline: 'Company Admin Workspace Portal & Delivery Tracking',
    summary:
      'Centralized administrative workspace and workforce platform for organizing roadmaps, tracking delivery milestones across Kanban sprints, and managing cross-functional team productivity.',
    imageSrc: '/synapse_hrms_desktop.png',
    tabletImageSrc: '/synapse_hrms_tablet.jpg',
    mobileImageSrc: '/synapse_hrms_mobile.jpg',
    deliverables: [
      'Interactive Kanban Sprint Workspace & Live Milestones',
      'Automated UAE WPS SIF Bank Generation & Payroll Engine',
      'Employee Directory, Role-Based Access & Task Allocation',
    ],
    techStack: ['Next.js 14', 'Node.js', 'PostgreSQL', 'Docker'],
    metrics: [
      { label: 'WORKFLOW', value: 'Live Kanban' },
      { label: 'WPS AUDIT', value: '100% Automated' },
      { label: 'PROCESSING', value: '< 2 Minutes' },
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
    id: 'chinese-connection',
    number: '08',
    title: 'Chinese Connection UAE',
    client: 'Chinese Connection Restaurant Group (Abu Dhabi & Dubai)',
    category: 'Websites',
    subcategory: 'Websites',
    year: '2026',
    tagline: 'Authentic Flavors, Contemporary Artistry & Online Ordering',
    summary:
      'High-end contemporary Chinese dining platform crafting authentic regional culinary traditions fresh daily, featuring seamless online banquet reservations, dim sum menu curation, and lightning-fast direct digital ordering.',
    imageSrc: '/chinese_connection_desktop.jpg',
    tabletImageSrc: '/chinese_connection_tablet.jpg',
    mobileImageSrc: '/chinese_connection_mobile.jpg',
    mockUrl: 'https://chineseconnection.ae',
    deliverables: [
      'Interactive Visual Dim Sum & Signature Peking Duck Digital Menu',
      'Direct-to-Kitchen Online Ordering & Takeaway Logistics Integration',
      'VIP Banquet Room Bookings & Multi-Branch Dine-In Reservations',
    ],
    techStack: ['Next.js 14', 'React', 'PostgreSQL', 'WebSockets'],
    metrics: [
      { label: 'LOCATIONS', value: 'Abu Dhabi & Dubai' },
      { label: 'SPECIALTIES', value: '100+ Curated' },
      { label: 'ORDER SPEED', value: '< 20 Seconds' },
    ],
    liveStatus: 'Live Production Website',
    architecture: {
      runtime: 'Next.js 14 with Server Actions & Edge Caching',
      database: 'PostgreSQL Cluster with Real-Time Kitchen POS Bridge',
      security: 'SSL TLS 1.3, Encrypted Online Payment Gateway Integration',
      scalability: 'Elastic High-Concurrency Peak Dinner Rush Architecture',
    },
  },
  {
    id: 'arc-x1-erp',
    number: '09',
    title: 'ARC X1 ERP',
    client: 'Arcanum Company L.L.C & Regional UAE Enterprises',
    category: 'ERP',
    subcategory: 'ERP',
    year: '2026',
    tagline: 'Corporate Financial Analytics, Multi-Entity Ledger & Operations',
    summary:
      'Comprehensive enterprise resource planning (ERP) platform featuring real-time executive finance dashboards, monthly balance growth tracking (+38.33% MoM), card statement reconciliations, recent transaction audit ledgers, and automated budget controls across procurement, inventory, sales, HR/payroll, and fixed assets.',
    imageSrc: '/arc_x1_erp_desktop.png',
    deliverables: [
      'Real-Time Corporate Finance Dashboard & 12-Month Growth Curves',
      'Statement Tracking & Automated Reconciliation (Card Limit, Spent, Minimum)',
      'Cross-Module ERP: Procurement, Inventory, Sales, HR/Payroll & Fixed Assets',
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [
      { label: 'GROWTH', value: '+38.33% MoM' },
      { label: 'AVG INCOME', value: '45,332 AED' },
      { label: 'AUDIT', value: '100% Automated' },
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
];

export default function StandaloneLightWebsiteCatalogPage() {
  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('trio');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'RMS' | 'Websites' | 'ERP'>('All');
  const [rmsSubFilter, setRmsSubFilter] = useState<'All' | 'RMS' | 'POS'>('All');
  const [rfpModalOpen, setRfpModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxView, setLightboxView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

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
    let list = LUXURY_PORTFOLIO_PROJECTS;
    if (selectedFilter !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === selectedFilter.toLowerCase());
    }
    if (selectedFilter === 'RMS' && rmsSubFilter !== 'All') {
      list = list.filter((p) => p.subcategory?.toLowerCase() === rmsSubFilter.toLowerCase());
    }
    return list;
  }, [selectedFilter, rmsSubFilter]);

  const activeProject = filteredProjects[activeIndex] || filteredProjects[0] || LUXURY_PORTFOLIO_PROJECTS[0];
  const activeDisplayNumber = String(activeIndex + 1).padStart(2, '0');

  // For ERP and RMS systems (ARC RMS & ARC POS), consoles are strictly workstation / laptop interfaces
  const isLaptopOnly = activeProject.category === 'ERP' || activeProject.category === 'RMS' || activeProject.id === 'arc-rms' || activeProject.id === 'arc-pos';
  const effectiveDeviceMode: DeviceMode = isLaptopOnly ? 'macbook' : deviceMode;

  const filterTabs: { label: string; value: 'All' | 'RMS' | 'Websites' | 'ERP' }[] = [
    { label: 'All Systems', value: 'All' },
    { label: 'RMS', value: 'RMS' },
    { label: 'Websites', value: 'Websites' },
    { label: 'ERP', value: 'ERP' },
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
    <div className="min-h-screen lg:h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600/15 selection:text-blue-900 flex flex-col antialiased overflow-x-hidden lg:overflow-hidden">
      {/* Subtle Warm Studio Background Gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-50/60 via-slate-100/40 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* ========================================================= */}
      {/* 1. STANDALONE LIGHT-MODE TOP NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="h-16 bg-white/95 border-b border-slate-200/80 px-3 sm:px-8 lg:px-12 flex items-center justify-between shrink-0 z-40 backdrop-blur-xl shadow-xs">
        {/* Brand */}
        <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <img src="/logo.png" alt="Arcanum Logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-sm sm:text-base font-display text-slate-900">ARCANUM</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 whitespace-nowrap">
                  CATALOG
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 hidden sm:block font-medium">
                INDEPENDENT SYSTEMS &amp; WEBSITE CATALOG
              </span>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 font-mono text-xs shrink-0">
          {/* Fullscreen Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-sm font-semibold"
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
            className="px-3 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/25 transition-all flex items-center space-x-1.5 text-xs"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Request Proposal</span>
            <span className="sm:hidden">Proposal</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. FILTER PILLS & MOCKUP SWITCHER BAR - FULLY RESPONSIVE */}
      {/* ========================================================= */}
      <div className="bg-white/90 border-b border-slate-200 px-3 sm:px-8 lg:px-12 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 font-mono text-xs backdrop-blur-md shrink-0">
        {/* Disciplines Filter Row */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-0.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 mr-1 flex items-center space-x-1 font-semibold shrink-0">
            <Filter className="h-3 w-3" />
            <span>CATEGORY:</span>
          </span>
          {filterTabs.map((tab) => {
            const isSelected = selectedFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setSelectedFilter(tab.value);
                  setRmsSubFilter('All');
                  setActiveIndex(0);
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border transition-all text-xs shrink-0 font-medium whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Subcategory Pills when RMS is selected */}
          {selectedFilter === 'RMS' && (
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-200 ml-1 shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold shrink-0">
                IN RMS:
              </span>
              {[
                { label: 'All RMS (2)', value: 'All' as const },
                { label: 'RMS Core', value: 'RMS' as const },
                { label: 'POS Terminal', value: 'POS' as const },
              ].map((sub) => {
                const isSubSelected = rmsSubFilter === sub.value;
                return (
                  <button
                    key={sub.value}
                    onClick={() => {
                      setRmsSubFilter(sub.value);
                      setActiveIndex(0);
                    }}
                    className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold transition-all shrink-0 ${
                      isSubSelected
                        ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Device Switcher HUD */}
        <div className="flex items-center justify-between md:justify-end space-x-2 shrink-0 pt-1.5 md:pt-0 border-t border-slate-100 md:border-t-0 w-full md:w-auto">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold shrink-0">
            VIEW:
          </span>
          {isLaptopOnly ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold shadow-2xs">
              <Laptop className="h-3.5 w-3.5 text-blue-600" />
              <span>Laptop View</span>
            </div>
          ) : (
            <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setDeviceMode('trio')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                  effectiveDeviceMode === 'trio'
                    ? 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tri-Device Studio Composition"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="text-[10px] sm:text-[11px]">Trio</span>
              </button>

              <button
                onClick={() => setDeviceMode('macbook')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                  effectiveDeviceMode === 'macbook'
                    ? 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="MacBook Pro Mockup"
              >
                <Laptop className="h-3.5 w-3.5" />
                <span className="text-[10px] sm:text-[11px]">Laptop</span>
              </button>

              <button
                onClick={() => setDeviceMode('ipad')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                  effectiveDeviceMode === 'ipad'
                    ? 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="iPad Pro Mockup"
              >
                <Tablet className="h-3.5 w-3.5" />
                <span className="text-[10px] sm:text-[11px]">Tablet</span>
              </button>

              <button
                onClick={() => setDeviceMode('iphone')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                  effectiveDeviceMode === 'iphone'
                    ? 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="iPhone 16 Pro Mockup"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="text-[10px] sm:text-[11px]">Phone</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ========================================================= */}
      <main className="flex-1 w-full px-3 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-between py-3 sm:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-center my-0 lg:my-auto w-full">
            {/* Left Column: Project Case Study Specs */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              {/* Index & Category Stamp */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 font-mono text-xs flex-wrap gap-y-1">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 font-display">
                  {activeDisplayNumber}
                </span>
                <div className="h-4 sm:h-5 w-px bg-slate-300" />
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 uppercase text-[9px] sm:text-[10px] tracking-wider">
                  {activeProject.category === 'RMS' && activeProject.subcategory
                    ? `RMS • ${activeProject.subcategory}`
                    : activeProject.category}
                </span>

                {activeProject.isCurrentlyBuilding && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[9px] sm:text-[10px] flex items-center space-x-1.5 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span>CURRENTLY BUILDING</span>
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.15]">
                  {activeProject.title}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-blue-700 mt-1 font-semibold">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Minimal Content Description & Tech Stack */}
              <div className="space-y-3 pt-1">
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  {activeProject.summary}
                </p>

                {/* Clean Tech Stack */}
                <div className="pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                    TECH STACK
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                    {activeProject.techStack.map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[10px] sm:text-[11px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 font-mono text-xs w-full">
                <button
                  onClick={() => setRfpModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Request Proposal</span>
                </button>

                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs group"
                  >
                    <span>Live Website</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: REALISTIC LIGHT-MODE METALLIC DEVICE MOCKUP CANVAS */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center relative py-2 sm:py-6 w-full overflow-hidden">
              {/* Soft Pedestal Shadow */}
              <div className="absolute inset-x-4 sm:inset-x-12 bottom-6 h-12 bg-slate-400/20 blur-2xl rounded-full pointer-events-none" />

              {/* ---------------------------------------------------- */}
              {/* OPTION A: TRI-DEVICE STUDIO COMPOSITION (Silver Metallic) */}
              {/* ---------------------------------------------------- */}
              {effectiveDeviceMode === 'trio' && (
                <div className="relative w-full max-w-[680px] flex flex-col items-center justify-center py-2 sm:py-4 px-1 sm:px-2">
                  <div className="relative w-full flex items-center justify-center">
                    {/* 1. Center: Silver MacBook Pro Mockup (Clickable) */}
                    <div
                      onClick={() => setDeviceMode('macbook')}
                      className="w-full max-w-[280px] xs:max-w-[330px] sm:max-w-[440px] lg:max-w-[500px] z-10 transition-transform duration-300 cursor-pointer hover:scale-[1.01]"
                      title="Click to focus on Laptop View"
                    >
                      <div className="rounded-t-xl sm:rounded-t-2xl border-2 border-slate-300 bg-slate-100 shadow-2xl p-1.5 sm:p-2.5 pb-0">
                        {/* Top Camera Dot */}
                        <div className="h-2 sm:h-3 flex items-center justify-center mb-1">
                          <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-slate-400 ring-1 ring-slate-300" />
                        </div>
                        {/* Browser Mock Screen */}
                        <div className="relative aspect-[2/1] rounded sm:rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                          {activeProject.videoSrc ? (
                            <video
                              key={activeProject.id}
                              src={activeProject.videoSrc}
                              poster={activeProject.imageSrc}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                          ) : (
                            <img
                              src={activeProject.imageSrc}
                              alt={activeProject.title}
                              className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                          )}
                          <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-slate-100/90 border-b border-slate-200 px-1.5 sm:px-2 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 backdrop-blur-md z-10">
                            <div className="flex items-center space-x-1">
                              <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-rose-400 inline-block" />
                              <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-amber-400 inline-block" />
                              <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-emerald-400 inline-block" />
                            </div>
                            {activeProject.mockUrl ? (
                              <div className="flex items-center space-x-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 max-w-[130px] sm:max-w-[180px] truncate">
                                <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{activeProject.mockUrl.replace(/^https?:\/\//, '')}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 font-sans font-medium max-w-[130px] sm:max-w-[180px] truncate">
                                <span className="truncate">{activeProject.title}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1 sm:space-x-1.5">
                              {activeProject.videoSrc && (
                                <span className="text-[7px] sm:text-[8px] text-emerald-600 font-bold hidden sm:inline flex items-center space-x-0.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>Live Video</span>
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxView('desktop');
                                  setLightboxOpen(true);
                                }}
                                className="text-[7px] sm:text-[8px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5 sm:space-x-1 bg-white hover:bg-slate-50 px-1 sm:px-1.5 py-0.5 rounded border border-slate-200 transition-colors shadow-2xs"
                                title="Inspect high-resolution view"
                              >
                                <Maximize2 className="h-2 w-2 text-blue-600" />
                                <span className="hidden xs:inline">Inspect HD</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Aluminum Bottom Lip & Hinge */}
                      <div className="h-2.5 sm:h-3.5 bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-xl border-t border-slate-300 shadow-md relative flex items-center justify-center">
                        <div className="h-0.5 sm:h-1 w-10 sm:w-14 bg-slate-400/80 rounded-b" />
                      </div>
                    </div>

                    {/* 2. Left Foreground: Silver iPad Pro Mockup (Clickable to switch mode) */}
                    <div
                      onClick={() => setDeviceMode('ipad')}
                      className="absolute left-0 sm:-left-4 md:-left-6 bottom-0 w-[76px] xs:w-[88px] sm:w-[150px] md:w-[190px] z-20 shadow-2xl transition-transform hover:scale-105 duration-300 cursor-pointer"
                      title="Click to focus on iPad View"
                    >
                      <div className="rounded-xl sm:rounded-2xl border-2 border-slate-300 bg-slate-100 p-1 sm:p-2 shadow-2xl ring-1 ring-slate-200/50">
                        <div className="relative aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-white border border-slate-200">
                          <img
                            src={activeProject.tabletImageSrc || activeProject.imageSrc}
                            alt="Tablet View"
                            className={`w-full h-full object-contain ${activeProject.category === 'RMS' ? 'bg-[#141416]' : 'bg-slate-50'} object-top`}
                          />
                          <div className="absolute top-1 left-1 text-[6px] sm:text-[7px] font-mono text-slate-700 bg-white/95 px-1 py-0.5 rounded shadow-2xs border border-slate-200 font-semibold">
                            iPad
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Right Foreground: Silver iPhone 16 Pro Mockup (Clickable to switch mode) */}
                    <div
                      onClick={() => setDeviceMode('iphone')}
                      className="absolute right-0 sm:-right-2 md:-right-4 bottom-1 sm:bottom-4 w-[52px] xs:w-[60px] sm:w-[100px] md:w-[125px] z-30 shadow-2xl transition-transform hover:scale-105 duration-300 cursor-pointer"
                      title="Click to focus on Phone View"
                    >
                      <div className="rounded-2xl sm:rounded-3xl border-2 border-slate-300 bg-slate-100 p-1 sm:p-1.5 shadow-2xl ring-1 ring-slate-200/50">
                        <div className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200">
                          <img
                            src={activeProject.mobileImageSrc || activeProject.imageSrc}
                            alt="Mobile View"
                            className={`w-full h-full object-contain ${activeProject.category === 'RMS' ? 'bg-[#141416]' : 'bg-slate-50'} object-top`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tap Hint for Mobile */}
                  <p className="text-[10px] text-slate-400 font-mono text-center mt-2.5 flex items-center justify-center space-x-1 sm:hidden">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span>Tap any device to focus full view</span>
                  </p>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* OPTION B: SOLO SILVER MACBOOK PRO FOCUS (Full Scrollable & Responsive) */}
              {effectiveDeviceMode === 'macbook' && (
                <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[540px] lg:max-w-[660px] shadow-2xl px-1 sm:px-2 mx-auto">
                  <div className="rounded-t-xl sm:rounded-t-2xl border-2 border-slate-300 bg-slate-100 p-1.5 sm:p-2.5 pb-0 shadow-2xl">
                    <div className="h-2.5 sm:h-3 flex items-center justify-center mb-1">
                      <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-slate-400 ring-1 ring-slate-300" />
                    </div>
                    {/* Browser Mock Screen with Auto-Fitting Canvas */}
                    <div className="relative h-auto overflow-hidden rounded sm:rounded-lg bg-white border border-slate-200 shadow-inner group">
                      {/* Sticky Top Safari Chrome */}
                      <div className="sticky top-0 inset-x-0 h-5 sm:h-6 bg-slate-100/95 border-b border-slate-200 px-1.5 sm:px-2 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 backdrop-blur-md z-20">
                        <div className="flex items-center space-x-1">
                          <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-rose-400 inline-block" />
                          <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-amber-400 inline-block" />
                          <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-emerald-400 inline-block" />
                        </div>
                        {activeProject.mockUrl ? (
                          <div className="flex items-center space-x-1 bg-white px-1.5 sm:px-2 py-0.5 rounded border border-slate-200 text-slate-600 max-w-[140px] xs:max-w-[180px] sm:max-w-none truncate">
                            <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{activeProject.mockUrl.replace(/^https?:\/\//, '')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 bg-white px-1.5 sm:px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-sans font-medium max-w-[140px] xs:max-w-[180px] sm:max-w-none truncate">
                            <span className="truncate">{activeProject.title}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1.5">
                          {activeProject.videoSrc && (
                            <span className="text-[7px] sm:text-[8px] text-emerald-600 font-bold flex items-center space-x-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Video Walkthrough</span>
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setLightboxView('desktop');
                              setLightboxOpen(true);
                            }}
                            className="text-[7px] sm:text-[8px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 bg-white hover:bg-slate-50 px-1.5 sm:px-2 py-0.5 rounded border border-slate-200 transition-colors shadow-2xs"
                            title="Inspect high-resolution desktop view"
                          >
                            <Maximize2 className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-blue-600" />
                            <span>Inspect HD</span>
                          </button>
                        </div>
                      </div>
                      {activeProject.videoSrc ? (
                        <video
                          key={activeProject.id}
                          src={activeProject.videoSrc}
                          poster={activeProject.imageSrc}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          className="w-full h-auto block object-cover object-top"
                        />
                      ) : (
                        <img
                          src={activeProject.imageSrc}
                          alt={activeProject.title}
                          className="w-full h-auto block object-top"
                        />
                      )}
                    </div>
                  </div>
                  <div className="h-3 sm:h-4 bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-xl sm:rounded-b-2xl border-t border-slate-300 shadow-lg flex items-center justify-center">
                    <div className="h-1 sm:h-1.5 w-14 sm:w-20 bg-slate-400/80 rounded-b" />
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* OPTION C: SOLO SILVER IPAD PRO FOCUS (Full Scrollable & Legible) */}
              {effectiveDeviceMode === 'ipad' && (
                <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[480px] lg:max-w-[540px] shadow-2xl px-1 sm:px-2 mx-auto">
                  <div className="rounded-2xl sm:rounded-3xl border-2 border-slate-300 bg-slate-100 p-2 sm:p-3 shadow-2xl">
                    {/* iPadOS Header Bar */}
                    <div className="flex items-center justify-between px-1.5 sm:px-2 py-1 mb-1 text-[9px] sm:text-[10px] font-mono text-slate-600">
                      <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span className="font-semibold text-slate-700">iPad Pro</span>
                      </div>
                      {activeProject.mockUrl ? (
                        <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 shadow-2xs text-[8px] sm:text-[9px] max-w-[140px] xs:max-w-[170px] truncate">
                          <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{activeProject.mockUrl.replace(/^https?:\/\//, '')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700 shadow-2xs text-[8px] sm:text-[9px] max-w-[140px] xs:max-w-[170px] truncate font-sans font-medium">
                          <span className="truncate">{activeProject.title}</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setLightboxView('tablet');
                          setLightboxOpen(true);
                        }}
                        className="text-[8px] sm:text-[9px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 bg-white hover:bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 transition-colors shadow-2xs"
                        title="Inspect high-resolution tablet view"
                      >
                        <Maximize2 className="h-2.5 w-2.5 text-blue-600" />
                        <span>Inspect HD</span>
                      </button>
                    </div>

                    {/* Scrollable iPad Screen */}
                    <div className="relative h-[340px] xs:h-[390px] sm:h-[460px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-y-auto overscroll-contain no-scrollbar bg-white border border-slate-200 shadow-inner">
                      <img
                        src={activeProject.tabletImageSrc || activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-auto min-h-full block object-top"
                      />
                    </div>

                    {/* Bottom Aluminum Chin Indicator */}
                    <div className="h-2 flex items-center justify-center pt-1">
                      <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-slate-300 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* OPTION D: SOLO IPHONE 16 PRO FOCUS (Full Scrollable & Legible) */}
              {effectiveDeviceMode === 'iphone' && (
                <div className="w-full max-w-[280px] xs:max-w-[305px] sm:max-w-[325px] lg:max-w-[340px] shadow-2xl px-1 sm:px-2 mx-auto">
                  <div className="rounded-[36px] sm:rounded-[44px] border-4 border-slate-300 bg-slate-100 p-2 sm:p-2.5 shadow-2xl">
                    {/* iPhone Top Status Bar */}
                    <div className="h-5 sm:h-6 flex items-center justify-between px-2.5 sm:px-3 mb-1 text-[9px] sm:text-[10px] font-mono text-slate-700 font-bold">
                      <span>9:41</span>
                      <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-slate-900 rounded-full" />
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[8px] sm:text-[9px]">5G</span>
                        <button
                          onClick={() => {
                            setLightboxView('mobile');
                            setLightboxOpen(true);
                          }}
                          className="text-[8px] sm:text-[9px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5 bg-white hover:bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-200 transition-colors shadow-2xs"
                          title="Inspect high-resolution mobile view"
                        >
                          <Maximize2 className="h-2 w-2 text-blue-600" />
                          <span>HD</span>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable iPhone Screen */}
                    <div className="relative h-[390px] xs:h-[430px] sm:h-[480px] lg:h-[540px] rounded-[24px] sm:rounded-[30px] overflow-y-auto overscroll-contain no-scrollbar bg-white border border-slate-200 shadow-inner">
                      <img
                        src={activeProject.mobileImageSrc || activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-auto min-h-full block object-top"
                      />
                    </div>

                    {/* iPhone Bottom Home Indicator Bar */}
                    <div className="h-2 flex items-center justify-center pt-1">
                      <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Filmstrip Carousel Navigation - FULLY RESPONSIVE */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 flex flex-col lg:flex-row items-center gap-2.5 sm:gap-3 font-mono text-xs w-full">
            <div className="flex items-center justify-between w-full lg:w-auto space-x-2 shrink-0">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                  title="Previous Project"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                  title="Next Project"
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
              <span className="text-slate-700 px-1 font-bold whitespace-nowrap text-[11px] sm:text-xs">
                PROJECT {activeDisplayNumber} OF {String(filteredProjects.length).padStart(2, '0')}
              </span>
            </div>

            {/* Thumbnail Quick Selector Strip - Smooth horizontal scroll on mobile, flex auto-distribution on desktop */}
            <div className="w-full flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
              {filteredProjects.map((p, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-9 sm:h-11 px-2.5 sm:px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all font-medium shrink-0 text-center ${
                      isCurrent
                        ? p.isCurrentlyBuilding
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-400/30'
                          : 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-[10px] sm:text-[11px] font-bold shrink-0 ${isCurrent ? 'text-white' : 'text-blue-600'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold whitespace-nowrap">
                      {p.title}
                    </span>
                    {p.isCurrentlyBuilding && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse shrink-0" />
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
      <footer className="min-h-[44px] py-2 border-t border-slate-200/90 bg-white/95 px-3 sm:px-8 lg:px-12 shrink-0 font-sans flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 gap-1 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap justify-center sm:justify-start">
          <span className="font-extrabold text-slate-900 font-display text-xs">ARCANUM SHOWCASE</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <a href="mailto:info@arcanum.ae" className="text-blue-600 hover:underline">info@arcanum.ae</a>
          <span className="text-slate-300">•</span>
          <span>+971 4 397 5002</span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="hidden md:inline">Dubai, UAE</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="hidden sm:inline">© {new Date().getFullYear()} Arcanum Information Technology</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
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
              className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 shadow-2xl z-10 space-y-5 sm:space-y-6 max-h-[88vh] overflow-y-auto text-slate-900"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 font-mono text-xs text-blue-600 mb-1 font-bold">
                    <span>SYSTEM BLUEPRINT</span>
                    <span>•</span>
                    <span>
                      {activeProject.category === 'RMS' && activeProject.subcategory
                        ? `RMS • ${activeProject.subcategory}`
                        : activeProject.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">
                    {activeProject.title}
                  </h3>
                  {activeProject.mockUrl && (
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{activeProject.mockUrl}</p>
                  )}
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
              className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 shadow-2xl z-10 space-y-4 sm:space-y-5 text-slate-900 max-h-[88vh] overflow-y-auto"
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

      {/* ========================================================= */}
      {/* 6. HIGH-RESOLUTION ZOOM / LIGHTBOX INSPECTOR MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="px-3 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/90 backdrop-blur-md flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 font-display truncate">
                    {activeProject.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 hidden sm:inline shrink-0">
                    HD INSPECTOR
                  </span>
                </div>

                {/* Device Selector Tabs */}
                {isLaptopOnly ? (
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold shadow-2xs">
                    <Laptop className="h-3.5 w-3.5 text-blue-600" />
                    <span>Laptop View Only</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs font-mono text-xs">
                    <button
                      onClick={() => setLightboxView('desktop')}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all font-semibold ${
                        lightboxView === 'desktop'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Laptop className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Desktop</span>
                    </button>
                    <button
                      onClick={() => setLightboxView('tablet')}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all font-semibold ${
                        lightboxView === 'tablet'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Tablet className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Tablet</span>
                    </button>
                    <button
                      onClick={() => setLightboxView('mobile')}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all font-semibold ${
                        lightboxView === 'mobile'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Mobile</span>
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                    title="Close Inspector"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Canvas */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6 bg-slate-100/60 flex items-start justify-center">
                {lightboxView === 'desktop' && (
                  <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="h-6 bg-slate-100 border-b border-slate-200 px-3 flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="text-[10px] font-mono text-slate-500 ml-2">
                        {activeProject.mockUrl ? activeProject.mockUrl.replace(/^https?:\/\//, '') : activeProject.title}
                      </span>
                    </div>
                    {activeProject.videoSrc ? (
                      <video
                        src={activeProject.videoSrc}
                        controls
                        autoPlay
                        loop
                        className="w-full h-auto block"
                      />
                    ) : (
                      <img
                        src={activeProject.imageSrc}
                        alt={activeProject.title}
                        className="w-full h-auto block object-top"
                      />
                    )}
                  </div>
                )}

                {lightboxView === 'tablet' && (
                  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden p-2 bg-slate-50">
                    <img
                      src={activeProject.tabletImageSrc || activeProject.imageSrc}
                      alt={`${activeProject.title} Tablet`}
                      className="w-full h-auto block rounded-xl border border-slate-200 object-top"
                    />
                  </div>
                )}

                {lightboxView === 'mobile' && (
                  <div className="w-full max-w-sm bg-white rounded-[32px] shadow-xl border-4 border-slate-300 overflow-hidden p-2 bg-slate-50">
                    <img
                      src={activeProject.mobileImageSrc || activeProject.imageSrc}
                      alt={`${activeProject.title} Mobile`}
                      className="w-full h-auto block rounded-[24px] border border-slate-200 object-top"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
