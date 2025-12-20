import { useState, useEffect } from "react";
import { 
  ClipboardPaste, 
  Search, 
  Loader2, 
  ArrowLeft, 
  Zap, 
  Shield, 
  Sparkles,
  Globe,
  Database,
  Wifi,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";

const Page2 = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("manual");
  const [hasAccess, setHasAccess] = useState(false);

  // Check if user came through main page with password
  useEffect(() => {
    const isUnlocked = sessionStorage.getItem("site_unlocked");
    if (isUnlocked === "true") {
      setHasAccess(true);
    } else {
      // Redirect to main page if not unlocked
      toast({
        title: "Access Denied",
        description: "Pehle main page se password enter karein",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate]);

  const manualTab = settings.tabs.find(tab => tab.searchType === "manual");

  const logSearchHistory = async (searchType: string, query: string) => {
    try {
      await supabase.from("search_history").insert({
        search_type: searchType,
        search_query: query,
      });
    } catch (err) {
      console.error("Failed to log search:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    await logSearchHistory("manual", searchQuery.trim());
    setLoading(true);

    const apiUrl = `${manualTab?.apiUrl || "https://hydrashop.in.net/number.php?q="}${encodeURIComponent(searchQuery.trim())}`;
    window.open(apiUrl, '_blank');
    
    setLoading(false);
    toast({
      title: "Opening API",
      description: `Opening search for: ${searchQuery}`,
    });
  };

  // Show nothing while checking access or if no access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-yellow animate-spin" />
      </div>
    );
  }

  if (!manualTab?.enabled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Manual tab is disabled</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Complex Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-neon-yellow/5 to-neon-orange/5 pointer-events-none" />
      
      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none animate-pulse"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-yellow)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-yellow)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      
      {/* Multiple Floating Orbs */}
      <div className="fixed top-10 left-10 w-40 h-40 bg-neon-yellow/15 rounded-full blur-3xl animate-pulse" />
      <div className="fixed top-40 right-20 w-32 h-32 bg-neon-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="fixed bottom-20 left-1/4 w-48 h-48 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-40 right-10 w-36 h-36 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neon-yellow/5 rounded-full blur-3xl" />
      
      {/* Animated Corner Decorations */}
      <div className="fixed top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-neon-yellow/40 pointer-events-none" style={{ animation: 'cornerPulse 2s ease-in-out infinite' }} />
      <div className="fixed top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-neon-orange/40 pointer-events-none" style={{ animation: 'cornerPulse 2s ease-in-out infinite', animationDelay: '0.5s' }} />
      <div className="fixed bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-neon-orange/40 pointer-events-none" style={{ animation: 'cornerPulse 2s ease-in-out infinite', animationDelay: '1s' }} />
      <div className="fixed bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-neon-yellow/40 pointer-events-none" style={{ animation: 'cornerPulse 2s ease-in-out infinite', animationDelay: '1.5s' }} />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-md min-h-screen flex flex-col">
        
        {/* Header Section - Like Main Page */}
        <header className="relative py-4 text-center mb-4">
          {/* Status indicators */}
          <div className="absolute top-2 left-0 flex flex-col gap-1 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-neon-yellow">
              <div className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-pulse" />
              <span>PAGE 2</span>
            </div>
            <div className="flex items-center gap-1.5 text-neon-cyan">
              <Wifi className="w-2.5 h-2.5" />
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Back Button */}
          <Link 
            to="/" 
            className="absolute top-2 right-0 p-2 rounded-lg border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all hover:shadow-[0_0_10px_hsl(var(--neon-cyan)/0.5)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          {/* Logo */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-neon-yellow mb-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-yellow/20 to-neon-orange/10" />
            <ClipboardPaste className="w-8 h-8 text-neon-yellow animate-pulse relative z-10" />
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-neon-orange/30 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black tracking-wider">
            <span className="text-neon-yellow text-glow-yellow">{manualTab.label}</span>
            <span className="text-neon-orange ml-2">TOOLS</span>
          </h1>
        </header>

        {/* Tab Section - Like Main Page */}
        <div className="space-y-3">
          <div className="relative">
            <div className="relative rounded-2xl p-3 overflow-hidden border border-neon-yellow/30 bg-card/50 backdrop-blur-sm">
              
              {/* Tab Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {/* Manual Tab */}
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 animate-bounce-in ${
                    activeTab === "manual"
                      ? 'border-neon-yellow bg-neon-yellow/20 shadow-[0_0_20px_hsl(var(--neon-yellow)/0.4)]'
                      : 'border-neon-yellow/30 bg-neon-yellow/5 hover:bg-neon-yellow/10'
                  }`}
                >
                  <ClipboardPaste className={`w-5 h-5 ${activeTab === "manual" ? 'text-neon-yellow animate-pulse' : 'text-neon-yellow/70'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === "manual" ? 'text-neon-yellow' : 'text-neon-yellow/70'}`}>
                    {manualTab.label}
                  </span>
                </button>

                {/* Coming Soon Tab 1 */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-neon-purple/20 bg-neon-purple/5 opacity-50 cursor-not-allowed animate-bounce-in" style={{ animationDelay: '50ms' }}>
                  <Database className="w-5 h-5 text-neon-purple/50" />
                  <span className="text-[10px] font-bold text-neon-purple/50 uppercase tracking-wider">Soon</span>
                </div>

                {/* Coming Soon Tab 2 */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-neon-cyan/20 bg-neon-cyan/5 opacity-50 cursor-not-allowed animate-bounce-in" style={{ animationDelay: '100ms' }}>
                  <Globe className="w-5 h-5 text-neon-cyan/50" />
                  <span className="text-[10px] font-bold text-neon-cyan/50 uppercase tracking-wider">Soon</span>
                </div>

                {/* Back to Main Button */}
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-neon-green/50 bg-gradient-to-br from-neon-green/10 to-neon-cyan/5 hover:from-neon-green/20 hover:to-neon-cyan/10 transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] group animate-bounce-in col-span-3"
                  style={{ animationDelay: '150ms' }}
                >
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-neon-green group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold text-neon-green uppercase tracking-wider">Back to Main Page</span>
                  </div>
                </Link>
              </div>
              
              {/* Search Input Section */}
              {activeTab === "manual" && (
                <div className="relative animate-slide-up">
                  <div className="flex gap-2 p-2 rounded-xl bg-background/80 border-2 border-neon-yellow/40 shadow-[0_0_15px_hsl(var(--neon-yellow)/0.2)]">
                    <div className="flex-1 flex items-center gap-2 px-2">
                      <ClipboardPaste className="w-4 h-4 text-neon-yellow/70" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={manualTab.placeholder || "Enter number..."}
                        className="flex-1 bg-transparent border-0 text-neon-yellow placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm font-mono"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      disabled={loading}
                      className="bg-gradient-to-r from-neon-yellow to-neon-orange text-background font-bold px-6 h-10 hover:opacity-90 text-xs shadow-[0_0_15px_hsl(var(--neon-yellow)/0.5)] transition-all active:scale-95"
                      style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-2 gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-3 rounded-xl bg-neon-yellow/5 border border-neon-yellow/20 text-center">
              <Zap className="w-5 h-5 text-neon-yellow mx-auto mb-1.5 animate-pulse" />
              <p className="text-[9px] text-neon-yellow/70 uppercase tracking-wider font-bold">Fast Results</p>
            </div>
            <div className="p-3 rounded-xl bg-neon-orange/5 border border-neon-orange/20 text-center">
              <Shield className="w-5 h-5 text-neon-orange mx-auto mb-1.5" />
              <p className="text-[9px] text-neon-orange/70 uppercase tracking-wider font-bold">Opens New Tab</p>
            </div>
            <div className="p-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-center">
              <Sparkles className="w-5 h-5 text-neon-cyan mx-auto mb-1.5 animate-bounce" style={{ animationDelay: '0.3s' }} />
              <p className="text-[9px] text-neon-cyan/70 uppercase tracking-wider font-bold">External API</p>
            </div>
            <div className="p-3 rounded-xl bg-neon-green/5 border border-neon-green/20 text-center">
              <Database className="w-5 h-5 text-neon-green mx-auto mb-1.5" />
              <p className="text-[9px] text-neon-green/70 uppercase tracking-wider font-bold">Secure Search</p>
            </div>
          </div>

          {/* Music Player - Centered */}
          <MusicPlayer musicUrl={settings.page2MusicUrl} />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            POWERED BY <span className="text-neon-yellow animate-pulse">SHUBH</span> <span className="text-neon-orange">OSINT</span>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Page2;
