'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Clock, Building2, Cpu, ArrowUpRight, CheckCircle2, Navigation } from 'lucide-react';
import { GsapTextSplit } from '@/components/GsapTextSplit';

export interface LocationHub {
  id: string;
  city: string;
  country: string;
  flag: string;
  role: string;
  description: string;
  coordinates: { x: number; y: number }; // Percentage positions on SVG map canvas
  latLng: string;
  timezone: string;
  gmtOffset: number; // Hours relative to UTC
  address: string;
  focusDomains: string[];
  stats: { label: string; value: string }[];
  isHq?: boolean;
}

export const LOCATION_HUBS: LocationHub[] = [
  {
    id: 'abudhabi',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    role: 'Global Headquarters & Executive Hub',
    description:
      'Strategic corporate headquarters directing global enterprise operations, client advisory, financial technology governance, and regional Middle East deployments.',
    coordinates: { x: 42, y: 44 }, // Map percentage position
    latLng: '24.4539° N, 54.3773° E',
    timezone: 'GST (Gulf Standard Time)',
    gmtOffset: 4,
    address: 'Arcanum Information Technology, Abu Dhabi, United Arab Emirates',
    focusDomains: ['Enterprise ERP', 'Core Banking Integrations', 'Client Strategy', 'Cloud Governance'],
    stats: [
      { label: 'System SLA', value: '99.99%' },
      { label: 'Client Node Latency', value: '< 12ms' },
      { label: 'Regional Focus', value: 'GCC & Global' },
    ],
    isHq: true,
  },
  {
    id: 'kerala',
    city: 'Kerala',
    country: 'India',
    flag: '🇮🇳',
    role: 'Engineering & Core R&D Hub',
    description:
      'Primary software architecture and product innovation center specializing in full-stack engineering, Oracle Forms modernizations, and scalable cloud microservices.',
    coordinates: { x: 74, y: 64 },
    latLng: '10.8505° N, 76.2711° E',
    timezone: 'IST (Indian Standard Time)',
    gmtOffset: 5.5,
    address: 'Arcanum Engineering Center, Tech Hub, Kerala, India',
    focusDomains: ['Oracle Forms Refactoring', 'School Management (Scholar)', 'Clinic Systems', 'Microservices'],
    stats: [
      { label: 'Core Engineers', value: 'Senior R&D' },
      { label: 'Deployment Rate', value: 'Continuous CI/CD' },
      { label: 'Quality Audit', value: 'ISO 27001' },
    ],
  },
  {
    id: 'gujarat',
    city: 'Gujarat',
    country: 'India',
    flag: '🇮🇳',
    role: 'Tech & Operations Center',
    description:
      'High-performance operations and enterprise systems unit delivering automated payroll processing, custom web applications, and round-the-clock technical support.',
    coordinates: { x: 68, y: 48 },
    latLng: '22.2587° N, 71.1924° E',
    timezone: 'IST (Indian Standard Time)',
    gmtOffset: 5.5,
    address: 'Arcanum Tech & Operations Hub, Gujarat, India',
    focusDomains: ['Accurate PAYROLL (WPS)', 'Restaurant POS', 'Dynamic Forms', 'Enterprise Support'],
    stats: [
      { label: 'Active Users', value: '150K+' },
      { label: 'WPS Compliance', value: '100% Automated' },
      { label: 'Support Window', value: '24/7 Operations' },
    ],
  },
];

function LiveClock({ gmtOffset }: { gmtOffset: number }) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const local = new Date(utc + 3600000 * gmtOffset);
      setTimeString(
        local.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [gmtOffset]);

  return <span className="font-mono text-white font-bold">{timeString || '12:00:00 PM'}</span>;
}

import { useCms } from '@/lib/cmsContext';

interface LocationsSectionProps {
  onOpenContact?: () => void;
  selectedHubId?: string;
  onSelectHub?: (id: string) => void;
}

export function LocationsSection({ onOpenContact, selectedHubId, onSelectHub }: LocationsSectionProps) {
  const { content } = useCms();
  const info = content?.info;
  const locationHubs = content?.locations && content.locations.length > 0 ? content.locations : LOCATION_HUBS;

  const [internalHubId, setInternalHubId] = useState<string>(locationHubs[0]?.id || 'abudhabi');
  const [hoveredHub, setHoveredHub] = useState<LocationHub | null>(null);

  const activeHubId = selectedHubId ?? internalHubId;
  const selectedHub = (locationHubs as LocationHub[]).find((hub) => hub.id === activeHubId) ?? (locationHubs[0] as LocationHub);

  const selectHub = (hub: LocationHub) => {
    if (onSelectHub) onSelectHub(hub.id);
    else setInternalHubId(hub.id);
  };

  return (
    <section id="locations" className="relative bg-[#0f172a] py-24 md:py-32 overflow-hidden border-t border-white/10">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#2384ba]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-[#2384ba] uppercase mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{info?.locationsBadge || 'GLOBAL FOOTPRINT & ENGINEERING NODES'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              <GsapTextSplit
                text={info?.locationsTitle || "Our 3 Operational"}
                highlightText={info?.locationsTitleHighlight || "Tech Hubs."}
                variant="heading-3d"
                triggerOnScroll
              />
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 max-w-md font-sans leading-relaxed">
            {info?.locationsDescription || 'Strategically distributed across Abu Dhabi, Kerala, and Gujarat to deliver 24/7 enterprise engineering, client strategy, and mission-critical system continuity.'}
          </p>
        </div>

        {/* Hub Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {locationHubs.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => selectHub(hub)}
                className={`relative flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-[#2384ba] bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#2384ba]/15 shadow-xl shadow-[#2384ba]/20 scale-[1.02]'
                    : 'border-white/10 bg-slate-950/60 hover:border-white/30 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <span className="text-2xl">{hub.flag}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{hub.city}</span>
                      {hub.isHq && (
                        <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-[#2384ba] text-white">
                          GLOBAL HQ
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">{hub.country}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] uppercase text-emerald-400">ONLINE</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Grid: Map + Active Hub Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Custom High-Tech Map Canvas Frame (7 cols) */}
          <div className="lg:col-span-7 relative rounded-3xl border border-white/15 bg-slate-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden min-h-[420px]">
            {/* Ambient Map Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 font-mono text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#2384ba]" />
                <span className="text-white font-bold uppercase tracking-wider">REGIONAL NETWORK MESH</span>
              </div>
              <span className="text-emerald-400 font-semibold">ACTIVE TELEMETRY</span>
            </div>

            {/* Custom Dark Vector Regional Map Canvas */}
            <div className="relative w-full aspect-[16/10] my-auto flex items-center justify-center overflow-hidden rounded-2xl bg-[#090d16] border border-white/10 p-4">
              
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-15 dark-technical-grid pointer-events-none" />

              {/* Connecting Arc Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Arc: Abu Dhabi (42, 44) to Gujarat (68, 48) */}
                <path
                  d="M 42 44 Q 55 35 68 48"
                  fill="none"
                  stroke="#2384ba"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  className="animate-pulse"
                />
                {/* Arc: Gujarat (68, 48) to Kerala (74, 64) */}
                <path
                  d="M 68 48 Q 71 56 74 64"
                  fill="none"
                  stroke="#2384ba"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  className="animate-pulse"
                />
                {/* Arc: Abu Dhabi (42, 44) to Kerala (74, 64) */}
                <path
                  d="M 42 44 Q 58 60 74 64"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.6"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* Map Continent Outlines (Simplified High-Tech Regional Stylized Overlay) */}
              <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full text-slate-700 fill-current" viewBox="0 0 800 500">
                  {/* Arabian Peninsula & South Asia landform silhouettes */}
                  <path d="M 220,180 Q 280,160 360,200 T 420,300 L 380,360 Q 320,340 280,280 Z" />
                  <path d="M 480,200 Q 560,180 620,240 T 580,380 L 520,420 Q 480,360 480,260 Z" />
                </svg>
              </div>

              {/* Interactive Location Pins */}
              {locationHubs.map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                const isHovered = hoveredHub?.id === hub.id;

                return (
                  <div
                    key={hub.id}
                    style={{ left: `${hub.coordinates.x}%`, top: `${hub.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                    onClick={() => selectHub(hub)}
                    onMouseEnter={() => setHoveredHub(hub)}
                    onMouseLeave={() => setHoveredHub(null)}
                  >
                    {/* Pulsing Ripple */}
                    <div className={`absolute -inset-3 rounded-full animate-ping opacity-75 ${isSelected ? 'bg-[#2384ba]' : 'bg-[#2384ba]/50'}`} />

                    {/* Outer Ring */}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border shadow-lg transition-transform duration-300 ${
                      isSelected
                        ? 'bg-[#2384ba] border-white scale-125 shadow-[#2384ba]/60'
                        : 'bg-slate-900/90 border-[#2384ba]/60 hover:scale-110'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#2384ba]'}`} />
                    </div>

                    {/* Pin Label Tag */}
                    <div className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#2384ba] to-[#1b6ca1] text-white shadow-md'
                        : 'bg-slate-950/90 text-slate-300 border border-white/10'
                    }`}>
                      {hub.flag} {hub.city.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Stats Legend */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
              <div className="flex items-center space-x-2">
                <Navigation className="w-3.5 h-3.5 text-[#2384ba]" />
                <span>COORDINATES: {selectedHub.latLng}</span>
              </div>
              <div className="text-emerald-400 font-medium">3 ACTIVE HUBS LINKED</div>
            </div>
          </div>

          {/* Active Hub Detailed Info Panel (5 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl border border-[#2384ba]/30 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedHub.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Hub Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedHub.flag}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{selectedHub.city}</h3>
                      <span className="font-mono text-xs text-[#2384ba] font-semibold">{selectedHub.country}</span>
                    </div>
                  </div>
                  {selectedHub.isHq && (
                    <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-[#2384ba]/20 border border-[#2384ba]/40 text-[#2384ba]">
                      GLOBAL HQ
                    </span>
                  )}
                </div>

                {/* Role & Description */}
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-1">
                    FACILITY ROLE
                  </span>
                  <h4 className="text-base font-semibold text-white mb-2">{selectedHub.role}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {selectedHub.description}
                  </p>
                </div>

                {/* Time & Telemetry Widget */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-[#2384ba]" />
                    <div>
                      <div className="text-[10px] text-slate-400">LOCAL TIME</div>
                      <LiveClock gmtOffset={selectedHub.gmtOffset} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">TIMEZONE</div>
                    <span className="text-slate-200 font-semibold">{selectedHub.timezone.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Focus Core Domains */}
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-2.5">
                    CORE SPECIALIZATIONS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedHub.focusDomains.map((domain) => (
                      <span
                        key={domain}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-white/10 bg-slate-900 text-slate-200 text-xs font-mono"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#2384ba]" />
                        <span>{domain}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 font-mono text-center">
                  {selectedHub.stats.map((st) => (
                    <div key={st.label} className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-sm font-bold text-white">{st.value}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{st.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action CTA */}
            {onOpenContact && (
              <div className="mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={onOpenContact}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-mono text-xs uppercase font-semibold tracking-wider transition-colors shadow-lg shadow-[#2384ba]/25"
                >
                  <span>Connect with {selectedHub.city} Hub</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
