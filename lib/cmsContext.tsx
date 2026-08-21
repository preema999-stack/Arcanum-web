'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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

export interface SiteContentData {
  info: SiteInfo;
  values: ValuePillar[];
  locations: LocationHubItem[];
  capabilities: TechnicalCapability[];
  showcaseItems?: ShowcaseItem[];
  modules: ModuleItem[];
  brochures: BrochureItem[];
  updatedAt?: string;
}

interface CmsContextType {
  content: SiteContentData;
  loading: boolean;
  isFirebaseLoaded: boolean;
  updateCmsContent: (newContent: SiteContentData) => Promise<boolean>;
  seedFirebaseWithDefaults: () => Promise<boolean>;
  syncToFile: () => Promise<boolean>;
  refreshCmsContent: () => Promise<void>;
}

export const defaultContent: SiteContentData = {
  info: ARCANUM_INFO,
  values: ARCANUM_VALUES,
  locations: ARCANUM_LOCATION_HUBS,
  capabilities: ARCANUM_CAPABILITIES,
  showcaseItems: DEFAULT_SHOWCASE_ITEMS,
  modules: ARCANUM_MODULES,
  brochures: BROCHURES_LIST,
};

const CmsContext = createContext<CmsContextType>({
  content: defaultContent,
  loading: false,
  isFirebaseLoaded: false,
  updateCmsContent: async () => false,
  seedFirebaseWithDefaults: async () => false,
  syncToFile: async () => false,
  refreshCmsContent: async () => {},
});

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentData>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);

  const fetchFromServerApi = async () => {
    try {
      const res = await fetch('/api/admin/cms', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent({
            info: json.data.info ? { ...ARCANUM_INFO, ...json.data.info } : ARCANUM_INFO,
            values: Array.isArray(json.data.values) && json.data.values.length > 0 ? json.data.values : ARCANUM_VALUES,
            locations: Array.isArray(json.data.locations) && json.data.locations.length > 0 ? json.data.locations : ARCANUM_LOCATION_HUBS,
            capabilities: Array.isArray(json.data.capabilities) && json.data.capabilities.length > 0 ? json.data.capabilities : ARCANUM_CAPABILITIES,
            showcaseItems: Array.isArray(json.data.showcaseItems) ? json.data.showcaseItems : DEFAULT_SHOWCASE_ITEMS,
            modules: Array.isArray(json.data.modules) ? json.data.modules : ARCANUM_MODULES,
            brochures: Array.isArray(json.data.brochures) ? json.data.brochures : BROCHURES_LIST,
            updatedAt: json.data.updatedAt,
          });
          setIsFirebaseLoaded(true);
        }
      }
    } catch (err) {
      console.warn('[CMS Server API Fetch Warning]:', err);
    }
  };

  useEffect(() => {
    // 1. First hydrate via server-side API
    fetchFromServerApi();

    // 2. Setup real-time Firestore listener
    let unsub: () => void = () => {};

    try {
      const docRef = doc(db, 'cms_content', 'arcanum_site_data');
      unsub = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as Partial<SiteContentData>;
            setContent({
              info: data.info ? { ...ARCANUM_INFO, ...data.info } : ARCANUM_INFO,
              values: Array.isArray(data.values) && data.values.length > 0 ? data.values : ARCANUM_VALUES,
              locations: Array.isArray(data.locations) && data.locations.length > 0 ? data.locations : ARCANUM_LOCATION_HUBS,
              capabilities: Array.isArray(data.capabilities) && data.capabilities.length > 0 ? data.capabilities : ARCANUM_CAPABILITIES,
              showcaseItems: Array.isArray(data.showcaseItems) ? data.showcaseItems : DEFAULT_SHOWCASE_ITEMS,
              modules: Array.isArray(data.modules) ? data.modules : ARCANUM_MODULES,
              brochures: Array.isArray(data.brochures) ? data.brochures : BROCHURES_LIST,
              updatedAt: data.updatedAt,
            });
            setIsFirebaseLoaded(true);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('[CMS Firestore Subscription Warning]:', error?.message || error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn('[CMS Init Warning]:', err);
      setLoading(false);
    }

    return () => unsub();
  }, []);

  const updateCmsContent = async (newContent: SiteContentData): Promise<boolean> => {
    try {
      // 1. Call server-side API to update Firestore, backup JSON, and arcanumData.ts
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent(json.data);
          setIsFirebaseLoaded(true);
          return true;
        }
      }

      // 2. Client-side fallback write to Firestore
      const docRef = doc(db, 'cms_content', 'arcanum_site_data');
      const payload: SiteContentData = {
        info: newContent.info,
        values: newContent.values,
        locations: newContent.locations,
        capabilities: newContent.capabilities,
        showcaseItems: newContent.showcaseItems || DEFAULT_SHOWCASE_ITEMS,
        modules: newContent.modules,
        brochures: newContent.brochures,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, payload);
      setContent(payload);
      setIsFirebaseLoaded(true);
      return true;
    } catch (err: any) {
      console.error('[Update CMS Error]', err);
      setContent(newContent);
      return false;
    }
  };

  const seedFirebaseWithDefaults = async (): Promise<boolean> => {
    return updateCmsContent(defaultContent);
  };

  const syncToFile = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pull' }),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error('[Sync to File Error]', err);
      return false;
    }
  };

  return (
    <CmsContext.Provider
      value={{
        content,
        loading,
        isFirebaseLoaded,
        updateCmsContent,
        seedFirebaseWithDefaults,
        syncToFile,
        refreshCmsContent: fetchFromServerApi,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
