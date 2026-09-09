'use client';

import React, { useState } from 'react';
import { AlertTriangle, Clock, Calendar, CheckCircle, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { AttendanceRecord, resolveMissingCheckout } from '@/lib/attendanceService';
import { StaffMember } from '@/lib/staffService';
import { formatTimeInTimezone, getTimezoneBadge } from '@/lib/timezoneUtils';

interface MissingCheckoutModalProps {
  unclosedRecord: AttendanceRecord;
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onResolved: () => void;
}

export function MissingCheckoutModal({
  unclosedRecord,
  staff,
  isOpen,
  onClose,
  onResolved,
}: MissingCheckoutModalProps) {
  // Default checkout time suggestion: same day as checkin at 17:30 (5:30 PM)
  const defaultCheckoutTime = '17:30';
  const [checkoutTime, setCheckoutTime] = useState(defaultCheckoutTime);
  const [workedOvertime, setWorkedOvertime] = useState(false);
  const [overtimeHours, setOvertimeHours] = useState('1');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      // Build ISO UTC checkout timestamp from the record's attendance date and chosen time
      const [hours, minutes] = checkoutTime.split(':').map(Number);
      const dateParts = unclosedRecord.attendanceDate.split('-').map(Number);
      
      // Construct date in staff's configured timezone
      const targetDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes, 0);
      const actualCheckOutIso = targetDate.toISOString();

      const res = await resolveMissingCheckout({
        attendanceId: unclosedRecord.id,
        actualCheckOutIso,
        workedOvertime,
        note: note.trim() || undefined,
        staffName: staff.name,
        staffId: staff.id,
      });

      if (res.success) {
        onResolved();
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to resolve missing checkout.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to resolve missing checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  const tzBadge = getTimezoneBadge(staff.timezone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-[#0c1220] p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl">
        {/* Top Warning Banner */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
                ATTENDANCE SYSTEM WARNING
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                Unclosed Check-Out Detected
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informational Box */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2 font-mono text-xs text-slate-300">
          <p className="text-slate-200 leading-relaxed font-sans text-xs">
            You checked in on <strong className="text-amber-300">{unclosedRecord.attendanceDate}</strong> at{' '}
            <strong className="text-white">
              {formatTimeInTimezone(unclosedRecord.checkIn, staff.timezone)}
            </strong>{' '}
            but did not mark your check-out on that day.
          </p>
          <div className="pt-2 border-t border-white/10 text-[11px] text-amber-400/90 flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Multi-day continuous time calculation has been prevented.</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Resolution Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Actual Check-Out Time ({tzBadge})
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="time"
                required
                value={checkoutTime}
                onChange={(e) => setCheckoutTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Recorded on {unclosedRecord.attendanceDate}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="overtime-checkbox" className="text-xs font-sans text-slate-200 cursor-pointer select-none">
                Did you work overtime during this session?
              </label>
              <input
                id="overtime-checkbox"
                type="checkbox"
                checked={workedOvertime}
                onChange={(e) => setWorkedOvertime(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-white/20 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {workedOvertime && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Overtime Duration</span>
                <select
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-white/20 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="0.5">30 minutes</option>
                  <option value="1">1 hour</option>
                  <option value="1.5">1.5 hours</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4+ hours</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Adjustment Explanation / Reason (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Forgot to check out after late client release call."
              className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <span>Adjusting...</span>
              ) : (
                <>
                  <span>Save & Close Previous Punch</span>
                  <CheckCircle className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
