import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getTodayDateString,
  getCurrentMonthString,
  calculateWorkingMinutes,
  DEFAULT_TIMEZONE,
  getDateStringInTimezone,
} from './timezoneUtils';
import { getDailyQuote } from './motivationalQuotes';
import { StaffMember, getStaffById } from './staffService';

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffPhotoUrl?: string;
  designation?: string;
  attendanceDate: string; // YYYY-MM-DD (in staff's configured timezone)
  month: string; // YYYY-MM
  year: number; // 2026
  checkIn: string; // ISO 8601 UTC timestamp
  checkOut?: string | null; // ISO 8601 UTC timestamp
  timezone: string; // Staff's configured timezone (e.g., 'Asia/Kolkata')
  officeLocation?: string; // e.g. "Kerala / Kochi Office"
  shiftId?: string; // Snapshot of shift ID at punch time
  shiftName?: string; // Snapshot of shift name at punch time
  expectedShiftStart?: string; // Snapshot of expected start (e.g. "09:00")
  expectedShiftEnd?: string; // Snapshot of expected end (e.g. "18:00")
  standardShiftMinutes?: number; // Snapshot of expected duration (e.g. 480)
  status: 'working' | 'on_break' | 'checked_out' | 'missing_checkout' | 'late' | 'overtime';
  totalWorkingMinutes: number;
  overtimeMinutes: number;
  breakMinutes?: number; // Total break minutes taken today (e.g. 45)
  currentBreakStart?: string | null; // ISO timestamp when active break started
  breakCount?: number; // Total number of breaks taken today
  maxBreakAllowedMinutes?: number; // Snapshot of maximum allowed break (e.g. 60)
  checkoutNote?: string;
  punchQuote?: string;
  isMissingCheckoutResolved?: boolean;
  adminEdited: boolean;
  lastAdjustmentReason?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface AttendanceAdjustmentAudit {
  id: string;
  attendanceId: string;
  staffId: string;
  staffName: string;
  originalValues: Partial<AttendanceRecord>;
  updatedValues: Partial<AttendanceRecord>;
  reason: string;
  editedBy: string;
  editedAt: string; // ISO UTC
  source: 'admin_portal' | 'staff_self_adjustment';
}

export interface StaffKpiSummary {
  staffId: string;
  staffName: string;
  totalWorkingDaysInMonth: number;
  presentDays: number;
  totalWorkingHours: number;
  avgWorkingHoursPerDay: number;
  totalOvertimeHours: number;
  attendancePercentage: number;
  lateArrivalCount: number;
  earlyDepartureCount: number;
  missingCheckoutCount: number;
}

// Clean default: no mock records
function generateSeedAttendanceRecords(): AttendanceRecord[] {
  return [];
}

// Local cache for fast client reactivity
let localAttendanceCache: AttendanceRecord[] = [];
let localAuditCache: AttendanceAdjustmentAudit[] = [];

function persistAttendanceCache(data: AttendanceRecord[]) {
  localAttendanceCache = data;
}

function persistAuditCache(data: AttendanceAdjustmentAudit[]) {
  localAuditCache = data;
}

/**
 * Real-time subscription to Today's Attendance (for live Office Desk & Staff portal)
 */
export function subscribeToTodayAttendance(
  callback: (records: AttendanceRecord[]) => void,
  targetDate?: string,
  timeZone: string = DEFAULT_TIMEZONE
): () => void {
  const dateStr = targetDate || getTodayDateString(timeZone);

  try {
    const colRef = collection(db, 'attendance');
    const q = query(colRef, where('attendanceDate', '==', dateStr));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          persistAttendanceCache([]);
          callback([]);
          return;
        }
        const records: AttendanceRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push({ id: docSnap.id, ...docSnap.data() } as AttendanceRecord);
        });

        persistAttendanceCache(records);
        callback(records);
      },
      (err) => {
        console.warn('[Attendance Service] Snapshot error:', err);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (e) {
    callback([]);
    return () => {};
  }
}

/**
 * Get monthly attendance for a specific staff member
 */
export async function getStaffAttendanceMonthly(
  staffId: string,
  monthStr?: string // "YYYY-MM"
): Promise<AttendanceRecord[]> {
  const month = monthStr || getCurrentMonthString();
  try {
    const colRef = collection(db, 'attendance');
    const q = query(
      colRef,
      where('staffId', '==', staffId),
      where('month', '==', month)
    );
    const snapshot = await getDocs(q);

    const results: AttendanceRecord[] = [];
    snapshot.forEach((snap) => {
      results.push({ id: snap.id, ...snap.data() } as AttendanceRecord);
    });

    results.sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));
    return results;
  } catch (err) {
    console.warn('[Attendance Service] Monthly query fallback:', err);
    return [];
  }
}

/**
 * Get all attendance records for a specific month (for Admin matrix)
 */
export async function getAllAttendanceMonthly(
  monthStr?: string,
  filterStaffId?: string
): Promise<AttendanceRecord[]> {
  const month = monthStr || getCurrentMonthString();
  try {
    const colRef = collection(db, 'attendance');
    let q = query(colRef, where('month', '==', month));
    if (filterStaffId && filterStaffId !== 'all') {
      q = query(colRef, where('month', '==', month), where('staffId', '==', filterStaffId));
    }

    const snapshot = await getDocs(q);
    const list: AttendanceRecord[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as AttendanceRecord);
    });

    list.sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));
    persistAttendanceCache(list);
    return list;
  } catch (err) {
    console.warn('[Attendance Service] All monthly query fallback:', err);
    return [];
  }
}

/**
 * Check if staff member has an unclosed / missing check-out from an earlier day
 */
export async function checkUnclosedPreviousSession(
  staffId: string,
  staffTimezone: string = DEFAULT_TIMEZONE
): Promise<AttendanceRecord | null> {
  const todayStr = getTodayDateString(staffTimezone);

  // Look for any attendance record for this staff where checkOut is null and attendanceDate < todayStr
  const candidate = localAttendanceCache.find(
    (r) => r.staffId === staffId && !r.checkOut && r.attendanceDate < todayStr
  );

  if (candidate) {
    return candidate;
  }

  try {
    const colRef = collection(db, 'attendance');
    const q = query(colRef, where('staffId', '==', staffId), where('status', 'in', ['working', 'missing_checkout']));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      const data = docSnap.data() as AttendanceRecord;
      if (!data.checkOut && data.attendanceDate < todayStr) {
        return { ...data, id: docSnap.id };
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Check if staff is currently checked in for Today
 */
export async function getTodayStaffRecord(
  staffId: string,
  staffTimezone: string = DEFAULT_TIMEZONE
): Promise<AttendanceRecord | null> {
  const todayStr = getTodayDateString(staffTimezone);
  const found = localAttendanceCache.find((r) => r.staffId === staffId && r.attendanceDate === todayStr);
  if (found) return found;

  try {
    const docId = `att-${staffId}-${todayStr}`;
    const snap = await getDoc(doc(db, 'attendance', docId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as AttendanceRecord;
    }
  } catch (e) {}

  return null;
}

/**
 * Record Check-In for Today
 */
export async function recordPunchIn(
  staff: StaffMember,
  customQuote?: string
): Promise<{ success: boolean; record?: AttendanceRecord; error?: string }> {
  try {
    const timezone = staff.timezone || DEFAULT_TIMEZONE;
    const todayStr = getTodayDateString(timezone);
    const monthStr = getCurrentMonthString(timezone);
    const year = Number(todayStr.slice(0, 4));

    // 1. Check for unclosed previous sessions
    const unclosedPrior = await checkUnclosedPreviousSession(staff.id, timezone);
    if (unclosedPrior) {
      return {
        success: false,
        error: `You have an unclosed check-in from ${unclosedPrior.attendanceDate}. Please adjust/resolve your previous checkout before starting today's session.`,
      };
    }

    // 2. Check if already checked in today
    const existingToday = await getTodayStaffRecord(staff.id, timezone);
    if (existingToday) {
      return {
        success: false,
        error: `You have already checked in for today (${todayStr}) at ${existingToday.checkIn}.`,
      };
    }

    const nowIso = new Date().toISOString();
    const docId = `att-${staff.id}-${todayStr}`;
    const quote = customQuote || getDailyQuote(staff.name).quote;

    const newRecord: AttendanceRecord = {
      id: docId,
      staffId: staff.id,
      staffName: staff.name,
      staffPhotoUrl: staff.photoUrl,
      designation: staff.designation,
      attendanceDate: todayStr,
      month: monthStr,
      year: year,
      checkIn: nowIso,
      checkOut: null,
      timezone: timezone,
      officeLocation: staff.officeLocation || 'Kerala / Kochi Office',
      shiftId: staff.shiftId || 'shift-kerala-day',
      shiftName: staff.shiftName || 'Kerala General Shift (09:00 - 18:00 IST)',
      expectedShiftStart: '09:00',
      expectedShiftEnd: '18:00',
      standardShiftMinutes: (staff.standardWorkHours || 8) * 60,
      status: 'working',
      totalWorkingMinutes: 0,
      overtimeMinutes: 0,
      punchQuote: quote,
      adminEdited: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'attendance', docId), newRecord);
    } catch (fsErr) {
      console.warn('[Attendance Service] Firestore check-in write fallback:', fsErr);
    }

    const updated = [newRecord, ...localAttendanceCache.filter((r) => r.id !== docId)];
    persistAttendanceCache(updated);

    return { success: true, record: newRecord };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Check-in failed' };
  }
}

/**
 * Record Check-Out from active session
 */
export async function recordPunchOut(
  attendanceId: string,
  note?: string,
  customCheckOutTime?: string
): Promise<{ success: boolean; record?: AttendanceRecord; error?: string }> {
  try {
    const existing = localAttendanceCache.find((r) => r.id === attendanceId);
    const checkOutIso = customCheckOutTime || new Date().toISOString();

    if (!existing) {
      return { success: false, error: 'Attendance record not found.' };
    }

    const { totalMinutes, overtimeMinutes } = calculateWorkingMinutes(existing.checkIn, checkOutIso);
    const newStatus = overtimeMinutes > 0 ? 'overtime' : 'checked_out';

    const payload: Partial<AttendanceRecord> = {
      checkOut: checkOutIso,
      totalWorkingMinutes: totalMinutes,
      overtimeMinutes: overtimeMinutes,
      status: newStatus,
      checkoutNote: note ? note.trim() : existing.checkoutNote,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, 'attendance', attendanceId), payload);
    } catch (fsErr) {
      console.warn('[Attendance Service] Firestore checkout update fallback:', fsErr);
    }

    const updatedRecord: AttendanceRecord = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = localAttendanceCache.map((r) => (r.id === attendanceId ? updatedRecord : r));
    persistAttendanceCache(updatedList);

    return { success: true, record: updatedRecord };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Check-out failed' };
  }
}

/**
 * Record Start Break (Staff takes a lunch or tea break anytime)
 */
export async function recordStartBreak(
  attendanceId: string
): Promise<{ success: boolean; record?: AttendanceRecord; error?: string }> {
  try {
    const existing = localAttendanceCache.find((r) => r.id === attendanceId);
    if (!existing) {
      return { success: false, error: 'Attendance record not found.' };
    }

    const nowIso = new Date().toISOString();
    const payload: Partial<AttendanceRecord> = {
      status: 'on_break',
      currentBreakStart: nowIso,
      breakCount: (existing.breakCount || 0) + 1,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, 'attendance', attendanceId), payload);
    } catch (fsErr) {
      console.warn('[Attendance Service] Firestore start break fallback:', fsErr);
    }

    const updatedRecord: AttendanceRecord = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = localAttendanceCache.map((r) => (r.id === attendanceId ? updatedRecord : r));
    persistAttendanceCache(updatedList);

    return { success: true, record: updatedRecord };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to start break' };
  }
}

/**
 * Record End Break / Resume Shift
 */
export async function recordEndBreak(
  attendanceId: string
): Promise<{ success: boolean; record?: AttendanceRecord; addedBreakMinutes?: number; error?: string }> {
  try {
    const existing = localAttendanceCache.find((r) => r.id === attendanceId);
    if (!existing) {
      return { success: false, error: 'Attendance record not found.' };
    }

    let addedMinutes = 0;
    if (existing.currentBreakStart) {
      const startMs = new Date(existing.currentBreakStart).getTime();
      const endMs = Date.now();
      addedMinutes = Math.max(1, Math.round((endMs - startMs) / (1000 * 60)));
    }

    const newTotalBreak = (existing.breakMinutes || 0) + addedMinutes;
    const payload: Partial<AttendanceRecord> = {
      status: 'working',
      currentBreakStart: null,
      breakMinutes: newTotalBreak,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, 'attendance', attendanceId), payload);
    } catch (fsErr) {
      console.warn('[Attendance Service] Firestore end break fallback:', fsErr);
    }

    const updatedRecord: AttendanceRecord = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = localAttendanceCache.map((r) => (r.id === attendanceId ? updatedRecord : r));
    persistAttendanceCache(updatedList);

    return { success: true, record: updatedRecord, addedBreakMinutes: addedMinutes };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to resume shift from break' };
  }
}

/**
 * Resolve Missing Checkout from a prior date (Warning recovery flow)
 */
export async function resolveMissingCheckout(params: {
  attendanceId: string;
  actualCheckOutIso: string;
  workedOvertime: boolean;
  note?: string;
  staffName: string;
  staffId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { attendanceId, actualCheckOutIso, note, staffName, staffId } = params;
    const existing = localAttendanceCache.find((r) => r.id === attendanceId);
    if (!existing) return { success: false, error: 'Record not found' };

    const { totalMinutes, overtimeMinutes } = calculateWorkingMinutes(existing.checkIn, actualCheckOutIso);

    const payload: Partial<AttendanceRecord> = {
      checkOut: actualCheckOutIso,
      totalWorkingMinutes: Math.min(totalMinutes, 12 * 60), // Cap reasonable shift
      overtimeMinutes: params.workedOvertime ? Math.min(overtimeMinutes, 4 * 60) : 0,
      status: 'checked_out',
      checkoutNote: note ? `[Self Resolved]: ${note}` : '[Self Resolved Missing Checkout]',
      isMissingCheckoutResolved: true,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, 'attendance', attendanceId), payload);
    } catch (e) {}

    // Audit trail
    const auditId = `aud-${Date.now()}`;
    const auditEntry: AttendanceAdjustmentAudit = {
      id: auditId,
      attendanceId,
      staffId,
      staffName,
      originalValues: { checkOut: existing.checkOut, status: existing.status },
      updatedValues: payload,
      reason: note || 'Resolved missing checkout on subsequent return',
      editedBy: staffName,
      editedAt: new Date().toISOString(),
      source: 'staff_self_adjustment',
    };

    try {
      await setDoc(doc(db, 'attendanceAdjustments', auditId), auditEntry);
    } catch (e) {}

    const updatedList = localAttendanceCache.map((r) =>
      r.id === attendanceId ? { ...r, ...payload, updatedAt: new Date().toISOString() } : r
    );
    persistAttendanceCache(updatedList);

    const updatedAudits = [auditEntry, ...localAuditCache];
    persistAuditCache(updatedAudits);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to resolve missing checkout' };
  }
}

/**
 * Admin Adjustment of Attendance Record with Audit Logging
 */
export async function adminAdjustAttendance(params: {
  attendanceId: string;
  updatedValues: {
    checkIn?: string;
    checkOut?: string | null;
    attendanceDate?: string;
    status?: 'working' | 'checked_out' | 'missing_checkout' | 'late' | 'overtime';
    checkoutNote?: string;
  };
  reason: string;
  adminEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { attendanceId, updatedValues, reason, adminEmail } = params;
    const existing = localAttendanceCache.find((r) => r.id === attendanceId);

    if (!existing) {
      return { success: false, error: 'Attendance record not found' };
    }

    // Recalculate working duration if checkIn or checkOut changed
    const newCheckIn = updatedValues.checkIn || existing.checkIn;
    const newCheckOut = updatedValues.checkOut !== undefined ? updatedValues.checkOut : existing.checkOut;

    const { totalMinutes, overtimeMinutes } = calculateWorkingMinutes(newCheckIn, newCheckOut);

    const fullUpdate: Partial<AttendanceRecord> = {
      ...updatedValues,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      totalWorkingMinutes: totalMinutes,
      overtimeMinutes: overtimeMinutes,
      adminEdited: true,
      lastAdjustmentReason: reason,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, 'attendance', attendanceId), fullUpdate);
    } catch (e) {}

    // Create Audit Record
    const auditId = `aud-admin-${Date.now()}`;
    const auditEntry: AttendanceAdjustmentAudit = {
      id: auditId,
      attendanceId,
      staffId: existing.staffId,
      staffName: existing.staffName,
      originalValues: {
        checkIn: existing.checkIn,
        checkOut: existing.checkOut,
        status: existing.status,
        totalWorkingMinutes: existing.totalWorkingMinutes,
        overtimeMinutes: existing.overtimeMinutes,
      },
      updatedValues: fullUpdate,
      reason: reason.trim(),
      editedBy: adminEmail,
      editedAt: new Date().toISOString(),
      source: 'admin_portal',
    };

    try {
      await setDoc(doc(db, 'attendanceAdjustments', auditId), auditEntry);
    } catch (e) {}

    const updatedList = localAttendanceCache.map((r) =>
      r.id === attendanceId ? { ...r, ...fullUpdate, updatedAt: new Date().toISOString() } : r
    );
    persistAttendanceCache(updatedList);

    const updatedAudits = [auditEntry, ...localAuditCache];
    persistAuditCache(updatedAudits);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Admin adjustment failed' };
  }
}

/**
 * Subscribe to Audit Adjustments
 */
export function subscribeToAdjustmentsAudit(
  callback: (audits: AttendanceAdjustmentAudit[]) => void
): () => void {
  try {
    const colRef = collection(db, 'attendanceAdjustments');
    const q = query(colRef, orderBy('editedAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          callback(localAuditCache);
          return;
        }
        const list: AttendanceAdjustmentAudit[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as AttendanceAdjustmentAudit);
        });
        persistAuditCache(list);
        callback(list);
      },
      (e) => {
        callback(localAuditCache);
      }
    );
    return unsub;
  } catch (e) {
    callback(localAuditCache);
    return () => {};
  }
}

/**
 * Calculate KPI summary for a list of attendance records
 */
export function calculateStaffKpis(
  records: AttendanceRecord[],
  monthStr: string,
  staffProfile?: StaffMember
): StaffKpiSummary {
  // Approximate standard working days in a month (excluding weekends) ~ 22 days
  const totalWorkingDaysInMonth = 22;
  const presentDays = records.filter((r) => r.status !== 'missing_checkout').length;
  const totalMinutes = records.reduce((acc, curr) => acc + (curr.totalWorkingMinutes || 0), 0);
  const totalOvertimeMinutes = records.reduce((acc, curr) => acc + (curr.overtimeMinutes || 0), 0);

  const totalWorkingHours = Number((totalMinutes / 60).toFixed(1));
  const avgWorkingHoursPerDay = presentDays > 0 ? Number((totalWorkingHours / presentDays).toFixed(1)) : 0;
  const totalOvertimeHours = Number((totalOvertimeMinutes / 60).toFixed(1));
  const attendancePercentage = Number(Math.min(100, (presentDays / totalWorkingDaysInMonth) * 100).toFixed(1));

  // Late arrivals count (checkIn after 09:00:00 local time)
  const lateArrivalCount = records.filter((r) => {
    try {
      const date = new Date(r.checkIn);
      const hours = Number(
        new Intl.DateTimeFormat('en-GB', { timeZone: r.timezone || 'Asia/Kolkata', hour: '2-digit', hour12: false }).format(date)
      );
      const minutes = Number(
        new Intl.DateTimeFormat('en-GB', { timeZone: r.timezone || 'Asia/Kolkata', minute: '2-digit' }).format(date)
      );
      return hours > 9 || (hours === 9 && minutes > 15); // Grace period 15 mins
    } catch (e) {
      return false;
    }
  }).length;

  const earlyDepartureCount = records.filter((r) => {
    if (!r.checkOut) return false;
    try {
      const date = new Date(r.checkOut);
      const hours = Number(
        new Intl.DateTimeFormat('en-GB', { timeZone: r.timezone || 'Asia/Kolkata', hour: '2-digit', hour12: false }).format(date)
      );
      return hours < 17; // Left before 5:00 PM
    } catch (e) {
      return false;
    }
  }).length;

  const missingCheckoutCount = records.filter((r) => r.status === 'missing_checkout' && !r.isMissingCheckoutResolved).length;

  return {
    staffId: staffProfile?.id || (records[0]?.staffId ?? 'STAFF'),
    staffName: staffProfile?.name || (records[0]?.staffName ?? 'Staff Member'),
    totalWorkingDaysInMonth,
    presentDays,
    totalWorkingHours,
    avgWorkingHoursPerDay,
    totalOvertimeHours,
    attendancePercentage,
    lateArrivalCount,
    earlyDepartureCount,
    missingCheckoutCount,
  };
}
