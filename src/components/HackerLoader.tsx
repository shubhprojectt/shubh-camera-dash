import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import defaultLoaderImage from "@/assets/loader-logo.jpg";

interface HackerLoaderProps {
  inline?: boolean;
}

const HackerLoader = ({ inline = false }: HackerLoaderProps) => {
   const { settings, isLoaded } = useSettings();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");
   
   // Use custom image from settings or default bundled image
   const loaderImage = settings.loaderImageUrl?.trim() || defaultLoaderImage;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Inline compact version
  if (inline) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 rounded-full blur-xl" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/15 to-neon-cyan/15 border-2 border-neon-green/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-neon-green animate-spin" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-sm text-neon-green font-semibold tracking-wide">Searching{dots}</span>
        </div>
        
        <div className="w-40 h-1.5 bg-muted/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Full screen version - Clean and attractive
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
       <div className="relative flex flex-col items-center gap-8">
         {/* Logo Image with glow ring */}
        <div className="relative">
           {/* Outer glow */}
           <div className="absolute -inset-4 bg-gradient-to-r from-neon-purple/40 via-neon-pink/30 to-neon-purple/40 rounded-full blur-2xl animate-pulse" />
          
           {/* Image container with animated border */}
           <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-neon-purple/60 shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)]">
             <img 
               src={loaderImage} 
               alt="Loading" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
        
         {/* Spinner */}
         <div className="relative">
           <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
        </div>
        
         {/* Loading text */}
         <h2 className="text-sm font-display font-bold tracking-[0.3em] uppercase text-neon-purple">
           SYSTEM LOADING{dots}
         </h2>
      </div>
    </div>
  );
};

export default HackerLoader;
