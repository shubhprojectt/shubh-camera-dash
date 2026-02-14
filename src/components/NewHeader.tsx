import { useSettings } from "@/contexts/SettingsContext";
import CreditDisplay from "./CreditDisplay";
import AdminSettings from "./AdminSettings";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const NewHeader = () => {
  const { settings } = useSettings();
  
  const IconComponent = (Icons[settings.headerIcon as keyof typeof Icons] as LucideIcon) || Icons.Zap;

  return (
    <header className="relative px-3 pt-3 pb-1 sticky top-0 z-20">
      <div className="relative rounded-2xl overflow-hidden max-w-xl mx-auto">
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-2xl" />
        {/* Top glow line - brighter */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/70 to-transparent" />
        {/* Bottom glow line - brighter */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        {/* Side glow accents */}
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-pink-500/40 via-transparent to-cyan-400/40" />
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-cyan-400/40 via-transparent to-pink-500/40" />
        
        <div className="relative p-3">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-500/15 border border-pink-500/30">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse shadow-sm shadow-pink-400/50" />
                <span className="text-[7px] font-bold text-pink-400 tracking-wider" style={{textShadow: '0 0 8px rgba(255,51,153,0.5)'}}>ONLINE</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30">
                <Icons.Shield className="w-2.5 h-2.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]" />
                <span className="text-[7px] font-bold text-cyan-400 tracking-wider" style={{textShadow: '0 0 8px rgba(0,255,255,0.5)'}}>SECURE</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditDisplay />
              <AdminSettings />
            </div>
          </div>

          {/* Logo + Title */}
          <div className="text-center py-1">
            <div className="inline-flex items-center justify-center mb-1">
              {settings.headerCustomLogo ? (
                <img src={settings.headerCustomLogo} alt="Logo" className="w-8 h-8 rounded-xl object-cover ring-1 ring-pink-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <IconComponent className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                </div>
              )}
            </div>
            <h1 
              className="text-sm font-black tracking-[0.2em] uppercase"
              style={{ fontFamily: settings.headerFont || "'Orbitron', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,51,153,0.6)]">
                {settings.headerName1 || "SHUBH"}
              </span>
              <span className="mx-1 text-white/20">×</span>
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
                {settings.headerName2 || "OSINT"}
              </span>
            </h1>
            <p className="text-[7px] text-white/25 tracking-[0.3em] uppercase font-medium mt-0.5" style={{textShadow: '0 0 6px rgba(255,255,255,0.1)'}}>
              Intelligence Dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
