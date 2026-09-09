'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffLoginPage() {
  const { user, staffProfile, loading, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in as staff
  useEffect(() => {
    if (!loading && (staffProfile || (user && !user.email?.includes('admin')))) {
      router.push('/staff');
    }
  }, [user, staffProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await signIn(email.trim().toLowerCase(), password);
      router.push('/staff');
    } catch (err: any) {
      console.warn('[Staff Auth Error]', err);
      let msg = err?.message || 'Authentication failed.';
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        msg = 'Invalid staff work email or password. Please verify your credentials or ask your administrator.';
      } else if (err?.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please wait a moment and try again.';
      }
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex items-center space-x-3 font-mono text-sm text-[#2384ba]">
          <span className="h-4 w-4 rounded-full border-2 border-[#2384ba] border-t-transparent animate-spin" />
          <span>INITIALIZING STAFF PORTAL...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden dark-technical-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#2384ba]/15 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-white group mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#2384ba]/50 group-hover:shadow-[0_0_15px_rgba(35,132,186,0.3)]">
              <img src="/logo.png" alt="Arcanum IT Logo" className="h-full w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
            <span className="font-bold tracking-tight text-lg font-display">ARCANUM IT</span>
          </Link>
          <div className="font-mono text-xs text-[#2384ba] uppercase tracking-[0.25em] block font-semibold">
            STAFF ATTENDANCE PORTAL
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white font-display">
              Staff Member Sign In
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
              WORKSTATION
            </span>
          </div>

          <p className="text-slate-400 text-xs font-sans leading-relaxed mb-6">
            Enter your official Arcanum staff credentials to access your punch-in station, shift records, and KPIs.
          </p>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                STAFF WORK EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@arcanum.ae"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-[#2384ba] hover:from-emerald-600 hover:to-[#1a648e] text-slate-950 font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Punch Station</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-400">
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Portal →
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Public Website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
