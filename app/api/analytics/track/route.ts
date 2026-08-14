import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, increment } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics_backup.json');

interface AnalyticsBackupData {
  lifetimeVisitors?: number;
  lifetimePageViews?: number;
  days?: Record<string, { visitors: number; pageViews: number; visitorIds: string[]; sessionIds?: string[] }>;
}

function getLocalAnalytics(): AnalyticsBackupData {
  try {
    if (fs.existsSync(LOCAL_ANALYTICS_FILE)) {
      const raw = fs.readFileSync(LOCAL_ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.days) {
        return {
          lifetimeVisitors: 0,
          lifetimePageViews: 0,
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

function saveLocalAnalytics(data: AnalyticsBackupData) {
  try {
    const dir = path.dirname(LOCAL_ANALYTICS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Analytics Local Save Error]', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);

    // Read payload body if available
    let visitorId = '';
    let sessionId = '';
    try {
      const body = await req.json();
      visitorId = body.visitorId || '';
      sessionId = body.sessionId || '';
    } catch (e) {
      // Body empty
    }

    const forwarded = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const clientIp = forwarded.split(',')[0].trim();
    const visitorKey = visitorId || clientIp;
    const sessionKey = sessionId || `sess_${visitorKey}_${Date.now()}_${Math.random()}`;

    // 1. Update local persistent storage
    const store = getLocalAnalytics();
    if (!store.days) store.days = {};

    let isNewSessionToday = false;

    if (!store.days[todayStr]) {
      store.days[todayStr] = {
        visitors: 1,
        pageViews: 1,
        visitorIds: [visitorKey],
        sessionIds: [sessionKey],
      };
      store.lifetimeVisitors = (store.lifetimeVisitors || 0) + 1;
      store.lifetimePageViews = (store.lifetimePageViews || 0) + 1;
      isNewSessionToday = true;
    } else {
      // Always increment page views on every page view or refresh!
      store.days[todayStr].pageViews = (store.days[todayStr].pageViews || 0) + 1;
      store.lifetimePageViews = (store.lifetimePageViews || 0) + 1;

      if (!store.days[todayStr].visitorIds) store.days[todayStr].visitorIds = [];
      if (!store.days[todayStr].sessionIds) store.days[todayStr].sessionIds = [];

      // Check if session is new for today or device is new
      if (!store.days[todayStr].sessionIds.includes(sessionKey)) {
        store.days[todayStr].sessionIds.push(sessionKey);
        store.days[todayStr].visitors = (store.days[todayStr].visitors || 0) + 1;
        store.lifetimeVisitors = (store.lifetimeVisitors || 0) + 1;
        isNewSessionToday = true;
      }

      if (!store.days[todayStr].visitorIds.includes(visitorKey)) {
        store.days[todayStr].visitorIds.push(visitorKey);
      }
    }

    saveLocalAnalytics(store);

    // 2. Sync to Firebase Firestore
    try {
      // Daily record sync
      const docRef = doc(db, 'analytics_daily', todayStr);
      await setDoc(
        docRef,
        {
          date: todayStr,
          pageViews: increment(1),
          visitors: isNewSessionToday ? increment(1) : increment(0),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Global totals summary sync
      const summaryRef = doc(db, 'analytics_summary', 'global_totals');
      await setDoc(
        summaryRef,
        {
          totalPageViews: increment(1),
          totalVisitors: isNewSessionToday ? increment(1) : increment(0),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (firebaseErr: any) {
      console.info('[Analytics Firestore Sync Note]', firebaseErr?.message || 'Using local analytics store.');
    }

    return NextResponse.json({
      success: true,
      date: todayStr,
      isNewSessionToday,
      todayVisitors: store.days[todayStr].visitors,
      todayPageViews: store.days[todayStr].pageViews,
      totalVisitors: store.lifetimeVisitors,
      totalPageViews: store.lifetimePageViews,
    });
  } catch (error: any) {
    console.error('[API /api/analytics/track Exception]', error);
    return NextResponse.json({ success: false, error: error?.message || 'Track failed' }, { status: 500 });
  }
}
