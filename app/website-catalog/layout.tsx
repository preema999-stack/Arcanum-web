import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Project Catalog & Systems Showcase | Arcanum IT',
  description:
    'Independent client showcase and digital portfolio of enterprise systems, custom platforms, and web applications engineered by Arcanum.',
  openGraph: {
    title: 'Client Project Catalog | Arcanum IT',
    description: 'Independent client showcase portfolio of web systems and digital platforms.',
    type: 'website',
  },
};

export default function WebsiteCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fafc] text-slate-900 h-screen w-screen overflow-hidden selection:bg-blue-600/15 selection:text-blue-900 antialiased">
      {children}
    </div>
  );
}
