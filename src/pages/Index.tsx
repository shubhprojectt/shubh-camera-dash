import NewHeader from "@/components/NewHeader";
import SearchPanel from "@/components/SearchPanel";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] relative overflow-x-hidden bg-[#08060e]">
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
              {/* Pink glow top-right */}
              <div className="absolute top-[-8%] right-[-8%] w-[420px] h-[420px] rounded-full bg-pink-600/[0.12] blur-[130px]" />
              {/* Cyan glow bottom-left */}
              <div className="absolute bottom-[-10%] left-[-8%] w-[380px] h-[380px] rounded-full bg-cyan-500/[0.10] blur-[120px]" />
              {/* Purple center */}
              <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-600/[0.06] blur-[100px]" />
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" />
              <p className="text-[9px] text-white/25 font-medium tracking-widest uppercase">
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
