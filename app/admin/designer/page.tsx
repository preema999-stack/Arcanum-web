'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCms } from '@/lib/cmsContext';
import { ARCANUM_MODULES } from '@/data/arcanumData';

export default function ProductDesignerIndexPage() {
  const router = useRouter();
  const { content } = useCms();

  useEffect(() => {
    const modules = content?.modules && content.modules.length > 0 ? content.modules : ARCANUM_MODULES;
    const firstModule = modules[0] || ARCANUM_MODULES[0];
    const targetId = firstModule.slug || firstModule.id || 'oms';
    router.replace(`/admin/designer/${targetId}`);
  }, [content, router]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center font-mono text-xs">
      <div className="flex items-center space-x-2 text-[#2384ba]">
        <span className="h-4 w-4 border-2 border-[#2384ba] border-t-transparent rounded-full animate-spin"></span>
        <span>Loading Product Page Designer...</span>
      </div>
    </div>
  );
}
