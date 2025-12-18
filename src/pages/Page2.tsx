import { useState } from "react";
import { ClipboardPaste, Search, Loader2, ArrowLeft, Zap, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";

const Page2 = () => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  if (!manualTab?.enabled) {
    return (
      <PasswordProtection>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Manual tab is disabled</p>
        </div>
      </PasswordProtection>
    );
  }

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-neon-yellow/5 to-neon-orange/5 pointer-events-none" />
        
        {/* Grid Pattern */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-yellow)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-yellow)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Scanlines */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(transparent_50%,hsl(var(--neon-yellow)/0.05)_50%)] bg-[length:100%_4px] animate-pulse" />
        
        {/* Floating Orbs */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-neon-yellow/10 rounded-full blur-3xl animate-pulse" />
        <div className="fixed bottom-20 right-10 w-40 h-40 bg-neon-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-yellow/5 rounded-full blur-3xl" />
        
        {/* Corner Decorations */}
        <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-yellow/30 pointer-events-none" />
        <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-orange/30 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-orange/30 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-yellow/30 pointer-events-none" />
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-md min-h-screen flex flex-col">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-yellow transition-all duration-300 mb-8 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono tracking-wider">BACK TO MAIN</span>
          </Link>

          {/* Header with Animation */}
          <div className="text-center mb-10 animate-fade-in">
            {/* Animated Icon Container */}
            <div className="relative inline-block mb-6">
              {/* Outer Ring */}
              <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-neon-yellow/30 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-neon-orange/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
              
              {/* Main Icon */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-neon-yellow/20 to-neon-orange/10 border border-neon-yellow/50 shadow-[0_0_30px_hsl(var(--neon-yellow)/0.4)]" />
                <ClipboardPaste className="w-10 h-10 text-neon-yellow relative z-10 animate-pulse" />
              </div>
              
              {/* Sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-neon-orange animate-bounce" style={{ animationDelay: '0.5s' }} />
              <Zap className="absolute -bottom-1 -left-1 w-4 h-4 text-neon-yellow animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-wider mb-3">
              <span className="text-neon-yellow text-glow-yellow animate-pulse">{manualTab.label}</span>
            </h1>
            <p className="text-xs text-muted-foreground/80 font-mono tracking-widest uppercase">
              External API Search Tool
            </p>
          </div>

          {/* Search Card */}
          <div 
            className={`rounded-3xl border-2 bg-card/90 backdrop-blur-sm p-8 transition-all duration-500 animate-scale-in ${
              isFocused 
                ? 'border-neon-yellow shadow-[0_0_50px_hsl(var(--neon-yellow)/0.4)] scale-[1.02]' 
                : 'border-neon-yellow/40 shadow-[0_0_30px_hsl(var(--neon-yellow)/0.2)]'
            }`}
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neon-yellow/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-neon-green uppercase tracking-wider">System Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-neon-cyan" />
                <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-wider">Secure</span>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
              <div 
                className={`flex items-center gap-3 rounded-2xl border-2 bg-background/50 px-4 py-3 transition-all duration-300 ${
                  isFocused 
                    ? 'border-neon-yellow shadow-[inset_0_0_20px_hsl(var(--neon-yellow)/0.1)]' 
                    : 'border-neon-yellow/30'
                }`}
              >
                <ClipboardPaste className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-neon-yellow' : 'text-neon-yellow/50'}`} />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={manualTab.placeholder || "Enter number..."}
                  className="flex-1 bg-transparent border-0 text-neon-yellow placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-lg font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-neon-yellow via-neon-orange to-neon-yellow text-background font-black py-7 text-lg tracking-wider hover:opacity-90 shadow-[0_0_30px_hsl(var(--neon-yellow)/0.5)] transition-all duration-300 active:scale-95 group"
                style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    SEARCH NOW
                  </>
                )}
              </Button>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-neon-yellow/5 border border-neon-yellow/20 text-center">
                <Zap className="w-5 h-5 text-neon-yellow mx-auto mb-2" />
                <p className="text-[10px] text-neon-yellow/70 uppercase tracking-wider">Fast Results</p>
              </div>
              <div className="p-4 rounded-xl bg-neon-orange/5 border border-neon-orange/20 text-center">
                <Shield className="w-5 h-5 text-neon-orange mx-auto mb-2" />
                <p className="text-[10px] text-neon-orange/70 uppercase tracking-wider">Opens New Tab</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 text-center">
            <p className="text-[10px] text-muted-foreground/40 font-mono">
              POWERED BY <span className="text-neon-yellow">SHUBH</span> <span className="text-neon-orange">OSINT</span>
            </p>
          </div>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </PasswordProtection>
  );
};

export default Page2;
