'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Landmark,
  Database,
  Boxes,
  CheckCircle2,
  ShieldCheck,
  Download,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Server,
  Zap,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  GitBranch,
  HeartPulse,
  GraduationCap,
  Workflow,
  Check,
  Copy,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Sliders,
  Settings2,
  Link2,
  X,
  Image as ImageIcon,
  Upload,
  Camera,
} from 'lucide-react';
import { ModuleItem } from '@/data/arcanumData';
import { getModuleIcon } from '@/components/IconPickerModal';
import {
  ProductDetailItem,
  AccentColorType,
  PageThemeType,
  HeroStyleType,
  InteractiveWidgetType,
  ProductSectionVisibility,
  ProductCustomTitles,
} from '@/data/productDetailsData';

const FLAGSHIP_IMAGES: Record<string, string> = {
  oms: '/hero-topsection/ezgif-frame-105.jpg',
  erp: '/hero_erp.jpg',
  restaurant: '/hero_restaurant.jpg',
  crm: '/hero_crm.jpg',
  hrms: '/hero_hrms.jpg',
  banking: '/banking_fintech.png',
  oracle: '/oracle_modernization.png',
};

export const ACCENT_CONFIG: Record<
  AccentColorType,
  {
    primaryHex: string;
    text: string;
    textHover: string;
    border: string;
    borderHover: string;
    bgLight: string;
    bgSolid: string;
    glow: string;
    badgeBg: string;
    gradient: string;
    ring: string;
  }
> = {
  blue: {
    primaryHex: '#2384ba',
    text: 'text-[#2384ba]',
    textHover: 'hover:text-[#2384ba]',
    border: 'border-[#2384ba]/30',
    borderHover: 'hover:border-[#2384ba]/60',
    bgLight: 'bg-[#2384ba]/15',
    bgSolid: 'bg-[#2384ba] hover:bg-[#1b6ca1]',
    glow: 'bg-[#2384ba]/15',
    badgeBg: 'bg-[#2384ba]/20 text-[#2384ba] border-[#2384ba]/40',
    gradient: 'from-[#2384ba] to-cyan-400',
    ring: 'focus:border-[#2384ba]',
  },
  emerald: {
    primaryHex: '#10b981',
    text: 'text-emerald-400',
    textHover: 'hover:text-emerald-400',
    border: 'border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/60',
    bgLight: 'bg-emerald-500/15',
    bgSolid: 'bg-emerald-600 hover:bg-emerald-500',
    glow: 'bg-emerald-500/15',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    gradient: 'from-emerald-400 to-teal-300',
    ring: 'focus:border-emerald-400',
  },
  violet: {
    primaryHex: '#8b5cf6',
    text: 'text-purple-400',
    textHover: 'hover:text-purple-400',
    border: 'border-purple-500/30',
    borderHover: 'hover:border-purple-500/60',
    bgLight: 'bg-purple-500/15',
    bgSolid: 'bg-purple-600 hover:bg-purple-500',
    glow: 'bg-purple-500/15',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    gradient: 'from-purple-400 to-indigo-300',
    ring: 'focus:border-purple-400',
  },
  amber: {
    primaryHex: '#f59e0b',
    text: 'text-amber-400',
    textHover: 'hover:text-amber-400',
    border: 'border-amber-500/30',
    borderHover: 'hover:border-amber-500/60',
    bgLight: 'bg-amber-500/15',
    bgSolid: 'bg-amber-600 hover:bg-amber-500',
    glow: 'bg-amber-500/15',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    gradient: 'from-amber-400 to-yellow-300',
    ring: 'focus:border-amber-400',
  },
  cyan: {
    primaryHex: '#06b6d4',
    text: 'text-cyan-400',
    textHover: 'hover:text-cyan-400',
    border: 'border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/60',
    bgLight: 'bg-cyan-500/15',
    bgSolid: 'bg-cyan-600 hover:bg-cyan-500',
    glow: 'bg-cyan-500/15',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    gradient: 'from-cyan-400 to-sky-300',
    ring: 'focus:border-cyan-400',
  },
  rose: {
    primaryHex: '#f43f5e',
    text: 'text-rose-400',
    textHover: 'hover:text-rose-400',
    border: 'border-rose-500/30',
    borderHover: 'hover:border-rose-500/60',
    bgLight: 'bg-rose-500/15',
    bgSolid: 'bg-rose-600 hover:bg-rose-500',
    glow: 'bg-rose-500/15',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    gradient: 'from-rose-400 to-pink-300',
    ring: 'focus:border-rose-400',
  },
};

export const THEME_TITLES: Record<PageThemeType, string> = {
  'enterprise-erp': 'ENTERPRISE ERP & OPERATIONS SUITE',
  fintech: 'HIGH-FREQUENCY FINTECH & FINANCIAL SWITCH',
  'clinical-health': 'CLINICAL HEALTHCARE & INTEROPERABILITY ENGINE',
  'academic-edu': 'ACADEMIC SIS & CAMPUS INTELLIGENCE',
  'developer-dev': 'DEVELOPER INFRASTRUCTURE & MODERNIZATION HUD',
  'saas-modern': 'DIGITAL WORKSPACE & ENTERPRISE SAAS',
};

// ============================================================================
// INLINE EDITING HELPER COMPONENTS (WIX / NOTION STYLE)
// ============================================================================

interface InlineInputProps {
  value: string;
  onChange?: (val: string) => void;
  isEditable?: boolean;
  className?: string;
  placeholder?: string;
  type?: string;
}

function InlineInput({
  value,
  onChange,
  isEditable = false,
  className = '',
  placeholder = '',
  type = 'text',
}: InlineInputProps) {
  if (!isEditable) {
    const isBlock = className.includes('block') || className.includes('w-full');
    const displayClass = isBlock ? 'block' : 'inline-block';
    return <span className={`${displayClass} ${className}`}>{value || placeholder}</span>;
  }

  return (
    <input
      type={type}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`bg-transparent outline-none transition-all hover:bg-white/[0.04] focus:bg-slate-900/90 focus:ring-1 focus:ring-[#2384ba] rounded px-1 -mx-1 border-b border-dashed border-white/20 hover:border-[#2384ba]/70 focus:border-[#2384ba] ${className}`}
      title="Click to edit text directly"
    />
  );
}

interface InlineTextareaProps {
  value: string;
  onChange?: (val: string) => void;
  isEditable?: boolean;
  className?: string;
  placeholder?: string;
  rows?: number;
}

function InlineTextarea({
  value,
  onChange,
  isEditable = false,
  className = '',
  placeholder = '',
  rows = 2,
}: InlineTextareaProps) {
  if (!isEditable) {
    return <p className={className}>{value || placeholder}</p>;
  }

  return (
    <textarea
      rows={rows}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full bg-transparent outline-none transition-all hover:bg-white/[0.04] focus:bg-slate-900/90 focus:ring-1 focus:ring-[#2384ba] rounded p-1.5 -m-1.5 border-b border-dashed border-white/20 hover:border-[#2384ba]/70 focus:border-[#2384ba] resize-y ${className}`}
      title="Click to edit text directly"
    />
  );
}

// ============================================================================
// SECONDARY DOWNLOAD / BROCHURE CTA (WITH DIRECT LINK EDITING & HIDE/SHOW)
// ============================================================================

interface SecondaryDownloadCtaProps {
  module: ModuleItem;
  productDetails: ProductDetailItem;
  isEditable: boolean;
  accent: (typeof ACCENT_CONFIG)[AccentColorType];
  onOpenBrochures?: () => void;
  onUpdateProductDetails?: (updater: (prev: ProductDetailItem) => ProductDetailItem) => void;
  onUpdateModule?: (updater: (prev: ModuleItem) => ModuleItem) => void;
}

function SecondaryDownloadCta({
  module,
  productDetails,
  isEditable,
  accent,
  onOpenBrochures,
  onUpdateProductDetails,
  onUpdateModule,
}: SecondaryDownloadCtaProps) {
  const [editingLink, setEditingLink] = useState(false);
  const [tempUrl, setTempUrl] = useState(productDetails.ctaSecondaryUrl || module.brochureUrl || '');
  const ctaSecondary = productDetails.ctaSecondaryText || 'Download PDF Spec';
  const ctaUrl = productDetails.ctaSecondaryUrl || module.brochureUrl || '';
  const isHidden = productDetails.showSecondaryCta === false || productDetails.sectionVisibility?.secondaryCta === false;

  useEffect(() => {
    setTempUrl(productDetails.ctaSecondaryUrl || module.brochureUrl || '');
  }, [productDetails.ctaSecondaryUrl, module.brochureUrl]);

  // In edit mode: if hidden, show a subtle dashed button to re-enable
  if (isEditable && isHidden) {
    return (
      <button
        type="button"
        onClick={() => {
          onUpdateProductDetails?.((prev) => ({
            ...prev,
            showSecondaryCta: true,
            sectionVisibility: { ...(prev.sectionVisibility || {}), secondaryCta: true },
          }));
        }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-dashed border-cyan-500/40 text-cyan-300 font-mono text-xs transition-all shadow-sm group cursor-pointer"
        title="Click to show Download PDF button on page"
      >
        <Eye className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span>+ Show &quot;Download PDF&quot; Button</span>
      </button>
    );
  }

  // In public view mode: if hidden, do not render
  if (!isEditable && isHidden) {
    return null;
  }

  // In edit mode: button with text edit, direct link editor popover, and hide button
  if (isEditable) {
    return (
      <div className="relative inline-flex items-center gap-1.5">
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs sm:text-sm transition-all shadow-md">
          <Download className={`w-4 h-4 ${accent.text} shrink-0`} />
          <InlineInput
            value={ctaSecondary}
            onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, ctaSecondaryText: val }))}
            isEditable={true}
            className="text-white"
            placeholder="Download PDF Spec..."
          />

          {/* Link Editor Trigger */}
          <button
            type="button"
            onClick={() => setEditingLink((v) => !v)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              ctaUrl
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/90 text-slate-300 hover:text-white border border-white/10'
            }`}
            title="Edit Download PDF URL / Direct Link"
          >
            <Link2 className="w-3 h-3 text-cyan-400" />
            <span>{ctaUrl ? 'Link Set' : '+ Link'}</span>
          </button>

          {/* Hide Button */}
          <button
            type="button"
            onClick={() => {
              onUpdateProductDetails?.((prev) => ({
                ...prev,
                showSecondaryCta: false,
                sectionVisibility: { ...(prev.sectionVisibility || {}), secondaryCta: false },
              }));
            }}
            className="p-1 text-slate-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Hide Download PDF Button from Page"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Direct Link Input Dialog when editingLink is true */}
        {editingLink && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingLink(false);
            }}
          >
            <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white font-mono">Edit PDF / Brochure Link</h4>
                    <p className="text-[11px] text-slate-400">Set download URL for &quot;{ctaSecondary}&quot;</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingLink(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-cyan-300 font-bold uppercase">
                  DIRECT FILE URL OR RELATIVE PATH
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/spec.pdf or /brochures/oms.pdf"
                  value={tempUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTempUrl(val);
                    onUpdateProductDetails?.((prev) => ({ ...prev, ctaSecondaryUrl: val, brochureUrl: val }));
                    onUpdateModule?.((prev) => ({ ...prev, brochureUrl: val }));
                  }}
                  className="w-full bg-slate-950 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-cyan-200 font-mono focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 font-mono">
                  Tip: You can paste an external HTTPS link or a public local file path (e.g. <span className="text-cyan-300">/specs/oms.pdf</span>).
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                {tempUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTempUrl('');
                      onUpdateProductDetails?.((prev) => ({ ...prev, ctaSecondaryUrl: '', brochureUrl: '' }));
                      onUpdateModule?.((prev) => ({ ...prev, brochureUrl: '' }));
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                  >
                    Clear Link
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLink(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLink(false)}
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-900/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Public View Mode
  if (ctaUrl) {
    return (
      <a
        href={ctaUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs sm:text-sm transition-all hover:scale-[1.02] cursor-pointer"
      >
        <Download className={`w-4 h-4 ${accent.text}`} />
        <span>{ctaSecondary}</span>
      </a>
    );
  }

  // If no direct link is configured in public view mode, do not render
  return null;
}

// ============================================================================
// HERO IMAGE MANAGER MODAL (URL, BASE64 UPLOAD & PRESETS)
// ============================================================================

interface HeroImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  defaultImage: string;
  onSaveImage: (newImageSrc: string) => void;
}

function HeroImageModal({
  isOpen,
  onClose,
  currentImage,
  defaultImage,
  onSaveImage,
}: HeroImageModalProps) {
  const [tab, setTab] = useState<'url' | 'upload' | 'presets'>('url');
  const [inputUrl, setInputUrl] = useState(currentImage || '');
  const [base64Preview, setBase64Preview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputUrl(currentImage || '');
    setBase64Preview('');
    setFileName('');
    setFileSize('');
    setUploadError('');
  }, [currentImage, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setFileName(file.name);

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
          setBase64Preview(compressed);
          const kb = Math.round((compressed.length * 3) / 4 / 1024);
          setFileSize(`${kb} KB (Optimized)`);
        } else {
          const raw = event.target?.result as string;
          setBase64Preview(raw);
          setFileSize(`${Math.round(file.size / 1024)} KB`);
        }
      };
      img.onerror = () => {
        setUploadError('Failed to decode image file.');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (tab === 'upload' && base64Preview) {
      onSaveImage(base64Preview);
    } else if (tab === 'url') {
      onSaveImage(inputUrl.trim() || defaultImage);
    } else if (tab === 'presets' && inputUrl) {
      onSaveImage(inputUrl.trim());
    }
    onClose();
  };

  const handleResetToDefault = () => {
    onSaveImage(defaultImage);
    onClose();
  };

  const activePreview =
    tab === 'upload' && base64Preview
      ? base64Preview
      : inputUrl.trim() || defaultImage;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="shrink-0 px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">Hero Image Manager</h3>
              <p className="text-[11px] text-slate-400">Add an image URL, upload a file as Base64, or use presets</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="shrink-0 px-6 pt-4 border-b border-white/10 flex space-x-2 bg-slate-950/60 font-mono text-xs">
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`pb-3 px-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'url'
                ? 'border-[#2384ba] text-[#2384ba]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>1. Image URL</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`pb-3 px-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'upload'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>2. Upload File (Base64)</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`pb-3 px-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'presets'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Preset Gallery</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Preview Card */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono text-slate-300 font-bold uppercase">
              LIVE IMAGE PREVIEW
            </label>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner group">
              <img
                src={activePreview}
                alt="Hero Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-white/10 truncate max-w-full">
                  {tab === 'upload' && base64Preview ? `Base64 (${fileSize || 'Uploaded'})` : activePreview}
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: URL Input */}
          {tab === 'url' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-cyan-300 font-bold uppercase">
                ENTER IMAGE URL / PATH
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or /hero_infrastructure.png"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 focus:border-[#2384ba] rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
                autoFocus
              />
              <p className="text-[11px] text-slate-400 font-sans">
                Paste any valid image link (HTTPS) or local file path from the <code className="text-cyan-300">/public</code> folder.
              </p>
            </div>
          )}

          {/* TAB 2: Upload File (Base64) */}
          {tab === 'upload' && (
            <div className="space-y-3">
              <label className="block text-[11px] font-mono text-emerald-400 font-bold uppercase">
                UPLOAD LOCAL IMAGE (CONVERTS TO BASE64)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-emerald-400/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  Click to Browse or Drag Image Here
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  PNG, JPG, WebP, SVG (Max 5MB • Encoded directly as Base64)
                </p>
              </div>

              {fileName && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 font-mono text-xs flex items-center justify-between">
                  <span>📁 {fileName} ({fileSize})</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono">
                  {uploadError}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Presets Gallery */}
          {tab === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono text-purple-300 font-bold uppercase">
                  SELECT ARCANUM FLAGSHIP PRESETS
                </label>
                <span className="text-[10px] font-mono text-slate-400">8 curated enterprise themes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Enterprise ERP', src: '/hero_erp.jpg', category: 'Operations' },
                  { name: 'Restaurant & POS', src: '/hero_restaurant.jpg', category: 'Hospitality' },
                  { name: 'Aether CRM', src: '/hero_crm.jpg', category: 'Sales & Pipeline' },
                  { name: 'Synapse HRMS', src: '/hero_hrms.jpg', category: 'Workforce' },
                  { name: 'Fintech Banking', src: '/banking_fintech.png', category: 'Core Banking' },
                  { name: 'Cloud Infrastructure', src: '/hero_infrastructure.png', category: 'Cloud Nodes' },
                  { name: 'AST Modernization', src: '/oracle_modernization.png', category: 'Developer' },
                  { name: 'OMS Switch Engine', src: '/hero-topsection/ezgif-frame-105.jpg', category: 'Trading' },
                ].map((preset) => (
                  <button
                    key={preset.src}
                    type="button"
                    onClick={() => setInputUrl(preset.src)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                      inputUrl === preset.src
                        ? 'bg-purple-600/25 border-purple-400 ring-2 ring-purple-500 shadow-lg shadow-purple-950/50'
                        : 'bg-slate-950 border-white/10 hover:border-white/25 hover:bg-slate-900'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2 bg-slate-900 border border-white/10 relative">
                      <img src={preset.src} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/80 text-cyan-300 backdrop-blur-sm border border-white/10">
                        {preset.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-white truncate">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-mono text-slate-400 hover:text-white underline transition-colors cursor-pointer"
            title="Reset to default flagship image"
          >
            Reset to Default
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-[#2384ba] hover:bg-[#1b6ca1] text-white rounded-xl font-mono text-xs font-bold transition-all shadow-lg shadow-[#2384ba]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PRODUCT PAGE VIEW
// ============================================================================

export interface ProductPageViewProps {
  module: ModuleItem;
  productDetails: ProductDetailItem;
  modulesList?: ModuleItem[];
  isPreview?: boolean;
  isEditable?: boolean;
  onOpenContact?: (modTitle?: string) => void;
  onOpenBrochures?: () => void;
  // Direct In-Place State Updaters (Wix-style inline editing)
  onUpdateProductDetails?: (updater: (prev: ProductDetailItem) => ProductDetailItem) => void;
  onUpdateModule?: (updater: (prev: ModuleItem) => ModuleItem) => void;
  onOpenThemeSettings?: () => void;
  onOpenSectionManager?: () => void;
  onToggleSectionVisibility?: (sectionKey: keyof ProductSectionVisibility, visible: boolean) => void;
}

export function ProductPageView({
  module,
  productDetails,
  modulesList = [],
  isPreview = false,
  isEditable = false,
  onOpenContact,
  onOpenBrochures,
  onUpdateProductDetails,
  onUpdateModule,
  onOpenThemeSettings,
  onOpenSectionManager,
  onToggleSectionVisibility,
}: ProductPageViewProps) {
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<'telemetry' | 'logs' | 'specs'>('telemetry');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Quick inline add inputs
  const [newIndustryInput, setNewIndustryInput] = useState('');
  const [newComplianceInput, setNewComplianceInput] = useState('');
  const [newDeploymentInput, setNewDeploymentInput] = useState('');

  const IconComponent = getModuleIcon(module.iconName, module.category);
  const defaultHeroImage = FLAGSHIP_IMAGES[module.id] || '/hero_infrastructure.png';
  const heroImage =
    productDetails.heroImage || module.imageSrc || defaultHeroImage;

  const theme: PageThemeType = productDetails.theme || 'enterprise-erp';
  const accentKey: AccentColorType = productDetails.accentColor || 'blue';
  const accent = ACCENT_CONFIG[accentKey] || ACCENT_CONFIG.blue;
  const heroStyle: HeroStyleType = productDetails.heroStyle || 'split-console';
  const widgetType: InteractiveWidgetType = productDetails.interactiveWidget || 'live-telemetry';

  // Section visibility flags
  const visibility = productDetails.sectionVisibility || {};
  const showHero = visibility.hero !== false;
  const showMetrics = visibility.metrics !== false;
  const showWidget = visibility.widget !== false;
  const showSubmodules = visibility.submodules !== false;
  const showIndustries = visibility.industries !== false;
  const showCompliance = visibility.compliance !== false;
  const showFaqs = visibility.faqs !== false;
  const showRelated = visibility.related !== false;

  // Custom Titles
  const titles: ProductCustomTitles = productDetails.customTitles || {};
  const ctaPrimary = productDetails.ctaPrimaryText || 'Book a Demo / Discovery';
  const ctaSecondary = productDetails.ctaSecondaryText || 'Download PDF Spec';

  useEffect(() => {
    setSimulatedLogs(productDetails.mockData?.systemLogs || []);
    setActiveWorkflowIndex(0);
  }, [module.id, productDetails]);

  const handleSimulateCycle = () => {
    setIsSimulating(true);
    const newLog = `[${module.id.toUpperCase()}:EVENT] Manual health probe verified: Latency ${Math.floor(
      Math.random() * 6 + 2
    )}ms • Throughput ${Math.floor(Math.random() * 800 + 1500)} TPS • Zero packet loss`;

    setTimeout(() => {
      setSimulatedLogs((prev) => [newLog, ...prev.slice(0, 6)]);
      setIsSimulating(false);
    }, 400);
  };

  const workflowSteps = productDetails.mockData?.workflowSteps || [
    { step: '01', title: 'Data Ingestion & Auth', desc: 'Secure payload ingestion via TLS 1.3 gateway', latency: '2.4ms', status: 'VALIDATED' },
    { step: '02', title: 'Validation & Rule Engine', desc: 'Granular policy evaluation and schema verification', latency: '4.1ms', status: 'PASS' },
    { step: '03', title: 'Execution & Settlement', desc: 'Distributed microservice transaction commit', latency: '5.8ms', status: 'COMMITTED' },
    { step: '04', title: 'Audit Ledger Recording', desc: 'Cryptographic hash sealing across operational nodes', latency: '1.2ms', status: 'SEALED' },
  ];

  const codeDiff = productDetails.mockData?.codeDiff || {
    sourceLang: 'Legacy / Monolith Architecture',
    sourceCode: `// Legacy Monolithic System\nPROCEDURE Execute_Process(\n  p_id IN NUMBER\n) IS\nBEGIN\n  UPDATE legacy_records SET status = 'DONE' WHERE id = p_id;\n  COMMIT;\nEND;`,
    targetLang: 'Arcanum Modern Microservices',
    targetCode: `// Modern Resilient Microservice\nexport async function executeProcess(ctx: Context, id: string) {\n  const res = await serviceBus.dispatch('process.execute', { id, ts: Date.now() });\n  return { ok: true, hash: res.signature };\n}`,
  };

  const relatedModules = modulesList
    .filter((m) => m.id !== module.id && m.slug !== module.slug)
    .slice(0, 4);

  return (
    <div className={`w-full ${isPreview ? 'h-auto' : 'min-h-screen'} bg-[#0b1120] text-slate-100 font-sans selection:bg-[#2384ba]/30 selection:text-white`}>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      {showHero ? (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-white/10 group/section">
          <div
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] ${accent.glow} blur-[150px] rounded-full pointer-events-none`}
          />
          <div className="absolute top-10 right-10 w-96 h-96 bg-slate-900/60 blur-[130px] rounded-full pointer-events-none" />

          {/* Section Toolbar */}
          {isEditable && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-900/90 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Hero Section — Click any text below to edit directly</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSectionVisibility?.('hero', false)}
                  className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1 transition-all shadow-md active:scale-95"
                  title="Hide/Remove Hero Section"
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Hide Section</span>
                </button>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb & Archetype Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                {!isPreview ? (
                  <>
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Home</span>
                    </Link>
                    <span>/</span>
                    <Link href="/#solutions" className="hover:text-white transition-colors">
                      Solutions
                    </Link>
                    <span>/</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-bold uppercase">Live Preview Canvas /</span>
                )}
                <InlineInput
                  value={module.title}
                  onChange={(val) => onUpdateModule?.((prev) => ({ ...prev, title: val }))}
                  isEditable={isEditable}
                  className={`${accent.text} truncate max-w-xs font-semibold`}
                  placeholder="Module Title..."
                />
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${accent.badgeBg}`}>
                  {THEME_TITLES[theme] || theme.toUpperCase()}
                </span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={onOpenThemeSettings}
                    className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Change Layout Archetype & Themes"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Archetype & Layout</span>
                    <Pencil className="w-3 h-3 ml-0.5" />
                  </button>
                )}
              </div>
            </div>

            {/* HERO STYLE 1: SPLIT CONSOLE */}
            {heroStyle === 'split-console' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${accent.bgLight} ${accent.text} border ${accent.border}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                      {module.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <InlineInput
                        value={productDetails.heroBadge || module.badge || 'Production Ready'}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroBadge: val }))}
                        isEditable={isEditable}
                        placeholder="Hero Badge..."
                      />
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                    <InlineInput
                      value={productDetails.heroHeadline}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHeadline: val }))}
                      isEditable={isEditable}
                      className="text-white font-bold"
                      placeholder="Hero Headline..."
                    />{' '}
                    <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
                      <InlineInput
                        value={productDetails.heroHighlight}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHighlight: val }))}
                        isEditable={isEditable}
                        className="text-cyan-300 font-bold"
                        placeholder="Highlight..."
                      />
                    </span>
                  </h1>

                  <div className="text-sm sm:text-base font-mono text-slate-400 leading-relaxed">
                    <InlineInput
                      value={productDetails.heroSubtitle || module.subtitle || module.title}
                      onChange={(val) => {
                        onUpdateProductDetails?.((prev) => ({ ...prev, heroSubtitle: val }));
                        onUpdateModule?.((prev) => ({ ...prev, subtitle: val }));
                      }}
                      isEditable={isEditable}
                      className="w-full text-slate-300"
                      placeholder="Subtitle / Tagline..."
                    />
                  </div>

                  <div className="text-base text-slate-300 leading-relaxed max-w-2xl">
                    <InlineTextarea
                      rows={3}
                      value={productDetails.executiveSummary}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, executiveSummary: val }))}
                      isEditable={isEditable}
                      className="text-slate-300 leading-relaxed"
                      placeholder="Executive summary narrative..."
                    />
                  </div>

                  <div className={`p-3.5 rounded-xl bg-slate-950/80 border ${accent.border} font-mono text-xs text-slate-300 flex items-center space-x-2.5 max-w-xl`}>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <InlineInput
                      value={productDetails.slaGuarantee}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, slaGuarantee: val }))}
                      isEditable={isEditable}
                      className="w-full text-emerald-300 font-mono"
                      placeholder="SLA Guarantee..."
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {isEditable ? (
                      <div className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-lg`}>
                        <InlineInput
                          value={ctaPrimary}
                          onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, ctaPrimaryText: val }))}
                          isEditable={isEditable}
                          className="text-white font-semibold"
                          placeholder="Primary CTA..."
                        />
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <Link
                        href={`/demo?product=${module.slug || module.id}`}
                        className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-[1.02]`}
                      >
                        <span>{ctaPrimary}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}

                    <SecondaryDownloadCta
                      module={module}
                      productDetails={productDetails}
                      isEditable={isEditable}
                      accent={accent}
                      onOpenBrochures={onOpenBrochures}
                      onUpdateProductDetails={onUpdateProductDetails}
                      onUpdateModule={onUpdateModule}
                    />
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className={`relative rounded-2xl border ${accent.border} bg-slate-900/80 p-3 shadow-2xl backdrop-blur-2xl overflow-hidden group`}>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 group/img">
                      <img
                        src={heroImage}
                        alt={module.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultHeroImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* In edit mode: Change Image overlay button */}
                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => setImageModalOpen(true)}
                          className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-slate-950/85 hover:bg-[#2384ba] text-white border border-white/20 font-mono text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all cursor-pointer backdrop-blur-md"
                          title="Change hero image (URL or Upload Base64)"
                        >
                          <Camera className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                          <span>Change Image</span>
                        </button>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-950/85 border border-white/15 backdrop-blur-md flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${accent.bgLight} flex items-center justify-center ${accent.text}`}>
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Response Target</div>
                            <InlineInput
                              value={productDetails.architecture?.latency || '2.4ms'}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => ({
                                  ...prev,
                                  architecture: { ...prev.architecture, latency: val },
                                }))
                              }
                              isEditable={isEditable}
                              className="text-xs font-bold text-white font-mono"
                              placeholder="Latency..."
                            />
                          </div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 font-mono text-[11px]">
                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">DATABASE</span>
                        <InlineInput
                          value={productDetails.architecture?.database || 'PostgreSQL'}
                          onChange={(val) =>
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              architecture: { ...prev.architecture, database: val },
                            }))
                          }
                          isEditable={isEditable}
                          className="text-white font-semibold text-[11px]"
                          placeholder="Database..."
                        />
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">SECURITY LAYER</span>
                        <InlineInput
                          value={productDetails.architecture?.security || 'TLS 1.3 / AES-256'}
                          onChange={(val) =>
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              architecture: { ...prev.architecture, security: val },
                            }))
                          }
                          isEditable={isEditable}
                          className="text-emerald-400 font-semibold text-[11px]"
                          placeholder="Security..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HERO STYLE 2: FULL-WIDTH COMMAND HUD */}
            {heroStyle === 'command-hud' && (
              <div className="space-y-8">
                <div className="max-w-4xl space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${accent.bgLight} ${accent.text} border ${accent.border}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                      {module.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                      <InlineInput
                        value={productDetails.heroBadge || 'High-Frequency Switch Engine'}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroBadge: val }))}
                        isEditable={isEditable}
                        placeholder="Hero Badge..."
                      />
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Settlement Active
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    <InlineInput
                      value={productDetails.heroHeadline}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHeadline: val }))}
                      isEditable={isEditable}
                      className="text-white font-bold"
                      placeholder="Hero Headline..."
                    />{' '}
                    <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
                      <InlineInput
                        value={productDetails.heroHighlight}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHighlight: val }))}
                        isEditable={isEditable}
                        className="text-cyan-300 font-bold"
                        placeholder="Highlight..."
                      />
                    </span>
                  </h1>

                  <div className="text-sm sm:text-base font-mono text-slate-400 leading-relaxed">
                    <InlineInput
                      value={productDetails.heroSubtitle || module.subtitle || module.title}
                      onChange={(val) => {
                        onUpdateProductDetails?.((prev) => ({ ...prev, heroSubtitle: val }));
                        onUpdateModule?.((prev) => ({ ...prev, subtitle: val }));
                      }}
                      isEditable={isEditable}
                      className="w-full text-slate-300"
                      placeholder="Subtitle / Tagline..."
                    />
                  </div>

                  <div className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                    <InlineTextarea
                      rows={3}
                      value={productDetails.executiveSummary}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, executiveSummary: val }))}
                      isEditable={isEditable}
                      className="text-slate-300"
                      placeholder="Executive summary..."
                    />
                  </div>
                </div>

                {/* Command HUD Stats */}
                <div className={`p-5 rounded-2xl bg-slate-950/90 border ${accent.border} shadow-2xl backdrop-blur-2xl grid grid-cols-2 md:grid-cols-4 gap-4 font-mono`}>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">NODE STATUS</span>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SYNCHRONIZED</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">TARGET LATENCY</span>
                    <InlineInput
                      value={productDetails.architecture?.latency || '2.4ms'}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          architecture: { ...prev.architecture, latency: val },
                        }))
                      }
                      isEditable={isEditable}
                      className={`text-sm font-bold ${accent.text}`}
                      placeholder="Latency..."
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">SLA ASSURANCE</span>
                    <InlineInput
                      value={productDetails.slaGuarantee || '99.99% Production Uptime'}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, slaGuarantee: val }))}
                      isEditable={isEditable}
                      className="text-sm font-bold text-white"
                      placeholder="SLA..."
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">CIPHER ENCRYPTION</span>
                    <InlineInput
                      value={productDetails.architecture?.security || 'TLS 1.3 / AES-256-GCM'}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          architecture: { ...prev.architecture, security: val },
                        }))
                      }
                      isEditable={isEditable}
                      className="text-sm font-bold text-slate-300"
                      placeholder="Security..."
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {isEditable ? (
                    <div className={`inline-flex items-center gap-2 px-7 py-4 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-bold transition-all shadow-xl`}>
                      <InlineInput
                        value={ctaPrimary}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, ctaPrimaryText: val }))}
                        isEditable={isEditable}
                        className="text-white font-bold"
                        placeholder="Primary CTA..."
                      />
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <Link
                      href={`/demo?product=${module.slug || module.id}`}
                      className={`inline-flex items-center gap-2 px-7 py-4 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-bold transition-all shadow-xl hover:scale-[1.02]`}
                    >
                      <span>{ctaPrimary}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                  <SecondaryDownloadCta
                    module={module}
                    productDetails={productDetails}
                    isEditable={isEditable}
                    accent={accent}
                    onOpenBrochures={onOpenBrochures}
                    onUpdateProductDetails={onUpdateProductDetails}
                    onUpdateModule={onUpdateModule}
                  />
                </div>
              </div>
            )}

            {/* HERO STYLE 3: CODE DIFF VIEW */}
            {heroStyle === 'code-diff' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${accent.bgLight} ${accent.text} border ${accent.border}`}>
                      <Code2 className="w-3.5 h-3.5" />
                      {module.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20">
                      <InlineInput
                        value={productDetails.heroBadge || 'AST Code Transform Engine'}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroBadge: val }))}
                        isEditable={isEditable}
                        placeholder="Hero Badge..."
                      />
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                    <InlineInput
                      value={productDetails.heroHeadline}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHeadline: val }))}
                      isEditable={isEditable}
                      className="text-white font-bold"
                      placeholder="Hero Headline..."
                    />{' '}
                    <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
                      <InlineInput
                        value={productDetails.heroHighlight}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHighlight: val }))}
                        isEditable={isEditable}
                        className="text-purple-300 font-bold"
                        placeholder="Highlight..."
                      />
                    </span>
                  </h1>

                  <div className="text-sm sm:text-base font-mono text-slate-400 leading-relaxed">
                    <InlineInput
                      value={productDetails.heroSubtitle || module.subtitle || module.title}
                      onChange={(val) => {
                        onUpdateProductDetails?.((prev) => ({ ...prev, heroSubtitle: val }));
                        onUpdateModule?.((prev) => ({ ...prev, subtitle: val }));
                      }}
                      isEditable={isEditable}
                      className="w-full text-slate-300"
                      placeholder="Subtitle / Tagline..."
                    />
                  </div>

                  <div className="text-base text-slate-300 leading-relaxed">
                    <InlineTextarea
                      rows={3}
                      value={productDetails.executiveSummary}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, executiveSummary: val }))}
                      isEditable={isEditable}
                      className="text-slate-300"
                      placeholder="Executive summary..."
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 flex items-center space-x-2">
                    <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Zero-Downtime Microservice Orchestration • Automated Syntax Refactoring</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {isEditable ? (
                      <div className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-lg`}>
                        <InlineInput
                          value={ctaPrimary}
                          onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, ctaPrimaryText: val }))}
                          isEditable={isEditable}
                          className="text-white font-semibold"
                          placeholder="Primary CTA..."
                        />
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <Link
                        href={`/demo?product=${module.slug || module.id}`}
                        className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-[1.02]`}
                      >
                        <span>{ctaPrimary}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                    <SecondaryDownloadCta
                      module={module}
                      productDetails={productDetails}
                      isEditable={isEditable}
                      accent={accent}
                      onOpenBrochures={onOpenBrochures}
                      onUpdateProductDetails={onUpdateProductDetails}
                      onUpdateModule={onUpdateModule}
                    />
                  </div>
                </div>

                {/* Code Diff Box */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl overflow-hidden font-mono text-xs relative">
                    <div className="px-4 py-3 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="text-[11px] text-slate-400 ml-2">code-migration-pipeline.ts</span>
                      </div>
                      <span className="text-[10px] text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30">
                        TRANSFORM COMPLETED
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-[10px] text-rose-400 font-bold uppercase mb-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span>BEFORE: </span>
                          <InlineInput
                            value={codeDiff.sourceLang}
                            onChange={(val) =>
                              onUpdateProductDetails?.((prev) => ({
                                ...prev,
                                mockData: {
                                  ...prev.mockData,
                                  codeDiff: { ...(prev.mockData?.codeDiff || codeDiff), sourceLang: val },
                                },
                              }))
                            }
                            isEditable={isEditable}
                            className="text-rose-300 font-mono"
                          />
                        </div>
                        {isEditable ? (
                          <textarea
                            rows={4}
                            value={codeDiff.sourceCode}
                            onChange={(e) =>
                              onUpdateProductDetails?.((prev) => ({
                                ...prev,
                                mockData: {
                                  ...prev.mockData,
                                  codeDiff: { ...(prev.mockData?.codeDiff || codeDiff), sourceCode: e.target.value },
                                },
                              }))
                            }
                            className="w-full p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200/80 font-mono text-[11px] leading-relaxed outline-none focus:ring-1 focus:ring-rose-400"
                          />
                        ) : (
                          <pre className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200/80 overflow-x-auto text-[11px] leading-relaxed">
                            {codeDiff.sourceCode}
                          </pre>
                        )}
                      </div>

                      <div>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>AFTER: </span>
                          <InlineInput
                            value={codeDiff.targetLang}
                            onChange={(val) =>
                              onUpdateProductDetails?.((prev) => ({
                                ...prev,
                                mockData: {
                                  ...prev.mockData,
                                  codeDiff: { ...(prev.mockData?.codeDiff || codeDiff), targetLang: val },
                                },
                              }))
                            }
                            isEditable={isEditable}
                            className="text-emerald-300 font-mono"
                          />
                        </div>
                        {isEditable ? (
                          <textarea
                            rows={4}
                            value={codeDiff.targetCode}
                            onChange={(e) =>
                              onUpdateProductDetails?.((prev) => ({
                                ...prev,
                                mockData: {
                                  ...prev.mockData,
                                  codeDiff: { ...(prev.mockData?.codeDiff || codeDiff), targetCode: e.target.value },
                                },
                              }))
                            }
                            className="w-full p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 font-mono text-[11px] leading-relaxed outline-none focus:ring-1 focus:ring-emerald-400"
                          />
                        ) : (
                          <pre className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 overflow-x-auto text-[11px] leading-relaxed">
                            {codeDiff.targetCode}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HERO STYLE 4: WORKFLOW PIPELINE */}
            {heroStyle === 'workflow-pipeline' && (
              <div className="space-y-10">
                <div className="max-w-4xl space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${accent.bgLight} ${accent.text} border ${accent.border}`}>
                      <Workflow className="w-3.5 h-3.5" />
                      {module.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20">
                      <InlineInput
                        value={productDetails.heroBadge || 'Automated End-to-End Pipeline'}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroBadge: val }))}
                        isEditable={isEditable}
                        placeholder="Hero Badge..."
                      />
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                    <InlineInput
                      value={productDetails.heroHeadline}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHeadline: val }))}
                      isEditable={isEditable}
                      className="text-white font-bold"
                      placeholder="Hero Headline..."
                    />{' '}
                    <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
                      <InlineInput
                        value={productDetails.heroHighlight}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, heroHighlight: val }))}
                        isEditable={isEditable}
                        className="text-amber-300 font-bold"
                        placeholder="Highlight..."
                      />
                    </span>
                  </h1>

                  <div className="text-sm sm:text-base font-mono text-slate-400 leading-relaxed">
                    <InlineInput
                      value={productDetails.heroSubtitle || module.subtitle || module.title}
                      onChange={(val) => {
                        onUpdateProductDetails?.((prev) => ({ ...prev, heroSubtitle: val }));
                        onUpdateModule?.((prev) => ({ ...prev, subtitle: val }));
                      }}
                      isEditable={isEditable}
                      className="w-full text-slate-300"
                      placeholder="Subtitle / Tagline..."
                    />
                  </div>

                  <div className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                    <InlineTextarea
                      rows={3}
                      value={productDetails.executiveSummary}
                      onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, executiveSummary: val }))}
                      isEditable={isEditable}
                      className="text-slate-300"
                      placeholder="Executive summary..."
                    />
                  </div>
                </div>

                {/* Horizontal Pipeline Steps */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      PIPELINE EXECUTION STAGES (CLICK ANY FIELD TO EDIT DIRECTLY)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {workflowSteps.map((step, idx) => {
                      const isSelected = activeWorkflowIndex === idx;
                      return (
                        <div
                          key={step.step || idx}
                          onClick={() => setActiveWorkflowIndex(idx)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                            isSelected
                              ? `${accent.bgLight} ${accent.border} shadow-lg shadow-[#2384ba]/20 scale-[1.02]`
                              : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`font-mono text-xs font-bold ${isSelected ? accent.text : 'text-slate-400'}`}>
                              STAGE {step.step}
                            </span>
                            <InlineInput
                              value={step.status}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                  steps[idx] = { ...steps[idx], status: val };
                                  return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                })
                              }
                              isEditable={isEditable}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              placeholder="STATUS"
                            />
                          </div>

                          <div className="text-sm font-bold text-white mb-1.5">
                            <InlineInput
                              value={step.title}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                  steps[idx] = { ...steps[idx], title: val };
                                  return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                })
                              }
                              isEditable={isEditable}
                              className="w-full text-white font-bold"
                              placeholder="Stage Title..."
                            />
                          </div>

                          <div className="text-xs text-slate-400 leading-relaxed mb-3">
                            <InlineTextarea
                              rows={2}
                              value={step.desc}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                  steps[idx] = { ...steps[idx], desc: val };
                                  return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                })
                              }
                              isEditable={isEditable}
                              className="text-xs text-slate-400"
                              placeholder="Stage Description..."
                            />
                          </div>

                          <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Execution: </span>
                            <InlineInput
                              value={step.latency}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                  steps[idx] = { ...steps[idx], latency: val };
                                  return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                })
                              }
                              isEditable={isEditable}
                              className="w-20 text-cyan-300 font-mono text-[11px]"
                              placeholder="2.4ms"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {isEditable ? (
                    <div className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-lg`}>
                      <InlineInput
                        value={ctaPrimary}
                        onChange={(val) => onUpdateProductDetails?.((prev) => ({ ...prev, ctaPrimaryText: val }))}
                        isEditable={isEditable}
                        className="text-white font-semibold"
                        placeholder="Primary CTA..."
                      />
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <Link
                      href={`/demo?product=${module.slug || module.id}`}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${accent.bgSolid} text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-[1.02]`}
                    >
                      <span>{ctaPrimary}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                  <SecondaryDownloadCta
                    module={module}
                    productDetails={productDetails}
                    isEditable={isEditable}
                    accent={accent}
                    onOpenBrochures={onOpenBrochures}
                    onUpdateProductDetails={onUpdateProductDetails}
                    onUpdateModule={onUpdateModule}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hero Image Modal Dialog */}
          <HeroImageModal
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            currentImage={productDetails.heroImage || module.imageSrc || defaultHeroImage}
            defaultImage={defaultHeroImage}
            onSaveImage={(newSrc) => {
              onUpdateProductDetails?.((prev) => ({ ...prev, heroImage: newSrc }));
              onUpdateModule?.((prev) => ({ ...prev, imageSrc: newSrc }));
            }}
          />
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Hero Section is Hidden</span>
          <button
            type="button"
            onClick={() => onToggleSectionVisibility?.('hero', true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore Hero Section
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 2. BENCHMARK PERFORMANCE METRICS */}
      {/* ========================================================================= */}
      {showMetrics ? (
        <section className="py-16 bg-slate-950/60 border-b border-white/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-1 font-bold`}>
                  <InlineInput
                    value={titles.metricsEyebrow || '01 / BENCHMARK METRICS'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), metricsEyebrow: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="font-bold"
                  />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  <InlineInput
                    value={titles.metricsTitle || 'Key Operational KPIs'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), metricsTitle: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="text-white font-bold"
                  />
                </h3>
              </div>

              {isEditable && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      const newMetric = { value: '99.9%', label: 'High Performance Metric', trend: 'Optimized Throughput' };
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        metrics: [...(prev.metrics || []), newMetric],
                      }));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] text-white flex items-center gap-1 font-bold shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add KPI Metric</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSectionVisibility?.('metrics', false)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1 transition-colors"
                    title="Hide/Remove Benchmark Metrics Section"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Section</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(productDetails.metrics || []).map((metric, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group ${accent.borderHover} transition-colors`}
                >
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          metrics: (prev.metrics || []).filter((_, i) => i !== idx),
                        }));
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-slate-800/90 hover:bg-rose-500 text-slate-300 hover:text-white rounded-lg text-xs transition-colors shadow-md z-20"
                      title="Delete Metric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className={`absolute top-0 right-0 w-24 h-24 ${accent.glow} rounded-full blur-2xl group-hover:opacity-100 opacity-50 transition-all pointer-events-none`} />

                  <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight mb-1">
                    <InlineInput
                      value={metric.value}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => {
                          const metrics = [...(prev.metrics || [])];
                          metrics[idx] = { ...metrics[idx], value: val };
                          return { ...prev, metrics };
                        })
                      }
                      isEditable={isEditable}
                      className="w-full text-white font-mono font-bold"
                      placeholder="99.9%"
                    />
                  </div>

                  <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    <InlineInput
                      value={metric.label}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => {
                          const metrics = [...(prev.metrics || [])];
                          metrics[idx] = { ...metrics[idx], label: val };
                          return { ...prev, metrics };
                        })
                      }
                      isEditable={isEditable}
                      className="w-full text-slate-300 text-xs font-mono"
                      placeholder="Metric Label..."
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.text}`} style={{ backgroundColor: accent.primaryHex }} />
                    <InlineInput
                      value={metric.trend}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => {
                          const metrics = [...(prev.metrics || [])];
                          metrics[idx] = { ...metrics[idx], trend: val };
                          return { ...prev, metrics };
                        })
                      }
                      isEditable={isEditable}
                      className="w-full text-slate-400 text-[11px]"
                      placeholder="Trend text..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Key Benchmark Metrics Section is Hidden</span>
          <button
            type="button"
            onClick={() => onToggleSectionVisibility?.('metrics', true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore Metrics Section
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 3. DYNAMIC MID-PAGE FEATURE WIDGET */}
      {/* ========================================================================= */}
      {showWidget ? (
        <section className="py-20 lg:py-28 bg-[#0f172a] relative overflow-hidden border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-2 font-bold`}>
                  <InlineInput
                    value={titles.widgetEyebrow || '02 / INTERACTIVE SYSTEM PREVIEW'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), widgetEyebrow: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="font-bold"
                  />
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  <InlineInput
                    value={
                      titles.widgetTitle ||
                      (widgetType === 'code-transform' && 'Automated Code Modernization Hub') ||
                      (widgetType === 'workflow-pipeline' && 'Multi-Stage Transaction Pipeline') ||
                      (widgetType === 'vital-monitor' && 'Clinical Interoperability & Medical Node Monitor') ||
                      (widgetType === 'campus-lifecycle' && 'Campus Academic Sync & Lifecycle Telemetry') ||
                      'Live Telemetry & UI Simulation'
                    }
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), widgetTitle: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="text-white font-bold"
                  />
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => onToggleSectionVisibility?.('widget', false)}
                    className="px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono text-xs flex items-center gap-1.5 transition-colors"
                    title="Hide/Remove Interactive Widget Section"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Section</span>
                  </button>
                )}
                <button
                  onClick={handleSimulateCycle}
                  disabled={isSimulating}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${accent.bgLight} hover:${accent.glow} border ${accent.border} ${accent.text} hover:text-white font-mono text-xs transition-all disabled:opacity-50`}
                >
                  <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Processing...' : 'Trigger Telemetry Cycle'}</span>
                </button>
              </div>
            </div>

            {/* WIDGET 1: LIVE TELEMETRY CONSOLE */}
            {widgetType === 'live-telemetry' && (
              <div className="rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 font-mono text-xs text-slate-400 truncate">
                      arcanum://cluster/{module.id}.node.internal
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(['telemetry', 'logs', 'specs'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSimulatorTab(tab)}
                        className={`px-3 py-1 rounded-md font-mono text-xs transition-colors capitalize ${
                          activeSimulatorTab === tab
                            ? `${accent.bgSolid} text-white font-semibold`
                            : 'text-slate-400 hover:text-white bg-white/5'
                        }`}
                      >
                        {tab === 'telemetry' ? 'Records Table' : tab === 'logs' ? 'Live Logs' : 'Architecture'}
                      </button>
                    ))}
                  </div>
                </div>

                {activeSimulatorTab === 'telemetry' && (
                  <div className="p-6 overflow-x-auto space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <InlineInput
                        value={productDetails.mockData?.tabTitle || 'SIMULATED DATA RECORDS'}
                        onChange={(val) =>
                          onUpdateProductDetails?.((prev) => ({
                            ...prev,
                            mockData: { ...prev.mockData, tabTitle: val },
                          }))
                        }
                        isEditable={isEditable}
                        className="text-slate-300 font-mono text-xs"
                      />
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        All Microservice Nodes Healthy
                      </span>
                    </div>

                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400">
                          {(productDetails.mockData?.recordsHeader || ['ID', 'TITLE', 'METADATA', 'STATUS', 'TAG']).map(
                            (header, hIdx) => (
                              <th key={hIdx} className="py-3 px-4 uppercase text-[10px] tracking-wider">
                                <InlineInput
                                  value={header}
                                  onChange={(val) =>
                                    onUpdateProductDetails?.((prev) => {
                                      const headers = [...(prev.mockData?.recordsHeader || [])];
                                      headers[hIdx] = val;
                                      return { ...prev, mockData: { ...prev.mockData, recordsHeader: headers } };
                                    })
                                  }
                                  isEditable={isEditable}
                                  className="text-slate-400 text-[10px]"
                                />
                              </th>
                            )
                          )}
                          {isEditable && <th className="py-3 px-4 text-[10px]">ACTIONS</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(productDetails.mockData?.records || []).map((rec, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/60 transition-colors">
                            <td className={`py-3.5 px-4 font-bold ${accent.text}`}>
                              <InlineInput
                                value={rec.id}
                                onChange={(val) =>
                                  onUpdateProductDetails?.((prev) => {
                                    const records = [...(prev.mockData?.records || [])];
                                    records[rIdx] = { ...records[rIdx], id: val };
                                    return { ...prev, mockData: { ...prev.mockData, records } };
                                  })
                                }
                                isEditable={isEditable}
                                className={`font-bold ${accent.text}`}
                              />
                            </td>
                            <td className="py-3.5 px-4 text-white font-medium">
                              <InlineInput
                                value={rec.title}
                                onChange={(val) =>
                                  onUpdateProductDetails?.((prev) => {
                                    const records = [...(prev.mockData?.records || [])];
                                    records[rIdx] = { ...records[rIdx], title: val };
                                    return { ...prev, mockData: { ...prev.mockData, records } };
                                  })
                                }
                                isEditable={isEditable}
                                className="text-white font-medium"
                              />
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              <InlineInput
                                value={rec.meta}
                                onChange={(val) =>
                                  onUpdateProductDetails?.((prev) => {
                                    const records = [...(prev.mockData?.records || [])];
                                    records[rIdx] = { ...records[rIdx], meta: val };
                                    return { ...prev, mockData: { ...prev.mockData, records } };
                                  })
                                }
                                isEditable={isEditable}
                                className="text-slate-400"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <InlineInput
                                value={rec.status}
                                onChange={(val) =>
                                  onUpdateProductDetails?.((prev) => {
                                    const records = [...(prev.mockData?.records || [])];
                                    records[rIdx] = { ...records[rIdx], status: val };
                                    return { ...prev, mockData: { ...prev.mockData, records } };
                                  })
                                }
                                isEditable={isEditable}
                                className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              />
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              <InlineInput
                                value={rec.tag}
                                onChange={(val) =>
                                  onUpdateProductDetails?.((prev) => {
                                    const records = [...(prev.mockData?.records || [])];
                                    records[rIdx] = { ...records[rIdx], tag: val };
                                    return { ...prev, mockData: { ...prev.mockData, records } };
                                  })
                                }
                                isEditable={isEditable}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/10"
                              />
                            </td>
                            {isEditable && (
                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateProductDetails?.((prev) => ({
                                      ...prev,
                                      mockData: {
                                        ...prev.mockData,
                                        records: (prev.mockData?.records || []).filter((_, i) => i !== rIdx),
                                      },
                                    }))
                                  }
                                  className="text-slate-500 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => {
                          const newRecord = {
                            id: `REC-${Date.now().toString().slice(-4)}`,
                            title: 'New Simulated Transaction',
                            meta: 'Payload 256KB • Auth Validated',
                            status: 'SUCCESS',
                            tag: 'REST API',
                          };
                          onUpdateProductDetails?.((prev) => ({
                            ...prev,
                            mockData: {
                              ...prev.mockData,
                              records: [...(prev.mockData?.records || []), newRecord],
                            },
                          }));
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#2384ba]" />
                        <span>Add Row to Table</span>
                      </button>
                    )}
                  </div>
                )}

                {activeSimulatorTab === 'logs' && (
                  <div className="p-6 font-mono text-xs bg-slate-950 space-y-2.5">
                    <div className="text-slate-500 text-[11px] mb-3 pb-2 border-b border-white/5 flex items-center justify-between">
                      <span>STREAMING REAL-TIME CLUSTER EVENTS • TLS 1.3 ENCRYPTED</span>
                      <span>TIMEZONE: GST (UTC+4)</span>
                    </div>
                    {simulatedLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 text-slate-300 leading-relaxed">
                        <span className="text-slate-500 select-none">&gt;</span>
                        <InlineInput
                          value={log}
                          onChange={(val) => {
                            const updated = [...simulatedLogs];
                            updated[i] = val;
                            setSimulatedLogs(updated);
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              mockData: { ...prev.mockData, systemLogs: updated },
                            }));
                          }}
                          isEditable={isEditable}
                          className={`w-full ${log.includes('SECURITY') ? 'text-amber-300' : log.includes('PERF') ? 'text-cyan-300' : 'text-slate-300'}`}
                        />
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = simulatedLogs.filter((_, idx) => idx !== i);
                              setSimulatedLogs(updated);
                              onUpdateProductDetails?.((prev) => ({
                                ...prev,
                                mockData: { ...prev.mockData, systemLogs: updated },
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400 shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => {
                          const newLog = `[${new Date().toISOString().slice(11, 19)}] telemetry_node_ack status="NORMAL" latency=8ms`;
                          const updated = [...simulatedLogs, newLog];
                          setSimulatedLogs(updated);
                          onUpdateProductDetails?.((prev) => ({
                            ...prev,
                            mockData: { ...prev.mockData, systemLogs: updated },
                          }));
                        }}
                        className="mt-3 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-mono text-[11px] flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Log Line</span>
                      </button>
                    )}
                  </div>
                )}

                {activeSimulatorTab === 'specs' && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'runtime', label: 'RUNTIME ENGINE', value: productDetails.architecture?.runtime, icon: Cpu },
                        { key: 'database', label: 'DATABASE CLUSTER', value: productDetails.architecture?.database, icon: Database },
                        { key: 'security', label: 'SECURITY CIPHERS', value: productDetails.architecture?.security, icon: ShieldCheck },
                        { key: 'messaging', label: 'MESSAGE BROKER', value: productDetails.architecture?.messaging, icon: Layers },
                        { key: 'latency', label: 'EXECUTION LATENCY', value: productDetails.architecture?.latency, icon: Zap },
                        { key: 'scalability', label: 'SCALABILITY TOPOLOGY', value: productDetails.architecture?.scalability, icon: Server },
                      ].map((spec) => {
                        const SpecIcon = spec.icon;
                        return (
                          <div key={spec.label} className="p-4 rounded-xl border border-white/10 bg-slate-900/60 relative group">
                            <div className={`flex items-center gap-2 text-xs font-mono ${accent.text} mb-2`}>
                              <SpecIcon className="w-4 h-4" />
                              <span>{spec.label}</span>
                            </div>
                            <InlineInput
                              value={spec.value || ''}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => ({
                                  ...prev,
                                  architecture: { ...prev.architecture, [spec.key]: val },
                                }))
                              }
                              isEditable={isEditable}
                              className="text-sm font-semibold text-white w-full"
                              placeholder="Spec value..."
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WIDGET 2: CODE DIFF PLAYGROUND */}
            {widgetType === 'code-transform' && (
              <div className="rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl overflow-hidden backdrop-blur-2xl">
                <div className="px-6 py-4 bg-slate-900 border-b border-white/10 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-bold">Interactive AST Code Refactoring Playground</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeDiff.targetCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-white/15 text-slate-300 rounded flex items-center space-x-1.5 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied TypeScript' : 'Copy Modern Code'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 font-mono text-xs">
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-rose-400">
                      <span className="font-bold uppercase tracking-wider text-[11px]">Legacy Source Architecture</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-[10px] border border-rose-500/30">DEPRECATED</span>
                    </div>
                    {isEditable ? (
                      <textarea
                        rows={6}
                        value={codeDiff.sourceCode}
                        onChange={(e) =>
                          onUpdateProductDetails?.((prev) => ({
                            ...prev,
                            mockData: {
                              ...prev.mockData,
                              codeDiff: { ...(prev.mockData?.codeDiff || codeDiff), sourceCode: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-200/90 font-mono text-xs leading-relaxed outline-none focus:ring-1 focus:ring-rose-400"
                      />
                    ) : (
                      <pre className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-200/90 overflow-x-auto text-xs leading-relaxed">
                        {codeDiff.sourceCode}
                      </pre>
                    )}
                  </div>

                  <div className="p-6 space-y-3 bg-slate-900/40">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="font-bold uppercase tracking-wider text-[11px]">Arcanum Cloud-Native Microservice</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[10px] border border-emerald-500/30 font-bold">TYPE-SAFE & SCALABLE</span>
                    </div>
                    {isEditable ? (
                      <textarea
                        rows={6}
                        value={codeDiff.targetCode}
                        onChange={(e) =>
                          onUpdateProductDetails?.((prev) => ({
                            ...prev,
                            mockData: {
                              ...prev.mockData,
                              codeDiff: { ...(prev.mockData?.codeDiff || codeDiff), targetCode: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 font-mono text-xs leading-relaxed outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    ) : (
                      <pre className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 overflow-x-auto text-xs leading-relaxed">
                        {codeDiff.targetCode}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET 3: WORKFLOW PIPELINE STAGES */}
            {(widgetType === 'workflow-pipeline' || widgetType === 'vital-monitor' || widgetType === 'campus-lifecycle') && (
              <div className="rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl p-6 sm:p-8 space-y-8 backdrop-blur-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                  {workflowSteps.map((step, idx) => {
                    const isSelected = activeWorkflowIndex === idx;
                    return (
                      <div
                        key={step.step || idx}
                        onClick={() => setActiveWorkflowIndex(idx)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                          isSelected
                            ? `${accent.bgLight} ${accent.border} shadow-lg shadow-[#2384ba]/20 scale-[1.02]`
                            : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold font-mono ${isSelected ? accent.text : 'text-slate-400'}`}>
                              STAGE 0{idx + 1}
                            </span>
                            <InlineInput
                              value={step.status}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                  steps[idx] = { ...steps[idx], status: val };
                                  return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                })
                              }
                              isEditable={isEditable}
                              className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold uppercase tracking-wider"
                              placeholder="STATUS"
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white leading-snug">
                              <InlineInput
                                value={step.title}
                                onChange={(val) =>
                                  onUpdateProductDetails?.((prev) => {
                                    const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                    steps[idx] = { ...steps[idx], title: val };
                                    return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                  })
                                }
                                isEditable={isEditable}
                                className="text-sm font-bold text-white block w-full"
                                placeholder="Stage Title..."
                              />
                            </h4>
                          </div>

                          <div>
                            <InlineTextarea
                              rows={2}
                              value={step.desc}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                                  steps[idx] = { ...steps[idx], desc: val };
                                  return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                                })
                              }
                              isEditable={isEditable}
                              className="text-xs text-slate-400 leading-relaxed block w-full"
                              placeholder="Stage Description..."
                            />
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-slate-500">Latency:</span>
                          <span className="text-cyan-300 font-bold">{step.latency}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Stage Detail */}
                <div className="p-6 rounded-xl bg-slate-900/70 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className={`font-mono text-xs ${accent.text} font-bold uppercase block`}>
                        STAGE {workflowSteps[activeWorkflowIndex]?.step} DETAILED ARCHITECTURE
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        <InlineInput
                          value={workflowSteps[activeWorkflowIndex]?.title || ''}
                          onChange={(val) =>
                            onUpdateProductDetails?.((prev) => {
                              const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                              steps[activeWorkflowIndex] = { ...steps[activeWorkflowIndex], title: val };
                              return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                            })
                          }
                          isEditable={isEditable}
                          className="text-xl font-bold text-white"
                        />
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs rounded-full">
                        Latency: {workflowSteps[activeWorkflowIndex]?.latency}
                      </span>
                    </div>
                  </div>

                  <InlineTextarea
                    rows={2}
                    value={workflowSteps[activeWorkflowIndex]?.desc || ''}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => {
                        const steps = [...(prev.mockData?.workflowSteps || workflowSteps)];
                        steps[activeWorkflowIndex] = { ...steps[activeWorkflowIndex], desc: val };
                        return { ...prev, mockData: { ...prev.mockData, workflowSteps: steps } };
                      })
                    }
                    isEditable={isEditable}
                    className="text-slate-300 text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Interactive Mid-Page Widget Section is Hidden</span>
          <button
            type="button"
            onClick={() => onToggleSectionVisibility?.('widget', true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore Widget Section
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 4. CORE MODULAR SUBSYSTEMS */}
      {/* ========================================================================= */}
      {showSubmodules ? (
        <section className="py-20 lg:py-28 bg-[#0b1120] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
              <div className="max-w-3xl">
                <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-3 font-bold`}>
                  <InlineInput
                    value={titles.submodulesEyebrow || '03 / SUBSYSTEM CAPABILITIES'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), submodulesEyebrow: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="font-bold"
                  />
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  <InlineInput
                    value={titles.submodulesTitle || 'Core Modular Architecture'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), submodulesTitle: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="text-white font-bold"
                  />
                </h2>
                <div className="mt-3 text-slate-400 text-sm leading-relaxed">
                  <InlineTextarea
                    rows={2}
                    value={
                      titles.submodulesSubtitle ||
                      'Every component is built modularly with strict separation of concerns, guaranteed type safety, and zero technical debt.'
                    }
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), submodulesSubtitle: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="text-slate-400 text-sm"
                  />
                </div>
              </div>

              {isEditable && (
                <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      const newSub = {
                        name: 'New Subsystem Capability',
                        badge: 'Modular Engine',
                        description: 'Comprehensive operational capability with real-time state sync and full audit logs.',
                        points: ['High throughput execution', 'Audit verified', 'REST API compliant'],
                      };
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        subModules: [...(prev.subModules || []), newSub],
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-bold transition-all shadow-lg active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Submodule</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSectionVisibility?.('submodules', false)}
                    className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-colors"
                    title="Hide/Remove Submodules Section"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Section</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(productDetails.subModules || []).map((sub, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl ${accent.borderHover} transition-all flex flex-col justify-between relative group`}
                >
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          subModules: (prev.subModules || []).filter((_, i) => i !== idx),
                        }));
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white rounded-lg transition-colors shadow-md z-20"
                      title="Delete Submodule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4 pr-10">
                      <span className={`font-mono text-xs uppercase tracking-wider ${accent.text} ${accent.bgLight} px-3 py-1 rounded-md border ${accent.border}`}>
                        <InlineInput
                          value={sub.badge || `Submodule 0${idx + 1}`}
                          onChange={(val) =>
                            onUpdateProductDetails?.((prev) => {
                              const subModules = [...(prev.subModules || [])];
                              subModules[idx] = { ...subModules[idx], badge: val };
                              return { ...prev, subModules };
                            })
                          }
                          isEditable={isEditable}
                          className="font-mono text-xs uppercase"
                        />
                      </span>
                      <CheckCircle2 className={`w-5 h-5 ${accent.text}`} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                      <InlineInput
                        value={sub.name}
                        onChange={(val) =>
                          onUpdateProductDetails?.((prev) => {
                            const subModules = [...(prev.subModules || [])];
                            subModules[idx] = { ...subModules[idx], name: val };
                            return { ...prev, subModules };
                          })
                        }
                        isEditable={isEditable}
                        className="w-full text-white font-bold"
                        placeholder="Submodule Name..."
                      />
                    </h3>

                    <div className="text-sm text-slate-300 leading-relaxed mb-6">
                      <InlineTextarea
                        rows={3}
                        value={sub.description}
                        onChange={(val) =>
                          onUpdateProductDetails?.((prev) => {
                            const subModules = [...(prev.subModules || [])];
                            subModules[idx] = { ...subModules[idx], description: val };
                            return { ...prev, subModules };
                          })
                        }
                        isEditable={isEditable}
                        className="text-slate-300 text-sm"
                        placeholder="Submodule Description..."
                      />
                    </div>

                    <ul className="space-y-2 mb-6">
                      {(sub.points || []).map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${accent.text} mt-1.5 shrink-0`} style={{ backgroundColor: accent.primaryHex }} />
                          <div className="flex-1">
                            <InlineInput
                              value={pt}
                              onChange={(val) =>
                                onUpdateProductDetails?.((prev) => {
                                  const subModules = [...(prev.subModules || [])];
                                  const points = [...(subModules[idx].points || [])];
                                  points[pIdx] = val;
                                  subModules[idx] = { ...subModules[idx], points };
                                  return { ...prev, subModules };
                                })
                              }
                              isEditable={isEditable}
                              className="w-full text-slate-400 text-xs"
                            />
                          </div>
                          {isEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateProductDetails?.((prev) => {
                                  const subModules = [...(prev.subModules || [])];
                                  const points = (subModules[idx].points || []).filter((_, i) => i !== pIdx);
                                  subModules[idx] = { ...subModules[idx], points };
                                  return { ...prev, subModules };
                                });
                              }}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              ×
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>

                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateProductDetails?.((prev) => {
                            const subModules = [...(prev.subModules || [])];
                            const points = [...(subModules[idx].points || []), 'New capability specification point'];
                            subModules[idx] = { ...subModules[idx], points };
                            return { ...prev, subModules };
                          });
                        }}
                        className="text-[11px] font-mono text-[#2384ba] hover:underline flex items-center gap-1 mb-4"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Capability Point</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>API Instrumented</span>
                    <span className="text-emerald-400">100% Test Coverage</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Core Modular Subsystems Section is Hidden</span>
          <button
            type="button"
            onClick={() => onToggleSectionVisibility?.('submodules', true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore Subsystems Section
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 5. TARGET INDUSTRIES & STATUTORY COMPLIANCE */}
      {/* ========================================================================= */}
      {showIndustries || showCompliance ? (
        <section className="py-20 bg-slate-950 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isEditable && (
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30">
                  Section: Target Industries & Statutory Compliance
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onToggleSectionVisibility?.('industries', false);
                    onToggleSectionVisibility?.('compliance', false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-colors"
                  title="Hide/Remove Industries & Compliance Section"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Section</span>
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {showIndustries && (
                <div>
                  <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-3 font-bold`}>
                    <InlineInput
                      value={titles.industriesEyebrow || '04 / DEPLOYMENT REACH'}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          customTitles: { ...(prev.customTitles || {}), industriesEyebrow: val },
                        }))
                      }
                      isEditable={isEditable}
                      className="font-bold"
                    />
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    <InlineInput
                      value={titles.industriesTitle || 'Target Industries & Enterprise Sectors'}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          customTitles: { ...(prev.customTitles || {}), industriesTitle: val },
                        }))
                      }
                      isEditable={isEditable}
                      className="text-white font-bold"
                    />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {(productDetails.targetIndustry || []).map((industry, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className={`w-4 h-4 ${accent.text} shrink-0`} />
                          <InlineInput
                            value={industry}
                            onChange={(val) =>
                              onUpdateProductDetails?.((prev) => {
                                const list = [...(prev.targetIndustry || [])];
                                list[iIdx] = val;
                                return { ...prev, targetIndustry: list };
                              })
                            }
                            isEditable={isEditable}
                            className="text-sm font-medium text-white"
                          />
                        </div>
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateProductDetails?.((prev) => ({
                                ...prev,
                                targetIndustry: (prev.targetIndustry || []).filter((_, i) => i !== iIdx),
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditable && (
                    <div className="flex gap-2 mb-8">
                      <input
                        type="text"
                        placeholder="+ Add new target industry sector..."
                        value={newIndustryInput}
                        onChange={(e) => setNewIndustryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newIndustryInput.trim()) {
                            e.preventDefault();
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              targetIndustry: [...(prev.targetIndustry || []), newIndustryInput.trim()],
                            }));
                            setNewIndustryInput('');
                          }
                        }}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newIndustryInput.trim()) {
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              targetIndustry: [...(prev.targetIndustry || []), newIndustryInput.trim()],
                            }));
                            setNewIndustryInput('');
                          }
                        }}
                        className="px-4 py-2 bg-[#2384ba] text-white rounded-xl text-xs font-mono font-bold"
                      >
                        + Add
                      </button>
                    </div>
                  )}

                  <div className={`p-5 rounded-xl border ${accent.border} ${accent.bgLight} text-xs font-mono text-slate-300`}>
                    <span className={`${accent.text} font-bold block mb-1`}>DEPLOYMENT TOPOLOGY:</span>
                    <InlineInput
                      value={(productDetails.deploymentModes || []).join(' • ')}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          deploymentModes: val.split('•').map((d) => d.trim()),
                        }))
                      }
                      isEditable={isEditable}
                      className="w-full text-slate-300 font-mono text-xs"
                      placeholder="Modes separated by •"
                    />
                  </div>
                </div>
              )}

              {showCompliance && (
                <div>
                  <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-3 font-bold`}>
                    <InlineInput
                      value={titles.complianceEyebrow || '05 / STATUTORY ASSURANCE'}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          customTitles: { ...(prev.customTitles || {}), complianceEyebrow: val },
                        }))
                      }
                      isEditable={isEditable}
                      className="font-bold"
                    />
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    <InlineInput
                      value={titles.complianceTitle || 'Regulatory Standards & Security Seals'}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          customTitles: { ...(prev.customTitles || {}), complianceTitle: val },
                        }))
                      }
                      isEditable={isEditable}
                      className="text-white font-bold"
                    />
                  </h2>
                  <div className="space-y-3 mb-4">
                    {(productDetails.complianceList || []).map((comp, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                          <InlineInput
                            value={comp}
                            onChange={(val) =>
                              onUpdateProductDetails?.((prev) => {
                                const list = [...(prev.complianceList || [])];
                                list[cIdx] = val;
                                return { ...prev, complianceList: list };
                              })
                            }
                            isEditable={isEditable}
                            className="text-sm font-semibold text-white"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            CERTIFIED
                          </span>
                          {isEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateProductDetails?.((prev) => ({
                                  ...prev,
                                  complianceList: (prev.complianceList || []).filter((_, i) => i !== cIdx),
                                }));
                              }}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isEditable && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="+ Add compliance seal (e.g. ISO 27001 Certified)..."
                        value={newComplianceInput}
                        onChange={(e) => setNewComplianceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newComplianceInput.trim()) {
                            e.preventDefault();
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              complianceList: [...(prev.complianceList || []), newComplianceInput.trim()],
                            }));
                            setNewComplianceInput('');
                          }
                        }}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newComplianceInput.trim()) {
                            onUpdateProductDetails?.((prev) => ({
                              ...prev,
                              complianceList: [...(prev.complianceList || []), newComplianceInput.trim()],
                            }));
                            setNewComplianceInput('');
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold"
                      >
                        + Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Target Industries & Compliance Section is Hidden</span>
          <button
            type="button"
            onClick={() => {
              onToggleSectionVisibility?.('industries', true);
              onToggleSectionVisibility?.('compliance', true);
            }}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore Industries & Compliance
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 6. ENTERPRISE FAQS */}
      {/* ========================================================================= */}
      {showFaqs ? (
        <section className="py-20 bg-[#0b1120] border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-3 font-bold`}>
                <InlineInput
                  value={titles.faqsEyebrow || '06 / ARCHITECTURE DISCOVERY'}
                  onChange={(val) =>
                    onUpdateProductDetails?.((prev) => ({
                      ...prev,
                      customTitles: { ...(prev.customTitles || {}), faqsEyebrow: val },
                    }))
                  }
                  isEditable={isEditable}
                  className="font-bold"
                />
              </span>
              <h2 className="text-3xl font-bold text-white">
                <InlineInput
                  value={titles.faqsTitle || 'Frequently Asked Questions'}
                  onChange={(val) =>
                    onUpdateProductDetails?.((prev) => ({
                      ...prev,
                      customTitles: { ...(prev.customTitles || {}), faqsTitle: val },
                    }))
                  }
                  isEditable={isEditable}
                  className="text-white font-bold"
                />
              </h2>

              {isEditable && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq = {
                        question: 'How does this system handle high-concurrency workloads?',
                        answer: 'Through asynchronous non-blocking event loops, geo-replicated caching, and horizontal autoscaling.',
                      };
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        faqs: [...(prev.faqs || []), newFaq],
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-bold transition-all shadow-lg active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ Question</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSectionVisibility?.('faqs', false)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-colors"
                    title="Hide/Remove FAQs Section"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Section</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {(productDetails.faqs || []).map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl relative group"
                >
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProductDetails?.((prev) => ({
                          ...prev,
                          faqs: (prev.faqs || []).filter((_, i) => i !== fIdx),
                        }));
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white rounded-lg transition-colors shadow-md z-20"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="flex items-start gap-3 mb-2 pr-8">
                    <HelpCircle className={`w-5 h-5 ${accent.text} shrink-0 mt-0.5`} />
                    <div className="w-full">
                      <InlineInput
                        value={faq.question}
                        onChange={(val) =>
                          onUpdateProductDetails?.((prev) => {
                            const faqs = [...(prev.faqs || [])];
                            faqs[fIdx] = { ...faqs[fIdx], question: val };
                            return { ...prev, faqs };
                          })
                        }
                        isEditable={isEditable}
                        className="w-full text-base font-bold text-white"
                        placeholder="FAQ Question..."
                      />
                    </div>
                  </div>

                  <div className="pl-8 text-sm text-slate-300 leading-relaxed">
                    <InlineTextarea
                      rows={3}
                      value={faq.answer}
                      onChange={(val) =>
                        onUpdateProductDetails?.((prev) => {
                          const faqs = [...(prev.faqs || [])];
                          faqs[fIdx] = { ...faqs[fIdx], answer: val };
                          return { ...prev, faqs };
                        })
                      }
                      isEditable={isEditable}
                      className="text-sm text-slate-300"
                      placeholder="FAQ Answer..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Frequently Asked Questions Section is Hidden</span>
          <button
            type="button"
            onClick={() => onToggleSectionVisibility?.('faqs', true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore FAQs Section
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 7. RELATED PRODUCTS IN CATALOG */}
      {/* ========================================================================= */}
      {showRelated && (!isPreview || isEditable) && relatedModules.length > 0 ? (
        <section className="py-20 bg-[#0f172a] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className={`font-mono text-xs uppercase tracking-[0.25em] ${accent.text} block mb-2 font-bold`}>
                  <InlineInput
                    value={titles.relatedEyebrow || '07 / COMPREHENSIVE SUITE'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), relatedEyebrow: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="font-bold"
                  />
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  <InlineInput
                    value={titles.relatedTitle || 'Explore Other Enterprise Solutions'}
                    onChange={(val) =>
                      onUpdateProductDetails?.((prev) => ({
                        ...prev,
                        customTitles: { ...(prev.customTitles || {}), relatedTitle: val },
                      }))
                    }
                    isEditable={isEditable}
                    className="text-white font-bold"
                  />
                </h2>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => onToggleSectionVisibility?.('related', false)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-colors"
                    title="Hide/Remove Related Products Section"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </button>
                )}
                <Link
                  href="/#catalog"
                  className={`inline-flex items-center gap-2 font-mono text-xs ${accent.text} hover:text-white transition-colors`}
                >
                  <span>View Full Catalog ({modulesList.length} Systems)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedModules.map((rel) => {
                const RelIcon = getModuleIcon(rel.iconName, rel.category);
                return (
                  <Link
                    key={rel.id}
                    href={`/solutions/${rel.slug || rel.id}`}
                    className={`group p-6 rounded-2xl border border-white/10 bg-slate-900/60 ${accent.borderHover} hover:bg-slate-900 transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-9 h-9 rounded-xl ${accent.bgLight} ${accent.text} flex items-center justify-center`}>
                          <RelIcon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          {rel.category}
                        </span>
                      </div>
                      <h3 className={`text-base font-bold text-white group-hover:${accent.text} transition-colors mb-2`}>
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {rel.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400 group-hover:text-white transition-colors pt-3 border-t border-white/5">
                      <span>View Specifications</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : isEditable ? (
        <div className="py-6 bg-slate-950/40 border-b border-dashed border-white/15 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <span>Related Products Section is Hidden</span>
          <button
            type="button"
            onClick={() => onToggleSectionVisibility?.('related', true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Restore Related Products
          </button>
        </div>
      ) : null}
    </div>
  );
}
