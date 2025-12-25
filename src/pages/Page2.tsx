import { useState, useEffect } from "react";
import { 
  ClipboardPaste, 
  Search, 
  Loader2, 
  ArrowLeft, 
  Zap, 
  Database,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Page2 = () => {
  const { settings } = useSettings();
  const { isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
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
      {/* Custom background image or simple gradient - same as Index */}
      {settings.backgroundImage ? (
        <div 
          className="fixed-viewport bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${settings.backgroundImage})` }}
        />
      ) : (
        <div className="fixed-viewport bg-background" />
      )}
      
      {/* Dark overlay for readability - same as Index */}
      <div 
        className="absolute inset-0 bg-background"
        style={{ opacity: (parseInt(settings.backgroundOpacity || "30") / 100) }}
      />
      
      {/* Simple gradient overlay - lightweight */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-cyan/5" />
      
      {/* Neon glowing cyber grid */}
      <div className="absolute inset-0 cyber-grid-glow opacity-40" />
      
      {/* Static corner accents - no blur/animation */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-neon-green/10 rounded-full" style={{ filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-neon-pink/10 rounded-full" style={{ filter: 'blur(60px)' }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 pb-6">
        <Header />
        
        {/* Compact Stats Bar - same as Index */}
        <div className="max-w-3xl mx-auto mb-3">
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-green/30">
              <Database className="w-3 h-3 text-neon-green" />
              <span className="text-[10px] font-mono text-neon-green">Manual Search</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-cyan/30">
              <Zap className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-mono text-neon-cyan">External API</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-pink/30">
              <Sparkles className="w-3 h-3 text-neon-pink" />
              <span className="text-[10px] font-mono text-neon-pink">Page 2</span>
            </div>
          </div>
        </div>
        
        {/* Main Content Card */}
        <main className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Animated border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink to-neon-purple bg-[length:400%_100%] animate-gradient-shift opacity-50" />
            
            <div className="relative rounded-2xl p-4 md:p-6 bg-card/90 backdrop-blur-sm border border-transparent">
              {/* Tab Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/30">
                    <ClipboardPaste className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{manualTab.label}</h2>
                    <p className="text-[10px] text-muted-foreground font-mono">EXTERNAL API SEARCH</p>
                  </div>
                </div>
                
                {/* Back Button */}
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-all hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Main</span>
                </Link>
              </div>
              
              {/* Search Input */}
              <div className="relative group mb-4">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-xl opacity-0 group-focus-within:opacity-50 blur transition-opacity duration-300" />
                <div className="relative flex gap-2 p-2 rounded-xl bg-background/80 border border-neon-purple/30 group-focus-within:border-neon-purple/60">
                  <div className="flex-1 flex items-center gap-2 px-3">
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
                    className="relative overflow-hidden px-6 h-10 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 border-0"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-center">
                  <Zap className="w-4 h-4 text-neon-purple mx-auto mb-1" />
                  <p className="text-[9px] text-neon-purple/80 uppercase font-bold">Fast</p>
                </div>
                <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-center">
                  <Database className="w-4 h-4 text-neon-cyan mx-auto mb-1" />
                  <p className="text-[9px] text-neon-cyan/80 uppercase font-bold">New Tab</p>
                </div>
                <div className="p-3 rounded-xl bg-neon-pink/10 border border-neon-pink/20 text-center">
                  <Sparkles className="w-4 h-4 text-neon-pink mx-auto mb-1" />
                  <p className="text-[9px] text-neon-pink/80 uppercase font-bold">External</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Music Player */}
          <div className="mt-4">
            <MusicPlayer musicUrl={settings.page2MusicUrl} />
          </div>
        </main>
      </div>
      
      {/* Simple corner decorations - same as Index */}
      <div className="fixed top-0 left-0 w-20 h-20 border-l border-t border-neon-green/30 rounded-br-xl" />
      <div className="fixed top-0 right-0 w-20 h-20 border-r border-t border-neon-pink/30 rounded-bl-xl" />
      <div className="fixed bottom-0 left-0 w-20 h-20 border-l border-b border-neon-cyan/30 rounded-tr-xl" />
      <div className="fixed bottom-0 right-0 w-20 h-20 border-r border-b border-neon-purple/30 rounded-tl-xl" />
    </div>
  );
};

export default Page2;
