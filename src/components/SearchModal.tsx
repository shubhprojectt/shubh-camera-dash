import { useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  color: string;
}

const SearchModal = ({ isOpen, onClose, title, placeholder, color }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

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

    // Simulate API call
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md border-2 border-neon-green rounded-lg bg-card p-6 glow-green animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className={`font-display font-bold text-xl mb-4`} style={{ color }}>
          {title}
        </h3>

        {/* Search input */}
        <div className="flex gap-2 mb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="bg-input border-neon-green/50 text-neon-green"
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

        {/* Results */}
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-green mb-2" />
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {result && !loading && (
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
        )}

        <p className="text-neon-orange text-xs mt-4 text-center">
          ⚠ Demo Mode - Connect API for real results
        </p>
      </div>
    </div>
  );
};

export default SearchModal;
