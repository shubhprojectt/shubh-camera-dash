import { useState } from "react";
import { 
  ClipboardPaste, Search, Loader2, ArrowLeft, Zap, Database,
  Sparkles, ExternalLink, Terminal, Globe, Shield
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
      toast({ title: "Error", description: "Please enter a value to search", variant: "destructive" });
      return;
    }

    await logSearchHistory("manual", searchQuery.trim());
    setLoading(true);

    const apiUrl = `${manualTab?.apiUrl || "https://hydrashop.in.net/number.php?q="}${encodeURIComponent(searchQuery.trim())}`;
    window.open(apiUrl, '_blank');
    
    setLoading(false);
    toast({ title: "Opening", description: `Searching: ${searchQuery}` });
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  if (!manualTab?.enabled) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Manual tab is disabled</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        {settings.backgroundImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${settings.backgroundImage})`,
              opacity: (parseInt(settings.backgroundOpacity || "30") / 100)
            }}
          />
        ) : (
          <>
            <div className="absolute top-[20%] left-[5%] w-[200px] h-[200px] bg-neon-purple/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-[20%] right-[5%] w-[200px] h-[200px] bg-neon-cyan/10 rounded-full blur-[80px]" />
          </>
        )}
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-purple)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-purple)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="px-4 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neon-cyan/30 bg-card/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Back</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-lg font-display font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                MANUAL MODE
              </h1>
            </div>
            
            <CreditDisplay />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 px-4 pb-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/50 border border-neon-purple/30">
                <Terminal className="w-3 h-3 text-neon-purple" />
                <span className="text-[10px] text-neon-purple">Manual</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/50 border border-neon-cyan/30">
                <Globe className="w-3 h-3 text-neon-cyan" />
                <span className="text-[10px] text-neon-cyan">External API</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/50 border border-neon-green/30">
                <ExternalLink className="w-3 h-3 text-neon-green" />
                <span className="text-[10px] text-neon-green">New Tab</span>
              </div>
            </div>
            
            {/* Search Card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-neon-purple/30 p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-neon-cyan/5" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 flex items-center justify-center">
                    <ClipboardPaste className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{manualTab.label}</h2>
                    <p className="text-[10px] text-muted-foreground">Search via external API</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={manualTab.placeholder || "Enter query..."}
                    className="flex-1 h-11 bg-background/80 border-neon-purple/30 text-foreground placeholder:text-muted-foreground/50 focus:border-neon-purple rounded-xl"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="h-11 px-4 rounded-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-background hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span>Open</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Zap, label: "Fast", desc: "Instant Results", color: "purple" },
                { icon: Globe, label: "External", desc: "Third Party API", color: "cyan" },
                { icon: Database, label: "Deep", desc: "Data Lookup", color: "pink" },
                { icon: Shield, label: "Secure", desc: "Safe Search", color: "green" },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl bg-card/50 border border-neon-${item.color}/20 text-center hover:border-neon-${item.color}/40 transition-colors`}>
                  <div className={`w-9 h-9 mx-auto mb-2 rounded-lg bg-neon-${item.color}/10 flex items-center justify-center`}>
                    <item.icon className={`w-4 h-4 text-neon-${item.color}`} />
                  </div>
                  <p className={`text-[10px] text-neon-${item.color} font-bold uppercase`}>{item.label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Info */}
            <div className="p-4 rounded-xl bg-card/40 border border-neon-orange/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neon-orange/10">
                  <Sparkles className="w-4 h-4 text-neon-orange" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neon-orange mb-1">How it works</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Enter your query and click Open. Results will open in a new browser tab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page2;
