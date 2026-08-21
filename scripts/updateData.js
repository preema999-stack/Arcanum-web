const { execSync } = require('child_process');
const fs = require('fs');

const gitData = execSync('git show 068d70b:data/arcanumData.ts', { maxBuffer: 10 * 1024 * 1024 }).toString();

const infoMatch = gitData.match(/export const ARCANUM_INFO: SiteInfo = (\{[\s\S]*?\});\s*export const ARCANUM_VALUES/);
const valuesMatch = gitData.match(/export const ARCANUM_VALUES: ValuePillar\[\] = (\[[\s\S]*?\]);\s*export const ARCANUM_LOCATION_HUBS/);
const hubsMatch = gitData.match(/export const ARCANUM_LOCATION_HUBS: LocationHubItem\[\] = (\[[\s\S]*?\]);\s*export const ARCANUM_CAPABILITIES/);
const capsMatch = gitData.match(/export const ARCANUM_CAPABILITIES: TechnicalCapability\[\] = (\[[\s\S]*?\]);\s*export const ARCANUM_MODULES/);
const modulesMatch = gitData.match(/export const ARCANUM_MODULES: ModuleItem\[\] = (\[[\s\S]*?\]);\s*export const BROCHURES_LIST/);
const brochuresMatch = gitData.match(/export const BROCHURES_LIST: BrochureItem\[\] = (\[[\s\S]*?\]);/);

const info = infoMatch ? eval('(' + infoMatch[1] + ')') : {};
const values = valuesMatch ? eval(valuesMatch[1]) : [];
const hubs = hubsMatch ? eval(hubsMatch[1]) : [];
const caps = capsMatch ? eval(capsMatch[1]) : [];
const defaultModules = modulesMatch ? eval(modulesMatch[1]) : [];
const brochures = brochuresMatch ? eval(brochuresMatch[1]) : [];

// Add showcase fields to info
info.showcaseBadge = '03 / Flagship Product Showcase';
info.showcaseTitle = 'Enterprise Software We';
info.showcaseTitleHighlight = 'Build & Deploy.';
info.showcaseDescription =
  'Explore our production-proven enterprise software engines — crafted for high transaction volume, strict statutory compliance, and resilient multi-tenant architectures.';
info.solutionsBadge = '04 / Flagship Solutions';
info.catalogBadge = '05 / Full Product Catalog';
info.locationsBadge = '06 / Global Engineering Hubs';
info.contactBadge = '07 / Technical Discovery';

// Add Jestin Xavier custom module if not already in defaultModules
const customModule = {
  id: 'mod-1787131772645',
  slug: 'jestinxavier',
  title: 'Jestin Xavier',
  category: 'Enterprise',
  subtitle: 'Custom Architecture Subsystem by jestin xaver',
  description: 'Description of technical capabilities and specifications. jestin dis ',
  features: ['Modular Architecture', 'High Throughput API'],
  brochureUrl: 'https://dynamicpotfoliyo.web.app/',
  iconName: 'Building2',
  imageSrc: '/hero_erp.jpg',
  techStack: ['TypeScript', 'Next.js', 'PostgreSQL'],
};

const mergedModules = [...defaultModules];
if (!mergedModules.some((m) => m.id === customModule.id)) {
  mergedModules.push(customModule);
}

const defaultShowcaseItems = [
  {
    id: 'erp',
    tabLabel: 'ARC ERP',
    title: 'ARC Enterprise Resource Planning (ERP)',
    category: 'Enterprise & Finance',
    subtitle: 'Multi-Currency Financial Ledger & Real-Time Supply Chain Core',
    description:
      'Integrate finance, inventory, multi-warehouse logistics, procurement, and asset tracking into a synchronized ledger. Enforces dual-authorization, strict audit trails, and automated UAE VAT tax filing.',
    imageSrc: '/hero_erp.jpg',
    techStack: ['PostgreSQL', 'TypeScript', 'Docker', 'Redis', 'GraphQL', 'TLS 1.3'],
    metrics: [
      { label: 'TRANSACTION LATENCY', value: '< 8ms' },
      { label: 'SYSTEM SLA', value: '99.99%' },
      { label: 'COMPLIANCE', value: 'UAE VAT & WPS' },
    ],
    capabilities: [
      {
        title: 'Double-Entry Financial Ledger',
        description: 'Multi-currency ledger with real-time balance validation and immutable audit trails.',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Multi-Warehouse Supply Chain',
        description: 'Automated stock re-order triggers, serial/batch tracking, and inventory valuation.',
        iconName: 'Zap',
      },
      {
        title: 'Procurement & Vendor Portal',
        description: 'End-to-end RFQ, PO generation, goods receipt notes (GRN), and 3-way invoice matching.',
        iconName: 'Server',
      },
      {
        title: 'Asset Lifecycle Management',
        description: 'Depreciation calculation engine, maintenance tracking, and RFID asset tagging.',
        iconName: 'Cpu',
      },
    ],
  },
  {
    id: 'oms',
    tabLabel: 'OMS Suite',
    title: 'Organization Management System (OMS)',
    category: 'Enterprise Governance',
    subtitle: 'Multi-Tenant Entity Structure, RBAC & Enterprise Identity Mesh',
    description:
      'A master governance engine enabling multi-company group management, dynamic organizational trees, automated approval workflows, and centralized identity & access management (IAM).',
    imageSrc: '/hero-topsection/ezgif-frame-105.jpg',
    techStack: ['Node.js', 'PostgreSQL', 'OAuth2 / SAML', 'Docker', 'Redis', 'gRPC'],
    metrics: [
      { label: 'AUTH LATENCY', value: '< 3ms' },
      { label: 'TENANCY', value: 'Unlimited Orgs' },
      { label: 'ACCESS CONTROL', value: 'Granular RBAC' },
    ],
    capabilities: [
      {
        title: 'Hierarchical Entity Topology',
        description: 'Establish holding companies, subsidiaries, branch locations, and departments.',
        iconName: 'Building2',
      },
      {
        title: 'Dynamic Approval Workflows',
        description: 'Configurable multi-stage approval matrix based on transaction threshold limits.',
        iconName: 'Zap',
      },
      {
        title: 'Enterprise SSO & IAM',
        description: 'SAML 2.0, OAuth2, and Active Directory integration with hardware MFA.',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Central Audit & Telemetry',
        description: 'Immutable logging of every user action, privilege escalation, and data mutation.',
        iconName: 'Server',
      },
    ],
  },
  {
    id: 'banking',
    tabLabel: 'Core Banking',
    title: 'Core Banking Engine & Financial Switch',
    category: 'Banking & FinTech',
    subtitle: 'ISO 8583 Message Routing, ATM Gateway & Mobile Banking',
    description:
      'Engineered for retail and co-operative banks. Features high-throughput ISO 8583 message switching, biometric ATM interfacing, automated SMS gateways, and secure consumer banking applications.',
    imageSrc: '/banking_fintech.png',
    techStack: ['Java Spring Boot', 'Kafka', 'HSM Hardware Vault', 'PostgreSQL', 'ISO 8583'],
    metrics: [
      { label: 'SWITCH SPEED', value: 'Sub-12ms' },
      { label: 'SECURITY', value: 'HSM Vault Enforced' },
      { label: 'PROTOCOLS', value: 'ISO 8583 / REST' },
    ],
    capabilities: [
      {
        title: 'ISO 8583 Message Switch',
        description: 'Sub-millisecond packet routing connecting ATM networks, POS terminals, and core ledgers.',
        iconName: 'Cpu',
      },
      {
        title: 'Transa Mobile Banking',
        description: 'Biometric consumer banking app for funds transfer, utility payments, and statement downloads.',
        iconName: 'Zap',
      },
      {
        title: 'Co-Operative Bank Add-Ons',
        description: 'Specialized modules for loan underwriting, term deposits, dividend distribution, and locker management.',
        iconName: 'Server',
      },
      {
        title: 'Hardware Cryptographic Vault',
        description: 'Integration with HSM appliances for PIN block translation and end-to-end data encryption.',
        iconName: 'ShieldCheck',
      },
    ],
  },
  {
    id: 'pos',
    tabLabel: 'Restaurant POS',
    title: 'CulinaryOS Restaurant POS & Kitchen Display',
    category: 'Hospitality & Retail',
    subtitle: 'Table Ordering, Floorplan Engine & Cloud Kitchen Management',
    description:
      'High-speed POS designed for fine dining, multi-branch franchises, and fast-casual cafes. Features real-time Kitchen Display System (KDS) synchronization, QR table ordering, and recipe inventory cost tracking.',
    imageSrc: '/hero_restaurant.jpg',
    techStack: ['Next.js', 'WebSockets', 'SQLite / Cloud Sync', 'Thermal ESC/POS', 'PWA'],
    metrics: [
      { label: 'ORDER SYNC', value: 'Instant (WebSocket)' },
      { label: 'OFFLINE MODE', value: '100% Resilient' },
      { label: 'SUPPORT', value: 'Multi-Branch KDS' },
    ],
    capabilities: [
      {
        title: 'Interactive Floorplan & Tables',
        description: 'Visual table management with seat-level splitting, merge bills, and reservation timelines.',
        iconName: 'UtensilsCrossed',
      },
      {
        title: 'Real-Time Kitchen Display (KDS)',
        description: 'Color-coded cook times, preparation timers, and station-based routing for culinary efficiency.',
        iconName: 'Zap',
      },
      {
        title: 'Recipe & Ingredient Costing',
        description: 'Automatic deduction of raw inventory down to the gram as orders are punched.',
        iconName: 'Server',
      },
      {
        title: 'Offline Resilient Engine',
        description: 'Keeps punching orders and printing kitchen tickets even if internet connection drops.',
        iconName: 'ShieldCheck',
      },
    ],
  },
  {
    id: 'payroll',
    tabLabel: 'HRMS & WPS',
    title: 'Synapse HRMS & UAE WPS Payroll Engine',
    category: 'Human Resources',
    subtitle: 'Automated SIF Generation, Biometric Attendance & Gratuity Calculation',
    description:
      'Enterprise human resources management built for strict UAE labor law compliance. Generates WPS SIF files in one click, syncs with biometric face/fingerprint terminals, and tracks end-of-service gratuity.',
    imageSrc: '/hero_hrms.jpg',
    techStack: ['TypeScript', 'PostgreSQL', 'Biometric ZK Drivers', 'AES-256', 'PDFKit'],
    metrics: [
      { label: 'WPS SIF COMPLIANCE', value: '100% UAE Central Bank' },
      { label: 'BIOMETRIC PULL', value: 'Automated 15-Min Sync' },
      { label: 'PAYROLL RUN', value: 'Under 10 Seconds' },
    ],
    capabilities: [
      {
        title: '1-Click WPS SIF Generation',
        description: 'Automated Ministry of Human Resources (MOHRE) compliant salary information files.',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Biometric Attendance Mesh',
        description: 'Direct TCP/IP integration with fingerprint and facial recognition scanners across branches.',
        iconName: 'Cpu',
      },
      {
        title: 'UAE Gratuity & Leave Engine',
        description: 'Automated calculation of end-of-service benefits, leave accruals, and document expiry alerts.',
        iconName: 'Zap',
      },
      {
        title: 'Employee Self-Service Portal',
        description: 'Mobile-friendly portal for pay slip downloads, expense claims, and leave requests.',
        iconName: 'Users',
      },
    ],
  },
  {
    id: 'hms',
    tabLabel: 'Clinical Care',
    title: 'AuraCare Clinic & Hospital Management (HMS)',
    category: 'Healthcare & EMR',
    subtitle: 'Electronic Medical Records, Pharmacy Dispensing & Lab Diagnostics',
    description:
      'HIPAA-ready clinical platform connecting patient registration, doctor consultations, digital prescription writing, ICD-10 medical coding, pharmacy stock, and pathology lab report workflows.',
    imageSrc: '/hero_clinic.jpg',
    techStack: ['HL7 / FHIR', 'PostgreSQL', 'Next.js', 'DICOM Viewer', 'AES-256 Encrypted'],
    metrics: [
      { label: 'EMR PROTOCOL', value: 'HL7 & FHIR Standard' },
      { label: 'DATA SECURITY', value: 'Zero-Trust HIPAA' },
      { label: 'PRESCRIPTION', value: 'Instant Digital PDF' },
    ],
    capabilities: [
      {
        title: 'Doctor EMR & Digital Prescriptions',
        description: 'Custom consultation templates, ICD-10 diagnostic coding, and digital e-prescriptions.',
        iconName: 'HeartPulse',
      },
      {
        title: 'Integrated Pharmacy System',
        description: 'Batch and expiry tracking, automatic drug interaction alerts, and POS dispensation.',
        iconName: 'Server',
      },
      {
        title: 'Laboratory Diagnostic Workflow',
        description: 'Sample barcode tracking, equipment interfacing, and automated patient report delivery via WhatsApp/Email.',
        iconName: 'Zap',
      },
      {
        title: 'Appointment Booking & Queue TV',
        description: 'Online patient booking with token display screens in waiting lobbies.',
        iconName: 'Users',
      },
    ],
  },
  {
    id: 'sls',
    tabLabel: 'Aether CRM',
    title: 'Aether Enterprise CRM & Lead Pipeline',
    category: 'Sales & Revenue',
    subtitle: 'Omnichannel Lead Capture, Quotation Engine & WhatsApp Automation',
    description:
      'Close deals faster with unified pipeline management. Ingest leads from web forms, WhatsApp, and email, track follow-ups, generate professional PDF quotations, and monitor sales rep quotas.',
    imageSrc: '/hero_crm.jpg',
    techStack: ['Next.js', 'PostgreSQL', 'WhatsApp Cloud API', 'SendGrid', 'Docker'],
    metrics: [
      { label: 'PIPELINE TRACKING', value: 'Real-Time Kanban' },
      { label: 'QUOTE CREATION', value: 'Under 60 Seconds' },
      { label: 'INTEGRATIONS', value: 'WhatsApp & Email' },
    ],
    capabilities: [
      {
        title: 'Multi-Stage Kanban Pipeline',
        description: 'Visual deal management with customizable deal stages, win probabilities, and deal aging.',
        iconName: 'LineChart',
      },
      {
        title: 'Instant Quotation & Invoicing',
        description: '1-click conversion from deal to PDF quotation with multi-currency VAT calculation.',
        iconName: 'Zap',
      },
      {
        title: 'Automated WhatsApp & Email Triggers',
        description: 'Send automated follow-ups, payment reminders, and status notifications directly to leads.',
        iconName: 'Server',
      },
      {
        title: 'Sales Performance Analytics',
        description: 'Executive dashboards showing conversion rates, revenue forecasts, and rep performance.',
        iconName: 'ShieldCheck',
      },
    ],
  },
  {
    id: 'oracle',
    tabLabel: 'Oracle Modernizer',
    title: 'Legacy Oracle Forms Modernization Suite',
    category: 'Legacy Modernization',
    subtitle: 'PL/SQL Refactoring to Resilient Cloud Microservices',
    description:
      'Turn obsolete Oracle Forms 6i/11g/12c systems into responsive web applications. Preserve your battle-tested PL/SQL database packages while replacing outdated Java applets with modern Next.js interfaces.',
    imageSrc: '/oracle_modernization.png',
    techStack: ['Oracle DB 19c', 'PL/SQL', 'Next.js', 'Node.js', 'gRPC', 'Docker'],
    metrics: [
      { label: 'ZERO DATA LOSS', value: 'Guaranteed' },
      { label: 'DB INTEGRITY', value: 'Preserved 100%' },
      { label: 'INTERFACE', value: 'Responsive Web' },
    ],
    capabilities: [
      {
        title: 'PL/SQL Business Logic Decoupling',
        description: 'Extract stored procedures and triggers into lightweight, containerized REST / gRPC microservices.',
        iconName: 'Database',
      },
      {
        title: 'Web-Native User Experience',
        description: 'Replace cumbersome Oracle Form applets with lightning-fast, keyboard-shortcut-enabled web screens.',
        iconName: 'Zap',
      },
      {
        title: 'Zero Downtime Parallel Cutover',
        description: 'Phased migration strategies allowing legacy and modern interfaces to run concurrently on the same database.',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Modern API Layer & Webhooks',
        description: 'Open up legacy systems to modern 3rd-party integrations, mobile apps, and cloud analytics.',
        iconName: 'Server',
      },
    ],
  },
];

const fileContent = `import type { ProductDetailItem } from './productDetailsData';

export interface ModuleItem {
  id: string;
  slug?: string;
  title: string;
  category: 'Enterprise' | 'Banking' | 'Healthcare' | 'Education' | 'Infrastructure' | 'Workspace';
  subtitle: string;
  description: string;
  features: string[];
  brochureUrl?: string;
  iconName: string;
  badge?: string;
  imageSrc?: string;
  techStack?: string[];
  pageDetails?: ProductDetailItem;
}

export interface ShowcaseItem {
  id: string;
  tabLabel: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
  capabilities: {
    title: string;
    description: string;
    iconName?: string;
  }[];
}

export interface ValuePillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface LocationHubItem {
  id: string;
  city: string;
  country: string;
  flag: string;
  role: string;
  description: string;
  coordinates: { x: number; y: number };
  latLng: string;
  timezone: string;
  gmtOffset: number;
  address: string;
  focusDomains: string[];
  stats: { label: string; value: string }[];
  isHq?: boolean;
}

export interface TechnicalCapability {
  id: string;
  title: string;
  tag: string;
  description: string;
  iconName: string;
  details: string[];
}

export interface SiteInfo {
  name: string;
  shortName: string;
  tagline: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroHeadlineSuffix: string;
  heroPhase2Title: string;
  heroPhase2Highlight: string;
  heroPhase2Description: string;
  heroPhase3Title: string;
  heroPhase3Highlight: string;
  heroPhase3Description: string;
  heroDescription?: string;
  heroBadgeLabel?: string;
  heroCta1?: string;
  heroCta2?: string;
  established?: string;
  aboutBadge?: string;
  aboutTitle?: string;
  aboutTitleHighlight?: string;
  aboutDescription1?: string;
  aboutDescription2?: string;
  marqueeText?: string;
  showcaseBadge?: string;
  showcaseTitle?: string;
  showcaseTitleHighlight?: string;
  showcaseDescription?: string;
  solutionsBadge?: string;
  solutionsTitle?: string;
  solutionsTitleHighlight?: string;
  flagshipModuleIds?: string[];
  catalogBadge?: string;
  locationsBadge?: string;
  locationsTitle?: string;
  locationsTitleHighlight?: string;
  locationsDescription?: string;
  contactBadge?: string;
  contactTitle?: string;
  contactDescription?: string;
  stats: { label: string; value: string; change: string }[];
  contact: {
    address: string;
    email: string;
    website: string;
    phone: string;
    poBox?: string;
    workingHours?: string;
  };
  socialLinks: {
    whatsapp: string;
    linkedin?: string;
    email: string;
  };
}

export interface BrochureItem {
  title: string;
  href: string;
  category: string;
}

/**
 * Synchronized Arcanum Enterprise Data
 * Last Synced with Firebase: ${new Date().toISOString()}
 */
export const ARCANUM_INFO: SiteInfo = ${JSON.stringify(info, null, 2)};

export const ARCANUM_VALUES: ValuePillar[] = ${JSON.stringify(values, null, 2)};

export const ARCANUM_LOCATION_HUBS: LocationHubItem[] = ${JSON.stringify(hubs, null, 2)};

export const ARCANUM_CAPABILITIES: TechnicalCapability[] = ${JSON.stringify(caps, null, 2)};

export const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = ${JSON.stringify(defaultShowcaseItems, null, 2)};

export const ARCANUM_SHOWCASE_ITEMS: ShowcaseItem[] = ${JSON.stringify(defaultShowcaseItems, null, 2)};

export const ARCANUM_MODULES: ModuleItem[] = ${JSON.stringify(mergedModules, null, 2)};

export const BROCHURES_LIST: BrochureItem[] = ${JSON.stringify(brochures, null, 2)};
`;

fs.writeFileSync('data/arcanumData.ts', fileContent, 'utf8');

// Also update data/cms_backup.json
const backupData = {
  info,
  values,
  locations: hubs,
  capabilities: caps,
  showcaseItems: defaultShowcaseItems,
  modules: mergedModules,
  brochures,
  updatedAt: new Date().toISOString(),
};
fs.writeFileSync('data/cms_backup.json', JSON.stringify(backupData, null, 2), 'utf8');
console.log('Successfully updated arcanumData.ts and cms_backup.json with 22 modules and showcase items!');
