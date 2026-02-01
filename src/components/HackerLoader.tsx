import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface HackerLoaderProps {
  inline?: boolean;
}

const HackerLoader = ({ inline = false }: HackerLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

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
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-neon-cyan/8 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative flex flex-col items-center gap-6">
        {/* Main loader */}
        <div className="relative">
          {/* Glow ring */}
          <div className="absolute -inset-6 bg-gradient-to-r from-neon-green/30 via-neon-cyan/20 to-neon-green/30 rounded-3xl blur-2xl" />
          
          {/* Icon container */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-card to-background border-2 border-neon-green/40 flex items-center justify-center overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent" />
            
            {/* Rotating element */}
            <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
            
            {/* Corner accents */}
            <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-neon-cyan/60 rounded-tl" />
            <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-neon-cyan/60 rounded-tr" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-neon-cyan/60 rounded-bl" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-neon-cyan/60 rounded-br" />
          </div>
          
          {/* Orbiting dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 animate-spin" style={{ animationDuration: '2s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_hsl(var(--neon-cyan))]" />
          </div>
        </div>
        
        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-display font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green bg-clip-text text-transparent">
            Initializing{dots}
          </h2>
          <p className="text-xs text-muted-foreground/60 font-medium">Secure connection established</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-56 h-1.5 bg-muted/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green rounded-full transition-all duration-75 shadow-[0_0_10px_hsl(var(--neon-green)/0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30">
          <Zap className="w-3 h-3 text-neon-green" />
          <span className="text-[10px] text-neon-green font-bold tracking-wider uppercase">System Active</span>
        </div>
      </div>
    </div>
  );
};

export default HackerLoader;
