import { useState, useEffect, useCallback } from 'react';

export interface HitSiteSettings {
  siteName: string;
  adminButtonText: string;
  warningText: string;
  quickHitTitle: string;
  phoneLabel: string;
  phonePlaceholder: string;
  hitButtonText: string;
  stopButtonText: string;
  noApisWarning: string;
  adminPanelTitle: string;
  logoutButtonText: string;
  disclaimerTitle: string;
  disclaimerText: string;
  apiListTitle: string;
  addApiButtonText: string;
  noApisText: string;
  logoUrl: string;
  adminPassword: string;
  residentialProxyUrl: string;
}

const defaultSettings: HitSiteSettings = {
  siteName: 'SHUBH OSINT',
  adminButtonText: 'SETTING',
  warningText: 'Sirf authorized testing aur educational purpose ke liye.',
  quickHitTitle: 'QUICK HIT',
  phoneLabel: 'Phone Number',
  phonePlaceholder: '91XXXXXXXXXX',
  hitButtonText: 'START',
  stopButtonText: 'STOP',
  noApisWarning: 'Admin me APIs add karo pehle.',
  adminPanelTitle: 'ADMIN PANEL',
  logoutButtonText: 'LOGOUT',
  disclaimerTitle: 'DISCLAIMER',
  disclaimerText: 'Yeh tool sirf authorized testing aur educational purpose ke liye hai. Unauthorized use strictly prohibited.',
  apiListTitle: 'API List',
  addApiButtonText: 'Add',
  noApisText: 'No APIs added yet.',
  logoUrl: '',
  adminPassword: 'dark',
  residentialProxyUrl: '',
};

const STORAGE_KEY = 'hit_site_settings';

export function useHitSiteSettings() {
  const [settings, setSettings] = useState<HitSiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultSettings;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<HitSiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { settings, updateSettings, resetSettings, defaultSettings };
}
