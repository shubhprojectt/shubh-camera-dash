import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple" | "yellow" | "blue" | "white" | "teal" | "lime";
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
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all duration-200",
        "active:scale-90 min-h-[56px] backdrop-blur-sm",
        colors.border,
        colors.text,
        colors.hoverGlow,
        "hover:scale-[1.03]",
        active ? [colors.activeBg, colors.glow, "scale-[1.02] border-2"] : [colors.bg, "border-opacity-50 hover:border-opacity-100"]
      )}
    >
      {/* Animated pulse ring on active */}
      {active && (
        <div className="absolute inset-0 rounded-xl border border-current animate-ping opacity-20" />
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
        "w-4 h-4 transition-all duration-200",
        active ? colors.iconGlow : "group-hover:scale-110"
      )} />
      
      {/* Label */}
      <span className={cn(
        "text-[8px] font-bold tracking-wide uppercase text-center leading-tight",
        active && "drop-shadow-[0_0_6px_currentColor]"
      )}>
        {label}
      </span>
    </button>
  );
};

export default SearchButton;