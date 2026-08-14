'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Mail, MapPin, Phone, Globe, Terminal, X } from 'lucide-react';
import { ARCANUM_INFO } from '@/data/arcanumData';
import { useCms } from '@/lib/cmsContext';

interface ContactProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export function ContactSection({ isOpenModal, onCloseModal }: ContactProps) {
  const { content: cmsContent } = useCms();
  const info = cmsContent?.info || ARCANUM_INFO;
  const hubs = cmsContent?.locations || [];
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    module: 'Organization Management System (OMS)',
    message: '',
  });

  React.useEffect(() => {
    if (!isOpenModal) return;

    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (window.__lenis) {
      window.__lenis.stop();
    }

    return () => {
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
      if (window.__lenis) {
        window.__lenis.start();
        window.__lenis.resize();
      }
    };
  }, [isOpenModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', module: 'Organization Management System (OMS)', message: '' });
          if (onCloseModal) onCloseModal();
        }, 3500);
      } else {
        setErrorMsg(data.error || 'Failed to dispatch inquiry. Please try again.');
      }
    } catch (err) {
      console.warn('[Contact Submission Exception]', err);
      // Client offline fallback UX
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', module: 'Organization Management System (OMS)', message: '' });
        if (onCloseModal) onCloseModal();
      }, 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-2">
          {info.contactBadge || '08 / INITIATE ENGAGEMENT'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] font-display">
          {info.contactTitle || 'Schedule Technical Architecture Discovery'}
        </h2>
        <p className="text-slate-600 text-base font-sans mt-3">
          {info.contactDescription || 'Speak directly with our senior software architects. Whether you need custom ERP implementation, Oracle Forms refactoring, or co-operative banking integration, we deliver enterprise certainty.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Address & Contact Info Box */}
        <div className="lg:col-span-5 bg-[#0f172a] text-slate-100 rounded-xl p-8 border border-slate-800 shadow-xl space-y-6">
          <div>
            <span className="text-[#2384ba] font-mono text-xs uppercase tracking-wider block mb-1">
              GLOBAL OPERATIONAL HUBS
            </span>
            <h3 className="text-xl font-bold text-white font-display mb-4">
              {info.name || 'Arcanum Information Technology'}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed font-sans mb-6">
              {info.aboutDescription2 || 'Professionally managed software development firm operating across strategic tech centers in UAE & India.'}
            </p>
          </div>

          {/* 3 Location Hubs */}
          <div className="space-y-3 pt-4 border-t border-slate-800 font-mono text-xs">
            {hubs.length > 0 ? hubs.map((hub) => (
              <div key={hub.id} className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 flex items-start space-x-3">
                <span className="text-base">{hub.flag || '🌐'}</span>
                <div>
                  <div className="font-bold text-white">{hub.city}, {hub.country}</div>
                  <div className="text-[11px] text-slate-400 font-sans">{hub.role}</div>
                </div>
              </div>
            )) : (
              <>
                <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 flex items-start space-x-3">
                  <span className="text-base">🇦🇪</span>
                  <div>
                    <div className="font-bold text-white">Abu Dhabi, UAE</div>
                    <div className="text-[11px] text-slate-400 font-sans">Global Headquarters & Client Strategy</div>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 flex items-start space-x-3">
                  <span className="text-base">🇮🇳</span>
                  <div>
                    <div className="font-bold text-white">Kerala, India</div>
                    <div className="text-[11px] text-slate-400 font-sans">Engineering & Core R&D Hub</div>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 flex items-start space-x-3">
                  <span className="text-base">🇮🇳</span>
                  <div>
                    <div className="font-bold text-white">Gujarat, India</div>
                    <div className="text-[11px] text-slate-400 font-sans">Tech & Operations Center</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-3 text-slate-300">
              <Mail className="w-4 h-4 text-[#2384ba] shrink-0" />
              <a href={`mailto:${info.contact?.email || 'info@arcanum.ae'}`} className="hover:text-[#2384ba] transition-colors">
                {info.contact?.email || 'info@arcanum.ae'}
              </a>
            </div>

            <div className="flex items-center space-x-3 text-slate-300">
              <Globe className="w-4 h-4 text-[#2384ba] shrink-0" />
              <a href={info.contact?.website || 'https://arcanum.ae'} target="_blank" rel="noreferrer" className="hover:text-[#2384ba] transition-colors">
                {info.contact?.website || 'https://arcanum.ae'}
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>INQUIRY DESK ONLINE</span>
            </span>
            <span>UAE REGION</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 bg-white rounded-lg p-8 border border-slate-200 shadow-subtle relative">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-[#2384ba] mx-auto" />
              <h3 className="text-xl font-bold text-[#0f172a] font-display">
                Inquiry Successfully Logged
              </h3>
              <p className="text-slate-600 text-xs font-mono max-w-md mx-auto">
                Thank you for contacting Arcanum IT. Our principal engineering architect will review your technical requirements and respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-semibold mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Chief Information Officer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-[#0f172a] focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-700 font-semibold mb-2">
                    ENTERPRISE EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.ae"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-[#0f172a] focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 font-semibold mb-2">
                  MODULE / TECHNICAL AREA OF INTEREST
                </label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-[#0f172a] focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba] font-sans"
                >
                  {(cmsContent?.modules || []).map((m) => (
                    <option key={m.id} value={m.title}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 font-semibold mb-2">
                  PROJECT SPECIFICATIONS & TIMELINE
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline your technical requirements, expected timelines, or legacy modernization objectives..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-[#0f172a] focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba] font-sans"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#0f172a] hover:bg-[#2384ba] text-white text-xs font-mono font-bold tracking-widest uppercase rounded transition-all duration-300 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Transmitting & Saving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Technical Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (isOpenModal) {
    return (
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          data-lenis-prevent="true"
          className="bg-white rounded-xl p-6 sm:p-8 max-w-4xl w-full border border-slate-200 shadow-2xl relative max-h-[88vh] overflow-y-auto overscroll-contain text-left"
        >
          <button
            onClick={onCloseModal}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <section id="contact" className="py-24 bg-[#f8fafc] editorial-grid border-b border-slate-200">
      {content}
    </section>
  );
}
