import { Wifi, Settings, Shield, Activity, Signal } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const colorClasses: Record<string, { text: string; glow: string; border: string }> = {
  green: { text: "text-neon-green", glow: "text-glow-green", border: "border-neon-green" },
  pink: { text: "text-neon-pink", glow: "text-glow-pink", border: "border-neon-pink" },
  orange: { text: "text-neon-orange", glow: "", border: "border-neon-orange" },
  cyan: { text: "text-neon-cyan", glow: "text-glow-cyan", border: "border-neon-cyan" },
  red: { text: "text-neon-red", glow: "", border: "border-neon-red" },
  purple: { text: "text-neon-purple", glow: "text-glow-purple", border: "border-neon-purple" },
  yellow: { text: "text-neon-yellow", glow: "", border: "border-neon-yellow" },
};

const Header = () => {
  const { settings } = useSettings();
  
  // Get dynamic icon
  const IconComponent = (Icons[settings.headerIcon as keyof typeof Icons] as LucideIcon) || Icons.Zap;

  const getStyleClasses = () => {
    switch (settings.headerStyle) {
      case "uppercase": return "uppercase";
      case "lowercase": return "lowercase";
      case "capitalize": return "capitalize";
      case "italic": return "italic";
      case "bold": return "font-black";
      case "glow": return "animate-pulse-glow";
      case "flicker": return "animate-neon-flicker";
      default: return "";
    }
  };

  const color1 = colorClasses[settings.headerColor1] || colorClasses.green;
  const color2 = colorClasses[settings.headerColor2] || colorClasses.pink;

  return (
    <header className="relative py-3 text-center">
      {/* Animated top bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60" />
      
      {/* Left side - Status indicators & Credit Display */}
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
          <span className="text-[8px] font-bold text-neon-green">LIVE</span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 backdrop-blur-sm">
          <Shield className="w-2 h-2 text-neon-cyan" />
          <span className="text-[8px] font-bold text-neon-cyan">SECURE</span>
        </div>
        <CreditDisplay />
      </div>

      {/* Right side - Admin Link */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <Link 
          to="/admin" 
          className="p-1.5 rounded-lg border border-neon-orange/50 text-neon-orange bg-neon-orange/10 hover:bg-neon-orange/20 transition-all duration-200 hover:shadow-[0_0_15px_hsl(var(--neon-orange)/0.5)] backdrop-blur-sm"
        >
          <Settings className="w-3.5 h-3.5" />
        </Link>
      </div>
      
      {/* Compact Logo Container */}
      <div className="relative inline-block mb-2">
        {/* Main logo container */}
        <div className={`relative w-14 h-14 rounded-full border-2 ${color1.border} bg-background/80 backdrop-blur-sm overflow-hidden flex items-center justify-center neon-border-animated`}>
          {settings.headerCustomLogo ? (
            <img 
              src={settings.headerCustomLogo} 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent className={`w-7 h-7 ${color1.text} animate-neon-flicker`} />
          )}
        </div>
      </div>
      
      {/* Compact Title */}
      <div className="relative">
        <h1 
          className={`text-2xl md:text-3xl font-black tracking-wider ${getStyleClasses()}`}
          style={{ fontFamily: settings.headerFont }}
        >
          <span className={`${color1.text} ${color1.glow}`}>{settings.headerName1}</span>
          <span className={`${color2.text} ${color2.glow} ml-2`}>{settings.headerName2}</span>
        </h1>
        
        {/* Tagline */}
        <p className="mt-1 text-[9px] text-muted-foreground tracking-[0.2em] uppercase font-mono">
          Intelligence • Search • Security
        </p>
      </div>
      
      {/* Compact decorative line */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-neon-green" />
        <div className="w-1.5 h-1.5 rotate-45 border border-neon-cyan bg-neon-cyan/20" />
        <div className="w-16 h-px bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-cyan" />
        <div className="w-1.5 h-1.5 rotate-45 border border-neon-cyan bg-neon-cyan/20" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-neon-pink" />
      </div>
    </header>
  );
};

export default Header;
