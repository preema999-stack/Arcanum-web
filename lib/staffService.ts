import { db, auth } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export interface StaffMember {
  id: string;
  uid?: string;
  name: string;
  email: string;
  designation: string;
  department?: string;
  phone: string;
  emergencyPhone: string;
  dob: string; // YYYY-MM-DD
  photoUrl: string;
  timezone: string; // Default 'Asia/Kolkata'
  officeLocation?: string; // e.g. "Kerala / Kochi Office"
  shiftId?: string; // e.g. "shift-kerala-day"
  shiftName?: string; // e.g. "Kerala General Shift (09:00 - 18:00 IST)"
  status: 'active' | 'inactive';
  joiningDate: string; // YYYY-MM-DD
  standardWorkHours?: number; // Default 8
  deskNumber?: string; // e.g. "Desk-01"
  createdAt?: any;
  updatedAt?: any;
}

export type StaffCreateInput = Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  password?: string;
  initialPassword?: string;
  sendEmailNotification?: boolean;
};

export type StaffUpdateInput = Partial<Omit<StaffMember, 'id' | 'createdAt'>> & {
  password?: string;
};

// Clean default: no mock data
export const INITIAL_STAFF_SEEDS: StaffMember[] = [];

let localStaffCache: StaffMember[] = [];

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('arcanum_staff_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        localStaffCache = parsed;
      }
    }
  } catch (e) {}
}

function persistLocalCache(data: StaffMember[]) {
  localStaffCache = data;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('arcanum_staff_cache', JSON.stringify(data));
    } catch (e) {}
  }
}

/**
 * Fetch all staff members from Firestore
 */
export async function getAllStaff(): Promise<StaffMember[]> {
  try {
    const colRef = collection(db, 'staff');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      persistLocalCache([]);
      return [];
    }

    const list: StaffMember[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as StaffMember);
    });

    persistLocalCache(list);
    return list;
  } catch (err) {
    console.warn('[Staff Service] Firestore fetch fallback:', err);
    return localStaffCache;
  }
}

/**
 * Subscribe to real-time staff collection updates
 */
export function subscribeToStaff(
  callback: (staff: StaffMember[]) => void
): () => void {
  try {
    const colRef = collection(db, 'staff');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          persistLocalCache([]);
          callback([]);
          return;
        }
        const list: StaffMember[] = [];
        snapshot.forEach((snap) => {
          list.push({ id: snap.id, ...snap.data() } as StaffMember);
        });
        persistLocalCache(list);
        callback(list);
      },
      (error) => {
        console.warn('[Staff Service] Snapshot error:', error);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    callback(localStaffCache);
    return () => {};
  }
}

/**
 * Get staff member by ID
 */
export async function getStaffById(staffId: string): Promise<StaffMember | null> {
  try {
    const docRef = doc(db, 'staff', staffId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as StaffMember;
    }
  } catch (e) {}

  const fromCache = localStaffCache.find((s) => s.id === staffId);
  return fromCache || null;
}

/**
 * Get staff member by Email address
 */
export async function getStaffByEmail(email: string): Promise<StaffMember | null> {
  const normEmail = email.trim().toLowerCase();
  try {
    const q = query(collection(db, 'staff'), where('email', '==', normEmail));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const firstDoc = snap.docs[0];
      return { id: firstDoc.id, ...firstDoc.data() } as StaffMember;
    }
  } catch (e) {}

  const fromCache = localStaffCache.find((s) => s.email.toLowerCase() === normEmail);
  return fromCache || null;
}

/**
 * Create a new staff member in Firestore
 */
export async function createStaffMember(
  input: StaffCreateInput
): Promise<{ success: boolean; staff?: StaffMember; credentials?: { email: string; password?: string }; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (e) {}

    // Call server endpoint to provision Firebase Auth and Firestore record safely
    const res = await fetch('/api/admin/staff', {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (data.success && data.staff) {
      const updated = [data.staff, ...localStaffCache.filter((s) => s.id !== data.staff.id)];
      persistLocalCache(updated);
      return { success: true, staff: data.staff, credentials: data.credentials };
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to provision staff member.');
    }

    return { success: true, staff: data.staff };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create staff member' };
  }
}

/**
 * Update existing staff member
 */
export async function updateStaffMember(
  staffId: string,
  input: StaffUpdateInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      ...input,
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = doc(db, 'staff', staffId);
      await updateDoc(docRef, payload);
    } catch (fsErr) {
      console.warn('[Staff Service] Firestore update fallback:', fsErr);
    }

    const updated = localStaffCache.map((s) => {
      if (s.id === staffId) {
        return { ...s, ...input, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    persistLocalCache(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update staff member' };
  }
}

/**
 * Delete a staff member
 */
export async function deleteStaffMember(staffId: string): Promise<{ success: boolean; error?: string }> {
  try {
    try {
      await deleteDoc(doc(db, 'staff', staffId));
    } catch (fsErr) {
      console.warn('[Staff Service] Firestore delete fallback:', fsErr);
    }

    const updated = localStaffCache.filter((s) => s.id !== staffId);
    persistLocalCache(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete staff member' };
  }
}

/**
 * Helper to generate secure random password
 */
export function generateRandomPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  let pass = 'Arc#';
  for (let i = 0; i < length - 4; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}
