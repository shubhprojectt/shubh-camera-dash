import NewHeader from "@/components/NewHeader";
import SearchPanel from "@/components/SearchPanel";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] relative overflow-x-hidden bg-[#05030a]">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {settings.backgroundImage ? (
            <div 
              className="absolute inset-0 bg-fixed-stable"
              style={{ 
                backgroundImage: `url(${settings.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: (parseInt(settings.backgroundOpacity || "30") / 100),
                willChange: 'transform',
                transform: 'translate3d(0,0,0)'
              }}
            />
          ) : (
            <>
              {/* Hard neon pink glow */}
              <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-pink-500/[0.20] blur-[100px]" />
              {/* Hard neon cyan glow */}
              <div className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-cyan-400/[0.18] blur-[90px]" />
              {/* Center magenta */}
              <div className="absolute top-[35%] left-[25%] w-[350px] h-[350px] rounded-full bg-pink-600/[0.12] blur-[80px]" />
              {/* Extra cyan accent */}
              <div className="absolute top-[60%] right-[20%] w-[250px] h-[250px] rounded-full bg-cyan-500/[0.15] blur-[70px]" />
            </>
          )}
        </div>
        
        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col">
          <NewHeader />
          
          <main className="flex-1 pb-4">
            <SearchPanel />
          </main>
          
          {/* Footer */}
          <footer className="text-center py-3 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse shadow-sm shadow-pink-400/50" />
              <p className="text-[9px] text-white/30 font-medium tracking-widest uppercase">
                Educational Purpose Only
              </p>
            </div>
          </footer>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;
