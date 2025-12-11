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
    border: "border-neon-green",
    text: "text-neon-green",
    bg: "bg-gradient-to-br from-neon-green/30 via-neon-cyan/20 to-neon-green/10",
    hoverBg: "hover:from-neon-green/40 hover:via-neon-cyan/30 hover:to-neon-green/20",
    glow: "glow-green",
    activeBg: "bg-neon-green/30",
    gradient: "from-neon-green/30 to-neon-cyan/20",
  },
  pink: {
    border: "border-neon-pink",
    text: "text-neon-pink",
    bg: "bg-gradient-to-br from-neon-pink/30 via-neon-purple/20 to-neon-pink/10",
    hoverBg: "hover:from-neon-pink/40 hover:via-neon-purple/30 hover:to-neon-pink/20",
    glow: "glow-pink",
    activeBg: "bg-neon-pink/30",
    gradient: "from-neon-pink/30 to-neon-purple/20",
  },
  orange: {
    border: "border-neon-orange",
    text: "text-neon-orange",
    bg: "bg-gradient-to-br from-neon-orange/30 via-neon-yellow/20 to-neon-orange/10",
    hoverBg: "hover:from-neon-orange/40 hover:via-neon-yellow/30 hover:to-neon-orange/20",
    glow: "glow-orange",
    activeBg: "bg-neon-orange/30",
    gradient: "from-neon-orange/30 to-neon-yellow/20",
  },
  cyan: {
    border: "border-neon-cyan",
    text: "text-neon-cyan",
    bg: "bg-gradient-to-br from-neon-cyan/30 via-neon-green/20 to-neon-cyan/10",
    hoverBg: "hover:from-neon-cyan/40 hover:via-neon-green/30 hover:to-neon-cyan/20",
    glow: "glow-cyan",
    activeBg: "bg-neon-cyan/30",
    gradient: "from-neon-cyan/30 to-neon-green/20",
  },
  red: {
    border: "border-neon-red",
    text: "text-neon-red",
    bg: "bg-gradient-to-br from-neon-red/30 via-neon-orange/20 to-neon-red/10",
    hoverBg: "hover:from-neon-red/40 hover:via-neon-orange/30 hover:to-neon-red/20",
    glow: "glow-red",
    activeBg: "bg-neon-red/30",
    gradient: "from-neon-red/30 to-neon-orange/20",
  },
  purple: {
    border: "border-neon-purple",
    text: "text-neon-purple",
    bg: "bg-gradient-to-br from-neon-purple/30 via-neon-pink/20 to-neon-purple/10",
    hoverBg: "hover:from-neon-purple/40 hover:via-neon-pink/30 hover:to-neon-purple/20",
    glow: "glow-purple",
    activeBg: "bg-neon-purple/30",
    gradient: "from-neon-purple/30 to-neon-pink/20",
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 backdrop-blur transition-all duration-300",
        "hover:scale-105 hover:-translate-y-1 active:scale-95",
        colors.border,
        colors.text,
        colors.bg,
        colors.hoverBg,
        active && [colors.glow, colors.activeBg, "scale-105 -translate-y-1"]
      )}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        colors.gradient
      )} />
      
      {/* Icon with glow effect */}
      <div className="relative">
        <Icon className={cn(
          "w-6 h-6 transition-all duration-300 group-hover:scale-110",
          active && "animate-pulse"
        )} />
        {active && (
          <div className={cn(
            "absolute inset-0 blur-md opacity-50",
            colors.text
          )}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Label */}
      <span className="relative text-[10px] font-bold tracking-wider uppercase text-center leading-tight">
        {label}
      </span>
      
      {/* Active indicator */}
      {active && (
        <div className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full",
          `bg-current`
        )} />
      )}
    </button>
  );
};

export default SearchButton;