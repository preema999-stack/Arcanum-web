'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Calendar,
  User,
  Search,
  RefreshCw,
  ArrowRight,
  FileText,
} from 'lucide-react';
import {
  AttendanceAdjustmentAudit,
  subscribeToAdjustmentsAudit,
} from '@/lib/attendanceService';
import { formatTimeInTimezone, formatMinutes } from '@/lib/timezoneUtils';

export function AttendanceAuditView() {
  const [audits, setAudits] = useState<AttendanceAdjustmentAudit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = subscribeToAdjustmentsAudit((list) => {
      setAudits(list);
    });
    return () => unsub();
  }, []);

  const filteredAudits = audits.filter(
    (a) =>
      a.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.editedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-[#2384ba]" />
            <span>Attendance Adjustments & Audit Trail</span>
          </h2>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Immutable log of all administrator corrections, date adjustments, and self-resolved missing checkouts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
          />
        </div>
      </div>

      {/* Audit Log Cards */}
      <div className="space-y-4">
        {filteredAudits.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-500 font-mono text-xs">
            No adjustment audit records logged yet. Any adjustments made to attendance timestamps will appear here in real-time.
          </div>
        ) : (
          filteredAudits.map((audit) => (
            <div
              key={audit.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-xl space-y-3"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                    {audit.source === 'admin_portal' ? 'ADMIN MODIFICATION' : 'SELF RESOLUTION'}
                  </span>
                  <span className="text-white font-bold">{audit.staffName}</span>
                  <span className="text-slate-500">({audit.staffId})</span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>Edited By: <strong className="text-slate-200">{audit.editedBy}</strong></span>
                  <span>•</span>
                  <span>{new Date(audit.editedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Adjustment Reason */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-xs">
                <span className="text-amber-400 font-bold">AUDIT REASON:</span>{' '}
                <span className="text-slate-200 font-sans italic">"{audit.reason}"</span>
              </div>

              {/* Before vs After Diff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Original Values */}
                <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1 text-slate-300">
                  <span className="text-rose-400 text-[10px] uppercase font-bold block">
                    ORIGINAL RECORD VALUES
                  </span>
                  <div>Check-In: {audit.originalValues.checkIn ? new Date(audit.originalValues.checkIn).toLocaleTimeString() : 'N/A'}</div>
                  <div>Check-Out: {audit.originalValues.checkOut ? new Date(audit.originalValues.checkOut).toLocaleTimeString() : 'None (Open)'}</div>
                  <div>Status: {audit.originalValues.status || 'N/A'}</div>
                </div>

                {/* Updated Values */}
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1 text-slate-300">
                  <span className="text-emerald-400 text-[10px] uppercase font-bold block">
                    ADJUSTED RECORD VALUES
                  </span>
                  <div>Check-In: {audit.updatedValues.checkIn ? new Date(audit.updatedValues.checkIn).toLocaleTimeString() : 'Unchanged'}</div>
                  <div>Check-Out: {audit.updatedValues.checkOut ? new Date(audit.updatedValues.checkOut).toLocaleTimeString() : 'None'}</div>
                  <div>Status: {audit.updatedValues.status || 'checked_out'}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
