import { useEffect, useRef, useState } from "react";

interface AiFaceDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCameraReady: () => void;
  onPermissionDenied: () => void;
}

const AiFaceDetector = ({ videoRef, onCameraReady, onPermissionDenied }: AiFaceDetectorProps) => {
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"waiting" | "scanning" | "analyzing" | "denied">("waiting");
  const [scanProgress, setScanProgress] = useState(0);
  const [faceFound, setFaceFound] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const animFrameRef = useRef<number>(0);

  const analysisMessages = [
    "Mapping facial landmarks...",
    "Analyzing bone structure...",
    "Detecting micro-expressions...",
    "Processing biometric data...",
    "Scanning retinal patterns...",
    "Measuring facial symmetry...",
    "Identifying unique features...",
    "Cross-referencing database...",
    "Computing identity score...",
    "Deep analysis in progress...",
  ];

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus("scanning");
          onCameraReady();
        }
      } catch {
        setStatus("denied");
        onPermissionDenied();
      }
    };
    startCamera();
  }, []);

  // Scan progress animation
  useEffect(() => {
    if (status !== "scanning") return;
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          setFaceFound(true);
          setStatus("analyzing");
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 3 + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [status]);

  // Cycle analysis messages
  useEffect(() => {
    if (status !== "analyzing") return;
    let idx = 0;
    setAnalysisText(analysisMessages[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % analysisMessages.length;
      setAnalysisText(analysisMessages[idx]);
    }, 2500);
    return () => clearInterval(interval);
  }, [status]);

  // Draw scanning overlay on canvas
  useEffect(() => {
    if (status !== "scanning" && status !== "analyzing") return;
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;

    let frame = 0;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Scan line
      const lineY = (frame * 3) % h;
      const grad = ctx.createLinearGradient(0, lineY - 20, 0, lineY + 20);
      grad.addColorStop(0, "rgba(0,255,136,0)");
      grad.addColorStop(0.5, "rgba(0,255,136,0.6)");
      grad.addColorStop(1, "rgba(0,255,136,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, lineY - 20, w, 40);

      // Face box
      const cx = w / 2, cy = h / 2;
      const bw = w * 0.45, bh = h * 0.6;
      ctx.strokeStyle = faceFound ? "rgba(0,255,136,0.9)" : "rgba(0,200,255,0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);
      ctx.lineDashOffset = -frame * 2;
      ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);
      ctx.setLineDash([]);

      // Corner brackets
      const cornerLen = 20;
      ctx.lineWidth = 3;
      ctx.strokeStyle = faceFound ? "#00ff88" : "#00c8ff";
      const corners = [
        [cx - bw / 2, cy - bh / 2, cornerLen, 0, 0, cornerLen],
        [cx + bw / 2, cy - bh / 2, -cornerLen, 0, 0, cornerLen],
        [cx - bw / 2, cy + bh / 2, cornerLen, 0, 0, -cornerLen],
        [cx + bw / 2, cy + bh / 2, -cornerLen, 0, 0, -cornerLen],
      ];
      corners.forEach(([x, y, dx1, dy1, dx2, dy2]) => {
        ctx.beginPath();
        ctx.moveTo(x + dx1, y + dy1);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx2, y + dy2);
        ctx.stroke();
      });

      // Dots on face area
      if (status === "analyzing") {
        for (let i = 0; i < 12; i++) {
          const px = cx - bw / 2 + Math.sin(frame * 0.05 + i * 1.2) * bw * 0.4 + bw / 2;
          const py = cy - bh / 2 + Math.cos(frame * 0.04 + i * 0.9) * bh * 0.35 + bh / 2;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,136,${0.4 + Math.sin(frame * 0.1 + i) * 0.3})`;
          ctx.fill();
        }
        // Lines between dots
        ctx.strokeStyle = "rgba(0,255,136,0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
          const x1 = cx - bw / 2 + Math.sin(frame * 0.05 + i * 1.2) * bw * 0.4 + bw / 2;
          const y1 = cy - bh / 2 + Math.cos(frame * 0.04 + i * 0.9) * bh * 0.35 + bh / 2;
          const x2 = cx - bw / 2 + Math.sin(frame * 0.05 + (i + 3) * 1.2) * bw * 0.4 + bw / 2;
          const y2 = cy - bh / 2 + Math.cos(frame * 0.04 + (i + 3) * 0.9) * bh * 0.35 + bh / 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      frame++;
      animFrameRef.current = requestAnimationFrame(draw);
    };
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [status, faceFound]);

  if (status === "denied") {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center",
        justifyContent: "center", fontFamily: "Inter, -apple-system, sans-serif", padding: 20,
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: "rgba(255,60,60,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            border: "2px solid rgba(255,60,60,0.4)",
          }}>
            <span style={{ fontSize: 36 }}>⚠️</span>
          </div>
          <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>Camera Access Required</h2>
          <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>
            Please enable camera access in your browser settings to use AI Face Detection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a1a", fontFamily: "Inter, -apple-system, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        width: "100%", padding: "16px 20px", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 10, background: "rgba(0,0,0,0.5)",
        borderBottom: "1px solid rgba(0,255,136,0.2)",
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: status === "scanning" || status === "analyzing" ? "#00ff88" : "#444",
          boxShadow: status !== "waiting" ? "0 0 10px #00ff88" : "none",
          animation: status !== "waiting" ? "pulse 1.5s infinite" : "none",
        }} />
        <span style={{
          color: "#00ff88", fontSize: 13, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 2,
        }}>
          AI Face Detection
        </span>
        <span style={{
          fontSize: 10, color: "#666", background: "rgba(0,255,136,0.1)",
          padding: "2px 8px", borderRadius: 100, border: "1px solid rgba(0,255,136,0.2)",
        }}>
          v3.2
        </span>
      </div>

      {/* Camera Feed */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 480, aspectRatio: "4/3",
        margin: "20px auto 0", borderRadius: 16, overflow: "hidden",
        border: `2px solid ${faceFound ? "rgba(0,255,136,0.5)" : "rgba(0,200,255,0.3)"}`,
        boxShadow: faceFound ? "0 0 40px rgba(0,255,136,0.2)" : "0 0 20px rgba(0,200,255,0.1)",
        transition: "all 0.5s ease",
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: "scaleX(-1)", display: "block",
          }}
        />
        <canvas
          ref={canvasOverlayRef}
          width={480}
          height={360}
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            pointerEvents: "none",
          }}
        />

        {/* Status badge */}
        <div style={{
          position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 6,
          background: "rgba(0,0,0,0.7)", padding: "4px 12px", borderRadius: 100,
          border: "1px solid rgba(0,255,136,0.3)",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", background: "#ff3c3c",
            animation: "pulse 1s infinite",
          }} />
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>LIVE</span>
        </div>

        {/* FPS counter */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 100,
          color: "#00ff88", fontSize: 10, fontWeight: 600,
        }}>
          30 FPS
        </div>
      </div>

      {/* Progress / Analysis Info */}
      <div style={{
        width: "100%", maxWidth: 480, margin: "20px auto 0", padding: "0 20px",
      }}>
        {status === "scanning" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: 6,
            }}>
              <span style={{ color: "#00c8ff", fontSize: 12, fontWeight: 600 }}>
                Detecting face...
              </span>
              <span style={{ color: "#00c8ff", fontSize: 12 }}>
                {Math.min(Math.round(scanProgress), 100)}%
              </span>
            </div>
            <div style={{
              width: "100%", height: 4, background: "rgba(255,255,255,0.1)",
              borderRadius: 100, overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.min(scanProgress, 100)}%`, height: "100%",
                background: "linear-gradient(90deg, #00c8ff, #00ff88)",
                borderRadius: 100, transition: "width 0.1s",
              }} />
            </div>
          </div>
        )}

        {status === "analyzing" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,255,136,0.1)", padding: "6px 16px",
              borderRadius: 100, border: "1px solid rgba(0,255,136,0.3)",
              marginBottom: 12,
            }}>
              <span style={{ color: "#00ff88", fontSize: 12, fontWeight: 600 }}>
                ✓ Face Detected
              </span>
            </div>
            <p style={{
              color: "#00ff88", fontSize: 13, fontWeight: 500,
              animation: "fadeInOut 2.5s infinite",
            }}>
              {analysisText}
            </p>
            <div style={{
              display: "flex", justifyContent: "center", gap: 4, marginTop: 12,
            }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#00ff88",
                  animation: `bounce 1.2s ${i * 0.15}s infinite`,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px",
        background: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
      }}>
        <p style={{ color: "#444", fontSize: 10 }}>
          Powered by Neural Face Engine™ • Privacy Protected
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default AiFaceDetector;
