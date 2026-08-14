import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Local backup file for analytics persistence
const LOCAL_ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics_backup.json');

function getLocalAnalytics(): Record<string, { visitors: number; pageViews: number; ips: string[] }> {
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

function saveLocalAnalytics(data: Record<string, { visitors: number; pageViews: number; ips: string[] }>) {
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
    const forwarded = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const clientIp = forwarded.split(',')[0].trim();

    // 1. Update local persistent storage
    const localData = getLocalAnalytics();
    if (!localData[todayStr]) {
      localData[todayStr] = { visitors: 1, pageViews: 1, ips: [clientIp] };
    } else {
      localData[todayStr].pageViews = (localData[todayStr].pageViews || 0) + 1;
      if (!localData[todayStr].ips) localData[todayStr].ips = [];
      if (!localData[todayStr].ips.includes(clientIp)) {
        localData[todayStr].ips.push(clientIp);
        localData[todayStr].visitors = (localData[todayStr].visitors || 0) + 1;
      }
    }
    saveLocalAnalytics(localData);

    const isNewVisitorToday = localData[todayStr].ips.filter((ip) => ip === clientIp).length <= 1;

    // 2. Sync to Firebase Firestore
    try {
      const docRef = doc(db, 'analytics_daily', todayStr);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(
          docRef,
          {
            pageViews: increment(1),
            visitors: isNewVisitorToday ? increment(1) : increment(0),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } else {
        await setDoc(docRef, {
          date: todayStr,
          visitors: localData[todayStr].visitors || 1,
          pageViews: localData[todayStr].pageViews || 1,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (firebaseErr: any) {
      console.info('[Analytics Firestore Sync Note]', firebaseErr?.message || 'Using persistent local analytics store.');
    }

    return NextResponse.json({
      success: true,
      date: todayStr,
      visitors: localData[todayStr].visitors,
      pageViews: localData[todayStr].pageViews,
    });
  } catch (error: any) {
    console.error('[API /api/analytics/track Exception]', error);
    return NextResponse.json({ success: false, error: error?.message || 'Track failed' }, { status: 500 });
  }
}
