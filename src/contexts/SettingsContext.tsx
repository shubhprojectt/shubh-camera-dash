import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

const defaultTabs: TabConfig[] = [
  { id: "phone", label: "Phone", icon: "Phone", color: "green", placeholder: "Enter phone number...", searchType: "phone", apiUrl: "", enabled: true },
  { id: "aadhar", label: "Aadhar", icon: "CreditCard", color: "pink", placeholder: "Enter Aadhar number...", searchType: "aadhar", apiUrl: "", enabled: true },
  { id: "vehicle", label: "Vehicle", icon: "Car", color: "orange", placeholder: "Enter RC number...", searchType: "vehicle", apiUrl: "https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=", enabled: true },
  { id: "instagram", label: "Instagram", icon: "Camera", color: "cyan", placeholder: "Enter username...", searchType: "instagram", apiUrl: "", enabled: true },
  { id: "family", label: "Family", icon: "Users", color: "purple", placeholder: "Enter name/number...", searchType: "family", apiUrl: "", enabled: true },
  { id: "manual", label: "Manual", icon: "ClipboardPaste", color: "yellow", placeholder: "Enter number...", searchType: "manual", apiUrl: "https://hydrashop.in.net/number.php?q=", enabled: true },
  { id: "shubh", label: "SHUBH", icon: "Sparkles", color: "cyan", placeholder: "", searchType: "shubh", apiUrl: "", enabled: true },
  { id: "phishing", label: "Phishing", icon: "Code", color: "red", placeholder: "Enter target URL...", searchType: "phishing", apiUrl: "", enabled: true },
  { id: "webcam", label: "Webcam", icon: "Globe", color: "pink", placeholder: "Enter IP/location...", searchType: "webcam", apiUrl: "", enabled: true },
  { id: "darkdb", label: "DARK DB", icon: "Database", color: "purple", placeholder: "", searchType: "darkdb", apiUrl: "https://shubhinfo.vercel.app/", enabled: true },
];

const defaultSettings: AppSettings = {
  sitePassword: "shubh123",
  adminPassword: "admin123",
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
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateTab: (tabId: string, updates: Partial<TabConfig>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved tabs with default tabs to ensure new tabs are included
        const savedTabIds = parsed.tabs?.map((t: TabConfig) => t.id) || [];
        const newTabs = defaultTabs.filter(t => !savedTabIds.includes(t.id));
        const mergedTabs = [...(parsed.tabs || []), ...newTabs];
        return { ...defaultSettings, ...parsed, tabs: mergedTabs };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateTab = (tabId: string, updates: Partial<TabConfig>) => {
    setSettings(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab => 
        tab.id === tabId ? { ...tab, ...updates } : tab
      ),
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("app_settings");
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