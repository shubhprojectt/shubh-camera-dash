import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  placeholder: string;
  searchType: string;
  apiUrl: string;
  enabled: boolean;
}

export interface AppSettings {
  sitePassword: string;
  adminPassword: string;
  theme: "dark" | "neon-green" | "neon-pink" | "neon-cyan";
  headerName1: string;
  headerName2: string;
  headerIcon: string;
  headerCustomLogo: string;
  headerColor1: string;
  headerColor2: string;
  headerFont: string;
  headerStyle: string;
  tabs: TabConfig[];
  // DARK DB settings
  darkDbUrl: string;
  darkDbHeight: string;
  darkDbBorderColor: string;
  darkDbBorderWidth: string;
  // Background settings
  backgroundImage: string;
}

const defaultTabs: TabConfig[] = [
  { id: "phone", label: "Phone", icon: "Phone", color: "green", placeholder: "Enter phone number...", searchType: "phone", apiUrl: "", enabled: true },
  { id: "aadhar", label: "Aadhar", icon: "CreditCard", color: "pink", placeholder: "Enter Aadhar number...", searchType: "aadhar", apiUrl: "", enabled: true },
  { id: "vehicle", label: "Vehicle", icon: "Car", color: "orange", placeholder: "Enter RC number...", searchType: "vehicle", apiUrl: "https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=", enabled: true },
  { id: "instagram", label: "Instagram", icon: "Camera", color: "cyan", placeholder: "Enter username...", searchType: "instagram", apiUrl: "", enabled: true },
  { id: "family", label: "Family", icon: "Users", color: "purple", placeholder: "Enter name/number...", searchType: "family", apiUrl: "", enabled: true },
  { id: "manual", label: "Manual", icon: "ClipboardPaste", color: "yellow", placeholder: "Enter number...", searchType: "manual", apiUrl: "https://hydrashop.in.net/number.php?q=", enabled: true },
  { id: "shubh", label: "CAM HACK", icon: "Sparkles", color: "cyan", placeholder: "", searchType: "shubh", apiUrl: "", enabled: true },
  { id: "darkdb", label: "DARK DB", icon: "Database", color: "purple", placeholder: "", searchType: "darkdb", apiUrl: "https://2info.vercel.app", enabled: true },
];

const defaultSettings: AppSettings = {
  sitePassword: "dark",
  adminPassword: "dark",
  theme: "dark",
  headerName1: "SHUBH",
  headerName2: "OSINT",
  headerIcon: "Zap",
  headerCustomLogo: "",
  headerColor1: "green",
  headerColor2: "pink",
  headerFont: "Orbitron",
  headerStyle: "normal",
  tabs: defaultTabs,
  // DARK DB defaults
  darkDbUrl: "https://shubhinfo.vercel.app/",
  darkDbHeight: "70",
  darkDbBorderColor: "purple",
  darkDbBorderWidth: "2",
  // Background defaults
  backgroundImage: "",
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateTab: (tabId: string, updates: Partial<TabConfig>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from Supabase on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_key', 'main_settings')
          .maybeSingle();

        if (error) {
          console.error('Error loading settings:', error);
          // Fall back to localStorage
          const saved = localStorage.getItem("app_settings");
          if (saved) {
            const parsed = JSON.parse(saved);
            const savedTabIds = parsed.tabs?.map((t: TabConfig) => t.id) || [];
            const newTabs = defaultTabs.filter(t => !savedTabIds.includes(t.id));
            const mergedTabs = [...(parsed.tabs || []), ...newTabs];
            setSettings({ ...defaultSettings, ...parsed, tabs: mergedTabs });
          }
        } else if (data) {
          const parsed = data.setting_value as unknown as AppSettings;
          const savedTabIds = parsed.tabs?.map((t: TabConfig) => t.id) || [];
          const newTabs = defaultTabs.filter(t => !savedTabIds.includes(t.id));
          const mergedTabs = [...(parsed.tabs || []), ...newTabs];
          setSettings({ ...defaultSettings, ...parsed, tabs: mergedTabs });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save settings to Supabase whenever they change
  const saveToSupabase = useCallback(async (newSettings: AppSettings) => {
    try {
      const settingsJson = JSON.parse(JSON.stringify(newSettings));
      
      const { data: existing } = await supabase
        .from('app_settings')
        .select('id')
        .eq('setting_key', 'main_settings')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('app_settings')
          .update({ setting_value: settingsJson })
          .eq('setting_key', 'main_settings');
      } else {
        await supabase
          .from('app_settings')
          .insert([{ setting_key: 'main_settings', setting_value: settingsJson }]);
      }
      
      // Also save to localStorage as backup
      localStorage.setItem("app_settings", JSON.stringify(newSettings));
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveToSupabase(updated);
      return updated;
    });
  };

  const updateTab = (tabId: string, updates: Partial<TabConfig>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        tabs: prev.tabs.map(tab => 
          tab.id === tabId ? { ...tab, ...updates } : tab
        ),
      };
      saveToSupabase(updated);
      return updated;
    });
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    localStorage.removeItem("app_settings");
    
    // Delete from Supabase
    await supabase
      .from('app_settings')
      .delete()
      .eq('setting_key', 'main_settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateTab, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
