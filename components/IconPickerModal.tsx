'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Building2,
  Layers,
  Landmark,
  Database,
  Boxes,
  HeartPulse,
  GraduationCap,
  UtensilsCrossed,
  Users,
  LineChart,
  ShieldCheck,
  Lock,
  Smartphone,
  Cpu,
  Server,
  Zap,
  Briefcase,
  Code,
  FileSpreadsheet,
  Scale,
  Receipt,
  Calendar,
  ClipboardList,
  CreditCard,
  Headphones,
  Globe,
  Activity,
  Sparkles,
  ShoppingBag,
  Truck,
  FolderGit2,
  FileText,
  Workflow,
  BarChart3,
  Network,
  Cloud,
  Terminal,
  Key,
  ShieldAlert,
  Share2,
  GitMerge,
  Compass,
  Gauge,
  Binary,
  Fingerprint,
  Stethoscope,
  Pill,
  BookOpen,
  Coffee,
  Package,
  Search,
  X,
  Check,
} from 'lucide-react';

export type LucideIconComponent = React.ComponentType<{ className?: string }>;

export interface IconCatalogItem {
  name: string;
  label: string;
  category: 'Enterprise' | 'FinTech' | 'Healthcare' | 'Education' | 'Cloud & Dev' | 'Security' | 'Operations' | 'General';
  icon: LucideIconComponent;
  keywords: string[];
}

export const ICON_CATALOG: IconCatalogItem[] = [
  // Enterprise & Business
  { name: 'Building2', label: 'Building / Enterprise', category: 'Enterprise', icon: Building2, keywords: ['office', 'company', 'corporate', 'erp', 'building'] },
  { name: 'Layers', label: 'Architecture / Modules', category: 'Enterprise', icon: Layers, keywords: ['stack', 'tier', 'system', 'structure', 'layers'] },
  { name: 'Briefcase', label: 'Business / Portfolio', category: 'Enterprise', icon: Briefcase, keywords: ['work', 'job', 'management', 'corporate'] },
  { name: 'Scale', label: 'Legal & Governance', category: 'Enterprise', icon: Scale, keywords: ['law', 'compliance', 'justice', 'balance', 'audit'] },
  { name: 'FileSpreadsheet', label: 'Accounting / Ledger', category: 'Enterprise', icon: FileSpreadsheet, keywords: ['finance', 'excel', 'sheet', 'tax', 'vat'] },
  { name: 'Receipt', label: 'Invoicing & Billing', category: 'Enterprise', icon: Receipt, keywords: ['invoice', 'bill', 'receipt', 'pos', 'sales'] },
  { name: 'Users', label: 'HRMS / Team', category: 'Enterprise', icon: Users, keywords: ['people', 'staff', 'employees', 'human resources'] },

  // FinTech & Banking
  { name: 'Landmark', label: 'Core Banking / Treasury', category: 'FinTech', icon: Landmark, keywords: ['bank', 'finance', 'treasury', 'vault', 'cooperative'] },
  { name: 'CreditCard', label: 'Payments & Switch', category: 'FinTech', icon: CreditCard, keywords: ['card', 'atm', 'pos', 'iso8583', 'transactions'] },
  { name: 'LineChart', label: 'CRM & Revenue Analytics', category: 'FinTech', icon: LineChart, keywords: ['sales', 'graph', 'chart', 'pipeline', 'growth'] },
  { name: 'BarChart3', label: 'BI & Financial Reports', category: 'FinTech', icon: BarChart3, keywords: ['report', 'analytics', 'statistics', 'kpi'] },

  // Healthcare
  { name: 'HeartPulse', label: 'Clinical Healthcare / HMS', category: 'Healthcare', icon: HeartPulse, keywords: ['hospital', 'clinic', 'medical', 'doctor', 'patient'] },
  { name: 'Stethoscope', label: 'Medical Diagnostics', category: 'Healthcare', icon: Stethoscope, keywords: ['doctor', 'consultation', 'diagnostic', 'emr'] },
  { name: 'Pill', label: 'Pharmacy & Dispensing', category: 'Healthcare', icon: Pill, keywords: ['medicine', 'drug', 'pharmacy', 'prescription'] },
  { name: 'Activity', label: 'Patient Vitals / Monitor', category: 'Healthcare', icon: Activity, keywords: ['pulse', 'telemetry', 'vital', 'ecg', 'health'] },

  // Education
  { name: 'GraduationCap', label: 'School / Academic SIS', category: 'Education', icon: GraduationCap, keywords: ['school', 'university', 'college', 'student', 'scholar'] },
  { name: 'BookOpen', label: 'Courseware & Learning', category: 'Education', icon: BookOpen, keywords: ['book', 'curriculum', 'exam', 'library'] },
  { name: 'Calendar', label: 'Timetable & Scheduling', category: 'Education', icon: Calendar, keywords: ['schedule', 'agenda', 'date', 'events', 'timetable'] },

  // Cloud & Developer
  { name: 'Database', label: 'Database / PL-SQL', category: 'Cloud & Dev', icon: Database, keywords: ['oracle', 'postgres', 'sql', 'storage', 'data'] },
  { name: 'Server', label: 'Server & Microservices', category: 'Cloud & Dev', icon: Server, keywords: ['cluster', 'node', 'host', 'backend', 'api'] },
  { name: 'Cloud', label: 'Cloud Infrastructure', category: 'Cloud & Dev', icon: Cloud, keywords: ['aws', 'azure', 'saas', 'hosting', 'network'] },
  { name: 'Code', label: 'API & Developer Engine', category: 'Cloud & Dev', icon: Code, keywords: ['program', 'script', 'rest', 'graphql', 'json'] },
  { name: 'Terminal', label: 'CLI & Shell Console', category: 'Cloud & Dev', icon: Terminal, keywords: ['command', 'bash', 'console', 'developer'] },
  { name: 'FolderGit2', label: 'Git & Repository Sync', category: 'Cloud & Dev', icon: FolderGit2, keywords: ['version control', 'code', 'git', 'branch'] },
  { name: 'GitMerge', label: 'Migration & Refactoring', category: 'Cloud & Dev', icon: GitMerge, keywords: ['merge', 'legacy', 'oracle forms', 'modernization'] },
  { name: 'Binary', label: 'Low-Latency Message Hub', category: 'Cloud & Dev', icon: Binary, keywords: ['packet', 'iso8583', 'switch', 'raw', 'protocol'] },

  // Security & Identity
  { name: 'ShieldCheck', label: 'Security & WPS Compliance', category: 'Security', icon: ShieldCheck, keywords: ['protect', 'audit', 'compliance', 'wps', 'iso'] },
  { name: 'Lock', label: 'HSM Cryptographic Vault', category: 'Security', icon: Lock, keywords: ['encryption', 'vault', 'key', 'secret', 'hsm'] },
  { name: 'Key', label: 'Enterprise SSO & IAM', category: 'Security', icon: Key, keywords: ['auth', 'oauth', 'saml', 'identity', 'access'] },
  { name: 'Fingerprint', label: 'Biometric Authentication', category: 'Security', icon: Fingerprint, keywords: ['biometric', 'login', 'security', 'identity'] },
  { name: 'ShieldAlert', label: 'Threat & Fraud Radar', category: 'Security', icon: ShieldAlert, keywords: ['risk', 'fraud', 'firewall', 'alert'] },

  // Operations & Logistics
  { name: 'Boxes', label: 'Multi-Warehouse Inventory', category: 'Operations', icon: Boxes, keywords: ['stock', 'items', 'warehouse', 'sku', 'catalog'] },
  { name: 'Package', label: 'Procurement & GRN', category: 'Operations', icon: Package, keywords: ['delivery', 'purchase', 'rfq', 'order', 'parcel'] },
  { name: 'Truck', label: 'Supply Chain & Logistics', category: 'Operations', icon: Truck, keywords: ['transport', 'shipping', 'fleet', 'tracking'] },
  { name: 'UtensilsCrossed', label: 'Restaurant POS & KDS', category: 'Operations', icon: UtensilsCrossed, keywords: ['food', 'dining', 'kitchen', 'cafe', 'table'] },
  { name: 'Coffee', label: 'Cafe & Fast Casual', category: 'Operations', icon: Coffee, keywords: ['cafe', 'restaurant', 'beverage', 'hospitality'] },
  { name: 'ShoppingBag', label: 'Retail & Store POS', category: 'Operations', icon: ShoppingBag, keywords: ['shop', 'retail', 'cart', 'store', 'checkout'] },
  { name: 'ClipboardList', label: 'Audit & Task Pipeline', category: 'Operations', icon: ClipboardList, keywords: ['task', 'checklist', 'workflow', 'action'] },
  { name: 'Workflow', label: 'Process Automation', category: 'Operations', icon: Workflow, keywords: ['pipeline', 'stages', 'automation', 'orchestration'] },

  // General & Utility
  { name: 'Smartphone', label: 'Mobile App (iOS/Android)', category: 'General', icon: Smartphone, keywords: ['mobile', 'phone', 'app', 'android', 'ios'] },
  { name: 'Globe', label: 'Global Network & Multi-Hub', category: 'General', icon: Globe, keywords: ['worldwide', 'international', 'branch', 'locations'] },
  { name: 'Cpu', label: 'High-Speed Processing Unit', category: 'General', icon: Cpu, keywords: ['processor', 'hardware', 'chip', 'engine'] },
  { name: 'Zap', label: 'Lightning Microservices', category: 'General', icon: Zap, keywords: ['speed', 'fast', 'instant', 'real-time'] },
  { name: 'Sparkles', label: 'AI Intelligence & Copilot', category: 'General', icon: Sparkles, keywords: ['ai', 'smart', 'automation', 'future', 'magic'] },
  { name: 'Headphones', label: '24/7 Helpdesk & Support', category: 'General', icon: Headphones, keywords: ['support', 'service', 'help', 'call center'] },
  { name: 'FileText', label: 'Documents & Contracts', category: 'General', icon: FileText, keywords: ['pdf', 'doc', 'contract', 'paper'] },
  { name: 'Compass', label: 'Executive Navigation HUD', category: 'General', icon: Compass, keywords: ['guide', 'direction', 'map', 'hub'] },
  { name: 'Gauge', label: 'SLA & Telemetry Benchmark', category: 'General', icon: Gauge, keywords: ['speedometer', 'performance', 'benchmark', 'latency'] },
  { name: 'Network', label: 'Mesh & Integration Gateway', category: 'General', icon: Network, keywords: ['nodes', 'mesh', 'distributed', 'connection'] },
  { name: 'Share2', label: 'Data Exchange & Webhooks', category: 'General', icon: Share2, keywords: ['share', 'export', 'sync', 'webhooks'] },
];

export const LUCIDE_ICON_MAP: Record<string, LucideIconComponent> = ICON_CATALOG.reduce(
  (acc, item) => {
    acc[item.name] = item.icon;
    return acc;
  },
  {} as Record<string, LucideIconComponent>
);

const CATEGORY_DEFAULT_ICONS: Record<string, LucideIconComponent> = {
  Enterprise: Building2,
  Banking: Landmark,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Infrastructure: Database,
  Workspace: Boxes,
};

export function getModuleIcon(iconName?: string, category?: string): LucideIconComponent {
  if (iconName && LUCIDE_ICON_MAP[iconName]) {
    return LUCIDE_ICON_MAP[iconName];
  }
  if (category && CATEGORY_DEFAULT_ICONS[category]) {
    return CATEGORY_DEFAULT_ICONS[category];
  }
  return Boxes;
}

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIconName?: string;
  onSelectIcon: (iconName: string) => void;
  moduleTitle?: string;
}

const CATEGORIES = ['All', 'Enterprise', 'FinTech', 'Healthcare', 'Education', 'Cloud & Dev', 'Security', 'Operations', 'General'] as const;

export function IconPickerModal({
  isOpen,
  onClose,
  selectedIconName,
  onSelectIcon,
  moduleTitle,
}: IconPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredIcons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ICON_CATALOG.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2384ba] bg-[#2384ba]/15 px-2.5 py-0.5 rounded-full border border-[#2384ba]/30">
                Icon Selector
              </span>
              {moduleTitle && (
                <span className="text-xs text-slate-400 font-mono truncate max-w-xs">
                  • {moduleTitle}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Select Module Icon</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-white/10 bg-slate-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons by name, keyword (e.g. bank, cloud, security, chart, code, health)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2384ba] transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2384ba] text-white font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No icons found matching &quot;{searchQuery}&quot;. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredIcons.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedIconName === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.name);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center text-center gap-2 group cursor-pointer ${
                      isSelected
                        ? 'bg-[#2384ba]/20 border-[#2384ba] text-white ring-2 ring-[#2384ba]/50'
                        : 'bg-slate-950/60 border-white/10 hover:border-[#2384ba]/50 hover:bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#2384ba] text-white shadow-lg shadow-[#2384ba]/30'
                          : 'bg-slate-900 border border-white/10 text-slate-400 group-hover:text-[#2384ba] group-hover:border-[#2384ba]/40'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="w-full">
                      <div className="text-xs font-semibold truncate text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.label}</div>
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <Check className="w-2.5 h-2.5" /> Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {filteredIcons.length} available enterprise icons</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
