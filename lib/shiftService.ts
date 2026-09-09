import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { DEFAULT_TIMEZONE } from './timezoneUtils';

export interface ShiftDefinition {
  id: string;
  name: string; // e.g. "Kerala General Day Shift"
  officeLocation: string; // e.g. "Kerala / Kochi Office"
  startTime: string; // "09:00" (09:00 AM)
  endTime: string; // "18:00" (06:00 PM)
  timezone: string; // "Asia/Kolkata"
  standardHours: number; // 8
  gracePeriodMinutes: number; // 15
  breakDurationMinutes: number; // e.g. 60
  breakStartTime?: string; // e.g. "13:00"
  breakEndTime?: string; // e.g. "14:00"
  isBreakPaid?: boolean; // true
  overtimeThresholdHours: number; // 8.0
  workingDays: string[]; // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  isDefault?: boolean;
  createdAt?: any;
  updatedAt?: any;
  updatedBy?: string;
}

export const DEFAULT_OFFICE_LOCATIONS = [
  'Kerala / Kochi Office',
  'Dubai Headquarters',
  'Abu Dhabi Hub',
  'London Operations',
  'Remote / Field',
];

export const INITIAL_DEFAULT_SHIFTS: ShiftDefinition[] = [
  {
    id: 'shift-kerala-day',
    name: 'Kerala General Shift (09:00 - 18:00 IST)',
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
    isDefault: true,
  },
  {
    id: 'shift-kerala-night',
    name: 'Kerala Tech Support Shift (18:00 - 03:00 IST)',
    officeLocation: 'Kerala / Kochi Office',
    startTime: '18:00',
    endTime: '03:00',
    timezone: 'Asia/Kolkata',
    standardHours: 8,
    gracePeriodMinutes: 15,
    breakDurationMinutes: 60,
    breakStartTime: '22:00',
    breakEndTime: '23:00',
    isBreakPaid: true,
    overtimeThresholdHours: 8.0,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    isDefault: false,
  },
  {
    id: 'shift-dubai-hq',
    name: 'Dubai Corporate Shift (08:30 - 17:30 GST)',
    officeLocation: 'Dubai Headquarters',
    startTime: '08:30',
    endTime: '17:30',
    timezone: 'Asia/Dubai',
    standardHours: 8,
    gracePeriodMinutes: 15,
    breakDurationMinutes: 60,
    breakStartTime: '13:00',
    breakEndTime: '14:00',
    isBreakPaid: true,
    overtimeThresholdHours: 8.0,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    isDefault: false,
  },
];

let localShiftsCache: ShiftDefinition[] = [...INITIAL_DEFAULT_SHIFTS];

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('arcanum_shifts_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localShiftsCache = parsed;
      }
    }
  } catch (e) {}
}

const shiftListeners: ((shifts: ShiftDefinition[]) => void)[] = [];

function persistLocalShifts(shifts: ShiftDefinition[]) {
  localShiftsCache = shifts;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('arcanum_shifts_cache', JSON.stringify(shifts));
    } catch (e) {}
  }
  shiftListeners.forEach((cb) => {
    try {
      cb(shifts);
    } catch (e) {}
  });
}

/**
 * Get all configured shifts from Firestore
 */
export async function getAllShifts(): Promise<ShiftDefinition[]> {
  try {
    const colRef = collection(db, 'shifts');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // Auto seed default shifts
      for (const shift of INITIAL_DEFAULT_SHIFTS) {
        await setDoc(doc(db, 'shifts', shift.id), {
          ...shift,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      persistLocalShifts(INITIAL_DEFAULT_SHIFTS);
      return INITIAL_DEFAULT_SHIFTS;
    }

    const list: ShiftDefinition[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as ShiftDefinition);
    });

    persistLocalShifts(list);
    return list;
  } catch (err) {
    console.warn('[Shift Service] Firestore read fallback:', err);
    return localShiftsCache;
  }
}

/**
 * Subscribe to real-time shift definitions
 */
export function subscribeToShifts(
  callback: (shifts: ShiftDefinition[]) => void
): () => void {
  shiftListeners.push(callback);
  callback(localShiftsCache);

  try {
    const colRef = collection(db, 'shifts');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ShiftDefinition[] = [];
          snapshot.forEach((snap) => {
            list.push({ id: snap.id, ...snap.data() } as ShiftDefinition);
          });
          persistLocalShifts(list);
        }
      },
      (error) => {
        console.warn('[Shift Service] Snapshot error:', error);
      }
    );
    return () => {
      const idx = shiftListeners.indexOf(callback);
      if (idx !== -1) shiftListeners.splice(idx, 1);
      unsubscribe();
    };
  } catch (err) {
    return () => {
      const idx = shiftListeners.indexOf(callback);
      if (idx !== -1) shiftListeners.splice(idx, 1);
    };
  }
}

/**
 * Get shift by ID
 */
export async function getShiftById(shiftId: string): Promise<ShiftDefinition | null> {
  try {
    const docRef = doc(db, 'shifts', shiftId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as ShiftDefinition;
    }
  } catch (e) {}

  const fromCache = localShiftsCache.find((s) => s.id === shiftId);
  return fromCache || null;
}

/**
 * Create or save a shift in Firestore
 */
export async function createOrUpdateShift(
  shift: Partial<ShiftDefinition>,
  adminEmail: string
): Promise<{ success: boolean; shift?: ShiftDefinition; error?: string }> {
  try {
    const shiftId = shift.id || `shift-${String(Date.now()).slice(-6)}`;
    const docRef = doc(db, 'shifts', shiftId);

    const payload: ShiftDefinition = {
      id: shiftId,
      name: shift.name?.trim() || 'Custom Shift',
      officeLocation: shift.officeLocation || 'Kerala / Kochi Office',
      startTime: shift.startTime || '09:00',
      endTime: shift.endTime || '18:00',
      timezone: shift.timezone || 'Asia/Kolkata',
      standardHours: shift.standardHours || 8,
      gracePeriodMinutes: shift.gracePeriodMinutes ?? 15,
      breakDurationMinutes: shift.breakDurationMinutes ?? 60,
      breakStartTime: shift.breakStartTime || '13:00',
      breakEndTime: shift.breakEndTime || '14:00',
      isBreakPaid: shift.isBreakPaid ?? true,
      overtimeThresholdHours: shift.overtimeThresholdHours || 8.0,
      workingDays: shift.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isDefault: Boolean(shift.isDefault),
      updatedBy: adminEmail,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(docRef, payload, { merge: true });
    } catch (fsErr) {
      console.warn('[Shift Service] Firestore write fallback:', fsErr);
    }

    const updated = [
      payload,
      ...localShiftsCache.filter((s) => s.id !== shiftId),
    ];
    persistLocalShifts(updated);

    return { success: true, shift: payload };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save shift' };
  }
}

/**
 * Delete a shift
 */
export async function deleteShift(shiftId: string): Promise<{ success: boolean; error?: string }> {
  try {
    try {
      await deleteDoc(doc(db, 'shifts', shiftId));
    } catch (fsErr) {
      console.warn('[Shift Service] Firestore delete fallback:', fsErr);
    }

    const updated = localShiftsCache.filter((s) => s.id !== shiftId);
    persistLocalShifts(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete shift' };
  }
}
