import { Zap, Shield, Wifi } from "lucide-react";

const Header = () => {
  return (
    <header className="relative py-10 text-center">
      {/* Floating cyber decorations */}
      <div className="absolute top-4 right-8 w-16 h-16 border-2 border-neon-pink/50 rotate-12 animate-float glow-pink" />
      <div className="absolute top-16 right-16 w-10 h-10 border-2 border-neon-cyan/50 rotate-45 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-8 left-8 w-12 h-12 border-2 border-neon-purple/50 -rotate-12 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-20 left-16 w-8 h-8 bg-neon-green/20 rotate-45 animate-pulse" />
      
      {/* Status indicators */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-neon-green">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span>SYSTEM: ONLINE</span>
        </div>
        <div className="flex items-center gap-2 text-neon-cyan">
          <Wifi className="w-3 h-3" />
          <span>NETWORK: SECURE</span>
        </div>
      </div>
      
      {/* Logo */}
      <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-neon-green mb-6 neon-border">
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/10 animate-pulse" />
        <Zap className="w-12 h-12 text-neon-green relative z-10 animate-neon-flicker" />
      </div>
      
      {/* Title */}
      <h1 className="font-display text-5xl md:text-6xl font-black tracking-wider mb-2">
        <span className="text-neon-green text-glow-green animate-neon-flicker">SHUBH</span>
        <span className="text-neon-pink text-glow-pink ml-3">OSINT</span>
      </h1>
      
      {/* Subtitle with cyber styling */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="h-px w-20 bg-gradient-to-r from-transparent to-neon-green" />
        <p className="text-neon-cyan tracking-[0.6em] text-sm font-bold text-glow-cyan">
          INTELLIGENCE SYSTEM
        </p>
        <div className="h-px w-20 bg-gradient-to-l from-transparent to-neon-green" />
      </div>
      
      {/* Decorative cyber elements */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <div className="flex items-center gap-2 px-4 py-2 border border-neon-green/30 bg-neon-green/5 rounded">
          <Shield className="w-4 h-4 text-neon-green" />
          <span className="text-xs text-neon-green font-mono">ENCRYPTED</span>
        </div>
        <div className="w-3 h-3 bg-neon-pink rotate-45 animate-pulse" />
        <div className="flex items-center gap-2 px-4 py-2 border border-neon-pink/30 bg-neon-pink/5 rounded">
          <span className="text-xs text-neon-pink font-mono">v2.0.1</span>
        </div>
      </div>
      
      {/* Bottom decorative line */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-neon-green to-neon-pink" />
        <div className="w-3 h-3 border-2 border-neon-cyan rotate-45 animate-cyber-pulse" style={{ color: 'hsl(var(--neon-cyan))' }} />
        <div className="h-0.5 w-24 bg-gradient-to-l from-transparent via-neon-pink to-neon-green" />
      </div>
    </header>
  );
};

export default Header;