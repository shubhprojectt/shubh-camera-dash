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
        <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-2xl" />
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        
        <div className="relative p-3">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
                <span className="text-[7px] font-bold text-pink-400 tracking-wider">ONLINE</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                <Icons.Shield className="w-2.5 h-2.5 text-cyan-400" />
                <span className="text-[7px] font-bold text-cyan-400 tracking-wider">SECURE</span>
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
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h1 
              className="text-sm font-black tracking-[0.2em] uppercase"
              style={{ fontFamily: settings.headerFont || "'Orbitron', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 bg-clip-text text-transparent">
                {settings.headerName1 || "SHUBH"}
              </span>
              <span className="mx-1 text-white/15">×</span>
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                {settings.headerName2 || "OSINT"}
              </span>
            </h1>
            <p className="text-[7px] text-white/20 tracking-[0.3em] uppercase font-medium mt-0.5">
              Intelligence Dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
