import { Phone } from "lucide-react";

const Header = () => {
  return (
    <header className="relative py-8 text-center">
      {/* Floating cubes decoration */}
      <div className="absolute top-4 right-8 w-12 h-12 bg-neon-pink/30 rotate-12 animate-pulse" />
      <div className="absolute top-12 right-4 w-8 h-8 bg-neon-cyan/30 rotate-45" />
      
      {/* Logo */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-neon-green glow-green mb-4">
        <Phone className="w-10 h-10 text-neon-green" />
      </div>
      
      {/* Title */}
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider">
        <span className="text-neon-green text-glow-green">SHUBH</span>
        <span className="text-neon-pink text-glow-pink ml-2">OSINT</span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-muted-foreground tracking-[0.5em] mt-2 text-sm">
        CHUTTTT
      </p>
      
      {/* Decorative line */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-neon-green" />
        <div className="w-2 h-2 bg-neon-green rotate-45" />
        <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-neon-green" />
      </div>
    </header>
  );
};

export default Header;
