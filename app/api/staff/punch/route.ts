import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getTodayDateString, getCurrentMonthString, calculateWorkingMinutes, DEFAULT_TIMEZONE } from '@/lib/timezoneUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, staffId, staffName, timezone, note, quote, customCheckOutTime } = body;

    if (!staffId || !action) {
      return NextResponse.json({ success: false, error: 'Staff ID and action are required.' }, { status: 400 });
    }

    const staffTz = timezone || DEFAULT_TIMEZONE;
    const todayStr = getTodayDateString(staffTz);
    const monthStr = getCurrentMonthString(staffTz);
    const year = Number(todayStr.slice(0, 4));
    const docId = `att-${staffId}-${todayStr}`;

    if (action === 'check-in') {
      let isExisting = false;
      try {
        const existingSnap = await getDoc(doc(db, 'attendance', docId));
        if (existingSnap.exists()) {
          isExisting = true;
        }
      } catch (e) {}

      if (isExisting) {
        return NextResponse.json(
          { success: false, error: `Already checked in for today (${todayStr}).` },
          { status: 400 }
        );
      }

      const nowIso = new Date().toISOString();
      const newRecord = {
        id: docId,
        staffId,
        staffName: staffName || 'Staff Member',
        attendanceDate: todayStr,
        month: monthStr,
        year,
        checkIn: nowIso,
        checkOut: null,
        timezone: staffTz,
        status: 'working',
        totalWorkingMinutes: 0,
        overtimeMinutes: 0,
        punchQuote: quote || '',
        adminEdited: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      try {
        await setDoc(doc(db, 'attendance', docId), {
          ...newRecord,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (fsErr) {
        console.warn('[Punch API] Firestore write fallback:', fsErr);
      }

      return NextResponse.json({ success: true, record: newRecord });
    } else if (action === 'check-out') {
      const nowIso = new Date().toISOString();
      const checkOutIso = customCheckOutTime || nowIso;
      let checkInTime = new Date(Date.now() - 8 * 3600 * 1000).toISOString();

      try {
        const snap = await getDoc(doc(db, 'attendance', docId));
        if (snap.exists()) {
          checkInTime = snap.data()?.checkIn || checkInTime;
        }
      } catch (e) {}

      const { totalMinutes, overtimeMinutes } = calculateWorkingMinutes(checkInTime, checkOutIso);
      const newStatus = overtimeMinutes > 0 ? 'overtime' : 'checked_out';

      const updatePayload = {
        checkOut: checkOutIso,
        totalWorkingMinutes: totalMinutes,
        overtimeMinutes: overtimeMinutes,
        status: newStatus,
        checkoutNote: note ? note.trim() : '',
        updatedAt: nowIso,
      };

      try {
        await updateDoc(doc(db, 'attendance', docId), {
          ...updatePayload,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {}

      return NextResponse.json({
        success: true,
        record: { id: docId, staffId, checkIn: checkInTime, ...updatePayload },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[API Punch Error]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error processing punch.' },
      { status: 500 }
    );
  }
}
