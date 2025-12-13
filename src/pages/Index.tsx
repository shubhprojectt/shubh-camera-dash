import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { settings } = useSettings();

  return (
    <PasswordProtection>
      <div className="h-screen bg-black relative overflow-hidden">
        {/* Custom background image or solid black */}
        {settings.backgroundImage ? (
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.backgroundImage})` }}
          />
        ) : (
          <div className="fixed inset-0 bg-black" />
        )}
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Header />
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
        </div>
        
      </div>
    </PasswordProtection>
  );
};

export default Index;