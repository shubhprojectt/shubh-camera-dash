import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import PasswordProtection from "@/components/PasswordProtection";

const Index = () => {
  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Deep space gradient base */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0d1a] to-[#0a0f0a]" />
        
        {/* Animated mesh gradient */}
        <div className="fixed inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(0,255,136,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,rgba(255,0,128,0.15),transparent)]" />
        </div>
        
        {/* Cyber grid background */}
        <div className="fixed inset-0 cyber-grid opacity-20" />
        
        {/* Rainbow floating neon orbs with color cycling */}
        <div className="fixed top-10 left-[10%] w-72 h-72 rounded-full blur-[100px] animate-float bg-gradient-to-r from-neon-green via-neon-cyan to-neon-blue opacity-30" style={{ animation: 'float 8s ease-in-out infinite, gradient-shift 6s ease infinite' }} />
        <div className="fixed bottom-10 right-[10%] w-96 h-96 rounded-full blur-[120px] animate-float bg-gradient-to-r from-neon-pink via-neon-purple to-neon-red opacity-25" style={{ animation: 'float 10s ease-in-out infinite, gradient-shift 8s ease infinite', animationDelay: '-2s' }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] bg-gradient-to-tr from-neon-cyan via-neon-pink to-neon-yellow opacity-20" style={{ animation: 'pulse 4s ease-in-out infinite, gradient-shift 10s ease infinite' }} />
        <div className="fixed top-[20%] right-[20%] w-48 h-48 rounded-full blur-[80px] bg-gradient-to-br from-neon-purple via-neon-pink to-neon-orange opacity-30" style={{ animation: 'float 7s ease-in-out infinite, gradient-shift 5s ease infinite', animationDelay: '-4s' }} />
        <div className="fixed bottom-[30%] left-[15%] w-56 h-56 rounded-full blur-[90px] bg-gradient-to-r from-neon-orange via-neon-yellow to-neon-green opacity-25" style={{ animation: 'float 9s ease-in-out infinite, gradient-shift 7s ease infinite', animationDelay: '-3s' }} />
        <div className="fixed top-[60%] right-[30%] w-40 h-40 rounded-full blur-[70px] bg-gradient-to-bl from-neon-red via-neon-pink to-neon-cyan opacity-20" style={{ animation: 'float 6s ease-in-out infinite, gradient-shift 4s ease infinite', animationDelay: '-1s' }} />
        <div className="fixed top-[15%] left-[40%] w-32 h-32 rounded-full blur-[60px] bg-gradient-to-r from-neon-yellow via-neon-green to-neon-cyan opacity-25" style={{ animation: 'float 5s ease-in-out infinite, gradient-shift 6s ease infinite', animationDelay: '-5s' }} />
        
        {/* Moving light streaks */}
        <div className="fixed top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="fixed top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-neon-pink/20 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        
        {/* Scanline effect */}
        <div className="fixed inset-0 scanline pointer-events-none z-50" />
        
        {/* Noise texture overlay */}
        <div className="fixed inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Header />
          <main className="max-w-3xl mx-auto">
            <NumberDetailFinder />
          </main>
        </div>
        
        {/* Top corner decorations */}
        <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-green/30" />
        <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-pink/30" />
        <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-cyan/30" />
        <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-purple/30" />
        
        {/* Animated bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green via-neon-pink via-neon-cyan to-neon-purple animate-gradient-shift" />
        
        {/* Side accent lines - hidden on mobile, visible on larger screens */}
        <div className="fixed left-0 md:left-2 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-neon-green/50 to-transparent" />
        <div className="fixed right-0 md:right-2 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-neon-pink/50 to-transparent" />
      </div>
    </PasswordProtection>
  );
};

export default Index;