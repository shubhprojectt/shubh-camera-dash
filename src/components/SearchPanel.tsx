import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, CreditCard, Car, Camera, Users, ClipboardPaste, Sparkles, Code, Globe,
  Loader2, Search, Database, Send, MessageCircle, Skull, Bomb, Shield, Zap, ArrowRight,
  LucideIcon, Copy, Check
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import ShubhCam from "./ShubhCam";
import TelegramOSINT from "./TelegramOSINT";
import HackerLoader from "./HackerLoader";
import AnimatedJsonViewer from "./AnimatedJsonViewer";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Phone, CreditCard, Car, Camera, Users, ClipboardPaste, Sparkles, Code, Globe, Database, Send, MessageCircle, Skull, Bomb, Shield, Search
};

const SearchPanel = () => {
  const { settings } = useSettings();
  const { credits, deductCredits, isUnlimited } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const enabledTabs = settings.tabs.filter(tab => tab.enabled && tab.searchType !== "manual");
  const activeButton = enabledTabs.find(b => b.label === activeTab);

  const handleTabClick = (label: string) => {
    const tab = enabledTabs.find(t => t.label === label);
    if (tab?.searchType === "randipanel") {
      navigate("/randi-panel");
      return;
    }
    
    if (tab?.searchType === "smsbomber") {
      const url = tab.apiUrl?.trim();
      if (url) {
        window.open(url, '_blank');
        toast({ title: "SMS BOMBER", description: "Opening SMS Bomber..." });
      }
      return;
    }
    
    if (activeTab === label) {
      setActiveTab(null);
    } else {
      setActiveTab(label);
      setSearchQuery("");
      setResult(null);
      setError(null);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({ title: "Copied!", description: `${fieldName} copied to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  // Generic inline JSON search using edge function proxy to bypass CORS
  const runInlineJsonSearch = async (opts: {
    searchType: string;
    query: string;
    apiUrl?: string;
    toastTitle: string;
  }) => {
    const apiUrl = opts.apiUrl?.trim();
    if (!apiUrl) {
      setLoading(false);
      setError("API not configured. Admin panel me API URL set karo.");
      toast({
        title: "API Not Set",
        description: "Configure API URL in Admin panel",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use edge function proxy to bypass CORS
      const { data, error: fnError } = await supabase.functions.invoke("numinfo-v2", {
        body: { number: opts.query, apiUrl },
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        throw fnError;
      }

      // Check for valid data - support multiple response formats
      const hasValidData = data && (
        data.results || 
        data.responses || 
        data.data || 
        data.status === true || 
        data.status === "success" || 
        (data.raw && data.raw.length > 0) ||
        (typeof data === 'object' && Object.keys(data).length > 0)
      );

      if (hasValidData) {
        setResult({ type: opts.searchType, data });
        toast({ title: opts.toastTitle, description: "Results found" });
      } else {
        setError("No information found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ title: "Error", description: "Please enter a value to search", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    if (settings.creditSystemEnabled) {
      if (!isUnlimited && credits <= 0) {
        setLoading(false);
        toast({ title: "No Credits", description: "Credits finished! Contact admin.", variant: "destructive" });
        return;
      }
      deductCredits(activeButton?.searchType || "search", searchQuery.trim());
    }

    logSearchHistory(activeButton?.searchType || "unknown", searchQuery.trim());

    // Instagram Search (inline JSON)
    if (activeButton?.searchType === "instagram") {
      await runInlineJsonSearch({
        searchType: "instagram",
        query: searchQuery.trim(),
        apiUrl: activeButton.apiUrl,
        toastTitle: "Instagram Results",
      });
      return;
    }

    // Family Search (inline JSON)
    if (activeButton?.searchType === "family") {
      await runInlineJsonSearch({
        searchType: "family",
        query: searchQuery.trim(),
        apiUrl: activeButton.apiUrl,
        toastTitle: "Family Results",
      });
      return;
    }

    // TG to Num (inline JSON)
    if (activeButton?.searchType === "tgtonum") {
      await runInlineJsonSearch({
        searchType: "tgtonum",
        query: searchQuery.trim(),
        apiUrl: activeButton.apiUrl,
        toastTitle: "TG to Num Results",
      });
      return;
    }

    // Phone search
    if (activeButton?.searchType === "phone") {
      try {
        const apiUrl = settings.tabs.find((t) => t.searchType === "phone")?.apiUrl?.trim() || "https://anmolzz.teamxferry.workers.dev/?mobile=";
        const { data, error: fnError } = await supabase.functions.invoke("numinfo-v2", {
          body: { number: searchQuery.trim(), apiUrl },
        });
        if (fnError) throw fnError;
        const hasData = data && (data.responses?.length > 0 || data.status === "success" || Object.keys(data).length > 0);
        if (hasData) {
          setResult({ type: "phone", data });
          toast({ title: "Found!", description: `Results for: ${searchQuery}` });
        } else {
          setError("No information found");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Aadhar search
    if (activeButton?.searchType === "aadhar") {
      try {
        const aadharApiUrl = settings.tabs.find((t) => t.searchType === "aadhar")?.apiUrl?.trim() || "";
        const { data, error: fnError } = await supabase.functions.invoke('aadhar-search', {
          body: { term: searchQuery.trim(), apiUrl: aadharApiUrl }
        });
        if (fnError) throw fnError;
        if (data && Object.keys(data).length > 0 && !data.error) {
          setResult({ type: "aadhar", data });
          toast({ title: "Found!", description: `Aadhar results for: ${searchQuery}` });
        } else {
          setError("No Aadhar information found");
        }
      } catch (err) {
        setError("Failed to fetch Aadhar data");
      } finally {
        setLoading(false);
      }
      return;
    }

    // NUM INFO V2
    if (activeButton?.searchType === "numinfov2") {
      try {
        const numInfoApiUrl = settings.tabs.find((t) => t.searchType === "numinfov2")?.apiUrl?.trim() || "";
        const { data, error: fnError } = await supabase.functions.invoke('numinfo-v2', {
          body: { number: searchQuery.trim(), apiUrl: numInfoApiUrl }
        });
        if (fnError) throw fnError;
        const hasData = data && (data.responses?.length > 0 || data.status === "success" || Object.keys(data).length > 0);
        if (hasData) {
          setResult({ type: "numinfov2", data });
          toast({ title: "Found!", description: `NUM INFO V2 results` });
        } else {
          setError("No information found");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Vehicle search
    if (activeButton?.searchType === "vehicle" && activeButton?.apiUrl) {
      try {
        const response = await fetch(`${activeButton.apiUrl}${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
        const data = await response.json();
        if (data && !data.error) {
          setResult({ type: "vehicle", data });
          toast({ title: "Vehicle Found!", description: `Results for: ${searchQuery.toUpperCase()}` });
        } else {
          setError("No vehicle found");
        }
      } catch (err) {
        setError("Failed to fetch vehicle data");
      } finally {
        setLoading(false);
      }
      return;
    }

    // All Search (LeakOSINT)
    if (activeButton?.searchType === "allsearch") {
      try {
        const allSearchApiUrl = settings.tabs.find((t) => t.searchType === "allsearch")?.apiUrl?.trim() || "https://lek-steel.vercel.app/api/search?q=";
        const response = await fetch(`${allSearchApiUrl}${encodeURIComponent(searchQuery.trim())}`);
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setResult({ type: "allsearch", data });
          toast({ title: "LeakOSINT Results", description: `Results found` });
        } else {
          setError("No information found");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Default: open API URL
    if (activeButton?.apiUrl) {
      const apiUrl = `${activeButton.apiUrl}${encodeURIComponent(searchQuery.trim())}`;
      window.open(apiUrl, '_blank');
      setLoading(false);
      toast({ title: "Opening", description: `Searching: ${searchQuery}` });
    } else {
      setLoading(false);
      setError("No API configured");
    }
  };

  // Get accent color based on search type
  const getAccentColor = (searchType: string): "green" | "cyan" | "pink" | "purple" | "yellow" | "orange" => {
    const colorMap: Record<string, "green" | "cyan" | "pink" | "purple" | "yellow" | "orange"> = {
      instagram: "pink",
      family: "purple",
      tgtonum: "cyan",
      phone: "green",
      numinfov2: "yellow",
      aadhar: "orange",
      vehicle: "cyan",
      allsearch: "pink",
    };
    return colorMap[searchType] || "green";
  };

  // Get title based on search type
  const getResultTitle = (searchType: string): string => {
    const titles: Record<string, string> = {
      instagram: "📸 INSTAGRAM RESULTS",
      family: "👨‍👩‍👧‍👦 FAMILY INFO",
      tgtonum: "📲 TG TO NUM",
      phone: "📱 PHONE INFO",
      numinfov2: "📱 NUM INFO V2",
      aadhar: "🪪 AADHAR INFO",
      vehicle: "🚗 VEHICLE INFO",
      allsearch: "🔍 ALL SEARCH",
    };
    return titles[searchType] || "📊 RESULTS";
  };

  const renderResult = () => {
    if (!result) return null;

    const searchType = result.type || activeButton?.searchType || "unknown";
    
    return (
      <AnimatedJsonViewer
        data={result.data}
        title={getResultTitle(searchType)}
        accentColor={getAccentColor(searchType)}
        animationSpeed={25}
        showLineNumbers={true}
      />
    );
  };

  const showSearchInput = activeTab && activeButton && 
    !["shubh", "darkdb", "telegram", "phprat"].includes(activeButton.searchType);

  return (
    <div className="px-4 space-y-4">
      {/* Feature Cards Grid */}
      <div className="grid grid-cols-4 gap-2">
        {enabledTabs.map((tab) => {
          const IconComponent = iconMap[tab.icon] || Sparkles;
          return (
            <div key={tab.id}>
              <FeatureCard
                icon={IconComponent}
                label={tab.label}
                color={tab.color}
                active={tab.label === activeTab}
                onClick={() => handleTabClick(tab.label)}
              />
            </div>
          );
        })}
        
        {/* More Button */}
        <div>
          <Link to="/page2">
            <div className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors",
              "bg-gradient-to-br from-neon-yellow/20 to-neon-yellow/5",
              "border-neon-yellow/40 hover:border-neon-yellow"
            )}>
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-background/80 to-background/40 border border-neon-yellow/30 flex items-center justify-center text-neon-yellow">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold tracking-wide uppercase text-neon-yellow">More</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Search Input Section */}
      {showSearchInput && (
        <div>
          <div className="relative rounded-xl bg-gradient-to-br from-card/90 to-card/70 border border-neon-cyan/30 p-3 overflow-hidden">
            <div className="relative flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeButton?.placeholder || "Enter search query..."}
                className="flex-1 bg-background/80 border-neon-green/30 text-foreground placeholder:text-muted-foreground/50 focus:border-neon-green h-11 text-sm font-mono rounded-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className={cn(
                  "h-11 px-4 rounded-lg font-bold",
                  "bg-gradient-to-r from-neon-green to-neon-cyan text-background"
                )}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ShubhCam Panel */}
      {activeButton?.searchType === "shubh" && (
        <div>
          <ShubhCam />
        </div>
      )}

      {/* Telegram OSINT Panel */}
      {activeButton?.searchType === "telegram" && (
        <div>
          <TelegramOSINT />
        </div>
      )}

      {/* DARK DB iframe */}
      {activeButton?.searchType === "darkdb" && (
        <div>
          <div className="rounded-xl border-2 border-neon-purple/40 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-neon-purple/10 border-b border-neon-purple/20">
              <Database className="w-4 h-4 text-neon-purple" />
              <span className="text-xs font-bold text-neon-purple uppercase tracking-wider">Secure OSINT Database</span>
            </div>
            <iframe
              src={settings.darkDbUrl}
              className="w-full bg-background"
              style={{ height: `${settings.darkDbHeight}vh`, minHeight: '400px' }}
              title="DARK DB"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* PHPRAT Panel */}
      {activeButton?.searchType === "phprat" && (
        <div>
          <div className="rounded-xl border-2 border-neon-green/40 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-neon-green/10 border-b border-neon-green/20">
              <Code className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-bold text-neon-green uppercase tracking-wider">PHPRAT Control Panel</span>
            </div>
            <iframe
              src={activeButton?.apiUrl || "https://userb-92mn.onrender.com/"}
              className="w-full bg-background"
              style={{ height: '70vh', minHeight: '400px' }}
              title="PHPRAT"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      {showSearchInput && (
        <div className="min-h-[100px]">
          {loading && <HackerLoader inline />}
          
          {error && !loading && (
            <div className="text-center py-6 rounded-xl border border-neon-red/40 bg-neon-red/5">
              <p className="text-neon-red text-sm">{error}</p>
            </div>
          )}
          
          {result && !loading && !error && (
            <div className="rounded-xl border border-neon-green/40 bg-gradient-to-br from-card/90 to-card/70 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-green/20">
                <Zap className="w-4 h-4 text-neon-green" />
                <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider">
                  {activeButton?.label} Results
                </h3>
              </div>
              {renderResult()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
