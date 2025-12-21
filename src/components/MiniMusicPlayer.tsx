import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

interface MiniMusicPlayerProps {
  musicUrl?: string;
}

const MiniMusicPlayer = ({ musicUrl }: MiniMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);

  const src = musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset playback when source changes
    audio.pause();
    setIsPlaying(false);
    setProgress(0);
    audio.load();
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err: any) {
        setIsPlaying(false);
        toast({
          title: "Music play nahi ho raha",
          description:
            err?.message ||
            "Browser ne playback block kiya ya file load nahi hui. Try refresh.",
          variant: "destructive",
        });
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        loop
        onError={() => {
          toast({
            title: "Music load nahi ho raha",
            description: "Audio file open nahi hui. Try refresh ya URL change karo.",
            variant: "destructive",
          });
        }}
      />

      {/* Compact Player UI */}
      <div className="border border-neon-green/30 rounded-xl p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Music Icon with animation */}
          <div className="relative flex-shrink-0">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/10 flex items-center justify-center border border-neon-green/40 ${isPlaying ? "" : ""}`}>
              <Music2 className={`w-5 h-5 text-neon-green ${isPlaying ? "animate-pulse" : ""}`} />
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border border-dashed border-neon-cyan/30 animate-spin" style={{ animationDuration: "4s" }} />
            )}
          </div>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] hover:scale-105 transition-transform active:scale-95 flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-background" />
            ) : (
              <Play className="w-4 h-4 text-background ml-0.5" />
            )}
          </button>

          {/* Progress */}
          <div className="flex-1 min-w-0">
            <Slider
              value={[progress]}
              onValueChange={handleProgressClick}
              max={100}
              step={0.1}
              className="cursor-pointer"
            />
          </div>

          {/* Volume */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 transition-colors flex-shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Volume Slider - Below */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[8px] text-neon-green/60 uppercase tracking-wider">Vol</span>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={(v) => {
              const next = v[0] ?? 0;
              setVolume(next);

              if (audioRef.current) {
                if (next > 0 && isMuted) {
                  audioRef.current.muted = false;
                  setIsMuted(false);
                }
              }
            }}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniMusicPlayer;
