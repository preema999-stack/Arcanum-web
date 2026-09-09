'use client';

import React, { useState } from 'react';
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
  ChevronRight,
  Info,
} from 'lucide-react';
import { AttendanceRecord } from '@/lib/attendanceService';
import { StaffMember } from '@/lib/staffService';
import { formatTimeInTimezone, formatMinutes, getTimezoneBadge } from '@/lib/timezoneUtils';

interface StaffAttendanceTableProps {
  records: AttendanceRecord[];
  staff: StaffMember;
  selectedMonth: string; // "YYYY-MM"
  onMonthChange: (newMonth: string) => void;
}

export function StaffAttendanceTable({
  records,
  staff,
  selectedMonth,
  onMonthChange,
}: StaffAttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.attendanceDate.includes(searchTerm) ||
      (r.checkoutNote && r.checkoutNote.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'admin_edited' ? r.adminEdited : r.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = [
      'Attendance Date',
      'Staff ID',
      'Staff Name',
      'Timezone',
      'Check-In Time',
      'Check-Out Time',
      'Total Working Minutes',
      'Working Hours',
      'Overtime Minutes',
      'Status',
      'Admin Edited',
      'Checkout Note',
    ];

    const rows = filteredRecords.map((r) => [
      r.attendanceDate,
      r.staffId,
      `"${r.staffName.replace(/"/g, '""')}"`,
      r.timezone,
      formatTimeInTimezone(r.checkIn, staff.timezone),
      r.checkOut ? formatTimeInTimezone(r.checkOut, staff.timezone) : 'N/A',
      r.totalWorkingMinutes || 0,
      formatMinutes(r.totalWorkingMinutes || 0),
      r.overtimeMinutes || 0,
      r.status,
      r.adminEdited ? 'YES' : 'NO',
      `"${(r.checkoutNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Arcanum_Attendance_${staff.name.replace(/\s+/g, '_')}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tzBadge = getTimezoneBadge(staff.timezone);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-6 overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-[#2384ba] uppercase tracking-wider mb-1">
            <Calendar className="h-4 w-4" />
            <span>MONTHLY ATTENDANCE ARCHIVE</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Personal Attendance Ledger ({tzBadge})
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Picker */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
            <span className="text-slate-400 text-xs font-mono">MONTH:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-mono transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#2384ba]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by date (YYYY-MM-DD) or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#2384ba]"
          >
            <option value="all">All Records ({records.length})</option>
            <option value="working">Currently Working</option>
            <option value="checked_out">Checked Out</option>
            <option value="overtime">Overtime Sessions</option>
            <option value="missing_checkout">Missing Checkout</option>
            <option value="admin_edited">Admin Adjusted</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Check-In ({tzBadge})</th>
              <th className="py-3.5 px-4">Check-Out ({tzBadge})</th>
              <th className="py-3.5 px-4">Total Duration</th>
              <th className="py-3.5 px-4">Overtime</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Notes & Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-mono text-xs">
                  No attendance records found for this period.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const isWorking = r.status === 'working';
                const isOvertime = (r.overtimeMinutes || 0) > 0;
                const isMissing = r.status === 'missing_checkout';

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td className="py-4 px-4 font-mono font-medium text-white">
                      {r.attendanceDate}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{formatTimeInTimezone(r.checkIn, staff.timezone)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {r.checkOut ? (
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span>{formatTimeInTimezone(r.checkOut, staff.timezone)}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-semibold animate-pulse">In Progress</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-slate-200">
                      {formatMinutes(r.totalWorkingMinutes || 0)}
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {isOvertime ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                          <Flame className="h-3 w-3" />
                          <span>+{formatMinutes(r.overtimeMinutes)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">--</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {isWorking ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>WORKING</span>
                        </span>
                      ) : isMissing ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                          <AlertTriangle className="h-3 w-3" />
                          <span>MISSING PUNCH</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>CHECKED OUT</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      <div className="flex items-center space-x-2">
                        {r.adminEdited && (
                          <span
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-bold"
                            title={`Admin Adjusted: ${r.lastAdjustmentReason || 'Standard audit correction'}`}
                          >
                            <ShieldCheck className="h-3 w-3 text-indigo-400" />
                            <span>ADMIN EDITED</span>
                          </span>
                        )}
                        {r.checkoutNote ? (
                          <span className="truncate max-w-[150px] text-slate-300 font-sans" title={r.checkoutNote}>
                            {r.checkoutNote}
                          </span>
                        ) : (
                          <span className="text-slate-600">--</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Detail Drawer / Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#2384ba]" />
              <span>Session Details: {selectedRecord.attendanceDate}</span>
            </h4>

            <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-slate-500">STAFF:</span>
                <span className="text-white font-bold">{selectedRecord.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TIMEZONE:</span>
                <span>{selectedRecord.timezone} ({tzBadge})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CHECK-IN:</span>
                <span className="text-emerald-400">{formatTimeInTimezone(selectedRecord.checkIn, staff.timezone, { includeSeconds: true })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CHECK-OUT:</span>
                <span className="text-blue-400">
                  {selectedRecord.checkOut ? formatTimeInTimezone(selectedRecord.checkOut, staff.timezone, { includeSeconds: true }) : 'In Progress'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TOTAL DURATION:</span>
                <span className="text-white font-bold">{formatMinutes(selectedRecord.totalWorkingMinutes || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">OVERTIME:</span>
                <span className="text-amber-400 font-bold">{formatMinutes(selectedRecord.overtimeMinutes || 0)}</span>
              </div>
              {selectedRecord.adminEdited && (
                <div className="pt-2 border-t border-white/10 text-indigo-300 text-[11px]">
                  <strong>Admin Edit Note:</strong> {selectedRecord.lastAdjustmentReason || 'Record adjusted by administrator.'}
                </div>
              )}
              {selectedRecord.checkoutNote && (
                <div className="pt-2 border-t border-white/10 text-slate-300 text-[11px] font-sans">
                  <strong>Checkout Remark:</strong> {selectedRecord.checkoutNote}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
