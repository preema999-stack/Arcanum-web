import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/serverAuth';
import { calculateWorkingMinutes } from '@/lib/timezoneUtils';

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) return unauthorizedResponse();

    const body = await req.json();
    const { attendanceId, updatedValues, reason } = body;

    if (!attendanceId || !reason) {
      return NextResponse.json(
        { success: false, error: 'attendanceId and mandatory audit reason are required.' },
        { status: 400 }
      );
    }

    const recRef = doc(db, 'attendance', attendanceId);
    const snap = await getDoc(recRef);

    if (!snap.exists()) {
      return NextResponse.json({ success: false, error: 'Attendance record not found.' }, { status: 404 });
    }

    const existing = snap.data();
    const newCheckIn = updatedValues.checkIn || existing.checkIn;
    const newCheckOut = updatedValues.checkOut !== undefined ? updatedValues.checkOut : existing.checkOut;

    const { totalMinutes, overtimeMinutes } = calculateWorkingMinutes(newCheckIn, newCheckOut);

    const fullUpdate = {
      ...updatedValues,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      totalWorkingMinutes: totalMinutes,
      overtimeMinutes: overtimeMinutes,
      adminEdited: true,
      lastAdjustmentReason: reason.trim(),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(recRef, fullUpdate);

    // Audit trail write
    const auditId = `aud-admin-${Date.now()}`;
    const auditEntry = {
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
      editedBy: admin.email,
      editedAt: new Date().toISOString(),
      source: 'admin_portal',
    };

    await setDoc(doc(db, 'attendanceAdjustments', auditId), auditEntry);

    return NextResponse.json({ success: true, audit: auditEntry, record: { ...existing, ...fullUpdate } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Adjustment failed.' }, { status: 500 });
  }
}
