import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC8XrjDtyeCeCwFRDNJ3S05UujDMeCdLyk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'arcanum-4e385.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'arcanum-4e385',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'arcanum-4e385.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '955579161117',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:955579161117:web:03e5f44e8d1c928eab44f4',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-QQZGDC5J0Y',
};

const INITIAL_STAFF = [
  {
    id: 'ARC-STF-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@arcanum.ae',
    designation: 'Lead Full-Stack Architect',
    department: 'Core Engineering',
    phone: '+91 98450 12345',
    emergencyPhone: '+91 98450 99999',
    dob: '1994-08-24',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    status: 'active',
    joiningDate: '2023-01-15',
    standardWorkHours: 8,
    deskNumber: 'Desk-01',
  },
  {
    id: 'ARC-STF-002',
    name: 'Priya Nair',
    email: 'priya.nair@arcanum.ae',
    designation: 'Senior UI/UX & Motion Designer',
    department: 'Product Design',
    phone: '+91 97123 45678',
    emergencyPhone: '+91 97123 88888',
    dob: '1996-11-12',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    status: 'active',
    joiningDate: '2023-04-01',
    standardWorkHours: 8,
    deskNumber: 'Desk-02',
  },
  {
    id: 'ARC-STF-003',
    name: 'Rohan Varma',
    email: 'rohan.varma@arcanum.ae',
    designation: 'Cloud & DevOps Engineer',
    department: 'Infrastructure',
    phone: '+91 99887 65432',
    emergencyPhone: '+91 99887 11111',
    dob: '1995-05-18',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    status: 'active',
    joiningDate: '2023-08-10',
    standardWorkHours: 8,
    deskNumber: 'Desk-03',
  },
  {
    id: 'ARC-STF-004',
    name: 'Ananya Patel',
    email: 'ananya.patel@arcanum.ae',
    designation: 'AI / ML Solutions Specialist',
    department: 'Data & Intelligence',
    phone: '+91 98223 34455',
    emergencyPhone: '+91 98223 00000',
    dob: '1997-03-29',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    status: 'active',
    joiningDate: '2024-02-01',
    standardWorkHours: 8,
    deskNumber: 'Desk-04',
  },
  {
    id: 'ARC-STF-005',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@arcanum.ae',
    designation: 'Enterprise Client Solutions Lead',
    department: 'Solutions Delivery',
    phone: '+971 50 123 4567',
    emergencyPhone: '+971 50 999 8888',
    dob: '1992-09-14',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    timezone: 'Asia/Dubai',
    status: 'active',
    joiningDate: '2022-11-15',
    standardWorkHours: 8,
    deskNumber: 'Desk-05',
  },
];

const DEFAULT_OFFICE_SETTINGS = {
  id: 'default',
  companyName: 'Arcanum Information Technology',
  defaultTimezone: 'Asia/Kolkata',
  workStartTime: '09:00',
  workEndTime: '18:00',
  standardWorkHours: 8,
  gracePeriodMinutes: 15,
  halfDayHours: 4.5,
  overtimeThresholdHours: 8.0,
  allowEarlyCheckIn: true,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  requireCheckoutNoteForOvertime: false,
  autoFlagLateArrivals: true,
};

async function seed() {
  console.log(`\n======================================================`);
  console.log(`  ARCANUM ATTENDANCE & OFFICE SETTINGS FIREBASE SEEDER`);
  console.log(`======================================================\n`);

  // First try server API bridge if running
  try {
    console.log(`[1/3] Connecting to local server endpoint (http://localhost:3000/api/admin/attendance/seed)...`);
    const res = await fetch('http://localhost:3000/api/admin/attendance/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`[SUCCESS] Seeded collections:`, data.seededCollections);
      console.log(`\n✓ All collections ('staff', 'attendance', 'attendanceAdjustments', 'officeSettings') are live in Firebase Firestore!\n`);
      return;
    }
  } catch (err) {}

  // Fallback to direct client Firestore SDK
  console.log(`[2/3] Connecting directly to Firebase Firestore (${firebaseConfig.projectId})...`);
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const todayStr = new Date().toISOString().slice(0, 10);
  const monthStr = todayStr.slice(0, 7);

  // 1. Staff
  for (const s of INITIAL_STAFF) {
    await setDoc(doc(db, 'staff', s.id), s, { merge: true });
    console.log(`  ✓ Written staff/${s.id} (${s.name})`);
  }

  // 2. Office Settings
  await setDoc(doc(db, 'officeSettings', 'default'), DEFAULT_OFFICE_SETTINGS, { merge: true });
  console.log(`  ✓ Written officeSettings/default (Office Timings & Shifts)`);

  // 3. Attendance Punch Records
  const attendance1 = {
    id: `att-ARC-STF-001-${todayStr}`,
    staffId: 'ARC-STF-001',
    staffName: 'Aarav Sharma',
    staffPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    designation: 'Lead Full-Stack Architect',
    attendanceDate: todayStr,
    month: monthStr,
    year: 2026,
    checkIn: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    checkOut: null,
    timezone: 'Asia/Kolkata',
    status: 'working',
    totalWorkingMinutes: 120,
    overtimeMinutes: 0,
    punchQuote: "The only way to do great work is to love what you do. Make today's code count.",
    adminEdited: false,
  };
  await setDoc(doc(db, 'attendance', attendance1.id), attendance1, { merge: true });
  console.log(`  ✓ Written attendance/${attendance1.id}`);

  // 4. Adjustments Audit
  const audit1 = {
    id: 'aud-seed-001',
    attendanceId: `att-ARC-STF-001-${todayStr}`,
    staffId: 'ARC-STF-001',
    staffName: 'Aarav Sharma',
    reason: 'Initial system audit configuration',
    editedBy: 'admin@arcanum.ae',
    editedAt: new Date().toISOString(),
    source: 'admin_portal',
  };
  await setDoc(doc(db, 'attendanceAdjustments', audit1.id), audit1, { merge: true });
  console.log(`  ✓ Written attendanceAdjustments/${audit1.id}`);

  console.log(`\n======================================================`);
  console.log(`  SUCCESS: Firebase Firestore successfully populated!`);
  console.log(`======================================================\n`);
}

seed().catch(console.error);
