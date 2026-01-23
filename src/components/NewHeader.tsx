import { Shield, Zap, Wifi } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import AdminSettings from "./AdminSettings";

const NewHeader = () => {
  const { settings } = useSettings();

  return (
    <header className="relative px-3 pt-3 pb-2">
      {/* Glass morphism header card - optimized */}
      <div className="relative rounded-2xl bg-gradient-to-br from-background/90 via-card/80 to-background/90 backdrop-blur-sm border border-neon-green/20 p-3 overflow-hidden">
        {/* Static border glow - no animation */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-green/0 via-neon-green/10 to-neon-green/0" />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/60 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/60 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-pink/60 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-purple/60 rounded-br-2xl" />
        
        {/* Top row - Status & Settings */}
        <div className="relative flex items-center justify-between mb-2">
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/40">
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full" />
              <span className="text-[9px] font-bold text-neon-green tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
              <Wifi className="w-3 h-3 text-neon-cyan" />
              <span className="text-[9px] text-neon-cyan">SECURE</span>
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
              <div className="absolute -inset-2.5 bg-neon-green/15 rounded-full blur-xl" />
              {settings.headerCustomLogo ? (
                <img 
                  src={settings.headerCustomLogo} 
                  alt="Logo" 
                  className="relative w-11 h-11 rounded-xl object-cover border-2 border-neon-green/50"
                />
              ) : (
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green/50 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-neon-green" />
                </div>
              )}
            </div>
          </div>
          
          {/* Title with gradient */}
          <h1 
            className="text-xl md:text-2xl font-black tracking-wider"
            style={{ fontFamily: settings.headerFont || "'Orbitron', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              {settings.headerName1 || "SHUBH"}
            </span>
            <span className="mx-2 text-muted-foreground/30">×</span>
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-pink bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              {settings.headerName2 || "OSINT"}
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div className="w-7 h-px bg-gradient-to-r from-transparent to-neon-green/50" />
            <Shield className="w-3 h-3 text-neon-green/60" />
            <p className="text-[9px] text-muted-foreground/70 tracking-[0.18em] uppercase">
              Intelligence Framework
            </p>
            <Shield className="w-3 h-3 text-neon-green/60" />
            <div className="w-7 h-px bg-gradient-to-l from-transparent to-neon-green/50" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
