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
  AlertTriangle
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

  const activeButton = buttons.find(b => b.label === activeModal);

  return (
    <>
      <div className="relative border-2 border-neon-green rounded-3xl p-4 bg-gradient-to-br from-neon-cyan/20 via-neon-green/10 to-neon-purple/20 backdrop-blur-md neon-border overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-green rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-pink rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-cyan rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-purple rounded-br-2xl" />
        
        {/* Header with terminal style */}
        <div className="relative flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-neon-green" />
          <h2 className="text-neon-green font-display font-black text-lg tracking-wider text-glow-green">
            NUMBER DETAIL FINDER
          </h2>
        </div>
        
        <p className="relative text-muted-foreground text-xs mb-4 pl-6 border-l-2 border-neon-green/30 ml-1">
          SEARCH BY PHONE, AADHAR, VEHICLE, INSTAGRAM, FAMILY INFO
        </p>
        
        {/* Button Grid - Compact for mobile */}
        <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 mb-4">
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
        
        {/* Search Input - Compact */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-green via-neon-pink to-neon-cyan rounded-2xl blur opacity-25 animate-gradient-shift" />
          <div className="relative flex gap-2 p-1 bg-background/80 rounded-2xl border border-neon-green/30">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green font-mono text-xs">&gt;&gt;</span>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ENTER TARGET..."
                className="pl-10 bg-transparent border-0 text-neon-green placeholder:text-neon-green/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm font-mono rounded-xl"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink text-background font-black px-4 h-10 hover:opacity-90 transition-all hover:scale-105 animate-gradient-shift rounded-xl text-xs"
            >
              <Search className="w-4 h-4 mr-1" />
              EXECUTE
            </Button>
          </div>
        </div>
        
        {/* Warning - Compact */}
        <div className="relative flex items-center gap-2 mt-4 p-2 border border-neon-orange/30 bg-neon-orange/5 rounded-xl">
          <AlertTriangle className="w-3 h-3 text-neon-orange animate-pulse flex-shrink-0" />
          <p className="text-neon-orange text-[10px] tracking-wide font-mono">
            [WARNING] API FIREWALL ACTIVE
          </p>
        </div>
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
          searchType={activeButton.searchType}
        />
      )}
    </>
  );
};

export default NumberDetailFinder;