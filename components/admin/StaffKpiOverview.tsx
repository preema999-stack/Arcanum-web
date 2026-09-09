'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Calendar,
  Zap,
} from 'lucide-react';
import { StaffMember, getAllStaff } from '@/lib/staffService';
import {
  AttendanceRecord,
  getAllAttendanceMonthly,
  calculateStaffKpis,
  StaffKpiSummary,
} from '@/lib/attendanceService';
import { getCurrentMonthString, formatMinutes } from '@/lib/timezoneUtils';

export function StaffKpiOverview() {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthString());
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [staff, attendance] = await Promise.all([
          getAllStaff(),
          getAllAttendanceMonthly(selectedMonth),
        ]);
        setStaffList(staff);
        setAttendanceRecords(attendance);
      } catch (e) {
        console.warn('[KPI Overview Load Error]', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedMonth]);

  // Compute KPIs per staff
  const staffKpiList: StaffKpiSummary[] = staffList.map((s) => {
    const staffRecords = attendanceRecords.filter((r) => r.staffId === s.id);
    return calculateStaffKpis(staffRecords, selectedMonth, s);
  });

  const totalCompanyHours = staffKpiList.reduce((acc, curr) => acc + curr.totalWorkingHours, 0);
  const totalCompanyOvertime = staffKpiList.reduce((acc, curr) => acc + curr.totalOvertimeHours, 0);
  const avgAttendance = staffKpiList.length > 0
    ? (staffKpiList.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / staffKpiList.length).toFixed(1)
    : '0.0';
  const totalLateArrivals = staffKpiList.reduce((acc, curr) => acc + curr.lateArrivalCount, 0);

  const filteredKpiList = staffKpiList.filter((k) =>
    k.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center space-x-2">
            <Award className="h-5 w-5 text-[#2384ba]" />
            <span>Staff KPIs & Performance Benchmarks</span>
          </h2>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Holistic analytics on attendance percentages, punctuality index, overtime contribution, and work hours.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2">
          <span className="text-slate-400 text-xs font-mono">PERIOD:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Metric Cards Top */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              TOTAL STAFF
            </span>
            <Users className="h-4 w-4 text-[#2384ba]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{staffList.length}</div>
          <div className="mt-1 text-[11px] font-mono text-emerald-400">All Active Profiles</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              AVG ATTENDANCE
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{avgAttendance}%</div>
          <div className="mt-1 text-[11px] font-mono text-slate-400">{selectedMonth} Benchmark</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              HOURS LOGGED
            </span>
            <Clock className="h-4 w-4 text-[#2384ba]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalCompanyHours.toFixed(1)} hrs</div>
          <div className="mt-1 text-[11px] font-mono text-slate-400">Company-wide output</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              OVERTIME DELIVERED
            </span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalCompanyOvertime.toFixed(1)} hrs</div>
          <div className="mt-1 text-[11px] font-mono text-amber-400">Over standard shifts</div>
        </div>
      </div>

      {/* Staff KPI Comparison Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-bold text-white font-display">
            Staff Performance & Punctuality Ledger
          </h3>
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2384ba]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/60">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Present Days</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Avg Daily Hours</th>
                <th className="py-3 px-4">Overtime</th>
                <th className="py-3 px-4">Late Arrivals</th>
                <th className="py-3 px-4">Missing Punches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredKpiList.map((k) => {
                const staff = staffList.find((s) => s.id === k.staffId);

                return (
                  <tr key={k.staffId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-slate-800 shrink-0">
                          {staff?.photoUrl && (
                            <img src={staff.photoUrl} alt={k.staffName} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white">{k.staffName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{k.staffId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {k.presentDays} / {k.totalWorkingDaysInMonth}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {k.attendancePercentage}%
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      {k.totalWorkingHours} hrs
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {k.avgWorkingHoursPerDay} hrs
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {k.totalOvertimeHours > 0 ? (
                        <span className="text-amber-400 font-bold">+{k.totalOvertimeHours} hrs</span>
                      ) : (
                        <span className="text-slate-600">0 hrs</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={k.lateArrivalCount > 0 ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                        {k.lateArrivalCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={k.missingCheckoutCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                        {k.missingCheckoutCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
