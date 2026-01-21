import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple" | "yellow" | "blue" | "white" | "teal" | "lime" | "emerald";
  active?: boolean;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  particleEnabled?: boolean;
  particleCount?: number;
  particleSpeed?: number;
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
    ringColor: "ring-neon-green/50",
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
    ringColor: "ring-neon-pink/50",
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
    ringColor: "ring-neon-orange/50",
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
    ringColor: "ring-neon-cyan/50",
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
    ringColor: "ring-neon-red/50",
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
    ringColor: "ring-neon-purple/50",
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
    ringColor: "ring-neon-yellow/50",
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
    ringColor: "ring-neon-blue/50",
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
    ringColor: "ring-white/50",
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
    ringColor: "ring-teal-400/50",
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
    ringColor: "ring-lime-400/50",
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
    ringColor: "ring-emerald-400/50",
  },
};

const sizeClasses = {
  small: {
    circle: "w-12 h-12",
    icon: "w-5 h-5",
    label: "text-[8px]",
  },
  medium: {
    circle: "w-14 h-14",
    icon: "w-6 h-6",
    label: "text-[9px]",
  },
  large: {
    circle: "w-16 h-16",
    icon: "w-7 h-7",
    label: "text-[10px]",
  },
};

const SearchButton = ({ 
  icon: Icon, 
  label, 
  color, 
  active, 
  onClick, 
  size = "small",
  particleEnabled = true,
  particleCount = 3,
  particleSpeed = 1
}: SearchButtonProps) => {
  const colors = colorClasses[color];
  const sizeConfig = sizeClasses[size];
  
  // Calculate animation durations based on speed multiplier
  const orbitDurations = [
    `${3 / particleSpeed}s`,
    `${4 / particleSpeed}s`,
    `${5 / particleSpeed}s`,
    `${3.5 / particleSpeed}s`,
    `${4.5 / particleSpeed}s`,
  ];
  
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 transition-all duration-300"
    >
      {/* Round Icon Container */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2 transition-all duration-300",
          "active:scale-90",
          sizeConfig.circle,
          colors.border,
          colors.text,
          colors.hoverGlow,
          "hover:scale-110",
          active 
            ? [colors.activeBg, colors.glow, "scale-105 border-[3px]", colors.activeAnimation, "ring-4", colors.ringColor] 
            : [colors.bg, "border-opacity-60 hover:border-opacity-100"]
        )}
      >
        {/* Floating Particles around active tab */}
        {active && particleEnabled && (
          <>
            {particleCount >= 1 && (
              <span 
                className={cn(
                  "absolute w-1.5 h-1.5 rounded-full animate-orbit-1",
                  colors.text,
                  "opacity-80 blur-[0.5px]"
                )} 
                style={{ 
                  boxShadow: '0 0 6px currentColor',
                  animationDuration: orbitDurations[0]
                }} 
              />
            )}
            {particleCount >= 2 && (
              <span 
                className={cn(
                  "absolute w-1 h-1 rounded-full animate-orbit-2",
                  colors.text,
                  "opacity-70 blur-[0.5px]"
                )} 
                style={{ 
                  boxShadow: '0 0 4px currentColor',
                  animationDuration: orbitDurations[1]
                }} 
              />
            )}
            {particleCount >= 3 && (
              <span 
                className={cn(
                  "absolute w-1.5 h-1.5 rounded-full animate-orbit-3",
                  colors.text,
                  "opacity-75 blur-[0.5px]"
                )} 
                style={{ 
                  boxShadow: '0 0 5px currentColor',
                  animationDuration: orbitDurations[2]
                }} 
              />
            )}
            {particleCount >= 4 && (
              <span 
                className={cn(
                  "absolute w-1 h-1 rounded-full animate-orbit-1",
                  colors.text,
                  "opacity-60 blur-[0.5px]"
                )} 
                style={{ 
                  boxShadow: '0 0 4px currentColor',
                  animationDuration: orbitDurations[3]
                }} 
              />
            )}
            {particleCount >= 5 && (
              <span 
                className={cn(
                  "absolute w-1 h-1 rounded-full animate-orbit-2",
                  colors.text,
                  "opacity-65 blur-[0.5px]"
                )} 
                style={{ 
                  boxShadow: '0 0 3px currentColor',
                  animationDuration: orbitDurations[4]
                }} 
              />
            )}
          </>
        )}
        
        {/* Animated pulse ring on active */}
        {active && (
          <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-30" />
        )}
        
        {/* Inner glow circle when active */}
        {active && (
          <div className={cn(
            "absolute inset-1 rounded-full opacity-20",
            colors.activeBg
          )} />
        )}
        
        {/* Icon */}
        <Icon className={cn(
          sizeConfig.icon,
          "transition-all duration-200 relative z-10",
          active ? colors.iconGlow : "group-hover:scale-110"
        )} />
      </div>
      
      {/* Label Below */}
      <span className={cn(
        sizeConfig.label,
        "font-bold tracking-wider uppercase text-center leading-tight max-w-[60px] transition-all duration-200",
        colors.text,
        active && "drop-shadow-[0_0_8px_currentColor] scale-105"
      )}>
        {label}
      </span>
    </button>
  );
};

export default SearchButton;
