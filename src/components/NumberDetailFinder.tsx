import { useState } from "react";
import { Link } from "react-router-dom";
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
  LucideIcon,
  ArrowRight
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

interface AllSearchResult {
  [key: string]: any;
}

interface AadharResult {
  name?: string;
  gender?: string;
  dob?: string;
  address?: string;
  state?: string;
  district?: string;
  pincode?: string;
  aadhaar_number?: string;
  mobile?: string;
  email?: string;
  father_name?: string;
  [key: string]: any;
}

const NumberDetailFinder = () => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter out manual tab - it's on Page2 now
  const enabledTabs = settings.tabs.filter(tab => tab.enabled && tab.searchType !== "manual");
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

    // Aadhar search API (via edge function to avoid CORS)
    if (activeButton?.searchType === "aadhar") {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('aadhar-search', {
          body: { term: searchQuery.trim() }
        });
        
        if (fnError) throw fnError;
        
        if (data && Object.keys(data).length > 0 && !data.error) {
          setResult({ type: "aadhar", data });
          toast({
            title: "Aadhar Found",
            description: `Results found for: ${searchQuery}`,
          });
        } else {
          setError(data?.error || "No information found for this Aadhar number");
          toast({
            title: "Not Found",
            description: data?.error || "No information found",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Aadhar search error:", err);
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

    // All Search API (LeakOSINT)
    if (activeButton?.searchType === "allsearch") {
      try {
        const response = await fetch(`https://lek-steel.vercel.app/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await response.json();
        
        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
          setResult({ type: "allsearch", data });
          toast({
            title: "LeakOSINT Results",
            description: `Results found for: ${searchQuery}`,
          });
        } else {
          setError("No information found for this query");
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

  const renderAadharResult = (data: AadharResult) => {
    return (
      <div className="space-y-3 animate-slide-up">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-pink/20 via-neon-purple/10 to-neon-pink/5 border border-neon-pink/50 p-4">
          <div className="absolute top-0 right-0 w-20 h-20 bg-neon-pink/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neon-pink/20 border border-neon-pink/50">
              <CreditCard className="w-6 h-6 text-neon-pink" />
            </div>
            <div>
              <p className="text-xs text-neon-pink/70 uppercase tracking-wider">Aadhar Number</p>
              <p className="text-xl font-display font-bold text-neon-pink">{data.aadhaar_number || data.id_number || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Name Info */}
        {data.name && (
          <div className="rounded-xl bg-gradient-to-r from-neon-cyan/15 to-neon-green/10 border border-neon-cyan/40 p-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neon-cyan" />
              <span className="text-xs text-neon-cyan/70 uppercase">Name</span>
            </div>
            <p className="mt-1 font-semibold text-neon-cyan text-lg">{data.name}</p>
            {data.father_name && (
              <p className="text-xs text-muted-foreground mt-1">Father: {data.father_name}</p>
            )}
          </div>
        )}

        {/* Grid Info Cards */}
        <div className="grid grid-cols-2 gap-2">
          {data.gender && (
            <div className="rounded-xl bg-gradient-to-br from-neon-purple/15 to-neon-pink/10 border border-neon-purple/40 p-3">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neon-purple" />
                <span className="text-[10px] text-neon-purple/70 uppercase">Gender</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-purple">{data.gender}</p>
            </div>
          )}
          
          {data.dob && (
            <div className="rounded-xl bg-gradient-to-br from-neon-orange/15 to-neon-yellow/10 border border-neon-orange/40 p-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neon-orange" />
                <span className="text-[10px] text-neon-orange/70 uppercase">DOB</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-orange">{data.dob}</p>
            </div>
          )}

          {data.state && (
            <div className="rounded-xl bg-gradient-to-br from-neon-green/15 to-neon-cyan/10 border border-neon-green/40 p-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-[10px] text-neon-green/70 uppercase">State</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-green truncate">{data.state}</p>
            </div>
          )}

          {data.district && (
            <div className="rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-green/10 border border-neon-cyan/40 p-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-[10px] text-neon-cyan/70 uppercase">District</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-cyan truncate">{data.district}</p>
            </div>
          )}

          {data.pincode && (
            <div className="rounded-xl bg-gradient-to-br from-neon-yellow/15 to-neon-orange/10 border border-neon-yellow/40 p-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neon-yellow" />
                <span className="text-[10px] text-neon-yellow/70 uppercase">Pincode</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-yellow">{data.pincode}</p>
            </div>
          )}

          {data.mobile && (
            <div className="rounded-xl bg-gradient-to-br from-neon-red/15 to-neon-pink/10 border border-neon-red/40 p-3">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neon-red" />
                <span className="text-[10px] text-neon-red/70 uppercase">Mobile</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neon-red">{data.mobile}</p>
            </div>
          )}
        </div>

        {/* Address */}
        {data.address && (
          <div className="rounded-xl bg-gradient-to-r from-neon-orange/15 to-neon-yellow/10 border border-neon-orange/40 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-neon-orange" />
              <span className="text-xs text-neon-orange/70 uppercase">Address</span>
            </div>
            <p className="text-sm text-neon-orange">{data.address}</p>
          </div>
        )}

        {/* Email */}
        {data.email && (
          <div className="rounded-xl bg-muted/50 border border-border/50 p-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase">Email</span>
            </div>
            <p className="mt-1 text-sm text-foreground">{data.email}</p>
          </div>
        )}

        {/* Source */}
        <p className="text-xs text-center text-muted-foreground/60 pt-2">Source: SHUBH OSINT</p>
      </div>
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const renderNestedData = (obj: any, depth: number = 0): React.ReactNode => {
    if (typeof obj !== 'object' || obj === null) {
      return String(obj);
    }

    const colors = ['neon-cyan', 'neon-pink', 'neon-orange', 'neon-purple', 'neon-yellow', 'neon-green'];
    
    return Object.entries(obj).map(([key, value]) => {
      if (value === null || value === undefined || value === '') return null;
      
      const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const colorIndex = depth % colors.length;
      const color = colors[colorIndex];
      
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className={`mt-2 rounded-lg bg-gradient-to-r from-${color}/10 to-${color}/5 border border-${color}/30 p-3`}>
            <div className="flex items-center gap-2 mb-2">
              <Database className={`w-3.5 h-3.5 text-${color}`} />
              <span className={`text-xs text-${color} font-semibold uppercase`}>{displayKey}</span>
            </div>
            <div className="space-y-1 pl-2">
              {renderNestedData(value, depth + 1)}
            </div>
          </div>
        );
      }
      
      const displayValue = String(value);
      
      return (
        <div 
          key={key} 
          className="group flex items-start justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-neon-green/5 transition-colors cursor-pointer"
          onClick={() => copyToClipboard(displayValue, displayKey)}
        >
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide shrink-0">{displayKey}</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs text-neon-green font-mono text-right break-all">{displayValue}</span>
            <ClipboardPaste className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </div>
      );
    });
  };

  const renderAllSearchResult = (data: any) => {
    const results = Array.isArray(data) ? data : [data];
    
    const copyAllData = () => {
      const jsonStr = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(jsonStr);
      toast({
        title: "All Data Copied!",
        description: "Complete JSON data copied to clipboard",
      });
    };
    
    return (
      <div className="space-y-3 animate-slide-up">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-red/20 via-neon-orange/10 to-neon-red/5 border border-neon-red/50 p-4">
          <div className="absolute top-0 right-0 w-20 h-20 bg-neon-red/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-neon-red/20 border border-neon-red/50">
                <Search className="w-6 h-6 text-neon-red" />
              </div>
              <div>
                <p className="text-xs text-neon-red/70 uppercase tracking-wider">LeakOSINT Database</p>
                <p className="text-lg font-display font-bold text-neon-red">{results.length} Record(s) Found</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllData}
              className="border-neon-green/50 text-neon-green hover:bg-neon-green/20"
            >
              <ClipboardPaste className="w-4 h-4 mr-1" />
              Copy All
            </Button>
          </div>
        </div>

        {/* Results List */}
        {results.map((item: any, index: number) => (
          <div key={index} className="rounded-xl bg-gradient-to-br from-neon-cyan/10 via-background to-neon-green/5 border border-neon-cyan/40 overflow-hidden">
            {/* Record Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-neon-cyan/10 border-b border-neon-cyan/30">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm text-neon-cyan font-semibold uppercase tracking-wider">Record #{index + 1}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(item, null, 2), `Record #${index + 1}`)}
                className="h-7 text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
              </Button>
            </div>
            
            {/* Record Content */}
            <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
              {Object.entries(item).map(([key, value]) => {
                if (value === null || value === undefined || value === '') return null;
                
                const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                if (typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="mt-2 rounded-lg bg-gradient-to-r from-neon-pink/10 to-neon-purple/5 border border-neon-pink/30 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-neon-pink" />
                          <span className="text-xs text-neon-pink font-semibold uppercase">{displayKey}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(value, null, 2), displayKey)}
                          className="h-6 text-neon-pink/70 hover:text-neon-pink hover:bg-neon-pink/10"
                        >
                          <ClipboardPaste className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-1 pl-2 border-l-2 border-neon-pink/20">
                        {renderNestedData(value, 1)}
                      </div>
                    </div>
                  );
                }
                
                const displayValue = String(value);
                
                return (
                  <div 
                    key={key} 
                    className="group flex items-start justify-between gap-3 py-2 px-3 rounded-lg hover:bg-neon-green/10 transition-colors cursor-pointer border border-transparent hover:border-neon-green/20"
                    onClick={() => copyToClipboard(displayValue, displayKey)}
                  >
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide shrink-0 min-w-[80px]">{displayKey}</span>
                    <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                      <span className="text-xs text-neon-green font-mono text-right break-all">{displayValue}</span>
                      <ClipboardPaste className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground/60 pt-2">Click any field to copy • Source: LeakOSINT</p>
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
            
            {/* Next Page Button */}
            <Link
              to="/page2"
              className="animate-bounce-in flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-neon-yellow/50 bg-gradient-to-br from-neon-yellow/10 to-neon-orange/5 hover:from-neon-yellow/20 hover:to-neon-orange/10 transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--neon-yellow)/0.4)] group"
              style={{ animationDelay: `${enabledTabs.length * 40}ms` }}
            >
              <ArrowRight className="w-5 h-5 text-neon-yellow group-hover:translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold text-neon-yellow uppercase tracking-wider">Next Page</span>
            </Link>
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
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-3 py-2">
            <Database className="w-4 h-4 text-neon-purple animate-pulse" />
            <span className="text-xs font-bold tracking-[0.15em] text-neon-purple uppercase">
              Secure OSINT Database
            </span>
            <Shield className="w-4 h-4 text-neon-green" />
          </div>
          
          {/* Security Notice */}
          <div className="mb-3 px-3 py-2 rounded-xl bg-neon-green/5 border border-neon-green/20 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-neon-green flex-shrink-0" />
            <p className="text-[10px] text-neon-green/80">
              Search enabled • Redirects blocked • Safe browsing mode
            </p>
          </div>
          
          {/* Iframe Container */}
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
              style={{ height: `${settings.darkDbHeight}vh`, minHeight: '500px' }}
              title="DARK DB - Secure OSINT"
              sandbox="allow-scripts allow-forms allow-same-origin"
              referrerPolicy="no-referrer"
            />
            
            {/* Bottom overlay to block footer contact links */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-auto flex items-end justify-center pb-2">
              <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                <Shield className="w-3 h-3" /> External links disabled for security
              </span>
            </div>
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

          {result && !loading && !error && (
            <div className="border-2 border-neon-green/50 rounded-2xl bg-card/80 p-4 animate-bounce-in shadow-[0_0_20px_hsl(var(--neon-green)/0.2)]">
              <h3 className="text-neon-yellow font-display font-bold text-base mb-4 text-center tracking-wider">
                {activeButton?.searchType === "vehicle" ? "🚗 VEHICLE INFO" : activeButton?.searchType === "phone" ? "📱 PHONE INFO" : activeButton?.searchType === "aadhar" ? "🪪 AADHAR INFO" : activeButton?.searchType === "allsearch" ? "🔍 LEAKOSINT" : "📊 RESULTS"}
              </h3>
              {activeButton?.searchType === "vehicle" 
                ? renderVehicleResult(result) 
                : activeButton?.searchType === "aadhar"
                ? renderAadharResult(result.data)
                : activeButton?.searchType === "allsearch"
                ? renderAllSearchResult(result.data)
                : (result?.type === "phone" ? renderPhoneResult(result.data) : renderDefaultResult())}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberDetailFinder;
