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
  ExternalLink
} from "lucide-react";
import SearchButton from "./SearchButton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import ShubhCam from "./ShubhCam";
import SearchModal from "./SearchModal";

const NumberDetailFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showShubhCam, setShowShubhCam] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a number",
        description: "Please enter a phone number, Aadhar, or vehicle number to search",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Searching...",
      description: `Looking up: ${searchQuery}`,
    });
  };

  const handleButtonClick = (label: string) => {
    if (label === "SHUBH") {
      setShowShubhCam(!showShubhCam);
    } else {
      setActiveModal(label);
    }
  };

  const buttons = [
    { icon: Phone, label: "Phone Search", color: "green" as const, placeholder: "Enter phone number...", colorHex: "#00ff00" },
    { icon: CreditCard, label: "Aadhar Search", color: "purple" as const, placeholder: "Enter Aadhar number...", colorHex: "#a855f7" },
    { icon: Car, label: "Vehicle CH", color: "orange" as const, placeholder: "Enter vehicle number...", colorHex: "#ff9500" },
    { icon: Camera, label: "Insta Search", color: "cyan" as const, placeholder: "Enter Instagram username...", colorHex: "#00ffff" },
    { icon: Users, label: "Family Info", color: "pink" as const, placeholder: "Enter name or number...", colorHex: "#ff00aa" },
    { icon: ClipboardPaste, label: "Manual Paste", color: "purple" as const, placeholder: "Paste any data...", colorHex: "#a855f7" },
    { icon: Sparkles, label: "SHUBH", color: "purple" as const, placeholder: "", colorHex: "#a855f7" },
    { icon: Code, label: "Dark Phishing", color: "red" as const, placeholder: "Enter target URL...", colorHex: "#ff0000" },
    { icon: Globe, label: "Webcam 360", color: "green" as const, placeholder: "Enter IP or location...", colorHex: "#00ff00" },
  ];

  const activeButton = buttons.find(b => b.label === activeModal);

  return (
    <>
      <div className="relative border-2 border-neon-green rounded-lg p-6 bg-card/30 backdrop-blur glow-green">
        {/* External link icon */}
        <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-muted-foreground" />
        
        {/* Header */}
        <h2 className="text-neon-green font-display font-bold text-lg tracking-wide mb-1">
          NUMBER DETAIL FINDER
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          SEARCH BY PHONE, AADHAR, VEHICLE, INSTAGRAM, FAMILY INFO
        </p>
        
        {/* Button Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {buttons.map((btn) => (
            <SearchButton
              key={btn.label}
              icon={btn.icon}
              label={btn.label}
              color={btn.color}
              active={btn.label === "SHUBH" ? showShubhCam : false}
              onClick={() => handleButtonClick(btn.label)}
            />
          ))}
        </div>
        
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green">&gt;&gt;&gt;</span>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="NUMBER..."
              className="pl-12 bg-input border-neon-green/50 text-neon-green placeholder:text-neon-green/50 focus:border-neon-green"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-neon-green to-neon-pink text-background font-bold px-6 hover:opacity-90"
          >
            <Search className="w-4 h-4 mr-2" />
            SEARCH
          </Button>
        </div>
        
        {/* Warning */}
        <p className="text-neon-orange text-xs mt-4 tracking-wide">
          [WARNING] API FIREWALL ACTIVE - AUTO TRACE MAY FAIL
        </p>
      </div>
      
      {/* ShubhCam - shows when SHUBH tab is active */}
      {showShubhCam && <ShubhCam />}

      {/* Search Modal */}
      {activeModal && activeButton && (
        <SearchModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={activeButton.label}
          placeholder={activeButton.placeholder}
          color={activeButton.colorHex}
        />
      )}
    </>
  );
};

export default NumberDetailFinder;
