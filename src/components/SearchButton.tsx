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
    bg: "bg-neon-green/5",
    hoverBg: "hover:bg-neon-green/15",
    glow: "glow-green",
    activeBg: "bg-neon-green/20",
    gradient: "from-neon-green/20 to-transparent",
  },
  pink: {
    border: "border-neon-pink",
    text: "text-neon-pink",
    bg: "bg-neon-pink/5",
    hoverBg: "hover:bg-neon-pink/15",
    glow: "glow-pink",
    activeBg: "bg-neon-pink/20",
    gradient: "from-neon-pink/20 to-transparent",
  },
  orange: {
    border: "border-neon-orange",
    text: "text-neon-orange",
    bg: "bg-neon-orange/5",
    hoverBg: "hover:bg-neon-orange/15",
    glow: "glow-orange",
    activeBg: "bg-neon-orange/20",
    gradient: "from-neon-orange/20 to-transparent",
  },
  cyan: {
    border: "border-neon-cyan",
    text: "text-neon-cyan",
    bg: "bg-neon-cyan/5",
    hoverBg: "hover:bg-neon-cyan/15",
    glow: "glow-cyan",
    activeBg: "bg-neon-cyan/20",
    gradient: "from-neon-cyan/20 to-transparent",
  },
  red: {
    border: "border-neon-red",
    text: "text-neon-red",
    bg: "bg-neon-red/5",
    hoverBg: "hover:bg-neon-red/15",
    glow: "glow-red",
    activeBg: "bg-neon-red/20",
    gradient: "from-neon-red/20 to-transparent",
  },
  purple: {
    border: "border-neon-purple",
    text: "text-neon-purple",
    bg: "bg-neon-purple/5",
    hoverBg: "hover:bg-neon-purple/15",
    glow: "glow-purple",
    activeBg: "bg-neon-purple/20",
    gradient: "from-neon-purple/20 to-transparent",
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 backdrop-blur transition-all duration-300",
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
        "absolute inset-0 rounded-lg bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        colors.gradient
      )} />
      
      {/* Corner accents */}
      <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", colors.border)} />
      <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", colors.border)} />
      <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", colors.border)} />
      <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", colors.border)} />
      
      {/* Icon with glow effect */}
      <div className="relative">
        <Icon className={cn(
          "w-7 h-7 transition-all duration-300 group-hover:scale-110",
          active && "animate-pulse"
        )} />
        {active && (
          <div className={cn(
            "absolute inset-0 blur-md opacity-50",
            colors.text
          )}>
            <Icon className="w-7 h-7" />
          </div>
        )}
      </div>
      
      {/* Label */}
      <span className="relative text-xs font-bold tracking-wider uppercase">
        {label}
      </span>
      
      {/* Active indicator */}
      {active && (
        <div className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5",
          `bg-current`
        )} />
      )}
    </button>
  );
};

export default SearchButton;