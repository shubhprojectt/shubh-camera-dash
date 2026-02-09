import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Coins, LogOut, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";

const CreditDisplay = () => {
  const { credits, isUnlimited, logout, refreshCredits, isAuthenticated } = useAuth();
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

  const getStyles = () => {
    if (isUnlimited) return { bg: "bg-violet-500/15", border: "border-violet-500/25", text: "text-violet-400" };
    if (isEmpty) return { bg: "bg-red-500/15", border: "border-red-500/25", text: "text-red-400" };
    if (isLow) return { bg: "bg-amber-500/15", border: "border-amber-500/25", text: "text-amber-400" };
    return { bg: "bg-emerald-500/15", border: "border-emerald-500/25", text: "text-emerald-400" };
  };

  const styles = getStyles();

  return (
    <div className="flex items-center gap-1.5">
      {/* Credit Badge */}
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm ${styles.bg} ${styles.border} transition-all duration-300`}>
        {isUnlimited ? (
          <Sparkles className={`w-3.5 h-3.5 ${styles.text} animate-pulse`} />
        ) : (
          <Coins className={`w-3.5 h-3.5 ${styles.text}`} />
        )}
        
        <span className={`font-mono font-bold text-[13px] ${styles.text}`}>
          {isUnlimited ? '∞' : credits}
        </span>

        <button
          onClick={handleRefresh}
          className="p-0.5 hover:bg-white/10 rounded-md transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3 h-3 text-white/40 hover:text-white/60 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all"
        title="Logout"
      >
        <LogOut className="w-3.5 h-3.5 text-red-400" />
      </button>
    </div>
  );
};

export default CreditDisplay;
