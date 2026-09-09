'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Cake, PartyPopper, Heart, X, Volume2, VolumeX } from 'lucide-react';
import { StaffMember } from '@/lib/staffService';

interface BirthdayCelebrationModalProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
}

export function BirthdayCelebrationModal({ staff, isOpen, onClose }: BirthdayCelebrationModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];
      const newParticles = Array.from({ length: 45 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 8) + 6,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-bounce opacity-80"
            style={{
              left: `${p.left}%`,
              top: `${Math.random() * 80}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDuration: `${2 + p.delay}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: `0 0 10px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Main Festive Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-pink-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 text-center shadow-[0_0_50px_rgba(244,63,94,0.3)] backdrop-blur-2xl z-10 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Floating Icons */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-pink-500/50 p-1 shadow-[0_0_25px_rgba(244,63,94,0.4)] overflow-hidden bg-slate-900 mx-auto">
              <img
                src={staff.photoUrl}
                alt={staff.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg text-white animate-pulse">
              <Cake className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
          <PartyPopper className="h-3.5 w-3.5 text-pink-400" />
          <span>Happy Birthday Celebration</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mb-3">
          Wishing You A Stellar Birthday, <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">{staff.name}!</span>
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
          On behalf of everyone at <strong className="text-white">Arcanum Information Technology</strong>, we celebrate your brilliance, dedication, and craft. May this year be filled with breakthrough innovations, continuous growth, and happiness!
        </p>

        {/* Wish Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-6 text-left font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>DESIGNATION: {staff.designation.toUpperCase()}</span>
            <span className="text-amber-400 font-bold">🎂 SPECIAL DAY</span>
          </div>
          <p className="text-pink-300 text-xs italic">
            "Your exceptional contributions make our engineering and solutions shine every single day."
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:scale-[1.02]"
        >
          Thank You & Start Today's Shift 🚀
        </button>
      </div>
    </div>
  );
}
