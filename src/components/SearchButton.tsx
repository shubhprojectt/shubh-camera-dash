import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple" | "yellow" | "blue";
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
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-300",
        "active:scale-90 min-h-[90px] backdrop-blur-sm",
        colors.border,
        colors.text,
        colors.hoverGlow,
        "hover:scale-[1.05]",
        active ? [colors.activeBg, colors.glow, "scale-[1.03]"] : [colors.bg, "border-opacity-60 hover:border-opacity-100"]
      )}
    >
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
        "bg-gradient-to-br from-current/10 via-transparent to-current/5",
        active && "opacity-100",
        "group-hover:opacity-50"
      )} />
      
      {/* Animated pulse ring on active */}
      {active && (
        <>
          <div className="absolute inset-0 rounded-2xl border-2 border-current animate-ping opacity-20" />
          <div className="absolute inset-[-2px] rounded-2xl border border-current opacity-40 animate-pulse" />
        </>
      )}
      
      {/* Top glow line when active */}
      {active && (
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 rounded-full",
          colors.bottomGlow
        )} />
      )}
      
      {/* Bottom glow indicator when active */}
      {active && (
        <div className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full",
          colors.bottomGlow
        )} />
      )}
      
      {/* Icon container with glow */}
      <div className={cn(
        "relative p-2 rounded-xl transition-all duration-300",
        active ? "bg-current/20" : "bg-current/10 group-hover:bg-current/15"
      )}>
        <Icon className={cn(
          "w-6 h-6 transition-all duration-300",
          active ? colors.iconGlow : "group-hover:scale-110"
        )} />
        {active && (
          <div className="absolute inset-0 rounded-xl bg-current/30 blur-md" />
        )}
      </div>
      
      {/* Label with enhanced styling */}
      <span className={cn(
        "text-[11px] font-bold tracking-wider uppercase text-center leading-tight relative z-10",
        active && "drop-shadow-[0_0_10px_currentColor]"
      )}>
        {label}
      </span>
      
      {/* Corner accents */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-40 rounded-tl" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-40 rounded-tr" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-40 rounded-bl" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-40 rounded-br" />
    </button>
  );
};

export default SearchButton;