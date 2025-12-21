import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, Zap, Database } from "lucide-react";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] bg-background relative overflow-hidden">
        {/* Custom background image or simple gradient */}
        {settings.backgroundImage ? (
          <div 
            className="fixed-viewport bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.backgroundImage})` }}
          />
        ) : (
          <div className="fixed-viewport bg-background" />
        )}
        
        {/* Dark overlay for readability */}
        <div 
          className="absolute inset-0 bg-background"
          style={{ opacity: (parseInt(settings.backgroundOpacity || "30") / 100) }}
        />
        
        {/* Simple gradient overlay - lightweight */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-cyan/5" />
        
        {/* Simple cyber grid - no animation */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Static corner accents - no blur/animation */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-neon-green/10 rounded-full" style={{ filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-neon-pink/10 rounded-full" style={{ filter: 'blur(60px)' }} />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 pb-6">
          <Header />
          
          {/* Compact Stats Bar */}
          <div className="max-w-3xl mx-auto mb-3">
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-green/30">
                <Database className="w-3 h-3 text-neon-green" />
                <span className="text-[10px] font-mono text-neon-green">1B+ Records</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-cyan/30">
                <Zap className="w-3 h-3 text-neon-cyan" />
                <span className="text-[10px] font-mono text-neon-cyan">Fast</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-pink/30">
                <Sparkles className="w-3 h-3 text-neon-pink" />
                <span className="text-[10px] font-mono text-neon-pink">AI</span>
              </div>
            </div>
          </div>
          
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
        </div>
        
        {/* Simple corner decorations - no animation */}
        <div className="fixed top-0 left-0 w-20 h-20 border-l border-t border-neon-green/30 rounded-br-xl" />
        <div className="fixed top-0 right-0 w-20 h-20 border-r border-t border-neon-pink/30 rounded-bl-xl" />
        <div className="fixed bottom-0 left-0 w-20 h-20 border-l border-b border-neon-cyan/30 rounded-tr-xl" />
        <div className="fixed bottom-0 right-0 w-20 h-20 border-r border-b border-neon-purple/30 rounded-tl-xl" />
      </div>
    </PasswordProtection>
  );
};

export default Index;
