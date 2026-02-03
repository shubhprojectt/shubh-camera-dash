import { Shield, Wifi, Activity, Signal } from "lucide-react";
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
      case "uppercase": return "uppercase";
      case "lowercase": return "lowercase";
      case "capitalize": return "capitalize";
      case "italic": return "italic";
      case "bold": return "font-black";
      case "light": return "font-light";
      case "thin": return "font-thin";
      case "wide": return "tracking-[0.5em]";
      case "tight": return "tracking-tighter";
      case "glow": return "animate-glow-pulse";
      case "flicker": return "animate-flicker";
      case "bounce": return "animate-bounce";
      case "shake": return "animate-shake";
      case "pulse": return "animate-pulse";
      case "shadow": return "drop-shadow-[0_0_10px_currentColor]";
      case "outline": return "[text-shadow:_-1px_-1px_0_currentColor,_1px_-1px_0_currentColor,_-1px_1px_0_currentColor,_1px_1px_0_currentColor]";
      case "gradient": return "bg-clip-text text-transparent";
      case "glitch": return "animate-glitch";
      case "blur": return "hover:blur-[1px] transition-all";
      default: return "";
    }
  };

  return (
    <header className="relative px-2 pt-2 pb-1">
      {/* Main header card - compact with rainbow border */}
      <div className="relative">
        {/* Animated rainbow border - like login page */}
        <div className="absolute -inset-[1.5px] rounded-xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan via-neon-pink to-neon-green animate-rainbow-border"
            style={{ backgroundSize: '300% 100%' }}
          />
        </div>
        
        <div className={`relative rounded-xl bg-card/95 backdrop-blur-md p-2 overflow-hidden`}>
          {/* Corner accents - smaller */}
          <div className={`absolute top-0 left-0 w-6 h-6 border-t border-l ${getBorderClass(color1)}/60 rounded-tl-xl`} />
          <div className={`absolute top-0 right-0 w-6 h-6 border-t border-r ${getBorderClass(color2)}/60 rounded-tr-xl`} />
          <div className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l ${getBorderClass(color2)}/60 rounded-bl-xl`} />
          <div className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r ${getBorderClass(color1)}/60 rounded-br-xl`} />
          
          {/* Top row - Status & Settings - more compact */}
          <div className="relative flex items-center justify-between mb-1.5">
            {/* Status indicators - smaller */}
            <div className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getBgClass(color1)}/15 border ${getBorderClass(color1)}/50`}>
                <Activity className={`w-2.5 h-2.5 ${getColorClass(color1)}`} />
                <span className={`text-[8px] font-bold ${getColorClass(color1)} tracking-wider`}>LIVE</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getBgClass(color2)}/15 border ${getBorderClass(color2)}/40`}>
                <Signal className={`w-2.5 h-2.5 ${getColorClass(color2)}`} />
                <span className={`text-[8px] font-medium ${getColorClass(color2)} tracking-wide`}>SECURE</span>
              </div>
            </div>

            {/* Right - Credits & Settings */}
            <div className="flex items-center gap-1.5">
              <CreditDisplay />
              <AdminSettings />
            </div>
          </div>

          {/* Main title section - compact */}
          <div className="relative text-center py-1">
            {/* Logo with glow - smaller */}
            <div className="inline-flex items-center justify-center mb-1.5">
              <div className="relative">
                <div className={`absolute -inset-2 ${getBgClass(color1)}/15 rounded-xl blur-lg`} />
                
                {settings.headerCustomLogo ? (
                  <img 
                    src={settings.headerCustomLogo} 
                    alt="Logo" 
                    className={`relative w-9 h-9 rounded-lg object-cover border ${getBorderClass(color1)}/60`}
                    style={{ boxShadow: `0 0 12px hsl(var(--neon-${color1}) / 0.3)` }}
                  />
                ) : (
                  <div 
                    className={`relative w-9 h-9 rounded-lg bg-gradient-to-br from-background/90 to-card/80 border ${getBorderClass(color1)}/60 flex items-center justify-center`}
                    style={{ boxShadow: `0 0 12px hsl(var(--neon-${color1}) / 0.3)` }}
                  >
                    <IconComponent className={`w-5 h-5 ${getColorClass(color1)}`} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Title - with color cycling animation */}
            <h1 
              className={`text-base md:text-lg font-black tracking-wider ${getStyleClasses()}`}
              style={{ 
                fontFamily: settings.headerFont || "'Orbitron', sans-serif",
                ...(settings.headerStyle === 'gradient' && {
                  backgroundImage: `linear-gradient(135deg, hsl(var(--neon-${color1})), hsl(var(--neon-${color2})))`,
                })
              }}
            >
              <span className="animate-color-cycle">
                {settings.headerName1 || "SHUBH"}
              </span>
              <span className="mx-1.5 text-muted-foreground/40">×</span>
              <span className="animate-color-cycle" style={{ animationDelay: '-4s' }}>
                {settings.headerName2 || "OSINT"}
              </span>
            </h1>
            
            {/* Subtitle - smaller */}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <div className={`w-6 h-px bg-gradient-to-r from-transparent to-current ${getColorClass(color1)}/40`} />
              <Shield className={`w-2.5 h-2.5 ${getColorClass(color1)}/70`} />
              <p className="text-[7px] text-muted-foreground/80 tracking-[0.15em] uppercase font-medium">
                Intelligence Framework
              </p>
              <Shield className={`w-2.5 h-2.5 ${getColorClass(color2)}/70`} />
              <div className={`w-6 h-px bg-gradient-to-l from-transparent to-current ${getColorClass(color2)}/40`} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
