import { Settings, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import AdminSettings from "./AdminSettings";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const Header = () => {
  const { settings } = useSettings();
  
  // Get dynamic icon
  const IconComponent = (Icons[settings.headerIcon as keyof typeof Icons] as LucideIcon) || Icons.Zap;

  return (
    <header className="relative py-6 text-center">
      {/* Gradient orb background effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Left side - Credit Display */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <CreditDisplay />
      </div>

      {/* Right side - Settings button */}
      <div className="absolute top-3 right-3">
        <AdminSettings />
      </div>

      {/* Logo Container */}
      <div className="relative inline-block mb-4">
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary p-[2px] shadow-2xl shadow-primary/25">
          <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center overflow-hidden">
            {settings.headerCustomLogo ? (
              <img 
                src={settings.headerCustomLogo} 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <IconComponent className="w-10 h-10 text-primary" />
            )}
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary opacity-50 blur-xl -z-10" />
      </div>
      
      {/* Title */}
      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {settings.headerName1}
          </span>
          <span className="text-foreground ml-2">{settings.headerName2}</span>
        </h1>
        
        {/* Tagline */}
        <p className="mt-2 text-sm text-muted-foreground tracking-wide">
          Intelligence • Search • Security
        </p>
      </div>
      
      {/* Decorative line */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-primary/50 rounded-full" />
        <Sparkles className="w-4 h-4 text-primary/60" />
        <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-accent/50 rounded-full" />
      </div>
    </header>
  );
};

export default Header;