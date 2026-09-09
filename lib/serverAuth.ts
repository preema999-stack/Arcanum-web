import { NextRequest, NextResponse } from 'next/server';

const IDENTITY_TOOLKIT_LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

export interface VerifiedAdminUser {
  uid: string;
  email: string;
}

/**
 * Verify a Firebase Auth ID token sent as `Authorization: Bearer <idToken>`.
 * Uses Google's Identity Toolkit REST API so no firebase-admin dependency is required.
 * Returns the verified user, or null when the request is unauthenticated/invalid.
 */
export async function verifyAdminRequest(req: NextRequest): Promise<VerifiedAdminUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token || !apiKey) return null;

  try {
    const res = await fetch(`${IDENTITY_TOOLKIT_LOOKUP_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.users?.[0];
    if (!user?.localId) return null;

    const email: string = user.email || '';

    // Optional allowlist: set ADMIN_EMAILS="a@x.com,b@y.com" to restrict access further
    const allowlist = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length > 0 && !allowlist.includes(email.toLowerCase())) {
      console.warn(`[Admin Auth] User ${email} is authenticated but not in ADMIN_EMAILS allowlist.`);
      return null;
    }

    return { uid: user.localId, email };
  } catch (err: any) {
    console.warn('[Admin Auth] Token verification failed:', err?.message || err);
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: 'Unauthorized. Administrator authentication required.' },
    { status: 401 }
  );
}
