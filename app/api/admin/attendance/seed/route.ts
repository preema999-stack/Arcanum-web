import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { INITIAL_STAFF_SEEDS } from '@/lib/staffService';
import { DEFAULT_OFFICE_SETTINGS } from '@/lib/officeSettingsService';
import { getTodayDateString, getCurrentMonthString } from '@/lib/timezoneUtils';

export async function POST(req: NextRequest) {
  try {
    const todayStr = getTodayDateString('Asia/Kolkata');
    const monthStr = getCurrentMonthString('Asia/Kolkata');
    const seededCollections: string[] = [];

    // 1. Seed 'staff' collection
    for (const staff of INITIAL_STAFF_SEEDS) {
      await setDoc(
        doc(db, 'staff', staff.id),
        {
          ...staff,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    seededCollections.push('staff');

    // 2. Seed 'officeSettings' collection
    await setDoc(
      doc(db, 'officeSettings', 'default'),
      {
        ...DEFAULT_OFFICE_SETTINGS,
        updatedAt: serverTimestamp(),
        updatedBy: 'admin@arcanum.ae',
      },
      { merge: true }
    );
    seededCollections.push('officeSettings');

    // 3. Seed 'attendance' collection with realistic check-in / check-out data
    const sampleAttendanceRecords = [
      {
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
      },
      {
        id: `att-ARC-STF-002-${todayStr}`,
        staffId: 'ARC-STF-002',
        staffName: 'Priya Nair',
        staffPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        designation: 'Senior UI/UX & Motion Designer',
        attendanceDate: todayStr,
        month: monthStr,
        year: 2026,
        checkIn: new Date(new Date().setHours(9, 15, 0, 0)).toISOString(),
        checkOut: null,
        timezone: 'Asia/Kolkata',
        status: 'working',
        totalWorkingMinutes: 75,
        overtimeMinutes: 0,
        punchQuote: "Simplicity is prerequisite for reliability. Build clean, build bold today.",
        adminEdited: false,
      },
      {
        id: `att-ARC-STF-003-${todayStr}`,
        staffId: 'ARC-STF-003',
        staffName: 'Rohan Varma',
        staffPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        designation: 'Cloud & DevOps Engineer',
        attendanceDate: todayStr,
        month: monthStr,
        year: 2026,
        checkIn: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
        checkOut: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
        timezone: 'Asia/Kolkata',
        status: 'checked_out',
        totalWorkingMinutes: 570,
        overtimeMinutes: 90,
        checkoutNote: 'Completed Kubernetes cluster migration for UAE financial client.',
        punchQuote: 'Make it work, make it right, make it fast.',
        adminEdited: false,
      },
      {
        id: `att-ARC-STF-004-prior`,
        staffId: 'ARC-STF-004',
        staffName: 'Ananya Patel',
        staffPhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
        designation: 'AI / ML Solutions Specialist',
        attendanceDate: '2026-08-22',
        month: monthStr,
        year: 2026,
        checkIn: new Date('2026-08-22T03:00:00Z').toISOString(),
        checkOut: null,
        timezone: 'Asia/Kolkata',
        status: 'missing_checkout',
        totalWorkingMinutes: 480,
        overtimeMinutes: 0,
        adminEdited: false,
      },
      {
        id: `att-ARC-STF-005-${todayStr}`,
        staffId: 'ARC-STF-005',
        staffName: 'Tariq Al-Mansoor',
        staffPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        designation: 'Enterprise Client Solutions Lead',
        attendanceDate: todayStr,
        month: monthStr,
        year: 2026,
        checkIn: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
        checkOut: null,
        timezone: 'Asia/Dubai',
        status: 'working',
        totalWorkingMinutes: 180,
        overtimeMinutes: 0,
        punchQuote: 'The best way to predict the future is to invent it.',
        adminEdited: false,
      },
    ];

    for (const record of sampleAttendanceRecords) {
      await setDoc(
        doc(db, 'attendance', record.id),
        {
          ...record,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    seededCollections.push('attendance');

    // 4. Seed 'attendanceAdjustments' collection with an audit trail entry
    const sampleAudit = {
      id: `aud-seed-001`,
      attendanceId: `att-ARC-STF-003-${todayStr}`,
      staffId: 'ARC-STF-003',
      staffName: 'Rohan Varma',
      originalValues: {
        checkIn: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
        checkOut: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
        status: 'checked_out',
      },
      updatedValues: {
        checkOut: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
        overtimeMinutes: 90,
        status: 'checked_out',
      },
      reason: 'Approved 30 minutes overtime for critical client infrastructure release handover.',
      editedBy: 'admin@arcanum.ae',
      editedAt: new Date().toISOString(),
      source: 'admin_portal',
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'attendanceAdjustments', sampleAudit.id), sampleAudit, { merge: true });
    seededCollections.push('attendanceAdjustments');

    return NextResponse.json({
      success: true,
      message: 'Successfully populated and synchronized all attendance collections to Firebase Firestore!',
      seededCollections,
    });
  } catch (error: any) {
    console.error('[Seed Error]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to seed attendance data to Firebase.' },
      { status: 500 }
    );
  }
}
