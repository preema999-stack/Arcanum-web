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
} from '@/data/arcanumData';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({ action: 'pull' }));
    const action = body.action || 'pull';

    const docRef = doc(db, 'cms_content', 'arcanum_site_data');

    if (action === 'seed') {
      // Seed initial local arcanumData.ts to Firebase Firestore
      const payload = {
        info: ARCANUM_INFO,
        values: ARCANUM_VALUES,
        locations: ARCANUM_LOCATION_HUBS,
        capabilities: ARCANUM_CAPABILITIES,
        modules: ARCANUM_MODULES,
        brochures: BROCHURES_LIST,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, payload, { merge: true });
      return NextResponse.json({
        success: true,
        message: 'Successfully seeded full arcanumData.ts content into Firebase Firestore.',
      });
    }

    if (action === 'pull') {
      // Pull latest content from Firebase Firestore and overwrite local data/arcanumData.ts
      const docSnap = await getDoc(docRef);

      let infoData = ARCANUM_INFO;
      let valuesData = ARCANUM_VALUES;
      let locationsData = ARCANUM_LOCATION_HUBS;
      let capabilitiesData = ARCANUM_CAPABILITIES;
      let modulesData = ARCANUM_MODULES;
      let brochuresData = BROCHURES_LIST;

      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        if (firestoreData.info) infoData = { ...ARCANUM_INFO, ...firestoreData.info };
        if (Array.isArray(firestoreData.values) && firestoreData.values.length > 0) {
          valuesData = firestoreData.values;
        }
        if (Array.isArray(firestoreData.locations) && firestoreData.locations.length > 0) {
          locationsData = firestoreData.locations;
        }
        if (Array.isArray(firestoreData.capabilities) && firestoreData.capabilities.length > 0) {
          capabilitiesData = firestoreData.capabilities;
        }
        if (Array.isArray(firestoreData.modules) && firestoreData.modules.length > 0) {
          modulesData = firestoreData.modules;
        }
        if (Array.isArray(firestoreData.brochures) && firestoreData.brochures.length > 0) {
          brochuresData = firestoreData.brochures;
        }
      }

      // Generate formatted TypeScript file string
      const fileContent = `export interface ModuleItem {
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
  heroDescription: string;
  established: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutTitleHighlight: string;
  aboutDescription1: string;
  aboutDescription2: string;
  marqueeText: string;
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
export const ARCANUM_INFO: SiteInfo = ${JSON.stringify(infoData, null, 2)};

export const ARCANUM_VALUES: ValuePillar[] = ${JSON.stringify(valuesData, null, 2)};

export const ARCANUM_LOCATION_HUBS: LocationHubItem[] = ${JSON.stringify(locationsData, null, 2)};

export const ARCANUM_CAPABILITIES: TechnicalCapability[] = ${JSON.stringify(capabilitiesData, null, 2)};

export const ARCANUM_MODULES: ModuleItem[] = ${JSON.stringify(modulesData, null, 2)};

export const BROCHURES_LIST: BrochureItem[] = ${JSON.stringify(brochuresData, null, 2)};
`;

      const targetPath = path.join(process.cwd(), 'data', 'arcanumData.ts');
      fs.writeFileSync(targetPath, fileContent, 'utf-8');

      return NextResponse.json({
        success: true,
        message: 'Successfully synced Firebase Firestore content to local data/arcanumData.ts file.',
        syncedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('[API /api/admin/sync-data Exception]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to execute sync action' },
      { status: 500 }
    );
  }
}
