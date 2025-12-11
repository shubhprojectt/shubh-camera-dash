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
  Search,
  Terminal,
  AlertTriangle,
  Loader2,
  User,
  Calendar,
  MapPin,
  Fuel,
  Settings,
  FileText,
  Shield
} from "lucide-react";
import SearchButton from "./SearchButton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import ShubhCam from "./ShubhCam";

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

const NumberDetailFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const buttons = [
    { icon: Phone, label: "Phone Search", color: "green" as const, placeholder: "Enter phone number...", colorHex: "#00ff00", searchType: "phone" },
    { icon: CreditCard, label: "Aadhar Search", color: "purple" as const, placeholder: "Enter Aadhar number...", colorHex: "#a855f7", searchType: "aadhar" },
    { icon: Car, label: "Vehicle CH", color: "orange" as const, placeholder: "Enter RC number (e.g., UP32AB1234)...", colorHex: "#ff9500", searchType: "vehicle" },
    { icon: Camera, label: "Insta Search", color: "cyan" as const, placeholder: "Enter Instagram username...", colorHex: "#00ffff", searchType: "instagram" },
    { icon: Users, label: "Family Info", color: "pink" as const, placeholder: "Enter name or number...", colorHex: "#ff00aa", searchType: "family" },
    { icon: ClipboardPaste, label: "Manual Paste", color: "purple" as const, placeholder: "Paste any data...", colorHex: "#a855f7", searchType: "manual" },
    { icon: Sparkles, label: "SHUBH", color: "purple" as const, placeholder: "", colorHex: "#a855f7", searchType: "shubh" },
    { icon: Code, label: "Dark Phishing", color: "red" as const, placeholder: "Enter target URL...", colorHex: "#ff0000", searchType: "phishing" },
    { icon: Globe, label: "Webcam 360", color: "green" as const, placeholder: "Enter IP or location...", colorHex: "#00ff00", searchType: "webcam" },
  ];

  const activeButton = buttons.find(b => b.label === activeTab);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    if (activeButton?.searchType === "vehicle") {
      try {
        const response = await fetch(`https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
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
        setError("Failed to fetch vehicle data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch vehicle data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Default demo behavior for other search types
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
      <div className="space-y-3 animate-in fade-in duration-300">
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

  const renderDefaultResult = () => (
    <div className="border border-neon-green/30 rounded-lg p-4 bg-muted/30 animate-in fade-in duration-300">
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
    <>
      <div className="relative border border-neon-green/50 rounded-xl p-3 bg-black/90 backdrop-blur-md overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-5" />
        
        {/* Header with terminal style */}
        <div className="relative flex items-center gap-2 mb-2">
          <Terminal className="w-3 h-3 text-neon-green" />
          <h2 className="text-neon-green font-display font-bold text-sm tracking-wider text-glow-green">
            NUMBER DETAIL FINDER
          </h2>
        </div>
        
        {/* Button Grid - More compact */}
        <div className="relative grid grid-cols-3 gap-1.5 mb-3">
          {buttons.map((btn) => (
            <SearchButton
              key={btn.label}
              icon={btn.icon}
              label={btn.label}
              color={btn.color}
              active={btn.label === activeTab}
              onClick={() => handleTabClick(btn.label)}
            />
          ))}
        </div>
        
        {/* Search Input - Shows when a non-SHUBH tab is selected */}
        {activeTab && activeTab !== "SHUBH" && activeButton && (
          <div className="relative flex gap-1.5 bg-black/50 rounded-lg border border-neon-green/30 p-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeButton.placeholder}
              className="flex-1 bg-transparent border-0 text-neon-green placeholder:text-neon-green/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-xs font-mono uppercase"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-neon-green text-background font-bold px-3 h-8 hover:bg-neon-green/80 text-[10px]"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "SEARCH"}
            </Button>
          </div>
        )}
      </div>
      
      {/* ShubhCam - shows when SHUBH tab is active */}
      {activeTab === "SHUBH" && <ShubhCam />}

      {/* Results Section - Shows below the main card */}
      {activeTab && activeTab !== "SHUBH" && (
        <div className="mt-4">
          {/* Loading */}
          {loading && (
            <div className="text-center py-8 border-2 border-neon-cyan/30 rounded-2xl bg-card/50">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-cyan mb-2" />
              <p className="text-muted-foreground">Searching database...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-6 text-neon-red border-2 border-neon-red/30 rounded-2xl bg-card/50">
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && !error && (
            <div className="border-2 border-neon-green/50 rounded-2xl bg-card/80 p-4">
              <h3 className="text-neon-yellow font-display font-bold text-lg mb-4 text-center">
                {activeButton?.searchType === "vehicle" ? "VEHICLE INFORMATION" : "SEARCH RESULTS"}
              </h3>
              {activeButton?.searchType === "vehicle" ? renderVehicleResult(result) : renderDefaultResult()}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NumberDetailFinder;
