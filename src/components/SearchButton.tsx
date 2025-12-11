import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  icon: LucideIcon;
  label: string;
  color: "green" | "pink" | "orange" | "cyan" | "red" | "purple";
  onClick?: () => void;
}

const colorClasses = {
  green: "border-neon-green text-neon-green hover:bg-neon-green/10 glow-green",
  pink: "border-neon-pink text-neon-pink hover:bg-neon-pink/10 glow-pink",
  orange: "border-neon-orange text-neon-orange hover:bg-neon-orange/10 glow-orange",
  cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 glow-cyan",
  red: "border-neon-red text-neon-red hover:bg-neon-red/10 glow-red",
  purple: "border-neon-purple text-neon-purple hover:bg-neon-purple/10 glow-purple",
};

const SearchButton = ({ icon: Icon, label, color, onClick }: SearchButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105 active:scale-95",
        colorClasses[color]
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
    </button>
  );
};

export default SearchButton;
