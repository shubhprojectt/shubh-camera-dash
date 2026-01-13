import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, Zap, Database, Terminal, Wifi, Shield, Lock, Eye, Cpu, Radio } from "lucide-react";
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

// Floating hex particles
const FloatingParticles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  
  useEffect(() => {
    const p = [];
    for (let i = 0; i < 15; i++) {
      p.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 5
      });
    }
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-neon-cyan/30 animate-float-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px hsl(var(--neon-cyan))`,
          }}
        />
      ))}
    </div>
  );
};

const Index = () => {
  const { settings } = useSettings();
  const [showTyping, setShowTyping] = useState(true);
  const [glitchTitle, setGlitchTitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTyping(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Random glitch effect on title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchTitle(true);
      setTimeout(() => setGlitchTitle(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-x-hidden crt-effect">
        {/* Matrix Rain Background */}
        <MatrixRain />
        
        {/* Floating Particles */}
        <FloatingParticles />
        
        {/* Scan Lines Overlay */}
        <div className="scan-lines opacity-30" />
        
        {/* Animated gradient orbs */}
        <div className="fixed top-1/4 -left-32 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="fixed bottom-1/4 -right-32 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
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
          
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-6 text-center">
            {/* Glowing Title */}
            <div className="relative inline-block mb-4">
              <h1 
                className={`text-4xl md:text-6xl font-display font-black tracking-wider ${glitchTitle ? 'animate-glitch' : ''}`}
                data-text="SHUBH OSINT"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink animate-gradient-x">
                  SHUBH OSINT
                </span>
              </h1>
              {/* Glow effect behind title */}
              <div className="absolute inset-0 text-4xl md:text-6xl font-display font-black tracking-wider text-neon-cyan/30 blur-xl -z-10">
                SHUBH OSINT
              </div>
            </div>
            
            {/* Subtitle with typing effect */}
            <p className="text-muted-foreground text-sm md:text-base font-mono mb-4">
              <span className="text-neon-green">&gt;</span> Advanced Intelligence Gathering System
              <span className="animate-cursor-blink ml-1">_</span>
            </p>
            
            {/* Animated status line */}
            <div className="flex items-center justify-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_hsl(var(--neon-green))]" />
                <span className="text-neon-green">ONLINE</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-neon-cyan">v3.0.1</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-neon-pink animate-pulse">ENCRYPTED</span>
            </div>
          </div>
          
          {/* Hacker Terminal Header */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="terminal-box rounded-lg p-3 mb-3 hover:shadow-[0_0_30px_hsl(var(--neon-green)/0.3)] transition-shadow duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neon-red/80 hover:bg-neon-red transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-neon-yellow/80 hover:bg-neon-yellow transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-neon-green/80 hover:bg-neon-green transition-colors cursor-pointer" />
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
          
          {/* Stats Cards */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="group relative p-3 rounded-lg bg-card/50 border border-neon-green/30 hover:border-neon-green hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.3)] transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Database className="w-5 h-5 text-neon-green mb-1 group-hover:animate-bounce" />
                <p className="text-lg font-bold text-neon-green font-mono">1B+</p>
                <p className="text-[10px] text-muted-foreground">Records</p>
              </div>
              
              <div className="group relative p-3 rounded-lg bg-card/50 border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-5 h-5 text-neon-cyan mb-1 group-hover:animate-electric-zap" />
                <p className="text-lg font-bold text-neon-cyan font-mono">&lt;1s</p>
                <p className="text-[10px] text-muted-foreground">Response</p>
              </div>
              
              <div className="group relative p-3 rounded-lg bg-card/50 border border-neon-pink/30 hover:border-neon-pink hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.3)] transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="w-5 h-5 text-neon-pink mb-1 group-hover:animate-pulse" />
                <p className="text-lg font-bold text-neon-pink font-mono">AI</p>
                <p className="text-[10px] text-muted-foreground">Powered</p>
              </div>
              
              <div className="group relative p-3 rounded-lg bg-card/50 border border-neon-orange/30 hover:border-neon-orange hover:shadow-[0_0_20px_hsl(var(--neon-orange)/0.3)] transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Shield className="w-5 h-5 text-neon-orange mb-1 group-hover:animate-bounce" />
                <p className="text-lg font-bold text-neon-orange font-mono">100%</p>
                <p className="text-[10px] text-muted-foreground">Secure</p>
              </div>
              
              <div className="group relative p-3 rounded-lg bg-card/50 border border-neon-purple/30 hover:border-neon-purple hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)] transition-all duration-300 cursor-pointer overflow-hidden col-span-2 md:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Radio className="w-5 h-5 text-neon-purple mb-1 group-hover:animate-pulse" />
                <p className="text-lg font-bold text-neon-purple font-mono">LIVE</p>
                <p className="text-[10px] text-muted-foreground">Updates</p>
              </div>
            </div>
          </div>
          
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
        
        {/* Animated corner decorations */}
        <div className="fixed top-0 left-0 w-24 h-24 pointer-events-none">
          <div className="absolute top-2 left-2 w-16 h-16 border-l-2 border-t-2 border-neon-green/60 rounded-br-xl animate-border-glow" />
          <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-neon-cyan/40 rounded-br-lg" />
        </div>
        <div className="fixed top-0 right-0 w-24 h-24 pointer-events-none">
          <div className="absolute top-2 right-2 w-16 h-16 border-r-2 border-t-2 border-neon-pink/60 rounded-bl-xl animate-glow-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-neon-purple/40 rounded-bl-lg" />
        </div>
        <div className="fixed bottom-0 left-0 w-24 h-24 pointer-events-none">
          <div className="absolute bottom-2 left-2 w-16 h-16 border-l-2 border-b-2 border-neon-cyan/60 rounded-tr-xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-neon-green/40 rounded-tr-lg" />
        </div>
        <div className="fixed bottom-0 right-0 w-24 h-24 pointer-events-none">
          <div className="absolute bottom-2 right-2 w-16 h-16 border-r-2 border-b-2 border-neon-purple/60 rounded-tl-xl animate-border-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-neon-pink/40 rounded-tl-lg" />
        </div>
        
        {/* Corner Status Indicators */}
        <div className="fixed top-4 left-4 flex items-center gap-2 z-20">
          <div className="pulse-dot" />
          <span className="text-[8px] font-mono text-neon-green/60 hidden md:block">SYSTEM ACTIVE</span>
        </div>
        <div className="fixed top-4 right-4 flex items-center gap-2 z-20">
          <span className="text-[8px] font-mono text-neon-cyan/60 hidden md:block animate-pulse">SECURE CONNECTION</span>
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
        </div>
        
        {/* Scan beam effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent animate-scan-line" />
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Index;
