import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple" | "yellow" | "blue" | "white" | "teal" | "lime" | "emerald";
  active?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  green: {
    border: "border-neon-green",
    text: "text-neon-green",
    bg: "bg-neon-green/10",
    activeBg: "bg-neon-green/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-green)/0.7),0_0_50px_hsl(var(--neon-green)/0.4),inset_0_0_20px_hsl(var(--neon-green)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-green))]",
    bottomGlow: "bg-neon-green shadow-[0_0_15px_hsl(var(--neon-green)),0_0_30px_hsl(var(--neon-green)/0.5)]",
    activeAnimation: "animate-glow-breathe",
  },
  pink: {
    border: "border-neon-pink",
    text: "text-neon-pink",
    bg: "bg-neon-pink/10",
    activeBg: "bg-neon-pink/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-pink)/0.7),0_0_50px_hsl(var(--neon-pink)/0.4),inset_0_0_20px_hsl(var(--neon-pink)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-pink))]",
    bottomGlow: "bg-neon-pink shadow-[0_0_15px_hsl(var(--neon-pink)),0_0_30px_hsl(var(--neon-pink)/0.5)]",
    activeAnimation: "animate-heartbeat",
  },
  orange: {
    border: "border-neon-orange",
    text: "text-neon-orange",
    bg: "bg-neon-orange/10",
    activeBg: "bg-neon-orange/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-orange)/0.7),0_0_50px_hsl(var(--neon-orange)/0.4),inset_0_0_20px_hsl(var(--neon-orange)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-orange)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-orange))]",
    bottomGlow: "bg-neon-orange shadow-[0_0_15px_hsl(var(--neon-orange)),0_0_30px_hsl(var(--neon-orange)/0.5)]",
    activeAnimation: "animate-wiggle",
  },
  cyan: {
    border: "border-neon-cyan",
    text: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
    activeBg: "bg-neon-cyan/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-cyan)/0.7),0_0_50px_hsl(var(--neon-cyan)/0.4),inset_0_0_20px_hsl(var(--neon-cyan)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-cyan))]",
    bottomGlow: "bg-neon-cyan shadow-[0_0_15px_hsl(var(--neon-cyan)),0_0_30px_hsl(var(--neon-cyan)/0.5)]",
    activeAnimation: "animate-radar-sweep",
  },
  red: {
    border: "border-neon-red",
    text: "text-neon-red",
    bg: "bg-neon-red/10",
    activeBg: "bg-neon-red/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-red)/0.7),0_0_50px_hsl(var(--neon-red)/0.4),inset_0_0_20px_hsl(var(--neon-red)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-red)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-red))]",
    bottomGlow: "bg-neon-red shadow-[0_0_15px_hsl(var(--neon-red)),0_0_30px_hsl(var(--neon-red)/0.5)]",
    activeAnimation: "animate-neon-flicker-fast",
  },
  purple: {
    border: "border-neon-purple",
    text: "text-neon-purple",
    bg: "bg-neon-purple/10",
    activeBg: "bg-neon-purple/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-purple)/0.7),0_0_50px_hsl(var(--neon-purple)/0.4),inset_0_0_20px_hsl(var(--neon-purple)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-purple))]",
    bottomGlow: "bg-neon-purple shadow-[0_0_15px_hsl(var(--neon-purple)),0_0_30px_hsl(var(--neon-purple)/0.5)]",
    activeAnimation: "animate-shimmer-rotate",
  },
  yellow: {
    border: "border-neon-yellow",
    text: "text-neon-yellow",
    bg: "bg-neon-yellow/10",
    activeBg: "bg-neon-yellow/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-yellow)/0.7),0_0_50px_hsl(var(--neon-yellow)/0.4),inset_0_0_20px_hsl(var(--neon-yellow)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-yellow)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-yellow))]",
    bottomGlow: "bg-neon-yellow shadow-[0_0_15px_hsl(var(--neon-yellow)),0_0_30px_hsl(var(--neon-yellow)/0.5)]",
    activeAnimation: "animate-electric-zap",
  },
  blue: {
    border: "border-neon-blue",
    text: "text-neon-blue",
    bg: "bg-neon-blue/10",
    activeBg: "bg-neon-blue/25",
    glow: "shadow-[0_0_25px_hsl(var(--neon-blue)/0.7),0_0_50px_hsl(var(--neon-blue)/0.4),inset_0_0_20px_hsl(var(--neon-blue)/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(var(--neon-blue))]",
    bottomGlow: "bg-neon-blue shadow-[0_0_15px_hsl(var(--neon-blue)),0_0_30px_hsl(var(--neon-blue)/0.5)]",
    activeAnimation: "animate-float-gentle",
  },
  white: {
    border: "border-white",
    text: "text-white",
    bg: "bg-white/10",
    activeBg: "bg-white/25",
    glow: "shadow-[0_0_25px_hsl(0_0%_100%/0.7),0_0_50px_hsl(0_0%_100%/0.4),inset_0_0_20px_hsl(0_0%_100%/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(0_0%_100%/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(0_0%_100%)]",
    bottomGlow: "bg-white shadow-[0_0_15px_hsl(0_0%_100%),0_0_30px_hsl(0_0%_100%/0.5)]",
    activeAnimation: "animate-flash-blink",
  },
  teal: {
    border: "border-teal-400",
    text: "text-teal-400",
    bg: "bg-teal-400/10",
    activeBg: "bg-teal-400/25",
    glow: "shadow-[0_0_25px_hsl(171_77%_64%/0.7),0_0_50px_hsl(171_77%_64%/0.4),inset_0_0_20px_hsl(171_77%_64%/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(171_77%_64%/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(171_77%_64%)]",
    bottomGlow: "bg-teal-400 shadow-[0_0_15px_hsl(171_77%_64%),0_0_30px_hsl(171_77%_64%/0.5)]",
    activeAnimation: "animate-bounce-subtle",
  },
  lime: {
    border: "border-lime-400",
    text: "text-lime-400",
    bg: "bg-lime-400/10",
    activeBg: "bg-lime-400/25",
    glow: "shadow-[0_0_25px_hsl(82_85%_67%/0.7),0_0_50px_hsl(82_85%_67%/0.4),inset_0_0_20px_hsl(82_85%_67%/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(82_85%_67%/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(82_85%_67%)]",
    bottomGlow: "bg-lime-400 shadow-[0_0_15px_hsl(82_85%_67%),0_0_30px_hsl(82_85%_67%/0.5)]",
    activeAnimation: "animate-color-shift",
  },
  emerald: {
    border: "border-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    activeBg: "bg-emerald-400/25",
    glow: "shadow-[0_0_25px_hsl(158_64%_52%/0.7),0_0_50px_hsl(158_64%_52%/0.4),inset_0_0_20px_hsl(158_64%_52%/0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_hsl(158_64%_52%/0.5)]",
    iconGlow: "drop-shadow-[0_0_10px_hsl(158_64%_52%)]",
    bottomGlow: "bg-emerald-400 shadow-[0_0_15px_hsl(158_64%_52%),0_0_30px_hsl(158_64%_52%/0.5)]",
    activeAnimation: "animate-ripple-pulse",
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg border transition-all duration-300",
        "active:scale-90 min-h-[44px]",
        colors.border,
        colors.text,
        colors.hoverGlow,
        "hover:scale-[1.03]",
        active ? [colors.activeBg, colors.glow, "scale-[1.02] border-2", colors.activeAnimation] : [colors.bg, "border-opacity-50 hover:border-opacity-100"]
      )}
    >
      {/* Animated pulse ring on active */}
      {active && (
        <div className="absolute inset-0 rounded-lg border border-current animate-ping opacity-20" />
      )}
      
      {/* Bottom glow indicator when active */}
      {active && (
        <div className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 rounded-full",
          colors.bottomGlow
        )} />
      )}
      
      {/* Icon */}
      <Icon className={cn(
        "w-3.5 h-3.5 transition-all duration-200",
        active ? colors.iconGlow : "group-hover:scale-110"
      )} />
      
      {/* Label */}
      <span className={cn(
        "text-[7px] font-bold tracking-wide uppercase text-center leading-tight",
        active && "drop-shadow-[0_0_6px_currentColor]"
      )}>
        {label}
      </span>
    </button>
  );
};

export default SearchButton;