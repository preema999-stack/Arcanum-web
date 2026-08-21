'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ARCANUM_MODULES, ModuleItem } from '@/data/arcanumData';
import { useCms } from '@/lib/cmsContext';
import { getProductDetails, ProductDetailItem } from '@/data/productDetailsData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { BrochureModal } from '@/components/BrochureModal';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { ProductPageView } from '@/components/ProductPageView';

export default function ProductDetailPage() {
  const params = useParams();
  const { content } = useCms();
  const rawId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [brochuresOpen, setBrochuresOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedModuleForContact, setSelectedModuleForContact] = useState<string>('');

  const fallbackModule: ModuleItem = {
    id: rawId || 'custom-solution',
    title: 'Enterprise Solution',
    category: 'Enterprise',
    subtitle: 'Custom Architecture Subsystem',
    description: 'Comprehensive enterprise-grade solution engineered with modular microservices and automated workflows.',
    features: ['Modular Architecture', 'High Throughput API', 'Strict RBAC Security'],
    iconName: 'Building2',
  };

  const modulesList = Array.isArray(content?.modules) && content.modules.length > 0 ? content.modules : ARCANUM_MODULES;
  const currentModule: ModuleItem =
    (modulesList && modulesList.find(
      (m) =>
        m.id?.toLowerCase() === rawId?.toLowerCase() ||
        m.slug?.toLowerCase() === rawId?.toLowerCase() ||
        m.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId?.toLowerCase()
    )) ||
    (ARCANUM_MODULES && ARCANUM_MODULES.find(
      (m) =>
        m.id?.toLowerCase() === rawId?.toLowerCase() ||
        m.slug?.toLowerCase() === rawId?.toLowerCase()
    )) ||
    (modulesList && modulesList[0]) ||
    (ARCANUM_MODULES && ARCANUM_MODULES[0]) ||
    fallbackModule;

  const defaultDetails = getProductDetails(currentModule);
  const productDetails: ProductDetailItem = currentModule.pageDetails
    ? {
        ...defaultDetails,
        ...currentModule.pageDetails,
        heroImage: currentModule.pageDetails.heroImage || currentModule.imageSrc || defaultDetails.heroImage,
        ctaPrimaryText: currentModule.pageDetails.ctaPrimaryText || 'Book a Demo / Discovery',
        ctaSecondaryText: currentModule.pageDetails.ctaSecondaryText || 'Download PDF Spec',
        ctaSecondaryUrl: currentModule.pageDetails.ctaSecondaryUrl || currentModule.brochureUrl || '',
        showSecondaryCta: currentModule.pageDetails.showSecondaryCta !== false && currentModule.pageDetails.sectionVisibility?.secondaryCta !== false,
        brochureUrl: currentModule.pageDetails.brochureUrl || currentModule.brochureUrl || '',
        sectionVisibility: {
          hero: currentModule.pageDetails.sectionVisibility?.hero !== false,
          secondaryCta: currentModule.pageDetails.sectionVisibility?.secondaryCta !== false && currentModule.pageDetails.showSecondaryCta !== false,
          metrics: currentModule.pageDetails.sectionVisibility?.metrics !== false,
          widget: currentModule.pageDetails.sectionVisibility?.widget !== false,
          submodules: currentModule.pageDetails.sectionVisibility?.submodules !== false,
          industries: currentModule.pageDetails.sectionVisibility?.industries !== false,
          compliance: currentModule.pageDetails.sectionVisibility?.compliance !== false,
          faqs: currentModule.pageDetails.sectionVisibility?.faqs !== false,
          related: currentModule.pageDetails.sectionVisibility?.related !== false,
          ...(currentModule.pageDetails.sectionVisibility || {}),
        },
        customTitles: {
          ...(defaultDetails.customTitles || {}),
          ...(currentModule.pageDetails.customTitles || {}),
        },
        architecture: {
          ...defaultDetails.architecture,
          ...(currentModule.pageDetails.architecture || {}),
        },
        mockData: {
          ...defaultDetails.mockData,
          ...(currentModule.pageDetails.mockData || {}),
          records: currentModule.pageDetails.mockData?.records?.length ? currentModule.pageDetails.mockData.records : defaultDetails.mockData.records,
          systemLogs: currentModule.pageDetails.mockData?.systemLogs?.length ? currentModule.pageDetails.mockData.systemLogs : defaultDetails.mockData.systemLogs,
          workflowSteps: currentModule.pageDetails.mockData?.workflowSteps?.length ? currentModule.pageDetails.mockData.workflowSteps : defaultDetails.mockData.workflowSteps,
          codeDiff: currentModule.pageDetails.mockData?.codeDiff || defaultDetails.mockData.codeDiff,
        },
        metrics: currentModule.pageDetails.metrics?.length ? currentModule.pageDetails.metrics : defaultDetails.metrics,
        subModules: currentModule.pageDetails.subModules?.length ? currentModule.pageDetails.subModules : defaultDetails.subModules,
        faqs: currentModule.pageDetails.faqs?.length ? currentModule.pageDetails.faqs : defaultDetails.faqs,
        targetIndustry: currentModule.pageDetails.targetIndustry?.length ? currentModule.pageDetails.targetIndustry : defaultDetails.targetIndustry,
        deploymentModes: currentModule.pageDetails.deploymentModes?.length ? currentModule.pageDetails.deploymentModes : defaultDetails.deploymentModes,
        complianceList: currentModule.pageDetails.complianceList?.length ? currentModule.pageDetails.complianceList : defaultDetails.complianceList,
      }
    : defaultDetails;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentModule.id]);

  const handleOpenContact = (modTitle?: string) => {
    setSelectedModuleForContact(modTitle || currentModule.title);
    setContactOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-[#2384ba]/30 selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => handleOpenContact()}
      />

      {/* Main Full Dynamic Solution Page View */}
      <ProductPageView
        module={currentModule}
        productDetails={productDetails}
        modulesList={modulesList}
        isPreview={false}
        onOpenContact={(title) => handleOpenContact(title)}
        onOpenBrochures={() => setBrochuresOpen(true)}
      />

      {/* Call to Action Banner */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0b1120] to-slate-950 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="font-mono text-xs text-[#2384ba] uppercase tracking-[0.25em] font-bold">
            NEXT GENERATION ENTERPRISE ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Ready to Deploy {currentModule.title}?
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Schedule a technical discovery session with our lead system architects to assess migration paths, API contracts, and dedicated instance topology.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/demo?product=${currentModule.slug || currentModule.id}`}
              className="px-8 py-4 rounded-xl bg-[#2384ba] hover:bg-[#1b6ca1] text-white font-mono text-sm font-bold transition-all shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Book Dedicated Demo</span>
              <span className="text-cyan-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenBrochures={() => setBrochuresOpen(true)}
        onOpenContact={() => handleOpenContact()}
        onSelectHub={() => {}}
      />
      <WhatsAppWidget />

      {/* Targeted Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
            <ContactSection initialModule={selectedModuleForContact || currentModule.title} />
          </div>
        </div>
      )}
    </main>
  );
}
