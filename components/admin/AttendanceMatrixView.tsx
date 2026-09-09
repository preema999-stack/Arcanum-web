'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
  Edit3,
  Globe,
  Layers,
  ChevronRight,
  User,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  AttendanceRecord,
  getAllAttendanceMonthly,
  adminAdjustAttendance,
} from '@/lib/attendanceService';
import { StaffMember, getAllStaff } from '@/lib/staffService';
import {
  getCurrentMonthString,
  formatTimeInTimezone,
  formatMinutes,
  getTimezoneBadge,
  DEFAULT_TIMEZONE,
} from '@/lib/timezoneUtils';
import { CustomTimePicker } from '@/components/ui/CustomTimePicker';

interface AttendanceMatrixViewProps {
  adminEmail: string;
}

export function AttendanceMatrixView({ adminEmail }: AttendanceMatrixViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthString());
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStaffFilter, setSelectedStaffFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Admin Adjustment Modal
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editCheckInTime, setEditCheckInTime] = useState('');
  const [editCheckOutTime, setEditCheckOutTime] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editStatus, setEditStatus] = useState<any>('checked_out');
  const [adjusting, setAdjusting] = useState(false);
  const [notice, setNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Admin's own viewing timezone (e.g. UAE 'Asia/Dubai')
  const [adminViewTimezone, setAdminViewTimezone] = useState('Asia/Dubai');

  const loadData = async () => {
    setLoading(true);
    try {
      const [staff, attendance] = await Promise.all([
        getAllStaff(),
        getAllAttendanceMonthly(selectedMonth, selectedStaffFilter),
      ]);
      setStaffList(staff);
      setAttendanceRecords(attendance);
    } catch (err) {
      console.warn('[Attendance Matrix Load Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedStaffFilter]);

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setErrorMsg('');
    setEditReason('');
    setEditStatus(rec.status);

    // Extract HH:MM in staff's timezone for input controls
    try {
      const inDate = new Date(rec.checkIn);
      const inH = new Intl.DateTimeFormat('en-GB', { timeZone: rec.timezone || DEFAULT_TIMEZONE, hour: '2-digit', hour12: false }).format(inDate);
      const inM = new Intl.DateTimeFormat('en-GB', { timeZone: rec.timezone || DEFAULT_TIMEZONE, minute: '2-digit' }).format(inDate);
      setEditCheckInTime(`${inH}:${inM}`);
    } catch (e) {
      setEditCheckInTime('08:30');
    }

    if (rec.checkOut) {
      try {
        const outDate = new Date(rec.checkOut);
        const outH = new Intl.DateTimeFormat('en-GB', { timeZone: rec.timezone || DEFAULT_TIMEZONE, hour: '2-digit', hour12: false }).format(outDate);
        const outM = new Intl.DateTimeFormat('en-GB', { timeZone: rec.timezone || DEFAULT_TIMEZONE, minute: '2-digit' }).format(outDate);
        setEditCheckOutTime(`${outH}:${outM}`);
      } catch (e) {
        setEditCheckOutTime('17:30');
      }
    } else {
      setEditCheckOutTime('17:30');
    }
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    if (!editReason.trim()) {
      setErrorMsg('A valid reason for audit compliance is mandatory for all admin adjustments.');
      return;
    }

    setAdjusting(true);
    setErrorMsg('');

    try {
      // Reconstruct ISO strings
      const dateParts = editingRecord.attendanceDate.split('-').map(Number);
      const [inH, inM] = editCheckInTime.split(':').map(Number);
      const newCheckInIso = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], inH, inM, 0).toISOString();

      let newCheckOutIso: string | null = null;
      if (editCheckOutTime) {
        const [outH, outM] = editCheckOutTime.split(':').map(Number);
        newCheckOutIso = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], outH, outM, 0).toISOString();
      }

      const res = await adminAdjustAttendance({
        attendanceId: editingRecord.id,
        updatedValues: {
          checkIn: newCheckInIso,
          checkOut: newCheckOutIso,
          status: editStatus,
        },
        reason: editReason.trim(),
        adminEmail: adminEmail || 'admin@arcanum.ae',
      });

      if (res.success) {
        setNotice(`Attendance record for ${editingRecord.staffName} on ${editingRecord.attendanceDate} adjusted successfully.`);
        setEditingRecord(null);
        await loadData();
      } else {
        setErrorMsg(res.error || 'Adjustment failed.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Adjustment failed.');
    } finally {
      setAdjusting(false);
    }
  };

  const filteredRecords = attendanceRecords.filter((r) => {
    const matchesSearch =
      r.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.checkoutNote && r.checkoutNote.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'admin_edited' ? r.adminEdited : r.status === selectedStatusFilter);

    const matchesDate = !selectedDateFilter || r.attendanceDate === selectedDateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExportCsv = () => {
    const headers = [
      'Attendance Date',
      'Staff ID',
      'Staff Name',
      'Designation',
      'Staff Timezone',
      'Check-In (Staff TZ)',
      'Check-Out (Staff TZ)',
      'Check-In (Admin GST TZ)',
      'Check-Out (Admin GST TZ)',
      'Total Working Minutes',
      'Working Duration',
      'Overtime Minutes',
      'Status',
      'Admin Edited',
      'Last Adjustment Reason',
      'Checkout Note',
    ];

    const rows = filteredRecords.map((r) => [
      r.attendanceDate,
      r.staffId,
      `"${r.staffName.replace(/"/g, '""')}"`,
      `"${(r.designation || '').replace(/"/g, '""')}"`,
      r.timezone,
      formatTimeInTimezone(r.checkIn, r.timezone),
      r.checkOut ? formatTimeInTimezone(r.checkOut, r.timezone) : 'N/A',
      formatTimeInTimezone(r.checkIn, adminViewTimezone),
      r.checkOut ? formatTimeInTimezone(r.checkOut, adminViewTimezone) : 'N/A',
      r.totalWorkingMinutes || 0,
      formatMinutes(r.totalWorkingMinutes || 0),
      r.overtimeMinutes || 0,
      r.status,
      r.adminEdited ? 'YES' : 'NO',
      `"${(r.lastAdjustmentReason || '').replace(/"/g, '""')}"`,
      `"${(r.checkoutNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Arcanum_Monthly_Attendance_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Notice */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-[#2384ba]" />
            <span>Monthly Attendance Matrix & Query Master</span>
          </h2>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Query historical records by month/year, staff, or date with timezone preservation (IST default) and Admin adjustment audit privileges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2">
            <span className="text-slate-400 text-xs font-mono">MONTH:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Admin Timezone Reference Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono">
            <Globe className="h-3.5 w-3.5 text-[#2384ba]" />
            <span className="text-slate-400">ADMIN VIEW:</span>
            <select
              value={adminViewTimezone}
              onChange={(e) => setAdminViewTimezone(e.target.value)}
              className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
            >
              <option value="Asia/Dubai" className="bg-slate-900">UAE (GST +04:00)</option>
              <option value="Europe/London" className="bg-slate-900">UK / London (GMT)</option>
              <option value="Europe/Berlin" className="bg-slate-900">Europe / Berlin (CET)</option>
              <option value="America/New_York" className="bg-slate-900">US / New York (ET)</option>
              <option value="Asia/Kolkata" className="bg-slate-900">India (IST +05:30)</option>
            </select>
          </div>

          {/* Sync / Refresh Button */}
          <button
            onClick={() => {
              loadData();
              setNotice('Synchronized live attendance data with Firebase Firestore.');
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-cyan-300 text-xs font-mono transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Firestore</span>
          </button>

          {/* CSV Download */}
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-mono transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#2384ba]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff name, ID, or remarks..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
          />
        </div>

        {/* Staff Member Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#2384ba]"
          >
            <option value="all">All Staff Members ({staffList.length})</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#2384ba]"
          >
            <option value="all">All Statuses ({attendanceRecords.length})</option>
            <option value="working">🟢 Currently Working</option>
            <option value="checked_out">🔵 Checked Out</option>
            <option value="overtime">🟣 Overtime Sessions</option>
            <option value="missing_checkout">🟡 Missing Checkout</option>
            <option value="admin_edited">🛡️ Admin Adjusted Records</option>
          </select>
        </div>

        {/* Specific Date Filter */}
        <div>
          <input
            type="date"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            placeholder="Specific Date"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#2384ba] cursor-pointer"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/60">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Check-In (Staff TZ)</th>
                <th className="py-3.5 px-4">Check-Out (Staff TZ)</th>
                <th className="py-3.5 px-4">Admin Reference ({getTimezoneBadge(adminViewTimezone)})</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Overtime</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-mono text-xs">
                    No attendance records match the selected query criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isWorking = r.status === 'working';
                  const isOvertime = (r.overtimeMinutes || 0) > 0;
                  const isMissing = r.status === 'missing_checkout';
                  const staffTzBadge = getTimezoneBadge(r.timezone);

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Staff Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/15 bg-slate-800 shrink-0">
                            {r.staffPhotoUrl ? (
                              <img src={r.staffPhotoUrl} alt={r.staffName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-[10px]">
                                {r.staffName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{r.staffName}</span>
                              {r.adminEdited && (
                                <span
                                  className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-mono font-bold"
                                  title={`Admin Edited: ${r.lastAdjustmentReason || 'Audit correction'}`}
                                >
                                  EDITED
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {r.staffId} • {r.designation || 'Staff'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                        {r.attendanceDate}
                      </td>

                      {/* Check-In in Staff TZ */}
                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="font-bold">{formatTimeInTimezone(r.checkIn, r.timezone)}</span>
                          <span className="text-[10px] text-slate-500">({staffTzBadge})</span>
                        </div>
                      </td>

                      {/* Check-Out in Staff TZ */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {r.checkOut ? (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span className="font-bold">{formatTimeInTimezone(r.checkOut, r.timezone)}</span>
                            <span className="text-[10px] text-slate-500">({staffTzBadge})</span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-semibold animate-pulse">In Progress</span>
                        )}
                      </td>

                      {/* Admin Reference Time */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        <div>In: {formatTimeInTimezone(r.checkIn, adminViewTimezone)}</div>
                        {r.checkOut && <div>Out: {formatTimeInTimezone(r.checkOut, adminViewTimezone)}</div>}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {formatMinutes(r.totalWorkingMinutes || 0)}
                      </td>

                      {/* Overtime */}
                      <td className="py-3.5 px-4 font-mono">
                        {isOvertime ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-[11px]">
                            <Flame className="h-3 w-3" />
                            <span>+{formatMinutes(r.overtimeMinutes)}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">--</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isWorking ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>WORKING</span>
                          </span>
                        ) : isMissing ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                            <AlertTriangle className="h-3 w-3" />
                            <span>MISSING</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[10px]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>LOGGED</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#2384ba]/20 text-slate-300 hover:text-white border border-white/10 font-mono text-xs transition-colors inline-flex items-center space-x-1.5"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#2384ba]" />
                          <span>Adjust</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Adjustment Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-[#2384ba]" />
                <h3 className="text-base font-bold font-display">
                  Admin Attendance Adjustment & Audit
                </h3>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 p-3.5 rounded-xl bg-slate-900 border border-white/5 font-mono text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">STAFF:</span>
                <span className="text-white font-bold">{editingRecord.staffName} ({editingRecord.staffId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RECORD DATE:</span>
                <span className="text-white">{editingRecord.attendanceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TIMEZONE:</span>
                <span className="text-[#2384ba]">{editingRecord.timezone}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveAdjustment} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <CustomTimePicker
                  label={`Check-In Time (${getTimezoneBadge(editingRecord.timezone)})`}
                  required
                  value={editCheckInTime}
                  onChange={(val) => setEditCheckInTime(val)}
                  quickPresets={['08:00', '08:30', '09:00', '09:30', '10:00']}
                />

                <CustomTimePicker
                  label={`Check-Out Time (${getTimezoneBadge(editingRecord.timezone)})`}
                  value={editCheckOutTime}
                  onChange={(val) => setEditCheckOutTime(val)}
                  quickPresets={['17:00', '17:30', '18:00', '18:30', '19:00']}
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-300 mb-1">
                  Attendance Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                >
                  <option value="checked_out">Checked Out (Completed)</option>
                  <option value="overtime">Overtime Shift</option>
                  <option value="working">Currently Working</option>
                  <option value="missing_checkout">Missing Checkout</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-amber-300 mb-1">
                  Mandatory Audit Reason for Adjustment *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Corrected staff forgot to checkout after overtime client handover."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-amber-500/30 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  This reason will be permanently recorded in the immutable audit log and flagged as 'Admin Edited'.
                </span>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2.5 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {adjusting ? 'Applying...' : 'Apply & Log Audit Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
