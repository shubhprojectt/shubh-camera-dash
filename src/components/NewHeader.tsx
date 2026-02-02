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
    <header className="relative px-3 pt-3 pb-2">
      {/* Main header card with enhanced glassmorphism */}
      <div className={`relative rounded-2xl bg-gradient-to-br from-background/95 via-card/90 to-background/95 backdrop-blur-md border ${getBorderClass(color1)}/30 p-3 overflow-hidden`}>
        
        {/* Subtle animated gradient border */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `linear-gradient(135deg, hsl(var(--neon-${color1})) 0%, transparent 40%, transparent 60%, hsl(var(--neon-${color2})) 100%)`,
          }}
        />
        <div className="absolute inset-[1px] rounded-2xl bg-background/98" />
        
        {/* Corner accents with glow */}
        <div className={`absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 ${getBorderClass(color1)}/70 rounded-tl-2xl`} />
        <div className={`absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 ${getBorderClass(color2)}/70 rounded-tr-2xl`} />
        <div className={`absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 ${getBorderClass(color2)}/70 rounded-bl-2xl`} />
        <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 ${getBorderClass(color1)}/70 rounded-br-2xl`} />
        
        {/* Top row - Status & Settings */}
        <div className="relative flex items-center justify-between mb-3">
          {/* Status indicators with enhanced design */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getBgClass(color1)}/15 border ${getBorderClass(color1)}/50 backdrop-blur-sm`}>
              <Activity className={`w-3 h-3 ${getColorClass(color1)}`} />
              <span className={`text-[9px] font-bold ${getColorClass(color1)} tracking-wider`}>LIVE</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getBgClass(color2)}/15 border ${getBorderClass(color2)}/40 backdrop-blur-sm`}>
              <Signal className={`w-3 h-3 ${getColorClass(color2)}`} />
              <span className={`text-[9px] font-medium ${getColorClass(color2)} tracking-wide`}>SECURE</span>
            </div>
          </div>

          {/* Right - Credits & Settings */}
          <div className="flex items-center gap-2">
            <CreditDisplay />
            <AdminSettings />
          </div>
        </div>

        {/* Main title section */}
        <div className="relative text-center py-2">
          {/* Logo with enhanced glow effect */}
          <div className="inline-flex items-center justify-center mb-3">
            <div className="relative">
              {/* Multi-layer glow */}
              <div className={`absolute -inset-3 ${getBgClass(color1)}/20 rounded-2xl blur-xl`} />
              <div className={`absolute -inset-1.5 ${getBgClass(color1)}/10 rounded-xl blur-md`} />
              
              {settings.headerCustomLogo ? (
                <img 
                  src={settings.headerCustomLogo} 
                  alt="Logo" 
                  className={`relative w-12 h-12 rounded-xl object-cover border-2 ${getBorderClass(color1)}/60 shadow-lg`}
                  style={{ boxShadow: `0 0 20px hsl(var(--neon-${color1}) / 0.3)` }}
                />
              ) : (
                <div 
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br from-background/90 to-card/80 border-2 ${getBorderClass(color1)}/60 flex items-center justify-center`}
                  style={{ boxShadow: `0 0 20px hsl(var(--neon-${color1}) / 0.3)` }}
                >
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
            <span className={`mx-2 ${settings.headerStyle === 'gradient' ? '' : 'text-muted-foreground/40'}`}>×</span>
            <span className={`${settings.headerStyle === 'gradient' ? '' : getColorClass(color2)}`}>
              {settings.headerName2 || "OSINT"}
            </span>
          </h1>
          
          {/* Subtitle with enhanced styling */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-8 h-px bg-gradient-to-r from-transparent via-current to-current ${getColorClass(color1)}/40`} />
            <Shield className={`w-3 h-3 ${getColorClass(color1)}/70`} />
            <p className="text-[9px] text-muted-foreground/80 tracking-[0.2em] uppercase font-medium">
              Intelligence Framework
            </p>
            <Shield className={`w-3 h-3 ${getColorClass(color2)}/70`} />
            <div className={`w-8 h-px bg-gradient-to-l from-transparent via-current to-current ${getColorClass(color2)}/40`} />
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
      </div>
    </header>
  );
};

export default NewHeader;
