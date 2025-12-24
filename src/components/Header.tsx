import { Shield, Activity, Radio } from "lucide-react";
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
    <header className="relative py-4 text-center">
      {/* Premium animated top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-70" />
      
      {/* Left side - Status indicators & Credit Display */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-card border border-neon-green/40 backdrop-blur-md">
            <div className="relative">
              <div className="w-2 h-2 bg-neon-green rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-neon-green rounded-full animate-ping opacity-60" />
            </div>
            <span className="text-[9px] font-bold text-neon-green tracking-wide">LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-card border border-neon-cyan/40 backdrop-blur-md">
            <Shield className="w-2.5 h-2.5 text-neon-cyan" />
            <span className="text-[9px] font-bold text-neon-cyan tracking-wide">SECURE</span>
          </div>
        </div>
        <CreditDisplay />
      </div>

      
      {/* Premium Logo Container */}
      <div className="relative inline-block mb-3">
        {/* Outer glow ring */}
        <div className="absolute -inset-2 bg-gradient-to-br from-neon-purple/30 via-neon-cyan/20 to-neon-pink/30 rounded-full blur-xl animate-glow-breathe" />
        
        {/* Main logo container */}
        <div className={`relative w-16 h-16 rounded-full border-2 ${color1.border} bg-background/90 backdrop-blur-md overflow-hidden flex items-center justify-center neon-border-animated`}>
          {settings.headerCustomLogo ? (
            <img 
              src={settings.headerCustomLogo} 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent className={`w-8 h-8 ${color1.text} animate-neon-flicker`} />
          )}
        </div>
      </div>
      
      {/* Premium Title */}
      <div className="relative">
        <h1 
          className={`text-2xl md:text-4xl font-black tracking-wider ${getStyleClasses()}`}
          style={{ fontFamily: settings.headerFont }}
        >
          <span className={`${color1.text} ${color1.glow}`}>{settings.headerName1}</span>
          <span className={`${color2.text} ${color2.glow} ml-2`}>{settings.headerName2}</span>
        </h1>
        
        {/* Premium Tagline */}
        <p className="mt-2 text-[10px] text-muted-foreground tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2">
          <span className="w-4 h-[1px] bg-gradient-to-r from-transparent to-neon-green" />
          Intelligence • Search • Security
          <span className="w-4 h-[1px] bg-gradient-to-l from-transparent to-neon-pink" />
        </p>
      </div>
      
      {/* Premium decorative line */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-neon-green" />
        <div className="w-2 h-2 rotate-45 border-2 border-neon-cyan bg-neon-cyan/20 animate-pulse" />
        <div className="w-20 h-[1px] bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-cyan" />
        <div className="w-2 h-2 rotate-45 border-2 border-neon-cyan bg-neon-cyan/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-neon-pink" />
      </div>
    </header>
  );
};

export default Header;
