import { Wifi, Settings, Shield, Activity, Signal } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
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
    <header className="relative py-6 text-center">
      {/* Animated top bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60" />
      
      {/* Enhanced Status indicators */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 backdrop-blur-sm">
          <div className="relative">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-neon-green rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-[10px] font-bold text-neon-green tracking-wider">ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 backdrop-blur-sm">
          <Shield className="w-2.5 h-2.5 text-neon-cyan" />
          <span className="text-[10px] font-bold text-neon-cyan tracking-wider">SECURE</span>
        </div>
      </div>

      {/* Right side status */}
      <div className="absolute top-3 right-14 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 backdrop-blur-sm">
          <Signal className="w-2.5 h-2.5 text-neon-purple animate-pulse" />
          <span className="text-[10px] font-bold text-neon-purple tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Admin Link - Enhanced */}
      <Link 
        to="/admin" 
        className="absolute top-3 right-3 p-2.5 rounded-xl border border-neon-orange/50 text-neon-orange bg-neon-orange/10 hover:bg-neon-orange/20 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--neon-orange)/0.5)] hover:scale-105 backdrop-blur-sm"
      >
        <Settings className="w-4 h-4" />
      </Link>
      
      {/* Enhanced Logo Container */}
      <div className="relative inline-block mb-4">
        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-neon-${settings.headerColor1} to-neon-${settings.headerColor2} opacity-30 blur-xl animate-pulse`} 
          style={{ transform: 'scale(1.5)' }} 
        />
        
        {/* Rotating border */}
        <div className="absolute inset-[-4px] rounded-full neon-border-animated" />
        
        {/* Main logo container */}
        <div className={`relative w-20 h-20 rounded-full border-2 ${color1.border} bg-background/80 backdrop-blur-sm overflow-hidden flex items-center justify-center`}>
          {settings.headerCustomLogo ? (
            <img 
              src={settings.headerCustomLogo} 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent className={`w-10 h-10 ${color1.text} animate-neon-flicker`} />
          )}
        </div>
        
        {/* Activity indicator */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 border border-neon-cyan/50 backdrop-blur-sm">
          <Activity className="w-2.5 h-2.5 text-neon-cyan animate-pulse" />
          <span className="text-[8px] font-bold text-neon-cyan">ACTIVE</span>
        </div>
      </div>
      
      {/* Enhanced Title */}
      <div className="relative">
        <h1 
          className={`text-4xl md:text-5xl font-black tracking-wider ${getStyleClasses()}`}
          style={{ fontFamily: settings.headerFont }}
        >
          <span className={`${color1.text} ${color1.glow} relative`}>
            {settings.headerName1}
            <span className="absolute -inset-1 bg-current opacity-20 blur-lg" />
          </span>
          <span className={`${color2.text} ${color2.glow} ml-3 relative`}>
            {settings.headerName2}
            <span className="absolute -inset-1 bg-current opacity-20 blur-lg" />
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="mt-2 text-xs text-muted-foreground tracking-[0.3em] uppercase font-mono">
          Intelligence • Search • Security
        </p>
      </div>
      
      {/* Bottom decorative line */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-neon-green" />
        <div className="w-2 h-2 rotate-45 border border-neon-cyan bg-neon-cyan/20" />
        <div className="w-24 h-px bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-cyan" />
        <div className="w-2 h-2 rotate-45 border border-neon-cyan bg-neon-cyan/20" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-neon-pink" />
      </div>
    </header>
  );
};

export default Header;
