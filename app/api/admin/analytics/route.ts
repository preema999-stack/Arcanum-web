import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics_backup.json');

function getLocalAnalytics(): Record<string, { visitors: number; pageViews: number }> {
  try {
    if (fs.existsSync(LOCAL_ANALYTICS_FILE)) {
      const data = fs.readFileSync(LOCAL_ANALYTICS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Analytics Local Read Error]', err);
  }
  return {};
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const daysCount = parseInt(searchParams.get('days') || '14', 10);

    const map = new Map<string, { date: string; visitors: number; pageViews: number }>();

    // 1. Read from local persistent backup first
    const localData = getLocalAnalytics();
    Object.entries(localData).forEach(([dateStr, val]) => {
      map.set(dateStr, {
        date: dateStr,
        visitors: Number(val.visitors) || 0,
        pageViews: Number(val.pageViews) || 0,
      });
    });

    // 2. Fetch and merge from Firestore 'analytics_daily'
    try {
      const colRef = collection(db, 'analytics_daily');
      const q = query(colRef, orderBy('date', 'desc'), limit(daysCount));
      const snapshot = await getDocs(q);

      snapshot.forEach((d) => {
        const data = d.data();
        const existing = map.get(d.id) || { date: d.id, visitors: 0, pageViews: 0 };
        map.set(d.id, {
          date: d.id,
          visitors: Math.max(existing.visitors, Number(data.visitors) || 0),
          pageViews: Math.max(existing.pageViews, Number(data.pageViews) || 0),
        });
      });
    } catch (firebaseErr: any) {
      console.info('[Analytics Firestore Query Fallback] Using local storage data.');
    }

    // 3. Build array for last N days (chronological order)
    const records: { date: string; visitors: number; pageViews: number }[] = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      if (map.has(dateStr)) {
        records.push(map.get(dateStr)!);
      } else {
        records.push({
          date: dateStr,
          visitors: 0,
          pageViews: 0,
        });
      }
    }

    const totalVisitors = records.reduce((acc, r) => acc + r.visitors, 0);
    const totalPageViews = records.reduce((acc, r) => acc + r.pageViews, 0);
    const todayRecord = records[records.length - 1];
    const todayVisitors = todayRecord ? todayRecord.visitors : 0;

    return NextResponse.json({
      success: true,
      records,
      totalVisitors,
      totalPageViews,
      todayVisitors,
    });
  } catch (error: any) {
    console.error('[API /api/admin/analytics Exception]', error);
    return NextResponse.json({ success: false, error: error?.message || 'Query failed' }, { status: 500 });
  }
}
