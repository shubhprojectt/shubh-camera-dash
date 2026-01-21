import { Shield, Zap, Wifi } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import AdminSettings from "./AdminSettings";

const NewHeader = () => {
  const { settings } = useSettings();

  return (
    <header className="relative px-4 pt-4 pb-2">
      {/* Glass morphism header card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-background/90 via-card/80 to-background/90 backdrop-blur-xl border border-neon-green/20 p-4 overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-green/0 via-neon-green/20 to-neon-green/0 animate-shimmer" />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/60 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/60 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-pink/60 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-purple/60 rounded-br-2xl" />
        
        {/* Top row - Status & Settings */}
        <div className="relative flex items-center justify-between mb-3">
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 border border-neon-green/40">
              <div className="relative">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-neon-green rounded-full animate-ping opacity-50" />
              </div>
              <span className="text-[10px] font-bold text-neon-green tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
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
        <div className="relative text-center py-2">
          {/* Logo icon with glow */}
          <div className="inline-flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute -inset-3 bg-neon-green/20 rounded-full blur-xl animate-pulse" />
              {settings.headerCustomLogo ? (
                <img 
                  src={settings.headerCustomLogo} 
                  alt="Logo" 
                  className="relative w-14 h-14 rounded-xl object-cover border-2 border-neon-green/50"
                />
              ) : (
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green/50 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-neon-green" />
                </div>
              )}
            </div>
          </div>
          
          {/* Title with gradient */}
          <h1 
            className="text-2xl md:text-3xl font-black tracking-wider"
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
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-neon-green/50" />
            <Shield className="w-3 h-3 text-neon-green/60" />
            <p className="text-[10px] text-muted-foreground/70 tracking-[0.2em] uppercase">
              Intelligence Framework
            </p>
            <Shield className="w-3 h-3 text-neon-green/60" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-neon-green/50" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
