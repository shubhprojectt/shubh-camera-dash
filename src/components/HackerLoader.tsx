import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface HackerLoaderProps {
  inline?: boolean;
}

const HackerLoader = ({ inline = false }: HackerLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 3));
    }, 50);
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
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="relative">
          <div className="absolute -inset-2 bg-neon-green/20 rounded-full blur-lg animate-pulse" />
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/40 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-neon-green animate-spin" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-neon-green font-medium">Searching{dots}</span>
        </div>
        
        <div className="w-32 h-1 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Full screen version
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-neon-green/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
          </div>
        </div>
        
        <h2 className="text-lg font-display font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
          Loading{dots}
        </h2>
        
        <div className="w-48 h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HackerLoader;
