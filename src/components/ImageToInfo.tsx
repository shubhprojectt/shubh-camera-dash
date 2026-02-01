import { useState, useRef } from "react";
import { Upload, Camera, Loader2, Image as ImageIcon, Trash2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnimatedJsonViewer from "./AnimatedJsonViewer";
import { cn } from "@/lib/utils";

const ImageToInfo = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size must be less than 10MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const analyzeImage = async () => {
    if (!image) {
      toast({ title: "Error", description: "Please upload an image first", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("image-to-info", {
        body: { imageBase64: image }
      });

      if (fnError) throw fnError;

      if (data?.error) {
        setError(data.error);
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else if (data?.analysis) {
        setResult(data.analysis);
        toast({ title: "Analysis Complete!", description: "Social data extracted from image" });
      } else {
        setError("No analysis data received");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze image. Please try again.");
      toast({ title: "Error", description: "Analysis failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 border border-neon-pink/50 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-neon-pink" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neon-pink uppercase tracking-wider">Image to Info</h3>
          <p className="text-[10px] text-muted-foreground">AI-powered social data extraction</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="rounded-xl border-2 border-dashed border-neon-pink/30 bg-gradient-to-br from-neon-pink/5 to-neon-purple/5 p-4 transition-colors hover:border-neon-pink/50">
        {!image ? (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-neon-pink/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-neon-pink/60" />
            </div>
            <div>
              <p className="text-sm text-foreground/80">Upload or capture an image</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 10MB</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-neon-pink/40 text-neon-pink hover:bg-neon-pink/10"
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                className="border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
              >
                <Camera className="w-4 h-4 mr-1" />
                Camera
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative group">
              <img 
                src={image} 
                alt="Uploaded" 
                className="w-full max-h-[200px] object-contain rounded-lg border border-neon-pink/30"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={clearImage}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <Button
              onClick={analyzeImage}
              disabled={loading}
              className={cn(
                "w-full h-10 font-bold",
                "bg-gradient-to-r from-neon-pink to-neon-purple text-white",
                "hover:shadow-lg hover:shadow-neon-pink/30"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Extract Social Data
                </>
              )}
            </Button>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-neon-pink/30 bg-neon-pink/5 p-6 text-center">
          <Loader2 className="w-10 h-10 mx-auto text-neon-pink animate-spin mb-3" />
          <p className="text-sm text-neon-pink font-medium">Analyzing image with AI...</p>
          <p className="text-xs text-muted-foreground mt-1">Extracting social data & metadata</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-neon-red/40 bg-neon-red/5 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-neon-red font-medium">Analysis Failed</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <AnimatedJsonViewer
          data={result}
          title="🔍 IMAGE ANALYSIS RESULTS"
          accentColor="pink"
          animationSpeed={15}
          showLineNumbers={true}
        />
      )}
    </div>
  );
};

export default ImageToInfo;
