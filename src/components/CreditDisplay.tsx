import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Coins, LogOut, RefreshCw, Infinity, Sparkles } from "lucide-react";
import { useState } from "react";

const CreditDisplay = () => {
  const { credits, totalCredits, isUnlimited, logout, refreshCredits, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!settings.creditSystemEnabled || !isAuthenticated) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCredits();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isLow = credits <= 5;
  const isEmpty = credits === 0;

  const getColor = () => {
    if (isUnlimited) return { bg: "bg-neon-purple/15", border: "border-neon-purple/50", text: "text-neon-purple", icon: "text-neon-purple" };
    if (isEmpty) return { bg: "bg-red-500/15", border: "border-red-500/50", text: "text-red-400", icon: "text-red-400" };
    if (isLow) return { bg: "bg-neon-yellow/15", border: "border-neon-yellow/50", text: "text-neon-yellow", icon: "text-neon-yellow" };
    return { bg: "bg-neon-green/15", border: "border-neon-green/50", text: "text-neon-green", icon: "text-neon-green" };
  };

  const colors = getColor();

  return (
    <div className="flex items-center gap-1">
      {/* Credit Badge */}
      <div className={`relative flex items-center gap-1 px-2 py-1 rounded-md border ${colors.bg} ${colors.border} transition-all duration-300`}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-md opacity-20 blur-sm" 
             style={{ background: isUnlimited ? 'hsl(var(--neon-purple))' : isEmpty ? 'rgb(239 68 68)' : isLow ? 'hsl(var(--neon-yellow))' : 'hsl(var(--neon-green))' }} />
        
        <div className="relative flex items-center gap-1">
          {isUnlimited ? (
            <Sparkles className={`w-3 h-3 ${colors.icon} animate-pulse`} />
          ) : (
            <Coins className={`w-3 h-3 ${colors.icon}`} />
          )}
          
          <span className={`font-mono font-bold text-xs ${colors.text}`}>
            {isUnlimited ? '∞' : credits}
          </span>

          <button
            onClick={handleRefresh}
            className="p-0.5 hover:bg-white/10 rounded transition-colors ml-0.5"
            title="Refresh"
          >
            <RefreshCw className={`w-2.5 h-2.5 text-muted-foreground hover:text-white ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="p-1.5 rounded-md border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 transition-all"
        title="Logout"
      >
        <LogOut className="w-3 h-3 text-red-400" />
      </button>
    </div>
  );
};

export default CreditDisplay;