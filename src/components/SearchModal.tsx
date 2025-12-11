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

interface VehicleData {
  owner_name?: string;
  rc_number?: string;
  vehicle_class?: string;
  fuel_type?: string;
  maker_model?: string;
  registration_date?: string;
  rto?: string;
  state?: string;
  fitness_upto?: string;
  insurance_upto?: string;
  pucc_upto?: string;
  chassis_number?: string;
  engine_number?: string;
  [key: string]: string | undefined;
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

  const renderVehicleResult = (data: VehicleData) => (
    <div className="space-y-3 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-neon-green/10 to-neon-cyan/5 border border-neon-cyan/50 p-4">
        <div className="absolute top-0 right-0 w-20 h-20 bg-neon-cyan/10 rounded-full blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50">
            <Car className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <p className="text-xs text-neon-cyan/70 uppercase tracking-wider">RC Number</p>
            <p className="text-xl font-display font-bold text-neon-cyan">{data.rc_number || query.toUpperCase()}</p>
          </div>
        </div>
        {data.maker_model && (
          <p className="mt-2 text-sm text-foreground/80">{data.maker_model}</p>
        )}
      </div>

      {/* Owner Info */}
      {data.owner_name && (
        <div className="rounded-xl bg-gradient-to-r from-neon-pink/15 to-neon-purple/10 border border-neon-pink/40 p-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-neon-pink" />
            <span className="text-xs text-neon-pink/70 uppercase">Owner</span>
          </div>
          <p className="mt-1 font-semibold text-neon-pink">{data.owner_name}</p>
        </div>
      )}

      {/* Grid Info Cards */}
      <div className="grid grid-cols-2 gap-2">
        {data.vehicle_class && (
          <div className="rounded-xl bg-gradient-to-br from-neon-orange/15 to-neon-yellow/10 border border-neon-orange/40 p-3">
            <div className="flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-neon-orange" />
              <span className="text-[10px] text-neon-orange/70 uppercase">Class</span>
            </div>
            <p className="mt-1 text-sm font-medium text-neon-orange truncate">{data.vehicle_class}</p>
          </div>
        )}
        
        {data.fuel_type && (
          <div className="rounded-xl bg-gradient-to-br from-neon-green/15 to-neon-cyan/10 border border-neon-green/40 p-3">
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-[10px] text-neon-green/70 uppercase">Fuel</span>
            </div>
            <p className="mt-1 text-sm font-medium text-neon-green">{data.fuel_type}</p>
          </div>
        )}

        {data.state && (
          <div className="rounded-xl bg-gradient-to-br from-neon-purple/15 to-neon-pink/10 border border-neon-purple/40 p-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neon-purple" />
              <span className="text-[10px] text-neon-purple/70 uppercase">State</span>
            </div>
            <p className="mt-1 text-sm font-medium text-neon-purple truncate">{data.state}</p>
          </div>
        )}

        {data.registration_date && (
          <div className="rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-green/10 border border-neon-cyan/40 p-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] text-neon-cyan/70 uppercase">Reg Date</span>
            </div>
            <p className="mt-1 text-sm font-medium text-neon-cyan">{data.registration_date}</p>
          </div>
        )}
      </div>

      {/* Additional Details */}
      {(data.rto || data.fitness_upto || data.insurance_upto) && (
        <div className="rounded-xl bg-muted/50 border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase">Additional Details</span>
          </div>
          
          {data.rto && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">RTO:</span>
              <span className="text-foreground">{data.rto}</span>
            </div>
          )}
          {data.fitness_upto && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fitness Valid:</span>
              <span className="text-neon-green">{data.fitness_upto}</span>
            </div>
          )}
          {data.insurance_upto && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Insurance Valid:</span>
              <span className="text-neon-green">{data.insurance_upto}</span>
            </div>
          )}
          {data.pucc_upto && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">PUCC Valid:</span>
              <span className="text-neon-green">{data.pucc_upto}</span>
            </div>
          )}
        </div>
      )}

      {/* Security Details */}
      {(data.chassis_number || data.engine_number) && (
        <div className="rounded-xl bg-gradient-to-r from-neon-red/10 to-neon-orange/5 border border-neon-red/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-neon-red" />
            <span className="text-xs text-neon-red/70 uppercase">Security Info</span>
          </div>
          {data.chassis_number && (
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Chassis:</span>
              <span className="text-foreground font-mono">{data.chassis_number}</span>
            </div>
          )}
          {data.engine_number && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Engine:</span>
              <span className="text-foreground font-mono">{data.engine_number}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

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
