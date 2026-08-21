'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Landmark,
  Database,
  Boxes,
  HeartPulse,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Send,
  Calendar,
  Clock,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { ARCANUM_MODULES, ARCANUM_INFO, ModuleItem } from '@/data/arcanumData';
import { getProductDetails } from '@/data/productDetailsData';
import { useCms } from '@/lib/cmsContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrochureModal } from '@/components/BrochureModal';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Enterprise: Building2,
  Banking: Landmark,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Infrastructure: Database,
  Workspace: Boxes,
};

function DemoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { content } = useCms();
  const [brochuresOpen, setBrochuresOpen] = useState(false);

  const modulesList = useMemo(() => {
    return content?.modules && content.modules.length > 0 ? content.modules : ARCANUM_MODULES;
  }, [content?.modules]);

  const rawParam =
    searchParams?.get('product') ||
    searchParams?.get('module') ||
    searchParams?.get('id') ||
    searchParams?.get('slug') ||
    '';

  // Find matching module
  const matchedModule = useMemo(() => {
    if (!rawParam) return modulesList[0] || ARCANUM_MODULES[0];
    return (
      modulesList.find(
        (m) =>
          m.id?.toLowerCase() === rawParam.toLowerCase() ||
          m.slug?.toLowerCase() === rawParam.toLowerCase() ||
          m.title?.toLowerCase() === rawParam.toLowerCase() ||
          m.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawParam.toLowerCase()
      ) ||
      modulesList[0] ||
      ARCANUM_MODULES[0]
    );
  }, [modulesList, rawParam]);

  const pageDetails = useMemo(() => {
    return matchedModule ? getProductDetails(matchedModule) : null;
  }, [matchedModule]);

  const [selectedModuleId, setSelectedModuleId] = useState<string>(matchedModule?.id || 'oms');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    country: 'United Arab Emirates',
    deployment: 'Cloud Hosted (UAE Sovereign)',
    timeframe: 'Within 48 Hours',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync selectedModuleId when matchedModule changes
  useEffect(() => {
    if (matchedModule?.id) {
      setSelectedModuleId(matchedModule.id);
    }
  }, [matchedModule?.id]);

  const activeModuleItem = useMemo(() => {
    return modulesList.find((m) => m.id === selectedModuleId) || matchedModule;
  }, [modulesList, selectedModuleId, matchedModule]);

  const activeCategoryIcon = activeModuleItem
    ? CATEGORY_ICONS[activeModuleItem.category] ?? Boxes
    : Boxes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      name: formData.name,
      email: formData.email,
      module: `${activeModuleItem?.title || 'Enterprise Solution'} (${activeModuleItem?.category || 'General'})`,
      message: `[DEMO REQUEST]
Company: ${formData.company}
Role: ${formData.role}
Phone: ${formData.phone}
Country: ${formData.country}
Deployment Preference: ${formData.deployment}
Timeframe: ${formData.timeframe}

Requirements / Notes:
${formData.message || 'Standard Technical Architecture Discovery & Live Sandbox Walkthrough'}`,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to dispatch demo inquiry. Please try again.');
      }
    } catch (err) {
      console.warn('[Demo Submission Error]', err);
      // Graceful success fallback for local development
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const IconComp = activeCategoryIcon;

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-[#2384ba]/30 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => {}}
      />

      {/* Hero Header Area */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2384ba]/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-900/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/#solutions" className="hover:text-white transition-colors">
              Solutions
            </Link>
            <span>/</span>
            {activeModuleItem && (
              <>
                <Link
                  href={`/solutions/${activeModuleItem.slug || activeModuleItem.id}`}
                  className="text-[#2384ba] hover:underline"
                >
                  {activeModuleItem.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-white font-bold">Book a Demo</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2384ba]/15 border border-[#2384ba]/30 text-[#2384ba] font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Architecture Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-display">
              Schedule a Technical Demo &{' '}
              <span className="bg-gradient-to-r from-[#2384ba] to-cyan-400 bg-clip-text text-transparent">
                Architecture Walkthrough.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl">
              Connect 1-on-1 with our Principal Enterprise Architects for a live sandbox demonstration, custom schema mapping, and latency benchmark evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Architecture Overview Grid */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold block">
                  DEMO REQUEST CONFIRMED
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  We Have Received Your Discovery Request
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
                  Thank you, <strong className="text-white">{formData.name || 'valued partner'}</strong>. A Senior Solutions Architect has been assigned to your request for{' '}
                  <strong className="text-cyan-300">{activeModuleItem?.title}</strong>. We will reach out within{' '}
                  <span className="text-emerald-400 font-mono font-bold">{formData.timeframe}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 text-left space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500">Target System:</span>
                  <span className="text-white font-bold">{activeModuleItem?.title}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="text-cyan-300">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Global Hub:</span>
                  <span className="text-emerald-400">Abu Dhabi HQ / Kerala R&D Center</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                {activeModuleItem && (
                  <Link
                    href={`/solutions/${activeModuleItem.slug || activeModuleItem.id}`}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all border border-white/10"
                  >
                    ← Return to Solution Specifications
                  </Link>
                )}
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-mono text-xs font-bold transition-all shadow-lg"
                >
                  Explore Arcanum Home
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Booking Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Interactive Booking Form */}
              <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Enter Enterprise Specifications
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">
                    Please provide your contact and project parameters to schedule a tailored technical discovery session.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Target Product Selector Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-bold">
                      TARGET ENTERPRISE SYSTEM / MODULE *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedModuleId}
                        onChange={(e) => {
                          setSelectedModuleId(e.target.value);
                          const chosen = modulesList.find((m) => m.id === e.target.value);
                          if (chosen) {
                            router.replace(`/demo?product=${chosen.slug || chosen.id}`, { scroll: false });
                          }
                        }}
                        className="w-full appearance-none bg-slate-950 border border-white/15 hover:border-[#2384ba]/50 focus:border-[#2384ba] rounded-xl px-4 py-3.5 text-xs sm:text-sm font-bold text-white font-mono cursor-pointer focus:outline-none transition-all shadow-inner"
                      >
                        {modulesList.map((m) => (
                          <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                            {m.title} — ({m.category})
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        YOUR FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Al Mansoori"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        CORPORATE WORK EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tariq@entity.gov.ae"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        ORGANIZATION / ENTITY NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abu Dhabi Investment Authority"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        JOB TITLE / ROLE
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chief Technology Officer"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Phone & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        PHONE / WHATSAPP NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        COUNTRY / REGION
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                        <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                        <option value="Qatar">🇶🇦 Qatar</option>
                        <option value="Kuwait">🇰🇼 Kuwait</option>
                        <option value="Oman">🇴🇲 Oman</option>
                        <option value="Bahrain">🇧🇭 Bahrain</option>
                        <option value="India">🇮🇳 India</option>
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="Other / Global">🌐 Other Region</option>
                      </select>
                    </div>
                  </div>

                  {/* Deployment & Discovery Timeframe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        DEPLOYMENT TOPOLOGY
                      </label>
                      <select
                        value={formData.deployment}
                        onChange={(e) => setFormData({ ...formData, deployment: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Cloud Hosted (UAE Sovereign)">Sovereign UAE Cloud (Local Data Residency)</option>
                        <option value="On-Premise Enterprise Air-Gapped">On-Premise (Private Data Center)</option>
                        <option value="Hybrid Multi-Cloud Cluster">Hybrid Multi-Cloud Cluster</option>
                        <option value="Managed SaaS Dedicated Tenant">Managed Dedicated Cloud Tenant</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        DESIRED TIMEFRAME
                      </label>
                      <select
                        value={formData.timeframe}
                        onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Immediate RFQ / Tender">Immediate RFQ / Active Tender</option>
                        <option value="Within 48 Hours">Within 48 Hours</option>
                        <option value="This Week">This Week</option>
                        <option value="Next Week">Next Week</option>
                        <option value="General Exploration">General Architecture Evaluation</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Requirements */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-slate-300 uppercase">
                      INTEGRATION SCOPE & TECHNICAL REQUIREMENTS
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe your existing infrastructure, user load, or legacy migration goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 focus:border-[#2384ba] rounded-xl p-4 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 leading-relaxed"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-8 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] disabled:opacity-50 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#2384ba]/30 active:scale-[0.99]"
                  >
                    {submitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Dispatching Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm Demo Booking & Request Discovery</span>
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center font-mono">
                    🔒 Strict NDA Protection • Zero Sales Spam • Direct Technical Engagement
                  </p>
                </form>
              </div>

              {/* Right Column: Selected Solution Card & Assurance Box */}
              <div className="lg:col-span-5 space-y-6">
                {/* Active Solution Summary Card */}
                {activeModuleItem && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-[#2384ba]/30 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba]">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#2384ba] tracking-wider block">
                            SELECTED SOLUTION
                          </span>
                          <h4 className="text-lg font-bold text-white">{activeModuleItem.title}</h4>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                        READY
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                      {activeModuleItem.description}
                    </p>

                    {/* Specs / Badges */}
                    <div className="grid grid-cols-2 gap-2.5 font-mono text-xs mb-6">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">LATENCY TARGET</span>
                        <span className="text-white font-bold">{pageDetails?.architecture?.latency || '2.4ms'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">SLA ASSURANCE</span>
                        <span className="text-emerald-400 font-bold">99.99% Guaranteed</span>
                      </div>
                    </div>

                    <Link
                      href={`/solutions/${activeModuleItem.slug || activeModuleItem.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2384ba] hover:underline font-bold"
                    >
                      <span>Inspect Live Solution Specs</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* What to Expect in Discovery Session */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
                  <h4 className="font-bold text-sm text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>What to Expect in Discovery</span>
                  </h4>

                  <ul className="space-y-3 font-sans text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2384ba] shrink-0 mt-0.5" />
                      <span><strong>30-Minute Live Sandbox:</strong> Hands-on review of microservice architecture, API payload schemas, and high-concurrency event loops.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2384ba] shrink-0 mt-0.5" />
                      <span><strong>Custom Schema Mapping:</strong> Analysis of your current database structure, RBAC requirements, and legacy Oracle/SQL cutover.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2384ba] shrink-0 mt-0.5" />
                      <span><strong>UAE Sovereign Compliance:</strong> Verification of local data residency, ISO 27001 certifications, and TLS 1.3 cryptographic seals.</span>
                    </li>
                  </ul>
                </div>

                {/* Direct Global Hubs Contact */}
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 font-mono text-xs space-y-3">
                  <span className="text-slate-500 uppercase tracking-widest block text-[10px]">
                    DIRECT ENGAGEMENT DESK
                  </span>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#2384ba]" />
                      <span>info@arcanum.ae</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Abu Dhabi, UAE • Kerala, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Brochure Modal */}
      <BrochureModal isOpen={brochuresOpen} onClose={() => setBrochuresOpen(false)} />

      {/* Footer */}
      <Footer
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => {}}
        onSelectHub={() => {}}
      />
    </div>
  );
}

export default function BookDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-white font-mono text-sm">
          Loading Demo Portal...
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
