import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, Zap, Database, Terminal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

// Matrix rain characters
const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MatrixRain = () => {
  const [columns, setColumns] = useState<{ id: number; left: number; delay: number; duration: number; chars: string[] }[]>([]);

  useEffect(() => {
    const cols = [];
    const numColumns = Math.floor(window.innerWidth / 20);
    for (let i = 0; i < numColumns; i++) {
      const chars = [];
      for (let j = 0; j < 20; j++) {
        chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
      }
      cols.push({
        id: i,
        left: i * 20 + Math.random() * 10,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 5,
        chars
      });
    }
    setColumns(cols);
  }, []);

  return (
    <div className="matrix-rain opacity-20">
      {columns.map(col => (
        <span
          key={col.id}
          style={{
            left: `${col.left}px`,
            animationDelay: `${col.delay}s`,
            animationDuration: `${col.duration}s`,
          }}
        >
          {col.chars.map((char, idx) => (
            <span key={idx} style={{ display: 'block', opacity: 1 - idx * 0.05 }}>{char}</span>
          ))}
        </span>
      ))}
    </div>
  );
};

const Index = () => {
  const { settings } = useSettings();
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTyping(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-x-hidden crt-effect">
        {/* Matrix Rain Background */}
        <MatrixRain />
        
        {/* Scan Lines Overlay */}
        <div className="scan-lines opacity-30" />
        
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
        
        {/* Dark overlay for readability */}
        <div 
          className="bg-fixed-stable bg-background pointer-events-none"
          style={{ 
            opacity: (parseInt(settings.backgroundOpacity || "30") / 100)
          }}
        />
        
        <div className="bg-fixed-stable bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-cyan/5 pointer-events-none" />
        
        {/* Data Grid Background */}
        <div className="bg-fixed-stable data-grid-bg pointer-events-none opacity-50" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 pb-6">
          <Header />
          
          {/* Hacker Terminal Header */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="terminal-box rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neon-red/80" />
                  <div className="w-3 h-3 rounded-full bg-neon-yellow/80" />
                  <div className="w-3 h-3 rounded-full bg-neon-green/80" />
                </div>
                <span className="text-[10px] font-mono text-neon-green/60 ml-2">root@shubh-osint:~</span>
                <div className="pulse-dot ml-auto" />
              </div>
              <div className="font-mono text-xs text-neon-green">
                <span className="text-neon-cyan">$</span> 
                <span className={showTyping ? "animate-typing inline-block" : ""}>
                  {" "}Initializing OSINT Database... <span className="text-neon-pink">[CONNECTED]</span>
                </span>
                <span className="animate-cursor-blink ml-1">▊</span>
              </div>
            </div>
          </div>
          
          {/* Compact Stats Bar */}
          <div className="max-w-3xl mx-auto mb-3">
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-green/30 animate-hologram cyber-corners">
                <Database className="w-3 h-3 text-neon-green animate-pulse" />
                <span className="text-[10px] font-mono text-neon-green">1B+ Records</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-cyan/30 hacker-border">
                <Zap className="w-3 h-3 text-neon-cyan animate-electric-zap" />
                <span className="text-[10px] font-mono text-neon-cyan">Fast</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-pink/30 animate-glitch-skew">
                <Sparkles className="w-3 h-3 text-neon-pink" />
                <span className="text-[10px] font-mono text-neon-pink animate-text-glitch" data-text="AI">AI</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-orange/30">
                <Terminal className="w-3 h-3 text-neon-orange animate-pulse" />
                <span className="text-[10px] font-mono text-neon-orange">OSINT</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-purple/30">
                <Wifi className="w-3 h-3 text-neon-purple animate-radar-sweep" />
                <span className="text-[10px] font-mono text-neon-purple">LIVE</span>
              </div>
            </div>
          </div>
          
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
        </div>
        
        {/* Animated corner decorations */}
        <div className="fixed top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-neon-green/50 rounded-br-xl animate-border-glow" />
        <div className="fixed top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-neon-pink/50 rounded-bl-xl animate-glow-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="fixed bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-neon-cyan/50 rounded-tr-xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
        <div className="fixed bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-neon-purple/50 rounded-tl-xl animate-border-glow" style={{ animationDelay: '1.5s' }} />
        
        {/* Corner Status Indicators */}
        <div className="fixed top-4 left-4 flex items-center gap-2 z-20">
          <div className="pulse-dot" />
          <span className="text-[8px] font-mono text-neon-green/60 hidden md:block">SYSTEM ACTIVE</span>
        </div>
        <div className="fixed top-4 right-4 flex items-center gap-2 z-20">
          <span className="text-[8px] font-mono text-neon-cyan/60 hidden md:block animate-pulse">SECURE CONNECTION</span>
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;
