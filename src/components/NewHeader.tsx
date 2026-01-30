import { Shield, Zap, Wifi } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import AdminSettings from "./AdminSettings";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

// Map color names to CSS custom property values
const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    green: "text-neon-green",
    pink: "text-neon-pink",
    orange: "text-neon-orange",
    cyan: "text-neon-cyan",
    red: "text-neon-red",
    purple: "text-neon-purple",
    yellow: "text-neon-yellow",
    blue: "text-neon-blue",
  };
  return colorMap[color] || colorMap.green;
};

const getBorderClass = (color: string) => {
  const colorMap: Record<string, string> = {
    green: "border-neon-green",
    pink: "border-neon-pink",
    orange: "border-neon-orange",
    cyan: "border-neon-cyan",
    red: "border-neon-red",
    purple: "border-neon-purple",
    yellow: "border-neon-yellow",
    blue: "border-neon-blue",
  };
  return colorMap[color] || colorMap.green;
};

const getBgClass = (color: string) => {
  const colorMap: Record<string, string> = {
    green: "bg-neon-green",
    pink: "bg-neon-pink",
    orange: "bg-neon-orange",
    cyan: "bg-neon-cyan",
    red: "bg-neon-red",
    purple: "bg-neon-purple",
    yellow: "bg-neon-yellow",
    blue: "bg-neon-blue",
  };
  return colorMap[color] || colorMap.green;
};

const NewHeader = () => {
  const { settings } = useSettings();
  
  const color1 = settings.headerColor1 || "green";
  const color2 = settings.headerColor2 || "pink";
  
  const IconComponent = (Icons[settings.headerIcon as keyof typeof Icons] as LucideIcon) || Icons.Zap;

  const getStyleClasses = () => {
    switch (settings.headerStyle) {
      // Basic transforms
      case "uppercase": return "uppercase";
      case "lowercase": return "lowercase";
      case "capitalize": return "capitalize";
      // Weight
      case "italic": return "italic";
      case "bold": return "font-black";
      case "light": return "font-light";
      case "thin": return "font-thin";
      // Spacing
      case "wide": return "tracking-[0.5em]";
      case "tight": return "tracking-tighter";
      // Animations
      case "glow": return "animate-glow-pulse";
      case "flicker": return "animate-flicker";
      case "bounce": return "animate-bounce";
      case "shake": return "animate-shake";
      case "pulse": return "animate-pulse";
      // Effects
      case "shadow": return "drop-shadow-[0_0_10px_currentColor]";
      case "outline": return "[text-shadow:_-1px_-1px_0_currentColor,_1px_-1px_0_currentColor,_-1px_1px_0_currentColor,_1px_1px_0_currentColor]";
      case "gradient": return "bg-clip-text text-transparent";
      case "glitch": return "animate-glitch";
      case "blur": return "hover:blur-[1px] transition-all";
      default: return "";
    }
  };

  return (
    <header className="relative px-3 pt-3 pb-2">
      {/* Glass morphism header card - optimized */}
      <div className={`relative rounded-2xl bg-gradient-to-br from-background/90 via-card/80 to-background/90 backdrop-blur-sm border ${getBorderClass(color1)}/20 p-3 overflow-hidden`}>
        {/* Animated rainbow border glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30 animate-rainbow-border"
          style={{
            background: `linear-gradient(90deg, hsl(var(--neon-${color1})), hsl(var(--neon-${color2})), hsl(var(--neon-cyan)), hsl(var(--neon-${color1})))`,
            backgroundSize: '300% 100%',
          }}
        />
        <div className="absolute inset-[1px] rounded-2xl bg-background/95" />
        
        {/* Corner accents - dynamic colors */}
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${getBorderClass(color1)}/60 rounded-tl-2xl`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${getBorderClass(color2)}/60 rounded-tr-2xl`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${getBorderClass(color2)}/60 rounded-bl-2xl`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${getBorderClass(color1)}/60 rounded-br-2xl`} />
        
        {/* Top row - Status & Settings */}
        <div className="relative flex items-center justify-between mb-2">
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${getBgClass(color1)}/10 border ${getBorderClass(color1)}/40`}>
              <div className={`w-1.5 h-1.5 ${getBgClass(color1)} rounded-full`} />
              <span className={`text-[9px] font-bold ${getColorClass(color1)} tracking-wider`}>LIVE</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getBgClass(color2)}/10 border ${getBorderClass(color2)}/30`}>
              <Wifi className={`w-3 h-3 ${getColorClass(color2)}`} />
              <span className={`text-[9px] ${getColorClass(color2)}`}>SECURE</span>
            </div>
          </div>

          {/* Right - Credits & Settings */}
          <div className="flex items-center gap-2">
            <CreditDisplay />
            <AdminSettings />
          </div>
        </div>

        {/* Main title section */}
        <div className="relative text-center py-1.5">
          {/* Logo icon with glow */}
          <div className="inline-flex items-center justify-center mb-2">
            <div className="relative">
              <div className={`absolute -inset-2.5 ${getBgClass(color1)}/15 rounded-full blur-xl`} />
              {settings.headerCustomLogo ? (
                <img 
                  src={settings.headerCustomLogo} 
                  alt="Logo" 
                  className={`relative w-11 h-11 rounded-xl object-cover border-2 ${getBorderClass(color1)}/50`}
                />
              ) : (
                <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${getBgClass(color1)}/20 to-current/20 border-2 ${getBorderClass(color1)}/50 flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${getColorClass(color1)}`} />
                </div>
              )}
            </div>
          </div>
          
          {/* Title with dynamic colors and styles */}
          <h1 
            className={`text-xl md:text-2xl font-black tracking-wider ${getStyleClasses()}`}
            style={{ 
              fontFamily: settings.headerFont || "'Orbitron', sans-serif",
              ...(settings.headerStyle === 'gradient' && {
                backgroundImage: `linear-gradient(135deg, hsl(var(--neon-${color1})), hsl(var(--neon-${color2})))`,
              })
            }}
          >
            <span className={`${settings.headerStyle === 'gradient' ? '' : getColorClass(color1)}`}>
              {settings.headerName1 || "SHUBH"}
            </span>
            <span className={`mx-2 ${settings.headerStyle === 'gradient' ? '' : 'text-muted-foreground/30'}`}>×</span>
            <span className={`${settings.headerStyle === 'gradient' ? '' : getColorClass(color2)}`}>
              {settings.headerName2 || "OSINT"}
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div className={`w-7 h-px bg-gradient-to-r from-transparent to-current ${getColorClass(color1)}/50`} />
            <Shield className={`w-3 h-3 ${getColorClass(color1)}/60`} />
            <p className="text-[9px] text-muted-foreground/70 tracking-[0.18em] uppercase">
              Intelligence Framework
            </p>
            <Shield className={`w-3 h-3 ${getColorClass(color1)}/60`} />
            <div className={`w-7 h-px bg-gradient-to-l from-transparent to-current ${getColorClass(color1)}/50`} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
