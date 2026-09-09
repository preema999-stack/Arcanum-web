import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/serverAuth';
import { sendEmail } from '@/lib/nodemailerService';

const IDENTITY_TOOLKIT_SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) return unauthorizedResponse();

    const snapshot = await getDocs(collection(db, 'staff'));
    const staffList: any[] = [];
    snapshot.forEach((d) => staffList.push({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, staff: staffList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin && process.env.NODE_ENV === 'production') return unauthorizedResponse();

    const body = await req.json();
    const {
      name,
      email,
      password: customPassword,
      designation,
      department,
      phone,
      emergencyPhone,
      dob,
      photoUrl,
      timezone,
      joiningDate,
      deskNumber,
      sendEmailNotification,
    } = body;

    if (!name || !email || !designation) {
      return NextResponse.json({ success: false, error: 'Name, email, and designation are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = customPassword && customPassword.trim().length >= 6
      ? customPassword.trim()
      : `Arc#${Math.random().toString(36).slice(-6)}!`;

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyC8XrjDtyeCeCwFRDNJ3S05UujDMeCdLyk';
    let authUid = '';

    // 1. Provision Firebase Auth User Account via Identity Toolkit API
    try {
      const authRes = await fetch(`${IDENTITY_TOOLKIT_SIGNUP_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          returnSecureToken: true,
        }),
      });

      const authData = await authRes.json();
      if (authRes.ok && authData.localId) {
        authUid = authData.localId;
      } else if (authData?.error?.message === 'EMAIL_EXISTS') {
        console.log(`[Admin Staff Provisioning] User ${cleanEmail} already exists in Firebase Auth.`);
      } else {
        console.warn('[Admin Staff Provisioning] Auth signup warning:', authData?.error?.message);
      }
    } catch (authErr) {
      console.warn('[Admin Staff Provisioning] Auth signup error:', authErr);
    }

    const staffId = body.id || `ARC-STF-${String(Date.now()).slice(-4)}`;
    const newStaff = {
      id: staffId,
      uid: authUid || '',
      name: name.trim(),
      email: cleanEmail,
      designation: designation.trim(),
      department: department?.trim() || 'Engineering',
      phone: phone?.trim() || '',
      emergencyPhone: emergencyPhone?.trim() || '',
      dob: dob?.trim() || '1995-01-01',
      photoUrl: photoUrl?.trim() || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
      timezone: timezone || 'Asia/Kolkata',
      officeLocation: body.officeLocation || 'Kerala / Kochi Office',
      shiftId: body.shiftId || 'shift-kerala-day',
      shiftName: body.shiftName || 'Kerala General Shift (09:00 - 18:00 IST)',
      status: body.status || 'active',
      joiningDate: joiningDate || new Date().toISOString().slice(0, 10),
      standardWorkHours: body.standardWorkHours || 8,
      deskNumber: deskNumber?.trim() || `Desk-${String(Date.now()).slice(-2)}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // 2. Write to Firestore 'staff' collection
    try {
      await setDoc(doc(db, 'staff', staffId), newStaff);
    } catch (fsErr) {
      console.warn('[Admin Staff Provisioning] Firestore write fallback:', fsErr);
    }

    // 3. Send Credentials Email if requested
    if (sendEmailNotification) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px;">
              <div style="max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 28px; border: 1px solid #334155;">
                <h2 style="color: #2384ba; margin-top: 0;">Arcanum IT Staff Workstation Credentials</h2>
                <p style="color: #cbd5e1; font-size: 14px;">Welcome to the team, <strong>${newStaff.name}</strong>!</p>
                <p style="color: #cbd5e1; font-size: 14px;">Your official attendance and workstation account has been provisioned.</p>
                <div style="background: #0f172a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #334155;">
                  <div style="font-family: monospace; font-size: 12px; color: #94a3b8; margin-bottom: 8px;">LOGIN CREDENTIALS:</div>
                  <div style="font-family: monospace; font-size: 14px; color: #38bdf8; margin-bottom: 6px;">Portal: https://arcanum.ae/staff/login</div>
                  <div style="font-family: monospace; font-size: 14px; color: #ffffff; margin-bottom: 6px;">Email: <strong>${cleanEmail}</strong></div>
                  <div style="font-family: monospace; font-size: 14px; color: #10b981;">Password: <strong>${cleanPassword}</strong></div>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">Please log in upon shift arrival to mark your daily punch-in.</p>
              </div>
            </body>
          </html>
        `;

        await sendEmail({
          to: cleanEmail,
          subject: 'Your Arcanum IT Staff Workstation Credentials',
          html: emailHtml,
        });
      } catch (mailErr) {
        console.warn('[Staff Mail Error]', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      staff: newStaff,
      credentials: {
        email: cleanEmail,
        password: cleanPassword,
      },
    });
  } catch (err: any) {
    console.error('[Admin Staff Create Error]', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
