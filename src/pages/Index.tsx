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
        <div className="relative z-10 container mx-auto px-3 pb-6">
          <Header />
          
          {/* Status Badges */}
          <div className="flex justify-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/50">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] font-mono text-neon-green font-bold tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-cyan/20 border border-neon-cyan/50">
              <Shield className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-mono text-neon-cyan font-bold tracking-wider">SECURE</span>
            </div>
          </div>
          
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-6 text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-wider mb-2">
              <span className="text-neon-green drop-shadow-[0_0_10px_hsl(var(--neon-green))]">SHUBH</span>
              {" "}
              <span className="text-neon-pink drop-shadow-[0_0_10px_hsl(var(--neon-pink))]">OSINT</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-muted-foreground/70 text-xs md:text-sm font-mono tracking-[0.3em] mb-4">
              INTELLIGENCE • SEARCH • SECURITY
            </p>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-neon-cyan/60" />
              <div className="w-2 h-2 rotate-45 border border-neon-cyan/60" />
              <div className="w-8 h-[1px] bg-neon-cyan/60" />
              <div className="w-2 h-2 rotate-45 border border-neon-cyan/60" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-neon-cyan/60" />
            </div>
            
            {/* Stats Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-neon-green/40 backdrop-blur-sm">
                <Database className="w-4 h-4 text-neon-green" />
                <span className="text-xs font-mono text-neon-green font-bold">1B+ Records</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-neon-yellow/40 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-neon-yellow" />
                <span className="text-xs font-mono text-neon-yellow font-bold">Fast</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-neon-cyan/40 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs font-mono text-neon-cyan font-bold">AI</span>
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
