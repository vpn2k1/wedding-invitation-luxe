'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getFallbackSiteSettings } from '@/lib/supabase/mappers';
import type { WeddingSiteSettings } from '@/lib/supabase/types';

type SiteSettingsContextValue = {
  settings: WeddingSiteSettings;
  setSettings: (settings: WeddingSiteSettings) => void;
  isLoading: boolean;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WeddingSiteSettings>(getFallbackSiteSettings());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/site/settings')
      .then((response) => response.json())
      .then((data: { settings?: WeddingSiteSettings }) => {
        if (isMounted && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {
        if (isMounted) setSettings(getFallbackSiteSettings());
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, setSettings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error('useSiteSettings must be used inside SiteSettingsProvider');
  }

  return context;
}
