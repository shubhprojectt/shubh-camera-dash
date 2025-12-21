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
        {/* Custom background image or gradient */}
        {settings.backgroundImage ? (
          <div 
            className="fixed-viewport bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.backgroundImage})` }}
          />
        ) : (
          <div className="fixed-viewport bg-gradient-to-br from-background via-background to-muted/20" />
        )}
        
        {/* Dark overlay for readability - dynamic opacity */}
        <div 
          className="absolute inset-0 bg-background"
          style={{ opacity: (parseInt(settings.backgroundOpacity || "30") / 100) }}
        />
        
        {/* Enhanced animated mesh gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--neon-purple)/0.2),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_0%_100%,hsl(var(--neon-green)/0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,hsl(var(--neon-pink)/0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,hsl(var(--neon-cyan)/0.1),transparent)]" />
        </div>
        
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-[5%] w-64 h-64 bg-neon-green/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[5%] w-80 h-80 bg-neon-pink/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-[15%] right-[15%] w-40 h-40 bg-neon-purple/25 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-4s' }} />
        <div className="absolute bottom-[30%] left-[20%] w-32 h-32 bg-neon-orange/20 rounded-full blur-[60px] animate-float" style={{ animationDelay: '-3s' }} />
        
        {/* Animated vertical light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-neon-cyan/40 via-transparent to-neon-cyan/40 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-neon-pink/30 via-transparent to-neon-pink/30 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-neon-green/25 via-transparent to-neon-green/25 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none scanline opacity-30" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Header />
          
          {/* Stats Bar */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-neon-green/30 backdrop-blur-sm">
                <Database className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-xs font-mono text-neon-green">1B+ Records</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-neon-cyan/30 backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-xs font-mono text-neon-cyan">Fast Search</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-neon-pink/30 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
                <span className="text-xs font-mono text-neon-pink">AI Powered</span>
              </div>
            </div>
          </div>
          
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
        </div>
        
        {/* Enhanced corner decorations */}
        <div className="fixed top-0 left-0 w-24 h-24 md:w-32 md:h-32 border-l-2 border-t-2 border-neon-green/40 rounded-br-3xl" />
        <div className="fixed top-0 right-0 w-24 h-24 md:w-32 md:h-32 border-r-2 border-t-2 border-neon-pink/40 rounded-bl-3xl" />
        <div className="fixed bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 border-l-2 border-b-2 border-neon-cyan/40 rounded-tr-3xl" />
        <div className="fixed bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 border-r-2 border-b-2 border-neon-purple/40 rounded-tl-3xl" />
        
        {/* Corner dots */}
        <div className="fixed top-4 left-4 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
        <div className="fixed top-4 right-4 w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="fixed bottom-4 left-4 w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="fixed bottom-4 right-4 w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </PasswordProtection>
  );
};

export default Index;
