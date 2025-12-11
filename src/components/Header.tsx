import { Zap, Wifi, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="relative py-4 text-center">
      {/* Status indicators */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-neon-green">
          <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-neon-cyan">
          <Wifi className="w-2.5 h-2.5" />
          <span>SECURE</span>
        </div>
      </div>

      {/* Admin Link */}
      <Link 
        to="/admin" 
        className="absolute top-2 right-2 p-2 rounded-lg border border-neon-orange/50 text-neon-orange hover:bg-neon-orange/10 transition-all hover:shadow-[0_0_10px_hsl(var(--neon-orange)/0.5)]"
      >
        <Settings className="w-4 h-4" />
      </Link>
      
      {/* Logo */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-neon-green mb-3">
        <Zap className="w-8 h-8 text-neon-green animate-neon-flicker" />
      </div>
      
      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl font-black tracking-wider">
        <span className="text-neon-green text-glow-green">SHUBH</span>
        <span className="text-neon-pink text-glow-pink ml-2">OSINT</span>
      </h1>
    </header>
  );
};

export default Header;