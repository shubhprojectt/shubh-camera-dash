import { useState } from "react";
import { X, Search, Loader2, Car, User, Calendar, MapPin, Fuel, Settings, FileText, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  color: string;
  searchType?: string;
}

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

const SearchModal = ({ isOpen, onClose, title, placeholder, color, searchType }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query.trim()) {
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

    if (searchType === "vehicle") {
      try {
        const response = await fetch(`https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=${encodeURIComponent(query.trim().toUpperCase())}`);
        const data = await response.json();
        
        if (data && !data.error) {
          setResult(data);
          toast({
            title: "Vehicle Found",
            description: `Results found for: ${query.toUpperCase()}`,
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
          query: query,
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
          description: `Results found for: ${query}`,
        });
      }, 1500);
    }
  };

  const renderVehicleResult = (data: VehicleResult) => {
    const n1 = data.result?.Nexus1 || {};
    const n2 = data.result?.Nexus2 || {};
    
    return (
      <div className="space-y-3 animate-in fade-in duration-300 max-h-[60vh] overflow-y-auto pr-1">
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
    <div className="border border-neon-green/30 rounded-lg p-4 bg-muted/30">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto border-2 border-neon-green rounded-2xl bg-card p-5 glow-green animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="font-display font-bold text-xl mb-4" style={{ color }}>
          {title}
        </h3>

        {/* Search input */}
        <div className="flex gap-2 mb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="bg-input border-neon-green/50 text-neon-green uppercase"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-neon-green text-background hover:bg-neon-green/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-cyan mb-2" />
            <p className="text-muted-foreground">Searching database...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-6 text-neon-red">
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && !error && (
          searchType === "vehicle" ? renderVehicleResult(result) : renderDefaultResult()
        )}

        {!result && !loading && !error && (
          <p className="text-neon-orange text-xs mt-4 text-center">
            {searchType === "vehicle" 
              ? "🚗 Enter vehicle RC number (e.g., UP32AB1234)" 
              : "⚠ Demo Mode - Connect API for real results"}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
