import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics_backup.json');

interface LocalBackupSchema {
  lifetimeVisitors?: number;
  lifetimePageViews?: number;
  days?: Record<string, { visitors: number; pageViews: number }>;
}

function getLocalAnalytics(): LocalBackupSchema {
  try {
    if (fs.existsSync(LOCAL_ANALYTICS_FILE)) {
      const data = fs.readFileSync(LOCAL_ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.days) {
        return {
          lifetimeVisitors: Object.values(parsed as Record<string, any>).reduce((acc, v: any) => acc + (Number(v?.visitors) || 0), 0),
          lifetimePageViews: Object.values(parsed as Record<string, any>).reduce((acc, v: any) => acc + (Number(v?.pageViews) || 0), 0),
          days: parsed,
        };
      }
      return parsed;
    }
  } catch (err) {
    console.warn('[Analytics Local Read Error]', err);
  }
  return { lifetimeVisitors: 0, lifetimePageViews: 0, days: {} };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const daysCount = parseInt(searchParams.get('days') || '14', 10);

    const map = new Map<string, { date: string; visitors: number; pageViews: number }>();

    // 1. Read local backup
    const localStore = getLocalAnalytics();
    const daysData = localStore.days || {};

    Object.entries(daysData).forEach(([dateStr, val]) => {
      map.set(dateStr, {
        date: dateStr,
        visitors: Number(val.visitors) || 0,
        pageViews: Number(val.pageViews) || 0,
      });
    });

    // Calculate sum of all days in storage for accurate cumulative fallback
    let allTimeVisitorsFromDays = 0;
    let allTimePageViewsFromDays = 0;
    map.forEach((v) => {
      allTimeVisitorsFromDays += v.visitors;
      allTimePageViewsFromDays += v.pageViews;
    });

    let firestoreTotalVisitors = 0;
    let firestoreTotalPageViews = 0;

    // 2. Fetch Firestore daily records & global summary totals
    try {
      // Fetch daily records for range
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

      // Fetch global totals summary document if present
      const summarySnap = await getDoc(doc(db, 'analytics_summary', 'global_totals'));
      if (summarySnap.exists()) {
        const sData = summarySnap.data();
        firestoreTotalVisitors = Number(sData.totalVisitors) || 0;
        firestoreTotalPageViews = Number(sData.totalPageViews) || 0;
      }
    } catch (firebaseErr: any) {
      console.info('[Analytics Firestore Query Note] Using persistent analytics store.');
    }

    // 3. Build chronological range array
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

    const rangeVisitors = records.reduce((acc, r) => acc + r.visitors, 0);
    const rangePageViews = records.reduce((acc, r) => acc + r.pageViews, 0);
    const todayRecord = records[records.length - 1];
    const todayVisitors = todayRecord ? todayRecord.visitors : 0;

    const totalVisitors = Math.max(localStore.lifetimeVisitors || 0, allTimeVisitorsFromDays, firestoreTotalVisitors, rangeVisitors);
    const totalPageViews = Math.max(localStore.lifetimePageViews || 0, allTimePageViewsFromDays, firestoreTotalPageViews, rangePageViews);

    return NextResponse.json({
      success: true,
      records,
      totalVisitors,
      totalPageViews,
      rangeVisitors,
      todayVisitors,
    });
  } catch (error: any) {
    console.error('[API /api/admin/analytics Exception]', error);
    return NextResponse.json({ success: false, error: error?.message || 'Query failed' }, { status: 500 });
  }
}
