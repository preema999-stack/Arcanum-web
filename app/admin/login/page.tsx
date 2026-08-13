'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Building2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (err: any) {
      console.error('[Auth Error]', err);
      let msg = err?.message || 'Authentication failed.';

      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. Please check your administrator credentials.';
      } else if (err?.code === 'auth/configuration-not-found') {
        msg = 'Email/Password Authentication is disabled in Firebase Console (Authentication -> Sign-in method).';
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
          <span>INITIALIZING AUTHENTICATION SUBSYSTEM...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden dark-technical-grid">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2384ba]/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white group mb-3">
            <div className="h-9 w-9 rounded-xl bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba] group-hover:bg-[#2384ba] group-hover:text-white transition-colors duration-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight text-lg">ARCANUM IT</span>
          </Link>
          <div className="font-mono text-xs text-[#2384ba] uppercase tracking-[0.25em] block">
            ADMINISTRATOR SECURITY PORTAL
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-2">
            Admin Sign In
          </h1>
          <p className="text-slate-400 text-xs font-sans leading-relaxed mb-6">
            Enter your Arcanum administrator credentials to access inquiry management.
          </p>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                ADMIN EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arcanum.ae"
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
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#2384ba] hover:bg-[#1f73a3] text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="font-mono text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center space-x-1"
            >
              <span>← Return to Public Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
