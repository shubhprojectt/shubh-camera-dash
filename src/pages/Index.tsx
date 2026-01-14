import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, Zap, Database, Shield } from "lucide-react";

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
        
        <div className="bg-fixed-stable bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-cyan/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 pb-6">
          <Header />
          
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-6 text-center">
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-wider mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink">
                SHUBH OSINT
              </span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-mono">
              Advanced Intelligence Gathering System
            </p>
          </div>
          
          {/* Stats Row */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-neon-green/30">
                <Database className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green">1B+ Records</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-neon-cyan/30">
                <Zap className="w-4 h-4 text-neon-cyan" />
                <span className="text-neon-cyan">&lt;1s Response</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-neon-pink/30">
                <Shield className="w-4 h-4 text-neon-pink" />
                <span className="text-neon-pink">Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-neon-purple/30">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-neon-purple">AI Powered</span>
              </div>
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
