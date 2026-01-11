import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, Zap, Database, Shield, Eye, Search } from "lucide-react";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Custom background image */}
        {settings.backgroundImage ? (
          <div 
            className="bg-fixed-stable bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ 
              backgroundImage: `url(${settings.backgroundImage})`
            }}
          />
        ) : (
          <div className="bg-fixed-stable pointer-events-none bg-gradient-to-br from-background via-background to-neon-purple/10" />
        )}
        
        {/* Dark overlay for readability */}
        <div 
          className="bg-fixed-stable bg-background pointer-events-none"
          style={{ 
            opacity: (parseInt(settings.backgroundOpacity || "30") / 100)
          }}
        />
        
        {/* Animated gradient orbs */}
        <div className="bg-fixed-stable pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 pb-6">
          <Header />
          
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-6 text-center">
            {/* Glowing Title */}
            <div className="relative inline-block mb-4">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent animate-fade-in">
                CYBER LOOKUP
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-30 blur-xl -z-10" />
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Advanced Intelligence Gathering System
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-lg mx-auto mb-6">
              <div className="group relative p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-neon-green/30 hover:border-neon-green/60 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-neon-green/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Database className="w-5 h-5 text-neon-green mx-auto mb-1" />
                <div className="text-lg md:text-xl font-bold text-neon-green">1B+</div>
                <div className="text-[10px] text-muted-foreground">Records</div>
              </div>
              
              <div className="group relative p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-neon-cyan/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
                <div className="text-lg md:text-xl font-bold text-neon-cyan">&lt;1s</div>
                <div className="text-[10px] text-muted-foreground">Response</div>
              </div>
              
              <div className="group relative p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-neon-pink/30 hover:border-neon-pink/60 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 bg-neon-pink/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Shield className="w-5 h-5 text-neon-pink mx-auto mb-1" />
                <div className="text-lg md:text-xl font-bold text-neon-pink">100%</div>
                <div className="text-[10px] text-muted-foreground">Secure</div>
              </div>
            </div>
            
            {/* Feature Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30">
                <Eye className="w-3 h-3 text-neon-purple" />
                <span className="text-[10px] font-medium text-foreground/80">OSINT Tools</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-green/20 border border-neon-cyan/30">
                <Search className="w-3 h-3 text-neon-cyan" />
                <span className="text-[10px] font-medium text-foreground/80">Deep Search</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 border border-neon-pink/30">
                <Sparkles className="w-3 h-3 text-neon-pink" />
                <span className="text-[10px] font-medium text-foreground/80">AI Powered</span>
              </div>
            </div>
          </div>
          
          {/* Main Search Component */}
          <main className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 rounded-2xl blur-xl opacity-50" />
              <NumberDetailFinder />
            </div>
          </main>
        </div>
        
        {/* Floating corner accents */}
        <div className="fixed top-4 left-4 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-green to-transparent" />
          <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-neon-green to-transparent" />
        </div>
        <div className="fixed top-4 right-4 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-neon-pink to-transparent" />
          <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-neon-pink to-transparent" />
        </div>
        <div className="fixed bottom-4 left-4 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-cyan to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-neon-cyan to-transparent" />
        </div>
        <div className="fixed bottom-4 right-4 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-neon-purple to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-neon-purple to-transparent" />
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;
