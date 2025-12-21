import { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Palette, 
  Key, 
  History, 
  LayoutGrid,
  Database,
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
  Image,
  Send,
  Camera,
  Video,
  Music
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
  { value: "blue", label: "Blue", color: "bg-neon-blue" },
];

const iconOptions = [
  "Zap", "Sparkles", "Shield", "Terminal", "Code", "Wifi", "Globe", 
  "Eye", "Lock", "Skull", "Bug", "Fingerprint", "Radar", "Search",
  "Database", "Server", "Cpu", "Binary", "Hash", "Key"
];

const fontOptions = [
  { value: "Orbitron", label: "Orbitron", style: "font-display" },
  { value: "Share Tech Mono", label: "Share Tech Mono", style: "font-mono" },
  { value: "Courier New", label: "Courier New", style: "font-mono" },
  { value: "Impact", label: "Impact", style: "font-sans" },
  { value: "Georgia", label: "Georgia", style: "font-serif" },
  { value: "Arial Black", label: "Arial Black", style: "font-sans" },
  { value: "Verdana", label: "Verdana", style: "font-sans" },
  { value: "Times New Roman", label: "Times New Roman", style: "font-serif" },
];

const headerStyleOptions = [
  { value: "normal", label: "Normal" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
  { value: "italic", label: "Italic" },
  { value: "bold", label: "Bold" },
  { value: "glow", label: "Glow Effect" },
  { value: "flicker", label: "Neon Flicker" },
];

interface SearchHistoryItem {
  id: string;
  search_type: string;
  search_query: string;
  searched_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, updateTab, updateTelegramTool, resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<"header" | "background" | "tabs" | "darkdb" | "telegram" | "camhack" | "music" | "theme" | "password" | "history">("header");
  const [showSitePassword, setShowSitePassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAllSearchKey, setShowAllSearchKey] = useState(false);
  const [showTelegramKey, setShowTelegramKey] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  // Local state for editing
  const [localSitePassword, setLocalSitePassword] = useState(settings.sitePassword);
  const [localAdminPassword, setLocalAdminPassword] = useState(settings.adminPassword);
  const [localAllSearchKey, setLocalAllSearchKey] = useState(settings.allSearchAccessKey || "");
  const [localTelegramKey, setLocalTelegramKey] = useState(settings.telegramOsintAccessKey || "");


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
      adminPassword: localAdminPassword,
      allSearchAccessKey: localAllSearchKey,
      telegramOsintAccessKey: localTelegramKey
    });
    toast({ title: "Saved", description: "Passwords & Access Keys updated successfully" });
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
            { id: "background", icon: Image, label: "Background" },
            { id: "tabs", icon: LayoutGrid, label: "Tabs" },
            { id: "darkdb", icon: Database, label: "DARK DB" },
            { id: "telegram", icon: Send, label: "Telegram" },
            { id: "camhack", icon: Camera, label: "CAM Hack" },
            { id: "music", icon: Music, label: "Music" },
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
                  <label className="text-xs text-muted-foreground mb-1 block">First Part</label>
                  <Input
                    value={settings.headerName1}
                    onChange={(e) => updateSettings({ headerName1: e.target.value })}
                    placeholder="SHUBH"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Second Part</label>
                  <Input
                    value={settings.headerName2}
                    onChange={(e) => updateSettings({ headerName2: e.target.value })}
                    placeholder="OSINT"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Header Colors */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-cyan">Header Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">First Part Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateSettings({ headerColor1: c.value })}
                        className={`h-10 rounded-lg ${c.color} transition-all ${
                          settings.headerColor1 === c.value 
                            ? "ring-2 ring-white scale-110" 
                            : "opacity-60 hover:opacity-100"
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Second Part Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateSettings({ headerColor2: c.value })}
                        className={`h-10 rounded-lg ${c.color} transition-all ${
                          settings.headerColor2 === c.value 
                            ? "ring-2 ring-white scale-110" 
                            : "opacity-60 hover:opacity-100"
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Font Selection */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-orange">Header Font</h3>
              <div className="grid grid-cols-2 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updateSettings({ headerFont: font.value })}
                    style={{ fontFamily: font.value }}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      settings.headerFont === font.value
                        ? "border-neon-orange bg-neon-orange/10 shadow-[0_0_10px_hsl(var(--neon-orange)/0.5)]"
                        : "border-border/50 hover:border-neon-orange/50"
                    }`}
                  >
                    <span className="text-lg text-foreground">{font.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Header Style */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-purple">Header Style</h3>
              <div className="grid grid-cols-4 gap-2">
                {headerStyleOptions.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateSettings({ headerStyle: style.value })}
                    className={`p-2 rounded-lg border-2 text-sm transition-all ${
                      settings.headerStyle === style.value
                        ? "border-neon-purple bg-neon-purple/10 shadow-[0_0_10px_hsl(var(--neon-purple)/0.5)]"
                        : "border-border/50 hover:border-neon-purple/50"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
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

        {/* Background Section */}
        {activeSection === "background" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4">Background Configuration</h2>
            
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-green flex items-center gap-2">
                <Image className="w-4 h-4" /> Custom Background Image
              </h3>
              <p className="text-xs text-muted-foreground">Upload a custom background image for the website. Leave empty for solid black background.</p>
              
              {settings.backgroundImage ? (
                <div className="space-y-4">
                  <div className="w-full h-40 rounded-xl border-2 border-neon-green overflow-hidden">
                    <img src={settings.backgroundImage} alt="Background Preview" className="w-full h-full object-cover" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => updateSettings({ backgroundImage: "" })}
                    className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove Background
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neon-cyan/50 rounded-xl cursor-pointer hover:bg-neon-cyan/5 transition-all">
                  <Upload className="w-8 h-8 text-neon-cyan mb-2" />
                  <span className="text-sm text-neon-cyan">Click to upload background image</span>
                  <span className="text-xs text-muted-foreground mt-1">Recommended: High resolution image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateSettings({ backgroundImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Background Opacity Slider */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <h3 className="font-bold text-neon-pink flex items-center gap-2">
                <Eye className="w-4 h-4" /> Background Visibility
              </h3>
              <p className="text-xs text-muted-foreground">
                Adjust how visible the background image is. Lower overlay = more visible background.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neon-cyan">Dark Overlay: {settings.backgroundOpacity || "30"}%</span>
                  <span className="text-sm text-neon-green">Background Visible: {100 - parseInt(settings.backgroundOpacity || "30")}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={settings.backgroundOpacity || "30"}
                  onChange={(e) => updateSettings({ backgroundOpacity: e.target.value })}
                  className="w-full h-2 bg-card rounded-lg appearance-none cursor-pointer accent-neon-pink"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Max Visible</span>
                  <span>More Dark</span>
                </div>
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

        {/* DARK DB Section */}
        {activeSection === "darkdb" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-purple mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" /> Hard Bomber Configuration
            </h2>

            {/* Tab Name Setting */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-yellow">Tab Name</h3>
              <p className="text-xs text-muted-foreground">Change the display name for this tab</p>
              <Input
                value={settings.tabs.find(t => t.searchType === "darkdb")?.label || "Hard Bomber"}
                onChange={(e) => updateTab("darkdb", { label: e.target.value })}
                placeholder="Hard Bomber"
                className="text-sm"
              />
            </div>
            
            {/* URL Setting */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-cyan">Website URL</h3>
              <p className="text-xs text-muted-foreground">Enter the URL to load in iframe</p>
              <Input
                value={settings.darkDbUrl}
                onChange={(e) => updateSettings({ darkDbUrl: e.target.value })}
                placeholder="https://example.com"
                className="font-mono text-sm"
              />
            </div>

            {/* Height Setting */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-green">Iframe Height (vh)</h3>
              <p className="text-xs text-muted-foreground">Set height in viewport height units (10-100)</p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="10"
                  max="100"
                  value={settings.darkDbHeight}
                  onChange={(e) => updateSettings({ darkDbHeight: e.target.value })}
                  className="w-24"
                />
                <span className="text-muted-foreground">vh</span>
                <div className="flex-1 flex gap-2">
                  {["50", "70", "80", "90"].map((h) => (
                    <button
                      key={h}
                      onClick={() => updateSettings({ darkDbHeight: h })}
                      className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                        settings.darkDbHeight === h
                          ? "border-neon-green bg-neon-green/20 text-neon-green"
                          : "border-border/50 text-muted-foreground hover:border-neon-green/50"
                      }`}
                    >
                      {h}vh
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Border Color */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-pink">Border Color</h3>
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => updateSettings({ darkDbBorderColor: c.value })}
                    className={`h-10 rounded-lg ${c.color} transition-all ${
                      settings.darkDbBorderColor === c.value 
                        ? "ring-2 ring-white scale-110" 
                        : "opacity-60 hover:opacity-100"
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Border Width */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-orange">Border Width</h3>
              <div className="flex gap-2">
                {["0", "1", "2", "3", "4"].map((w) => (
                  <button
                    key={w}
                    onClick={() => updateSettings({ darkDbBorderWidth: w })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      settings.darkDbBorderWidth === w
                        ? "border-neon-orange bg-neon-orange/20 text-neon-orange"
                        : "border-border/50 text-muted-foreground hover:border-neon-orange/50"
                    }`}
                  >
                    {w === "0" ? "None" : `${w}px`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-yellow">Preview</h3>
              <div 
                className={`w-full h-32 rounded-xl bg-muted/30 flex items-center justify-center`}
                style={{
                  borderWidth: `${settings.darkDbBorderWidth}px`,
                  borderStyle: 'solid',
                  borderColor: `hsl(var(--neon-${settings.darkDbBorderColor}))`,
                  boxShadow: settings.darkDbBorderWidth !== "0" 
                    ? `0 0 20px hsl(var(--neon-${settings.darkDbBorderColor}) / 0.3)` 
                    : 'none'
                }}
              >
                <span className="text-muted-foreground text-sm">Iframe Preview Border</span>
              </div>
            </div>
          </div>
        )}

        {/* Telegram OSINT Section */}
        {activeSection === "telegram" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" /> Telegram OSINT Configuration
            </h2>
            
            {/* JWT Token */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-green">JWT Token</h3>
              <p className="text-xs text-muted-foreground">API authentication token for funstat.info</p>
              <Input
                type="password"
                value={settings.telegramOsint?.jwtToken || ""}
                onChange={(e) => updateSettings({ 
                  telegramOsint: { ...settings.telegramOsint, jwtToken: e.target.value } 
                })}
                placeholder="eyJhbGciOiJSUzI1NiIs..."
                className="font-mono text-sm"
              />
            </div>

            {/* Base URL */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-pink">API Base URL</h3>
              <Input
                value={settings.telegramOsint?.baseUrl || "https://funstat.info"}
                onChange={(e) => updateSettings({ 
                  telegramOsint: { ...settings.telegramOsint, baseUrl: e.target.value } 
                })}
                placeholder="https://funstat.info"
                className="font-mono text-sm"
              />
            </div>

            {/* Tools Configuration */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-orange">Tools Configuration</h3>
              <p className="text-xs text-muted-foreground">Enable/disable individual tools and customize labels</p>
              
              <div className="space-y-3 mt-4">
                {settings.telegramOsint?.tools?.map((tool) => (
                  <div key={tool.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30">
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={(checked) => updateTelegramTool(tool.id, { enabled: checked })}
                    />
                    <div className="flex-1">
                      <Input
                        value={tool.label}
                        onChange={(e) => updateTelegramTool(tool.id, { label: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      tool.cost === 'FREE' 
                        ? 'bg-neon-green/20 text-neon-green' 
                        : 'bg-neon-yellow/20 text-neon-yellow'
                    }`}>
                      {tool.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cache */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-red flex items-center gap-2">
                <Database className="w-4 h-4" /> Cache Management
              </h3>
              <p className="text-xs text-muted-foreground">Clear cached Telegram OSINT search results</p>
              <Button
                onClick={() => {
                  localStorage.removeItem('telegram_osint_cache');
                  toast({ title: "Cache Cleared", description: "Telegram OSINT cache has been cleared" });
                }}
                variant="outline"
                className="border-neon-red text-neon-red hover:bg-neon-red/10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear Telegram Cache
              </Button>
            </div>
          </div>
        )}

        {/* CAM Hack Section */}
        {activeSection === "camhack" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" /> CAM Hack Configuration
            </h2>
            
            {/* Session ID */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-green">Session ID</h3>
              <p className="text-xs text-muted-foreground">All captured photos will be stored under this session ID (synced across all devices)</p>
              <Input
                value={settings.camSessionId}
                onChange={(e) => updateSettings({ camSessionId: e.target.value })}
                placeholder="shubhcam01"
                className="font-mono text-sm"
              />
            </div>

            {/* Redirect URL */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-pink">Redirect URL (Normal Capture)</h3>
              <p className="text-xs text-muted-foreground">User will be redirected here after camera capture (only for normal links, not custom HTML)</p>
              <Input
                value={settings.camRedirectUrl}
                onChange={(e) => updateSettings({ camRedirectUrl: e.target.value })}
                placeholder="https://google.com"
                className="font-mono text-sm"
              />
            </div>

            {/* Custom HTML */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-orange">Custom HTML Template</h3>
              <p className="text-xs text-muted-foreground">Upload or paste custom HTML for phishing capture page</p>
              
              {settings.customCaptureHtml ? (
                <div className="space-y-3">
                  <div className="p-3 bg-neon-green/10 rounded-lg border border-neon-green/30">
                    <p className="text-neon-green text-sm">✓ Custom HTML loaded ({Math.round(settings.customCaptureHtml.length / 1024)}KB)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([settings.customCaptureHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'capture-template.html';
                        a.click();
                      }}
                      className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" /> Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSettings({ customCaptureHtml: "" })}
                      className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
                    >
                      <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neon-orange/50 rounded-xl cursor-pointer hover:bg-neon-orange/5 transition-all">
                  <Upload className="w-6 h-6 text-neon-orange mb-1" />
                  <span className="text-sm text-neon-orange">Click to upload HTML file</span>
                  <input
                    type="file"
                    accept=".html,.htm"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateSettings({ customCaptureHtml: reader.result as string });
                          toast({ title: "HTML Uploaded", description: "Custom capture template saved" });
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Links Preview */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-purple">Generated Links</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Normal Capture Link</label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/capture?session=${settings.camSessionId}&redirect=${encodeURIComponent(settings.camRedirectUrl)}`}
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/capture?session=${settings.camSessionId}&redirect=${encodeURIComponent(settings.camRedirectUrl)}`);
                        toast({ title: "Copied!", description: "Normal capture link copied" });
                      }}
                      className="border-neon-green text-neon-green"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {settings.customCaptureHtml && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Custom HTML Capture Link</label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={`${window.location.origin}/custom-capture?session=${settings.camSessionId}`}
                        className="font-mono text-xs"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/custom-capture?session=${settings.camSessionId}`);
                          toast({ title: "Copied!", description: "Custom capture link copied" });
                        }}
                        className="border-neon-pink text-neon-pink"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Photos */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-red flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Clear Captured Photos
              </h3>
              <p className="text-xs text-muted-foreground">Delete all captured photos for the current session</p>
              <Button
                onClick={async () => {
                  const { error } = await supabase
                    .from("captured_photos")
                    .delete()
                    .eq("session_id", settings.camSessionId);
                  if (!error) {
                    toast({ title: "Photos Cleared", description: "All captured photos deleted" });
                  } else {
                    toast({ title: "Error", description: "Failed to clear photos", variant: "destructive" });
                  }
                }}
                variant="outline"
                className="border-neon-red text-neon-red hover:bg-neon-red/10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear All Photos
              </Button>
            </div>
          </div>
        )}

        {/* Music Section */}
        {activeSection === "music" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-neon-cyan mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" /> Background Music Settings
            </h2>
            
            {/* Main Page Music URL */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-green">Main Page Music URL</h3>
              <p className="text-xs text-muted-foreground">
                Direct link to MP3 file for the main page mini player (leave empty for default music)
              </p>
              <Input
                value={settings.mainPageMusicUrl || ""}
                onChange={(e) => updateSettings({ mainPageMusicUrl: e.target.value })}
                placeholder="https://example.com/music.mp3"
                className="font-mono text-sm"
              />
              {settings.mainPageMusicUrl && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(settings.mainPageMusicUrl, '_blank')}
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> Test URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSettings({ mainPageMusicUrl: "" })}
                    className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Page2 Music URL */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
              <h3 className="font-bold text-neon-yellow">Page 2 Music URL</h3>
              <p className="text-xs text-muted-foreground">
                Direct link to MP3 file for the Page2 music player (leave empty for default music)
              </p>
              <Input
                value={settings.page2MusicUrl || ""}
                onChange={(e) => updateSettings({ page2MusicUrl: e.target.value })}
                placeholder="https://example.com/music.mp3"
                className="font-mono text-sm"
              />
              {settings.page2MusicUrl && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(settings.page2MusicUrl, '_blank')}
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> Test URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSettings({ page2MusicUrl: "" })}
                    className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="border border-neon-green/30 rounded-xl p-4 bg-neon-green/5">
              <p className="text-xs text-neon-green">
                <strong>Tip:</strong> You can use direct MP3 links from Google Drive, Dropbox, or any other CDN. 
                The music will play with play/pause and volume controls.
              </p>
            </div>
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
            
            {/* Site Password */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neon-green flex items-center gap-2">
                  <Key className="w-4 h-4" /> Site Password
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {settings.sitePasswordEnabled ? "ON" : "OFF"}
                  </span>
                  <Switch
                    checked={settings.sitePasswordEnabled}
                    onCheckedChange={(checked) => updateSettings({ sitePasswordEnabled: checked })}
                  />
                </div>
              </div>
              <div className="relative">
                <Input
                  type={showSitePassword ? "text" : "password"}
                  value={localSitePassword}
                  onChange={(e) => setLocalSitePassword(e.target.value)}
                  className="pr-10"
                  disabled={!settings.sitePasswordEnabled}
                />
                <button
                  type="button"
                  onClick={() => setShowSitePassword(!showSitePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showSitePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.sitePasswordEnabled 
                  ? "Website password protection is ENABLED" 
                  : "Website password protection is DISABLED - anyone can access"}
              </p>
            </div>

            {/* Admin Password */}
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
              <p className="text-xs text-muted-foreground">This password is required to access this admin panel (always enabled)</p>
            </div>

            {/* ALL SEARCH Access Key */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neon-red flex items-center gap-2">
                  <Key className="w-4 h-4" /> ALL SEARCH Access Key
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {settings.allSearchKeyEnabled ? "ON" : "OFF"}
                  </span>
                  <Switch
                    checked={settings.allSearchKeyEnabled}
                    onCheckedChange={(checked) => updateSettings({ allSearchKeyEnabled: checked })}
                  />
                </div>
              </div>
              <div className="relative">
                <Input
                  type={showAllSearchKey ? "text" : "password"}
                  value={localAllSearchKey}
                  onChange={(e) => setLocalAllSearchKey(e.target.value)}
                  placeholder="Set access key for ALL SEARCH..."
                  className="pr-10"
                  disabled={!settings.allSearchKeyEnabled}
                />
                <button
                  type="button"
                  onClick={() => setShowAllSearchKey(!showAllSearchKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showAllSearchKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.allSearchKeyEnabled 
                  ? "ALL SEARCH access key protection is ENABLED" 
                  : "ALL SEARCH access key protection is DISABLED"}
              </p>
            </div>

            {/* Telegram OSINT Access Key */}
            <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neon-cyan flex items-center gap-2">
                  <Key className="w-4 h-4" /> Telegram OSINT Access Key
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {settings.telegramKeyEnabled ? "ON" : "OFF"}
                  </span>
                  <Switch
                    checked={settings.telegramKeyEnabled}
                    onCheckedChange={(checked) => updateSettings({ telegramKeyEnabled: checked })}
                  />
                </div>
              </div>
              <div className="relative">
                <Input
                  type={showTelegramKey ? "text" : "password"}
                  value={localTelegramKey}
                  onChange={(e) => setLocalTelegramKey(e.target.value)}
                  placeholder="Set access key for Telegram OSINT..."
                  className="pr-10"
                  disabled={!settings.telegramKeyEnabled}
                />
                <button
                  type="button"
                  onClick={() => setShowTelegramKey(!showTelegramKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showTelegramKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.telegramKeyEnabled 
                  ? "Telegram OSINT access key protection is ENABLED" 
                  : "Telegram OSINT access key protection is DISABLED"}
              </p>
            </div>

            <Button onClick={savePasswords} className="w-full bg-neon-green text-background font-bold">
              <Save className="w-4 h-4 mr-2" /> Save Passwords & Keys
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