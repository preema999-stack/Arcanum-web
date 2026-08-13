'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  orderBy,
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
} from 'lucide-react';
import Link from 'next/link';

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  module: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt?: any;
  ip?: string;
}

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string>('');

  // Authentication Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Fetch and subscribe to real-time Firestore updates on 'inquiries' collection
  const fetchInquiries = async () => {
    setFetching(true);
    try {
      // 1. Try API endpoint first (bypasses any client-side Firestore read rules restrictions)
      const res = await fetch('/api/admin/inquiries');
      const apiData = await res.json();

      if (apiData.success && Array.isArray(apiData.inquiries) && apiData.inquiries.length > 0) {
        setInquiries(apiData.inquiries);
        setFetching(false);
        return;
      }

      // 2. Fallback to client-side Firestore SDK
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
        });
      });

      // Sort in-memory: newer first
      docs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setInquiries(docs);
    } catch (err: any) {
      console.warn('[Dashboard Fetch Error]', err?.message || err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setFetching(true);
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
            });
          });

          // Sort in-memory: newer first
          docs.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });

          setInquiries(docs);
          setFetching(false);
        },
        (error) => {
          console.warn('[Dashboard Firestore Subscription Error]', error?.message || error);
          // Fallback to one-time getDocs fetch
          fetchInquiries();
        }
      );
    } catch (err) {
      console.warn('[Dashboard Exception]', err);
      fetchInquiries();
    }

    return () => unsub();
  }, [user]);

  // Notice timer clear
  useEffect(() => {
    if (actionNotice) {
      const t = setTimeout(() => setActionNotice(''), 4000);
      return () => clearTimeout(t);
    }
  }, [actionNotice]);

  // Update inquiry status in Firestore
  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'resolved') => {
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setActionNotice(`Updated status to "${newStatus.toUpperCase()}".`);
    } catch (err: any) {
      console.error('[Update Status Error]', err);
      // Fallback local update
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      setActionNotice(`Updated status to "${newStatus.toUpperCase()}" (Local).`);
    }
  };

  // Delete inquiry document from Firestore
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this technical inquiry?')) return;

    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setActionNotice('Inquiry deleted successfully.');
    } catch (err: any) {
      console.error('[Delete Error]', err);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setActionNotice('Inquiry removed from list.');
    }
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    if (!inquiries.length) return;

    const headers = ['ID', 'Name', 'Email', 'Module', 'Status', 'Message', 'Date'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email.replace(/"/g, '""')}"`,
      `"${i.module.replace(/"/g, '""')}"`,
      i.status,
      `"${i.message.replace(/"/g, '""')}"`,
      i.createdAt?.toDate ? i.createdAt.toDate().toISOString() : '',
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

  if (loading || (!user && fetching)) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex items-center space-x-3 font-mono text-sm text-[#2384ba]">
          <span className="h-4 w-4 rounded-full border-2 border-[#2384ba] border-t-transparent animate-spin" />
          <span>AUTHENTICATING ADMINISTRATOR SESSION...</span>
        </div>
      </main>
    );
  }

  if (!user) return null;

  // Filter computations
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

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 font-sans dark-technical-grid pb-20">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-white group">
              <div className="h-8 w-8 rounded-lg bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba] group-hover:bg-[#2384ba] group-hover:text-white transition-colors">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight text-base">ARCANUM IT</span>
            </Link>
            <span className="hidden sm:inline font-mono text-xs px-2.5 py-1 rounded bg-[#2384ba]/20 text-[#2384ba] border border-[#2384ba]/30">
              ADMIN DASHBOARD
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
              <User className="h-3.5 w-3.5 text-[#2384ba]" />
              <span className="text-slate-200 font-medium">{user.email}</span>
            </div>

            <button
              onClick={() => logout()}
              className="py-1.5 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-mono font-medium transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {actionNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
            <span>{actionNotice}</span>
            <span className="text-[10px] opacity-75">FIREBASE SYNCED</span>
          </div>
        )}

        {/* Dashboard Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Technical Discovery Inquiries
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-1">
              Real-time Firestore Database • Project: <span className="text-[#2384ba]">arcanum-4e385</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchInquiries}
              disabled={fetching}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl text-xs font-mono font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#2384ba] ${fetching ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={!inquiries.length}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl text-xs font-mono font-medium transition-all flex items-center space-x-2 disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5 text-[#2384ba]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>TOTAL INQUIRIES</span>
              <Inbox className="h-4 w-4 text-[#2384ba]" />
            </div>
            <div className="text-3xl font-bold text-white">{totalCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">All recorded entries</div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
              <span>NEW / UNREAD</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-300">{newCount}</div>
            <div className="text-[10px] text-amber-400/80 mt-1">Requires principal architect review</div>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-cyan-400 text-xs mb-2">
              <span>IN PROGRESS</span>
              <RefreshCw className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-300">{inProgressCount}</div>
            <div className="text-[10px] text-cyan-400/80 mt-1">Active architectural discussions</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
              <span>RESOLVED</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-300">{resolvedCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Proposal / engagement dispatched</div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 mb-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name, email, or details..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto font-mono text-xs">
            <div className="flex items-center space-x-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedModuleFilter}
                onChange={(e) => setSelectedModuleFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2384ba]"
              >
                <option value="all">All Enterprise Modules</option>
                <option value="OMS">OMS</option>
                <option value="ERP">Accurate ERP</option>
                <option value="PAYROLL">Accurate PAYROLL</option>
                <option value="Oracle">Oracle Forms</option>
                <option value="Banking">Core Banking</option>
                <option value="Scholar">Scholar School</option>
                <option value="Clinic">Accurate Clinic</option>
              </select>
            </div>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2384ba]"
            >
              <option value="all">All Statuses</option>
              <option value="new">Status: NEW</option>
              <option value="in-progress">Status: IN PROGRESS</option>
              <option value="resolved">Status: RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Inquiry Records Table */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 overflow-hidden shadow-2xl">
          {fetching ? (
            <div className="py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center space-x-2">
              <span className="h-4 w-4 rounded-full border-2 border-[#2384ba] border-t-transparent animate-spin" />
              <span>Fetching live Firestore documents...</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
              <div className="font-mono text-sm font-semibold text-slate-300">No Inquiries Found</div>
              <p className="text-xs font-sans text-slate-500 max-w-sm mx-auto">
                {inquiries.length === 0
                  ? 'No technical inquiries have been submitted yet. Test submitting a form on the main landing page!'
                  : 'No inquiries match your current search or filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900/90 font-mono text-[11px] text-slate-400 border-b border-white/10 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Client / Contact</th>
                    <th className="py-3.5 px-4">Interested System</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6">Technical Specifications</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white text-sm">{inquiry.name}</div>
                        <div className="font-mono text-slate-400 text-xs mt-0.5 flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-[#2384ba] inline shrink-0" />
                          <a
                            href={`mailto:${inquiry.email}?subject=RE: Arcanum IT Discovery - ${inquiry.module}`}
                            className="hover:text-[#2384ba] transition-colors"
                          >
                            {inquiry.email}
                          </a>
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

                      {/* Message details */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                          {inquiry.message || <em className="text-slate-500">No specifications provided.</em>}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right font-mono">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`mailto:${inquiry.email}?subject=RE: Arcanum IT Discovery - ${inquiry.module}`}
                            title="Reply via Email"
                            className="p-2 rounded-lg bg-slate-900 hover:bg-[#2384ba] text-slate-300 hover:text-white border border-white/10 transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            title="Delete Inquiry"
                            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white border border-white/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
