import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC8XrjDtyeCeCwFRDNJ3S05UujDMeCdLyk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'arcanum-4e385.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'arcanum-4e385',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'arcanum-4e385.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '955579161117',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:955579161117:web:03e5f44e8d1c928eab44f4',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-QQZGDC5J0Y',
};

async function purge() {
  console.log(`\n======================================================`);
  console.log(`  PURGING MOCK ATTENDANCE & STAFF DATA FROM FIRESTORE`);
  console.log(`======================================================\n`);

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 1. Purge staff collection
  const staffSnap = await getDocs(collection(db, 'staff'));
  for (const d of staffSnap.docs) {
    await deleteDoc(doc(db, 'staff', d.id));
    console.log(`  ✓ Deleted staff/${d.id}`);
  }

  // 2. Purge attendance collection
  const attSnap = await getDocs(collection(db, 'attendance'));
  for (const d of attSnap.docs) {
    await deleteDoc(doc(db, 'attendance', d.id));
    console.log(`  ✓ Deleted attendance/${d.id}`);
  }

  // 3. Purge attendanceAdjustments collection
  const auditSnap = await getDocs(collection(db, 'attendanceAdjustments'));
  for (const d of auditSnap.docs) {
    await deleteDoc(doc(db, 'attendanceAdjustments', d.id));
    console.log(`  ✓ Deleted attendanceAdjustments/${d.id}`);
  }

  console.log(`\n======================================================`);
  console.log(`  SUCCESS: Mock data purged. Firestore is 100% clean!`);
  console.log(`======================================================\n`);
}

purge().catch(console.error);
