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
  Terminal,
  Fingerprint
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";
import { useAuth } from "@/contexts/AuthContext";

const Page2 = () => {
  const { settings } = useSettings();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("manual");
  const [glitchText, setGlitchText] = useState("PAGE 2");

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const originalText = "PAGE 2";
    let interval: NodeJS.Timeout;

    const startGlitch = () => {
      let iterations = 0;
      interval = setInterval(() => {
        setGlitchText(
          originalText
            .split("")
            .map((char, index) => {
              if (index < iterations) return char;
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join("")
        );
        iterations += 1 / 3;
        if (iterations >= originalText.length) {
          clearInterval(interval);
          setGlitchText(originalText);
        }
      }, 50);
    };

    startGlitch();
    const repeatInterval = setInterval(startGlitch, 6000);
    return () => {
      clearInterval(interval);
      clearInterval(repeatInterval);
    };
  }, []);

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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
      </div>
    );
  }

  // Redirect handled by ProtectedRoute in App.tsx

  if (!manualTab?.enabled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Manual tab is disabled</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Animated cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 scanline opacity-40" />

      {/* Floating orbs with purple/cyan theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-72 h-72 bg-neon-purple/25 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[5%] w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-neon-pink/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[20%] w-48 h-48 bg-neon-orange/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[20%] right-[30%] w-40 h-40 bg-neon-green/15 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Animated Corner Decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-4 left-4 w-16 h-[2px] bg-gradient-to-r from-neon-purple to-transparent" />
        <div className="absolute top-4 left-4 w-[2px] h-16 bg-gradient-to-b from-neon-purple to-transparent" />
      </div>
      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-4 right-4 w-16 h-[2px] bg-gradient-to-l from-neon-cyan to-transparent" />
        <div className="absolute top-4 right-4 w-[2px] h-16 bg-gradient-to-b from-neon-cyan to-transparent" />
      </div>
      <div className="fixed bottom-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-4 left-4 w-16 h-[2px] bg-gradient-to-r from-neon-pink to-transparent" />
        <div className="absolute bottom-4 left-4 w-[2px] h-16 bg-gradient-to-t from-neon-pink to-transparent" />
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-4 right-4 w-16 h-[2px] bg-gradient-to-l from-neon-orange to-transparent" />
        <div className="absolute bottom-4 right-4 w-[2px] h-16 bg-gradient-to-t from-neon-orange to-transparent" />
      </div>

      {/* Floating status indicators */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-neon-purple/70 text-xs font-mono animate-pulse z-20">
        <Wifi className="w-3 h-3" />
        <span>CONNECTED</span>
      </div>
      <div className="absolute top-4 right-16 flex items-center gap-2 text-neon-cyan/70 text-xs font-mono animate-pulse z-20" style={{ animationDelay: '0.5s' }}>
        <Database className="w-3 h-3" />
        <span>READY</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-md min-h-screen flex flex-col">
        
        {/* Header Section */}
        <header className="relative py-4 text-center mb-4">
          {/* Back Button with glow */}
          <Link 
            to="/" 
            className="absolute top-2 right-0 p-2.5 rounded-xl border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          
          {/* Logo with animated ring */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-neon-cyan/20 to-neon-pink/30 rounded-full blur-xl animate-pulse" />
            <div className="absolute inset-1 rounded-full border-2 border-neon-purple/40" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-neon-cyan/30 animate-spin" style={{ animationDuration: '15s' }} />
            <ClipboardPaste className="w-10 h-10 text-neon-purple relative z-10" />
          </div>
          
          {/* Glitch title */}
          <h1 className="text-2xl md:text-3xl font-black tracking-wider mb-2">
            <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              {glitchText}
            </span>
          </h1>
          
          {/* Subtitle with terminal effect */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <Terminal className="w-3 h-3" />
            <span className="font-mono tracking-wider">{manualTab.label} TOOLS</span>
          </div>
        </header>

        {/* Main Card with animated border */}
        <div className="relative mb-4">
          {/* Animated rainbow border */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink via-neon-orange to-neon-purple bg-[length:400%_100%] animate-gradient-shift opacity-70" />
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink via-neon-orange to-neon-purple bg-[length:400%_100%] animate-gradient-shift blur-xl opacity-30" />
          
          <div className="relative rounded-2xl p-4 bg-background/95 backdrop-blur-xl border border-transparent">
            {/* Tab Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Manual Tab */}
              <button
                onClick={() => setActiveTab("manual")}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 overflow-hidden group ${
                  activeTab === "manual"
                    ? 'bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10'
                    : 'bg-background/50 hover:bg-neon-purple/10'
                }`}
              >
                {activeTab === "manual" && (
                  <div className="absolute inset-0 border-2 border-neon-purple rounded-xl shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]" />
                )}
                <ClipboardPaste className={`w-6 h-6 ${activeTab === "manual" ? 'text-neon-purple' : 'text-neon-purple/60'} group-hover:scale-110 transition-transform`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${activeTab === "manual" ? 'text-neon-purple' : 'text-neon-purple/60'}`}>
                  {manualTab.label}
                </span>
              </button>

              {/* Coming Soon Tab 1 */}
              <div className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background/30 opacity-40 cursor-not-allowed">
                <Database className="w-6 h-6 text-neon-cyan/50" />
                <span className="text-[9px] font-bold text-neon-cyan/50 uppercase tracking-wider">Soon</span>
              </div>

              {/* Coming Soon Tab 2 */}
              <div className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background/30 opacity-40 cursor-not-allowed">
                <Globe className="w-6 h-6 text-neon-pink/50" />
                <span className="text-[9px] font-bold text-neon-pink/50 uppercase tracking-wider">Soon</span>
              </div>
            </div>
            
            {/* Search Input Section */}
            {activeTab === "manual" && (
              <div className="relative animate-slide-up">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-xl opacity-0 group-focus-within:opacity-70 blur transition-opacity duration-300" />
                  <div className="relative flex gap-2 p-2 rounded-xl bg-background/80 border border-neon-purple/30 group-focus-within:border-transparent">
                    <div className="flex-1 flex items-center gap-2 px-2">
                      <ClipboardPaste className="w-4 h-4 text-neon-purple/60" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={manualTab.placeholder || "Enter number..."}
                        className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm font-mono"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      disabled={loading}
                      className="relative bg-transparent border-0 overflow-hidden group/btn px-6 h-10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-90 group-hover/btn:opacity-100 transition-opacity" />
                      <div className="absolute inset-[2px] bg-background/80 group-hover/btn:bg-background/60 transition-colors rounded-md" />
                      <span className="relative z-10">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" /> : <Search className="w-4 h-4 text-neon-purple" />}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Main Button */}
            <Link
              to="/"
              className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10 transition-all hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.3)] group"
            >
              <ArrowLeft className="w-4 h-4 text-neon-green group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold text-neon-green uppercase tracking-wider">Back to Main</span>
            </Link>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity" />
            <div className="relative p-4 rounded-xl bg-background/80 border border-neon-purple/20 text-center">
              <Zap className="w-5 h-5 text-neon-purple mx-auto mb-2 animate-pulse" />
              <p className="text-[10px] text-neon-purple/80 uppercase tracking-wider font-bold">Fast Results</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity" />
            <div className="relative p-4 rounded-xl bg-background/80 border border-neon-cyan/20 text-center">
              <Shield className="w-5 h-5 text-neon-cyan mx-auto mb-2" />
              <p className="text-[10px] text-neon-cyan/80 uppercase tracking-wider font-bold">New Tab Opens</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-orange rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity" />
            <div className="relative p-4 rounded-xl bg-background/80 border border-neon-pink/20 text-center">
              <Sparkles className="w-5 h-5 text-neon-pink mx-auto mb-2 animate-bounce" style={{ animationDelay: '0.3s' }} />
              <p className="text-[10px] text-neon-pink/80 uppercase tracking-wider font-bold">External API</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-orange to-neon-green rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity" />
            <div className="relative p-4 rounded-xl bg-background/80 border border-neon-orange/20 text-center">
              <Fingerprint className="w-5 h-5 text-neon-orange mx-auto mb-2" />
              <p className="text-[10px] text-neon-orange/80 uppercase tracking-wider font-bold">Secure Search</p>
            </div>
          </div>
        </div>

        {/* Music Player */}
        <MusicPlayer musicUrl={settings.page2MusicUrl} />

        {/* Footer */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-[10px] text-muted-foreground/30 font-mono tracking-widest">
            SHUBH OSINT v2.0 • <span className="text-neon-purple">PAGE 2</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page2;