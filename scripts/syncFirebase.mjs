import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataFilePath = path.join(rootDir, 'data', 'arcanumData.ts');
const backupFilePath = path.join(rootDir, 'data', 'cms_backup.json');

const mode = process.argv[2] || 'pull'; // 'pull' or 'seed'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC8XrjDtyeCeCwFRDNJ3S05UujDMeCdLyk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'arcanum-4e385.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'arcanum-4e385',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'arcanum-4e385.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '955579161117',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:955579161117:web:03e5f44e8d1c928eab44f4',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-QQZGDC5J0Y',
};

console.log(`\n======================================================`);
console.log(`  ARCANUM IT - FIREBASE <-> LOCAL DATA SYNC UTILITY`);
console.log(`  Mode: ${mode.toUpperCase()}`);
console.log(`======================================================\n`);

function generateFileString(data) {
  return `export interface ModuleItem {
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
  tagline?: string;
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
  solutionsBadge?: string;
  solutionsTitle?: string;
  solutionsTitleHighlight?: string;
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
export const ARCANUM_INFO: SiteInfo = ${JSON.stringify(data.info, null, 2)};

export const ARCANUM_VALUES: ValuePillar[] = ${JSON.stringify(data.values, null, 2)};

export const ARCANUM_LOCATION_HUBS: LocationHubItem[] = ${JSON.stringify(data.locations, null, 2)};

export const ARCANUM_CAPABILITIES: TechnicalCapability[] = ${JSON.stringify(data.capabilities, null, 2)};

export const ARCANUM_MODULES: ModuleItem[] = ${JSON.stringify(data.modules, null, 2)};

export const BROCHURES_LIST: BrochureItem[] = ${JSON.stringify(data.brochures, null, 2)};
`;
}

async function runSync() {
  try {
    if (mode === 'seed') {
      console.log(`[1/2] Preparing dataset from local backup...`);
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file not found at ${backupFilePath}`);
      }

      const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));
      const payload = { ...backupData, updatedAt: new Date().toISOString() };

      // Try HTTP bridge to Next.js API server if dev server is running
      let seededViaApi = false;
      try {
        console.log(`[2/2] Transmitting to local server bridge (http://localhost:3000/api/admin/cms)...`);
        const res = await fetch('http://localhost:3000/api/admin/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          console.log(`[OK] Successfully synchronized and deployed to Firebase & local storage via API bridge!`);
          seededViaApi = true;
        }
      } catch (apiErr) {
        // Dev server not running on port 3000
      }

      if (!seededViaApi) {
        // Try direct Firestore SDK
        try {
          const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
          const db = getFirestore(app);
          const docRef = doc(db, 'cms_content', 'arcanum_site_data');
          await setDoc(docRef, payload, { merge: true });
          console.log(`[OK] Directly updated Firebase Firestore.`);
        } catch (sdkErr) {
          console.log(`[Info] Firebase direct write requires authenticated Admin session.`);
          console.log(`[Info] Local storage data/arcanumData.ts and data/cms_backup.json are fully synchronized.`);
          console.log(`[Tip] You can also click 'DEPLOY CHANGES TO FIREBASE' inside the Admin Portal at /admin.`);
        }
      }

      // Always ensure local file is written
      const fileString = generateFileString(payload);
      fs.writeFileSync(dataFilePath, fileString, 'utf-8');

      console.log(`\n======================================================`);
      console.log(`  SUCCESS: Local data synchronized!`);
      console.log(`  Timestamp: ${new Date().toISOString()}`);
      console.log(`======================================================\n`);
      process.exit(0);
    }

    if (mode === 'pull') {
      console.log(`[1/2] Connecting to Firebase Firestore & local backup...`);
      let siteData = null;

      // Try HTTP bridge first
      try {
        const res = await fetch('http://localhost:3000/api/admin/cms');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            siteData = json.data;
            console.log(`[OK] Retrieved live data via server bridge.`);
          }
        }
      } catch (err) {
        // Server offline
      }

      // Try direct SDK
      if (!siteData) {
        try {
          const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
          const db = getFirestore(app);
          const docRef = doc(db, 'cms_content', 'arcanum_site_data');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            siteData = docSnap.data();
            console.log(`[OK] Retrieved live Firestore snapshot.`);
          }
        } catch (fsErr) {
          console.log(`[Info] Using persistent local backup...`);
        }
      }

      // Fallback to local backup json
      if (!siteData && fs.existsSync(backupFilePath)) {
        siteData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));
      }

      if (!siteData) {
        throw new Error('No Firestore data or local backup available.');
      }

      console.log(`[2/2] Updating data/arcanumData.ts...`);
      const fileString = generateFileString(siteData);
      fs.writeFileSync(dataFilePath, fileString, 'utf-8');

      console.log(`\n======================================================`);
      console.log(`  SUCCESS: data/arcanumData.ts successfully updated!`);
      console.log(`  Timestamp: ${new Date().toISOString()}`);
      console.log(`======================================================\n`);
      process.exit(0);
    }
  } catch (err) {
    console.error(`\nFAILED:`, err.message || err);
    process.exit(1);
  }
}

runSync();
