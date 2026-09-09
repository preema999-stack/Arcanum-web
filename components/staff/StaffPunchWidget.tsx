'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  FileText,
  Timer,
  ShieldCheck,
  Calendar,
  Globe,
  Quote,
  Coffee,
  Play,
  Pause,
  Utensils,
  AlertTriangle,
} from 'lucide-react';
import { StaffMember } from '@/lib/staffService';
import {
  AttendanceRecord,
  recordPunchIn,
  recordPunchOut,
  recordStartBreak,
  recordEndBreak,
} from '@/lib/attendanceService';
import {
  formatTimeInTimezone,
  calculateWorkingMinutes,
  getTimezoneBadge,
} from '@/lib/timezoneUtils';
import { MotivationalQuote, getDailyQuote } from '@/lib/motivationalQuotes';

interface StaffPunchWidgetProps {
  staff: StaffMember;
  todayRecord: AttendanceRecord | null;
  unclosedRecord: AttendanceRecord | null;
  onPunchUpdated: () => void;
  onOpenMissingCheckoutModal: () => void;
}

export function StaffPunchWidget({
  staff,
  todayRecord,
  unclosedRecord,
  onPunchUpdated,
  onOpenMissingCheckoutModal,
}: StaffPunchWidgetProps) {
  // Live Clock (HH:MM:SS) in Staff Timezone
  const [currentClock, setCurrentClock] = useState<string>('');
  // Live Elapsed Working Seconds
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  // Live Break Seconds while on active break
  const [activeBreakSeconds, setActiveBreakSeconds] = useState<number>(0);

  const [punchingIn, setPunchingIn] = useState(false);
  const [punchingOut, setPunchingOut] = useState(false);
  const [togglingBreak, setTogglingBreak] = useState(false);
  const [showCheckoutNoteModal, setShowCheckoutNoteModal] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Daily / Punch Quote
  const [activeQuote, setActiveQuote] = useState<MotivationalQuote>(() =>
    getDailyQuote(staff.name)
  );

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: staff.timezone || 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setCurrentClock(timeStr);
      } catch (e) {
        setCurrentClock(new Date().toTimeString().slice(0, 8));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [staff.timezone]);

  // Live Timer for active check-in
  useEffect(() => {
    if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
      const calculateSeconds = () => {
        const start = new Date(todayRecord.checkIn).getTime();
        const now = Date.now();
        const diffSecs = Math.max(0, Math.floor((now - start) / 1000));
        setElapsedSeconds(diffSecs);
      };
      calculateSeconds();
      const interval = setInterval(calculateSeconds, 1000);
      return () => clearInterval(interval);
    } else if (todayRecord && todayRecord.checkIn && todayRecord.checkOut) {
      const start = new Date(todayRecord.checkIn).getTime();
      const end = new Date(todayRecord.checkOut).getTime();
      setElapsedSeconds(Math.max(0, Math.floor((end - start) / 1000)));
    } else {
      setElapsedSeconds(0);
    }
  }, [todayRecord]);

  // Live Timer for active break
  useEffect(() => {
    if (todayRecord && todayRecord.status === 'on_break' && todayRecord.currentBreakStart) {
      const calculateBreakSecs = () => {
        const start = new Date(todayRecord.currentBreakStart!).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((now - start) / 1000));
        setActiveBreakSeconds(diff);
      };
      calculateBreakSecs();
      const interval = setInterval(calculateBreakSecs, 1000);
      return () => clearInterval(interval);
    } else {
      setActiveBreakSeconds(0);
    }
  }, [todayRecord?.status, todayRecord?.currentBreakStart]);

  const formatElapsed = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
    if (unclosedRecord) {
      onOpenMissingCheckoutModal();
      return;
    }

    setPunchingIn(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await recordPunchIn(staff, activeQuote.quote);
      if (res.success) {
        setSuccessMessage('Punch-In successful! Have a productive day at Arcanum.');
        onPunchUpdated();
      } else {
        setErrorMessage(res.error || 'Check-in failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Check-in failed.');
    } finally {
      setPunchingIn(false);
    }
  };

  const handleConfirmCheckOut = async () => {
    if (!todayRecord) return;
    setPunchingOut(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // If currently on break, end break first automatically
      if (todayRecord.status === 'on_break') {
        await recordEndBreak(todayRecord.id);
      }
      const res = await recordPunchOut(todayRecord.id, checkoutNote);
      if (res.success) {
        setSuccessMessage('Checked out successfully. Shift completed!');
        setShowCheckoutNoteModal(false);
        setCheckoutNote('');
        onPunchUpdated();
      } else {
        setErrorMessage(res.error || 'Check-out failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Check-out failed.');
    } finally {
      setPunchingOut(false);
    }
  };

  const handleToggleBreak = async () => {
    if (!todayRecord) return;
    setTogglingBreak(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (todayRecord.status === 'on_break') {
        const res = await recordEndBreak(todayRecord.id);
        if (res.success) {
          setSuccessMessage(`Break ended. Welcome back! (${res.addedBreakMinutes || 0} mins added to break ledger)`);
          onPunchUpdated();
        } else {
          setErrorMessage(res.error || 'Failed to resume shift.');
        }
      } else {
        const res = await recordStartBreak(todayRecord.id);
        if (res.success) {
          setSuccessMessage('Break started. Enjoy your lunch / refreshments!');
          onPunchUpdated();
        } else {
          setErrorMessage(res.error || 'Failed to start break.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Break action failed.');
    } finally {
      setTogglingBreak(false);
    }
  };

  const isWorking = Boolean(todayRecord && todayRecord.checkIn && !todayRecord.checkOut && todayRecord.status !== 'on_break');
  const isOnBreak = Boolean(todayRecord && todayRecord.status === 'on_break');
  const isCheckedOut = Boolean(todayRecord && todayRecord.checkOut);
  const tzBadge = getTimezoneBadge(staff.timezone);

  // Break calculations
  const totalBreakAllowed = 60; // 60 mins standard
  const completedBreakMinutes = todayRecord?.breakMinutes || 0;
  const currentActiveBreakMins = Math.floor(activeBreakSeconds / 60);
  const totalBreakTakenMinutes = completedBreakMinutes + currentActiveBreakMins;
  const isBreakExceeded = totalBreakTakenMinutes > totalBreakAllowed;
  const breakPercentage = Math.min(100, Math.round((totalBreakTakenMinutes / totalBreakAllowed) * 100));

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2384ba]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Unclosed Session Alert */}
      {unclosedRecord && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3 text-amber-300 text-xs font-mono">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">ATTENTION:</span> Unclosed punch from {unclosedRecord.attendanceDate}.
              <p className="text-slate-300 font-sans text-[11px]">
                Please resolve your previous checkout before starting today's session.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMissingCheckoutModal}
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs shrink-0 transition-colors"
          >
            Resolve Missing Punch
          </button>
        </div>
      )}

      {/* Messages */}
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Clock, Status & Live Duration */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Pill */}
            {isOnBreak ? (
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold animate-pulse">
                <Coffee className="h-3.5 w-3.5" />
                <span>☕ ON BREAK ({formatElapsed(activeBreakSeconds)})</span>
              </span>
            ) : isWorking ? (
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🟢 AT WORK / ONLINE</span>
              </span>
            ) : isCheckedOut ? (
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>⚪ SHIFT COMPLETED / CHECKED OUT</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-400 text-xs font-mono font-medium">
                <span>⚪ NOT CHECKED IN TODAY</span>
              </span>
            )}

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400 font-mono text-[11px]">
              <Globe className="h-3.5 w-3.5 text-[#2384ba]" />
              <span>{tzBadge} ({staff.timezone})</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
              <span>📍 {staff.officeLocation || 'Kerala Office'}</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-[11px]">
              <span>🕒 {staff.shiftName || 'Day Shift'}</span>
            </div>
          </div>

          {/* Big Live Digital Clock */}
          <div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {currentClock || '08:30:00 AM'}
            </div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-1 flex items-center space-x-2">
              <Calendar className="h-3.5 w-3.5 text-[#2384ba]" />
              <span>TODAY: {new Date().toDateString()}</span>
            </div>
          </div>

          {/* Live Shift Counter & Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                CHECK-IN TIME
              </span>
              <span className="font-mono text-sm font-bold text-slate-200">
                {todayRecord ? formatTimeInTimezone(todayRecord.checkIn, staff.timezone) : '--:--'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                CHECK-OUT TIME
              </span>
              <span className="font-mono text-sm font-bold text-slate-200">
                {todayRecord?.checkOut ? formatTimeInTimezone(todayRecord.checkOut, staff.timezone) : '--:--'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
                <Timer className="h-3 w-3 text-[#2384ba]" />
                <span>WORKING DURATION</span>
              </span>
              <span className={`font-mono text-sm font-bold ${isWorking ? 'text-emerald-400' : 'text-slate-200'}`}>
                {formatElapsed(elapsedSeconds)}
              </span>
            </div>
          </div>

          {/* Break Allowance & Live Awareness Meter */}
          {(isWorking || isOnBreak || isCheckedOut) && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold text-[11px] uppercase">
                  <Utensils className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Flexible Daily Break Allowance</span>
                </div>
                <span className={isBreakExceeded ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {totalBreakTakenMinutes}m / {totalBreakAllowed}m used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full transition-all duration-500 ${
                    isBreakExceeded ? 'bg-rose-500' : breakPercentage > 75 ? 'bg-amber-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, breakPercentage)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Staff can take lunch/tea breaks anytime during shift</span>
                <span>{todayRecord?.breakCount || 0} break session(s) logged</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Big Interactive Punch Station Buttons */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5">
          {!todayRecord && (
            <button
              onClick={handleCheckIn}
              disabled={punchingIn || Boolean(unclosedRecord)}
              className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-[#2384ba] hover:from-emerald-400 hover:to-[#1f73a3] text-slate-950 font-mono font-black text-base uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {punchingIn ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>RECORDING CHECK-IN...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
                  <span>PUNCH IN (START SHIFT)</span>
                </>
              )}
            </button>
          )}

          {/* When Checked in and Shift Active */}
          {(isWorking || isOnBreak) && (
            <div className="space-y-3">
              {/* Take Break / Resume Shift Button */}
              <button
                onClick={handleToggleBreak}
                disabled={togglingBreak}
                className={`w-full py-4 px-6 rounded-2xl font-mono font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg ${
                  isOnBreak
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-cyan-500/10'
                }`}
              >
                {togglingBreak ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    <span>SYNCING BREAK STATUS...</span>
                  </>
                ) : isOnBreak ? (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    <span>RESUME SHIFT (END BREAK)</span>
                  </>
                ) : (
                  <>
                    <Coffee className="h-5 w-5 text-cyan-400" />
                    <span>TAKE BREAK (LUNCH / TEA)</span>
                  </>
                )}
              </button>

              {/* Punch Out Button */}
              <button
                onClick={() => setShowCheckoutNoteModal(true)}
                disabled={punchingOut}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 hover:from-rose-600 hover:to-amber-600 text-white font-mono font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:scale-[1.02] flex items-center justify-center space-x-2.5"
              >
                <LogOut className="h-5 w-5" />
                <span>PUNCH OUT (END SHIFT)</span>
              </button>
            </div>
          )}

          {isCheckedOut && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center space-y-2">
              <div className="inline-flex p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="font-mono text-sm font-bold text-white uppercase">Today's Punch Completed</h4>
              <p className="text-slate-400 text-xs font-sans">
                You logged {todayRecord?.totalWorkingMinutes ? Math.floor(todayRecord.totalWorkingMinutes / 60) : 0}h{' '}
                {(todayRecord?.totalWorkingMinutes || 0) % 60}m of work & {todayRecord?.breakMinutes || 0}m break today.
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-[11px] font-mono text-slate-400 text-center">
            Standard shift: 08 Hours • Breaks are flexible anytime
          </div>
        </div>
      </div>

      {/* Motivational Quote Banner */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-sm">
          <Quote className="h-5 w-5 text-[#2384ba] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-slate-200 text-xs italic font-sans">
              "{todayRecord?.punchQuote || activeQuote.quote}"
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
              <span className="text-[#2384ba] font-semibold">{activeQuote.author}</span>
              {activeQuote.role && <span>• {activeQuote.role}</span>}
              <span className="px-1.5 py-0.5 rounded bg-white/5 uppercase text-[9px]">
                {activeQuote.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Note Modal */}
      {showCheckoutNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white font-display mb-2 flex items-center space-x-2">
              <LogOut className="h-5 w-5 text-rose-400" />
              <span>Confirm Check-Out</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mb-4">
              You are checking out at {currentClock} ({tzBadge}). You can optionally leave a note detailing accomplishments or overtime.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Checkout Note / Work Summary (Optional)
              </label>
              <textarea
                rows={3}
                value={checkoutNote}
                onChange={(e) => setCheckoutNote(e.target.value)}
                placeholder="e.g., Completed API optimization and deployed to staging."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCheckoutNoteModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckOut}
                disabled={punchingOut}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {punchingOut ? 'Checking Out...' : 'Confirm Check-Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
