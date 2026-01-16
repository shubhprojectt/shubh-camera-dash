import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple" | "yellow" | "blue" | "white" | "teal" | "lime" | "emerald";
  active?: boolean;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
}

const colorClasses = {
  green: {
    gradient: "from-neon-green/15 to-neon-green/5",
    border: "border-neon-green/25 hover:border-neon-green/50",
    text: "text-neon-green",
    activeBg: "from-neon-green/25 to-neon-green/10",
    activeBorder: "border-neon-green/60",
    shadow: "shadow-neon-green/20",
  },
  pink: {
    gradient: "from-neon-pink/15 to-neon-pink/5",
    border: "border-neon-pink/25 hover:border-neon-pink/50",
    text: "text-neon-pink",
    activeBg: "from-neon-pink/25 to-neon-pink/10",
    activeBorder: "border-neon-pink/60",
    shadow: "shadow-neon-pink/20",
  },
  orange: {
    gradient: "from-neon-orange/15 to-neon-orange/5",
    border: "border-neon-orange/25 hover:border-neon-orange/50",
    text: "text-neon-orange",
    activeBg: "from-neon-orange/25 to-neon-orange/10",
    activeBorder: "border-neon-orange/60",
    shadow: "shadow-neon-orange/20",
  },
  cyan: {
    gradient: "from-neon-cyan/15 to-neon-cyan/5",
    border: "border-neon-cyan/25 hover:border-neon-cyan/50",
    text: "text-neon-cyan",
    activeBg: "from-neon-cyan/25 to-neon-cyan/10",
    activeBorder: "border-neon-cyan/60",
    shadow: "shadow-neon-cyan/20",
  },
  red: {
    gradient: "from-neon-red/15 to-neon-red/5",
    border: "border-neon-red/25 hover:border-neon-red/50",
    text: "text-neon-red",
    activeBg: "from-neon-red/25 to-neon-red/10",
    activeBorder: "border-neon-red/60",
    shadow: "shadow-neon-red/20",
  },
  purple: {
    gradient: "from-primary/15 to-primary/5",
    border: "border-primary/25 hover:border-primary/50",
    text: "text-primary",
    activeBg: "from-primary/25 to-primary/10",
    activeBorder: "border-primary/60",
    shadow: "shadow-primary/20",
  },
  yellow: {
    gradient: "from-neon-yellow/15 to-neon-yellow/5",
    border: "border-neon-yellow/25 hover:border-neon-yellow/50",
    text: "text-neon-yellow",
    activeBg: "from-neon-yellow/25 to-neon-yellow/10",
    activeBorder: "border-neon-yellow/60",
    shadow: "shadow-neon-yellow/20",
  },
  blue: {
    gradient: "from-secondary/15 to-secondary/5",
    border: "border-secondary/25 hover:border-secondary/50",
    text: "text-secondary",
    activeBg: "from-secondary/25 to-secondary/10",
    activeBorder: "border-secondary/60",
    shadow: "shadow-secondary/20",
  },
  white: {
    gradient: "from-white/10 to-white/5",
    border: "border-white/20 hover:border-white/40",
    text: "text-white",
    activeBg: "from-white/20 to-white/10",
    activeBorder: "border-white/50",
    shadow: "shadow-white/15",
  },
  teal: {
    gradient: "from-teal-400/15 to-teal-400/5",
    border: "border-teal-400/25 hover:border-teal-400/50",
    text: "text-teal-400",
    activeBg: "from-teal-400/25 to-teal-400/10",
    activeBorder: "border-teal-400/60",
    shadow: "shadow-teal-400/20",
  },
  lime: {
    gradient: "from-lime-400/15 to-lime-400/5",
    border: "border-lime-400/25 hover:border-lime-400/50",
    text: "text-lime-400",
    activeBg: "from-lime-400/25 to-lime-400/10",
    activeBorder: "border-lime-400/60",
    shadow: "shadow-lime-400/20",
  },
  emerald: {
    gradient: "from-emerald-400/15 to-emerald-400/5",
    border: "border-emerald-400/25 hover:border-emerald-400/50",
    text: "text-emerald-400",
    activeBg: "from-emerald-400/25 to-emerald-400/10",
    activeBorder: "border-emerald-400/60",
    shadow: "shadow-emerald-400/20",
  },
};

const sizeClasses = {
  small: {
    container: "gap-1 p-2 min-h-[52px] rounded-xl",
    icon: "w-4 h-4",
    label: "text-[9px]",
  },
  medium: {
    container: "gap-1.5 p-2.5 min-h-[64px] rounded-xl",
    icon: "w-5 h-5",
    label: "text-[10px]",
  },
  large: {
    container: "gap-2 p-3 min-h-[76px] rounded-xl",
    icon: "w-6 h-6",
    label: "text-xs",
  },
};

const SearchButton = ({ icon: Icon, label, color, active, onClick, size = "small" }: SearchButtonProps) => {
  const colors = colorClasses[color];
  const sizeConfig = sizeClasses[size];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center border transition-all duration-300",
        sizeConfig.container,
        "bg-gradient-to-b",
        active ? [colors.activeBg, colors.activeBorder, "shadow-lg", colors.shadow] : [colors.gradient, colors.border],
        "hover:shadow-md",
        colors.shadow,
        "active:scale-95"
      )}
    >
      {/* Icon */}
      <Icon className={cn(
        sizeConfig.icon,
        "transition-all duration-200",
        active ? colors.text : "text-muted-foreground group-hover:" + colors.text
      )} />
      
      {/* Label */}
      <span className={cn(
        sizeConfig.label,
        "font-semibold tracking-wide uppercase text-center leading-tight",
        active ? colors.text : "text-muted-foreground group-hover:" + colors.text
      )}>
        {label}
      </span>
      
      {/* Active indicator */}
      {active && (
        <div className={cn(
          "absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full",
          color === "purple" ? "bg-primary" : color === "blue" ? "bg-secondary" : `bg-neon-${color}`
        )} />
      )}
    </button>
  );
};

export default SearchButton;