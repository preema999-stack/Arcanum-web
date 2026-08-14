'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisitorSession } from '@/lib/analyticsService';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Automatically track visitor sessions on initial mount and route changes (excluding admin panel)
    if (pathname && !pathname.startsWith('/admin')) {
      trackVisitorSession();
    }
  }, [pathname]);

  return null;
}
