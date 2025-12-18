import { useState } from "react";
import { 
  Phone, 
  CreditCard, 
  Car, 
  Camera, 
  Users, 
  ClipboardPaste, 
  Sparkles, 
  Code, 
  Globe,
  Loader2,
  User,
  Calendar,
  MapPin,
  Fuel,
  Settings,
  FileText,
  Shield,
  Zap,
  Search,
  Database,
  Send,
  LucideIcon
} from "lucide-react";
import SearchButton from "./SearchButton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import ShubhCam from "./ShubhCam";
import TelegramOSINT from "./TelegramOSINT";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = {
  Phone, CreditCard, Car, Camera, Users, ClipboardPaste, Sparkles, Code, Globe, Database, Send
};

interface VehicleResult {
  error: boolean;
  rc: string;
  result: {
    Nexus1: {
      id?: number;
      reg_no?: string;
      owner_name?: string;
      maker?: string;
      maker_modal?: string;
      vh_class?: string;
      insUpto?: string;
      regn_dt?: string;
      image?: string;
      isBrand?: boolean;
    };
    Nexus2: {
      "Owner Name"?: string;
      "Father's Name"?: string;
      "Model Name"?: string;
      "Vehicle Class"?: string;
      "Fuel Type"?: string;
      "Registration Date"?: string;
      "Insurance Expiry"?: string;
      "Registered RTO"?: string;
      "Address"?: string;
      "City Name"?: string;
    };
  };
  source_by?: string;
}

interface PhoneResult {
  data1?: {
    id?: string;
    mobile?: string;
    name?: string;
    father_name?: string;
    address?: string;
    alt_mobile?: string;
    circle?: string;
    id_number?: string;
    email?: string | null;
  };
  data2?: {
    id?: string;
    mobile?: string;
    name?: string;
    father_name?: string;
    address?: string;
    alt_mobile?: string;
    circle?: string;
    id_number?: string;
    email?: string | null;
  };
}

const NumberDetailFinder = () => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const enabledTabs = settings.tabs.filter(tab => tab.enabled);
  const activeButton = enabledTabs.find(b => b.label === activeTab);

  const handleTabClick = (label: string) => {
    if (activeTab === label) {
      setActiveTab(null);
    } else {
      setActiveTab(label);
      setSearchQuery("");
      setResult(null);
      setError(null);
    }
  };

  const logSearchHistory = async (searchType: string, query: string) => {
    try {
      await supabase.from("search_history").insert({
        search_type: searchType,
        search_query: query,
      });
    } catch (err) {
      console.error("Failed to log search:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    // Log search history
    await logSearchHistory(activeButton?.searchType || "unknown", searchQuery.trim());

    // If tab has API URL and is manual type - open in new tab
    if (activeButton?.apiUrl && activeButton.searchType === "manual") {
      const apiUrl = `${activeButton.apiUrl}${encodeURIComponent(searchQuery.trim())}`;
      window.open(apiUrl, '_blank');
      toast({
        title: "Opening API",
        description: `Opening search for: ${searchQuery}`,
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    // Phone search API
    if (activeButton?.searchType === "phone") {
      try {
        const response = await fetch(`https://vishal-number-info.22web.org/information.php?number=${encodeURIComponent(searchQuery.trim())}&api_key=vishal_Hacker`);
        const data = await response.json();
        
        if (data && (data.data1 || data.data2)) {
          setResult({ type: "phone", data });
          toast({
            title: "Phone Found",
            description: `Results found for: ${searchQuery}`,
          });
        } else {
          setError("No information found for this number");
          toast({
            title: "Not Found",
            description: "No information found",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // If tab has API URL - use it for vehicle
    if (activeButton?.apiUrl && activeButton.searchType === "vehicle") {
      try {
        const response = await fetch(`${activeButton.apiUrl}${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
        const data = await response.json();
        
        if (data && !data.error) {
          setResult(data);
          toast({
            title: "Vehicle Found",
            description: `Results found for: ${searchQuery.toUpperCase()}`,
          });
        } else {
          setError(data.error || "No vehicle found with this RC number");
          toast({
            title: "Not Found",
            description: data.error || "No vehicle found",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else if (activeButton?.apiUrl) {
      // Open API URL in new tab for other tabs with API
      const apiUrl = `${activeButton.apiUrl}${encodeURIComponent(searchQuery.trim())}`;
      window.open(apiUrl, '_blank');
      setLoading(false);
      toast({
        title: "Opening API",
        description: `Opening search for: ${searchQuery}`,
      });
    } else {
      // Default demo behavior for tabs without API
      setTimeout(() => {
        setLoading(false);
        setResult({
          query: searchQuery,
          status: "Found",
          data: {
            name: "Demo Result",
            location: "India",
            provider: "SHUBH OSINT",
            timestamp: new Date().toLocaleString(),
          }
        });
        toast({
          title: "Search Complete",
          description: `Results found for: ${searchQuery}`,
        });
      }, 1500);
    }
  };

  const renderVehicleResult = (data: VehicleResult) => {
    const n1 = data.result?.Nexus1 || {};
    const n2 = data.result?.Nexus2 || {};
    
    return (
      <div className="space-y-3 animate-slide-up">
        {/* Header Card with Image */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-neon-green/10 to-neon-cyan/5 border border-neon-cyan/50 p-4">
          <div className="absolute top-0 right-0 w-20 h-20 bg-neon-cyan/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            {n1.image && (
              <img src={n1.image} alt="Vehicle" className="w-14 h-14 object-contain rounded-xl bg-card/50 p-1" />
            )}
            {!n1.image && (
              <div className="p-3 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50">
                <Car className="w-6 h-6 text-neon-cyan" />
              </div>
            )}
            <div>
              <p className="text-xs text-neon-cyan/70 uppercase tracking-wider">RC Number</p>
              <p className="text-xl font-display font-bold text-neon-cyan">{n1.reg_no || data.rc}</p>
            </div>
          </div>
          {(n1.maker_modal || n1.maker) && (
            <p className="mt-2 text-sm text-foreground/80 font-semibold">{n1.maker_modal || n1.maker}</p>
          )}
        </div>

        {/* Owner Info */}
        {(n1.owner_name || n2["Owner Name"]) && (
          <div className="rounded-xl bg-gradient-to-r from-neon-pink/15 to-neon-purple/10 border border-neon-pink/40 p-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neon-pink" />
              <span className="text-xs text-neon-pink/70 uppercase">Owner</span>
            </div>
            <p className="mt-1 font-semibold text-neon-pink">{n2["Owner Name"] || n1.owner_name}</p>
            {n2["Father's Name"] && (
              <p className="text-xs text-muted-foreground mt-1">{n2["Father's Name"]}</p>
            )}
          </div>
        )}

        {/* Grid Info Cards */}
        <div className="grid grid-cols-2 gap-2">
          {(n1.vh_class || n2["Vehicle Class"]) && (
            <div className="rounded-xl bg-gradient-to-br from-neon-orange/15 to-neon-yellow/10 border border-neon-orange/40 p-3">
              <div className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-neon-orange" />
                <span className="text-[10px] text-neon-orange/70 uppercase">Class</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-orange truncate">{n2["Vehicle Class"] || n1.vh_class}</p>
            </div>
          )}
          
          {n2["Fuel Type"] && (
            <div className="rounded-xl bg-gradient-to-br from-neon-green/15 to-neon-cyan/10 border border-neon-green/40 p-3">
              <div className="flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-[10px] text-neon-green/70 uppercase">Fuel</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-green">{n2["Fuel Type"]}</p>
            </div>
          )}

          {n2["City Name"] && (
            <div className="rounded-xl bg-gradient-to-br from-neon-purple/15 to-neon-pink/10 border border-neon-purple/40 p-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neon-purple" />
                <span className="text-[10px] text-neon-purple/70 uppercase">City</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-purple truncate">{n2["City Name"]}</p>
            </div>
          )}

          {(n1.regn_dt || n2["Registration Date"]) && (
            <div className="rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-green/10 border border-neon-cyan/40 p-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-[10px] text-neon-cyan/70 uppercase">Reg Date</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-cyan">{n2["Registration Date"] || n1.regn_dt}</p>
            </div>
          )}
        </div>

        {/* RTO & Address */}
        {n2["Registered RTO"] && (
          <div className="rounded-xl bg-muted/50 border border-border/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase">RTO Details</span>
            </div>
            <p className="text-sm text-foreground">{n2["Registered RTO"]}</p>
            {n2["Address"] && (
              <p className="text-xs text-muted-foreground mt-2">{n2["Address"]}</p>
            )}
          </div>
        )}

        {/* Insurance Details */}
        {(n1.insUpto || n2["Insurance Expiry"]) && (
          <div className="rounded-xl bg-gradient-to-r from-neon-red/10 to-neon-orange/5 border border-neon-red/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-neon-red" />
              <span className="text-xs text-neon-red/70 uppercase">Insurance</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valid Until:</span>
              <span className="text-neon-green font-medium">{n2["Insurance Expiry"] || n1.insUpto}</span>
            </div>
          </div>
        )}

        {/* Source */}
        {data.source_by && (
          <p className="text-xs text-center text-muted-foreground/60 pt-2">Source: {data.source_by}</p>
        )}
      </div>
    );
  };

  const renderPhoneResult = (data: PhoneResult) => {
    const info = data.data1 || data.data2 || {};
    
    return (
      <div className="space-y-3 animate-slide-up">
        {/* Header Card with Phone */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-green/20 via-neon-cyan/10 to-neon-green/5 border border-neon-green/50 p-4">
          <div className="absolute top-0 right-0 w-20 h-20 bg-neon-green/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neon-green/20 border border-neon-green/50">
              <Phone className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <p className="text-xs text-neon-green/70 uppercase tracking-wider">Mobile Number</p>
              <p className="text-xl font-display font-bold text-neon-green">{info.mobile || "N/A"}</p>
            </div>
          </div>
          {info.circle && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30">
              <Globe className="w-3 h-3 text-neon-cyan" />
              <span className="text-xs font-medium text-neon-cyan">{info.circle}</span>
            </div>
          )}
        </div>

        {/* Owner Info */}
        {info.name && (
          <div className="rounded-xl bg-gradient-to-r from-neon-pink/15 to-neon-purple/10 border border-neon-pink/40 p-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neon-pink" />
              <span className="text-xs text-neon-pink/70 uppercase">Name</span>
            </div>
            <p className="mt-1 font-semibold text-neon-pink text-lg">{info.name}</p>
            {info.father_name && (
              <p className="text-xs text-muted-foreground mt-1">Father: {info.father_name}</p>
            )}
          </div>
        )}

        {/* Address */}
        {info.address && (
          <div className="rounded-xl bg-gradient-to-r from-neon-orange/15 to-neon-yellow/10 border border-neon-orange/40 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-neon-orange" />
              <span className="text-xs text-neon-orange/70 uppercase">Address</span>
            </div>
            <p className="text-sm text-neon-orange">{info.address}</p>
          </div>
        )}

        {/* Grid Info Cards */}
        <div className="grid grid-cols-2 gap-2">
          {info.alt_mobile && (
            <div className="rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-green/10 border border-neon-cyan/40 p-3">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-[10px] text-neon-cyan/70 uppercase">Alt Mobile</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-cyan">{info.alt_mobile}</p>
            </div>
          )}
          
          {info.email && (
            <div className="rounded-xl bg-gradient-to-br from-neon-purple/15 to-neon-pink/10 border border-neon-purple/40 p-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neon-purple" />
                <span className="text-[10px] text-neon-purple/70 uppercase">Email</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-purple truncate">{info.email}</p>
            </div>
          )}

          {info.id_number && (
            <div className="rounded-xl bg-gradient-to-br from-neon-yellow/15 to-neon-orange/10 border border-neon-yellow/40 p-3">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-neon-yellow" />
                <span className="text-[10px] text-neon-yellow/70 uppercase">ID Number</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-yellow">{info.id_number}</p>
            </div>
          )}

          {info.id && (
            <div className="rounded-xl bg-gradient-to-br from-neon-red/15 to-neon-pink/10 border border-neon-red/40 p-3">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neon-red" />
                <span className="text-[10px] text-neon-red/70 uppercase">Record ID</span>
              </div>
              <p className="mt-1 text-xs font-medium text-neon-red truncate">{info.id}</p>
            </div>
          )}
        </div>

        {/* Source */}
        <p className="text-xs text-center text-muted-foreground/60 pt-2">Source: SHUBH OSINT</p>
      </div>
    );
  };

  const renderDefaultResult = () => (
    <div className="border border-neon-green/30 rounded-lg p-4 bg-muted/30 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-neon-green font-bold">RESULT</span>
        <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">
          {result.status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Query:</span>
          <span className="text-foreground">{result.query}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="text-foreground">{result.data.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location:</span>
          <span className="text-foreground">{result.data.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Provider:</span>
          <span className="text-neon-pink">{result.data.provider}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time:</span>
          <span className="text-foreground text-xs">{result.data.timestamp}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Main Card */}
      <div className="relative">
        <div className="relative rounded-2xl p-3 overflow-hidden border border-neon-green/30">
          
          {/* Button Grid - 3 columns */}
          <div className="relative grid grid-cols-3 gap-2">
            {enabledTabs.map((tab, index) => {
              const IconComponent = iconMap[tab.icon] || Sparkles;
              return (
                <div
                  key={tab.id}
                  className="animate-bounce-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <SearchButton
                    icon={IconComponent}
                    label={tab.label}
                    color={tab.color as any}
                    active={tab.label === activeTab}
                    onClick={() => handleTabClick(tab.label)}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Search Input - Shows when a non-camhack, non-darkdb, non-telegram tab is selected */}
          {activeTab && activeButton && activeButton.searchType !== "shubh" && activeButton.searchType !== "darkdb" && activeButton.searchType !== "telegram" && (
            <div className="relative mt-3 animate-slide-up">
              <div className="flex gap-2 p-1.5 rounded-xl bg-background/80 border-2 border-neon-cyan/40 shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeButton.placeholder}
                  className="flex-1 bg-transparent border-0 text-neon-green placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-xs font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-neon-cyan to-neon-green text-background font-bold px-4 h-9 hover:opacity-90 text-xs shadow-[0_0_10px_hsl(var(--neon-cyan)/0.5)] transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* ShubhCam - shows when camhack tab is active */}
      {activeButton?.searchType === "shubh" && <ShubhCam />}

      {/* DARK DB iframe - shows when darkdb tab is active */}
      {activeButton?.searchType === "darkdb" && (
        <div className="animate-slide-up">
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              borderWidth: `${settings.darkDbBorderWidth}px`,
              borderStyle: 'solid',
              borderColor: `hsl(var(--neon-${settings.darkDbBorderColor}))`,
              boxShadow: settings.darkDbBorderWidth !== "0" 
                ? `0 0 20px hsl(var(--neon-${settings.darkDbBorderColor}) / 0.3)` 
                : 'none'
            }}
          >
            <iframe
              src={settings.darkDbUrl}
              className="w-full bg-background"
              style={{ height: `${settings.darkDbHeight}vh` }}
              title="DARK DB"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Telegram OSINT Dashboard - shows when telegram tab is active */}
      {activeButton?.searchType === "telegram" && (
        <div className="animate-slide-up mt-4">
          <TelegramOSINT />
        </div>
      )}

      {/* Results Section */}
      {activeTab && activeButton && activeButton.searchType !== "shubh" && activeButton.searchType !== "darkdb" && activeButton.searchType !== "telegram" && (
        <div>
          {/* Loading */}
          {loading && (
            <div className="text-center py-8 border-2 border-neon-cyan/30 rounded-2xl bg-card/50 animate-pulse">
              <div className="relative inline-block">
                <Loader2 className="w-10 h-10 animate-spin text-neon-cyan" />
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-neon-cyan/20 animate-ping" />
              </div>
              <p className="text-muted-foreground mt-3 text-sm">Searching database...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-6 text-neon-red border-2 border-neon-red/30 rounded-2xl bg-card/50 animate-slide-up">
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && !error && (
            <div className="border-2 border-neon-green/50 rounded-2xl bg-card/80 p-4 animate-bounce-in shadow-[0_0_20px_hsl(var(--neon-green)/0.2)]">
              <h3 className="text-neon-yellow font-display font-bold text-base mb-4 text-center tracking-wider">
                {activeButton?.searchType === "vehicle" ? "🚗 VEHICLE INFO" : activeButton?.searchType === "phone" ? "📱 PHONE INFO" : "📊 RESULTS"}
              </h3>
              {activeButton?.searchType === "vehicle" 
                ? renderVehicleResult(result) 
                : (result?.type === "phone" ? renderPhoneResult(result.data) : renderDefaultResult())}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberDetailFinder;
