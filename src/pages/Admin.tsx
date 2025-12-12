import { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Palette, 
  Key, 
  History, 
  LayoutGrid,
  ArrowLeft,
  Save,
  Trash2,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  ExternalLink,
  Type,
  Upload,
  X,
  Image
} from "lucide-react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";

const colorOptions = [
  { value: "green", label: "Green", color: "bg-neon-green" },
  { value: "pink", label: "Pink", color: "bg-neon-pink" },
  { value: "orange", label: "Orange", color: "bg-neon-orange" },
  { value: "cyan", label: "Cyan", color: "bg-neon-cyan" },
  { value: "red", label: "Red", color: "bg-neon-red" },
  { value: "purple", label: "Purple", color: "bg-neon-purple" },
  { value: "yellow", label: "Yellow", color: "bg-neon-yellow" },
];

const iconOptions = [
  "Zap", "Sparkles", "Shield", "Terminal", "Code", "Wifi", "Globe", 
  "Eye", "Lock", "Skull", "Bug", "Fingerprint", "Radar", "Search",
  "Database", "Server", "Cpu", "Binary", "Hash", "Key"
];

interface SearchHistoryItem {
  id: string;
  search_type: string;
  search_query: string;
  searched_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, updateTab, resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<"header" | "tabs" | "theme" | "password" | "history">("header");
  const [showSitePassword, setShowSitePassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  // Local state for editing
  const [localSitePassword, setLocalSitePassword] = useState(settings.sitePassword);
  const [localAdminPassword, setLocalAdminPassword] = useState(settings.adminPassword);


  useEffect(() => {
    if (isAuthenticated) {
      fetchSearchHistory();
    }
  }, [isAuthenticated]);

  const fetchSearchHistory = async () => {
    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .order("searched_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      setSearchHistory(data);
    }
  };

  const clearSearchHistory = async () => {
    const { error } = await supabase.from("search_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (!error) {
      setSearchHistory([]);
      toast({ title: "History Cleared", description: "All search history deleted" });
    }
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === settings.adminPassword) {
      setIsAuthenticated(true);
      toast({ title: "Access Granted", description: "Welcome to Admin Panel" });
    } else {
      toast({ title: "Access Denied", description: "Wrong admin password", variant: "destructive" });
    }
  };

  const savePasswords = () => {
    updateSettings({ 
      sitePassword: localSitePassword, 
      adminPassword: localAdminPassword 
    });
    toast({ title: "Saved", description: "Passwords updated successfully" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 cyber-grid opacity-[0.03]" />
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-[2px] bg-gradient-to-r from-neon-red via-neon-orange to-neon-yellow rounded-2xl opacity-80 blur-sm animate-pulse" />
          <div className="relative bg-background border-2 border-neon-orange/50 rounded-2xl p-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-neon-red/30 to-neon-orange/30 flex items-center justify-center border-2 border-neon-orange/50">
                <Shield className="w-7 h-7 text-neon-orange" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-display font-bold text-neon-orange">ADMIN ACCESS</h1>
              <p className="text-muted-foreground text-sm mt-1">Enter admin password</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Admin password..."
                className="bg-background border-2 border-neon-orange/50 rounded-xl h-12 text-center"
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              />
              <Button
                onClick={handleAdminLogin}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-neon-orange to-neon-red text-background font-bold"
              >
                LOGIN
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 cyber-grid opacity-[0.03]" />
      
      {/* Header */}
      <div className="relative border-b border-neon-orange/30 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5 text-neon-orange" />
            </Button>
            <h1 className="text-xl font-display font-bold text-neon-orange">ADMIN PANEL</h1>
          </div>
          <Button variant="outline" size="sm" onClick={resetSettings} className="border-neon-red/50 text-neon-red hover:bg-neon-red/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset All
          </Button>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-6">
        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "header", icon: Type, label: "Header" },
            { id: "tabs", icon: LayoutGrid, label: "Tabs" },
            { id: "theme", icon: Palette, label: "Theme" },
            { id: "password", icon: Key, label: "Password" },
            { id: "history", icon: History, label: "History" },
          ].map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id as any)}
              className={activeSection === section.id 
                ? "bg-neon-orange text-background" 
                : "border-neon-orange/50 text-neon-orange hover:bg-neon-orange/10"
              }
            >
              <section.icon className="w-4 h-4 mr-2" />
              {section.label}
            </Button>
          ))}
        </div>

        {/* Header Section */}
        {activeSection === "header" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4">Header Configuration</h2>
            
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-green">Website Title</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">First Part (Green)</label>
                  <Input
                    value={settings.headerName1}
                    onChange={(e) => updateSettings({ headerName1: e.target.value })}
                    placeholder="SHUBH"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Second Part (Pink)</label>
                  <Input
                    value={settings.headerName2}
                    onChange={(e) => updateSettings({ headerName2: e.target.value })}
                    placeholder="OSINT"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-pink flex items-center gap-2">
                <Image className="w-4 h-4" /> Custom Logo
              </h3>
              <p className="text-xs text-muted-foreground">Upload your own image to replace the icon</p>
              
              {settings.headerCustomLogo ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-neon-green overflow-hidden">
                    <img src={settings.headerCustomLogo} alt="Custom Logo" className="w-full h-full object-cover" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSettings({ headerCustomLogo: "" })}
                    className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neon-pink/50 rounded-xl cursor-pointer hover:bg-neon-pink/5 transition-all">
                  <Upload className="w-6 h-6 text-neon-pink mb-1" />
                  <span className="text-sm text-neon-pink">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateSettings({ headerCustomLogo: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-cyan">Header Icon (used if no custom logo)</h3>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((iconName) => {
                  const IconComp = Icons[iconName as keyof typeof Icons] as React.FC<{ className?: string }>;
                  return IconComp ? (
                    <button
                      key={iconName}
                      onClick={() => updateSettings({ headerIcon: iconName })}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                        settings.headerIcon === iconName && !settings.headerCustomLogo
                          ? "border-neon-green bg-neon-green/10 shadow-[0_0_10px_hsl(var(--neon-green)/0.5)]"
                          : "border-border/50 hover:border-neon-green/50"
                      }`}
                    >
                      <IconComp className="w-5 h-5 text-neon-green" />
                      <span className="text-[10px] text-muted-foreground">{iconName}</span>
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        {activeSection === "tabs" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4">Tab Configuration</h2>
            {settings.tabs.map((tab) => (
              <div key={tab.id} className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-neon-${tab.color}`} />
                    <span className="font-bold text-foreground">{tab.label}</span>
                  </div>
                  <Switch
                    checked={tab.enabled}
                    onCheckedChange={(enabled) => updateTab(tab.id, { enabled })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Tab Name</label>
                    <Input
                      value={tab.label}
                      onChange={(e) => updateTab(tab.id, { label: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                    <select
                      value={tab.color}
                      onChange={(e) => updateTab(tab.id, { color: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {colorOptions.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Placeholder</label>
                  <Input
                    value={tab.placeholder}
                    onChange={(e) => updateTab(tab.id, { placeholder: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                {tab.searchType !== "shubh" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">API URL (query appended at end)</label>
                    <Input
                      value={tab.apiUrl}
                      onChange={(e) => updateTab(tab.id, { apiUrl: e.target.value })}
                      placeholder="https://api.example.com/search?q="
                      className="h-9 text-sm font-mono"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Theme Section */}
        {activeSection === "theme" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4">Theme Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "dark", label: "Dark", colors: "from-gray-900 to-gray-800" },
                { id: "neon-green", label: "Neon Green", colors: "from-neon-green/20 to-background" },
                { id: "neon-pink", label: "Neon Pink", colors: "from-neon-pink/20 to-background" },
                { id: "neon-cyan", label: "Neon Cyan", colors: "from-neon-cyan/20 to-background" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ theme: theme.id as any })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.theme === theme.id 
                      ? "border-neon-green shadow-[0_0_15px_hsl(var(--neon-green)/0.5)]" 
                      : "border-border/50 hover:border-neon-green/50"
                  }`}
                >
                  <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.colors} mb-2`} />
                  <p className="text-sm font-medium text-foreground">{theme.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Password Section */}
        {activeSection === "password" && (
          <div className="space-y-6">
            <h2 className="text-lg font-display text-neon-cyan mb-4">Password Settings</h2>
            
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-green flex items-center gap-2">
                <Key className="w-4 h-4" /> Site Password
              </h3>
              <div className="relative">
                <Input
                  type={showSitePassword ? "text" : "password"}
                  value={localSitePassword}
                  onChange={(e) => setLocalSitePassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSitePassword(!showSitePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showSitePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">This password is required to access the main website</p>
            </div>

            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-orange flex items-center gap-2">
                <Shield className="w-4 h-4" /> Admin Password
              </h3>
              <div className="relative">
                <Input
                  type={showAdminPassword ? "text" : "password"}
                  value={localAdminPassword}
                  onChange={(e) => setLocalAdminPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">This password is required to access this admin panel</p>
            </div>

            <Button onClick={savePasswords} className="w-full bg-neon-green text-background font-bold">
              <Save className="w-4 h-4 mr-2" /> Save Passwords
            </Button>
          </div>
        )}

        {/* History Section */}
        {activeSection === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display text-neon-cyan">Search History</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchSearchHistory} className="border-neon-cyan/50 text-neon-cyan">
                  <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={clearSearchHistory} className="border-neon-red/50 text-neon-red">
                  <Trash2 className="w-4 h-4 mr-1" /> Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {searchHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No search history yet</p>
                </div>
              ) : (
                searchHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded bg-neon-cyan/20 text-neon-cyan uppercase">
                        {item.search_type}
                      </span>
                      <span className="text-foreground font-mono">{item.search_query}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.searched_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;