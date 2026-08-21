import type { ProductDetailItem } from './productDetailsData';

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
  techStack?: string[];
  imageSrc?: string;
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
  iconName?: string;
}

export interface BrochureItem {
  title: string;
  href: string;
  category: string;
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

/**
 * Synchronized Arcanum Enterprise Data
 * Last Synced with Firebase: 2026-08-20T08:47:36.032Z
 */
export const ARCANUM_INFO: SiteInfo = {
  "name": "Arcanum Information Technology",
  "shortName": "Arcanum IT",
  "tagline": "Enterprise Software Engineering & Digital Architecture",
  "heroHeadline": "If You Have an Idea,",
  "heroHeadlineHighlight": "Reality.",
  "heroHeadlineSuffix": "We Will Make It a",
  "heroPhase2Title": "From Bold Vision to",
  "heroPhase2Highlight": "Enterprise Reality.",
  "heroPhase2Description": "We engineer custom ERPs, core banking engines, clinical platforms, and cloud infrastructure — built with architectural rigor.",
  "heroPhase3Title": "And We Build Systems",
  "heroPhase3Highlight": "That Endure.",
  "heroPhase3Description": "Secure, scalable, and backed by senior engineers across the UAE — so your software keeps evolving as your business grows.",
  "heroDescription": "Arcanum Information Technology is a professionally managed software development firm in the UAE. We engineer high-performance ERPs, banking integrations, clinical management systems, and legacy Oracle Forms modernizations with enterprise-grade security and reliability.",
  "established": "UAE & India",
  "aboutBadge": "02 / Who We Are",
  "aboutTitle": "An IT Engineering Firm Built on",
  "aboutTitleHighlight": "Rigor & Reliability.",
  "aboutDescription1": "Arcanum Information Technology is a professionally managed software engineering firm operating across three key global centers: Abu Dhabi (UAE), Kerala (India), and Gujarat (India). We employ senior software architects and engineers delivering enterprise-grade software.",
  "aboutDescription2": "Professionally managed software development firm delivering secure enterprise software across ERP, Banking, Healthcare, Education, and Cloud Infrastructure.",
  "marqueeText": "ARCHITECTURAL PRECISION • LEGACY ORACLE FORMS REFACTORING • UAE WPS PAYROLL COMPLIANCE • ISO 8583 BANKING SWITCHES • CLINICAL EMR PROTOCOLS • SUB-12MS MICROSERVICES • ZERO DATA LOSS GUARANTEE • ",
  "heroBadgeLabel": "GLOBAL HUBS:123",
  "heroCta1": "Start Your Project",
  "heroCta2": "Explore Enterprise Catalog",
  "solutionsBadge": "040 / Flagship Solutions",
  "solutionsTitle": "Enterprise Systems We",
  "solutionsTitleHighlight": "Engineer.",
  "catalogBadge": "04 / Full Product Catalog",
  "locationsBadge": "GLOBAL FOOTPRINT & ENGINEERING NODES",
  "locationsTitle": "Our 3 Operational",
  "locationsTitleHighlight": "Tech Hubs.",
  "locationsDescription": "Strategically distributed across Abu Dhabi, Kerala, and Gujarat to deliver 24/7 enterprise engineering, client strategy, and mission-critical system continuity.",
  "contactBadge": "06 / INITIATE ENGAGEMENT",
  "contactTitle": "Schedule Technical Architecture Discovery",
  "contactDescription": "Speak directly with our senior software architects. Whether you need custom ERP implementation, Oracle Forms refactoring, or co-operative banking integration, we deliver enterprise certainty.",
  "stats": [
    {
      "label": "Enterprise Applications",
      "change": "+4 this year",
      "value": "22+"
    },
    {
      "label": "System Uptime SLA",
      "value": "99.99%",
      "change": "Zero critical downtime"
    },
    {
      "value": "< 12ms",
      "change": "Optimized execution",
      "label": "Microservice Latency"
    },
    {
      "label": "Active Enterprise Users",
      "change": "Cross-platform users",
      "value": "150K+"
    }
  ],
  "contact": {
    "website": "https://arcanum.ae",
    "poBox": "P.O. Box 45000, Abu Dhabi, UAE",
    "email": "info@arcanum.ae",
    "address": "Abu Dhabi (UAE) • Kerala (India) • Gujarat (India)",
    "phone": "+971 4 000 0000",
    "workingHours": "Mon - Fri: 08:30 AM - 06:00 PM (GST)"
  },
  "socialLinks": {
    "whatsapp": "+9714000000",
    "email": "info@arcanum.ae",
    "linkedin": "https://linkedin.com/company/arcanum-it"
  },
  "showcaseBadge": "03 / Flagship Product Showcase",
  "showcaseTitle": "Enterprise Software We",
  "showcaseTitleHighlight": "Build & Deploy.",
  "showcaseDescription": "Explore our production-proven enterprise software engines — crafted for high transaction volume, strict statutory compliance, and resilient multi-tenant architectures."
};

export const ARCANUM_VALUES: ValuePillar[] = [
  {
    "title": "Architectural Precision",
    "id": "precision",
    "iconName": "Cpu",
    "description": "Clean modular codebases with strict type safety, zero-trust security layers, and zero technical debt."
  },
  {
    "title": "Legacy Modernization",
    "iconName": "Database",
    "id": "modernization",
    "description": "Methodologies for refactoring heavy legacy Oracle Forms applications into scalable cloud microservices."
  },
  {
    "id": "compliance",
    "description": "Native adherence to UAE WPS payroll standards, ISO 8583 banking switches, and clinical EMR protocols.",
    "iconName": "ShieldCheck",
    "title": "Statutory Compliance"
  },
  {
    "iconName": "Award",
    "title": "Professional Execution",
    "id": "execution",
    "description": "Employing highly-skilled senior engineers who execute complex IT assignments elegantly and on schedule."
  }
];

export const ARCANUM_LOCATION_HUBS: LocationHubItem[] = [
  {
    "role": "Global Headquarters & Executive Hub",
    "timezone": "GST (Gulf Standard Time)",
    "gmtOffset": 4,
    "focusDomains": [
      "Enterprise ERP",
      "Core Banking Integrations",
      "Client Strategy"
    ],
    "country": "United Arab Emirates",
    "stats": [
      {
        "label": "System SLA",
        "value": "99.99%"
      },
      {
        "label": "Client Node Latency",
        "value": "< 12ms"
      },
      {
        "label": "Regional Focus",
        "value": "GCC & Global"
      }
    ],
    "address": "Arcanum Information Technology, Abu Dhabi, United Arab Emirates",
    "flag": "🇦🇪",
    "description": "Strategic corporate headquarters directing global enterprise operations, client advisory, financial technology governance, and regional Middle East deployments.",
    "latLng": "24.4539° N, 54.3773° E",
    "isHq": true,
    "id": "abudhabi",
    "city": "Abu Dhabi",
    "coordinates": {
      "x": 42,
      "y": 44
    }
  },
  {
    "address": "Arcanum Engineering Center, Tech Hub, Kerala, India",
    "country": "India",
    "city": "Kerala",
    "id": "kerala",
    "focusDomains": [
      "Oracle Forms Refactoring",
      "School Management (Scholar)",
      "Clinic Systems",
      "Microservices"
    ],
    "description": "Primary software architecture and product innovation center specializing in full-stack engineering, Oracle Forms modernizations, and scalable cloud microservices.",
    "latLng": "10.8505° N, 76.2711° E",
    "flag": "🇮🇳",
    "stats": [
      {
        "label": "Core Engineers",
        "value": "Senior R&D"
      },
      {
        "label": "Deployment Rate",
        "value": "Continuous CI/CD"
      },
      {
        "label": "Quality Audit",
        "value": "ISO 27001"
      }
    ],
    "gmtOffset": 5.5,
    "coordinates": {
      "y": 64,
      "x": 74
    },
    "timezone": "IST (Indian Standard Time)",
    "role": "Engineering & Core R&D Hub"
  },
  {
    "coordinates": {
      "x": 68,
      "y": 48
    },
    "focusDomains": [
      "Accurate PAYROLL (WPS)",
      "Restaurant POS",
      "Dynamic Forms",
      "Enterprise Support"
    ],
    "id": "gujarat",
    "city": "Gujarat",
    "description": "High-performance operations and enterprise systems unit delivering automated payroll processing, custom web applications, and round-the-clock technical support.",
    "role": "Tech & Operations Center",
    "latLng": "22.2587° N, 71.1924° E",
    "stats": [
      {
        "label": "Active Users",
        "value": "150K+"
      },
      {
        "label": "WPS Compliance",
        "value": "100% Automated"
      },
      {
        "label": "Support Window",
        "value": "24/7 Operations"
      }
    ],
    "country": "India",
    "timezone": "IST (Indian Standard Time)",
    "address": "Arcanum Tech & Operations Hub, Gujarat, India",
    "gmtOffset": 5.5,
    "flag": "🇮🇳"
  }
];

export const ARCANUM_CAPABILITIES: TechnicalCapability[] = [
  {
    "title": "Legacy Oracle Forms Modernization",
    "description": "Proven methodologies for extracting legacy PL/SQL business logic and refactoring heavy Oracle Forms 12c monoliths into decoupled microservice architecture.",
    "iconName": "Database",
    "tag": "INFRASTRUCTURE REFACTORING",
    "details": [
      "PL/SQL Logic Isolation",
      "Containerized Deployment",
      "Zero Data-Loss Guarantee"
    ],
    "id": "oracle"
  },
  {
    "id": "banking",
    "iconName": "Lock",
    "tag": "ISO 8583 & ATM SWITCH",
    "details": [
      "ATM Switch Interface",
      "HSM Cryptographic Hardware",
      "Real-time Transaction Audit"
    ],
    "title": "Banking & Financial Core Integrations",
    "description": "Custom interface modules for co-operative and retail banks including ISO 8583 ATM switch bridging, automated SMS notifications, and secure customer portals."
  },
  {
    "id": "mobile",
    "tag": "CROSS-PLATFORM ENGINEERING",
    "description": "Converting complex enterprise web platforms into high-speed native iOS and Android applications with offline sync, biometric auth, and push notifications.",
    "title": "Native Mobile & Web Engine",
    "iconName": "Smartphone",
    "details": [
      "Native iOS / Android Runtimes",
      "Biometric SSO Authentication",
      "Offline Storage Engine"
    ]
  }
];

export const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    "title": "ARC Enterprise Resource Planning (ERPs)",
    "techStack": [
      "PostgreSQL",
      "TypeScript",
      "Docker",
      "Redis",
      "GraphQL",
      "TLS 1.3"
    ],
    "id": "erp",
    "description": "Integrate finance, inventory, multi-warehouse logistics, procurement, and asset tracking into a synchronized ledger. Enforces dual-authorization, strict audit trails, and automated UAE VAT tax filing.",
    "category": "Enterprise & Finance",
    "tabLabel": "ARC ERPs",
    "capabilities": [
      {
        "title": "Double-Entry Financial Ledger",
        "description": "Multi-currency ledger with real-time balance validation and immutable audit trails.",
        "iconName": "ShieldCheck"
      },
      {
        "title": "Multi-Warehouse Supply Chain",
        "iconName": "Zap",
        "description": "Automated stock re-order triggers, serial/batch tracking, and inventory valuation."
      },
      {
        "description": "End-to-end RFQ, PO generation, goods receipt notes (GRN), and 3-way invoice matching.",
        "iconName": "Server",
        "title": "Procurement & Vendor Portal"
      },
      {
        "description": "Depreciation calculation engine, maintenance tracking, and RFID asset tagging.",
        "title": "Asset Lifecycle Management",
        "iconName": "Cpu"
      }
    ],
    "subtitle": "Multi-Currency Financial Ledger & Real-Time Supply Chain Core",
    "imageSrc": "/hero_erp.jpg",
    "metrics": [
      {
        "value": "< 8ms",
        "label": "TRANSACTION LATENCY"
      },
      {
        "label": "SYSTEM SLA",
        "value": "99.99%"
      },
      {
        "value": "UAE VAT & WPS",
        "label": "COMPLIANCE"
      }
    ]
  },
  {
    "title": "Organization Management System (OMS)",
    "id": "oms",
    "description": "A master governance engine enabling multi-company group management, dynamic organizational trees, automated approval workflows, and centralized identity & access management (IAM).",
    "category": "Enterprise Governance",
    "capabilities": [
      {
        "title": "Hierarchical Entity Topology",
        "iconName": "Building2",
        "description": "Establish holding companies, subsidiaries, branch locations, and departments."
      },
      {
        "title": "Dynamic Approval Workflows",
        "iconName": "Zap",
        "description": "Configurable multi-stage approval matrix based on transaction threshold limits."
      },
      {
        "iconName": "ShieldCheck",
        "title": "Enterprise SSO & IAM",
        "description": "SAML 2.0, OAuth2, and Active Directory integration with hardware MFA."
      },
      {
        "title": "Central Audit & Telemetry",
        "iconName": "Server",
        "description": "Immutable logging of every user action, privilege escalation, and data mutation."
      }
    ],
    "subtitle": "Multi-Tenant Entity Structure, RBAC & Enterprise Identity Mesh",
    "tabLabel": "OMS Suite",
    "imageSrc": "/hero-topsection/ezgif-frame-105.jpg",
    "techStack": [
      "Node.js",
      "PostgreSQL",
      "OAuth2 / SAML",
      "Docker",
      "Redis",
      "gRPC"
    ],
    "metrics": [
      {
        "value": "< 3ms",
        "label": "AUTH LATENCY"
      },
      {
        "value": "Unlimited Orgs",
        "label": "TENANCY"
      },
      {
        "label": "ACCESS CONTROL",
        "value": "Granular RBAC"
      }
    ]
  },
  {
    "id": "banking",
    "capabilities": [
      {
        "title": "ISO 8583 Message Switch",
        "description": "Sub-millisecond packet routing connecting ATM networks, POS terminals, and core ledgers.",
        "iconName": "Cpu"
      },
      {
        "title": "Transa Mobile Banking",
        "description": "Biometric consumer banking app for funds transfer, utility payments, and statement downloads.",
        "iconName": "Zap"
      },
      {
        "description": "Specialized modules for loan underwriting, term deposits, dividend distribution, and locker management.",
        "iconName": "Server",
        "title": "Co-Operative Bank Add-Ons"
      },
      {
        "title": "Hardware Cryptographic Vault",
        "iconName": "ShieldCheck",
        "description": "Integration with HSM appliances for PIN block translation and end-to-end data encryption."
      }
    ],
    "category": "Banking & FinTech",
    "description": "Engineered for retail and co-operative banks. Features high-throughput ISO 8583 message switching, biometric ATM interfacing, automated SMS gateways, and secure consumer banking applications.",
    "metrics": [
      {
        "value": "Sub-12ms",
        "label": "SWITCH SPEED"
      },
      {
        "value": "HSM Vault Enforced",
        "label": "SECURITY"
      },
      {
        "label": "PROTOCOLS",
        "value": "ISO 8583 / REST"
      }
    ],
    "tabLabel": "Core Banking",
    "subtitle": "ISO 8583 Message Routing, ATM Gateway & Mobile Banking",
    "techStack": [
      "Java Spring Boot",
      "Kafka",
      "HSM Hardware Vault",
      "PostgreSQL",
      "ISO 8583"
    ],
    "title": "Core Banking Engine & Financial Switch",
    "imageSrc": "/banking_fintech.png"
  },
  {
    "capabilities": [
      {
        "description": "Visual table management with seat-level splitting, merge bills, and reservation timelines.",
        "iconName": "UtensilsCrossed",
        "title": "Interactive Floorplan & Tables"
      },
      {
        "title": "Real-Time Kitchen Display (KDS)",
        "iconName": "Zap",
        "description": "Color-coded cook times, preparation timers, and station-based routing for culinary efficiency."
      },
      {
        "title": "Recipe & Ingredient Costing",
        "description": "Automatic deduction of raw inventory down to the gram as orders are punched.",
        "iconName": "Server"
      },
      {
        "iconName": "ShieldCheck",
        "title": "Offline Resilient Engine",
        "description": "Keeps punching orders and printing kitchen tickets even if internet connection drops."
      }
    ],
    "category": "Hospitality & Retail",
    "id": "pos",
    "tabLabel": "Restaurant POS",
    "description": "High-speed POS designed for fine dining, multi-branch franchises, and fast-casual cafes. Features real-time Kitchen Display System (KDS) synchronization, QR table ordering, and recipe inventory cost tracking.",
    "techStack": [
      "Next.js",
      "WebSockets",
      "SQLite / Cloud Sync",
      "Thermal ESC/POS",
      "PWA"
    ],
    "subtitle": "Table Ordering, Floorplan Engine & Cloud Kitchen Management",
    "metrics": [
      {
        "label": "ORDER SYNC",
        "value": "Instant (WebSocket)"
      },
      {
        "label": "OFFLINE MODE",
        "value": "100% Resilient"
      },
      {
        "value": "Multi-Branch KDS",
        "label": "SUPPORT"
      }
    ],
    "imageSrc": "/hero_restaurant.jpg",
    "title": "CulinaryOS Restaurant POS & Kitchen Display"
  },
  {
    "title": "AuraCare Clinic & Hospital Management (HMS)",
    "metrics": [
      {
        "label": "EMR PROTOCOL",
        "value": "HL7 & FHIR Standard"
      },
      {
        "label": "DATA SECURITY",
        "value": "Zero-Trust HIPAA"
      },
      {
        "label": "PRESCRIPTION",
        "value": "Instant Digital PDF"
      }
    ],
    "capabilities": [
      {
        "iconName": "HeartPulse",
        "title": "Doctor EMR & Digital Prescriptions",
        "description": "Custom consultation templates, ICD-10 diagnostic coding, and digital e-prescriptions."
      },
      {
        "title": "Integrated Pharmacy System",
        "iconName": "Server",
        "description": "Batch and expiry tracking, automatic drug interaction alerts, and POS dispensation."
      },
      {
        "iconName": "Zap",
        "description": "Sample barcode tracking, equipment interfacing, and automated patient report delivery via WhatsApp/Email.",
        "title": "Laboratory Diagnostic Workflow"
      },
      {
        "title": "Appointment Booking & Queue TV",
        "description": "Online patient booking with token display screens in waiting lobbies.",
        "iconName": "Users"
      }
    ],
    "category": "Healthcare & EMR",
    "tabLabel": "Clinical Care",
    "description": "HIPAA-ready clinical platform connecting patient registration, doctor consultations, digital prescription writing, ICD-10 medical coding, pharmacy stock, and pathology lab report workflows.",
    "subtitle": "Electronic Medical Records, Pharmacy Dispensing & Lab Diagnostics",
    "id": "hms",
    "techStack": [
      "HL7 / FHIR",
      "PostgreSQL",
      "Next.js",
      "DICOM Viewer",
      "AES-256 Encrypted"
    ],
    "imageSrc": "/hero_clinic.jpg"
  },
  {
    "title": "Aether Enterprise CRM & Lead Pipeline",
    "id": "sls",
    "capabilities": [
      {
        "title": "Multi-Stage Kanban Pipeline",
        "description": "Visual deal management with customizable deal stages, win probabilities, and deal aging.",
        "iconName": "LineChart"
      },
      {
        "title": "Instant Quotation & Invoicing",
        "description": "1-click conversion from deal to PDF quotation with multi-currency VAT calculation.",
        "iconName": "Zap"
      },
      {
        "description": "Send automated follow-ups, payment reminders, and status notifications directly to leads.",
        "iconName": "Server",
        "title": "Automated WhatsApp & Email Triggers"
      },
      {
        "title": "Sales Performance Analytics",
        "description": "Executive dashboards showing conversion rates, revenue forecasts, and rep performance.",
        "iconName": "ShieldCheck"
      }
    ],
    "techStack": [
      "Next.js",
      "PostgreSQL",
      "WhatsApp Cloud API",
      "SendGrid",
      "Docker"
    ],
    "category": "Sales & Revenue",
    "description": "Close deals faster with unified pipeline management. Ingest leads from web forms, WhatsApp, and email, track follow-ups, generate professional PDF quotations, and monitor sales rep quotas.",
    "tabLabel": "Aether CRM",
    "subtitle": "Omnichannel Lead Capture, Quotation Engine & WhatsApp Automation",
    "metrics": [
      {
        "label": "PIPELINE TRACKING",
        "value": "Real-Time Kanban"
      },
      {
        "value": "Under 60 Seconds",
        "label": "QUOTE CREATION"
      },
      {
        "label": "INTEGRATIONS",
        "value": "WhatsApp & Email"
      }
    ],
    "imageSrc": "/hero_crm.jpg"
  },
  {
    "tabLabel": "Oracle Modernizer",
    "description": "Turn obsolete Oracle Forms 6i/11g/12c systems into responsive web applications. Preserve your battle-tested PL/SQL database packages while replacing outdated Java applets with modern Next.js interfaces.",
    "subtitle": "PL/SQL Refactoring to Resilient Cloud Microservices",
    "capabilities": [
      {
        "description": "Extract stored procedures and triggers into lightweight, containerized REST / gRPC microservices.",
        "title": "PL/SQL Business Logic Decoupling",
        "iconName": "Database"
      },
      {
        "title": "Web-Native User Experience",
        "description": "Replace cumbersome Oracle Form applets with lightning-fast, keyboard-shortcut-enabled web screens.",
        "iconName": "Zap"
      },
      {
        "description": "Phased migration strategies allowing legacy and modern interfaces to run concurrently on the same database.",
        "iconName": "ShieldCheck",
        "title": "Zero Downtime Parallel Cutover"
      },
      {
        "description": "Open up legacy systems to modern 3rd-party integrations, mobile apps, and cloud analytics.",
        "iconName": "Server",
        "title": "Modern API Layer & Webhooks"
      }
    ],
    "metrics": [
      {
        "value": "Guaranteed",
        "label": "ZERO DATA LOSS"
      },
      {
        "label": "DB INTEGRITY",
        "value": "Preserved 100%"
      },
      {
        "label": "INTERFACE",
        "value": "Responsive Web"
      }
    ],
    "imageSrc": "/oracle_modernization.png",
    "title": "Legacy Oracle Forms Modernization Suite",
    "techStack": [
      "Oracle DB 19c",
      "PL/SQL",
      "Next.js",
      "Node.js",
      "gRPC",
      "Docker"
    ],
    "category": "Legacy Modernization",
    "id": "oracle"
  }
];

export const ARCANUM_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    "title": "ARC Enterprise Resource Planning (ERPs)",
    "techStack": [
      "PostgreSQL",
      "TypeScript",
      "Docker",
      "Redis",
      "GraphQL",
      "TLS 1.3"
    ],
    "id": "erp",
    "description": "Integrate finance, inventory, multi-warehouse logistics, procurement, and asset tracking into a synchronized ledger. Enforces dual-authorization, strict audit trails, and automated UAE VAT tax filing.",
    "category": "Enterprise & Finance",
    "tabLabel": "ARC ERPs",
    "capabilities": [
      {
        "title": "Double-Entry Financial Ledger",
        "description": "Multi-currency ledger with real-time balance validation and immutable audit trails.",
        "iconName": "ShieldCheck"
      },
      {
        "title": "Multi-Warehouse Supply Chain",
        "iconName": "Zap",
        "description": "Automated stock re-order triggers, serial/batch tracking, and inventory valuation."
      },
      {
        "description": "End-to-end RFQ, PO generation, goods receipt notes (GRN), and 3-way invoice matching.",
        "iconName": "Server",
        "title": "Procurement & Vendor Portal"
      },
      {
        "description": "Depreciation calculation engine, maintenance tracking, and RFID asset tagging.",
        "title": "Asset Lifecycle Management",
        "iconName": "Cpu"
      }
    ],
    "subtitle": "Multi-Currency Financial Ledger & Real-Time Supply Chain Core",
    "imageSrc": "/hero_erp.jpg",
    "metrics": [
      {
        "value": "< 8ms",
        "label": "TRANSACTION LATENCY"
      },
      {
        "label": "SYSTEM SLA",
        "value": "99.99%"
      },
      {
        "value": "UAE VAT & WPS",
        "label": "COMPLIANCE"
      }
    ]
  },
  {
    "title": "Organization Management System (OMS)",
    "id": "oms",
    "description": "A master governance engine enabling multi-company group management, dynamic organizational trees, automated approval workflows, and centralized identity & access management (IAM).",
    "category": "Enterprise Governance",
    "capabilities": [
      {
        "title": "Hierarchical Entity Topology",
        "iconName": "Building2",
        "description": "Establish holding companies, subsidiaries, branch locations, and departments."
      },
      {
        "title": "Dynamic Approval Workflows",
        "iconName": "Zap",
        "description": "Configurable multi-stage approval matrix based on transaction threshold limits."
      },
      {
        "iconName": "ShieldCheck",
        "title": "Enterprise SSO & IAM",
        "description": "SAML 2.0, OAuth2, and Active Directory integration with hardware MFA."
      },
      {
        "title": "Central Audit & Telemetry",
        "iconName": "Server",
        "description": "Immutable logging of every user action, privilege escalation, and data mutation."
      }
    ],
    "subtitle": "Multi-Tenant Entity Structure, RBAC & Enterprise Identity Mesh",
    "tabLabel": "OMS Suite",
    "imageSrc": "/hero-topsection/ezgif-frame-105.jpg",
    "techStack": [
      "Node.js",
      "PostgreSQL",
      "OAuth2 / SAML",
      "Docker",
      "Redis",
      "gRPC"
    ],
    "metrics": [
      {
        "value": "< 3ms",
        "label": "AUTH LATENCY"
      },
      {
        "value": "Unlimited Orgs",
        "label": "TENANCY"
      },
      {
        "label": "ACCESS CONTROL",
        "value": "Granular RBAC"
      }
    ]
  },
  {
    "id": "banking",
    "capabilities": [
      {
        "title": "ISO 8583 Message Switch",
        "description": "Sub-millisecond packet routing connecting ATM networks, POS terminals, and core ledgers.",
        "iconName": "Cpu"
      },
      {
        "title": "Transa Mobile Banking",
        "description": "Biometric consumer banking app for funds transfer, utility payments, and statement downloads.",
        "iconName": "Zap"
      },
      {
        "description": "Specialized modules for loan underwriting, term deposits, dividend distribution, and locker management.",
        "iconName": "Server",
        "title": "Co-Operative Bank Add-Ons"
      },
      {
        "title": "Hardware Cryptographic Vault",
        "iconName": "ShieldCheck",
        "description": "Integration with HSM appliances for PIN block translation and end-to-end data encryption."
      }
    ],
    "category": "Banking & FinTech",
    "description": "Engineered for retail and co-operative banks. Features high-throughput ISO 8583 message switching, biometric ATM interfacing, automated SMS gateways, and secure consumer banking applications.",
    "metrics": [
      {
        "value": "Sub-12ms",
        "label": "SWITCH SPEED"
      },
      {
        "value": "HSM Vault Enforced",
        "label": "SECURITY"
      },
      {
        "label": "PROTOCOLS",
        "value": "ISO 8583 / REST"
      }
    ],
    "tabLabel": "Core Banking",
    "subtitle": "ISO 8583 Message Routing, ATM Gateway & Mobile Banking",
    "techStack": [
      "Java Spring Boot",
      "Kafka",
      "HSM Hardware Vault",
      "PostgreSQL",
      "ISO 8583"
    ],
    "title": "Core Banking Engine & Financial Switch",
    "imageSrc": "/banking_fintech.png"
  },
  {
    "capabilities": [
      {
        "description": "Visual table management with seat-level splitting, merge bills, and reservation timelines.",
        "iconName": "UtensilsCrossed",
        "title": "Interactive Floorplan & Tables"
      },
      {
        "title": "Real-Time Kitchen Display (KDS)",
        "iconName": "Zap",
        "description": "Color-coded cook times, preparation timers, and station-based routing for culinary efficiency."
      },
      {
        "title": "Recipe & Ingredient Costing",
        "description": "Automatic deduction of raw inventory down to the gram as orders are punched.",
        "iconName": "Server"
      },
      {
        "iconName": "ShieldCheck",
        "title": "Offline Resilient Engine",
        "description": "Keeps punching orders and printing kitchen tickets even if internet connection drops."
      }
    ],
    "category": "Hospitality & Retail",
    "id": "pos",
    "tabLabel": "Restaurant POS",
    "description": "High-speed POS designed for fine dining, multi-branch franchises, and fast-casual cafes. Features real-time Kitchen Display System (KDS) synchronization, QR table ordering, and recipe inventory cost tracking.",
    "techStack": [
      "Next.js",
      "WebSockets",
      "SQLite / Cloud Sync",
      "Thermal ESC/POS",
      "PWA"
    ],
    "subtitle": "Table Ordering, Floorplan Engine & Cloud Kitchen Management",
    "metrics": [
      {
        "label": "ORDER SYNC",
        "value": "Instant (WebSocket)"
      },
      {
        "label": "OFFLINE MODE",
        "value": "100% Resilient"
      },
      {
        "value": "Multi-Branch KDS",
        "label": "SUPPORT"
      }
    ],
    "imageSrc": "/hero_restaurant.jpg",
    "title": "CulinaryOS Restaurant POS & Kitchen Display"
  },
  {
    "title": "AuraCare Clinic & Hospital Management (HMS)",
    "metrics": [
      {
        "label": "EMR PROTOCOL",
        "value": "HL7 & FHIR Standard"
      },
      {
        "label": "DATA SECURITY",
        "value": "Zero-Trust HIPAA"
      },
      {
        "label": "PRESCRIPTION",
        "value": "Instant Digital PDF"
      }
    ],
    "capabilities": [
      {
        "iconName": "HeartPulse",
        "title": "Doctor EMR & Digital Prescriptions",
        "description": "Custom consultation templates, ICD-10 diagnostic coding, and digital e-prescriptions."
      },
      {
        "title": "Integrated Pharmacy System",
        "iconName": "Server",
        "description": "Batch and expiry tracking, automatic drug interaction alerts, and POS dispensation."
      },
      {
        "iconName": "Zap",
        "description": "Sample barcode tracking, equipment interfacing, and automated patient report delivery via WhatsApp/Email.",
        "title": "Laboratory Diagnostic Workflow"
      },
      {
        "title": "Appointment Booking & Queue TV",
        "description": "Online patient booking with token display screens in waiting lobbies.",
        "iconName": "Users"
      }
    ],
    "category": "Healthcare & EMR",
    "tabLabel": "Clinical Care",
    "description": "HIPAA-ready clinical platform connecting patient registration, doctor consultations, digital prescription writing, ICD-10 medical coding, pharmacy stock, and pathology lab report workflows.",
    "subtitle": "Electronic Medical Records, Pharmacy Dispensing & Lab Diagnostics",
    "id": "hms",
    "techStack": [
      "HL7 / FHIR",
      "PostgreSQL",
      "Next.js",
      "DICOM Viewer",
      "AES-256 Encrypted"
    ],
    "imageSrc": "/hero_clinic.jpg"
  },
  {
    "title": "Aether Enterprise CRM & Lead Pipeline",
    "id": "sls",
    "capabilities": [
      {
        "title": "Multi-Stage Kanban Pipeline",
        "description": "Visual deal management with customizable deal stages, win probabilities, and deal aging.",
        "iconName": "LineChart"
      },
      {
        "title": "Instant Quotation & Invoicing",
        "description": "1-click conversion from deal to PDF quotation with multi-currency VAT calculation.",
        "iconName": "Zap"
      },
      {
        "description": "Send automated follow-ups, payment reminders, and status notifications directly to leads.",
        "iconName": "Server",
        "title": "Automated WhatsApp & Email Triggers"
      },
      {
        "title": "Sales Performance Analytics",
        "description": "Executive dashboards showing conversion rates, revenue forecasts, and rep performance.",
        "iconName": "ShieldCheck"
      }
    ],
    "techStack": [
      "Next.js",
      "PostgreSQL",
      "WhatsApp Cloud API",
      "SendGrid",
      "Docker"
    ],
    "category": "Sales & Revenue",
    "description": "Close deals faster with unified pipeline management. Ingest leads from web forms, WhatsApp, and email, track follow-ups, generate professional PDF quotations, and monitor sales rep quotas.",
    "tabLabel": "Aether CRM",
    "subtitle": "Omnichannel Lead Capture, Quotation Engine & WhatsApp Automation",
    "metrics": [
      {
        "label": "PIPELINE TRACKING",
        "value": "Real-Time Kanban"
      },
      {
        "value": "Under 60 Seconds",
        "label": "QUOTE CREATION"
      },
      {
        "label": "INTEGRATIONS",
        "value": "WhatsApp & Email"
      }
    ],
    "imageSrc": "/hero_crm.jpg"
  },
  {
    "tabLabel": "Oracle Modernizer",
    "description": "Turn obsolete Oracle Forms 6i/11g/12c systems into responsive web applications. Preserve your battle-tested PL/SQL database packages while replacing outdated Java applets with modern Next.js interfaces.",
    "subtitle": "PL/SQL Refactoring to Resilient Cloud Microservices",
    "capabilities": [
      {
        "description": "Extract stored procedures and triggers into lightweight, containerized REST / gRPC microservices.",
        "title": "PL/SQL Business Logic Decoupling",
        "iconName": "Database"
      },
      {
        "title": "Web-Native User Experience",
        "description": "Replace cumbersome Oracle Form applets with lightning-fast, keyboard-shortcut-enabled web screens.",
        "iconName": "Zap"
      },
      {
        "description": "Phased migration strategies allowing legacy and modern interfaces to run concurrently on the same database.",
        "iconName": "ShieldCheck",
        "title": "Zero Downtime Parallel Cutover"
      },
      {
        "description": "Open up legacy systems to modern 3rd-party integrations, mobile apps, and cloud analytics.",
        "iconName": "Server",
        "title": "Modern API Layer & Webhooks"
      }
    ],
    "metrics": [
      {
        "value": "Guaranteed",
        "label": "ZERO DATA LOSS"
      },
      {
        "label": "DB INTEGRITY",
        "value": "Preserved 100%"
      },
      {
        "label": "INTERFACE",
        "value": "Responsive Web"
      }
    ],
    "imageSrc": "/oracle_modernization.png",
    "title": "Legacy Oracle Forms Modernization Suite",
    "techStack": [
      "Oracle DB 19c",
      "PL/SQL",
      "Next.js",
      "Node.js",
      "gRPC",
      "Docker"
    ],
    "category": "Legacy Modernization",
    "id": "oracle"
  }
];

export const ARCANUM_MODULES: ModuleItem[] = [
  {
    "imageSrc": "/hero_erp.jpg",
    "features": [
      "Modular Architecture",
      "High Throughput API",
      "Strict RBAC Security"
    ],
    "subtitle": "Custom Architecture Subsystem",
    "iconName": "Layers",
    "description": "Comprehensive enterprise-grade solution engineered with modular microservices and automated workflows.",
    "id": "mod-1787214297073",
    "title": "Enterprise Solution",
    "category": "Enterprise",
    "pageDetails": {
      "metrics": [
        {
          "label": "System SLA Uptime",
          "value": "99.99%",
          "trend": "Continuous Delivery"
        },
        {
          "trend": "Optimized Throughput",
          "value": "< 12ms",
          "label": "Microservice Latency"
        },
        {
          "trend": "AES-256 & TLS 1.3",
          "value": "100%",
          "label": "Data Encryption"
        },
        {
          "value": "24/7",
          "trend": "Senior Architects",
          "label": "Dedicated Support"
        }
      ],
      "customTitles": {},
      "accentColor": "blue",
      "architecture": {
        "database": "PostgreSQL / TimescaleDB with Redis caching layer",
        "runtime": "TypeScript, Next.js, PostgreSQL, Docker",
        "latency": "< 12ms average transaction execution",
        "messaging": "Kafka / RabbitMQ distributed event message bus",
        "security": "End-to-end encryption, strict RBAC, automated vulnerability scans",
        "scalability": "Containerized Docker & Kubernetes horizontal auto-scaling"
      },
      "heroHeadline": "Enterprise Solution — Enterprise",
      "brochureUrl": "",
      "executiveSummary": "Comprehensive enterprise-grade solution engineered with modular microservices and automated workflows.",
      "ctaSecondaryText": "Download PDF Spec",
      "showSecondaryCta": true,
      "sectionVisibility": {
        "related": true,
        "widget": true,
        "faqs": true,
        "compliance": true,
        "hero": true,
        "submodules": true,
        "industries": true,
        "metrics": true,
        "secondaryCta": true
      },
      "interactiveWidget": "workflow-pipeline",
      "heroSubtitle": "Custom Architecture Subsystem",
      "faqs": [
        {
          "answer": "We offer flexible deployment options including private cloud, on-premises bare-metal installations, or hybrid multi-datacenter configurations.",
          "question": "How is Enterprise Solution deployed within our existing enterprise IT infrastructure?"
        },
        {
          "answer": "All enterprise deployments come with a 99.99% uptime guarantee, 24/7 incident response from senior software architects, and ongoing performance optimizations.",
          "question": "What level of technical support and SLA guarantees are provided?"
        },
        {
          "question": "Can this solution be customized to meet our organization's unique workflows?",
          "answer": "Yes. The modular architecture is designed to be adapted to custom business logic, third-party ERP integrations, and specific regulatory requirements."
        }
      ],
      "ctaSecondaryUrl": "",
      "id": "mod-1787214297073",
      "subModules": [
        {
          "points": [
            "Zero technical debt implementation",
            "Full API orchestration & event webhooks",
            "Strict role-based access validation"
          ],
          "name": "Modular Architecture",
          "description": "Engineered to deliver high throughput, automated workflow execution, and robust audit compliance across distributed systems.",
          "badge": "Core Module 01"
        },
        {
          "points": [
            "Zero technical debt implementation",
            "Full API orchestration & event webhooks",
            "Strict role-based access validation"
          ],
          "name": "High Throughput API",
          "badge": "Core Module 02",
          "description": "Engineered to deliver high throughput, automated workflow execution, and robust audit compliance across distributed systems."
        },
        {
          "points": [
            "Zero technical debt implementation",
            "Full API orchestration & event webhooks",
            "Strict role-based access validation"
          ],
          "description": "Engineered to deliver high throughput, automated workflow execution, and robust audit compliance across distributed systems.",
          "badge": "Core Module 03",
          "name": "Strict RBAC Security"
        }
      ],
      "deploymentModes": [
        "Managed Sovereign Cloud",
        "On-Premises Dedicated Server",
        "Hybrid High-Availability Cluster"
      ],
      "slaGuarantee": "99.99% Production Uptime SLA • Enterprise Support Guaranteed",
      "targetIndustry": [
        "Commercial Enterprises",
        "Financial Organizations",
        "Government Entities",
        "Technology Providers"
      ],
      "complianceList": [
        "ISO 27001 Security Standard",
        "UAE Regulatory Guidelines",
        "SOC 2 Architecture Ready",
        "GDPR Article 32 Compliant"
      ],
      "theme": "enterprise-erp",
      "mockData": {
        "workflowSteps": [
          {
            "latency": "2.4ms",
            "status": "VALIDATED",
            "title": "Data Ingestion & Auth",
            "step": "01",
            "desc": "Secure payload ingestion via TLS 1.3 gateway"
          },
          {
            "status": "PASS",
            "title": "Validation & Rule Engine",
            "desc": "Granular policy evaluation and schema verification",
            "latency": "4.1ms",
            "step": "02"
          },
          {
            "title": "Execution & Settlement",
            "status": "COMMITTED",
            "step": "03",
            "latency": "5.8ms",
            "desc": "Distributed microservice transaction commit"
          },
          {
            "step": "04",
            "title": "Audit Ledger Recording",
            "latency": "1.2ms",
            "desc": "Cryptographic hash sealing across operational nodes",
            "status": "SEALED"
          }
        ],
        "records": [
          {
            "timestamp": "Committed 1m ago",
            "tag": "PRODUCTION",
            "title": "Enterprise Solution Primary Operational Node",
            "meta": "Distributed Cluster • UAE Region",
            "status": "ACTIVE",
            "id": "MOD-1787214297073-901"
          },
          {
            "id": "MOD-1787214297073-902",
            "status": "VERIFIED",
            "title": "High-Throughput Ingestion Queue",
            "timestamp": "Committed 4m ago",
            "meta": "Batch verification completed with 0 errors",
            "tag": "INSPECTED"
          },
          {
            "title": "Audit Trail & Compliance Ledger",
            "id": "MOD-1787214297073-903",
            "tag": "SEALED",
            "meta": "Cryptographic hash verified across nodes",
            "status": "COMPLIANT",
            "timestamp": "Committed 12m ago"
          },
          {
            "id": "MOD-1787214297073-904",
            "meta": "Real-time telemetry updated to dashboard",
            "tag": "TELEMETRY",
            "title": "Analytics & Reporting Synthesis",
            "timestamp": "Committed 18m ago",
            "status": "SYNCHRONIZED"
          }
        ],
        "systemLogs": [
          "[MOD-1787214297073:CORE] Microservices cluster initialized with 0 startup warnings",
          "[MOD-1787214297073:SECURITY] Cryptographic token authorization validated via secure gateway",
          "[MOD-1787214297073:PERF] Sub-12ms response commit achieved across analytical pipeline",
          "[MOD-1787214297073:AUDIT] Scheduled automated backup snapshot completed successfully"
        ],
        "tabTitle": "Enterprise Solution — Live System Telemetry & Operations Hub",
        "codeDiff": {
          "sourceLang": "Legacy / Monolith Architecture",
          "targetCode": "// Modern Distributed Microservice\nexport async function handleModuleExecution(ctx: Context, id: string) {\n  const res = await serviceBus.dispatch('module.execute', { id, ts: Date.now() });\n  return { ok: true, hash: res.signature };\n}",
          "sourceCode": "// Legacy Monolithic Handler\nPROCEDURE Process_Module(\n  p_id IN NUMBER\n) IS\nBEGIN\n  -- Hardcoded monolithic logic\n  UPDATE legacy_records SET status = 'DONE' WHERE id = p_id;\n  COMMIT;\nEND;",
          "targetLang": "Arcanum Modern Microservices"
        },
        "recordsHeader": [
          "Record / Transaction ID",
          "Subsystem Name",
          "Metadata / Parameters",
          "Status",
          "Execution Code"
        ]
      },
      "heroStyle": "split-console",
      "ctaPrimaryText": "Book a Demo / Discovery",
      "heroImage": "/hero_erp.jpg",
      "heroHighlight": "Architecture & System Specs."
    },
    "slug": "erp"
  }
];

export const BROCHURES_LIST: BrochureItem[] = [
  {
    "category": "Enterprise",
    "href": "https://arcanum.ae/assets/files/OMS.pdf",
    "title": "Organization Management System (OMS)"
  },
  {
    "href": "https://arcanum.ae/assets/files/ARC ERP.pdf",
    "category": "Enterprise",
    "title": "ARC ERP System"
  },
  {
    "category": "Enterprise",
    "title": "Accurate PAYROLL System",
    "href": "https://arcanum.ae/assets/files/Accurate PAYROLL.pdf"
  },
  {
    "href": "https://arcanum.ae/assets/files/Scholar School Management System.pdf",
    "title": "Scholar School Management System",
    "category": "Education"
  },
  {
    "href": "https://arcanum.ae/assets/files/Accurate Clinic Management.pdf",
    "title": "Accurate Clinic Management",
    "category": "Healthcare"
  },
  {
    "category": "Workspace",
    "title": "Accurate Sales & Invoicing",
    "href": "https://arcanum.ae/assets/files/Accurate Sales.pdf"
  },
  {
    "category": "Workspace",
    "href": "https://arcanum.ae/assets/files/Accurate LMS.pdf",
    "title": "Accurate LMS (Lead Management)"
  },
  {
    "title": "Simple Messenger Platform",
    "href": "https://arcanum.ae/assets/files/Simple Messenger.pdf",
    "category": "Workspace"
  },
  {
    "href": "https://arcanum.ae/assets/files/Issue Tracker.pdf",
    "title": "Issue Tracker Documentation",
    "category": "Infrastructure"
  },
  {
    "category": "Workspace",
    "href": "https://arcanum.ae/assets/files/Flex Data.pdf",
    "title": "Flex Data Survey Engine"
  },
  {
    "href": "https://arcanum.ae/assets/files/Point of sales.pdf",
    "category": "Workspace",
    "title": "Point of Sales (POS)"
  },
  {
    "category": "Banking",
    "href": "https://arcanum.ae/assets/files/Accurate My FIN.pdf",
    "title": "Accurate My-FIN Suite"
  },
  {
    "href": "https://arcanum.ae/assets/files/Accurate-Tender.pdf",
    "title": "Accurate Tender Application",
    "category": "Enterprise"
  },
  {
    "category": "Infrastructure",
    "title": "Website Creation Guidelines",
    "href": "https://arcanum.ae/assets/files/Website%20Creation.pdf"
  },
  {
    "href": "https://arcanum.ae/assets/files/Accurate Form builder.pdf",
    "title": "Accurate Form Builder",
    "category": "Workspace"
  },
  {
    "category": "Banking",
    "title": "Transa Money Application",
    "href": "https://arcanum.ae/assets/files/Transa Money.pdf"
  },
  {
    "category": "Infrastructure",
    "title": "Oracle Forms Modernization",
    "href": "https://arcanum.ae/assets/files/Oracle Forms.pdf"
  },
  {
    "title": "Co-Operative Bank Add-ons",
    "href": "https://arcanum.ae/assets/files/SCB Add ons-new.pdf",
    "category": "Banking"
  },
  {
    "category": "Workspace",
    "href": "https://arcanum.ae/assets/files/Accurate Job Portal.pdf",
    "title": "Accurate Job Portal"
  }
];
