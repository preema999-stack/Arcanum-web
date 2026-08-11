'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroTopSection } from '@/components/HeroTopSection';
import { AboutSection } from '@/components/AboutSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { LocationsSection } from '@/components/LocationsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { BrochureModal } from '@/components/BrochureModal';
import { GsapPreloader } from '@/components/GsapPreloader';

export default function Home() {
  const [brochuresOpen, setBrochuresOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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

      <SolutionsSection onOpenBrochures={() => setBrochuresOpen(true)} />

      <LocationsSection onOpenContact={() => setContactOpen(true)} />

      <ContactSection />

      <Footer
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      <BrochureModal isOpen={brochuresOpen} onClose={() => setBrochuresOpen(false)} />

      {contactOpen && (
        <ContactSection isOpenModal onCloseModal={() => setContactOpen(false)} />
      )}
    </main>
  );
}
