import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, Zap, Database, Shield, Radio } from "lucide-react";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] bg-background relative overflow-hidden">
        {/* Custom background image or premium gradient */}
        {settings.backgroundImage ? (
          <div 
            className="fixed-viewport bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.backgroundImage})` }}
          />
        ) : (
          <div className="fixed-viewport bg-gradient-to-br from-background via-background to-muted/20" />
        )}
        
        {/* Dark overlay for readability */}
        <div 
          className="absolute inset-0 bg-background"
          style={{ opacity: (parseInt(settings.backgroundOpacity || "30") / 100) }}
        />
        
        {/* Premium animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/8 via-transparent to-neon-cyan/8" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 via-transparent to-neon-green/5" />
        
        {/* Premium cyber grid */}
        <div className="absolute inset-0 cyber-grid-glow opacity-30" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-neon-purple/15 rounded-full blur-[100px] animate-glow-breathe" />
        <div className="absolute bottom-[15%] right-[5%] w-80 h-80 bg-neon-cyan/12 rounded-full blur-[120px] animate-glow-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-pink/8 rounded-full blur-[150px] animate-glow-breathe" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[30%] right-[20%] w-48 h-48 bg-neon-green/10 rounded-full blur-[80px] animate-glow-breathe" style={{ animationDelay: '1s' }} />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <Header />
          
          {/* Premium Stats Bar */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-neon-green/40 hover:border-neon-green/60 transition-all duration-300 group cursor-default">
                <Database className="w-3.5 h-3.5 text-neon-green group-hover:animate-pulse" />
                <span className="text-xs font-semibold text-neon-green">1B+ Records</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-neon-cyan/40 hover:border-neon-cyan/60 transition-all duration-300 group cursor-default">
                <Zap className="w-3.5 h-3.5 text-neon-cyan group-hover:animate-pulse" />
                <span className="text-xs font-semibold text-neon-cyan">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-neon-pink/40 hover:border-neon-pink/60 transition-all duration-300 group cursor-default">
                <Sparkles className="w-3.5 h-3.5 text-neon-pink group-hover:animate-pulse" />
                <span className="text-xs font-semibold text-neon-pink">AI Powered</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-neon-purple/40 hover:border-neon-purple/60 transition-all duration-300 group cursor-default">
                <Shield className="w-3.5 h-3.5 text-neon-purple group-hover:animate-pulse" />
                <span className="text-xs font-semibold text-neon-purple">Secure</span>
              </div>
            </div>
          </div>
          
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
        </div>
        
        {/* Premium corner decorations */}
        <div className="fixed top-0 left-0 w-24 h-24 pointer-events-none">
          <div className="absolute top-4 left-4 w-12 h-[2px] bg-gradient-to-r from-neon-green to-transparent" />
          <div className="absolute top-4 left-4 w-[2px] h-12 bg-gradient-to-b from-neon-green to-transparent" />
        </div>
        <div className="fixed top-0 right-0 w-24 h-24 pointer-events-none">
          <div className="absolute top-4 right-4 w-12 h-[2px] bg-gradient-to-l from-neon-pink to-transparent" />
          <div className="absolute top-4 right-4 w-[2px] h-12 bg-gradient-to-b from-neon-pink to-transparent" />
        </div>
        <div className="fixed bottom-0 left-0 w-24 h-24 pointer-events-none">
          <div className="absolute bottom-4 left-4 w-12 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
          <div className="absolute bottom-4 left-4 w-[2px] h-12 bg-gradient-to-t from-neon-cyan to-transparent" />
        </div>
        <div className="fixed bottom-0 right-0 w-24 h-24 pointer-events-none">
          <div className="absolute bottom-4 right-4 w-12 h-[2px] bg-gradient-to-l from-neon-purple to-transparent" />
          <div className="absolute bottom-4 right-4 w-[2px] h-12 bg-gradient-to-t from-neon-purple to-transparent" />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
      </div>
    </PasswordProtection>
  );
};

export default Index;
