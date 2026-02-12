import NewHeader from "@/components/NewHeader";
import SearchPanel from "@/components/SearchPanel";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] relative overflow-x-hidden" style={{ background: 'linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 20%, #0d1b3c 40%, #0a2a3c 60%, #0d2e2e 80%, #0a1a2a 100%)' }}>
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
              <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/[0.15] blur-[120px]" />
              <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/[0.12] blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[10%] w-[450px] h-[450px] rounded-full bg-teal-500/[0.10] blur-[120px]" />
              <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-500/[0.08] blur-[100px]" />
            </>
          )}
        </div>
        
        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col">
          <NewHeader />
          
          <main className="flex-1 pb-6">
            <SearchPanel />
          </main>
          
          {/* Footer */}
          <footer className="text-center py-4 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[10px] text-white/30 font-medium tracking-wider">
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
