import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cyber grid background */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      
      {/* Animated gradient orbs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Scanline effect */}
      <div className="fixed inset-0 scanline pointer-events-none z-50" />
      
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-neon-purple/10" />
      
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
      
      {/* Side accent lines */}
      <div className="fixed left-4 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-neon-green/50 to-transparent" />
      <div className="fixed right-4 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-neon-pink/50 to-transparent" />
    </div>
  );
};

export default Index;