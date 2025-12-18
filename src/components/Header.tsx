import { Wifi, Settings, ClipboardPaste } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const colorClasses: Record<string, { text: string; glow: string }> = {
  green: { text: "text-neon-green", glow: "text-glow-green" },
  pink: { text: "text-neon-pink", glow: "text-glow-pink" },
  orange: { text: "text-neon-orange", glow: "" },
  cyan: { text: "text-neon-cyan", glow: "text-glow-cyan" },
  red: { text: "text-neon-red", glow: "" },
  purple: { text: "text-neon-purple", glow: "text-glow-purple" },
  yellow: { text: "text-neon-yellow", glow: "" },
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
      {/* Status indicators */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-neon-green">
          <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-neon-cyan">
          <Wifi className="w-2.5 h-2.5" />
          <span>SECURE</span>
        </div>
      </div>

      {/* Page2 & Admin Links */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <Link 
          to="/page2" 
          className="p-2 rounded-lg border border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow/10 transition-all hover:shadow-[0_0_10px_hsl(var(--neon-yellow)/0.5)]"
        >
          <ClipboardPaste className="w-4 h-4" />
        </Link>
        <Link 
          to="/admin" 
          className="p-2 rounded-lg border border-neon-orange/50 text-neon-orange hover:bg-neon-orange/10 transition-all hover:shadow-[0_0_10px_hsl(var(--neon-orange)/0.5)]"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
      
      {/* Logo */}
      <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-neon-${settings.headerColor1} mb-3 overflow-hidden`}>
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
      
      {/* Title */}
      <h1 
        className={`text-3xl md:text-4xl font-black tracking-wider ${getStyleClasses()}`}
        style={{ fontFamily: settings.headerFont }}
      >
        <span className={`${color1.text} ${color1.glow}`}>{settings.headerName1}</span>
        <span className={`${color2.text} ${color2.glow} ml-2`}>{settings.headerName2}</span>
      </h1>
    </header>
  );
};

export default Header;
