import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
}

const colorMap: Record<string, { gradient: string; border: string; text: string; glow: string; bg: string }> = {
  green: {
    gradient: "from-neon-green/20 to-neon-green/5",
    border: "border-neon-green/40 hover:border-neon-green",
    text: "text-neon-green",
    glow: "shadow-[0_0_30px_hsl(var(--neon-green)/0.4)]",
    bg: "bg-neon-green",
  },
  pink: {
    gradient: "from-neon-pink/20 to-neon-pink/5",
    border: "border-neon-pink/40 hover:border-neon-pink",
    text: "text-neon-pink",
    glow: "shadow-[0_0_30px_hsl(var(--neon-pink)/0.4)]",
    bg: "bg-neon-pink",
  },
  orange: {
    gradient: "from-neon-orange/20 to-neon-orange/5",
    border: "border-neon-orange/40 hover:border-neon-orange",
    text: "text-neon-orange",
    glow: "shadow-[0_0_30px_hsl(var(--neon-orange)/0.4)]",
    bg: "bg-neon-orange",
  },
  cyan: {
    gradient: "from-neon-cyan/20 to-neon-cyan/5",
    border: "border-neon-cyan/40 hover:border-neon-cyan",
    text: "text-neon-cyan",
    glow: "shadow-[0_0_30px_hsl(var(--neon-cyan)/0.4)]",
    bg: "bg-neon-cyan",
  },
  red: {
    gradient: "from-neon-red/20 to-neon-red/5",
    border: "border-neon-red/40 hover:border-neon-red",
    text: "text-neon-red",
    glow: "shadow-[0_0_30px_hsl(var(--neon-red)/0.4)]",
    bg: "bg-neon-red",
  },
  purple: {
    gradient: "from-neon-purple/20 to-neon-purple/5",
    border: "border-neon-purple/40 hover:border-neon-purple",
    text: "text-neon-purple",
    glow: "shadow-[0_0_30px_hsl(var(--neon-purple)/0.4)]",
    bg: "bg-neon-purple",
  },
  yellow: {
    gradient: "from-neon-yellow/20 to-neon-yellow/5",
    border: "border-neon-yellow/40 hover:border-neon-yellow",
    text: "text-neon-yellow",
    glow: "shadow-[0_0_30px_hsl(var(--neon-yellow)/0.4)]",
    bg: "bg-neon-yellow",
  },
  blue: {
    gradient: "from-neon-blue/20 to-neon-blue/5",
    border: "border-neon-blue/40 hover:border-neon-blue",
    text: "text-neon-blue",
    glow: "shadow-[0_0_30px_hsl(var(--neon-blue)/0.4)]",
    bg: "bg-neon-blue",
  },
  white: {
    gradient: "from-white/20 to-white/5",
    border: "border-white/40 hover:border-white",
    text: "text-white",
    glow: "shadow-[0_0_30px_hsl(0_0%_100%/0.4)]",
    bg: "bg-white",
  },
  teal: {
    gradient: "from-teal-400/20 to-teal-400/5",
    border: "border-teal-400/40 hover:border-teal-400",
    text: "text-teal-400",
    glow: "shadow-[0_0_30px_rgba(45,212,191,0.4)]",
    bg: "bg-teal-400",
  },
  lime: {
    gradient: "from-lime-400/20 to-lime-400/5",
    border: "border-lime-400/40 hover:border-lime-400",
    text: "text-lime-400",
    glow: "shadow-[0_0_30px_rgba(163,230,53,0.4)]",
    bg: "bg-lime-400",
  },
  emerald: {
    gradient: "from-emerald-400/20 to-emerald-400/5",
    border: "border-emerald-400/40 hover:border-emerald-400",
    text: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.4)]",
    bg: "bg-emerald-400",
  },
};

const FeatureCard = ({ icon: Icon, label, color, active, onClick }: FeatureCardProps) => {
  const colors = colorMap[color] || colorMap.green;

  return (
    <button
      onClick={onClick}
      className="relative p-[1.5px] rounded-lg transition-all duration-200 hover:scale-[1.03] active:scale-95"
    >
      {/* Animated rainbow border */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan via-neon-pink to-neon-green animate-rainbow-border"
          style={{ backgroundSize: '300% 100%' }}
        />
      </div>
      
      {/* Inner content */}
      <div className={cn(
        "relative flex flex-col items-center gap-1 p-2 rounded-[6px]",
        "backdrop-blur-sm bg-gradient-to-br",
        colors.gradient,
        "bg-card/95",
        active && [colors.glow, "scale-[1.02]"]
      )}>
        {/* Active glow ring */}
        {active && (
          <div className={cn(
            "absolute -inset-0.5 rounded-[6px] opacity-40 blur-sm",
            `bg-gradient-to-br ${colors.gradient}`
          )} />
        )}
        
        {/* Icon container - compact */}
        <div className={cn(
          "relative w-7 h-7 rounded-md flex items-center justify-center",
          "bg-gradient-to-br from-background/90 to-background/50",
          "border border-current/20",
          colors.text
        )}>
          {active && (
            <div className="absolute inset-0 rounded-md bg-current/15" />
          )}
          <Icon className={cn(
            "w-3.5 h-3.5 transition-all duration-200",
            active && "drop-shadow-[0_0_4px_currentColor] scale-110"
          )} />
        </div>
        
        {/* Label - compact */}
        <span className={cn(
          "text-[8px] font-bold tracking-wide uppercase text-center leading-tight",
          colors.text,
          active && "drop-shadow-[0_0_3px_currentColor]"
        )}>
          {label}
        </span>
        
        {/* Active indicator */}
        {active && (
          <div className={cn("absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full", colors.bg)} />
        )}
      </div>
    </button>
  );
};

export default FeatureCard;
