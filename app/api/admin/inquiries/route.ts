import { NextRequest, NextResponse } from 'next/server';
import { getRecentInquiries } from '@/lib/firebaseService';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminUser = await verifyAdminRequest(req);
  if (!adminUser) return unauthorizedResponse();

  try {
    const inquiries = await getRecentInquiries(100);
    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error: any) {
    console.error('[API /api/admin/inquiries Exception]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
