import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, CreditCard, Car, Camera, Users, ClipboardPaste, Sparkles, Code, Globe,
  Loader2, Search, Database, Send, MessageCircle, Skull, Bomb, Shield, Zap, ArrowRight,
  LucideIcon, Copy, Check, PhoneCall, Image as ImageIcon
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import ShubhCam from "./ShubhCam";
import TelegramOSINT from "./TelegramOSINT";
import CallDark from "./CallDark";
import ImageToInfo from "./ImageToInfo";
import HackerLoader from "./HackerLoader";
import AnimatedJsonViewer from "./AnimatedJsonViewer";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Phone, CreditCard, Car, Camera, Users, ClipboardPaste, Sparkles, Code, Globe, Database, Send, MessageCircle, Skull, Bomb, Shield, Search, PhoneCall, Image: ImageIcon
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
    !["shubh", "darkdb", "telegram", "phprat", "calldark", "imagetoinfo"].includes(activeButton.searchType);

  return (
    <div className="px-3 space-y-4">
      {/* Feature Cards Grid with enhanced container */}
      <div className="relative rounded-2xl bg-gradient-to-br from-card/60 via-background/80 to-card/60 border border-neon-cyan/20 p-3 overflow-hidden">
        {/* Subtle corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-green/40 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-pink/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-neon-pink/40 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-neon-green/40 rounded-br-2xl" />
        
        <div className="relative grid grid-cols-4 gap-2">
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
          
          {/* More Button with enhanced styling */}
          <div>
            <Link to="/page2">
              <div className={cn(
                "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200",
                "bg-gradient-to-br from-neon-yellow/15 to-neon-yellow/5",
                "border-neon-yellow/40 hover:border-neon-yellow hover:scale-[1.03]",
                "backdrop-blur-sm"
              )}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-background/90 to-background/50 border border-neon-yellow/30 flex items-center justify-center text-neon-yellow">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase text-neon-yellow">More</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Input Section with enhanced design */}
      {showSearchInput && (
        <div className="relative rounded-2xl bg-gradient-to-br from-card/80 via-background/90 to-card/80 border border-neon-cyan/30 p-4 overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green/50 rounded-br-2xl" />
          
          {/* Search label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="text-[10px] font-bold text-neon-green tracking-wider uppercase">
              {activeButton?.label || "SEARCH"}
            </span>
          </div>
          
          <div className="relative flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeButton?.placeholder || "Enter search query..."}
              className="flex-1 bg-background/90 border-neon-green/30 text-foreground placeholder:text-muted-foreground/50 focus:border-neon-green h-12 text-sm font-mono rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className={cn(
                "h-12 px-5 rounded-xl font-bold transition-all duration-200",
                "bg-gradient-to-r from-neon-green to-neon-cyan text-background",
                "hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.4)] hover:scale-[1.02]"
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
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

      {/* DARK DB iframe with enhanced container */}
      {activeButton?.searchType === "darkdb" && (
        <div className="relative rounded-2xl border-2 border-neon-purple/40 overflow-hidden">
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-purple/60 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-purple/60 rounded-tr-2xl" />
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-neon-purple/15 to-transparent border-b border-neon-purple/20">
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
      )}

      {/* PHPRAT Panel with enhanced container */}
      {activeButton?.searchType === "phprat" && (
        <div className="relative rounded-2xl border-2 border-neon-green/40 overflow-hidden">
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-green/60 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-green/60 rounded-tr-2xl" />
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-neon-green/15 to-transparent border-b border-neon-green/20">
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
      )}

      {/* CALL DARK Panel */}
      {activeButton?.searchType === "calldark" && (
        <div>
          <CallDark />
        </div>
      )}

      {/* Image to Info Panel */}
      {activeButton?.searchType === "imagetoinfo" && (
        <div>
          <ImageToInfo />
        </div>
      )}

      {/* Results Section with enhanced styling */}
      {showSearchInput && (
        <div className="min-h-[100px]">
          {loading && <HackerLoader inline />}
          
          {error && !loading && (
            <div className="relative text-center py-6 rounded-2xl border border-neon-red/40 bg-gradient-to-br from-neon-red/10 to-transparent overflow-hidden">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-red/50 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-red/50 rounded-tr-2xl" />
              <p className="text-neon-red text-sm font-medium">{error}</p>
            </div>
          )}
          
          {result && !loading && !error && (
            <div className="relative rounded-2xl border border-neon-green/40 bg-gradient-to-br from-card/90 via-background/80 to-card/90 p-4 overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/60 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/60 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/60 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green/60 rounded-br-2xl" />
              
              <div className="relative flex items-center gap-2 mb-3 pb-2 border-b border-neon-green/20">
                <div className="w-2 h-2 rounded-full bg-neon-green" />
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
