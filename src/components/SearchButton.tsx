import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple";
  active?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  green: {
    border: "border-neon-green/70",
    text: "text-neon-green",
    bg: "bg-gradient-to-br from-neon-green/25 to-neon-cyan/10",
    activeBg: "bg-gradient-to-br from-neon-green/40 to-neon-cyan/20",
    glow: "shadow-[0_0_20px_hsl(var(--neon-green)/0.6),0_0_40px_hsl(var(--neon-green)/0.3)]",
    hoverGlow: "hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.4)]",
    iconBg: "bg-neon-green/20",
  },
  pink: {
    border: "border-neon-pink/70",
    text: "text-neon-pink",
    bg: "bg-gradient-to-br from-neon-pink/25 to-neon-purple/10",
    activeBg: "bg-gradient-to-br from-neon-pink/40 to-neon-purple/20",
    glow: "shadow-[0_0_20px_hsl(var(--neon-pink)/0.6),0_0_40px_hsl(var(--neon-pink)/0.3)]",
    hoverGlow: "hover:shadow-[0_0_15px_hsl(var(--neon-pink)/0.4)]",
    iconBg: "bg-neon-pink/20",
  },
  orange: {
    border: "border-neon-orange/70",
    text: "text-neon-orange",
    bg: "bg-gradient-to-br from-neon-orange/25 to-neon-yellow/10",
    activeBg: "bg-gradient-to-br from-neon-orange/40 to-neon-yellow/20",
    glow: "shadow-[0_0_20px_hsl(var(--neon-orange)/0.6),0_0_40px_hsl(var(--neon-orange)/0.3)]",
    hoverGlow: "hover:shadow-[0_0_15px_hsl(var(--neon-orange)/0.4)]",
    iconBg: "bg-neon-orange/20",
  },
  cyan: {
    border: "border-neon-cyan/70",
    text: "text-neon-cyan",
    bg: "bg-gradient-to-br from-neon-cyan/25 to-neon-green/10",
    activeBg: "bg-gradient-to-br from-neon-cyan/40 to-neon-green/20",
    glow: "shadow-[0_0_20px_hsl(var(--neon-cyan)/0.6),0_0_40px_hsl(var(--neon-cyan)/0.3)]",
    hoverGlow: "hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)]",
    iconBg: "bg-neon-cyan/20",
  },
  red: {
    border: "border-neon-red/70",
    text: "text-neon-red",
    bg: "bg-gradient-to-br from-neon-red/25 to-neon-orange/10",
    activeBg: "bg-gradient-to-br from-neon-red/40 to-neon-orange/20",
    glow: "shadow-[0_0_20px_hsl(var(--neon-red)/0.6),0_0_40px_hsl(var(--neon-red)/0.3)]",
    hoverGlow: "hover:shadow-[0_0_15px_hsl(var(--neon-red)/0.4)]",
    iconBg: "bg-neon-red/20",
  },
  purple: {
    border: "border-neon-purple/70",
    text: "text-neon-purple",
    bg: "bg-gradient-to-br from-neon-purple/25 to-neon-pink/10",
    activeBg: "bg-gradient-to-br from-neon-purple/40 to-neon-pink/20",
    glow: "shadow-[0_0_20px_hsl(var(--neon-purple)/0.6),0_0_40px_hsl(var(--neon-purple)/0.3)]",
    hoverGlow: "hover:shadow-[0_0_15px_hsl(var(--neon-purple)/0.4)]",
    iconBg: "bg-neon-purple/20",
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 backdrop-blur-sm transition-all duration-300",
        "active:scale-90 min-h-[72px]",
        colors.border,
        colors.text,
        colors.hoverGlow,
        "hover:scale-[1.03]",
        active ? [colors.activeBg, colors.glow, "scale-[1.02] border-opacity-100"] : [colors.bg, "border-opacity-50"]
      )}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current rounded-tl-lg opacity-60" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current rounded-tr-lg opacity-60" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current rounded-bl-lg opacity-60" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current rounded-br-lg opacity-60" />
      
      {/* Animated scan line on active */}
      {active && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current to-transparent opacity-10 animate-pulse" />
        </div>
      )}
      
      {/* Icon with background */}
      <div className={cn(
        "relative p-2 rounded-lg transition-all duration-300",
        active ? colors.iconBg : "bg-current/10 group-hover:bg-current/15"
      )}>
        <Icon className={cn(
          "w-5 h-5 transition-all duration-300",
          active && "drop-shadow-[0_0_8px_currentColor]"
        )} />
      </div>
      
      {/* Full Label */}
      <span className={cn(
        "text-[10px] font-bold tracking-wider uppercase text-center leading-tight transition-all",
        active && "drop-shadow-[0_0_6px_currentColor]"
      )}>
        {label}
      </span>
    </button>
  );
};

export default SearchButton;