import { useEffect, useState } from "react";

const HackerLoader = () => {
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState("SHUBH OSINT");
  const [dots, setDots] = useState("");

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Glitch text effect
  useEffect(() => {
    const chars = "!@#$%^&*()_+SHUBOSINT";
    const originalText = "SHUBH OSINT";
    
    const interval = setInterval(() => {
      const glitched = originalText
        .split("")
        .map((char, i) => 
          Math.random() > 0.85 ? chars[Math.floor(Math.random() * chars.length)] : char
        )
        .join("");
      setGlitchText(glitched);
      
      setTimeout(() => setGlitchText(originalText), 100);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative overflow-hidden rounded-2xl bg-background/95 p-6">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink bg-[length:200%_100%] animate-gradient-x opacity-60" />
        <div className="absolute inset-[2px] rounded-2xl bg-background" />
        
        {/* Floating orbs */}
        <div className="absolute top-4 left-4 w-20 h-20 bg-neon-pink/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-neon-cyan/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent animate-scan-line" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-scan-line" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Logo/Icon */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="absolute -inset-3 rounded-full border-2 border-dashed border-neon-pink/40 animate-spin" style={{ animationDuration: '8s' }} />
            
            {/* Middle pulsing ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan opacity-30 animate-pulse blur-sm" />
            
            {/* Main icon container */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 border border-neon-pink/50 flex items-center justify-center shadow-[0_0_30px_hsl(var(--neon-pink)/0.4)]">
              {/* Hexagon shape inside */}
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 2L21 7V17L12 22L3 17V7L12 2Z" 
                  className="stroke-neon-cyan fill-neon-cyan/10" 
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="12" r="3" className="fill-neon-pink animate-pulse" />
              </svg>
            </div>
            
            {/* Ping effect */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border border-neon-cyan/60 animate-ping" />
          </div>

          {/* Glitch title */}
          <h1 className="font-display text-xl font-bold tracking-[0.3em] bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-pulse">
            {glitchText}
          </h1>

          {/* Progress bar */}
          <div className="w-full max-w-[200px]">
            <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink rounded-full transition-all duration-100 shadow-[0_0_10px_hsl(var(--neon-pink))]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status text */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_hsl(var(--neon-cyan))]" />
            <span className="text-neon-cyan">INITIALIZING{dots}</span>
          </div>

          {/* Binary decoration */}
          <div className="flex gap-1 opacity-30 font-mono text-[8px] text-neon-pink">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-pink rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-cyan rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-cyan rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-pink rounded-br-lg" />
      </div>
    </div>
  );
};

export default HackerLoader;
