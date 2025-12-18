import { useState } from "react";
import { ClipboardPaste, Search, Loader2, ArrowLeft } from "lucide-react";
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

    // Open API URL in new tab
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
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-neon-purple/5 pointer-events-none" />
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(transparent_50%,hsl(var(--neon-green)/0.03)_50%)] bg-[length:100%_4px]" />
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono">Back to Main</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-neon-yellow/20 border border-neon-yellow/50 shadow-[0_0_20px_hsl(var(--neon-yellow)/0.3)]">
                <ClipboardPaste className="w-8 h-8 text-neon-yellow" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-neon-yellow tracking-wider">
              {manualTab.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">
              External API Search Tool
            </p>
          </div>

          {/* Search Card */}
          <div className="rounded-2xl border-2 border-neon-yellow/50 bg-card/80 p-6 shadow-[0_0_30px_hsl(var(--neon-yellow)/0.2)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl border border-neon-yellow/30 bg-background/50 px-3 py-2">
                <ClipboardPaste className="w-4 h-4 text-neon-yellow flex-shrink-0" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={manualTab.placeholder || "Enter number..."}
                  className="flex-1 bg-transparent border-0 text-neon-yellow placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-to-r from-neon-yellow to-neon-orange text-background font-bold py-6 hover:opacity-90 shadow-[0_0_20px_hsl(var(--neon-yellow)/0.5)] transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Info */}
            <div className="mt-6 p-3 rounded-xl bg-neon-yellow/5 border border-neon-yellow/20">
              <p className="text-[10px] text-neon-yellow/70 text-center">
                This will open results in a new tab
              </p>
            </div>
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Page2;
