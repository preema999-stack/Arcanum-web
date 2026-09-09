'use client';

import React, { useState, useEffect } from 'react';
import {
  Monitor,
  LayoutGrid,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Phone,
  Mail,
  Cake,
  Globe,
  Radio,
  User,
  Shield,
  Search,
  RefreshCw,
  Sparkles,
  Zap,
  Coffee,
} from 'lucide-react';
import { StaffMember, getAllStaff, subscribeToStaff } from '@/lib/staffService';
import {
  AttendanceRecord,
  subscribeToTodayAttendance,
} from '@/lib/attendanceService';
import {
  getTodayDateString,
  formatTimeInTimezone,
  calculateWorkingMinutes,
  getTimezoneBadge,
  isBirthdayToday,
} from '@/lib/timezoneUtils';

export function OfficeDeskLiveView() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<{
    staff: StaffMember;
    record?: AttendanceRecord;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'floorplan' | 'grid'>('floorplan');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [now, setNow] = useState(Date.now());

  // Increment live seconds every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubStaff = subscribeToStaff((list) => {
      setStaffList(list);
      setLoading(false);
    });

    const unsubAttendance = subscribeToTodayAttendance((records) => {
      setTodayRecords(records);
    });

    return () => {
      unsubStaff();
      unsubAttendance();
    };
  }, []);

  // Compute live presence for each staff
  const staffPresence = staffList.map((staff, idx) => {
    const record = todayRecords.find((r) => r.staffId === staff.id);
    const isOnBreak = Boolean(record && record.status === 'on_break');
    const isWorking = Boolean(record && record.checkIn && !record.checkOut && !isOnBreak);
    const isCheckedOut = Boolean(record && record.checkOut);
    const isMissing = Boolean(record && record.status === 'missing_checkout');
    
    let liveDurationStr = '00h 00m';
    let isOvertime = false;

    if ((isWorking || isOnBreak) && record?.checkIn) {
      const start = new Date(record.checkIn).getTime();
      const diffMinutes = Math.max(0, Math.floor((now - start) / (1000 * 60)));
      const hrs = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      liveDurationStr = `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
      isOvertime = diffMinutes > 8 * 60;
    } else if (isCheckedOut && record?.totalWorkingMinutes) {
      const hrs = Math.floor(record.totalWorkingMinutes / 60);
      const mins = record.totalWorkingMinutes % 60;
      liveDurationStr = `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
      isOvertime = (record.overtimeMinutes || 0) > 0;
    }

    return {
      staff,
      record,
      isWorking,
      isOnBreak,
      isCheckedOut,
      isMissing,
      isOvertime,
      liveDurationStr,
      deskId: staff.deskNumber || `WS-${String(idx + 1).padStart(2, '0')}`,
    };
  });

  // Filter presence
  const filteredPresence = staffPresence.filter((p) => {
    const matchesSearch = (
      p.staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.staff.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.staff.officeLocation && p.staff.officeLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesLocation =
      locationFilter === 'all' ||
      (p.staff.officeLocation && p.staff.officeLocation.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesSearch && matchesLocation;
  });

  const onlineCount = staffPresence.filter((p) => p.isWorking).length;
  const offlineCount = staffPresence.filter((p) => !p.isWorking && p.isCheckedOut).length;
  const notCheckedInCount = staffPresence.filter((p) => !p.record).length;

  return (
    <div className="space-y-6">
      {/* Top Telemetry Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-[#2384ba] uppercase tracking-wider mb-1">
            <Radio className="h-4 w-4 animate-pulse text-emerald-400" />
            <span>LIVE OFFICE TELEMETRY STREAM</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display tracking-tight">
            Virtual Office Desk & Real-Time Presence
          </h2>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Dynamic representation of staff active at their workstation desks based on live check-in timestamps.
          </p>
        </div>

        {/* View Toggle & Summary */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Presence Pills */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl p-1.5 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{onlineCount} Online</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300">
              {offlineCount} Completed
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400">
              {notCheckedInCount} Away
            </span>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('floorplan')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                viewMode === 'floorplan'
                  ? 'bg-[#2384ba] text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Floorplan</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#2384ba] text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Location Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter staff by name, designation, desk, or office hub..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
          />
        </div>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
        >
          <option value="all">All Office Hubs</option>
          <option value="kerala">Kerala / Kochi Hub Only</option>
          <option value="dubai">Dubai HQ Only</option>
          <option value="london">London Hub Only</option>
        </select>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIRTUAL FLOORPLAN DESK VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'floorplan' && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle blueprint grid effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#2384ba_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          {/* Office Header Zone */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                  ARCANUM HEADQUARTERS & ENGINEERING LAB
                </span>
                <span className="text-sm font-bold text-white font-display">
                  Interactive Floorplan Desks
                </span>
              </div>
            </div>

            <div className="font-mono text-[11px] text-slate-400 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>At Desk</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Overtime</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span>Offline</span>
              </span>
            </div>
          </div>

          {/* Workstation Pods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
            {filteredPresence.map((item) => {
              const { staff, record, isWorking, isOnBreak, isCheckedOut, isOvertime, liveDurationStr, deskId } = item;
              const birthday = isBirthdayToday(staff.dob, staff.timezone);
              const tzBadge = getTimezoneBadge(staff.timezone);

              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff({ staff, record })}
                  className={`relative rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                    isWorking
                      ? isOvertime
                        ? 'bg-purple-950/30 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-900/90 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                      : isCheckedOut
                      ? 'bg-slate-900/60 border-blue-500/30'
                      : 'bg-slate-950/70 border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Desk Identifier Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold">
                      {deskId}
                    </span>

                    {/* Presence Status */}
                    {isOnBreak ? (
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold animate-pulse">
                        <span>☕ ON BREAK</span>
                      </span>
                    ) : isWorking ? (
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>AT DESK</span>
                      </span>
                    ) : isCheckedOut ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[10px]">
                        <span>SHIFT DONE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 font-mono text-[10px]">
                        <span>OFFLINE</span>
                      </span>
                    )}
                  </div>

                  {/* Virtual Desk Computer + Avatar */}
                  <div className="flex flex-col items-center text-center my-2">
                    {/* Glowing Avatar Frame */}
                    <div className="relative mb-3">
                      <div
                        className={`w-16 h-16 rounded-2xl overflow-hidden border-2 p-0.5 transition-all ${
                          isWorking
                            ? isOvertime
                              ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                              : 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            : 'border-white/20 grayscale'
                        }`}
                      >
                        <img
                          src={staff.photoUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Birthday Icon if today */}
                      {birthday && (
                        <div className="absolute -top-2 -right-2 p-1 bg-pink-500 rounded-full text-white shadow-md animate-bounce">
                          <Cake className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-sm font-display truncate max-w-[180px]">
                      {staff.name}
                    </h4>
                    <p className="text-[#2384ba] text-[11px] font-mono truncate max-w-[180px]">
                      {staff.designation}
                    </p>
                  </div>

                  {/* Punch Telemetry Footer */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Checked In:</span>
                      <span className="text-slate-200 font-semibold">
                        {record ? formatTimeInTimezone(record.checkIn, staff.timezone) : '--:--'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Working Time:</span>
                      <span className={`font-bold ${isWorking ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {liveDurationStr}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* GRID CARDS VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPresence.map((item) => {
            const { staff, record, isWorking, isOnBreak, isCheckedOut, liveDurationStr, deskId } = item;
            const tzBadge = getTimezoneBadge(staff.timezone);

            return (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff({ staff, record })}
                className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl hover:border-[#2384ba]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl overflow-hidden border-2 ${
                        isOnBreak
                          ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : isWorking
                          ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'border-white/10 grayscale'
                      }`}
                    >
                      <img src={staff.photoUrl} alt={staff.name} className="w-full h-full object-cover" />
                    </div>
                    {isOnBreak ? (
                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-slate-950" />
                    ) : isWorking && (
                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm font-display truncate">
                        {staff.name}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {deskId}
                      </span>
                    </div>
                    <div className="text-xs text-[#2384ba] font-mono truncate">{staff.designation}</div>

                    <div className="mt-2 text-[11px] font-mono space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">STATUS:</span>
                        <span className={isOnBreak ? 'text-amber-300 font-bold' : isWorking ? 'text-emerald-400' : 'text-slate-400'}>
                          {isOnBreak ? '☕ ON BREAK' : isWorking ? 'AT DESK' : isCheckedOut ? 'SHIFT DONE' : 'OFFLINE'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">DURATION:</span>
                        <span className={isWorking || isOnBreak ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          {liveDurationStr}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desk Quick View Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStaff.staff.photoUrl}
                  alt={selectedStaff.staff.name}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20"
                />
                <div>
                  <h3 className="text-base font-bold font-display">{selectedStaff.staff.name}</h3>
                  <div className="text-xs text-[#2384ba] font-mono">{selectedStaff.staff.designation}</div>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="p-1 text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-white/5 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">STAFF ID:</span>
                <span className="text-white font-bold">{selectedStaff.staff.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WORKSTATION:</span>
                <span className="text-white">{selectedStaff.staff.deskNumber || 'Desk-01'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PHONE:</span>
                <span>{selectedStaff.staff.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">EMERGENCY:</span>
                <span className="text-rose-400 font-bold">{selectedStaff.staff.emergencyPhone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DOB:</span>
                <span className="text-pink-300">{selectedStaff.staff.dob || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WORKING TIMEZONE:</span>
                <span className="text-[#2384ba]">{selectedStaff.staff.timezone}</span>
              </div>
              {selectedStaff.record?.punchQuote && (
                <div className="pt-2 border-t border-white/10 text-[11px] italic font-sans text-slate-300">
                  "{selectedStaff.record.punchQuote}"
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs"
              >
                Close Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
