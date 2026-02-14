import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
  curved?: boolean;
  disabled?: boolean;
}

export type { FeatureCardProps };

const colorMap: Record<string, { text: string; glow: string; border: string; activeBg: string; activeShadow: string }> = {
  green: { text: "text-emerald-400", glow: "shadow-emerald-500/30", border: "border-emerald-500/40", activeBg: "bg-emerald-500", activeShadow: "shadow-emerald-500/40" },
  pink: { text: "text-pink-400", glow: "shadow-pink-500/30", border: "border-pink-500/40", activeBg: "bg-pink-500", activeShadow: "shadow-pink-500/40" },
  orange: { text: "text-amber-400", glow: "shadow-amber-500/30", border: "border-amber-500/40", activeBg: "bg-amber-500", activeShadow: "shadow-amber-500/40" },
  cyan: { text: "text-cyan-400", glow: "shadow-cyan-500/30", border: "border-cyan-500/40", activeBg: "bg-cyan-500", activeShadow: "shadow-cyan-500/40" },
  red: { text: "text-red-400", glow: "shadow-red-500/30", border: "border-red-500/40", activeBg: "bg-red-500", activeShadow: "shadow-red-500/40" },
  purple: { text: "text-violet-400", glow: "shadow-violet-500/30", border: "border-violet-500/40", activeBg: "bg-violet-500", activeShadow: "shadow-violet-500/40" },
  yellow: { text: "text-yellow-400", glow: "shadow-yellow-500/30", border: "border-yellow-500/40", activeBg: "bg-yellow-500", activeShadow: "shadow-yellow-500/40" },
  blue: { text: "text-blue-400", glow: "shadow-blue-500/30", border: "border-blue-500/40", activeBg: "bg-blue-500", activeShadow: "shadow-blue-500/40" },
  white: { text: "text-white/90", glow: "shadow-white/20", border: "border-white/25", activeBg: "bg-white/80", activeShadow: "shadow-white/30" },
  teal: { text: "text-teal-400", glow: "shadow-teal-500/30", border: "border-teal-500/40", activeBg: "bg-teal-500", activeShadow: "shadow-teal-500/40" },
  lime: { text: "text-lime-400", glow: "shadow-lime-500/30", border: "border-lime-500/40", activeBg: "bg-lime-500", activeShadow: "shadow-lime-500/40" },
  emerald: { text: "text-emerald-400", glow: "shadow-emerald-500/30", border: "border-emerald-500/40", activeBg: "bg-emerald-500", activeShadow: "shadow-emerald-500/40" },
};

const FeatureCard = ({ icon: Icon, label, color, active, onClick, curved, disabled }: FeatureCardProps) => {
  const colors = colorMap[color] || colorMap.pink;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-1.5 p-2 border transition-all duration-200",
        curved ? "rounded-2xl" : "rounded-xl",
        disabled && !active ? "opacity-30 grayscale" : "",
        active
          ? `${colors.activeBg} border-transparent text-white shadow-lg ${colors.activeShadow}`
          : `bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:${colors.border} hover:shadow-md ${colors.glow.replace('/30', '/0')} hover:${colors.glow}`,
        "active:scale-[0.96]"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
        active 
          ? "bg-white/30" 
          : "bg-white/[0.06]"
      )}>
        <Icon className={cn(
          "w-3.5 h-3.5 transition-all",
          active ? "text-white" : colors.text
        )} />
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-[7px] font-bold tracking-wider uppercase text-center leading-tight max-w-full truncate",
        active ? "text-white" : colors.text
      )}>
        {label}
      </span>

      {/* Active indicator dot */}
      {active && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-sm shadow-white/50" />
      )}
    </button>
  );
};

export default FeatureCard;
