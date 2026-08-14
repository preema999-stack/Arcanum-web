'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ShieldCheck,
  LogOut,
  Search,
  Filter,
  Download,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  Layers,
  Inbox,
  User,
  Database,
  Eye,
  Edit3,
  Save,
  Plus,
  X,
  BarChart3,
  TrendingUp,
  FileText,
  Copy,
  AlertCircle,
  Globe,
  Calendar,
  Terminal,
  ChevronRight,
  ExternalLink,
  Check,
  Activity,
  Cpu,
  Zap,
  Sparkles,
  Sliders,
  Send,
  MessageSquare,
  Shield,
  Radio,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useCms, SiteContentData } from '@/lib/cmsContext';
import { ModuleItem } from '@/data/arcanumData';
import { getDailyAnalytics, DailyAnalyticsRecord } from '@/lib/analyticsService';

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  module: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt?: any;
  ip?: string;
  notes?: string;
}

type AdminTab = 'overview' | 'inquiries' | 'cms';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const { content, updateCmsContent, isFirebaseLoaded } = useCms();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [fetchingInquiries, setFetchingInquiries] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string>('');

  // Inquiry Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNotes, setModalNotes] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // Visitor Analytics State
  const [analyticsData, setAnalyticsData] = useState<DailyAnalyticsRecord[]>([]);
  const [analyticsRange, setAnalyticsRange] = useState<7 | 14 | 30>(14);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<DailyAnalyticsRecord | null>(null);

  // CMS Content Editor State
  const [cmsDraft, setCmsDraft] = useState<SiteContentData>(content);
  const [activeCmsSubTab, setActiveCmsSubTab] = useState<'hero' | 'about' | 'solutions' | 'locations' | 'contact' | 'footer'>('hero');
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsNotice, setCmsNotice] = useState('');

  // Keep draft in sync with live CMS state
  useEffect(() => {
    if (content) {
      setCmsDraft(content);
    }
  }, [content]);



  // Current system clock (UAE Timezone)
  const [currentUaeTime, setCurrentUaeTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const uae = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Dubai',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setCurrentUaeTime(uae);
      } catch (e) {
        setCurrentUaeTime(new Date().toTimeString().slice(0, 8));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  // Sync CMS Draft when live content updates
  useEffect(() => {
    if (content) {
      setCmsDraft(content);
    }
  }, [content]);

  // Load Inquiries
  const fetchInquiries = async () => {
    setFetchingInquiries(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      const apiData = await res.json();
      if (apiData.success && Array.isArray(apiData.inquiries) && apiData.inquiries.length > 0) {
        setInquiries(apiData.inquiries);
        setFetchingInquiries(false);
        return;
      }

      const querySnapshot = await getDocs(collection(db, 'inquiries'));
      const docs: InquiryRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        docs.push({
          id: docSnap.id,
          name: data.name || 'Anonymous Client',
          email: data.email || '',
          module: data.module || 'Enterprise System',
          message: data.message || '',
          status: data.status || 'new',
          createdAt: data.createdAt,
          ip: data.ip,
          notes: data.notes || '',
        });
      });

      docs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setInquiries(docs);
    } catch (err: any) {
      console.warn('[Dashboard Fetch Error]', err?.message || err);
    } finally {
      setFetchingInquiries(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setFetchingInquiries(true);
    let unsub: () => void = () => {};

    try {
      const colRef = collection(db, 'inquiries');
      unsub = onSnapshot(
        colRef,
        (snapshot) => {
          const docs: InquiryRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            docs.push({
              id: docSnap.id,
              name: data.name || 'Anonymous Client',
              email: data.email || '',
              module: data.module || 'Enterprise System',
              message: data.message || '',
              status: data.status || 'new',
              createdAt: data.createdAt,
              ip: data.ip,
              notes: data.notes || '',
            });
          });

          docs.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });

          setInquiries(docs);
          setFetchingInquiries(false);
        },
        (error) => {
          console.warn('[Dashboard Firestore Subscription Error]', error?.message || error);
          fetchInquiries();
        }
      );
    } catch (err) {
      fetchInquiries();
    }

    return () => unsub();
  }, [user]);

  // Load Visitor Analytics
  const [fetchingAnalytics, setFetchingAnalytics] = useState(false);

  const fetchAnalyticsData = async (range: 7 | 14 | 30 = analyticsRange) => {
    setFetchingAnalytics(true);
    try {
      const data = await getDailyAnalytics(range);
      setAnalyticsData(data);
    } catch (err) {
      console.warn('[Analytics Load Error]', err);
    } finally {
      setFetchingAnalytics(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAnalyticsData(analyticsRange);
  }, [user, analyticsRange]);

  const handleTestTrackVisit = async () => {
    try {
      await fetch('/api/analytics/track', { method: 'POST' });
      await fetchAnalyticsData(analyticsRange);
      setActionNotice('Test visitor session tracked and verified in real-time.');
    } catch (err) {
      setActionNotice('Failed to track test visit.');
    }
  };

  // Timer notification clears
  useEffect(() => {
    if (actionNotice) {
      const t = setTimeout(() => setActionNotice(''), 4000);
      return () => clearTimeout(t);
    }
  }, [actionNotice]);

  useEffect(() => {
    if (cmsNotice) {
      const t = setTimeout(() => setCmsNotice(''), 4000);
      return () => clearTimeout(t);
    }
  }, [cmsNotice]);

  // Actions: Inquiries
  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'resolved') => {
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      setActionNotice(`Status updated to [ ${newStatus.toUpperCase()} ]`);
    } catch (err: any) {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      setActionNotice(`Status updated to [ ${newStatus.toUpperCase()} ] (Local Session)`);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(true);
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        notes: modalNotes,
        updatedAt: serverTimestamp(),
      });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, notes: modalNotes } : item))
      );
      if (selectedInquiry) {
        setSelectedInquiry({ ...selectedInquiry, notes: modalNotes });
      }
      setActionNotice('Admin telemetry notes saved to Firestore.');
    } catch (err) {
      setActionNotice('Admin notes saved to local session.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirm purge: Are you sure you want to permanently delete this inquiry record?')) return;

    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setActionNotice('Inquiry record deleted from Firestore.');
      if (isModalOpen && selectedInquiry?.id === id) {
        setIsModalOpen(false);
      }
    } catch (err: any) {
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setActionNotice('Inquiry record purged from local view.');
      if (isModalOpen && selectedInquiry?.id === id) {
        setIsModalOpen(false);
      }
    }
  };

  const handleOpenModal = (inquiry: InquiryRecord) => {
    setSelectedInquiry(inquiry);
    setModalNotes(inquiry.notes || '');
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!inquiries.length) return;
    const headers = ['ID', 'Name', 'Email', 'Module', 'Status', 'Message', 'Date', 'IP'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email.replace(/"/g, '""')}"`,
      `"${i.module.replace(/"/g, '""')}"`,
      i.status,
      `"${i.message.replace(/"/g, '""')}"`,
      i.createdAt?.toDate ? i.createdAt.toDate().toISOString() : '',
      i.ip || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `arcanum_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions: CMS Content Save
  const handleSaveCms = async () => {
    setCmsSaving(true);

    // Clean up trailing empty elements in arrays before submitting
    const cleanedDraft: SiteContentData = {
      ...cmsDraft,
      modules: (cmsDraft.modules || []).map((m) => ({
        ...m,
        features: (m.features || []).map((f) => f.trim()).filter(Boolean),
      })),
      locations: (cmsDraft.locations || []).map((h) => ({
        ...h,
        focusDomains: (h.focusDomains || []).map((d) => d.trim()).filter(Boolean),
        stats: (h.stats || [])
          .map((st) => ({ label: st.label.trim(), value: st.value.trim() }))
          .filter((st) => st.label || st.value),
      })),
    };

    const success = await updateCmsContent(cleanedDraft);
    setCmsSaving(false);
    if (success) {
      setCmsNotice('All section changes deployed to Firebase Firestore.');
    } else {
      setCmsNotice('Content changes applied to current session.');
    }
  };



  if (authLoading || (!user && fetchingInquiries)) {
    return (
      <main className="min-h-screen bg-[#070b14] flex items-center justify-center dark-technical-grid">
        <div className="flex flex-col items-center space-y-4 font-mono text-xs text-[#2384ba] p-8 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-2xl">
          <div className="relative">
            <span className="h-10 w-10 rounded-full border-2 border-[#2384ba] border-t-transparent animate-spin block" />
            <ShieldCheck className="h-5 w-5 text-[#2384ba] absolute inset-0 m-auto" />
          </div>
          <span className="tracking-widest uppercase font-semibold">INITIALIZING ARCANUM ADMIN COCKPIT...</span>
          <span className="text-[10px] text-slate-500">VERIFYING ENCRYPTED SESSION</span>
        </div>
      </main>
    );
  }

  if (!user) return null;

  // Filter calculations
  const filteredInquiries = inquiries.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule =
      selectedModuleFilter === 'all' ||
      i.module.toLowerCase().includes(selectedModuleFilter.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all' || i.status === selectedStatusFilter;

    return matchesSearch && matchesModule && matchesStatus;
  });

  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'in-progress').length;
  const resolvedCount = inquiries.filter((i) => i.status === 'resolved').length;

  const totalVisitors = analyticsData.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalPageViews = analyticsData.reduce((acc, curr) => acc + curr.pageViews, 0);
  const todayRecord = analyticsData[analyticsData.length - 1];
  const todayVisitors = todayRecord ? todayRecord.visitors : 0;
  const conversionRate = totalVisitors > 0
    ? Math.min(100, (totalCount / totalVisitors) * 100).toFixed(1)
    : totalCount > 0 ? '100.0' : '0.0';

  const maxVisitsInChart = Math.max(...analyticsData.map((d) => Math.max(d.visitors, d.pageViews)), 5);

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col md:flex-row relative overflow-hidden dark-technical-grid selection:bg-[#2384ba]/30 selection:text-[#2384ba]">
      {/* Subtle glowing ambient lighting in corners */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#2384ba]/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-500/10 blur-[180px] pointer-events-none rounded-full" />

      {/* ------------------------------------------------------------- */}
      {/* MODULAR CYBER SIDEBAR (Left Navigation) */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-full md:w-72 bg-slate-950/90 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/10 shrink-0 flex flex-col justify-between relative z-30">
        <div>
          {/* Top Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 text-white group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2384ba] to-[#124d72] p-[1px] shadow-lg shadow-[#2384ba]/20 group-hover:shadow-[#2384ba]/40 transition-all">
                <div className="h-full w-full bg-[#0a0f1d] rounded-xl flex items-center justify-center text-[#2384ba] group-hover:bg-[#2384ba] group-hover:text-white transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold tracking-tight text-base font-display text-white">ARCANUM</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2384ba]/20 text-[#2384ba] border border-[#2384ba]/40">IT</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">ENTERPRISE COCKPIT</span>
              </div>
            </Link>
          </div>

          {/* Telemetry Live Badge */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-slate-900/80 border border-white/10 font-mono text-[11px] text-slate-400 space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider">SESSION ADMIN</span>
              <span className="flex items-center space-x-1 text-emerald-400 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200 font-medium truncate">
              <User className="h-3.5 w-3.5 text-[#2384ba] shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>

          {/* Module Navigation Chips */}
          <div className="px-4 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            NAVIGATION MODULES
          </div>

          <nav className="px-3 space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#2384ba] to-[#1a648e] text-white font-semibold shadow-lg shadow-[#2384ba]/30 border border-[#2384ba]/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className={`h-4 w-4 ${activeTab === 'overview' ? 'text-white' : 'text-[#2384ba] group-hover:text-white'}`} />
                <span>Overview & Traffic</span>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 opacity-60 ${activeTab === 'overview' ? 'translate-x-0.5' : ''}`} />
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'inquiries'
                  ? 'bg-gradient-to-r from-[#2384ba] to-[#1a648e] text-white font-semibold shadow-lg shadow-[#2384ba]/30 border border-[#2384ba]/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Inbox className={`h-4 w-4 ${activeTab === 'inquiries' ? 'text-white' : 'text-[#2384ba] group-hover:text-white'}`} />
                <span>Inquiries Matrix</span>
              </div>
              {newCount > 0 ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-400 text-slate-950 font-bold shadow-sm animate-pulse">
                  {newCount} NEW
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">{totalCount}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'cms'
                  ? 'bg-gradient-to-r from-[#2384ba] to-[#1a648e] text-white font-semibold shadow-lg shadow-[#2384ba]/30 border border-[#2384ba]/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Edit3 className={`h-4 w-4 ${activeTab === 'cms' ? 'text-white' : 'text-[#2384ba] group-hover:text-white'}`} />
                <span>CMS Section Editor</span>
              </div>
              <span className="text-[10px] text-[#2384ba] font-bold">FIREBASE</span>
            </button>
          </nav>
        </div>

        {/* Bottom System Telemetry & Signout */}
        <div className="p-4 border-t border-white/10 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>UAE TIME (GST)</span>
              <span className="text-[#2384ba] font-bold">{currentUaeTime || '04:00:00'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>FIRESTORE DB</span>
              <span className="text-emerald-400">arcanum-4e385</span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN COCKPIT VIEWPORT */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 relative z-20">
        {/* Top Sticky Command Header */}
        <header className="sticky top-0 z-30 bg-[#070b14]/80 backdrop-blur-2xl border-b border-white/10 py-4 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-[#2384ba] tracking-widest uppercase font-semibold">
                [ 0{activeTab === 'overview' ? 1 : activeTab === 'inquiries' ? 2 : 3} // CONTROL TERMINAL ]
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight mt-0.5">
              {activeTab === 'overview' && 'Overview & Traffic Intelligence'}
              {activeTab === 'inquiries' && 'Technical Discovery Inquiries'}
              {activeTab === 'cms' && 'Dynamic CMS Section Editor'}
            </h1>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center space-x-3 font-mono text-xs">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 flex items-center space-x-1.5 transition-all text-[11px]"
            >
              <span>Public Portal</span>
              <ExternalLink className="h-3 w-3 text-[#2384ba]" />
            </Link>

            {isFirebaseLoaded ? (
              <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FIRESTORE LIVE</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>LOCAL STATIC</span>
              </span>
            )}
          </div>
        </header>

        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
          {/* Notifications Alerts */}
          {actionNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg shadow-emerald-500/5 animate-fadeIn">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{actionNotice}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 font-bold">
                UPDATED
              </span>
            </div>
          )}

          {cmsNotice && (
            <div className="p-4 rounded-xl bg-[#2384ba]/15 border border-[#2384ba]/40 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-lg shadow-[#2384ba]/10 animate-fadeIn">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="h-4 w-4 text-[#2384ba] shrink-0" />
                <span>{cmsNotice}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2384ba]/30 border border-[#2384ba]/50 font-bold">
                CMS SYNCED
              </span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & TRAFFIC ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 7 Key Telemetry HUD Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                {/* Total Inquiries */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[#2384ba]/50 transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#2384ba]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span className="tracking-wider text-slate-400">TOTAL INQUIRIES</span>
                    <div className="h-7 w-7 rounded-lg bg-[#2384ba]/20 text-[#2384ba] flex items-center justify-center">
                      <Inbox className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight">{totalCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                    <span className="text-emerald-400 font-semibold">100%</span>
                    <span>all logged leads</span>
                  </div>
                </div>

                {/* New / Unread */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/60 transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
                    <span className="tracking-wider">NEW / UNREAD</span>
                    <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-amber-300 tracking-tight">{newCount}</div>
                  <div className="text-[11px] text-amber-400/80 mt-1">Pending discovery response</div>
                </div>

                {/* In Progress */}
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-cyan-400 text-xs mb-2">
                    <span className="tracking-wider">IN PROGRESS</span>
                    <div className="h-7 w-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-cyan-300 tracking-tight">{inProgressCount}</div>
                  <div className="text-[11px] text-cyan-400/80 mt-1">Active architectural discussions</div>
                </div>

                {/* Resolved */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/60 transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
                    <span className="tracking-wider">RESOLVED</span>
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-300 tracking-tight">{resolvedCount}</div>
                  <div className="text-[11px] text-emerald-400/80 mt-1">Proposal & engagement dispatched</div>
                </div>

                {/* Total Visitors */}
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/60 transition-all duration-300 shadow-xl">
                  <div className="flex items-center justify-between text-indigo-400 text-xs mb-2">
                    <span className="tracking-wider">TOTAL VISITORS ({analyticsRange}D)</span>
                    <div className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-indigo-300 tracking-tight">{totalVisitors}</div>
                  <div className="text-[11px] text-indigo-400/80 mt-1">{totalPageViews} total page impressions</div>
                </div>

                {/* Today's Visitors */}
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/60 transition-all duration-300 shadow-xl">
                  <div className="flex items-center justify-between text-purple-400 text-xs mb-2">
                    <span className="tracking-wider">TODAY&apos;S VISITORS</span>
                    <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-300 tracking-tight">{todayVisitors}</div>
                  <div className="text-[11px] text-purple-400/80 mt-1">Active site sessions today</div>
                </div>

                {/* Conversion Rate */}
                <div className="rounded-2xl border border-[#2384ba]/40 bg-gradient-to-br from-[#2384ba]/10 to-slate-950/80 p-5 backdrop-blur-xl col-span-1 sm:col-span-2 lg:col-span-2 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#2384ba] text-xs mb-2">
                    <span className="tracking-wider font-bold">INQUIRY CONVERSION EFFICIENCY</span>
                    <div className="h-7 w-7 rounded-lg bg-[#2384ba]/20 text-[#2384ba] flex items-center justify-center">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-3">
                    <div className="text-3xl font-bold text-white tracking-tight">{conversionRate}%</div>
                    <span className="text-xs text-slate-400 font-sans">
                      ({totalCount} discovery inquiries recorded out of {totalVisitors} unique visits)
                    </span>
                  </div>
                  {/* Glowing progress bar */}
                  <div className="w-full bg-slate-900 h-2.5 rounded-full mt-3 overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-[#2384ba] to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(35,132,186,0.6)]"
                      style={{ width: `${Math.min(100, Math.max(8, parseFloat(conversionRate) * 5))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Cybernetic Visitor Traffic Graph Cockpit */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-6 sm:p-8 backdrop-blur-2xl space-y-6 shadow-2xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="h-2 w-2 rounded-full bg-[#2384ba] animate-ping" />
                      <h3 className="text-lg font-bold text-white font-display tracking-tight flex items-center space-x-2">
                        <span>Visitor Traffic & Telemetry Stream</span>
                      </h3>
                    </div>
                    <p className="text-slate-400 text-xs font-mono">
                      Daily session volume and page impression timeline recorded by Firestore
                    </p>
                  </div>

                  {/* Controls Toolbar: Refresh & Range */}
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <button
                      onClick={() => fetchAnalyticsData(analyticsRange)}
                      disabled={fetchingAnalytics}
                      title="Refresh real-time analytics"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-[#2384ba]/40 transition-all flex items-center space-x-1 text-[11px]"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-[#2384ba] ${fetchingAnalytics ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                      onClick={handleTestTrackVisit}
                      title="Log a test session to verify real-time stream"
                      className="px-2.5 py-1.5 rounded-xl bg-[#2384ba]/15 border border-[#2384ba]/30 text-[#2384ba] hover:bg-[#2384ba] hover:text-white transition-all text-[11px]"
                    >
                      + Test Visit
                    </button>

                    <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
                      {[7, 14, 30].map((r) => (
                        <button
                          key={r}
                          onClick={() => setAnalyticsRange(r as any)}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            analyticsRange === r
                              ? 'bg-[#2384ba] text-white font-bold shadow-md shadow-[#2384ba]/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {r}D
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual SVG Chart Matrix */}
                <div className="h-72 w-full flex items-end justify-between gap-2 sm:gap-3 pt-8 pb-3 px-2 border-b border-white/10 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15 border-b border-white/10">
                    <div className="border-b border-white/40 w-full" />
                    <div className="border-b border-white/40 w-full" />
                    <div className="border-b border-white/40 w-full" />
                    <div className="border-b border-white/40 w-full" />
                  </div>

                  {analyticsData.map((d, idx) => {
                    const hasActivity = (d.pageViews || 0) > 0 || (d.visitors || 0) > 0;
                    const viewsPercent = hasActivity ? Math.max(12, ((d.pageViews || 0) / maxVisitsInChart) * 100) : 0;
                    const visitorPercent = hasActivity && (d.pageViews || 0) > 0 
                      ? Math.min(100, Math.max(15, ((d.visitors || 0) / (d.pageViews || 1)) * 100)) 
                      : (d.visitors > 0 ? 100 : 0);

                    return (
                      <div
                        key={d.date || idx}
                        onMouseEnter={() => setHoveredDataPoint(d)}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                      >
                        {/* Hover Tooltip Popup */}
                        <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-start bg-slate-900/95 border border-[#2384ba]/40 rounded-xl p-3 text-[11px] font-mono text-slate-200 z-30 shadow-2xl backdrop-blur-xl whitespace-nowrap min-w-[140px]">
                          <span className="text-[#2384ba] font-bold text-xs mb-1">{d.date}</span>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-[#2384ba]" />
                            <span>Visitors: <strong className="text-white">{d.visitors || 0}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-slate-600" />
                            <span>Page Views: <strong className="text-slate-200">{d.pageViews || 0}</strong></span>
                          </div>
                        </div>

                        {/* Chart Column or Zero Point */}
                        {hasActivity ? (
                          <div
                            className="w-full max-w-[24px] bg-slate-800/90 rounded-t-lg transition-all duration-300 group-hover:bg-slate-700 relative overflow-hidden border-t border-white/10"
                            style={{ height: `${viewsPercent}%` }}
                          >
                            {/* Inner glowing visitor fill */}
                            <div
                              className="w-full bg-gradient-to-t from-[#1b6ca1] to-[#2384ba] absolute bottom-0 rounded-t-lg transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(35,132,186,0.6)]"
                              style={{ height: `${visitorPercent}%` }}
                            />
                          </div>
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-800 group-hover:bg-[#2384ba] transition-colors mb-1" />
                        )}

                        {/* Date Label */}
                        <span className="text-[10px] font-mono text-slate-500 mt-2 truncate w-full text-center group-hover:text-[#2384ba] transition-colors">
                          {d.date ? d.date.slice(5) : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Graph Legend & Telemetry */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-5">
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 rounded-md bg-[#2384ba] shadow-sm shadow-[#2384ba]/50 inline-block" />
                      <span className="text-slate-200 font-medium">Unique Client Sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 rounded-md bg-slate-800 inline-block border border-white/10" />
                      <span>Total Page Views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                    <Activity className="h-3.5 w-3.5 text-[#2384ba]" />
                    <span>Real-time Stream Integration</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: TECHNICAL INQUIRIES MATRIX */}
          {/* ========================================================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {/* Header & Controls Toolbar */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                {/* Search Box */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by client name, email, module, specs..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba]"
                  />
                </div>

                {/* Filters & Export Toolbar */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl px-3 py-1">
                    <Filter className="h-3.5 w-3.5 text-[#2384ba]" />
                    <select
                      value={selectedModuleFilter}
                      onChange={(e) => setSelectedModuleFilter(e.target.value)}
                      className="bg-transparent text-slate-200 py-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-slate-900">All Modules</option>
                      <option value="OMS" className="bg-slate-900">OMS</option>
                      <option value="ERP" className="bg-slate-900">ARC ERP</option>
                      <option value="PAYROLL" className="bg-slate-900">Accurate PAYROLL</option>
                      <option value="Banking" className="bg-slate-900">Core Banking</option>
                      <option value="Scholar" className="bg-slate-900">Scholar School</option>
                      <option value="Clinic" className="bg-slate-900">Accurate Clinic</option>
                      <option value="Oracle" className="bg-slate-900">Oracle Forms</option>
                    </select>
                  </div>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2384ba] cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900">All Statuses</option>
                    <option value="new" className="bg-slate-900">STATUS: NEW</option>
                    <option value="in-progress" className="bg-slate-900">STATUS: IN PROGRESS</option>
                    <option value="resolved" className="bg-slate-900">STATUS: RESOLVED</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    disabled={!inquiries.length}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 shrink-0 disabled:opacity-40 shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 text-[#2384ba]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Inquiry Table Matrix */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/90 overflow-hidden shadow-2xl backdrop-blur-2xl">
                {fetchingInquiries ? (
                  <div className="py-24 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center space-y-3">
                    <span className="h-6 w-6 rounded-full border-2 border-[#2384ba] border-t-transparent animate-spin" />
                    <span>FETCHING REAL-TIME FIRESTORE INQUIRIES...</span>
                  </div>
                ) : filteredInquiries.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 space-y-3">
                    <Inbox className="h-12 w-12 text-slate-600 mx-auto" />
                    <div className="font-mono text-sm font-semibold text-slate-300">No Inquiries Found</div>
                    <p className="text-xs font-sans text-slate-500 max-w-sm mx-auto">
                      No technical inquiry records match your active search or filtering parameters.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-900/90 font-mono text-[11px] text-slate-400 border-b border-white/10 uppercase tracking-wider">
                        <tr>
                          <th className="py-4 px-6">Client Identity</th>
                          <th className="py-4 px-4">System Module</th>
                          <th className="py-4 px-4">State</th>
                          <th className="py-4 px-6">Technical Specifications</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredInquiries.map((inquiry) => {
                          const initials = inquiry.name
                            ? inquiry.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                            : 'CL';

                          return (
                            <tr key={inquiry.id} className="hover:bg-white/[0.02] transition-colors group">
                              {/* Client Name & Email */}
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2384ba]/20 to-slate-900 border border-[#2384ba]/30 flex items-center justify-center text-[#2384ba] font-mono font-bold text-xs shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white text-sm group-hover:text-[#2384ba] transition-colors">
                                      {inquiry.name}
                                    </div>
                                    <div className="font-mono text-slate-400 text-[11px] mt-0.5 flex items-center space-x-1">
                                      <Mail className="h-3 w-3 text-[#2384ba] inline shrink-0" />
                                      <span>{inquiry.email}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Module Badge */}
                              <td className="py-4 px-4">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-[#2384ba]/15 text-[#2384ba] border border-[#2384ba]/30 font-mono text-[11px] font-medium">
                                  {inquiry.module}
                                </span>
                              </td>

                              {/* Status Selector */}
                              <td className="py-4 px-4 font-mono">
                                <select
                                  value={inquiry.status}
                                  onChange={(e) =>
                                    handleUpdateStatus(inquiry.id, e.target.value as any)
                                  }
                                  className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                    inquiry.status === 'new'
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : inquiry.status === 'in-progress'
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  }`}
                                >
                                  <option value="new" className="bg-slate-900 text-amber-300">
                                    NEW
                                  </option>
                                  <option value="in-progress" className="bg-slate-900 text-cyan-300">
                                    IN PROGRESS
                                  </option>
                                  <option value="resolved" className="bg-slate-900 text-emerald-300">
                                    RESOLVED
                                  </option>
                                </select>
                              </td>

                              {/* Message snippet */}
                              <td className="py-4 px-6 max-w-xs">
                                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                                  {inquiry.message || <em className="text-slate-500">No specifications provided.</em>}
                                </p>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right font-mono">
                                <div className="flex items-center justify-end space-x-2">
                                  {/* Prominent VIEW button */}
                                  <button
                                    onClick={() => handleOpenModal(inquiry)}
                                    className="px-3 py-1.5 rounded-lg bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-medium text-xs flex items-center space-x-1.5 shadow-md shadow-[#2384ba]/25 hover:shadow-[#2384ba]/45 transition-all"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>View Spec</span>
                                  </button>

                                  <button
                                    onClick={() => handleDelete(inquiry.id)}
                                    title="Delete Inquiry"
                                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white border border-white/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CMS SECTION CONTENT EDITOR */}
          {/* ========================================================= */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              {/* CMS Header & Deploy Button */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#2384ba]/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-[#2384ba] animate-ping" />
                    <span className="font-mono text-xs text-[#2384ba] uppercase tracking-wider font-semibold">
                      HEADLESS CMS CONTROLLER
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display tracking-tight">
                    Website Section & Content Management
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mt-1 max-w-xl">
                    Changes made here update the Firestore database in real-time, instantly rendering across the live enterprise landing page.
                  </p>
                </div>

                <button
                  onClick={handleSaveCms}
                  disabled={cmsSaving}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#2384ba] to-[#17628e] hover:from-[#1b6ca1] hover:to-[#124d72] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-2.5 shadow-lg shadow-[#2384ba]/30 hover:shadow-[#2384ba]/50 transition-all disabled:opacity-50 shrink-0"
                >
                  <Save className={`h-4 w-4 ${cmsSaving ? 'animate-spin' : ''}`} />
                  <span>{cmsSaving ? 'DEPLOYING TO FIRESTORE...' : 'DEPLOY CHANGES TO FIREBASE'}</span>
                </button>
              </div>

              {/* CMS Sub-navigation Tabs (1:1 with Website Sections) */}
              <div className="flex border-b border-white/10 font-mono text-xs space-x-2 sm:space-x-4 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCmsSubTab('hero')}
                  className={`pb-3 px-2 border-b-2 font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeCmsSubTab === 'hero'
                      ? 'border-[#2384ba] text-white font-bold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 text-[#2384ba]" />
                  <span>01 / Hero Section</span>
                </button>
                <button
                  onClick={() => setActiveCmsSubTab('about')}
                  className={`pb-3 px-2 border-b-2 font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeCmsSubTab === 'about'
                      ? 'border-[#2384ba] text-white font-bold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5 text-[#2384ba]" />
                  <span>02 / Who We Are</span>
                </button>
                <button
                  onClick={() => setActiveCmsSubTab('solutions')}
                  className={`pb-3 px-2 border-b-2 font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeCmsSubTab === 'solutions'
                      ? 'border-[#2384ba] text-white font-bold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-[#2384ba]" />
                  <span>03 / Solutions & Catalog ({cmsDraft?.modules?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveCmsSubTab('locations')}
                  className={`pb-3 px-2 border-b-2 font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeCmsSubTab === 'locations'
                      ? 'border-[#2384ba] text-white font-bold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5 text-[#2384ba]" />
                  <span>04 / Global Tech Hubs ({cmsDraft?.locations?.length || 3})</span>
                </button>
                <button
                  onClick={() => setActiveCmsSubTab('contact')}
                  className={`pb-3 px-2 border-b-2 font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeCmsSubTab === 'contact'
                      ? 'border-[#2384ba] text-white font-bold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Send className="h-3.5 w-3.5 text-[#2384ba]" />
                  <span>05 / Contact Desk</span>
                </button>
                <button
                  onClick={() => setActiveCmsSubTab('footer')}
                  className={`pb-3 px-2 border-b-2 font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeCmsSubTab === 'footer'
                      ? 'border-[#2384ba] text-white font-bold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2384ba]" />
                  <span>06 / Brand & Footer</span>
                </button>
              </div>

              {/* ========================================================= */}
              {/* SUBTAB 1: 01 / HERO SECTION */}
              {/* ========================================================= */}
              {activeCmsSubTab === 'hero' && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                      SECTION 01: HERO OPENING & KINETIC SCROLL NARRATIVE
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">Configure all opening headlines, 3-phase typography narratives, and primary call-to-action buttons.</p>
                  </div>

                  {/* Tag / Global Hubs Badge */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">TOP STATUS BADGE</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">BADGE LABEL (GREEN PULSE INDICATOR)</label>
                      <input
                        type="text"
                        value={cmsDraft?.info?.heroBadgeLabel || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroBadgeLabel: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* Phase 1 */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">PHASE 01: HERO OPENING HEADLINE</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">HEADLINE PREFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroHeadline || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroHeadline: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">HEADLINE SUFFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroHeadlineSuffix || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroHeadlineSuffix: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">HIGHLIGHT TERM (CYAN GLOW)</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroHeadlineHighlight || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroHeadlineHighlight: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">PHASE 02: KINETIC NARRATIVE</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">PHASE 2 TITLE PREFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroPhase2Title || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroPhase2Title: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">PHASE 2 HIGHLIGHT</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroPhase2Highlight || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroPhase2Highlight: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">PHASE 2 DESCRIPTION</label>
                      <textarea
                        rows={2}
                        value={cmsDraft?.info?.heroPhase2Description || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroPhase2Description: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">PHASE 03: ENGINEERING CONTINUITY</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">PHASE 3 TITLE PREFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroPhase3Title || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroPhase3Title: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">PHASE 3 HIGHLIGHT</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroPhase3Highlight || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroPhase3Highlight: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">PHASE 3 DESCRIPTION</label>
                      <textarea
                        rows={2}
                        value={cmsDraft?.info?.heroPhase3Description || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroPhase3Description: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* Hero Action CTAs */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">ACTION BUTTONS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">PRIMARY CTA BUTTON</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroCta1 || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroCta1: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">SECONDARY CTA BUTTON</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.heroCta2 || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, heroCta2: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUBTAB 2: 02 / WHO WE ARE */}
              {/* ========================================================= */}
              {activeCmsSubTab === 'about' && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                      SECTION 02: WHO WE ARE (ABOUT, TELEMETRY & VALUE PILLARS)
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">Configure section 02 headings, introduction paragraph, 4 live counter metrics, running marquee ticker, and 4 architectural value pillars.</p>
                  </div>

                  {/* Section Headings */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">SECTION HEADINGS & MAIN DESCRIPTION</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">BADGE</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.aboutBadge || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, aboutBadge: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TITLE PREFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.aboutTitle || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, aboutTitle: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TITLE HIGHLIGHT</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.aboutTitleHighlight || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, aboutTitleHighlight: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">MAIN COMPANY DESCRIPTION PARAGRAPH</label>
                      <textarea
                        rows={3}
                        value={cmsDraft?.info?.aboutDescription1 || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, aboutDescription1: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* 4 Live Telemetry Counters */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">4 LIVE COUNTER TELEMETRY METRICS</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {cmsDraft?.info?.stats?.map((stat, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2.5">
                          <span className="font-mono text-[9px] text-[#2384ba] font-bold block">METRIC 0{idx + 1}</span>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">LABEL</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...cmsDraft.info.stats];
                                newStats[idx].label = e.target.value;
                                setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, stats: newStats } });
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">DISPLAY VALUE</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...cmsDraft.info.stats];
                                newStats[idx].value = e.target.value;
                                setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, stats: newStats } });
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-bold font-mono focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marquee Ticker */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                    <label className="block text-xs font-mono text-slate-300">RUNNING MARQUEE TICKER TEXT BANNER</label>
                    <input
                      type="text"
                      value={cmsDraft?.info?.marqueeText || ''}
                      onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, marqueeText: e.target.value } })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-[#2384ba]"
                    />
                  </div>

                  {/* 4 Value Pillars */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">4 ARCHITECTURAL VALUE PILLARS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cmsDraft?.values?.map((val, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                            <span>PILLAR 0{idx + 1}</span>
                            <span className="text-[#2384ba]">{val.iconName || 'Layers'}</span>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">TITLE</label>
                            <input
                              type="text"
                              value={val.title}
                              onChange={(e) => {
                                const newValues = [...cmsDraft.values];
                                newValues[idx].title = e.target.value;
                                setCmsDraft({ ...cmsDraft, values: newValues });
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">DESCRIPTION</label>
                            <textarea
                              rows={2}
                              value={val.description}
                              onChange={(e) => {
                                const newValues = [...cmsDraft.values];
                                newValues[idx].description = e.target.value;
                                setCmsDraft({ ...cmsDraft, values: newValues });
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUBTAB 3: 03 / SOLUTIONS & PRODUCT CATALOG */}
              {/* ========================================================= */}
              {activeCmsSubTab === 'solutions' && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                        SECTIONS 03 & 04: FLAGSHIP SOLUTIONS & FULL PRODUCT CATALOG
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">Configure flagship solution titles, catalog badges, and all enterprise module entries.</p>
                    </div>

                    <button
                      onClick={() => {
                        const newMod: ModuleItem = {
                          id: `mod-${Date.now()}`,
                          title: 'New Enterprise Solution',
                          category: 'Enterprise',
                          subtitle: 'Custom Architecture Subsystem',
                          description: 'Description of technical capabilities and specifications.',
                          features: ['Modular Architecture', 'High Throughput API'],
                          iconName: 'Building2',
                          techStack: ['TypeScript', 'Next.js', 'PostgreSQL'],
                        };
                        setCmsDraft({ ...cmsDraft, modules: [...(cmsDraft.modules || []), newMod] });
                      }}
                      className="px-4 py-2 bg-[#2384ba] hover:bg-[#1b6ca1] text-white rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Catalog Module</span>
                    </button>
                  </div>

                  {/* Flagship Solutions Headings */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">SECTION 03: FLAGSHIP SOLUTIONS HEADINGS</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">BADGE</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.solutionsBadge || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, solutionsBadge: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TITLE PREFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.solutionsTitle || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, solutionsTitle: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TITLE HIGHLIGHT</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.solutionsTitleHighlight || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, solutionsTitleHighlight: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Flagship Cards Dedicated Editor */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-[#2384ba]/30 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-xs text-[#2384ba] font-bold uppercase tracking-wider block">
                          ⭐ 4 FEATURED FLAGSHIP SOLUTION CARDS (SECTION 03 ON LIVE SITE)
                        </span>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Configure the 4 flagship solution cards showcased in the 4-column grid on the live homepage.
                        </p>
                      </div>
                      <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-[#2384ba]/20 text-[#2384ba] border border-[#2384ba]/40 font-bold self-start sm:self-auto">
                        4 CARDS ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[
                        { id: 'oms', label: 'FLAGSHIP CARD 01 • OMS', defaultImg: '/hero-topsection/ezgif-frame-105.jpg' },
                        { id: 'erp', label: 'FLAGSHIP CARD 02 • ARC ERP', defaultImg: '/hero_infrastructure.png' },
                        { id: 'banking', label: 'FLAGSHIP CARD 03 • CORE BANKING', defaultImg: '/banking_fintech.png' },
                        { id: 'oracle', label: 'FLAGSHIP CARD 04 • ORACLE FORMS', defaultImg: '/oracle_modernization.png' },
                      ].map((fCard, cIdx) => {
                        const modIdx = cmsDraft?.modules?.findIndex((m) => m.id === fCard.id);
                        const mod = modIdx !== undefined && modIdx !== -1 ? cmsDraft?.modules?.[modIdx] : null;

                        if (!mod || modIdx === undefined || modIdx === -1) {
                          return (
                            <div key={fCard.id} className="p-5 bg-slate-950/60 rounded-2xl border border-dashed border-white/10 text-center space-y-2">
                              <span className="font-mono text-xs text-slate-400">Card '{fCard.id}' not found in modules catalog.</span>
                              <button
                                onClick={() => {
                                  const newFlagship: ModuleItem = {
                                    id: fCard.id,
                                    title: fCard.label,
                                    category: 'Enterprise',
                                    subtitle: 'Flagship Solution Engine',
                                    description: 'Enterprise grade module specifications.',
                                    features: ['High Throughput', 'Cloud Scalable', 'Enterprise Support'],
                                    iconName: 'Building2',
                                    imageSrc: fCard.defaultImg,
                                  };
                                  setCmsDraft({ ...cmsDraft, modules: [...(cmsDraft.modules || []), newFlagship] });
                                }}
                                className="px-3 py-1.5 bg-[#2384ba]/20 text-[#2384ba] border border-[#2384ba]/40 rounded-lg text-xs font-mono"
                              >
                                Restore {fCard.id.toUpperCase()} Card
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={fCard.id}
                            className="p-5 bg-slate-950 rounded-2xl border border-[#2384ba]/30 space-y-4 shadow-xl relative group hover:border-[#2384ba] transition-all"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-xs text-[#2384ba] font-bold tracking-wider">
                                  {fCard.label}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                                ID: {fCard.id}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">CARD TITLE</label>
                                <input
                                  type="text"
                                  value={mod.title}
                                  onChange={(e) => {
                                    const updated = [...cmsDraft.modules];
                                    updated[modIdx].title = e.target.value;
                                    setCmsDraft({ ...cmsDraft, modules: updated });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-[#2384ba]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">CATEGORY</label>
                                <select
                                  value={mod.category}
                                  onChange={(e) => {
                                    const updated = [...cmsDraft.modules];
                                    updated[modIdx].category = e.target.value as any;
                                    setCmsDraft({ ...cmsDraft, modules: updated });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
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

                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">CARD DESCRIPTION</label>
                              <textarea
                                rows={2}
                                value={mod.description}
                                onChange={(e) => {
                                  const updated = [...cmsDraft.modules];
                                  updated[modIdx].description = e.target.value;
                                  setCmsDraft({ ...cmsDraft, modules: updated });
                                }}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-[#2384ba]"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">CARD IMAGE (URL / PATH)</label>
                                <input
                                  type="text"
                                  placeholder={fCard.defaultImg}
                                  value={mod.imageSrc || ''}
                                  onChange={(e) => {
                                    const updated = [...cmsDraft.modules];
                                    updated[modIdx].imageSrc = e.target.value;
                                    setCmsDraft({ ...cmsDraft, modules: updated });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">BROCHURE PDF LINK</label>
                                <input
                                  type="text"
                                  value={mod.brochureUrl || ''}
                                  onChange={(e) => {
                                    const updated = [...cmsDraft.modules];
                                    updated[modIdx].brochureUrl = e.target.value;
                                    setCmsDraft({ ...cmsDraft, modules: updated });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">3 FEATURE BULLETS (COMMA SEPARATED)</label>
                              <input
                                type="text"
                                value={mod.features?.join(', ') || ''}
                                onChange={(e) => {
                                  const updated = [...cmsDraft.modules];
                                  updated[modIdx].features = e.target.value.split(',').map((f) => f.trim());
                                  setCmsDraft({ ...cmsDraft, modules: updated });
                                }}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-[#2384ba]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 04: Product Catalog Badge */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">SECTION 04: PRODUCT CATALOG BADGE</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">CATALOG BADGE</label>
                      <input
                        type="text"
                        value={cmsDraft?.info?.catalogBadge || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, catalogBadge: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* All Modules List */}
                  <div className="space-y-4">
                    <span className="font-mono text-xs text-[#2384ba] font-bold uppercase block">
                      ALL {cmsDraft?.modules?.length || 0} ENTERPRISE MODULES
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {cmsDraft?.modules?.map((mod, idx) => (
                        <div key={mod.id || idx} className="p-5 bg-slate-900/70 rounded-2xl border border-white/10 space-y-3.5 relative group hover:border-[#2384ba]/50 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] px-2.5 py-1 bg-[#2384ba]/15 text-[#2384ba] rounded-lg border border-[#2384ba]/30 font-bold uppercase">
                              {mod.category}
                            </span>
                            <button
                              onClick={() => {
                                const updated = cmsDraft.modules.filter((_, i) => i !== idx);
                                setCmsDraft({ ...cmsDraft, modules: updated });
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Module"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">MODULE TITLE</label>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => {
                                  const updated = [...cmsDraft.modules];
                                  updated[idx].title = e.target.value;
                                  setCmsDraft({ ...cmsDraft, modules: updated });
                                }}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#2384ba]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">CATEGORY</label>
                              <select
                                value={mod.category}
                                onChange={(e) => {
                                  const updated = [...cmsDraft.modules];
                                  updated[idx].category = e.target.value as any;
                                  setCmsDraft({ ...cmsDraft, modules: updated });
                                }}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
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

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">DESCRIPTION</label>
                            <textarea
                              rows={2}
                              value={mod.description}
                              onChange={(e) => {
                                const updated = [...cmsDraft.modules];
                                updated[idx].description = e.target.value;
                                setCmsDraft({ ...cmsDraft, modules: updated });
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">BROCHURE PDF LINK (OR /brochures/...)</label>
                            <input
                              type="text"
                              value={mod.brochureUrl || ''}
                              onChange={(e) => {
                                const updated = [...cmsDraft.modules];
                                updated[idx].brochureUrl = e.target.value;
                                setCmsDraft({ ...cmsDraft, modules: updated });
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">FEATURE BULLETS (COMMA SEPARATED)</label>
                            <input
                              type="text"
                              value={mod.features?.join(', ') || ''}
                              onChange={(e) => {
                                const updated = [...cmsDraft.modules];
                                updated[idx].features = e.target.value.split(',').map((f) => f.trim());
                                setCmsDraft({ ...cmsDraft, modules: updated });
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUBTAB 4: 04 / GLOBAL TECH HUBS */}
              {/* ========================================================= */}
              {activeCmsSubTab === 'locations' && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                      SECTION 05: GLOBAL TECH HUBS & REGIONAL NODES
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">Configure section headings and operational data for Abu Dhabi HQ, Kerala R&D Center, and Gujarat Operations Center.</p>
                  </div>

                  {/* Section Headings */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">SECTION HEADINGS & DESCRIPTION</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">BADGE</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.locationsBadge || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, locationsBadge: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TITLE PREFIX</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.locationsTitle || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, locationsTitle: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TITLE HIGHLIGHT</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.locationsTitleHighlight || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, locationsTitleHighlight: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">SECTION DESCRIPTION</label>
                      <textarea
                        rows={2}
                        value={cmsDraft?.info?.locationsDescription || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, locationsDescription: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* 3 Tech Hub Cards */}
                  <div className="space-y-6">
                    {cmsDraft?.locations?.map((hub, hIdx) => (
                      <div key={hub.id || hIdx} className="p-6 bg-slate-900/80 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{hub.flag}</span>
                            <div>
                              <div className="text-sm font-bold text-white flex items-center space-x-2">
                                <span>{hub.city}, {hub.country}</span>
                                {hub.isHq && <span className="px-2 py-0.5 rounded bg-[#2384ba] text-white font-mono text-[9px]">HQ</span>}
                              </div>
                              <span className="text-xs text-[#2384ba] font-mono">{hub.role}</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-slate-500">{hub.latLng}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">ROLE / TITLE</label>
                            <input
                              type="text"
                              value={hub.role}
                              onChange={(e) => {
                                const newHubs = [...cmsDraft.locations];
                                newHubs[hIdx].role = e.target.value;
                                setCmsDraft({ ...cmsDraft, locations: newHubs });
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">FULL PHYSICAL ADDRESS</label>
                            <input
                              type="text"
                              value={hub.address}
                              onChange={(e) => {
                                const newHubs = [...cmsDraft.locations];
                                newHubs[hIdx].address = e.target.value;
                                setCmsDraft({ ...cmsDraft, locations: newHubs });
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">HUB PURPOSE & STRATEGY DESCRIPTION</label>
                          <textarea
                            rows={3}
                            value={hub.description}
                            onChange={(e) => {
                              const newHubs = [...cmsDraft.locations];
                              newHubs[hIdx].description = e.target.value;
                              setCmsDraft({ ...cmsDraft, locations: newHubs });
                            }}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-[#2384ba]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">FOCUS DOMAINS (COMMA SEPARATED)</label>
                          <input
                            type="text"
                            value={hub.focusDomains?.join(', ') || ''}
                            onChange={(e) => {
                              const newHubs = [...cmsDraft.locations];
                              newHubs[hIdx].focusDomains = e.target.value.split(',').map((s) => s.trim());
                              setCmsDraft({ ...cmsDraft, locations: newHubs });
                            }}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-[#2384ba]"
                          />
                        </div>

                        {/* Hub Telemetry Stat Cards & Chips */}
                        <div className="space-y-3 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                              HUB STAT CHIPS & METRICS (E.G., SYSTEM SLA 99.99%, LATENCY, ACTIVE USERS)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const newHubs = [...cmsDraft.locations];
                                const currentStats = newHubs[hIdx].stats || [];
                                newHubs[hIdx].stats = [...currentStats, { label: 'New Metric', value: '100%' }];
                                setCmsDraft({ ...cmsDraft, locations: newHubs });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#2384ba]/20 hover:bg-[#2384ba] text-[#2384ba] hover:text-white border border-[#2384ba]/40 text-[10px] font-mono transition-all flex items-center space-x-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Stat Chip</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(hub.stats || []).map((st, stIdx) => (
                              <div key={stIdx} className="p-3 bg-slate-950/90 rounded-xl border border-white/10 relative space-y-2 group">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newHubs = [...cmsDraft.locations];
                                    newHubs[hIdx].stats = newHubs[hIdx].stats.filter((_, i) => i !== stIdx);
                                    setCmsDraft({ ...cmsDraft, locations: newHubs });
                                  }}
                                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove Stat Chip"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>

                                <div>
                                  <label className="block text-[9px] font-mono text-slate-500 mb-0.5">METRIC LABEL</label>
                                  <input
                                    type="text"
                                    value={st.label}
                                    onChange={(e) => {
                                      const newHubs = [...cmsDraft.locations];
                                      const updatedStats = [...(newHubs[hIdx].stats || [])];
                                      updatedStats[stIdx] = { ...updatedStats[stIdx], label: e.target.value };
                                      newHubs[hIdx].stats = updatedStats;
                                      setCmsDraft({ ...cmsDraft, locations: newHubs });
                                    }}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
                                    placeholder="e.g. System SLA"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-mono text-slate-500 mb-0.5">VALUE / SLA DISPLAY</label>
                                  <input
                                    type="text"
                                    value={st.value}
                                    onChange={(e) => {
                                      const newHubs = [...cmsDraft.locations];
                                      const updatedStats = [...(newHubs[hIdx].stats || [])];
                                      updatedStats[stIdx] = { ...updatedStats[stIdx], value: e.target.value };
                                      newHubs[hIdx].stats = updatedStats;
                                      setCmsDraft({ ...cmsDraft, locations: newHubs });
                                    }}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#2384ba] font-bold font-mono focus:outline-none focus:border-[#2384ba]"
                                    placeholder="e.g. 99.99%"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUBTAB 5: 05 / CONTACT DESK */}
              {/* ========================================================= */}
              {activeCmsSubTab === 'contact' && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                      SECTION 08: CONTACT INITIATION DESK
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">Configure the contact form section headings, description, and official enterprise contact points.</p>
                  </div>

                  {/* Section Headings */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">SECTION HEADINGS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">BADGE</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.contactBadge || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contactBadge: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">HEADING</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.contactTitle || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contactTitle: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">DESCRIPTION</label>
                      <textarea
                        rows={2}
                        value={cmsDraft?.info?.contactDescription || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contactDescription: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  {/* Official Direct Contact Information */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">OFFICIAL CONTACT CHANNELS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">PRIMARY EMAIL</label>
                        <input
                          type="email"
                          value={cmsDraft?.info?.contact?.email || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contact: { ...cmsDraft.info.contact, email: e.target.value } } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">OFFICIAL WEBSITE</label>
                        <input
                          type="url"
                          value={cmsDraft?.info?.contact?.website || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contact: { ...cmsDraft.info.contact, website: e.target.value } } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">TELEPHONE</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.contact?.phone || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contact: { ...cmsDraft.info.contact, phone: e.target.value } } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">OFFICE ADDRESS SUMMARY</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.contact?.address || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, contact: { ...cmsDraft.info.contact, address: e.target.value } } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUBTAB 6: 06 / BRAND & FOOTER */}
              {/* ========================================================= */}
              {activeCmsSubTab === 'footer' && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-mono text-xs text-[#2384ba] uppercase font-bold tracking-wider">
                      GLOBAL BRAND IDENTITY & FOOTER
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">Configure legal business names, corporate tagline, footer overview paragraph, and social links.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">LEGAL ENTITY & BRAND NAMES</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">LEGAL ENTITY NAME</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.name || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, name: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">SHORT BRAND NAME</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.shortName || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, shortName: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">ENTERPRISE TAGLINE</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.tagline || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, tagline: e.target.value } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">FOOTER COMPANY SUMMARY</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">FOOTER DESCRIPTION PARAGRAPH</label>
                      <textarea
                        rows={3}
                        value={cmsDraft?.info?.aboutDescription2 || ''}
                        onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, aboutDescription2: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#2384ba]"
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <span className="font-mono text-[10px] text-[#2384ba] font-bold uppercase block">SOCIAL & MESSAGING INTEGRATIONS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">WHATSAPP DIRECT NUMBER</label>
                        <input
                          type="text"
                          value={cmsDraft?.info?.socialLinks?.whatsapp || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, socialLinks: { ...cmsDraft.info.socialLinks, whatsapp: e.target.value } } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">LINKEDIN URL</label>
                        <input
                          type="url"
                          value={cmsDraft?.info?.socialLinks?.linkedin || ''}
                          onChange={(e) => setCmsDraft({ ...cmsDraft, info: { ...cmsDraft.info, socialLinks: { ...cmsDraft.info.socialLinks, linkedin: e.target.value } } })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2384ba]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* INQUIRY DETAIL INSPECTOR MODAL */}
      {/* ============================================================= */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b14]/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-950 border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white font-display">{selectedInquiry.name}</h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#2384ba]/20 text-[#2384ba] border border-[#2384ba]/30">
                      {selectedInquiry.module}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    INQUIRY ID: <span className="text-slate-200 font-semibold">{selectedInquiry.id}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Status and Actions Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">STATE:</span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      selectedInquiry.status === 'new'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : selectedInquiry.status === 'in-progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {selectedInquiry.status}
                  </span>
                </div>

                {/* Quick Transition Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'new')}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors text-[11px]"
                  >
                    Mark NEW
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'in-progress')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors text-[11px]"
                  >
                    Mark IN PROGRESS
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'resolved')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors text-[11px]"
                  >
                    Mark RESOLVED
                  </button>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900/70 rounded-xl border border-white/5 space-y-1">
                  <span className="text-slate-500 text-[10px] block">CLIENT CONTACT EMAIL</span>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium truncate">{selectedInquiry.email}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedInquiry.email);
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2000);
                      }}
                      className="text-slate-400 hover:text-[#2384ba] p-1.5 rounded hover:bg-white/5"
                      title="Copy Email Address"
                    >
                      {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/70 rounded-xl border border-white/5 space-y-1">
                  <span className="text-slate-500 text-[10px] block">INTERESTED MODULE</span>
                  <span className="text-[#2384ba] font-bold block">{selectedInquiry.module}</span>
                </div>
              </div>

              {/* Full Technical Specifications Message Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider">TECHNICAL SPECIFICATIONS & MESSAGE</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedInquiry.message || '');
                      setActionNotice('Copied specifications to clipboard.');
                    }}
                    className="text-[#2384ba] hover:underline flex items-center space-x-1 text-[11px]"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Specs</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans max-h-52 overflow-y-auto shadow-inner">
                  {selectedInquiry.message || 'No specifications provided.'}
                </div>
              </div>

              {/* Admin Team Internal Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400 uppercase font-bold tracking-wider">INTERNAL ADMIN ARCHITECT NOTES</span>
                  <button
                    onClick={() => handleSaveNotes(selectedInquiry.id)}
                    disabled={savingNotes}
                    className="text-[#2384ba] hover:underline flex items-center space-x-1 text-[11px] font-bold"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{savingNotes ? 'SAVING...' : 'SAVE NOTES'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Record architecture discovery details, proposal quotes, or client meeting logs..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba]"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-mono font-medium transition-colors flex items-center space-x-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Record</span>
              </button>

              <div className="flex items-center space-x-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=RE: Arcanum IT Discovery - ${selectedInquiry.module}`}
                  className="px-5 py-2.5 bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-[#2384ba]/30"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </a>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
