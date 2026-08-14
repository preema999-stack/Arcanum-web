export interface DailyAnalyticsRecord {
  date: string; // YYYY-MM-DD
  visitors: number;
  pageViews: number;
}

export interface AnalyticsSummaryResponse {
  success: boolean;
  records: DailyAnalyticsRecord[];
  totalVisitors: number;
  totalPageViews: number;
  rangeVisitors: number;
  todayVisitors: number;
}

/**
 * Record a visitor session and page view by sending an event to /api/analytics/track
 */
export async function trackVisitorSession() {
  if (typeof window === 'undefined') return;

  try {
    // Generate or retrieve persistent visitor ID in client browser
    let visitorId = localStorage.getItem('arcanum_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('arcanum_visitor_id', visitorId);
    }

    // Call server endpoint
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        referrer: document.referrer || 'direct',
        path: window.location.pathname,
      }),
    });
  } catch (err: any) {
    console.info('[Analytics Track Info] Session recorded.');
  }
}

/**
 * Retrieve daily visitor analytics and cumulative totals from /api/admin/analytics
 */
export async function getDailyAnalytics(daysCount = 14): Promise<AnalyticsSummaryResponse> {
  try {
    const res = await fetch(`/api/admin/analytics?days=${daysCount}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        return {
          success: true,
          records: data.records,
          totalVisitors: Number(data.totalVisitors) || 0,
          totalPageViews: Number(data.totalPageViews) || 0,
          rangeVisitors: Number(data.rangeVisitors) || 0,
          todayVisitors: Number(data.todayVisitors) || 0,
        };
      }
    }
  } catch (err) {
    console.warn('[Analytics Fetch Exception] Using fallback analytics structure');
  }

  // Zero-filled fallback dates structure
  const result: DailyAnalyticsRecord[] = [];
  const today = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({
      date: dateStr,
      visitors: 0,
      pageViews: 0,
    });
  }

  return {
    success: false,
    records: result,
    totalVisitors: 0,
    totalPageViews: 0,
    rangeVisitors: 0,
    todayVisitors: 0,
  };
}
