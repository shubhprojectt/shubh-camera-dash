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
        "group relative flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border backdrop-blur transition-all duration-200",
        "hover:scale-[1.02] active:scale-95",
        colors.border,
        colors.text,
        active ? colors.activeBg : "bg-black/60",
        "hover:bg-opacity-40",
        active && colors.glow
      )}
    >
      {/* Icon */}
      <Icon className={cn(
        "w-3.5 h-3.5 flex-shrink-0",
        active && "animate-pulse"
      )} />
      
      {/* Label */}
      <span className="text-[9px] font-bold tracking-wide uppercase truncate">
        {label}
      </span>
    </button>
  );
};

export default SearchButton;