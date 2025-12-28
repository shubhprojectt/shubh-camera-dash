import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Video, CheckCircle } from "lucide-react";

const VideoCapture = () => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [status, setStatus] = useState<"waiting" | "recording" | "uploading" | "done" | "error">("waiting");
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  
  const sessionId = searchParams.get("session") || "default";
  const duration = parseInt(searchParams.get("duration") || "5", 10);
  const redirectUrl = searchParams.get("redirect") || "";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check for supported mime types
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Create blob and upload
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await uploadVideo(blob);
      };

      // Start recording
      setStatus("recording");
      mediaRecorder.start(1000); // Collect data every second

      // Countdown timer
      let timeLeft = duration;
      setCountdown(timeLeft);
      
      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          mediaRecorder.stop();
        }
      }, 1000);

    } catch (error: any) {
      console.error("Camera access error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Camera access denied");
    }
  };

  const uploadVideo = async (blob: Blob) => {
    setStatus("uploading");
    
    try {
      const fileName = `${sessionId}/${Date.now()}.webm`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('captured-videos')
        .upload(fileName, blob, {
          contentType: 'video/webm',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('captured-videos')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('captured_videos')
        .insert({
          session_id: sessionId,
          video_url: urlData.publicUrl,
          duration_seconds: duration,
          user_agent: navigator.userAgent
        });

      if (dbError) {
        console.error("DB error:", dbError);
      }

      setStatus("done");

      // Redirect after a short delay
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }

    } catch (error: any) {
      console.error("Upload error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Hidden video for preview */}
        <video 
          ref={videoRef} 
          className={status === "recording" ? "w-full rounded-2xl shadow-2xl mb-6" : "hidden"} 
          autoPlay 
          playsInline 
          muted 
        />

        {status === "waiting" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Video Message</h1>
            <p className="text-white/70 mb-6">
              Record a {duration} second video message
            </p>
            <button
              onClick={startRecording}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-pink-500/25"
            >
              Start Recording
            </button>
            <p className="text-white/50 text-xs mt-4">
              Camera and microphone access required
            </p>
          </div>
        )}

        {status === "recording" && (
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{countdown}</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            </div>
            <p className="text-white text-lg font-medium">Recording...</p>
            <p className="text-white/60 text-sm">Keep looking at the camera</p>
          </div>
        )}

        {status === "uploading" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-lg font-medium">Uploading video...</p>
            <p className="text-white/60 text-sm">Please wait</p>
          </div>
        )}

        {status === "done" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-green-500/30">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Video Saved!</h2>
            <p className="text-white/70">
              {redirectUrl ? "Redirecting..." : "Thank you for your video message"}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/30">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-white/70 mb-4">{errorMessage}</p>
            <button
              onClick={() => setStatus("waiting")}
              className="px-6 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCapture;
