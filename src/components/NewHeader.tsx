import { Shield } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import AdminSettings from "./AdminSettings";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

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

  // Map neon color names to tailwind violet/blue glassmorphism accent colors
  const getAccentColor = (color: string) => {
    const map: Record<string, string> = {
      green: "emerald", pink: "pink", orange: "amber", cyan: "cyan",
      red: "red", purple: "violet", yellow: "amber", blue: "blue",
    };
    return map[color] || "violet";
  };

  const a1 = getAccentColor(color1);
  const a2 = getAccentColor(color2);

  return (
    <header className="relative px-3 pt-3 pb-2 sticky top-0 z-20">
      <div className="relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-3 overflow-hidden max-w-xl mx-auto">
        {/* Subtle gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${a1}-500/30 to-transparent`} />
        
        {/* Top row - Status & Settings */}
        <div className="flex items-center justify-between mb-2">
          {/* Status indicators */}
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg bg-${a1}-500/10 border border-${a1}-500/20`}>
              <div className={`w-1.5 h-1.5 bg-${a1}-400 rounded-full animate-pulse`} />
              <span className={`text-[8px] font-semibold text-${a1}-400 tracking-wider`}>LIVE</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg bg-${a2}-500/10 border border-${a2}-500/20`}>
              <Shield className={`w-2.5 h-2.5 text-${a2}-400`} />
              <span className={`text-[8px] font-medium text-${a2}-400 tracking-wide`}>SECURE</span>
            </div>
          </div>

          {/* Right - Credits & Settings */}
          <div className="flex items-center gap-1.5">
            <CreditDisplay />
            <AdminSettings />
          </div>
        </div>

        {/* Main title section */}
        <div className="text-center py-1">
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-1.5">
            <div className="relative">
              {settings.headerCustomLogo ? (
                <img 
                  src={settings.headerCustomLogo} 
                  alt="Logo" 
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
          
          {/* Title */}
          <h1 
            className={`text-base md:text-lg font-bold tracking-wider ${getStyleClasses()}`}
            style={{ 
              fontFamily: settings.headerFont || "'Orbitron', sans-serif",
              ...(settings.headerStyle === 'gradient' && {
                backgroundImage: `linear-gradient(135deg, hsl(var(--neon-${color1})), hsl(var(--neon-${color2})))`,
              })
            }}
          >
            <span className="animate-color-cycle">{settings.headerName1 || "SHUBH"}</span>
            <span className="mx-1.5 text-white/20">×</span>
            <span className="animate-color-cycle" style={{ animationDelay: '-3s' }}>{settings.headerName2 || "OSINT"}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-[8px] text-white/30 tracking-[0.2em] uppercase font-medium mt-1">
            Intelligence Framework
          </p>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
