import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
  curved?: boolean;
}

const colorMap: Record<string, { accent: string; text: string; bg: string; activeBg: string; border: string }> = {
  green: { accent: "emerald", text: "text-emerald-400", bg: "bg-emerald-500/8", activeBg: "bg-emerald-500", border: "border-emerald-500/20" },
  pink: { accent: "pink", text: "text-pink-400", bg: "bg-pink-500/8", activeBg: "bg-pink-500", border: "border-pink-500/20" },
  orange: { accent: "amber", text: "text-amber-400", bg: "bg-amber-500/8", activeBg: "bg-amber-500", border: "border-amber-500/20" },
  cyan: { accent: "cyan", text: "text-cyan-400", bg: "bg-cyan-500/8", activeBg: "bg-cyan-500", border: "border-cyan-500/20" },
  red: { accent: "red", text: "text-red-400", bg: "bg-red-500/8", activeBg: "bg-red-500", border: "border-red-500/20" },
  purple: { accent: "violet", text: "text-violet-400", bg: "bg-violet-500/8", activeBg: "bg-violet-500", border: "border-violet-500/20" },
  yellow: { accent: "yellow", text: "text-yellow-400", bg: "bg-yellow-500/8", activeBg: "bg-yellow-500", border: "border-yellow-500/20" },
  blue: { accent: "blue", text: "text-blue-400", bg: "bg-blue-500/8", activeBg: "bg-blue-500", border: "border-blue-500/20" },
  white: { accent: "white", text: "text-white/80", bg: "bg-white/8", activeBg: "bg-white", border: "border-white/20" },
  teal: { accent: "teal", text: "text-teal-400", bg: "bg-teal-500/8", activeBg: "bg-teal-500", border: "border-teal-500/20" },
  lime: { accent: "lime", text: "text-lime-400", bg: "bg-lime-500/8", activeBg: "bg-lime-500", border: "border-lime-500/20" },
  emerald: { accent: "emerald", text: "text-emerald-400", bg: "bg-emerald-500/8", activeBg: "bg-emerald-500", border: "border-emerald-500/20" },
};

const FeatureCard = ({ icon: Icon, label, color, active, onClick, curved }: FeatureCardProps) => {
  const colors = colorMap[color] || colorMap.green;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1 p-1.5 border transition-all duration-200",
        curved ? "rounded-xl" : "rounded-lg",
        "backdrop-blur-sm",
        active
          ? `${colors.activeBg} border-transparent text-white shadow-lg shadow-${colors.accent}-500/20`
          : `bg-white/[0.04] ${colors.border} hover:bg-white/[0.08] hover:scale-[1.03]`,
        "active:scale-95"
      )}
    >
      {/* Icon container */}
      <div className={cn(
        "w-6 h-6 rounded-md flex items-center justify-center transition-all",
        active 
          ? "bg-white/20" 
          : `bg-white/[0.04] border border-white/[0.06]`
      )}>
        <Icon className={cn(
          "w-3 h-3 transition-all",
          active ? "text-white" : colors.text
        )} />
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-[7px] font-bold tracking-wider uppercase text-center leading-tight",
        active ? "text-white" : colors.text
      )}>
        {label}
      </span>
    </button>
  );
};

export default FeatureCard;
