'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroTopSection } from '@/components/HeroTopSection';
import { AboutSection } from '@/components/AboutSection';
import { ProductShowcaseSection } from '@/components/ProductShowcaseSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { LocationsSection, LOCATION_HUBS } from '@/components/LocationsSection';
import { scrollToId } from '@/components/scrollTo';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { BrochureModal } from '@/components/BrochureModal';
import { GsapPreloader } from '@/components/GsapPreloader';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { trackVisitorSession } from '@/lib/analyticsService';

export default function Home() {
  const [brochuresOpen, setBrochuresOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedHubId, setSelectedHubId] = useState<string>(LOCATION_HUBS[0].id);

  useEffect(() => {
    trackVisitorSession();
  }, []);

  const handleSelectHub = (id: string) => {
    setSelectedHubId(id);
    scrollToId('locations');
  };

  return (
    <main className="relative min-h-screen bg-[#0f172a] font-sans">
      {/* GSAP Website Entrance Preloader Animation */}
      <GsapPreloader />

      <Header
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      <HeroTopSection onOpenContact={() => setContactOpen(true)} />

      <AboutSection />

      <ProductShowcaseSection />

      <SolutionsSection onOpenBrochures={() => setBrochuresOpen(true)} />

      <LocationsSection
        selectedHubId={selectedHubId}
        onSelectHub={setSelectedHubId}
        onOpenContact={() => setContactOpen(true)}
      />

      <ContactSection />

      <Footer
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onSelectHub={handleSelectHub}
      />

      {/* Floating Theme-Matched WhatsApp Widget */}
      <WhatsAppWidget />

      {contactOpen && (
        <ContactSection isOpenModal onCloseModal={() => setContactOpen(false)} />
      )}
    </main>
  );
}
