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
    if (isUnlimited) return { 
      bg: "bg-gradient-to-r from-neon-purple/20 to-neon-pink/20", 
      border: "border-neon-purple/40", 
      text: "text-neon-purple" 
    };
    if (isEmpty) return { 
      bg: "bg-gradient-to-r from-red-500/20 to-red-600/20", 
      border: "border-red-500/40", 
      text: "text-red-400" 
    };
    if (isLow) return { 
      bg: "bg-gradient-to-r from-neon-yellow/20 to-neon-orange/20", 
      border: "border-neon-yellow/40", 
      text: "text-neon-yellow" 
    };
    return { 
      bg: "bg-gradient-to-r from-neon-green/20 to-neon-cyan/20", 
      border: "border-neon-green/40", 
      text: "text-neon-green" 
    };
  };

  const styles = getStyles();

  return (
    <div className="flex items-center gap-1.5">
      {/* Credit Badge */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border backdrop-blur-sm ${styles.bg} ${styles.border} transition-all duration-300`}>
        {isUnlimited ? (
          <Sparkles className={`w-3.5 h-3.5 ${styles.text} animate-pulse`} />
        ) : (
          <Coins className={`w-3.5 h-3.5 ${styles.text}`} />
        )}
        
        <span className={`font-mono font-bold text-sm ${styles.text}`}>
          {isUnlimited ? '∞' : credits}
        </span>

        <button
          onClick={handleRefresh}
          className="p-0.5 hover:bg-white/10 rounded-md transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3 h-3 text-muted-foreground hover:${styles.text} ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
        title="Logout"
      >
        <LogOut className="w-3.5 h-3.5 text-red-400" />
      </button>
    </div>
  );
};

export default CreditDisplay;
