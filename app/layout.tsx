import type { Metadata } from 'next';
import './globals.css';
import { LenisProvider } from '@/components/LenisProvider';
import { AuthProvider } from '@/lib/authContext';
import { CmsProvider } from '@/lib/cmsContext';

export const metadata: Metadata = {
  title: 'Arcanum Information Technology — Enterprise Software & Digital Architecture',
  description:
    'Arcanum Information Technology is a professionally managed UAE software firm delivering enterprise ERPs, core banking integrations, clinical management systems, and Oracle Forms modernizations.',
  keywords: [
    'Arcanum IT',
    'Arcanum Information Technology',
    'Enterprise Software UAE',
    'ERP Software',
    'Oracle Forms Modernization',
    'Core Banking Software',
    'School Management System',
    'Payroll Software UAE',
    'Transa Money',
    'OMS Organization Management',
  ],
  authors: [{ name: 'Arcanum Information Technology' }],
  openGraph: {
    title: 'Arcanum Information Technology — Enterprise Software & Digital Architecture',
    description:
      'Professionally managed software development firm delivering innovative enterprise software across ERP, Banking, Healthcare, Education, and Cloud Infrastructure.',
    url: 'https://arcanum.ae',
    siteName: 'Arcanum Information Technology',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-white antialiased selection:bg-[#2384ba]/30 selection:text-[#2384ba]">
        <AuthProvider>
          <CmsProvider>
            <LenisProvider>{children}</LenisProvider>
          </CmsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
