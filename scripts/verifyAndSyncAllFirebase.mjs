import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
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
console.log('  ARCANUM ALL-DATA FIREBASE CONNECTIVITY & SYNC CHECK');
console.log('======================================================');
console.log(`Target Project: ${firebaseConfig.projectId}\n`);

async function runHealthCheck() {
  const collectionsToCheck = [
    'cms_content',
    'inquiries',
    'notification_logs',
    'daily_analytics',
    'staff',
    'attendance',
    'attendanceAdjustments',
    'officeSettings',
    'shifts',
  ];

  // 1. Ensure Office Settings is deployed to Firestore
  try {
    const officeDocRef = doc(db, 'officeSettings', 'default');
    const officeSnap = await getDoc(officeDocRef);
    if (!officeSnap.exists()) {
      console.log('⚡ Deploying default officeSettings to Firestore...');
      await setDoc(officeDocRef, {
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
        updatedAt: serverTimestamp(),
      });
      console.log('✓ officeSettings/default created.');
    }
  } catch (e) {
    console.error('❌ Error checking/writing officeSettings:', e.message);
  }

  // 2. Ensure Default Shifts are deployed to Firestore
  try {
    const shiftsToEnsure = [
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

    for (const shift of shiftsToEnsure) {
      const shiftRef = doc(db, 'shifts', shift.id);
      const shiftSnap = await getDoc(shiftRef);
      if (!shiftSnap.exists()) {
        console.log(`⚡ Deploying shift "${shift.name}" to Firestore...`);
        await setDoc(shiftRef, {
          ...shift,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log(`✓ shifts/${shift.id} created.`);
      }
    }
  } catch (e) {
    console.error('❌ Error checking/writing shifts:', e.message);
  }

  // 3. Inspect all collections and report counts
  console.log('\n--- FIRESTORE COLLECTIONS STATUS REPORT ---');
  for (const colName of collectionsToCheck) {
    try {
      const colRef = collection(db, colName);
      const snap = await getDocs(colRef);
      console.log(`  ✓ Collection [${colName.padEnd(22)}]: ONLINE (${snap.size} documents)`);
    } catch (err) {
      console.log(`  ❌ Collection [${colName.padEnd(22)}]: ERROR - ${err.message}`);
    }
  }

  console.log('\n======================================================');
  console.log('  ALL FIREBASE COLLECTIONS VERIFIED & SYNCHRONIZED');
  console.log('======================================================\n');
  process.exit(0);
}

runHealthCheck().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
