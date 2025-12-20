import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-[100dvh] bg-black relative overflow-hidden">
        {/* Custom background image or solid black */}
        {settings.backgroundImage ? (
          <div 
            className="fixed-viewport bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.backgroundImage})` }}
          />
        ) : (
          <div className="fixed-viewport bg-black" />
        )}
        
        {/* Dark overlay for readability - dynamic opacity */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: (parseInt(settings.backgroundOpacity || "30") / 100) }}
        />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(0,255,136,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,rgba(255,0,128,0.15),transparent)]" />
        </div>
        
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Floating neon orbs */}
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-neon-green/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-neon-pink/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-[20%] right-[20%] w-48 h-48 bg-neon-purple/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-4s' }} />
        
        {/* Moving light streaks */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-neon-pink/20 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Header />
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
            
            {/* Mini Music Player */}
            <div className="mt-6">
              <MiniMusicPlayer musicUrl={settings.mainPageMusicUrl} />
            </div>
          </main>
        </div>
        
        {/* Top corner decorations */}
        <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-green/30" />
        <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-pink/30" />
        <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-cyan/30" />
        <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-purple/30" />
      
      </div>
    </PasswordProtection>
  );
};

export default Index;
