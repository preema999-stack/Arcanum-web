'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Award,
  Zap,
} from 'lucide-react';
import { StaffKpiSummary } from '@/lib/attendanceService';

interface StaffKpiCardsProps {
  kpis: StaffKpiSummary;
  monthName: string;
}

export function StaffKpiCards({ kpis, monthName }: StaffKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Attendance Rate */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-md relative overflow-hidden group hover:border-[#2384ba]/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            ATTENDANCE RATE
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          {kpis.attendancePercentage}%
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{kpis.presentDays} / {kpis.totalWorkingDaysInMonth} Days</span>
          <span className="text-emerald-400 font-bold">{monthName}</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, kpis.attendancePercentage)}%` }}
          />
        </div>
      </div>

      {/* Card 2: Total Hours & Avg */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-md relative overflow-hidden group hover:border-[#2384ba]/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            TOTAL WORKING HOURS
          </span>
          <div className="p-2 rounded-xl bg-[#2384ba]/15 text-[#2384ba]">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          {kpis.totalWorkingHours} <span className="text-xs text-slate-400 font-normal">hrs</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Avg: {kpis.avgWorkingHoursPerDay} hrs / day</span>
          <span className="text-[#2384ba]">Standard 8h</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2384ba] to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (kpis.totalWorkingHours / (kpis.totalWorkingDaysInMonth * 8)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Card 3: Overtime Logged */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            OVERTIME DELIVERED
          </span>
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <Flame className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          {kpis.totalOvertimeHours} <span className="text-xs text-amber-400 font-normal">hrs</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Extra shift hours</span>
          <span className="text-amber-400 font-bold">Premium</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (kpis.totalOvertimeHours / 20) * 100)}%` }}
          />
        </div>
      </div>

      {/* Card 4: Punctuality & Missing Punctures */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            PUNCTUALITY & AUDIT
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {kpis.lateArrivalCount === 0 ? '100%' : `${Math.max(0, 100 - kpis.lateArrivalCount * 5)}%`}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Late arrivals: <strong className={kpis.lateArrivalCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>{kpis.lateArrivalCount}</strong></span>
          <span>Missing: <strong className={kpis.missingCheckoutCount > 0 ? 'text-rose-400' : 'text-slate-400'}>{kpis.missingCheckoutCount}</strong></span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: '92%' }}
          />
        </div>
      </div>
    </div>
  );
}
