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
    border: "border-neon-green/60",
    text: "text-neon-green",
    glow: "shadow-[0_0_15px_hsl(var(--neon-green)/0.5),inset_0_0_10px_hsl(var(--neon-green)/0.2)]",
    activeBg: "bg-neon-green/20",
    hoverBg: "hover:bg-neon-green/10",
  },
  pink: {
    border: "border-neon-pink/60",
    text: "text-neon-pink",
    glow: "shadow-[0_0_15px_hsl(var(--neon-pink)/0.5),inset_0_0_10px_hsl(var(--neon-pink)/0.2)]",
    activeBg: "bg-neon-pink/20",
    hoverBg: "hover:bg-neon-pink/10",
  },
  orange: {
    border: "border-neon-orange/60",
    text: "text-neon-orange",
    glow: "shadow-[0_0_15px_hsl(var(--neon-orange)/0.5),inset_0_0_10px_hsl(var(--neon-orange)/0.2)]",
    activeBg: "bg-neon-orange/20",
    hoverBg: "hover:bg-neon-orange/10",
  },
  cyan: {
    border: "border-neon-cyan/60",
    text: "text-neon-cyan",
    glow: "shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5),inset_0_0_10px_hsl(var(--neon-cyan)/0.2)]",
    activeBg: "bg-neon-cyan/20",
    hoverBg: "hover:bg-neon-cyan/10",
  },
  red: {
    border: "border-neon-red/60",
    text: "text-neon-red",
    glow: "shadow-[0_0_15px_hsl(var(--neon-red)/0.5),inset_0_0_10px_hsl(var(--neon-red)/0.2)]",
    activeBg: "bg-neon-red/20",
    hoverBg: "hover:bg-neon-red/10",
  },
  purple: {
    border: "border-neon-purple/60",
    text: "text-neon-purple",
    glow: "shadow-[0_0_15px_hsl(var(--neon-purple)/0.5),inset_0_0_10px_hsl(var(--neon-purple)/0.2)]",
    activeBg: "bg-neon-purple/20",
    hoverBg: "hover:bg-neon-purple/10",
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick }: SearchButtonProps) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 backdrop-blur-sm transition-all duration-300",
        "active:scale-90 min-h-[60px]",
        colors.border,
        colors.text,
        colors.hoverBg,
        active ? [colors.activeBg, colors.glow, "scale-[1.02]"] : "bg-background/40 hover:scale-[1.03]"
      )}
    >
      {/* Animated border on active */}
      {active && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
      )}
      
      {/* Icon with glow */}
      <div className={cn(
        "relative p-1.5 rounded-lg transition-all duration-300",
        active ? "bg-current/20" : "bg-current/5 group-hover:bg-current/10"
      )}>
        <Icon className={cn(
          "w-5 h-5 transition-transform duration-300",
          active && "animate-pulse"
        )} />
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-[9px] font-bold tracking-wider uppercase leading-tight text-center",
        active && "text-glow-green"
      )}>
        {label.split(' ')[0]}
      </span>
    </button>
  );
};

export default SearchButton;