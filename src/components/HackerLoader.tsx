import { useEffect, useState } from "react";

const HackerLoader = () => {
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);

  const hackerLines = [
    "$ Initializing connection...",
    "$ Bypassing firewall [████████] 100%",
    "$ Accessing secure database...",
    "$ Decrypting data packets...",
    "$ Extracting target information...",
    "$ Compiling results..."
  ];

  // Matrix rain characters
  useEffect(() => {
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
    const interval = setInterval(() => {
      setMatrixChars(prev => {
        const newChars = [...prev];
        for (let i = 0; i < 20; i++) {
          newChars[i] = chars[Math.floor(Math.random() * chars.length)];
        }
        return newChars;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (lineIndex >= hackerLines.length) {
      setLineIndex(0);
      setCharIndex(0);
      setText("");
      return;
    }

    const currentLine = hackerLines[lineIndex];
    
    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + currentLine[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
        setText(prev => prev + "\n");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex]);

  return (
    <div className="relative overflow-hidden border-2 border-neon-cyan/50 rounded-2xl bg-background/95 p-6 shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3),inset_0_0_60px_hsl(var(--neon-cyan)/0.05)]">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent animate-scan-line" />
      </div>
      
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
        <div className="flex justify-around text-neon-green text-xs font-mono">
          {matrixChars.map((char, i) => (
            <span 
              key={i} 
              className="animate-matrix-fall"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Cyber corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan animate-pulse" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan animate-pulse" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan animate-pulse" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan animate-pulse" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hacker icon with pulse */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-neon-cyan flex items-center justify-center bg-background/80 animate-pulse shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]">
              <svg className="w-8 h-8 text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-dashed border-neon-green/50 animate-spin-slow" />
            {/* Pulse rings */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border border-neon-cyan/50 animate-ping" />
          </div>
        </div>

        {/* Terminal text */}
        <div className="bg-background/60 rounded-lg p-3 font-mono text-xs text-neon-green border border-neon-green/30 min-h-[120px] max-h-[160px] overflow-hidden">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neon-green/20">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="text-muted-foreground ml-2 text-[10px]">terminal@shubh-osint</span>
          </div>
          <pre className="whitespace-pre-wrap break-all leading-relaxed">
            {text}
            <span className="animate-cursor-blink text-neon-cyan">█</span>
          </pre>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
            <span>SCANNING...</span>
            <span className="animate-pulse">ACTIVE</span>
          </div>
          <div className="h-1.5 bg-background/80 rounded-full overflow-hidden border border-neon-cyan/30">
            <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-cyan animate-progress-slide rounded-full shadow-[0_0_10px_hsl(var(--neon-cyan))]" />
          </div>
        </div>

        {/* Glitch text */}
        <p className="text-center mt-4 text-sm font-display tracking-widest text-neon-cyan animate-text-glitch">
          ACCESSING DATABASE
        </p>
      </div>
    </div>
  );
};

export default HackerLoader;
