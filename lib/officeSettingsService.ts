import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { DEFAULT_TIMEZONE } from './timezoneUtils';

export interface OfficeTimingSettings {
  id: string;
  companyName: string;
  defaultTimezone: string; // 'Asia/Kolkata'
  workStartTime: string; // '09:00' (09:00 AM)
  workEndTime: string; // '18:00' (06:00 PM)
  standardWorkHours: number; // 8
  gracePeriodMinutes: number; // 15
  breakDurationMinutes: number; // e.g. 60 (Total break allowed in minutes)
  breakStartTime?: string; // e.g. "13:00"
  breakEndTime?: string; // e.g. "14:00"
  isBreakPaid: boolean; // true
  allowFlexibleBreak: boolean; // true
  halfDayHours: number; // 4.5
  overtimeThresholdHours: number; // 8.0
  allowEarlyCheckIn: boolean; // true
  workingDays: string[]; // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  requireCheckoutNoteForOvertime: boolean; // true
  autoFlagLateArrivals: boolean; // true
  updatedAt?: any;
  updatedBy?: string;
}

export const DEFAULT_OFFICE_SETTINGS: OfficeTimingSettings = {
  id: 'default',
  companyName: 'Arcanum Information Technology',
  defaultTimezone: 'Asia/Kolkata',
  workStartTime: '09:00',
  workEndTime: '18:00',
  standardWorkHours: 8,
  gracePeriodMinutes: 15,
  breakDurationMinutes: 60,
  breakStartTime: '13:00',
  breakEndTime: '14:00',
  isBreakPaid: true,
  allowFlexibleBreak: true,
  halfDayHours: 4.5,
  overtimeThresholdHours: 8.0,
  allowEarlyCheckIn: true,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  requireCheckoutNoteForOvertime: false,
  autoFlagLateArrivals: true,
};

let localSettingsCache: OfficeTimingSettings = { ...DEFAULT_OFFICE_SETTINGS };

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('arcanum_office_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) {
        localSettingsCache = parsed;
      }
    }
  } catch (e) {}
}

const settingsListeners: ((settings: OfficeTimingSettings) => void)[] = [];

function persistLocalSettings(settings: OfficeTimingSettings) {
  localSettingsCache = settings;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('arcanum_office_settings', JSON.stringify(settings));
    } catch (e) {}
  }
  settingsListeners.forEach((cb) => {
    try {
      cb(settings);
    } catch (e) {}
  });
}

/**
 * Get Office Timing Settings from Firestore (with fallback)
 */
export async function getOfficeSettings(): Promise<OfficeTimingSettings> {
  try {
    const docRef = doc(db, 'officeSettings', 'default');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as OfficeTimingSettings;
      persistLocalSettings(data);
      return data;
    } else {
      // Auto seed default settings
      await setDoc(docRef, {
        ...DEFAULT_OFFICE_SETTINGS,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return DEFAULT_OFFICE_SETTINGS;
    }
  } catch (err) {
    console.warn('[Office Settings Service] Firestore read fallback:', err);
    return localSettingsCache;
  }
}

/**
 * Real-time subscription to Office Timing Settings
 */
export function subscribeToOfficeSettings(
  callback: (settings: OfficeTimingSettings) => void
): () => void {
  settingsListeners.push(callback);
  callback(localSettingsCache);

  try {
    const docRef = doc(db, 'officeSettings', 'default');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as OfficeTimingSettings;
          persistLocalSettings(data);
        }
      },
      (error) => {
        console.warn('[Office Settings Service] Snapshot error:', error);
      }
    );
    return () => {
      const idx = settingsListeners.indexOf(callback);
      if (idx !== -1) settingsListeners.splice(idx, 1);
      unsubscribe();
    };
  } catch (err) {
    return () => {
      const idx = settingsListeners.indexOf(callback);
      if (idx !== -1) settingsListeners.splice(idx, 1);
    };
  }
}

/**
 * Update Office Timing Settings in Firestore
 */
export async function updateOfficeSettings(
  settings: Partial<OfficeTimingSettings>,
  adminEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'officeSettings', 'default');
    const payload = {
      ...localSettingsCache,
      ...settings,
      updatedBy: adminEmail,
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(docRef, payload, { merge: true });
    } catch (fsErr) {
      console.warn('[Office Settings] Firestore write fallback:', fsErr);
    }

    const updated: OfficeTimingSettings = {
      ...localSettingsCache,
      ...settings,
      updatedBy: adminEmail,
      updatedAt: new Date().toISOString(),
    };
    persistLocalSettings(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update office settings.' };
  }
}
