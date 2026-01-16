import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Database, Zap, Sparkles, Shield, Radio } from "lucide-react";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Custom background image - completely fixed */}
        {settings.backgroundImage ? (
          <div 
            className="bg-fixed-stable bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ 
              backgroundImage: `url(${settings.backgroundImage})`
            }}
          />
        ) : (
          <div className="bg-fixed-stable bg-background pointer-events-none" />
        )}
        
        {/* Dark overlay for readability */}
        <div 
          className="bg-fixed-stable bg-background pointer-events-none"
          style={{ 
            opacity: (parseInt(settings.backgroundOpacity || "30") / 100)
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 pb-4 pt-2">
          <Header />
          
          {/* Stats Badges - Compact */}
          <div className="flex justify-center gap-2 mb-3">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-green/20 border border-neon-green/50">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[8px] font-mono text-neon-green font-bold">LIVE</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/50">
              <Shield className="w-2.5 h-2.5 text-neon-cyan" />
              <span className="text-[8px] font-mono text-neon-cyan font-bold">SECURE</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/60 border border-neon-green/40">
              <Database className="w-2.5 h-2.5 text-neon-green" />
              <span className="text-[8px] font-mono text-neon-green font-bold">1B+</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/60 border border-neon-yellow/40">
              <Zap className="w-2.5 h-2.5 text-neon-yellow" />
              <span className="text-[8px] font-mono text-neon-yellow font-bold">Fast</span>
            </div>
          </div>
          
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
          
          {/* Footer text */}
          <div className="max-w-3xl mx-auto mt-6 text-center">
            <p className="text-[10px] text-muted-foreground/50 font-mono">
              ⚠ FOR EDUCATIONAL PURPOSES ONLY • USE RESPONSIBLY
            </p>
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;