'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    router.replace(`/demo${query ? `?${query}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-white font-mono text-sm">
      Redirecting to Demo Portal...
    </div>
  );
}

export default function BookDemoRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}
