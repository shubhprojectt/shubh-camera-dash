import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  musicUrl?: string;
}

const MusicPlayer = ({ musicUrl }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Default music URL if none provided
  const src = musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

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

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact first
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = audioRef.current?.currentTime || 0;

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {/* Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" loop />

      {/* Player UI */}
      <div className="border-2 border-neon-yellow/50 rounded-2xl shadow-[0_0_30px_hsl(var(--neon-yellow)/0.2)]">
        <div className="p-4">
          <div className="flex flex-col items-center gap-4">
            {/* Music Icon */}
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-neon-yellow/30 to-neon-orange/20 flex items-center justify-center border-2 border-neon-yellow/50 ${isPlaying ? "animate-pulse" : ""}`}>
                <Music className="w-8 h-8 text-neon-yellow" />
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-neon-orange/40 animate-spin" style={{ animationDuration: "3s" }} />
              )}
            </div>

            {/* Now Playing Label */}
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Now Playing</p>
              <p className="text-sm text-neon-yellow font-bold">Background Music</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-1">
              <Slider
                value={[progress]}
                onValueChange={handleProgressClick}
                max={100}
                step={0.1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neon-yellow/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Volume Control */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-yellow to-neon-orange flex items-center justify-center shadow-[0_0_25px_hsl(var(--neon-yellow)/0.5)] hover:scale-105 transition-transform active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-background" />
                ) : (
                  <Play className="w-6 h-6 text-background ml-0.5" />
                )}
              </button>

              {/* Volume Slider */}
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(v) => {
                    setVolume(v[0]);
                    if (v[0] > 0 && isMuted) setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
