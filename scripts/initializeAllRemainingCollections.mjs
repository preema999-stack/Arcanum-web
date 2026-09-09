import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC8XrjDtyeCeCwFRDNJ3S05UujDMeCdLyk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'arcanum-4e385.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'arcanum-4e385',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'arcanum-4e385.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '955579161117',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:955579161117:web:03e5f44e8d1c928eab44f4',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-QQZGDC5J0Y',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

console.log('\n======================================================');
console.log('  INITIALIZING ALL REMAINING COLLECTIONS IN FIREBASE');
console.log('======================================================\n');

async function initializeCollections() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  // 1. Initialize `daily_analytics`
  try {
    const analyticsDocRef = doc(db, 'daily_analytics', todayStr);
    await setDoc(analyticsDocRef, {
      date: todayStr,
      pageViews: 1,
      uniqueVisitors: 1,
      inquiriesCount: 0,
      activeSessions: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`✓ [daily_analytics] Created document: daily_analytics/${todayStr}`);
  } catch (err) {
    console.error('❌ Error writing daily_analytics:', err.message);
  }

  // 2. Initialize `attendance`
  try {
    const sampleAttDocRef = doc(db, 'attendance', `att-ARC-STF-001-${todayStr}`);
    await setDoc(sampleAttDocRef, {
      id: `att-ARC-STF-001-${todayStr}`,
      staffId: 'ARC-STF-001',
      staffName: 'Aarav Sharma',
      designation: 'Lead Full-Stack Architect',
      attendanceDate: todayStr,
      month: todayStr.slice(0, 7),
      year: parseInt(todayStr.slice(0, 4), 10),
      checkIn: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      checkOut: null,
      timezone: 'Asia/Kolkata',
      officeLocation: 'Kerala / Kochi Office',
      shiftId: 'shift-kerala-day',
      shiftName: 'Kerala General Shift (09:00 - 18:00 IST)',
      expectedShiftStart: '09:00',
      expectedShiftEnd: '18:00',
      standardShiftMinutes: 480,
      status: 'working',
      totalWorkingMinutes: 180,
      overtimeMinutes: 0,
      breakMinutes: 15,
      currentBreakStart: null,
      breakCount: 1,
      maxBreakAllowedMinutes: 60,
      punchQuote: 'The secret of getting ahead is getting started.',
      adminEdited: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`✓ [attendance] Created document: attendance/att-ARC-STF-001-${todayStr}`);
  } catch (err) {
    console.error('❌ Error writing attendance:', err.message);
  }

  // 3. Initialize `attendanceAdjustments`
  try {
    const auditDocRef = doc(db, 'attendanceAdjustments', 'audit-init-001');
    await setDoc(auditDocRef, {
      id: 'audit-init-001',
      attendanceId: `att-ARC-STF-001-${todayStr}`,
      staffId: 'ARC-STF-001',
      staffName: 'Aarav Sharma',
      reason: 'System initialization & ledger audit activation',
      editedBy: 'system@arcanum.ae',
      editedAt: nowIso,
      source: 'admin_portal',
      originalValues: {},
      updatedValues: { status: 'working' },
      createdAt: serverTimestamp(),
    }, { merge: true });
    console.log('✓ [attendanceAdjustments] Created document: attendanceAdjustments/audit-init-001');
  } catch (err) {
    console.error('❌ Error writing attendanceAdjustments:', err.message);
  }

  console.log('\n======================================================');
  console.log('  ALL 9 COLLECTIONS NOW POPULATED IN FIRESTORE');
  console.log('======================================================\n');
  process.exit(0);
}

initializeCollections().catch((err) => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
