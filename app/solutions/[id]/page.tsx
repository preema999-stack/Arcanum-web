'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ARCANUM_MODULES, ModuleItem, DEFAULT_SHOWCASE_ITEMS, ShowcaseItem } from '@/data/arcanumData';
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
    title: rawId
      ? rawId.replace(/^product-/, '').split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
      : 'Enterprise Solution',
    category: 'Enterprise',
    subtitle: 'Custom Architecture Subsystem',
    description: 'Comprehensive enterprise-grade solution engineered with modular microservices and automated workflows.',
    features: ['Modular Architecture', 'High Throughput API', 'Strict RBAC Security'],
    iconName: 'Building2',
  };

  const modulesList = Array.isArray(content?.modules) && content.modules.length > 0 ? content.modules : ARCANUM_MODULES;
  const showcaseList: ShowcaseItem[] =
    Array.isArray(content?.showcaseItems) && content.showcaseItems.length > 0
      ? content.showcaseItems
      : DEFAULT_SHOWCASE_ITEMS;

  // 1. Check if rawId matches a solution module in content.modules or ARCANUM_MODULES
  const matchedFromModules = modulesList.find(
    (m) =>
      m.id?.toLowerCase() === rawId?.toLowerCase() ||
      m.slug?.toLowerCase() === rawId?.toLowerCase() ||
      m.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId?.toLowerCase()
  );

  const matchedFromArcanum = !matchedFromModules
    ? ARCANUM_MODULES.find(
        (m) =>
          m.id?.toLowerCase() === rawId?.toLowerCase() ||
          m.slug?.toLowerCase() === rawId?.toLowerCase()
      )
    : null;

  // 2. Check if rawId matches a showcase item (e.g. newly created/edited showcase projects)
  const matchedShowcase =
    !matchedFromModules && !matchedFromArcanum
      ? showcaseList.find(
          (s) =>
            s.id?.toLowerCase() === rawId?.toLowerCase() ||
            s.tabLabel?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId?.toLowerCase() ||
            s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId?.toLowerCase()
        )
      : null;

  let showcaseAsModule: ModuleItem | null = null;
  if (matchedShowcase) {
    const featureNames = matchedShowcase.capabilities?.map((c) => c.title) || [];
    const metricSubmodules =
      matchedShowcase.capabilities?.map((cap, i) => ({
        name: cap.title,
        badge: `Core Capability 0${i + 1}`,
        description: cap.description,
        points: [
          `High-performance ${cap.title.toLowerCase()} implementation`,
          'End-to-end integration and API-driven orchestration',
          'Continuous operational reliability and telemetry monitoring',
        ],
      })) || [];

    const generatedPageDetails: ProductDetailItem = {
      id: matchedShowcase.id,
      heroHeadline: matchedShowcase.title,
      heroHighlight: matchedShowcase.subtitle || 'Architecture & System Specs',
      heroSubtitle: matchedShowcase.subtitle || 'Empower Teams. Deliver Better.',
      executiveSummary:
        matchedShowcase.description ||
        'Enterprise-grade software system engineered with architectural precision, modular microservices, and dedicated security layers for mission-critical operations.',
      heroImage: matchedShowcase.imageSrc || '/hero_erp.jpg',
      theme: 'saas-modern',
      accentColor: 'blue',
      heroStyle: 'split-console',
      interactiveWidget: 'workflow-pipeline',
      targetIndustry: ['Commercial Enterprises', 'Digital Businesses', 'Global Organizations', 'Technology Teams'],
      deploymentModes: ['Managed Sovereign Cloud', 'Dedicated High-Availability Cluster', 'On-Premises Infrastructure'],
      slaGuarantee: '99.99% Uptime SLA • Enterprise Zero Data Loss Guarantee',
      metrics:
        matchedShowcase.metrics?.map((m) => ({
          label: m.label,
          value: m.value,
          trend: 'Optimized Target',
        })) || [
          { label: 'System SLA', value: '99.99%', trend: 'Continuous Delivery' },
          { label: 'Microservice Latency', value: '< 10ms', trend: 'Sub-millisecond' },
          { label: 'Security Layer', value: 'Zero-Trust', trend: 'Enterprise Grade' },
        ],
      subModules:
        metricSubmodules.length > 0
          ? metricSubmodules
          : [
              {
                name: 'Core System Engine',
                badge: 'Core Engine 01',
                description: matchedShowcase.description,
                points: ['Modular architecture', 'High throughput API', 'Strict RBAC security'],
              },
            ],
      architecture: {
        runtime: (matchedShowcase.techStack && matchedShowcase.techStack.join(', ')) || 'TypeScript, Next.js, Node.js',
        database: 'PostgreSQL & Redis Caching Layer',
        security: 'End-to-end TLS 1.3, AES-256 encryption at rest, strict RBAC',
        messaging: 'Distributed event bus & Kafka/RabbitMQ streams',
        latency: matchedShowcase.metrics?.find((m) => m.label.toLowerCase().includes('latency'))?.value || '< 10ms latency',
        scalability: 'Horizontally auto-scaled containerized microservices',
      },
      complianceList: [
        'Enterprise Security Standards',
        'Role-Based Access Control',
        'High-Availability Architecture',
        'Zero-Trust Security Posture',
      ],
      mockData: {
        tabTitle: `${matchedShowcase.title} — System Telemetry & Operations`,
        recordsHeader: ['Entity / Task ID', 'Component', 'Parameters', 'Status', 'Audit Code'],
        records: [
          {
            id: `${matchedShowcase.id.slice(0, 8).toUpperCase()}-101`,
            title: `${matchedShowcase.title} Primary Cluster`,
            meta: 'Operational • UAE Region',
            status: 'ACTIVE',
            tag: 'PRODUCTION',
            timestamp: 'Committed 1m ago',
          },
          {
            id: `${matchedShowcase.id.slice(0, 8).toUpperCase()}-102`,
            title: 'Real-Time Ingestion Pipeline',
            meta: 'Synchronized across distributed nodes',
            status: 'VERIFIED',
            tag: 'INSPECTED',
            timestamp: 'Committed 3m ago',
          },
          {
            id: `${matchedShowcase.id.slice(0, 8).toUpperCase()}-103`,
            title: 'Security & Access Ledger',
            meta: 'Cryptographic policy verified',
            status: 'COMPLIANT',
            tag: 'SEALED',
            timestamp: 'Committed 7m ago',
          },
        ],
        systemLogs: [
          `[${matchedShowcase.title.toUpperCase()}:CORE] Microservices cluster operational with 0 errors`,
          `[${matchedShowcase.title.toUpperCase()}:AUTH] Secure session validation completed across active endpoints`,
          `[${matchedShowcase.title.toUpperCase()}:TELEMETRY] Metrics synchronized to centralized monitoring dashboard`,
        ],
        workflowSteps:
          matchedShowcase.capabilities?.map((c, i) => ({
            step: `0${i + 1}`,
            title: c.title,
            desc: c.description,
            latency: `${(i + 1) * 1.8}ms`,
            status: 'COMMITTED',
          })) || [
            { step: '01', title: 'Data Ingestion & Auth', desc: 'Secure payload ingestion via TLS 1.3 gateway', latency: '2.4ms', status: 'VALIDATED' },
            { step: '02', title: 'Workflow Processing', desc: 'Granular policy evaluation and schema verification', latency: '4.1ms', status: 'PASS' },
            { step: '03', title: 'Commit & Distribution', desc: 'Distributed microservice transaction commit', latency: '5.8ms', status: 'COMMITTED' },
          ],
        codeDiff: {
          sourceLang: 'Legacy / Manual Process',
          sourceCode: `// Legacy Unoptimized Implementation\nfunction processWorkflow(data) {\n  // Synchronous bottleneck\n  legacyDb.save(data);\n  notifyTeamManual(data);\n}`,
          targetLang: 'Arcanum Modern Cloud Architecture',
          targetCode: `// High-Performance Event-Driven Implementation\nexport async function handleWorkflowExecution(ctx: Context, payload: WorkflowData) {\n  const res = await serviceBus.dispatch('workflow.execute', { payload, ts: Date.now() });\n  return { ok: true, hash: res.signature };\n}`,
        },
      },
      faqs: [
        {
          question: `How does ${matchedShowcase.title} integrate with our current systems?`,
          answer: 'Our platform provides standardized REST and GraphQL APIs, event webhooks, and secure authentication to connect directly with your existing infrastructure.',
        },
        {
          question: 'What is the deployment timeframe and hosting model?',
          answer: 'Deployments can be provisioned in sovereign cloud environments, on-premises datacenters, or dedicated multi-region clusters with comprehensive 24/7 technical support.',
        },
        {
          question: 'Can capabilities and role permissions be customized for our team?',
          answer: "Yes, full role-based access control and configurable workflow rules are tailored to your organization's hierarchy and operational requirements.",
        },
      ],
      showSecondaryCta: false,
      ctaPrimaryText: 'Book a Demo / Discovery',
      sectionVisibility: {
        hero: true,
        secondaryCta: false,
        metrics: true,
        widget: true,
        submodules: true,
        industries: true,
        compliance: true,
        faqs: true,
        related: true,
      },
      ...((matchedShowcase as any).pageDetails || {}),
    };

    showcaseAsModule = {
      id: matchedShowcase.id,
      slug: matchedShowcase.tabLabel?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || matchedShowcase.id,
      title: matchedShowcase.title,
      category: (matchedShowcase.category as any) || 'Enterprise',
      subtitle: matchedShowcase.subtitle || 'Custom Architecture Subsystem',
      description: matchedShowcase.description,
      features: featureNames.length > 0 ? featureNames : ['Modular Architecture', 'High Throughput API', 'Strict RBAC Security'],
      techStack: matchedShowcase.techStack || ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
      imageSrc: matchedShowcase.imageSrc || '/hero_erp.jpg',
      iconName: matchedShowcase.iconName || 'Zap',
      badge: 'Flagship Showcase',
      pageDetails: generatedPageDetails,
    };
  }

  // 3. Fallback resolution: NEVER blindly default to modulesList[0] when rawId is provided
  const currentModule: ModuleItem =
    matchedFromModules ||
    matchedFromArcanum ||
    showcaseAsModule ||
    (rawId ? fallbackModule : modulesList[0] || ARCANUM_MODULES[0] || fallbackModule);

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
