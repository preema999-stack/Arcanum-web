'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  User,
  LogOut,
  Calendar,
  Clock,
  Sparkles,
  Cake,
  Shield,
  Building2,
  RefreshCw,
  Award,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { StaffMember, INITIAL_STAFF_SEEDS } from '@/lib/staffService';
import {
  AttendanceRecord,
  getTodayStaffRecord,
  checkUnclosedPreviousSession,
  getStaffAttendanceMonthly,
  calculateStaffKpis,
  StaffKpiSummary,
  subscribeToTodayAttendance,
} from '@/lib/attendanceService';
import {
  getCurrentMonthString,
  getTodayDateString,
  isBirthdayToday,
  getTimezoneBadge,
} from '@/lib/timezoneUtils';
import { StaffPunchWidget } from '@/components/staff/StaffPunchWidget';
import { MissingCheckoutModal } from '@/components/staff/MissingCheckoutModal';
import { BirthdayCelebrationModal } from '@/components/staff/BirthdayCelebrationModal';
import { StaffKpiCards } from '@/components/staff/StaffKpiCards';
import { StaffAttendanceTable } from '@/components/staff/StaffAttendanceTable';

export default function StaffDashboardPage() {
  const { user, staffProfile, loading: authLoading, logout, setMockStaffSession } = useAuth();
  const router = useRouter();

  // Active staff member
  const currentStaff: StaffMember | null = staffProfile;

  // Attendance state
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    getCurrentMonthString(staffProfile?.timezone || 'Asia/Kolkata')
  );
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [unclosedRecord, setUnclosedRecord] = useState<AttendanceRecord | null>(null);
  const [monthlyRecords, setMonthlyRecords] = useState<AttendanceRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [birthdayCelebratedOnce, setBirthdayCelebratedOnce] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user && !staffProfile) {
      router.push('/staff/login');
    }
  }, [user, staffProfile, authLoading, router]);

  // Load Data
  const loadStaffData = async () => {
    if (!currentStaff) return;
    setLoadingData(true);
    try {
      const todayRec = await getTodayStaffRecord(currentStaff.id, currentStaff.timezone);
      setTodayRecord(todayRec);

      const unclosed = await checkUnclosedPreviousSession(currentStaff.id, currentStaff.timezone);
      setUnclosedRecord(unclosed);

      const monthly = await getStaffAttendanceMonthly(currentStaff.id, selectedMonth);
      setMonthlyRecords(monthly);

      // Check if birthday today and trigger modal once
      if (isBirthdayToday(currentStaff.dob, currentStaff.timezone) && !birthdayCelebratedOnce) {
        setShowBirthdayModal(true);
        setBirthdayCelebratedOnce(true);
      }
    } catch (e) {
      console.warn('[Staff Dashboard Load Error]', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentStaff) {
      loadStaffData();
    }
  }, [currentStaff?.id, selectedMonth]);

  // Subscribe to today's real-time punches
  useEffect(() => {
    if (!currentStaff) return;
    const unsub = subscribeToTodayAttendance((todayList) => {
      const myToday = todayList.find((r) => r.staffId === currentStaff.id);
      if (myToday) {
        setTodayRecord(myToday);
      }
    }, getTodayDateString(currentStaff.timezone), currentStaff.timezone);

    return () => unsub();
  }, [currentStaff?.id, currentStaff?.timezone]);

  if (authLoading || (!staffProfile && typeof window !== 'undefined')) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex items-center space-x-3 font-mono text-sm text-[#2384ba]">
          <span className="h-4 w-4 rounded-full border-2 border-[#2384ba] border-t-transparent animate-spin" />
          <span>CONNECTING TO WORKSTATION...</span>
        </div>
      </main>
    );
  }

  if (!currentStaff) {
    return null;
  }

  const kpis: StaffKpiSummary = calculateStaffKpis(monthlyRecords, selectedMonth, currentStaff);
  const tzBadge = getTimezoneBadge(currentStaff.timezone);
  const hasBirthdayToday = isBirthdayToday(currentStaff.dob, currentStaff.timezone);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 font-sans relative overflow-x-hidden dark-technical-grid selection:bg-[#2384ba]/30 selection:text-[#2384ba] pb-24">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[700px] h-[400px] bg-[#2384ba]/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[170px] pointer-events-none rounded-full" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-2xl border-b border-white/10 py-4 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <Link href="/" className="flex items-center space-x-3 text-white group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#2384ba]/50 group-hover:shadow-[0_0_15px_rgba(35,132,186,0.3)]">
              <img src="/logo.png" alt="Arcanum IT Logo" className="h-full w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-base font-display text-white">ARCANUM</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">STAFF</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">ATTENDANCE WORKSTATION</span>
            </div>
          </Link>

          {/* Right Profile & Actions */}
          <div className="flex items-center space-x-4">
            {/* Birthday Badge button if today */}
            {hasBirthdayToday && (
              <button
                onClick={() => setShowBirthdayModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-mono text-xs font-bold animate-pulse hover:bg-pink-500/30 transition-all"
              >
                <Cake className="h-4 w-4 text-pink-400" />
                <span>Happy Birthday! 🎂</span>
              </button>
            )}

            {/* Profile Chip */}
            <div className="flex items-center space-x-3 p-1.5 pr-4 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-slate-800 shrink-0">
                <img
                  src={currentStaff.photoUrl}
                  alt={currentStaff.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>{currentStaff.name}</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-[#2384ba]/20 text-[#2384ba]">
                    {currentStaff.id}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                  {currentStaff.designation}
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={async () => {
                await logout();
                router.push('/staff/login');
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        {/* Punch Widget Card */}
        <StaffPunchWidget
          staff={currentStaff}
          todayRecord={todayRecord}
          unclosedRecord={unclosedRecord}
          onPunchUpdated={loadStaffData}
          onOpenMissingCheckoutModal={() => setShowMissingModal(true)}
        />

        {/* Staff Monthly KPI Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center space-x-2">
              <Award className="h-4 w-4 text-[#2384ba]" />
              <span>MONTHLY PERFORMANCE METRICS ({selectedMonth})</span>
            </h3>
            <button
              onClick={loadStaffData}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>
          <StaffKpiCards kpis={kpis} monthName={selectedMonth} />
        </div>

        {/* Staff Attendance History & Monthly Ledger */}
        <StaffAttendanceTable
          records={monthlyRecords}
          staff={currentStaff}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Missing Checkout Adjustment Modal */}
      {unclosedRecord && (
        <MissingCheckoutModal
          unclosedRecord={unclosedRecord}
          staff={currentStaff}
          isOpen={showMissingModal}
          onClose={() => setShowMissingModal(false)}
          onResolved={loadStaffData}
        />
      )}

      {/* Birthday Celebration Modal */}
      <BirthdayCelebrationModal
        staff={currentStaff}
        isOpen={showBirthdayModal}
        onClose={() => setShowBirthdayModal(false)}
      />
    </main>
  );
}
