export interface ModuleItem {
  id: string;
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
}

export interface BrochureItem {
  title: string;
  href: string;
  category: string;
}

export const ARCANUM_INFO = {
  name: 'Arcanum Information Technology',
  shortName: 'Arcanum IT',
  tagline: 'Enterprise Software Engineering & Digital Architecture',
  heroHeadline: 'Architecting Intelligent',
  heroHeadlineHighlight: 'Enterprise Systems',
  heroHeadlineSuffix: '& Smart Software Solutions.',
  heroDescription:
    'Arcanum Information Technology is a professionally managed software development firm in the UAE. We engineer high-performance ERPs, banking integrations, clinical management systems, and legacy Oracle Forms modernizations with enterprise-grade security and reliability.',
  established: 'UAE & India',
  locations: [
    { city: 'Abu Dhabi', country: 'UAE', label: 'Global Headquarters', flag: '🇦🇪' },
    { city: 'Kerala', country: 'India', label: 'Engineering & R&D Hub', flag: '🇮🇳' },
    { city: 'Gujarat', country: 'India', label: 'Tech & Operations Center', flag: '🇮🇳' },
  ],
  stats: [
    { label: 'Enterprise Applications', value: '22+', change: '+4 this year' },
    { label: 'System Uptime SLA', value: '99.99%', change: 'Zero critical downtime' },
    { label: 'Microservice Latency', value: '< 12ms', change: 'Optimized execution' },
    { label: 'Active Enterprise Users', value: '150K+', change: 'Cross-platform users' },
  ],
  contact: {
    address: 'Abu Dhabi (UAE) • Kerala (India) • Gujarat (India)',
    email: 'info@arcanum.ae',
    website: 'https://arcanum.ae',
    phone: '+971 4 000 0000',
  },
};

export const ARCANUM_MODULES: ModuleItem[] = [
  {
    id: 'oms',
    title: 'Organization Management System (OMS)',
    category: 'Enterprise',
    subtitle: 'Hierarchy, Auth & Collaborative Workspace Engine',
    description:
      'Comprehensive enterprise platform enabling organizations to streamline member invitations, oversee multi-tier hierarchical structures, and enforce role-based access control (RBAC).',
    features: [
      'Multi-tenant Organization Creation',
      'Seamless Onboarding & Invitation Flow',
      'Role-based Secure Authentication (OAuth/SAML)',
      'Hierarchical Audit Logging & Analytics',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/OMS.pdf',
    iconName: 'Building2',
    badge: 'Flagship Core',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'erp',
    title: 'Accurate ERP',
    category: 'Enterprise',
    subtitle: 'Integrated Business Operations & Financial Ledger',
    description:
      'Enterprise Resource Planning software that unifies finance, inventory, procurement, and asset management into real-time operational workflows.',
    features: [
      'Real-time Financial Ledger & Multi-currency Support',
      'Automated Supply Chain & Warehouse Management',
      'Asset Lifecycle & Depreciation Tracking',
      'Executive Dashboards & Automated Regulatory Compliance',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate ERP.pdf',
    iconName: 'Briefcase',
    badge: 'Enterprise Core',
    techStack: ['TypeScript', 'Microservices', 'Oracle DB', 'Redis'],
  },
  {
    id: 'payroll',
    title: 'Accurate PAYROLL',
    category: 'Enterprise',
    subtitle: 'Automated Compensation, Compliance & Tax Engine',
    description:
      'Simplifies complex HR payroll processes with guaranteed accuracy, timely disbursements, statutory tax filings, and benefit tracking across distributed teams.',
    features: [
      'Automated Salary Calculations & WPS File Generation',
      'Tax Filing & Deductions Management',
      'Employee Self-Service Portal & Digital Payslips',
      'Time, Attendance & Leave Policy Integration',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate PAYROLL.pdf',
    iconName: 'Coins',
    techStack: ['Node.js', 'TypeScript', 'Secure Vault', 'PostgreSQL'],
  },
  {
    id: 'banking',
    title: 'Core Banking Application',
    category: 'Banking',
    subtitle: 'Financial Portal for Commercial & Co-Operative Banks',
    description:
      'End-to-end banking architecture built for financial institutions, supporting customer self-service, teller stations, automated reconciliation, and audit readiness.',
    features: [
      'Customer Web & Mobile Banking Portal',
      'Teller Station & Back-office Processing',
      'ATM Interface & Network Switch Connection',
      'High-throughput Transaction Processing',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Transa Money.pdf',
    iconName: 'Landmark',
    badge: 'Financial Grade',
    techStack: ['Java Spring', 'Kafka', 'Oracle', 'HSM Encryption'],
  },
  {
    id: 'scb',
    title: 'Co-Operative Bank Add-ons',
    category: 'Banking',
    subtitle: 'ATM Switch Integration, SMS Gateway & Customer Portals',
    description:
      'Modular financial extensions tailored for co-operative banks, providing ISO 8583 ATM switch bridging, automated SMS alerts, and encrypted digital banking APIs.',
    features: [
      'ISO 8583 ATM Switch Connector',
      'Real-time SMS Transaction Alert Gateway',
      'Encrypted Customer Account Portal',
      'Central Bank Reporting Compliance',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/SCB Add ons-new.pdf',
    iconName: 'Cpu',
    techStack: ['C++', 'Java', 'ISO 8583', 'RabbitMQ'],
  },
  {
    id: 'transa',
    title: 'Transa Money Mobile Banking',
    category: 'Banking',
    subtitle: 'Mobile Banking & Encrypted Digital Wallet',
    description:
      'Streamlined and highly secure mobile banking suite allowing retail customers to execute fund transfers, bill payments, and card controls with biometrics.',
    features: [
      'Biometric Authentication & Tokenized Auth',
      'Instant P2P Fund Transfers & Bill Payments',
      'Card Lifecycle & Spending Controls',
      'Real-time Push Notifications & Statements',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Transa Money.pdf',
    iconName: 'Smartphone',
    techStack: ['React Native', 'Swift', 'Kotlin', 'REST/gRPC'],
  },
  {
    id: 'sis',
    title: 'Scholar — School Management System',
    category: 'Education',
    subtitle: 'Academic Administration & Student Lifecycle Portal',
    description:
      'Complete educational management software to govern admissions, gradebooks, attendance tracking, tuition fee billing, and parent-teacher communication.',
    features: [
      'Student Information & Admission Management',
      'Automated Tuition Fee Collector & Payment History',
      'Grading, Examination & Report Card Engine',
      'Parent Portal & Digital Homework Distribution',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Scholar School Management System.pdf',
    iconName: 'GraduationCap',
    badge: 'EdTech Leader',
    techStack: ['Next.js', 'PostgreSQL', 'Tailwind', 'Node.js'],
  },
  {
    id: 'hms',
    title: 'Accurate Clinic Management System',
    category: 'Healthcare',
    subtitle: 'Clinical Workflow, Pharmacy & EMR Integration',
    description:
      'Unified healthcare engine connecting outpatient clinics, diagnostic laboratories, and pharmacies with electronic medical records (EMR) and billing.',
    features: [
      'Electronic Medical Records (EMR) & Prescriptions',
      'Lab Orders & Diagnostic Results Tracking',
      'Pharmacy Inventory & Automated Dispensing',
      'Doctor Appointment Scheduling & Billing',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate Clinic Management.pdf',
    iconName: 'Stethoscope',
    techStack: ['React', 'Python', 'FHIR API', 'PostgreSQL'],
  },
  {
    id: 'oracle',
    title: 'Oracle Forms Modernization',
    category: 'Infrastructure',
    subtitle: 'Legacy Systems Upgrade & Migration Engine',
    description:
      'Proven engineering methodologies for upgrading and refactoring mission-critical legacy Oracle Forms applications to modern cloud architecture without operational disruption.',
    features: [
      'Automated PL/SQL to Microservices Extraction',
      'UI Refactoring to Modern Responsive Web Components',
      'Data Integrity Preservation & Zero-downtime Migration',
      'Hybrid Cloud & Containerized Deployment',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Oracle Forms.pdf',
    iconName: 'Database',
    badge: 'Legacy Modernization',
    techStack: ['Oracle Forms 12c', 'Java', 'Next.js', 'PL/SQL'],
  },
  {
    id: 'lms',
    title: 'Lead Management System (LMS)',
    category: 'Workspace',
    subtitle: 'Sales Pipeline, Prospect Nurturing & CRM',
    description:
      'Automates lead ingestion, activity assignment, automated follow-up sequences, and sales funnel analytics for high-touch enterprise sales teams.',
    features: [
      'Multi-channel Prospect Ingestion & Scoring',
      'Automated Follow-up Reminders & Sequences',
      'Pipeline Forecasting & Revenue Visualizer',
      'CRM Integration & Activity Audit Trail',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate LMS.pdf',
    iconName: 'Users',
    techStack: ['TypeScript', 'Node.js', 'MongoDB'],
  },
  {
    id: 'sales',
    title: 'Sales App & Invoicing',
    category: 'Workspace',
    subtitle: 'Invoicing, Billing & Client Management',
    description:
      'Designed for growing businesses to generate, dispatch, and track professional digital invoices with built-in online payment integration.',
    features: [
      'Instant Professional PDF Invoice Generation',
      'Automated Payment Reminders & Recurring Billing',
      'Multi-tax & Currency Support',
      'Client Billing Portal & Direct Payment Gateway',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate Sales.pdf',
    iconName: 'Receipt',
    techStack: ['Next.js', 'Stripe/Local Gateway', 'PostgreSQL'],
  },
  {
    id: 'pos',
    title: 'POS Application for Restaurants',
    category: 'Workspace',
    subtitle: 'Point of Sale, Kitchen Display & Order Billing',
    description:
      'High-velocity point-of-sale platform managing dining room orders, kitchen display terminals (KDS), delivery integration, and instant cashier settlement.',
    features: [
      'Interactive Table & Order Station Management',
      'Kitchen Display System (KDS) Real-time Sync',
      'Inventory Deductions per Order',
      'Split Payments & Multi-terminal Cashier Sync',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Point of sales.pdf',
    iconName: 'Store',
    techStack: ['Electron/React', 'Node.js', 'SQLite/PG'],
  },
  {
    id: 'flex',
    title: 'Flex Data — Survey & Dynamic Forms',
    category: 'Workspace',
    subtitle: 'Dynamic Survey Builder with Payment Options',
    description:
      'Customizable survey engine allowing enterprises to build custom data collection questionnaires, feedback loops, and paid registration forms effortless.',
    features: [
      'Drag-and-Drop Dynamic Field Builder',
      'Integrated Online Payment Gateways',
      'Real-time Submission Analytics & Export',
      'Embeddable Widgets & Custom Branding',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Flex Data.pdf',
    iconName: 'FileSpreadsheet',
    techStack: ['React', 'Tailwind', 'Node.js'],
  },
  {
    id: 'messenger',
    title: 'Arcanum Messenger',
    category: 'Workspace',
    subtitle: 'Encrypted Enterprise Chat & Community Hub',
    description:
      'Secure organizational communication suite designed for community management, event coordination, and project-based team collaboration.',
    features: [
      'End-to-End Encrypted Messaging Channels',
      'File Sharing & Document Collaboration',
      'Granular User Permissions & Moderation',
      'Cross-platform Desktop & Mobile Sync',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Simple Messenger.pdf',
    iconName: 'MessageSquare',
    techStack: ['WebSockets', 'Go', 'React', 'SQLite/PG'],
  },
  {
    id: 'ait',
    title: 'Issue Tracker',
    category: 'Infrastructure',
    subtitle: 'Agile Task Management & Bug Tracking',
    description:
      'Engineered for software teams to track bugs, manage feature releases, monitor SLAs, and streamline developer sprint workflows.',
    features: [
      'Kanban & Sprint Backlog Visualization',
      'Automated SLA Monitoring & Escalation',
      'Git / CI-CD Commit Linking',
      'Custom Workflow & Status Pipelines',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Issue Tracker.pdf',
    iconName: 'Bug',
    techStack: ['TypeScript', 'GraphQL', 'PostgreSQL'],
  },
  {
    id: 'formbuilder',
    title: 'Form Builder',
    category: 'Workspace',
    subtitle: 'No-Code Form Construction & Data Ingestion',
    description:
      'Empowers teams to design, deploy, and capture structured data with zero coding required, complete with automated notifications.',
    features: [
      'Intuitive Layout Editor with Conditional Logic',
      'Automated Email & Webhook Triggers',
      'High-throughput Data Ingestion',
      'Export to CSV, Excel & JSON APIs',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate Form builder.pdf',
    iconName: 'FileCode2',
    techStack: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'tender',
    title: 'Tender Application',
    category: 'Enterprise',
    subtitle: 'Procurement, RFP & Bidding Engine',
    description:
      'Cutting-edge procurement system enabling organizations to manage supplier RFPs, evaluate bidding documents, and streamline contract awards.',
    features: [
      'Encrypted Vendor Bid Submissions',
      'Automated Evaluation Criteria Scoring',
      'Document Versioning & Sealed Bids',
      'Contract Award & Compliance Tracking',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate-Tender.pdf',
    iconName: 'FileCheck',
    techStack: ['Next.js', 'Express', 'PostgreSQL'],
  },
  {
    id: 'job',
    title: 'Job Portal',
    category: 'Workspace',
    subtitle: 'Recruitment, Applicant Tracking & Talent Sourcing',
    description:
      'All-in-one hiring portal simplifying job postings, resume parsing, candidate scoring, and interview scheduling.',
    features: [
      'Automated Resume Ingestion & Parsing',
      'Candidate Pipeline & Stage Tracking',
      'Interview Scheduler with Calendar Sync',
      'Company Career Site Customizer',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate Job Portal.pdf',
    iconName: 'UserPlus',
    techStack: ['Next.js', 'Node.js', 'Elasticsearch'],
  },
  {
    id: 'fin',
    title: 'My-Fin Analytics',
    category: 'Banking',
    subtitle: 'Deposit Rate Analytics & Corporate Action Monitor',
    description:
      'Financial intelligence application providing real-time comparison of bank deposit rates, dividend announcements, and corporate actions in one view.',
    features: [
      'Live Bank Yield & Rate Comparison Engine',
      'Corporate Action & Dividend Event Alerts',
      'Custom Financial Portfolio Watchlists',
      'Historical Trend Analysis & Export',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Accurate My FIN.pdf',
    iconName: 'LineChart',
    techStack: ['Python', 'FastAPI', 'React', 'TimescaleDB'],
  },
  {
    id: 'mobile',
    title: 'Native Mobile Applications',
    category: 'Infrastructure',
    subtitle: 'Web-to-Native iOS & Android Conversion',
    description:
      'High-performance native mobile development service converting modern web platforms into high-speed native iOS and Android apps in record time.',
    features: [
      'Cross-Platform Native Runtime (iOS / Android)',
      'Native Push Notification Engine',
      'Offline Storage & Background Sync',
      'App Store & Google Play Deployment',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/OMS.pdf',
    iconName: 'SmartphoneNfc',
    techStack: ['Swift', 'Kotlin', 'React Native'],
  },
  {
    id: 'website',
    title: 'Enterprise Website Development',
    category: 'Infrastructure',
    subtitle: 'High-Performance Web Architecture & Security',
    description:
      'Custom digital architecture for corporate brands, engineered with Next.js, static site generation, micro-animations, and top-tier SEO.',
    features: [
      'Sub-second Page Load Latency & 100 Audit Scores',
      'Editorial Layout & Modern Motion Systems',
      'Headless CMS & API Integration',
      'Enterprise-grade Security & DDoS Shield',
    ],
    brochureUrl: 'https://arcanum.ae/assets/files/Website%20Creation.pdf',
    iconName: 'Globe',
    techStack: ['Next.js', 'Tailwind', 'Framer Motion'],
  },
];

export const BROCHURES_LIST: BrochureItem[] = [
  { title: 'Organization Management System (OMS)', href: 'https://arcanum.ae/assets/files/OMS.pdf', category: 'Enterprise' },
  { title: 'Accurate ERP System', href: 'https://arcanum.ae/assets/files/Accurate ERP.pdf', category: 'Enterprise' },
  { title: 'Accurate PAYROLL System', href: 'https://arcanum.ae/assets/files/Accurate PAYROLL.pdf', category: 'Enterprise' },
  { title: 'Scholar School Management System', href: 'https://arcanum.ae/assets/files/Scholar School Management System.pdf', category: 'Education' },
  { title: 'Accurate Clinic Management', href: 'https://arcanum.ae/assets/files/Accurate Clinic Management.pdf', category: 'Healthcare' },
  { title: 'Accurate Sales & Invoicing', href: 'https://arcanum.ae/assets/files/Accurate Sales.pdf', category: 'Workspace' },
  { title: 'Accurate LMS (Lead Management)', href: 'https://arcanum.ae/assets/files/Accurate LMS.pdf', category: 'Workspace' },
  { title: 'Simple Messenger Platform', href: 'https://arcanum.ae/assets/files/Simple Messenger.pdf', category: 'Workspace' },
  { title: 'Issue Tracker Documentation', href: 'https://arcanum.ae/assets/files/Issue Tracker.pdf', category: 'Infrastructure' },
  { title: 'Flex Data Survey Engine', href: 'https://arcanum.ae/assets/files/Flex Data.pdf', category: 'Workspace' },
  { title: 'Point of Sales (POS)', href: 'https://arcanum.ae/assets/files/Point of sales.pdf', category: 'Workspace' },
  { title: 'Accurate My-FIN Suite', href: 'https://arcanum.ae/assets/files/Accurate My FIN.pdf', category: 'Banking' },
  { title: 'Accurate Tender Application', href: 'https://arcanum.ae/assets/files/Accurate-Tender.pdf', category: 'Enterprise' },
  { title: 'Website Creation Guidelines', href: 'https://arcanum.ae/assets/files/Website%20Creation.pdf', category: 'Infrastructure' },
  { title: 'Accurate Form Builder', href: 'https://arcanum.ae/assets/files/Accurate Form builder.pdf', category: 'Workspace' },
  { title: 'Transa Money Application', href: 'https://arcanum.ae/assets/files/Transa Money.pdf', category: 'Banking' },
  { title: 'Oracle Forms Modernization', href: 'https://arcanum.ae/assets/files/Oracle Forms.pdf', category: 'Infrastructure' },
  { title: 'Co-Operative Bank Add-ons', href: 'https://arcanum.ae/assets/files/SCB Add ons-new.pdf', category: 'Banking' },
  { title: 'Accurate Job Portal', href: 'https://arcanum.ae/assets/files/Accurate Job Portal.pdf', category: 'Workspace' },
];
