'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Calendar,
  Shield,
  Zap,
  Flame,
  Coffee,
  Database,
  RefreshCw,
  Sparkles,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  X,
  Info,
  Timer,
  Utensils,
} from 'lucide-react';
import {
  OfficeTimingSettings,
  DEFAULT_OFFICE_SETTINGS,
  updateOfficeSettings,
  subscribeToOfficeSettings,
} from '@/lib/officeSettingsService';
import {
  ShiftDefinition,
  subscribeToShifts,
  createOrUpdateShift,
  deleteShift,
  DEFAULT_OFFICE_LOCATIONS,
  INITIAL_DEFAULT_SHIFTS,
} from '@/lib/shiftService';
import { SUPPORTED_TIMEZONES, DEFAULT_TIMEZONE, getTimezoneBadge } from '@/lib/timezoneUtils';
import { CustomTimePicker } from '@/components/ui/CustomTimePicker';

interface OfficeSettingsViewProps {
  adminEmail: string;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function OfficeSettingsView({ adminEmail }: OfficeSettingsViewProps) {
  const [settings, setSettings] = useState<OfficeTimingSettings>(DEFAULT_OFFICE_SETTINGS);
  const [shifts, setShifts] = useState<ShiftDefinition[]>(INITIAL_DEFAULT_SHIFTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seedingFirebase, setSeedingFirebase] = useState(false);
  const [notice, setNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Shift Modal State
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftDefinition | null>(null);
  const [shiftFormData, setShiftFormData] = useState<Partial<ShiftDefinition>>({
    name: '',
    officeLocation: 'Kerala / Kochi Office',
    startTime: '09:00',
    endTime: '18:00',
    timezone: 'Asia/Kolkata',
    standardHours: 8,
    gracePeriodMinutes: 15,
    breakDurationMinutes: 60,
    breakStartTime: '13:00',
    breakEndTime: '14:00',
    isBreakPaid: true,
    overtimeThresholdHours: 8.0,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    isDefault: false,
  });

  useEffect(() => {
    const unsubSettings = subscribeToOfficeSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    const unsubShifts = subscribeToShifts((sList) => {
      setShifts(sList);
    });

    return () => {
      unsubSettings();
      unsubShifts();
    };
  }, []);

  const handleOpenAddShift = () => {
    setEditingShift(null);
    setShiftFormData({
      name: 'Kerala Day Shift',
      officeLocation: 'Kerala / Kochi Office',
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'Asia/Kolkata',
      standardHours: 8,
      gracePeriodMinutes: 15,
      breakDurationMinutes: 60,
      breakStartTime: '13:00',
      breakEndTime: '14:00',
      isBreakPaid: true,
      overtimeThresholdHours: 8.0,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isDefault: false,
    });
    setErrorMsg('');
    setIsShiftModalOpen(true);
  };

  const handleOpenEditShift = (shift: ShiftDefinition) => {
    setEditingShift(shift);
    setShiftFormData({
      ...shift,
      breakDurationMinutes: shift.breakDurationMinutes ?? 60,
      breakStartTime: shift.breakStartTime || '13:00',
      breakEndTime: shift.breakEndTime || '14:00',
      isBreakPaid: shift.isBreakPaid ?? true,
    });
    setErrorMsg('');
    setIsShiftModalOpen(true);
  };

  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const res = await createOrUpdateShift(
        { ...shiftFormData, id: editingShift?.id },
        adminEmail || 'admin@arcanum.ae'
      );
      if (res.success && res.shift) {
        const saved = res.shift;
        setShifts((prev) => {
          const exists = prev.some((s) => s.id === saved.id);
          if (exists) {
            return prev.map((s) => (s.id === saved.id ? saved : s));
          }
          return [saved, ...prev];
        });
        setNotice(
          editingShift
            ? `Shift "${shiftFormData.name}" updated successfully. Future punch-ins will use this timing without affecting previous historical punches.`
            : `New Shift "${shiftFormData.name}" created and saved to Firebase.`
        );
        setIsShiftModalOpen(false);
      } else {
        setErrorMsg(res.error || 'Failed to save shift.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShift = async (shiftId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the shift "${name}"?`)) return;
    try {
      const res = await deleteShift(shiftId);
      if (res.success) {
        setShifts((prev) => prev.filter((s) => s.id !== shiftId));
        setNotice(`Shift "${name}" removed.`);
      }
    } catch (e) {}
  };

  const handleToggleDay = (day: string) => {
    const currentDays = settings.workingDays || [];
    if (currentDays.includes(day)) {
      setSettings({ ...settings, workingDays: currentDays.filter((d) => d !== day) });
    } else {
      setSettings({ ...settings, workingDays: [...currentDays, day] });
    }
  };

  const handleToggleShiftDay = (day: string) => {
    const currentDays = shiftFormData.workingDays || [];
    if (currentDays.includes(day)) {
      setShiftFormData({ ...shiftFormData, workingDays: currentDays.filter((d) => d !== day) });
    } else {
      setShiftFormData({ ...shiftFormData, workingDays: [...currentDays, day] });
    }
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setNotice('');

    try {
      const res = await updateOfficeSettings(settings, adminEmail || 'admin@arcanum.ae');
      if (res.success) {
        setSettings({ ...settings });
        setNotice('Default office timings & shift rules successfully saved to Firebase Firestore.');
      } else {
        setErrorMsg(res.error || 'Failed to save office settings.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notice Alerts */}
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg shadow-emerald-500/10">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-emerald-400 font-mono text-xs">
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center space-x-2.5">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center space-x-2">
            <Settings className="h-5 w-5 text-[#2384ba]" />
            <span>Location Shifts & Office Timing Configuration</span>
          </h2>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Configure shifts, shift hours, lunch breaks, and grace periods for Kerala, Dubai, and regional offices.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddShift}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#2384ba]/20"
        >
          <Plus className="h-4 w-4" />
          <span>Add Location Shift</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* SECTION 1: CONFIGURED OFFICE SHIFTS GRID (KERALA, DUBAI, ETC) */}
      {/* ============================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#2384ba] uppercase tracking-wider font-semibold">
            <Clock className="h-4 w-4" />
            <span>Configured Office Shifts ({shifts.length})</span>
          </div>

          <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono flex items-center space-x-2">
            <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>Shift modifications apply strictly to future punches without modifying past records.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl space-y-3 relative group hover:border-[#2384ba]/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#2384ba]/20 text-[#2384ba] font-mono text-[10px] font-bold uppercase tracking-wider">
                      {shift.officeLocation}
                    </span>
                    <h4 className="text-sm font-bold text-white font-display mt-1">
                      {shift.name}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditShift(shift)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Edit Shift"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    {shifts.length > 1 && (
                      <button
                        onClick={() => handleDeleteShift(shift.id, shift.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Shift"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Time & Break Details */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1.5 font-mono text-xs mt-3">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Working Hours:</span>
                    <span className="text-emerald-400 font-bold">
                      {shift.startTime} — {shift.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Lunch / Total Break:</span>
                    <span className="text-cyan-300 font-bold">
                      {shift.breakDurationMinutes || 60} Mins ({shift.breakStartTime || '13:00'} - {shift.breakEndTime || '14:00'})
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Timezone:</span>
                    <span className="text-white">{shift.timezone}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Standard Duration:</span>
                    <span className="text-white">{shift.standardHours} Hours</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Late Grace Period:</span>
                    <span className="text-amber-300">{shift.gracePeriodMinutes} Mins</span>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div className="flex flex-wrap gap-1 font-mono text-[10px] pt-1">
                {(shift.workingDays || []).map((d) => (
                  <span key={d} className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {d.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* SECTION 2: GLOBAL DEFAULT TIMING & BREAK RULES */}
      {/* ============================================================= */}
      <form onSubmit={handleSaveGlobalSettings} className="space-y-6 font-sans text-xs">
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl space-y-5">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#2384ba] uppercase tracking-wider font-semibold border-b border-white/10 pb-3">
            <Globe className="h-4 w-4" />
            <span>Global Company Office Timing & Break Defaults</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Work Start Time with CustomTimePicker */}
            <CustomTimePicker
              label="Default Work Start Time"
              required
              value={settings.workStartTime || '09:00'}
              onChange={(val) => setSettings({ ...settings, workStartTime: val })}
              quickPresets={['08:00', '08:30', '09:00', '09:30', '10:00']}
            />

            {/* Work End Time with CustomTimePicker */}
            <CustomTimePicker
              label="Default Work End Time"
              required
              value={settings.workEndTime || '18:00'}
              onChange={(val) => setSettings({ ...settings, workEndTime: val })}
              quickPresets={['17:00', '17:30', '18:00', '18:30', '19:00']}
            />

            {/* Standard Daily Hours */}
            <div>
              <label className="block font-mono uppercase text-slate-300 mb-1.5">
                Standard Daily Hours
              </label>
              <input
                type="number"
                min={4}
                max={12}
                step={0.5}
                value={settings.standardWorkHours || 8}
                onChange={(e) => setSettings({ ...settings, standardWorkHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#2384ba]"
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Standard shift duration excluding unpaid breaks
              </span>
            </div>

            {/* Total Break Duration */}
            <div>
              <label className="block font-mono uppercase text-cyan-300 mb-1.5 flex items-center space-x-1">
                <Utensils className="h-3.5 w-3.5 text-cyan-400" />
                <span>Total Break Allowed (Minutes) *</span>
              </label>
              <input
                type="number"
                min={15}
                max={180}
                step={5}
                value={settings.breakDurationMinutes ?? 60}
                onChange={(e) => setSettings({ ...settings, breakDurationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Total daily break allowance (default 60 mins)
              </span>
            </div>

            {/* Break Start Time */}
            <CustomTimePicker
              label="Standard Lunch Break Start"
              value={settings.breakStartTime || '13:00'}
              onChange={(val) => setSettings({ ...settings, breakStartTime: val })}
              quickPresets={['12:00', '12:30', '13:00', '13:30', '14:00']}
            />

            {/* Break End Time */}
            <CustomTimePicker
              label="Standard Lunch Break End"
              value={settings.breakEndTime || '14:00'}
              onChange={(val) => setSettings({ ...settings, breakEndTime: val })}
              quickPresets={['13:00', '13:30', '14:00', '14:30', '15:00']}
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#2384ba]/20 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Global Timing & Break Defaults'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* ============================================================= */}
      {/* ADD / EDIT SHIFT MODAL */}
      {/* ============================================================= */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-[#0f172a]/85 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-slate-900/80 backdrop-blur border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {editingShift ? `Edit Shift (${editingShift.name})` : 'Create Location Shift'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Configure shift hours & lunch break for Kerala or regional hubs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="p-6 overflow-y-auto space-y-4 font-sans text-xs flex-1">
              {editingShift && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
                  ✓ Note: Modifying this shift will apply to <strong>future punches only</strong>. Past attendance records will remain 100% untouched and historically accurate.
                </div>
              )}

              <div className="space-y-4">
                {/* Shift Name */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    SHIFT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.name || ''}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, name: e.target.value })}
                    placeholder="e.g. Kerala General Day Shift"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Office Hub Location */}
                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1 flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-[#2384ba]" />
                      <span>OFFICE LOCATION HUB *</span>
                    </label>
                    <select
                      value={shiftFormData.officeLocation || 'Kerala / Kochi Office'}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, officeLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                    >
                      {DEFAULT_OFFICE_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1 flex items-center space-x-1">
                      <Globe className="h-3.5 w-3.5 text-[#2384ba]" />
                      <span>WORKING TIMEZONE *</span>
                    </label>
                    <select
                      value={shiftFormData.timezone || 'Asia/Kolkata'}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, timezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                    >
                      {SUPPORTED_TIMEZONES.map((tz) => (
                        <option key={tz.id} value={tz.id}>
                          {tz.label} ({tz.offset})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time with CustomTimePicker */}
                  <CustomTimePicker
                    label="Shift Start Time"
                    required
                    value={shiftFormData.startTime || '09:00'}
                    onChange={(val) => setShiftFormData({ ...shiftFormData, startTime: val })}
                    quickPresets={['08:00', '08:30', '09:00', '09:30', '18:00']}
                  />

                  {/* End Time with CustomTimePicker */}
                  <CustomTimePicker
                    label="Shift End Time"
                    required
                    value={shiftFormData.endTime || '18:00'}
                    onChange={(val) => setShiftFormData({ ...shiftFormData, endTime: val })}
                    quickPresets={['17:00', '17:30', '18:00', '18:30', '03:00']}
                  />

                  {/* Total Break Duration */}
                  <div>
                    <label className="block font-mono uppercase text-cyan-300 mb-1 flex items-center space-x-1">
                      <Utensils className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Total Break Allowed (Minutes)</span>
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={180}
                      step={5}
                      value={shiftFormData.breakDurationMinutes ?? 60}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, breakDurationMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Late Grace Period */}
                  <div>
                    <label className="block font-mono uppercase text-amber-300 mb-1">
                      LATE GRACE PERIOD (MINUTES)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={shiftFormData.gracePeriodMinutes ?? 15}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, gracePeriodMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-amber-500/30 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Break Start Time */}
                  <CustomTimePicker
                    label="Lunch / Break Start"
                    value={shiftFormData.breakStartTime || '13:00'}
                    onChange={(val) => setShiftFormData({ ...shiftFormData, breakStartTime: val })}
                    quickPresets={['12:30', '13:00', '13:30', '22:00']}
                  />

                  {/* Break End Time */}
                  <CustomTimePicker
                    label="Lunch / Break End"
                    value={shiftFormData.breakEndTime || '14:00'}
                    onChange={(val) => setShiftFormData({ ...shiftFormData, breakEndTime: val })}
                    quickPresets={['13:30', '14:00', '14:30', '23:00']}
                  />
                </div>

                {/* Working Days */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-2">
                    ACTIVE WORKING DAYS FOR THIS SHIFT
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DAYS.map((day) => {
                      const isSelected = (shiftFormData.workingDays || []).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleShiftDay(day)}
                          className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
                            isSelected
                              ? 'bg-[#2384ba] text-white border-[#2384ba]'
                              : 'bg-slate-900 text-slate-400 border-white/10'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#2384ba]/20 disabled:opacity-50"
                >
                  {saving ? 'Saving Shift...' : editingShift ? 'Update Shift' : 'Create Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
