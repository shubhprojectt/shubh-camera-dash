import NewHeader from "@/components/NewHeader";
import SearchPanel from "@/components/SearchPanel";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] bg-background relative overflow-x-hidden">
        {/* Background - Fixed and optimized */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Custom background image - Fixed positioning */}
          {settings.backgroundImage ? (
            <div 
              className="absolute inset-0 bg-fixed-stable"
              style={{ 
                backgroundImage: `url(${settings.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                opacity: (parseInt(settings.backgroundOpacity || "30") / 100),
                willChange: 'auto',
                transform: 'translateZ(0)'
              }}
            />
          ) : (
            <>
              {/* Static gradient background - no animations */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
              
              {/* Static gradient orbs - no animations for performance */}
              <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-neon-green/8 rounded-full blur-[100px]" />
              <div className="absolute top-[50%] right-[5%] w-[250px] h-[250px] bg-neon-cyan/8 rounded-full blur-[100px]" />
              <div className="absolute bottom-[10%] left-[20%] w-[200px] h-[200px] bg-neon-pink/8 rounded-full blur-[100px]" />
            </>
          )}
          
          {/* Top gradient fade */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col">
          <NewHeader />
          
          <main className="flex-1 pb-6">
            <SearchPanel />
          </main>
          
          {/* Footer */}
          <footer className="text-center py-4 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-neon-green/20">
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
              <p className="text-[10px] text-muted-foreground/60 font-mono tracking-wider">
                FOR EDUCATIONAL PURPOSES ONLY
              </p>
            </div>
          </footer>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;
