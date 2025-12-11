import Header from "@/components/Header";
import NumberDetailFinder from "@/components/NumberDetailFinder";
import ShubhCam from "@/components/ShubhCam";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 scanline pointer-events-none z-50" />
      
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-neon-green/5" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-12">
        <Header />
        <main className="max-w-2xl mx-auto">
          <NumberDetailFinder />
          <ShubhCam />
        </main>
      </div>
      
      {/* Floating elements */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green via-neon-pink to-neon-cyan animate-pulse" />
    </div>
  );
};

export default Index;
