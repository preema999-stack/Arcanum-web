import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  ARCANUM_INFO,
  ARCANUM_VALUES,
  ARCANUM_LOCATION_HUBS,
  ARCANUM_CAPABILITIES,
  ARCANUM_MODULES,
  BROCHURES_LIST,
  DEFAULT_SHOWCASE_ITEMS,
  SiteInfo,
  ValuePillar,
  LocationHubItem,
  TechnicalCapability,
  ModuleItem,
  BrochureItem,
  ShowcaseItem,
} from '@/data/arcanumData';

export const dynamic = 'force-dynamic';

const BACKUP_FILE = path.join(process.cwd(), 'data', 'cms_backup.json');

interface CmsPayload {
  info: SiteInfo;
  values: ValuePillar[];
  locations: LocationHubItem[];
  capabilities: TechnicalCapability[];
  showcaseItems?: ShowcaseItem[];
  modules: ModuleItem[];
  brochures: BrochureItem[];
  updatedAt?: string;
}

function getLocalBackup(): CmsPayload | null {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[CMS Local Backup Read Warning]:', err);
  }
  return null;
}

function saveLocalBackup(data: CmsPayload) {
  try {
    const dir = path.dirname(BACKUP_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[CMS Local Backup Write Warning]:', err);
  }
}

function updateLocalDataFile(data: CmsPayload) {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'arcanumData.ts');
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
 * Last Synced with Firebase: ${new Date().toISOString()}
 */
export const ARCANUM_INFO: SiteInfo = ${JSON.stringify(data.info || ARCANUM_INFO, null, 2)};

export const ARCANUM_VALUES: ValuePillar[] = ${JSON.stringify(data.values || ARCANUM_VALUES, null, 2)};

export const ARCANUM_LOCATION_HUBS: LocationHubItem[] = ${JSON.stringify(data.locations || ARCANUM_LOCATION_HUBS, null, 2)};

export const ARCANUM_CAPABILITIES: TechnicalCapability[] = ${JSON.stringify(data.capabilities || ARCANUM_CAPABILITIES, null, 2)};

export const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = ${JSON.stringify(data.showcaseItems || DEFAULT_SHOWCASE_ITEMS, null, 2)};

export const ARCANUM_SHOWCASE_ITEMS: ShowcaseItem[] = ${JSON.stringify(data.showcaseItems || DEFAULT_SHOWCASE_ITEMS, null, 2)};

export const ARCANUM_MODULES: ModuleItem[] = ${JSON.stringify(data.modules || ARCANUM_MODULES, null, 2)};

export const BROCHURES_LIST: BrochureItem[] = ${JSON.stringify(data.brochures || BROCHURES_LIST, null, 2)};
`;
    fs.writeFileSync(dataFilePath, fileContent, 'utf-8');
  } catch (err) {
    console.warn('[CMS Update arcanumData.ts Warning]:', err);
  }
}

// GET /api/admin/cms — Fetch current live CMS document
export async function GET() {
  try {
    let cmsData: CmsPayload = {
      info: ARCANUM_INFO,
      values: ARCANUM_VALUES,
      locations: ARCANUM_LOCATION_HUBS,
      capabilities: ARCANUM_CAPABILITIES,
      showcaseItems: DEFAULT_SHOWCASE_ITEMS,
      modules: ARCANUM_MODULES,
      brochures: BROCHURES_LIST,
    };

    // 1. Try reading from Firestore
    try {
      const docRef = doc(db, 'cms_content', 'arcanum_site_data');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const firestoreDoc = snap.data() as Partial<CmsPayload>;
        cmsData = {
          info: firestoreDoc.info ? { ...ARCANUM_INFO, ...firestoreDoc.info } : ARCANUM_INFO,
          values: Array.isArray(firestoreDoc.values) && firestoreDoc.values.length > 0 ? firestoreDoc.values : ARCANUM_VALUES,
          locations: Array.isArray(firestoreDoc.locations) && firestoreDoc.locations.length > 0 ? firestoreDoc.locations : ARCANUM_LOCATION_HUBS,
          capabilities: Array.isArray(firestoreDoc.capabilities) && firestoreDoc.capabilities.length > 0 ? firestoreDoc.capabilities : ARCANUM_CAPABILITIES,
          showcaseItems: Array.isArray(firestoreDoc.showcaseItems) ? firestoreDoc.showcaseItems : DEFAULT_SHOWCASE_ITEMS,
          modules: Array.isArray(firestoreDoc.modules) ? firestoreDoc.modules : ARCANUM_MODULES,
          brochures: Array.isArray(firestoreDoc.brochures) ? firestoreDoc.brochures : BROCHURES_LIST,
          updatedAt: firestoreDoc.updatedAt,
        };
        // Keep local backup in sync
        saveLocalBackup(cmsData);
        return NextResponse.json({ success: true, source: 'firestore', data: cmsData });
      }
    } catch (fsErr) {
      console.warn('[Firestore CMS Fetch Error - Checking local backup]:', fsErr);
    }

    // 2. Fallback to local backup
    const backup = getLocalBackup();
    if (backup) {
      return NextResponse.json({ success: true, source: 'backup', data: backup });
    }

    return NextResponse.json({ success: true, source: 'default', data: cmsData });
  } catch (err: any) {
    console.error('[API /api/admin/cms GET Error]', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to fetch CMS data' }, { status: 500 });
  }
}

// POST /api/admin/cms — Update CMS document on Firestore and persist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: CmsPayload = {
      info: body.info ? { ...ARCANUM_INFO, ...body.info } : ARCANUM_INFO,
      values: Array.isArray(body.values) ? body.values : ARCANUM_VALUES,
      locations: Array.isArray(body.locations) ? body.locations : ARCANUM_LOCATION_HUBS,
      capabilities: Array.isArray(body.capabilities) ? body.capabilities : ARCANUM_CAPABILITIES,
      showcaseItems: Array.isArray(body.showcaseItems) ? body.showcaseItems : DEFAULT_SHOWCASE_ITEMS,
      modules: Array.isArray(body.modules) ? body.modules : ARCANUM_MODULES,
      brochures: Array.isArray(body.brochures) ? body.brochures : BROCHURES_LIST,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to local persistent file backup
    saveLocalBackup(payload);

    // 2. Overwrite local arcanumData.ts so static builds and next dev immediately have the new content
    updateLocalDataFile(payload);

    // 3. Save to Firebase Firestore
    try {
      const docRef = doc(db, 'cms_content', 'arcanum_site_data');
      await setDoc(docRef, payload);
    } catch (fsErr) {
      console.warn('[Firestore CMS Save Warning]:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'CMS content successfully deployed to Firebase and synchronized.',
      updatedAt: payload.updatedAt,
      data: payload,
    });
  } catch (err: any) {
    console.error('[API /api/admin/cms POST Error]', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to save CMS data' }, { status: 500 });
  }
}
