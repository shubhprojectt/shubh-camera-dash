import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

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
        
        {/* Dark overlay for readability - hide when sectionTransparent is enabled */}
        {!settings.sectionTransparent && (
          <div 
            className="bg-fixed-stable bg-background pointer-events-none"
            style={{ 
              opacity: (parseInt(settings.backgroundOpacity || "30") / 100)
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 pb-4 pt-2">
          <Header />
          
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