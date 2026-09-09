'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  AlertCircle,
  Mail,
  Calendar,
  Clock,
  Cake,
  Edit3,
  Trash2,
  CheckCircle2,
  Shield,
  Globe,
  Plus,
  X,
  Sparkles,
  Camera,
  KeyRound,
  Copy,
  Check,
  Dices,
  Eye,
  EyeOff,
  Building,
  MapPin,
} from 'lucide-react';
import {
  StaffMember,
  getAllStaff,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  subscribeToStaff,
  StaffCreateInput,
  generateRandomPassword,
} from '@/lib/staffService';
import {
  ShiftDefinition,
  subscribeToShifts,
  DEFAULT_OFFICE_LOCATIONS,
} from '@/lib/shiftService';
import { SUPPORTED_TIMEZONES, DEFAULT_TIMEZONE, isBirthdayUpcoming, isBirthdayToday, getTimezoneBadge } from '@/lib/timezoneUtils';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
];

export function StaffManagementView() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [shifts, setShifts] = useState<ShiftDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Partial<StaffCreateInput>>({
    name: '',
    email: '',
    password: '',
    designation: 'Software Engineer',
    department: 'Engineering',
    phone: '',
    emergencyPhone: '',
    dob: '1995-01-01',
    photoUrl: AVATAR_PRESETS[0],
    timezone: DEFAULT_TIMEZONE,
    officeLocation: 'Kerala / Kochi Office',
    shiftId: 'shift-kerala-day',
    shiftName: 'Kerala General Shift (09:00 - 18:00 IST)',
    status: 'active',
    joiningDate: new Date().toISOString().slice(0, 10),
    standardWorkHours: 8,
    deskNumber: '',
    sendEmailNotification: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Delete Confirmation
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Success Credential Card Modal
  const [provisionedCredentials, setProvisionedCredentials] = useState<{
    name: string;
    email: string;
    password?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubStaff = subscribeToStaff((list) => {
      setStaffList(list);
      setLoading(false);
    });
    const unsubShifts = subscribeToShifts((sList) => {
      setShifts(sList);
    });

    return () => {
      unsubStaff();
      unsubShifts();
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    const initialPass = generateRandomPassword();
    const defaultShift = shifts.find((s) => s.isDefault) || shifts[0];

    setFormData({
      name: '',
      email: '',
      password: initialPass,
      designation: 'Full-Stack Developer',
      department: 'Engineering',
      phone: '+91 ',
      emergencyPhone: '+91 ',
      dob: '1995-01-01',
      photoUrl: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      timezone: defaultShift?.timezone || DEFAULT_TIMEZONE,
      officeLocation: defaultShift?.officeLocation || 'Kerala / Kochi Office',
      shiftId: defaultShift?.id || 'shift-kerala-day',
      shiftName: defaultShift?.name || 'Kerala General Shift (09:00 - 18:00 IST)',
      status: 'active',
      joiningDate: new Date().toISOString().slice(0, 10),
      standardWorkHours: defaultShift?.standardHours || 8,
      deskNumber: `Desk-${String(Date.now()).slice(-2)}`,
      sendEmailNotification: false,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleGeneratePassword = () => {
    const pass = generateRandomPassword();
    setFormData((prev) => ({ ...prev, password: pass }));
  };

  const handleOpenEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleShiftSelection = (shiftId: string) => {
    const selected = shifts.find((s) => s.id === shiftId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        shiftId: selected.id,
        shiftName: selected.name,
        timezone: selected.timezone,
        officeLocation: selected.officeLocation,
        standardWorkHours: selected.standardHours,
      }));
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      if (editingStaff) {
        const res = await updateStaffMember(editingStaff.id, formData);
        if (res.success) {
          setNotice(`Staff member "${formData.name}" updated. Future punches will use the updated shift configuration without altering past records.`);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to update staff member.');
        }
      } else {
        const res = await createStaffMember(formData as StaffCreateInput);
        if (res.success) {
          setIsModalOpen(false);
          setNotice(`Staff member "${formData.name}" created successfully.`);
          if (res.credentials) {
            setProvisionedCredentials({
              name: formData.name || 'Staff Member',
              email: res.credentials.email,
              password: res.credentials.password || formData.password,
            });
          }
        } else {
          setErrorMsg(res.error || 'Failed to create staff member.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;
    try {
      const res = await deleteStaffMember(staffToDelete.id);
      if (res.success) {
        setNotice(`Staff member "${staffToDelete.name}" removed.`);
        setStaffToDelete(null);
      } else {
        setErrorMsg(res.error || 'Failed to delete staff member.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Delete operation failed.');
    }
  };

  const handleCopyCredentials = () => {
    if (!provisionedCredentials) return;
    const text = `Arcanum IT Staff Workstation Credentials:\nName: ${provisionedCredentials.name}\nLogin URL: http://localhost:3000/staff/login\nEmail: ${provisionedCredentials.email}\nPassword: ${provisionedCredentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.officeLocation && s.officeLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesLocation =
      locationFilter === 'all' ||
      (s.officeLocation && s.officeLocation.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg shadow-emerald-500/10">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice('')}
            className="text-emerald-400/80 hover:text-emerald-300 font-mono text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Query & Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, Kerala office, designation..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 font-sans focus:outline-none focus:border-[#2384ba] focus:ring-1 focus:ring-[#2384ba]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Office Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
          >
            <option value="all">All Office Hubs</option>
            <option value="kerala">Kerala / Kochi Hub</option>
            <option value="dubai">Dubai HQ</option>
            <option value="london">London Hub</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-[#2384ba]"
          >
            <option value="all">All Statuses ({staffList.length})</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Add Staff Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#2384ba]/20"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          <span className="h-5 w-5 border-2 border-[#2384ba] border-t-transparent animate-spin rounded-full inline-block mr-2" />
          LOADING STAFF DIRECTORY...
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-12 text-center backdrop-blur-xl">
          <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white font-display">No Staff Members Found</h3>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto mt-1 mb-4">
            {searchTerm || locationFilter !== 'all'
              ? 'No staff profiles match your search or office location filter.'
              : 'The staff directory is currently empty. Click "Add New Staff" to create your first team member and assign their Kerala or Dubai shift.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#2384ba] text-white font-mono text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create First Staff Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStaff.map((staff) => {
            const hasBirthdayToday = isBirthdayToday(staff.dob, staff.timezone);
            const isUpcomingBday = isBirthdayUpcoming(staff.dob, 7, staff.timezone);
            const tzBadge = getTimezoneBadge(staff.timezone);

            return (
              <div
                key={staff.id}
                className="group relative rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl hover:border-white/25 transition-all shadow-xl flex flex-col justify-between"
              >
                {/* Birthday Header Tag */}
                {hasBirthdayToday && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-between text-pink-300 text-[11px] font-mono font-bold animate-pulse">
                    <span className="flex items-center space-x-1.5">
                      <Cake className="h-3.5 w-3.5 text-pink-400" />
                      <span>BIRTHDAY TODAY! 🎉</span>
                    </span>
                    <span>{staff.dob}</span>
                  </div>
                )}

                {isUpcomingBday && !hasBirthdayToday && (
                  <div className="mb-3 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center space-x-1.5 text-amber-300 text-[10px] font-mono">
                    <Cake className="h-3 w-3 text-amber-400" />
                    <span>Upcoming Birthday: {staff.dob}</span>
                  </div>
                )}

                <div>
                  {/* Top Profile Strip */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative">
                        <img
                          src={staff.photoUrl}
                          alt={staff.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/15 shadow-md group-hover:scale-105 transition-transform"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                            staff.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-display group-hover:text-[#2384ba] transition-colors">
                          {staff.name}
                        </h4>
                        <p className="text-[11px] text-[#2384ba] font-mono">{staff.designation}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {staff.officeLocation || 'Kerala Office'} • {staff.deskNumber || 'Desk'}
                        </span>
                      </div>
                    </div>

                    {/* Action Menu */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(staff)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Edit Staff Profile & Shift"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setStaffToDelete(staff)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Assigned Shift Pill */}
                  <div className="mb-3 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-300 flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span className="truncate max-w-[200px]">{staff.shiftName || 'Standard Day Shift'}</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">{tzBadge}</span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="space-y-1.5 py-3 border-y border-white/5 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center space-x-1 text-[11px]">
                        <Mail className="h-3 w-3" />
                        <span>Email:</span>
                      </span>
                      <span className="text-slate-200 truncate max-w-[190px]">{staff.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center space-x-1 text-[11px]">
                        <Phone className="h-3 w-3" />
                        <span>Phone:</span>
                      </span>
                      <span className="text-slate-200">{staff.phone || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-rose-400 flex items-center space-x-1 text-[11px]">
                        <AlertCircle className="h-3 w-3" />
                        <span>Emergency:</span>
                      </span>
                      <span className="text-rose-300 font-bold">{staff.emergencyPhone || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center space-x-1 text-[11px]">
                        <Cake className="h-3 w-3 text-pink-400" />
                        <span>DOB:</span>
                      </span>
                      <span className="text-slate-200">{staff.dob || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Timezone & Status Badge */}
                <div className="mt-3 pt-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                    <MapPin className="h-3 w-3 text-[#2384ba]" />
                    <span>{staff.officeLocation || 'Kerala Office'}</span>
                  </span>

                  <span className="text-[10px] text-slate-500">
                    Joined {staff.joiningDate || '2024'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================= */}
      {/* ADD / EDIT STAFF MODAL */}
      {/* ============================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-[#0f172a]/85 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-950 border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900/80 backdrop-blur border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-[#2384ba]/20 border border-[#2384ba]/40 flex items-center justify-center text-[#2384ba]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {editingStaff ? `Edit Staff (${editingStaff.name})` : 'Provision New Staff Member'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {editingStaff ? 'Update staff profile & assigned office shift (future punches only)' : 'Assign office shift (Kerala / Dubai) and generate password'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveStaff} className="p-6 overflow-y-auto space-y-4 font-sans text-xs flex-1">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    WORK EMAIL (LOGIN USERNAME) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@arcanum.ae"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                {/* Password Provisioning (for new staff) */}
                {!editingStaff && (
                  <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-[#2384ba]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-mono uppercase text-[#2384ba] text-[11px] font-bold flex items-center space-x-1.5">
                        <KeyRound className="h-3.5 w-3.5" />
                        <span>INITIAL LOGIN PASSWORD *</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#2384ba]/20 hover:bg-[#2384ba]/30 text-[#2384ba] font-mono text-[10px] font-bold transition-colors"
                      >
                        <Dices className="h-3 w-3" />
                        <span>🎲 Generate Password</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-3.5 pr-10 py-2 bg-slate-950 border border-white/15 rounded-lg text-emerald-400 font-mono text-sm focus:outline-none focus:border-[#2384ba]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">
                      This password will be automatically provisioned into Firebase Authentication.
                    </p>
                  </div>
                )}

                {/* Office Location Hub */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1 flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-[#2384ba]" />
                    <span>OFFICE LOCATION HUB *</span>
                  </label>
                  <select
                    value={formData.officeLocation || 'Kerala / Kochi Office'}
                    onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                  >
                    {DEFAULT_OFFICE_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Shift */}
                <div>
                  <label className="block font-mono uppercase text-cyan-300 mb-1 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>ASSIGNED SHIFT SCHEDULE *</span>
                  </label>
                  <select
                    value={formData.shiftId || 'shift-kerala-day'}
                    onChange={(e) => handleShiftSelection(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    DESIGNATION / JOB TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Lead Full-Stack Architect"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    DEPARTMENT
                  </label>
                  <select
                    value={formData.department || 'Engineering'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                  >
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Infrastructure">Infrastructure & DevOps</option>
                    <option value="Data & Intelligence">Data & Intelligence</option>
                    <option value="Solutions Delivery">Solutions Delivery</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    STAFF PHONE NUMBER *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                {/* Emergency Phone */}
                <div>
                  <label className="block font-mono uppercase text-rose-300 mb-1">
                    EMERGENCY CONTACT PHONE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyPhone || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="+91 98450 99999"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-rose-500/30 rounded-xl text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block font-mono uppercase text-pink-300 mb-1 flex items-center space-x-1">
                    <Cake className="h-3.5 w-3.5 text-pink-400" />
                    <span>DATE OF BIRTH (DOB) *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob || '1995-01-01'}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-pink-500/30 rounded-xl text-white font-mono focus:outline-none focus:border-pink-400 cursor-pointer"
                  />
                </div>

                {/* Desk Number */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    OFFICE WORKSTATION DESK
                  </label>
                  <input
                    type="text"
                    value={formData.deskNumber || ''}
                    onChange={(e) => setFormData({ ...formData, deskNumber: e.target.value })}
                    placeholder="e.g. Desk-01"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block font-mono uppercase text-slate-300 mb-1">
                    STATUS
                  </label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#2384ba]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / On Leave</option>
                  </select>
                </div>
              </div>

              {/* Photo URL & Presets */}
              <div className="pt-2">
                <label className="block font-mono uppercase text-slate-300 mb-1.5">
                  PROFILE PHOTO URL OR SELECT PRESET AVATAR
                </label>
                <input
                  type="text"
                  value={formData.photoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-[#2384ba] mb-2"
                />

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400">PRESETS:</span>
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: url })}
                      className={`w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                        formData.photoUrl === url
                          ? 'border-[#2384ba] ring-2 ring-[#2384ba]'
                          : 'border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#2384ba] hover:bg-[#1a648e] text-white font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#2384ba]/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingStaff ? 'Save Changes' : 'Provision Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* PROVISIONED CREDENTIALS SUCCESS CARD */}
      {/* ============================================================= */}
      {provisionedCredentials && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-emerald-400">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Staff Account Provisioned!
                </h3>
                <p className="text-xs text-emerald-300 font-mono">
                  Firebase Authentication account created
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans">
              Share these credentials with <strong>{provisionedCredentials.name}</strong> so they can log in at the Staff Attendance Portal:
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs space-y-2.5 select-all">
              <div className="flex justify-between items-center text-slate-400 text-[11px] pb-1.5 border-b border-white/5">
                <span>PORTAL URL:</span>
                <span className="text-cyan-400 font-bold">http://localhost:3000/staff/login</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">WORK EMAIL:</span>
                <span className="text-white font-bold">{provisionedCredentials.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">PASSWORD:</span>
                <span className="text-emerald-400 font-bold tracking-wider">{provisionedCredentials.password}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>

              <button
                type="button"
                onClick={() => setProvisionedCredentials(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================================================= */}
      {staffToDelete && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-[#0f172a]/85 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Delete Staff Member</h3>
                <p className="text-xs text-rose-300 font-mono">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Are you sure you want to remove <strong>{staffToDelete.name}</strong> ({staffToDelete.email}) from the staff directory?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-600/20"
              >
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
