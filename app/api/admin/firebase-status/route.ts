import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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

  const results: Record<string, { status: 'connected' | 'error'; count: number; error?: string }> = {};

  for (const col of collectionsToCheck) {
    try {
      const snap = await getDocs(collection(db, col));
      results[col] = {
        status: 'connected',
        count: snap.size,
      };
    } catch (err: any) {
      results[col] = {
        status: 'error',
        count: 0,
        error: err?.message || 'Permission denied or unreachable',
      };
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    projectId: 'arcanum-4e385',
    collections: results,
  });
}
