import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Animated gradient background */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Custom background image */}
          {settings.backgroundImage ? (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${settings.backgroundImage})`,
                opacity: (100 - parseInt(settings.backgroundOpacity || "30")) / 100
              }}
            />
          ) : (
            <>
              {/* Gradient orbs */}
              <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
              <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            </>
          )}
          
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-background"
            style={{ 
              opacity: parseInt(settings.backgroundOpacity || "30") / 100
            }}
          />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-6 pt-4">
          <Header />
          
          <main className="max-w-3xl mx-auto mt-4">
            <NumberDetailFinder />
          </main>
          
          {/* Footer */}
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-xs text-muted-foreground/50">
              ⚠ For educational purposes only • Use responsibly
            </p>
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;