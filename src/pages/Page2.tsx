import { useState } from "react";
import { 
  ClipboardPaste, 
  Search, 
  Loader2, 
  ArrowLeft, 
  Zap, 
  Database,
  Sparkles,
  ExternalLink,
  Terminal,
  Globe,
  Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CreditDisplay from "@/components/CreditDisplay";

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
      
      {/* Dark overlay for readability */}
      <div 
        className="absolute inset-0 bg-background"
        style={{ opacity: (parseInt(settings.backgroundOpacity || "30") / 100) }}
      />
      
      {/* Simple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-cyan/5" />
      
      {/* Neon glowing cyber grid */}
      <div className="absolute inset-0 cyber-grid-glow opacity-40" />
      
      {/* Static corner accents */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-neon-green/10 rounded-full" style={{ filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-neon-pink/10 rounded-full" style={{ filter: 'blur(60px)' }} />
      
      {/* Content */}
      <div className="relative z-10 w-full mx-auto px-0 sm:px-3 py-4">
        {/* Header */}
        <header className="w-full mx-auto mb-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neon-cyan/40 bg-card/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Back</span>
            </Link>
            
            {/* Title */}
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                PAGE 2
              </h1>
              <p className="text-[9px] text-muted-foreground font-mono">EXTERNAL API TOOLS</p>
            </div>
            
            {/* Credits */}
            <CreditDisplay />
          </div>
        </header>
        
        {/* Stats Bar */}
        <div className="w-full mx-auto mb-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-purple/30">
              <Terminal className="w-3 h-3 text-neon-purple" />
              <span className="text-[10px] font-mono text-neon-purple">Manual Mode</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-cyan/30">
              <Globe className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-mono text-neon-cyan">External API</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/50 border border-neon-green/30">
              <ExternalLink className="w-3 h-3 text-neon-green" />
              <span className="text-[10px] font-mono text-neon-green">New Tab</span>
            </div>
          </div>
        </div>
        
        {/* Main Dashboard */}
        <main className="w-full mx-auto space-y-4">
          {/* Search Card */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-40" />
            <div className="relative rounded-2xl p-4 bg-card/90 backdrop-blur-sm">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30">
                  <ClipboardPaste className="w-5 h-5 text-neon-purple" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-foreground">{manualTab.label}</h2>
                  <p className="text-[10px] text-muted-foreground font-mono">Enter query to search via external API</p>
                </div>
              </div>
              
              {/* Search Input */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl opacity-0 group-focus-within:opacity-40 blur transition-opacity" />
                <div className="relative flex gap-2 p-2 rounded-xl bg-background/80 border border-neon-purple/30 group-focus-within:border-neon-purple/60">
                  <div className="flex-1 flex items-center gap-2 px-3">
                    <Search className="w-4 h-4 text-neon-purple/60" />
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
                    className={`px-6 h-10 bg-gradient-to-r from-neon-purple to-neon-cyan border-0 font-bold transition-all ${loading ? 'animate-pulse shadow-[0_0_20px_hsl(var(--neon-purple)/0.6),0_0_40px_hsl(var(--neon-cyan)/0.4)]' : 'hover:opacity-90'}`}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_8px_hsl(var(--neon-cyan))]" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="text-xs">SEARCH</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-card/60 border border-neon-purple/20 text-center hover:border-neon-purple/40 transition-colors">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-neon-purple" />
              </div>
              <p className="text-[10px] text-neon-purple font-bold uppercase">Fast</p>
              <p className="text-[8px] text-muted-foreground mt-0.5">Instant Results</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card/60 border border-neon-cyan/20 text-center hover:border-neon-cyan/40 transition-colors">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-neon-cyan" />
              </div>
              <p className="text-[10px] text-neon-cyan font-bold uppercase">External</p>
              <p className="text-[8px] text-muted-foreground mt-0.5">Third Party API</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card/60 border border-neon-pink/20 text-center hover:border-neon-pink/40 transition-colors">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-pink/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-neon-pink" />
              </div>
              <p className="text-[10px] text-neon-pink font-bold uppercase">Deep</p>
              <p className="text-[8px] text-muted-foreground mt-0.5">Data Lookup</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card/60 border border-neon-green/20 text-center hover:border-neon-green/40 transition-colors">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-green/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-neon-green" />
              </div>
              <p className="text-[10px] text-neon-green font-bold uppercase">Secure</p>
              <p className="text-[8px] text-muted-foreground mt-0.5">Safe Search</p>
            </div>
          </div>
          
          {/* Info Card */}
          <div className="p-4 rounded-xl bg-card/40 border border-neon-orange/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neon-orange/10">
                <Sparkles className="w-4 h-4 text-neon-orange" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neon-orange mb-1">How it works</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Enter your search query and click Search. Results will open in a new browser tab via the external API.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-20 h-20 border-l border-t border-neon-green/30 rounded-br-xl" />
      <div className="fixed top-0 right-0 w-20 h-20 border-r border-t border-neon-pink/30 rounded-bl-xl" />
      <div className="fixed bottom-0 left-0 w-20 h-20 border-l border-b border-neon-cyan/30 rounded-tr-xl" />
      <div className="fixed bottom-0 right-0 w-20 h-20 border-r border-b border-neon-purple/30 rounded-tl-xl" />
    </div>
  );
};

export default Page2;
