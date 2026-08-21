export type PageThemeType = 'enterprise-erp' | 'fintech' | 'clinical-health' | 'academic-edu' | 'developer-dev' | 'saas-modern';
export type AccentColorType = 'blue' | 'emerald' | 'violet' | 'amber' | 'cyan' | 'rose';
export type HeroStyleType = 'split-console' | 'command-hud' | 'code-diff' | 'workflow-pipeline';
export type InteractiveWidgetType = 'live-telemetry' | 'code-transform' | 'workflow-pipeline' | 'vital-monitor' | 'campus-lifecycle';

export interface ProductWorkflowStep {
  step: string;
  title: string;
  desc: string;
  latency: string;
  status: string;
}

export interface ProductCodeDiff {
  sourceLang: string;
  sourceCode: string;
  targetLang: string;
  targetCode: string;
}

export interface ProductSubModule {
  name: string;
  badge?: string;
  description: string;
  points: string[];
}

export interface ProductMetric {
  value: string;
  label: string;
  trend: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductMockRecord {
  id: string;
  title: string;
  meta: string;
  status: string;
  tag: string;
  timestamp?: string;
}

export interface ProductSectionVisibility {
  hero?: boolean;
  secondaryCta?: boolean;
  metrics?: boolean;
  widget?: boolean;
  submodules?: boolean;
  industries?: boolean;
  compliance?: boolean;
  faqs?: boolean;
  related?: boolean;
}

export interface ProductCustomTitles {
  metricsEyebrow?: string;
  metricsTitle?: string;
  widgetEyebrow?: string;
  widgetTitle?: string;
  submodulesEyebrow?: string;
  submodulesTitle?: string;
  submodulesSubtitle?: string;
  industriesEyebrow?: string;
  industriesTitle?: string;
  complianceEyebrow?: string;
  complianceTitle?: string;
  faqsEyebrow?: string;
  faqsTitle?: string;
  relatedEyebrow?: string;
  relatedTitle?: string;
}

export interface ProductDetailItem {
  id: string;
  theme?: PageThemeType;
  accentColor?: AccentColorType;
  heroStyle?: HeroStyleType;
  interactiveWidget?: InteractiveWidgetType;
  heroBadge?: string;
  heroSubtitle?: string;
  heroHeadline: string;
  heroHighlight: string;
  executiveSummary: string;
  heroImage?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  showSecondaryCta?: boolean;
  brochureUrl?: string;
  targetIndustry: string[];
  deploymentModes: string[];
  slaGuarantee: string;
  metrics: ProductMetric[];
  subModules: ProductSubModule[];
  architecture: {
    runtime: string;
    database: string;
    security: string;
    messaging: string;
    latency: string;
    scalability: string;
  };
  complianceList: string[];
  mockData: {
    tabTitle: string;
    recordsHeader: string[];
    records: ProductMockRecord[];
    systemLogs: string[];
    codeDiff?: ProductCodeDiff;
    workflowSteps?: ProductWorkflowStep[];
  };
  faqs: ProductFaq[];
  sectionVisibility?: ProductSectionVisibility;
  customTitles?: ProductCustomTitles;
}

export const ARCHETYPE_TEMPLATES: Record<PageThemeType, Partial<ProductDetailItem>> = {
  'enterprise-erp': {
    theme: 'enterprise-erp',
    accentColor: 'blue',
    heroStyle: 'split-console',
    interactiveWidget: 'workflow-pipeline',
    heroBadge: 'Multi-Tenant Enterprise Core',
    heroHeadline: 'Multi-Tenant Organizational Hierarchy &',
    heroHighlight: 'Access Governance.',
    executiveSummary: 'Provides an immutable foundation for enterprise conglomerates, holding groups, and government bodies to orchestrate multi-branch operational hierarchies with strict RBAC, automated user provisioning, and full compliance auditing.',
  },
  fintech: {
    theme: 'fintech',
    accentColor: 'emerald',
    heroStyle: 'command-hud',
    interactiveWidget: 'live-telemetry',
    heroBadge: 'High-Frequency Switch Engine',
    heroHeadline: 'Sub-Millisecond Payment Switch &',
    heroHighlight: 'Financial Clearing Core.',
    executiveSummary: 'Engineered for tier-1 financial institutions, digital banks, and payment gateways requiring ultra-low latency ISO 20022 message routing, real-time fraud mitigation, and high-throughput settlement.',
  },
  'clinical-health': {
    theme: 'clinical-health',
    accentColor: 'cyan',
    heroStyle: 'split-console',
    interactiveWidget: 'vital-monitor',
    heroBadge: 'Clinical Interoperability & Medical Node Engine',
    heroHeadline: 'Hospital Information System &',
    heroHighlight: 'Patient Care Interoperability.',
    executiveSummary: 'An enterprise healthcare management suite integrating electronic medical records (EMR), laboratory workflows, pharmacy dispensing, and real-time medical device telemetry with strict HIPAA compliance.',
  },
  'academic-edu': {
    theme: 'academic-edu',
    accentColor: 'amber',
    heroStyle: 'workflow-pipeline',
    interactiveWidget: 'campus-lifecycle',
    heroBadge: '360° Academic Intelligence & Campus SIS',
    heroHeadline: 'Multi-Campus Student Lifecycle &',
    heroHighlight: 'Institutional Intelligence.',
    executiveSummary: 'Empowering universities, schools, and educational networks with unified student admissions, automated gradebooks, fee settlement gateways, and smart campus administration.',
  },
  'developer-dev': {
    theme: 'developer-dev',
    accentColor: 'violet',
    heroStyle: 'code-diff',
    interactiveWidget: 'code-transform',
    heroBadge: 'AST Code Modernization & Migration HUD',
    heroHeadline: 'Legacy Monolith Refactoring &',
    heroHighlight: 'Cloud-Native Migration.',
    executiveSummary: 'Automate the modernization of legacy Oracle Forms, COBOL, and monolithic codebases into type-safe, cloud-native microservices with AST parsing and zero-downtime cutover.',
  },
  'saas-modern': {
    theme: 'saas-modern',
    accentColor: 'rose',
    heroStyle: 'command-hud',
    interactiveWidget: 'live-telemetry',
    heroBadge: 'Unified Enterprise Digital Workspace',
    heroHeadline: 'Collaborative Enterprise Workspace &',
    heroHighlight: 'Workflow Orchestration.',
    executiveSummary: 'A high-performance modern workspace bringing teams, automated approval pipelines, document versioning, and real-time analytics together with enterprise-grade SSO.',
  },
};

export const PRODUCT_DETAILS_MAP: Record<string, ProductDetailItem> = {
  oms: {
    id: 'oms',
    heroHeadline: 'Multi-Tenant Organizational Hierarchy &',
    heroHighlight: 'Access Governance.',
    executiveSummary: 'The Arcanum Organization Management System (OMS) provides an immutable foundation for enterprise conglomerates, holding groups, and government bodies to orchestrate multi-branch operational hierarchies with strict RBAC, automated user provisioning, and full compliance auditing.',
    targetIndustry: ['Enterprise Conglomerates', 'Government Authorities', 'Financial Groups', 'Educational Networks'],
    deploymentModes: ['Private Cloud (AWS / Azure / GCP)', 'On-Premises Dedicated Server', 'Sovereign UAE Datacenter'],
    slaGuarantee: '99.995% Uptime SLA • Zero Cross-Tenant Data Leaks',
    metrics: [
      { value: '500K+', label: 'Managed Identities', trend: '+35% Year-over-Year' },
      { value: '< 8ms', label: 'Auth Token Verification', trend: 'Sub-second Latency' },
      { value: '100%', label: 'RBAC Audit Traceability', trend: 'Zero Policy Violations' },
      { value: '10K+', label: 'Concurrent Organizations', trend: 'Elastic Microservices' }
    ],
    subModules: [
      {
        name: 'Multi-Tier Branch & Node Architect',
        badge: 'Structural Core',
        description: 'Model complex parent-subsidiary matrices, division silos, and cost centers with granular inheritance policies.',
        points: ['Nested department graphs', 'Dynamic org-chart visualizer', 'Cross-branch delegation protocols']
      },
      {
        name: 'Zero-Trust RBAC & Permission Matrix',
        badge: 'Security Engine',
        description: 'Fine-grained policy engine enforcing attribute-based (ABAC) and role-based (RBAC) access across all downstream systems.',
        points: ['Custom role synthesis', 'Time-bound privileged access', 'MFA & biometric hardware keys']
      },
      {
        name: 'Automated Lifecycle & SCIM Onboarding',
        badge: 'Automation Hub',
        description: 'Streamline employee and vendor onboarding with automated email invitations, self-service setup, and instant revocation.',
        points: ['SCIM 2.0 provisioning', 'One-click offboarding lockdown', 'Single Sign-On (SAML / OIDC)']
      },
      {
        name: 'Immutable Audit Trail & Compliance Vault',
        badge: 'Governance',
        description: 'Cryptographically sealed audit logs tracking every permission change, privilege escalation, and session event in real time.',
        points: ['SOC 2 Type II compliance', 'SIEM & Splunk log forwarding', 'Exportable regulatory dossiers']
      }
    ],
    architecture: {
      runtime: 'Node.js & Go Microservices',
      database: 'PostgreSQL (Multi-tenant schema isolation) & Redis Cache',
      security: 'mTLS, AES-256 at rest, JWT ES256 asymmetric signing',
      messaging: 'Apache Kafka Event Streams',
      latency: '< 8ms Auth Resolution',
      scalability: 'Auto-scaling Kubernetes Cluster (EKS / OKE)'
    },
    complianceList: ['UAE Cyber Security Council Guidelines', 'ISO 27001 Certified', 'SOC 2 Type II Ready', 'GDPR Article 32 Compliant'],
    mockData: {
      tabTitle: 'Enterprise Hierarchy & RBAC Live Telemetry',
      recordsHeader: ['Entity Name', 'Organization Tier', 'Active Identities', 'Status', 'Security Posture'],
      records: [
        { id: 'ORG-8821', title: 'Arcanum Global Capital Holding', meta: 'Parent Corporation • 14 Subsidiaries', status: 'ACTIVE', tag: 'TIER-1 CORE', timestamp: 'Synced 2m ago' },
        { id: 'ORG-8822', title: 'Abu Dhabi Fintech Gateway LLC', meta: 'Regional Node • UAE GCC Cluster', status: 'VERIFIED', tag: 'FINANCIAL OPS', timestamp: 'Synced 5m ago' },
        { id: 'ORG-8823', title: 'Clinical Health Systems Node', meta: 'Hospital Network • EMR Integrated', status: 'COMPLIANT', tag: 'HEALTHCARE', timestamp: 'Synced 12m ago' },
        { id: 'ORG-8824', title: 'Smart Logistics & Terminal Hub', meta: 'Supply Chain Division • 1,200 Seats', status: 'ACTIVE', tag: 'INFRASTRUCTURE', timestamp: 'Synced 18m ago' }
      ],
      systemLogs: [
        '[OMS:SECURITY] Policy evaluated: user "sarah.alzahra@enterprise.ae" authenticated via SAML 2.0 SSO (Latency: 4.2ms)',
        '[OMS:AUDIT] Node structural update committed: Division "Fintech Labs" assigned to Parent "Arcanum Capital"',
        '[OMS:TOKEN] Distributed JWT revoked for expired contractor session token (TTL: 3600s)',
        '[OMS:SYNC] 1,420 Active RBAC permissions replicated across Redis cluster with zero collisions'
      ]
    },
    faqs: [
      { question: 'Does OMS support integration with existing Microsoft Entra ID or Okta?', answer: 'Yes. Arcanum OMS natively supports SAML 2.0, OIDC, and SCIM 2.0 protocols for bi-directional synchronization with Azure Entra ID, Okta, PingFederate, and Google Workspace.' },
      { question: 'Can we define custom hierarchical approval chains across entities?', answer: 'Absolutely. The dynamic workflow engine allows multi-level routing where authorization rules depend on department, spend tier, branch location, and custom metadata.' },
      { question: 'How is data isolated between parent companies and subsidiaries?', answer: 'We utilize strict multi-tenant row-level security (RLS) combined with optional dedicated schema or database partitioning to ensure zero data bleeding.' }
    ]
  },

  erp: {
    id: 'erp',
    heroHeadline: 'Modular Enterprise Operations &',
    heroHighlight: 'Real-Time Financial Ledger.',
    executiveSummary: 'ARC ERP is a battle-tested enterprise resource planning system built for high-throughput commercial enterprises in the Middle East. It unifies real-time multi-currency general ledgers, automated procurement, multi-warehouse supply chains, and executive analytics into a cohesive, sub-second platform.',
    targetIndustry: ['Trading & Distribution', 'Manufacturing & Assemblies', 'Real Estate & Facility Ops', 'Contracting & Heavy Industry'],
    deploymentModes: ['On-Premises High Availability', 'Private Enterprise Cloud', 'Hybrid Distributed Edge'],
    slaGuarantee: '99.999% Financial Ledger Integrity SLA • Zero Discrepancies',
    metrics: [
      { value: 'AED 4.2B+', label: 'Annual Transactions Tracked', trend: 'Strict Double-Entry' },
      { value: '< 12ms', label: 'Ledger Posting Latency', trend: 'ACID Compliant' },
      { value: '18+', label: 'Core Operational Submodules', trend: 'Fully Integrated' },
      { value: '45%', label: 'Procurement Cycle Reduction', trend: 'Automated Approvals' }
    ],
    subModules: [
      {
        name: 'General Ledger & Multi-Currency Treasury',
        badge: 'Financial Core',
        description: 'Automated double-entry accounting with real-time currency conversion, VAT reporting, and bank reconciliation.',
        points: ['Multi-chart of accounts', 'UAE FTA VAT compliant reporting', 'Automated currency revaluation']
      },
      {
        name: 'Supply Chain & Multi-Warehouse Control',
        badge: 'Logistics Core',
        description: 'Real-time inventory valuation (FIFO / Weighted Average), barcode/QR tracking, batch lot control, and automated replenishment.',
        points: ['Automated reorder triggers', 'Inter-warehouse transfers', 'Serial & batch expiry tracking']
      },
      {
        name: 'Procurement & Purchase Order Workflow',
        badge: 'Supply Management',
        description: 'End-to-end purchasing lifecycle from requisition and 3-way vendor quote comparison to Goods Received Note (GRN) matching.',
        points: ['3-way matching validation', 'Vendor performance scoring', 'Digital approval matrices']
      },
      {
        name: 'Fixed Assets & Depreciation Lifecycle',
        badge: 'Asset Governance',
        description: 'Comprehensive tracking of enterprise assets, straight-line and declining depreciation schedules, maintenance logs, and disposal.',
        points: ['Automated monthly depreciation postings', 'Asset tagging with RFID/QR', 'Maintenance work order integration']
      }
    ],
    architecture: {
      runtime: 'Distributed Go & TypeScript Microservices',
      database: 'PostgreSQL with TimescaleDB analytical partitions & Redis Cluster',
      security: 'End-to-end TLS 1.3, Field-level encryption for sensitive financials',
      messaging: 'RabbitMQ & Kafka event brokers',
      latency: '< 12ms Journal Entry Commit',
      scalability: 'Sharded transactional nodes with high-availability standby'
    },
    complianceList: ['UAE FTA VAT Law Compliant', 'IFRS (International Financial Reporting Standards)', 'ISO 9001 Quality Certified', 'GAAP Compliant'],
    mockData: {
      tabTitle: 'Enterprise Resource Planning & Ledger Hub',
      recordsHeader: ['Voucher / PO #', 'Cost Center / Account', 'Amount (AED)', 'Status', 'Workflow State'],
      records: [
        { id: 'JV-2026-904', title: 'Corporate Treasury Revaluation - USD/AED', meta: 'FX Settlement • Central Ledger', status: 'SYNCHRONIZED', tag: 'FINANCE', timestamp: 'Posted 1m ago' },
        { id: 'PO-2026-118', title: 'Industrial Server Hardware Procurement', meta: 'Vendor: Al-Ain Systems LLC', status: 'VERIFIED', tag: 'PROCUREMENT', timestamp: 'Approved 6m ago' },
        { id: 'GRN-44910', title: 'Raw Material Lot Batch #B-992 Receipt', meta: 'Main Port Warehouse Bay #4', status: 'ACTIVE', tag: 'INVENTORY', timestamp: 'Verified 14m ago' },
        { id: 'INV-77301', title: 'Enterprise Billing - GCC Distribution Node', meta: 'Tax Invoice with QR Verification', status: 'COMPLIANT', tag: 'VAT READY', timestamp: 'Dispatched 22m ago' }
      ],
      systemLogs: [
        '[ERP:LEDGER] Real-time Journal entry commit: Voucher #JV-904 balanced (Debit: AED 450,000.00 / Credit: AED 450,000.00)',
        '[ERP:INVENTORY] Stock decrement recorded for SKU-8849-DXB in Main Warehouse (Current On-Hand: 14,200 Units)',
        '[ERP:VAT] Automatic UAE FTA XML summary generated for Q3 tax review',
        '[ERP:AUDIT] Purchase order #PO-118 passed 3-way GRN and invoice reconciliation with 0 variance'
      ]
    },
    faqs: [
      { question: 'Is ARC ERP compliant with UAE Federal Tax Authority (FTA) requirements?', answer: 'Yes, ARC ERP features native FTA VAT generation, producing tax invoices with mandatory cryptographic QR codes and automated VAT 201 return calculations.' },
      { question: 'Can ARC ERP integrate with third-party legacy databases or CRMs?', answer: 'Yes. It exposes secure, high-throughput REST and GraphQL APIs with webhook subscriptions for seamless synchronization with SAP, Oracle, Salesforce, and custom portals.' },
      { question: 'How does it handle multi-branch operations across different countries?', answer: 'ARC ERP supports multi-company, multi-branch structures with isolated fiscal calendars, localized tax rules (e.g. GCC VAT, India GST), and automatic consolidated reporting.' }
    ]
  },

  payroll: {
    id: 'payroll',
    heroHeadline: 'Automated Compensation, Compliance &',
    heroHighlight: 'UAE WPS Engine.',
    executiveSummary: 'Accurate PAYROLL is an enterprise compensation engine engineered specifically for UAE regulatory standards and distributed workforces. It guarantees 100% compliance with UAE Wages Protection System (WPS) SIF file formats, automated gratuity/EOSB calculations, and multi-bank disbursement integrations.',
    targetIndustry: ['Corporate Enterprises', 'Staffing & Manpower Groups', 'Hospitality & Retail Chains', 'Construction & Contracting'],
    deploymentModes: ['Secure Cloud SaaS', 'Dedicated Virtual Appliance', 'On-Premises Corporate Server'],
    slaGuarantee: '100% Guaranteed UAE WPS SIF Validation • Zero Salary Processing Errors',
    metrics: [
      { value: '150K+', label: 'Monthly Payslips Dispatched', trend: 'Processed in < 3 mins' },
      { value: '100%', label: 'UAE WPS Compliance Rate', trend: 'Direct Central Bank Format' },
      { value: '0 Error', label: 'Disbursement Accuracy', trend: 'Automated 12-Point Checks' },
      { value: '80%', label: 'HR Inquiry Reduction', trend: 'Self-Service Employee App' }
    ],
    subModules: [
      {
        name: 'UAE WPS SIF File Generator',
        badge: 'Statutory Core',
        description: 'Generates byte-perfect Salary Information Files (.SIF) adhering strictly to UAE Ministry of Human Resources & Emiratisation (MOHRE) standards.',
        points: ['Automated bank routing code lookup', 'MOHRE employer ID verification', 'Instant pre-flight validation syntax checks']
      },
      {
        name: 'End-of-Service & Gratuity Calculator',
        badge: 'Labor Law Engine',
        description: 'Native calculation of gratuity, leave encashment, and severance packages in accordance with the latest UAE Federal Decree-Law on Labor Relations.',
        points: ['Limited/unlimited contract rules', 'Automated resignation vs termination multipliers', 'Final settlement breakdown generator']
      },
      {
        name: 'Biometric Attendance & Leave Sync',
        badge: 'Time Tracking',
        description: 'Direct ingestion from biometric fingerprint and facial recognition scanners with automated overtime and deduction calculations.',
        points: ['Multi-shift roster scheduling', 'Automated Ramadan & public holiday adjustments', 'Live leave balance tracking']
      },
      {
        name: 'Employee Self-Service Mobile Portal',
        badge: 'Employee Hub',
        description: 'Mobile-friendly portal for staff to view digital payslips, request annual leave, submit expense claims, and track loans.',
        points: ['Encrypted PDF payslip delivery with password', 'Expense reimbursement approval chains', 'Salary certificate requests']
      }
    ],
    architecture: {
      runtime: 'Node.js & Python Calculation Engine',
      database: 'PostgreSQL with encrypted personal identifiable information (PII)',
      security: 'AES-GCM encryption for bank account numbers, 2FA for payroll sign-off',
      messaging: 'Redis Queue for asynchronous batch payslip dispatch',
      latency: '< 150ms per employee calculation batch',
      scalability: 'Calculates 50,000 employee salaries in under 120 seconds'
    },
    complianceList: ['UAE MOHRE Labor Law Compliant', 'UAE Central Bank WPS Standard', 'GDPR / Local Data Privacy Laws', 'ISO 27001 Certified'],
    mockData: {
      tabTitle: 'Live Payroll Processing & WPS Validator',
      recordsHeader: ['Employee ID', 'Name & Designation', 'Net Salary (AED)', 'Status', 'WPS Dispatch Code'],
      records: [
        { id: 'EMP-4011', title: 'Tariq Al-Mansouri (Senior Architect)', meta: 'IBAN: AE290330000001294829102', status: 'COMPLIANT', tag: 'WPS READY', timestamp: 'Validated 2m ago' },
        { id: 'EMP-4012', title: 'Fatima Al-Nuaimi (Financial Controller)', meta: 'IBAN: AE040210000009847219801', status: 'COMPLIANT', tag: 'WPS READY', timestamp: 'Validated 3m ago' },
        { id: 'EMP-4013', title: 'Vikram Joshi (Lead Systems Engineer)', meta: 'IBAN: AE880340000003719482711', status: 'COMPLIANT', tag: 'WPS READY', timestamp: 'Validated 4m ago' },
        { id: 'EMP-4014', title: 'Rashid Khan (Operations Specialist)', meta: 'IBAN: AE120550000007481928371', status: 'COMPLIANT', tag: 'WPS READY', timestamp: 'Validated 5m ago' }
      ],
      systemLogs: [
        '[PAYROLL:WPS] Batch file "SIF_ARCANUM_202608.SIF" assembled (Total Employees: 1,480, Gross: AED 8,920,400.00)',
        '[PAYROLL:VALIDATION] MOHRE 13-digit Labour IDs verified against Central Bank routing tables with 0 warnings',
        '[PAYROLL:EOSB] Final settlement calculated for EMP-2901 following UAE Federal Decree-Law Article 51',
        '[PAYROLL:DISPATCH] 1,480 Encrypted digital payslips generated and queued for instant employee notification'
      ]
    },
    faqs: [
      { question: 'How does Accurate PAYROLL ensure WPS SIF files will not be rejected by UAE banks?', answer: 'The engine conducts automated pre-flight checks validating IBAN check-digits, MOHRE Employer IDs, Agent IDs, and salary component limits before generating the SIF file, eliminating bank rejections.' },
      { question: 'Can it connect directly to our biometric devices at multiple branch offices?', answer: 'Yes. It supports direct TCP/IP and API integrations with ZKTeco, Suprema, and Hikvision biometric time clocks across geographically distributed sites.' },
      { question: 'Does it support customized allowances, deductions, and loan repayments?', answer: 'Yes. You can define unlimited customized recurring or one-off allowances, automated company loan deductions, and performance bonuses.' }
    ]
  },

  banking: {
    id: 'banking',
    heroHeadline: 'High-Throughput Core Banking Architecture &',
    heroHighlight: 'Financial Portals.',
    executiveSummary: 'Arcanum Core Banking Application is an industrial financial platform engineered for retail banks, cooperative institutions, and fintech operators. Featuring sub-12ms transaction switching, ISO 8583 message standard bridging, Hardware Security Module (HSM) encryption, and real-time audit logging.',
    targetIndustry: ['Commercial Banks', 'Co-operative Banks & Credit Unions', 'Microfinance Institutions', 'Fintech Payment Providers'],
    deploymentModes: ['Tier-4 Financial Datacenter', 'Private Sovereign Cloud', 'High-Availability Cluster Active-Active'],
    slaGuarantee: '99.999% Banking Switch Availability • Zero Data Loss Guarantee',
    metrics: [
      { value: '1,500+', label: 'Transactions per Second (TPS)', trend: 'Benchmark Tested' },
      { value: '< 12ms', label: 'Switch Response Time', trend: 'Sub-second Gateway' },
      { value: 'AES-256', label: 'Hardware HSM Cryptography', trend: 'PCI-DSS Compliant' },
      { value: 'Zero', label: 'Transaction Loss Record', trend: 'Two-Phase Commits' }
    ],
    subModules: [
      {
        name: 'Real-Time Transaction Ledger & Switch',
        badge: 'Core Engine',
        description: 'High-throughput financial ledger handling debit/credit entries with two-phase locking and zero ledger discrepancy.',
        points: ['Sub-12ms transaction commits', 'Automated end-of-day (EOD) batch runs', 'Multi-currency settlement']
      },
      {
        name: 'ISO 8583 ATM & POS Switch Connector',
        badge: 'Switch Interface',
        description: 'Direct integration with international payment networks (VISA, Mastercard, Local Switches) via standard ISO 8583 protocols.',
        points: ['Bit-level packet parsing & assembly', 'Network keep-alive monitor', 'Real-time PIN translation & validation']
      },
      {
        name: 'Customer Teller Station & Branch Portal',
        badge: 'Branch Ops',
        description: 'Modern teller interface for cash deposits, withdrawals, demand drafts, cheque clearance, and signature verification.',
        points: ['Cheque Truncation System (CTS) bridge', 'Dual authorization for high-value transactions', 'Teller cash limit control']
      },
      {
        name: 'AML & Fraud Detection Monitor',
        badge: 'Compliance & Risk',
        description: 'Real-time heuristic risk scoring, transaction monitoring, structured deposit detection (smurfing), and sanction list screening.',
        points: ['Real-time OFAC / PEP list matching', 'Velocity anomaly flags', 'Automated SAR report generation']
      }
    ],
    architecture: {
      runtime: 'Java Spring Cloud & C++ Low-Latency Core',
      database: 'Oracle Database 19c Enterprise RAC with Data Guard & Redis Cluster',
      security: 'Thales / SafeNet Hardware Security Module (HSM), PCI-DSS Level 1 certified architecture',
      messaging: 'Apache Kafka high-throughput event logs',
      latency: '< 12ms ATM Switch Turnaround',
      scalability: 'Active-Active multi-datacenter failover with synchronous replication'
    },
    complianceList: ['Central Bank Banking Regulations', 'PCI-DSS Level 1 Compliance', 'ISO 8583 / ISO 20022 Financial Standards', 'Anti-Money Laundering (AML) Protocols'],
    mockData: {
      tabTitle: 'Core Banking Switch & ATM Gateway Telemetry',
      recordsHeader: ['Transaction Ref', 'Account / Card Mask', 'Amount', 'Type / Switch Node', 'Status'],
      records: [
        { id: 'TXN-9984128', title: 'ATM Cash Withdrawal - Switch Node DXB-01', meta: 'Card: 4532 **** **** 8819', status: 'SYNCHRONIZED', tag: 'ISO 8583 MSG 0200', timestamp: 'Committed 350ms ago' },
        { id: 'TXN-9984129', title: 'Interbank Fund Transfer (UAEFTS / IPP)', meta: 'IBAN: AE19033000000984716291', status: 'ACTIVE', tag: 'INSTANT TRANSFER', timestamp: 'Committed 1.2s ago' },
        { id: 'TXN-9984130', title: 'Teller Branch Deposit - Capital Hub', meta: 'Account: 0019284719028', status: 'VERIFIED', tag: 'TELLER POSTING', timestamp: 'Committed 4.1s ago' },
        { id: 'TXN-9984131', title: 'POS Merchant Settlement - Mall of Emirates', meta: 'Merchant ID: MID-998120', status: 'COMPLIANT', tag: 'BATCH SETTLE', timestamp: 'Committed 8.4s ago' }
      ],
      systemLogs: [
        '[SWITCH:ISO8583] Incoming 0200 Financial Request from ATM Node #4402 - PIN validated via HSM (Latency: 6.8ms)',
        '[SWITCH:LEDGER] Real-time debit committed on Core Balance Account #0098214 - New Balance calculated',
        '[SWITCH:AML] Heuristic risk score calculated for international remittance: Score 12/100 (Clean / Approved)',
        '[SWITCH:CLUSTER] Active-Active synchronization heartbeat: 0 packets dropped across Primary & Secondary Datacenters'
      ]
    },
    faqs: [
      { question: 'Does this platform support connectivity to national switches and ATM networks?', answer: 'Yes. It features dedicated ISO 8583 message translators and network adapters pre-configured for UAE Switch, GCC Net, NPCI, and international card schemes.' },
      { question: 'How is data security handled for sensitive financial transactions?', answer: 'All PIN verification and card data processing are offloaded to certified Hardware Security Modules (HSMs) using dynamic key rotation and zone encryption.' },
      { question: 'Can the core banking engine integrate with existing third-party mobile apps?', answer: 'Yes, it provides open banking REST and gRPC gateways with OAuth2 / mTLS for secure external digital wallet and mobile app integration.' }
    ]
  },

  oracle: {
    id: 'oracle',
    heroHeadline: 'Refactoring Legacy Oracle Forms into',
    heroHighlight: 'Cloud Microservices.',
    executiveSummary: 'Arcanum Oracle Forms Modernization service extracts business logic locked inside legacy Oracle Forms 6i/10g/11g/12c, transforms PL/SQL procedures into modern TypeScript/Go microservices, and delivers reactive Next.js web applications with zero business disruption and a 100% data fidelity guarantee.',
    targetIndustry: ['Government Ministries', 'Established Banking Institutions', 'Large Industrial Manufacturers', 'Logistics & Shipping Lines'],
    deploymentModes: ['Hybrid Coexistence Mode', 'Cloud-Native Containerized', 'On-Premises High Availability'],
    slaGuarantee: 'Zero Data Loss Guarantee • Automated PL/SQL Logic Verification',
    metrics: [
      { value: '100%', label: 'PL/SQL Logic Extraction', trend: 'Automated AST Parser' },
      { value: '0 sec', label: 'End-User Operational Downtime', trend: 'Parallel Run Bridge' },
      { value: '10x', label: 'Faster User Interaction Speeds', trend: 'Modern React/Next.js' },
      { value: 'Zero', label: 'Oracle Client Installation Needed', trend: '100% Web Native' }
    ],
    subModules: [
      {
        name: 'Automated FMB/PL-SQL Parsing Engine',
        badge: 'Refactoring Core',
        description: 'Our proprietary tooling parses Oracle Forms binary (.fmb) and PL/SQL packages into structured abstract syntax trees (AST).',
        points: ['Trigger logic mapping (PRE-QUERY, WHEN-BUTTON-PRESSED)', 'Stored procedure isolation', 'Data-block hierarchy extraction']
      },
      {
        name: 'Modern Web UI Replacement',
        badge: 'UI Modernization',
        description: 'Converts archaic grey Oracle Forms interfaces into sleek, responsive web applications built with Next.js, Tailwind, and React.',
        points: ['Keyboard shortcut retention (F8 execute query, F7 enter query)', 'Grid editing & dynamic lookups', 'Mobile & tablet responsive']
      },
      {
        name: 'Hybrid Database Bridge & Sync',
        badge: 'Data Integrity',
        description: 'Allows legacy Oracle Forms and the new Web interface to run concurrently against the same Oracle Database during transition periods.',
        points: ['Bi-directional database trigger sync', 'Zero data corruption locking protocols', 'Gradual phase-by-phase rollout']
      },
      {
        name: 'Microservice API Extraction',
        badge: 'Architecture Upgrade',
        description: 'Encapsulates complex stored procedures, package bodies, and functions into clean REST/gRPC API microservices.',
        points: ['OpenAPI 3.0 documentation', 'Automated unit test generation', 'Containerized Docker deployments']
      }
    ],
    architecture: {
      runtime: 'Next.js 14 Web Frontend + Node.js / Go Microservices',
      database: 'Oracle Database 19c / 23c Enterprise + Optional PostgreSQL Cloud Migration',
      security: 'Modern SSO (OIDC/SAML), role mapping, TLS 1.3 encryption',
      messaging: 'Kafka for real-time change data capture (CDC)',
      latency: '< 100ms API response time',
      scalability: 'Cloud-ready Kubernetes deployment replacing heavy Oracle WebLogic Application Servers'
    },
    complianceList: ['Zero Data Loss Certified', 'ISO 27001 Security Standard', 'Enterprise IT Governance Compliant'],
    mockData: {
      tabTitle: 'Oracle Forms Migration & Modernization Telemetry',
      recordsHeader: ['Module FMB File', 'Extracted Triggers / Stored Procs', 'Modern Web Component', 'Migration Status', 'Logic Match Rate'],
      records: [
        { id: 'FMB-INVENTORY_01', title: 'INVENTORY_MGMT.FMB (Oracle 11g)', meta: 'Extracted: 84 Triggers, 12 Block Hierarchies', status: 'SYNCHRONIZED', tag: 'REACT / NEXT.JS', timestamp: '100% Logic Parity' },
        { id: 'FMB-PAYROLL_DISPATCH', title: 'PAYROLL_CALC.FMB (Oracle 10g)', meta: 'Extracted: 42 PL/SQL Packages converted to Go', status: 'COMPLIANT', tag: 'MICROSERVICES', timestamp: '100% Logic Parity' },
        { id: 'FMB-GL_JOURNAL', title: 'FINANCIAL_GL.FMB (Oracle 12c)', meta: 'Extracted: 112 Validation rules & Multi-currency', status: 'ACTIVE', tag: 'WEB UI COMMITTED', timestamp: '99.98% Parity Verified' },
        { id: 'FMB-CUSTOMER_REG', title: 'CUSTOMER_MASTER.FMB (Oracle 6i)', meta: 'Extracted: Legacy Client-Server block structures', status: 'VERIFIED', tag: 'REST API READY', timestamp: '100% Logic Parity' }
      ],
      systemLogs: [
        '[ORACLE:PARSER] Abstract syntax tree generated for FMB-INVENTORY_01: 84 PL/SQL blocks converted to TypeScript APIs',
        '[ORACLE:COEXISTENCE] Dual-write transaction verified: Web UI updated row in Oracle DB without locking legacy Forms session',
        '[ORACLE:PERF] Form load latency reduced from 4.8s (WebLogic Java Applet) to 180ms (Next.js Edge Rendering)',
        '[ORACLE:AUDIT] Automated end-to-end regression tests passed: 1,420 test cases matching legacy calculation output exactly'
      ]
    },
    faqs: [
      { question: 'Do our users need to relearn how to use the software?', answer: 'No. We preserve standard enterprise keyboard navigation workflows (like F7 enter query, F8 execute, F10 commit) so users experience zero friction while benefiting from modern web interfaces.' },
      { question: 'Can we modernize our system in phases without shutting down daily operations?', answer: 'Yes! Our Hybrid Coexistence Architecture allows you to migrate one department or module at a time while keeping everything connected to your central Oracle Database.' },
      { question: 'What happens to our heavy PL/SQL packages and complex database triggers?', answer: 'Your complex database business logic is preserved and optimized. We either invoke the stored procedures directly via high-speed microservices or refactor them into clean Go/Node.js routines based on your architectural preference.' }
    ]
  },

  hms: {
    id: 'hms',
    heroHeadline: 'Unified Clinical EMR, Diagnostic Laboratory &',
    heroHighlight: 'Pharmacy Architecture.',
    executiveSummary: 'Accurate Clinic Management System is a clinical-grade healthcare software platform connecting doctors, outpatient departments, diagnostic imaging, pathology laboratories, and digital pharmacies with seamless electronic medical records (EMR) and insurance claim processing.',
    targetIndustry: ['Specialty Clinics & Polyclinics', 'Hospital Networks', 'Diagnostic Pathology Centers', 'Chain Pharmacies'],
    deploymentModes: ['HIPAA/UAE Compliant Cloud', 'On-Premises Hospital Server', 'Hybrid Datacenter'],
    slaGuarantee: '99.99% Healthcare System SLA • Zero Medical Record Loss',
    metrics: [
      { value: '250K+', label: 'Patient Encounters Logged', trend: 'Secure EMR Records' },
      { value: '< 2s', label: 'E-Prescription Dispensation', trend: 'Instant Pharmacy Sync' },
      { value: '100%', label: 'Insurance Claim Clean Rate', trend: 'Automated Rule Engine' },
      { value: '30%', label: 'Patient Waiting Time Reduction', trend: 'Smart Queue Router' }
    ],
    subModules: [
      {
        name: 'Doctor Consultation & Electronic Medical Records (EMR)',
        badge: 'Clinical Core',
        description: 'Comprehensive patient health records with clinical history, diagnostic notes, vital sign trends, and ICD-10 coding.',
        points: ['ICD-10 / CPT code autocomplete', 'Custom specialty clinical templates', 'Voice-to-text medical transcription']
      },
      {
        name: 'Digital E-Prescription & Pharmacy Inventory',
        badge: 'Pharmacy Hub',
        description: 'Direct transmission of electronic prescriptions to the in-house pharmacy with automated drug interaction alerts and stock deduction.',
        points: ['Drug-to-drug allergy warnings', 'Batch barcode dispensation', 'Automated restock threshold alerts']
      },
      {
        name: 'Laboratory Information System (LIS)',
        badge: 'Diagnostics',
        description: 'Integrated lab order management connecting diagnostic analyzers, test result approval workflows, and patient PDF delivery.',
        points: ['Direct analyzer interface (HL7 / ASTM)', 'Critical abnormal value flags', 'WhatsApp & SMS report dispatch']
      },
      {
        name: 'Insurance Claim & E-Billing Gateway',
        badge: 'Revenue Cycle',
        description: 'Automated insurance eligibility checking, pre-authorization requests, and electronic claim submission in compliance with regional health authorities.',
        points: ['DHA / DoH / Malaffi compliance ready', 'Automated rejection scrubber', 'Patient co-pay calculation']
      }
    ],
    architecture: {
      runtime: 'React Frontend with Python FastAPI Clinical Backend',
      database: 'PostgreSQL with encrypted PHI (Protected Health Information) columns',
      security: 'HL7 FHIR compliant APIs, RBAC for clinical roles, DICOM viewer integration',
      messaging: 'RabbitMQ for real-time order dispatch',
      latency: '< 15ms Patient Record Retrieval',
      scalability: 'Clustered hospital network instances with edge local failover'
    },
    complianceList: ['UAE Malaffi / Nabidh / Riayati Ready', 'HL7 FHIR Standard Compliant', 'HIPAA Privacy Compliant', 'ISO 27799 Health Informatics'],
    mockData: {
      tabTitle: 'Clinical Workflow & EMR Patient Telemetry',
      recordsHeader: ['Patient MRN', 'Patient Name & Age', 'Doctor / Specialty', 'Encounter Status', 'Clinical Stage'],
      records: [
        { id: 'MRN-88190', title: 'Rashid Al-Nuaimi (42 Yrs)', meta: 'Cardiology • Dr. Farooq Al-Hashimi', status: 'ACTIVE', tag: 'IN CONSULTATION', timestamp: 'Checked In 5m ago' },
        { id: 'MRN-88191', title: 'Zainab Qassim (29 Yrs)', meta: 'Pediatrics • Dr. Maya Al-Balooshi', status: 'VERIFIED', tag: 'PHARMACY DISPENSE', timestamp: 'E-Prescription Sent' },
        { id: 'MRN-88192', title: 'David Chen (54 Yrs)', meta: 'Pathology Lab • Lipid Profile & HbA1c', status: 'SYNCHRONIZED', tag: 'RESULTS COMMITTED', timestamp: 'LIS Synced 12m ago' },
        { id: 'MRN-88193', title: 'Mariam Al-Kindi (38 Yrs)', meta: 'Dermatology • Insurance Pre-Auth Approved', status: 'COMPLIANT', tag: 'CLAIM CLEARED', timestamp: 'E-Claim Passed' }
      ],
      systemLogs: [
        '[CLINICAL:EMR] Patient record MRN-88190 encrypted consultation notes saved with ICD-10 Code: I10 (Essential Hypertension)',
        '[CLINICAL:PHARMACY] E-Prescription #RX-9948 transmitted to Central Pharmacy with Zero Drug Allergy Conflicts detected',
        '[CLINICAL:LIS] Analyzer Sysmex XN-550 committed complete blood count (CBC) test results directly to Patient Chart',
        '[CLINICAL:INSURANCE] Electronic claim XML generated and validated against regional payer authorization matrix'
      ]
    },
    faqs: [
      { question: 'Is Accurate Clinic Management compatible with UAE Health Authority platforms like Malaffi or Nabidh?', answer: 'Yes. The system is built on modern HL7 FHIR protocols designed for straightforward integration with regional health information exchanges such as Malaffi (Abu Dhabi) and Nabidh (Dubai).' },
      { question: 'Can lab diagnostic machines send test results directly into the patient chart?', answer: 'Yes. Our LIS module supports ASTM and HL7 bi-directional protocols to capture results directly from automated analyzers, eliminating manual data entry.' },
      { question: 'Does the system support teleconsultation and remote appointment booking?', answer: 'Yes, patients can book appointments through a dedicated web portal and attend secure, end-to-end encrypted video consultations.' }
    ]
  },

  sis: {
    id: 'sis',
    heroHeadline: 'End-to-End Academic Governance, Admissions &',
    heroHighlight: 'Student Lifecycle Portal.',
    executiveSummary: 'Scholar School Management System is a comprehensive education platform empowering K-12 schools, academies, and higher education universities to manage digital admissions, tuition fee billing, academic grading, timetables, and parent communication from one unified interface.',
    targetIndustry: ['K-12 Private & Public Schools', 'International Academies', 'Colleges & Higher Ed Universities', 'Training Institutes'],
    deploymentModes: ['Managed Cloud SaaS', 'Dedicated School Server', 'District-wide Multi-School Cluster'],
    slaGuarantee: '99.99% Academic Portal Uptime • 100% Grade & Fee Audit Integrity',
    metrics: [
      { value: '40K+', label: 'Active Students Managed', trend: 'Multi-Curriculum Ready' },
      { value: '98.5%', label: 'Tuition Fee Collection Rate', trend: 'Automated Payment Links' },
      { value: '65%', label: 'Admin Paperwork Reduction', trend: 'Digital Gradebooks' },
      { value: '4.9/5', label: 'Parent Satisfaction Score', trend: 'Mobile App Alerts' }
    ],
    subModules: [
      {
        name: 'Student Admissions & Digital Onboarding',
        badge: 'Enrollment Hub',
        description: 'Online application forms, document verification, placement test scheduling, and automatic student ID generation.',
        points: ['Custom admission workflows', 'Sibling discount linkage', 'Digital document vault']
      },
      {
        name: 'Tuition Fee Billing & Online Payment Gateway',
        badge: 'Finance Core',
        description: 'Flexible fee structures (tuition, transport, uniforms, lab fees) with automated installments, invoice generation, and credit card payments.',
        points: ['Automated payment reminders via SMS/Email', 'Multi-child payment ledger', 'Late fee policy enforcement']
      },
      {
        name: 'Academic Gradebook & Digital Report Cards',
        badge: 'Academic Core',
        description: 'Multi-curriculum support (CBSE, British Cambridge, IB, American, UAE MoE) with GPA calculations, formative/summative weighting, and PDF report cards.',
        points: ['Customized school report templates', 'Automated GPA and percentile ranking', 'Teacher comment banks']
      },
      {
        name: 'Parent-Teacher Communication App',
        badge: 'Engagement',
        description: 'Real-time mobile updates for parents covering attendance, homework assignments, exam schedules, and direct messaging with teachers.',
        points: ['Daily attendance push notifications', 'School bus GPS tracking integration', 'Parent-teacher conference booking']
      }
    ],
    architecture: {
      runtime: 'Next.js Frontend with Node.js Microservices',
      database: 'PostgreSQL with multi-tenant school partitioning',
      security: 'Role-based access control (Principal, Teacher, Accountant, Parent, Student), COPPA/GDPR compliant data handling',
      messaging: 'WebSockets for instant parent chat & push notification queues',
      latency: '< 50ms page load across mobile and desktop',
      scalability: 'Auto-scaling for peak exam result and fee payment surges'
    },
    complianceList: ['UAE ADEK / KHDA Regulatory Ready', 'Multi-Curriculum Standards (IB / Cambridge / CBSE / American)', 'COPPA & Student Data Privacy Compliant'],
    mockData: {
      tabTitle: 'Academic Operations & Student Records Telemetry',
      recordsHeader: ['Student ID', 'Student Name & Grade', 'Curriculum / Section', 'Tuition Status', 'Attendance Today'],
      records: [
        { id: 'STU-2026-104', title: 'Hamdan Al-Maktoum (Grade 10-A)', meta: 'British Cambridge IGCSE Curriculum', status: 'ACTIVE', tag: 'PRESENT (07:45 AM)', timestamp: 'Fee Paid in Full' },
        { id: 'STU-2026-105', title: 'Sara Al-Ghafri (Grade 11-B)', meta: 'IB Diploma Programme (Higher Level)', status: 'VERIFIED', tag: 'PRESENT (07:50 AM)', timestamp: 'Installment #2 Due' },
        { id: 'STU-2026-106', title: 'Aarav Patel (Grade 8-C)', meta: 'CBSE Curriculum • Term 2 Honors', status: 'COMPLIANT', tag: 'PRESENT (07:42 AM)', timestamp: 'Report Card Published' },
        { id: 'STU-2026-107', title: 'Elena Rostova (Grade 12-A)', meta: 'American Diploma & AP Calculus', status: 'SYNCHRONIZED', tag: 'PRESENT (07:48 AM)', timestamp: 'Fee Paid in Full' }
      ],
      systemLogs: [
        '[ACADEMIC:ATTENDANCE] Morning biometric RFID turnstile scan completed: 1,840 students logged across 4 campus gates',
        '[ACADEMIC:FINANCE] Automated WhatsApp payment link dispatched for Term-2 tuition fee installments (Total: AED 142,000)',
        '[ACADEMIC:GRADING] Term-1 Cambridge examination marks consolidated and verified against weighted rubric',
        '[ACADEMIC:PORTAL] 1,650 Parents accessed digital homework assignments and attendance logs today'
      ]
    },
    faqs: [
      { question: 'Does Scholar support schools offering multiple curriculums simultaneously?', answer: 'Yes! You can configure British, American, IB, CBSE, and Ministry of Education curriculums side-by-side with independent grading rubrics and term calendars.' },
      { question: 'Can parents pay tuition fees online through the parent portal?', answer: 'Yes. Scholar integrates seamlessly with local UAE payment gateways (Network International, Stripe, PayTabs, Apple Pay) for instant receipt generation.' },
      { question: 'How is student attendance recorded in the morning?', answer: 'Attendance can be recorded via teacher mobile apps, smart classroom tablets, or integrated RFID gate turnstiles for instant parent notifications.' }
    ]
  }
};

export function getProductDetails(module?: {
  id?: string;
  title?: string;
  category?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  techStack?: string[];
  brochureUrl?: string;
  badge?: string;
} | null): ProductDetailItem {
  const mod = module || {};
  const modId = mod.id || 'custom-solution';
  const modTitle = mod.title || 'Enterprise Solution';
  const cat = (mod.category || 'Enterprise').toLowerCase();
  const idLower = modId.toLowerCase();

  // Determine archetype theme
  let theme: PageThemeType = 'enterprise-erp';
  let accentColor: AccentColorType = 'blue';
  let heroStyle: HeroStyleType = 'split-console';
  let interactiveWidget: InteractiveWidgetType = 'workflow-pipeline';

  if (cat.includes('bank') || idLower.includes('bank') || idLower.includes('transa') || idLower.includes('fin') || idLower.includes('pay')) {
    theme = 'fintech';
    accentColor = 'emerald';
    heroStyle = 'command-hud';
    interactiveWidget = 'live-telemetry';
  } else if (cat.includes('health') || idLower.includes('hms') || idLower.includes('clinic') || idLower.includes('med')) {
    theme = 'clinical-health';
    accentColor = 'cyan';
    heroStyle = 'split-console';
    interactiveWidget = 'vital-monitor';
  } else if (cat.includes('edu') || idLower.includes('sis') || idLower.includes('school') || idLower.includes('lms')) {
    theme = 'academic-edu';
    accentColor = 'amber';
    heroStyle = 'workflow-pipeline';
    interactiveWidget = 'campus-lifecycle';
  } else if (cat.includes('infra') || idLower.includes('oracle') || idLower.includes('dev') || idLower.includes('flex') || idLower.includes('ait')) {
    theme = 'developer-dev';
    accentColor = 'violet';
    heroStyle = 'code-diff';
    interactiveWidget = 'code-transform';
  } else if (cat.includes('work') || idLower.includes('site') || idLower.includes('web') || idLower.includes('job') || idLower.includes('sales')) {
    theme = 'saas-modern';
    accentColor = 'rose';
    heroStyle = 'command-hud';
    interactiveWidget = 'live-telemetry';
  }

  if (mod.id && PRODUCT_DETAILS_MAP[mod.id]) {
    const existing = PRODUCT_DETAILS_MAP[mod.id];
    return {
      ...existing,
      theme: existing.theme || theme,
      accentColor: existing.accentColor || accentColor,
      heroStyle: existing.heroStyle || heroStyle,
      interactiveWidget: existing.interactiveWidget || interactiveWidget,
      mockData: {
        ...existing.mockData,
        workflowSteps: existing.mockData.workflowSteps || [
          { step: '01', title: 'Data Ingestion & Auth', desc: 'Secure payload ingestion via TLS 1.3 gateway', latency: '2.4ms', status: 'VALIDATED' },
          { step: '02', title: 'Validation & Rule Engine', desc: 'Granular policy evaluation and schema verification', latency: '4.1ms', status: 'PASS' },
          { step: '03', title: 'Execution & Settlement', desc: 'Distributed microservice transaction commit', latency: '5.8ms', status: 'COMMITTED' },
          { step: '04', title: 'Audit Ledger Recording', desc: 'Cryptographic hash sealing across operational nodes', latency: '1.2ms', status: 'SEALED' }
        ],
        codeDiff: existing.mockData.codeDiff || {
          sourceLang: 'Legacy / Monolith Architecture',
          sourceCode: `// Legacy Monolithic Handler\nPROCEDURE Process_Transaction(\n  p_id IN NUMBER,\n  p_amount IN NUMBER\n) IS\nBEGIN\n  SELECT balance INTO v_bal FROM accounts WHERE id = p_id FOR UPDATE;\n  IF v_bal >= p_amount THEN\n    UPDATE accounts SET balance = balance - p_amount WHERE id = p_id;\n    COMMIT;\n  END IF;\nEND;`,
          targetLang: 'Arcanum Cloud Native TypeScript',
          targetCode: `// Modern Resilient Microservice\nexport async function processTransaction(ctx: Context, req: TxPayload) {\n  const tx = await db.beginTransaction({ isolation: 'SERIALIZABLE' });\n  const ledger = await tx.ledger.verifyAndDebit(req.id, req.amount);\n  await eventBus.publish('tx.committed', { txId: ledger.id, latency: ctx.elapsed });\n  return { success: true, ref: ledger.hash };\n}`
        }
      }
    };
  }

  const features = mod.features || ['High-Performance Microservices', 'Enterprise Data Security', 'Role-Based Access Control', 'Automated Analytics & Reporting'];
  const techStack = mod.techStack || ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'];

  return {
    id: modId,
    theme,
    accentColor,
    heroStyle,
    interactiveWidget,
    heroHeadline: modTitle + ' — Enterprise',
    heroHighlight: 'Architecture & System Specs.',
    executiveSummary: mod.description || 'Enterprise-grade software system engineered with architectural precision, modular microservices, and dedicated security layers for mission-critical operations.',
    targetIndustry: ['Commercial Enterprises', 'Financial Organizations', 'Government Entities', 'Technology Providers'],
    deploymentModes: ['Managed Sovereign Cloud', 'On-Premises Dedicated Server', 'Hybrid High-Availability Cluster'],
    slaGuarantee: '99.99% Production Uptime SLA • Enterprise Support Guaranteed',
    metrics: [
      { value: '99.99%', label: 'System SLA Uptime', trend: 'Continuous Delivery' },
      { value: '< 12ms', label: 'Microservice Latency', trend: 'Optimized Throughput' },
      { value: '100%', label: 'Data Encryption', trend: 'AES-256 & TLS 1.3' },
      { value: '24/7', label: 'Dedicated Support', trend: 'Senior Architects' }
    ],
    subModules: features.map((f, i) => ({
      name: f,
      badge: `Core Module 0${i + 1}`,
      description: `Engineered to deliver high throughput, automated workflow execution, and robust audit compliance across distributed systems.`,
      points: ['Zero technical debt implementation', 'Full API orchestration & event webhooks', 'Strict role-based access validation']
    })),
    architecture: {
      runtime: techStack.join(', ') || 'Modern Microservices Runtime',
      database: 'PostgreSQL / TimescaleDB with Redis caching layer',
      security: 'End-to-end encryption, strict RBAC, automated vulnerability scans',
      messaging: 'Kafka / RabbitMQ distributed event message bus',
      latency: '< 12ms average transaction execution',
      scalability: 'Containerized Docker & Kubernetes horizontal auto-scaling'
    },
    complianceList: ['ISO 27001 Security Standard', 'UAE Regulatory Guidelines', 'SOC 2 Architecture Ready', 'GDPR Article 32 Compliant'],
    mockData: {
      tabTitle: `${modTitle} — Live System Telemetry & Operations Hub`,
      recordsHeader: ['Record / Transaction ID', 'Subsystem Name', 'Metadata / Parameters', 'Status', 'Execution Code'],
      records: [
        { id: `${modId.toUpperCase()}-901`, title: `${modTitle} Primary Operational Node`, meta: 'Distributed Cluster • UAE Region', status: 'ACTIVE', tag: 'PRODUCTION', timestamp: 'Committed 1m ago' },
        { id: `${modId.toUpperCase()}-902`, title: 'High-Throughput Ingestion Queue', meta: 'Batch verification completed with 0 errors', status: 'VERIFIED', tag: 'INSPECTED', timestamp: 'Committed 4m ago' },
        { id: `${modId.toUpperCase()}-903`, title: 'Audit Trail & Compliance Ledger', meta: 'Cryptographic hash verified across nodes', status: 'COMPLIANT', tag: 'SEALED', timestamp: 'Committed 12m ago' },
        { id: `${modId.toUpperCase()}-904`, title: 'Analytics & Reporting Synthesis', meta: 'Real-time telemetry updated to dashboard', status: 'SYNCHRONIZED', tag: 'TELEMETRY', timestamp: 'Committed 18m ago' }
      ],
      systemLogs: [
        `[${modId.toUpperCase()}:CORE] Microservices cluster initialized with 0 startup warnings`,
        `[${modId.toUpperCase()}:SECURITY] Cryptographic token authorization validated via secure gateway`,
        `[${modId.toUpperCase()}:PERF] Sub-12ms response commit achieved across analytical pipeline`,
        `[${modId.toUpperCase()}:AUDIT] Scheduled automated backup snapshot completed successfully`
      ],
      workflowSteps: [
        { step: '01', title: 'Data Ingestion & Auth', desc: 'Secure payload ingestion via TLS 1.3 gateway', latency: '2.4ms', status: 'VALIDATED' },
        { step: '02', title: 'Validation & Rule Engine', desc: 'Granular policy evaluation and schema verification', latency: '4.1ms', status: 'PASS' },
        { step: '03', title: 'Execution & Settlement', desc: 'Distributed microservice transaction commit', latency: '5.8ms', status: 'COMMITTED' },
        { step: '04', title: 'Audit Ledger Recording', desc: 'Cryptographic hash sealing across operational nodes', latency: '1.2ms', status: 'SEALED' }
      ],
      codeDiff: {
        sourceLang: 'Legacy / Monolith Architecture',
        sourceCode: `// Legacy Monolithic Handler\nPROCEDURE Process_Module(\n  p_id IN NUMBER\n) IS\nBEGIN\n  -- Hardcoded monolithic logic\n  UPDATE legacy_records SET status = 'DONE' WHERE id = p_id;\n  COMMIT;\nEND;`,
        targetLang: 'Arcanum Modern Microservices',
        targetCode: `// Modern Distributed Microservice\nexport async function handleModuleExecution(ctx: Context, id: string) {\n  const res = await serviceBus.dispatch('module.execute', { id, ts: Date.now() });\n  return { ok: true, hash: res.signature };\n}`
      }
    },
    faqs: [
      { question: `How is ${modTitle} deployed within our existing enterprise IT infrastructure?`, answer: 'We offer flexible deployment options including private cloud, on-premises bare-metal installations, or hybrid multi-datacenter configurations.' },
      { question: 'What level of technical support and SLA guarantees are provided?', answer: 'All enterprise deployments come with a 99.99% uptime guarantee, 24/7 incident response from senior software architects, and ongoing performance optimizations.' },
      { question: 'Can this solution be customized to meet our organization\'s unique workflows?', answer: 'Yes. The modular architecture is designed to be adapted to custom business logic, third-party ERP integrations, and specific regulatory requirements.' }
    ]
  };
}
