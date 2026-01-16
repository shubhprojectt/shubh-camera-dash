import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Coins, LogOut, RefreshCw, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreditDisplay = () => {
  const { credits, totalCredits, isUnlimited, logout, refreshCredits, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hide if credit system is disabled or not authenticated
  if (!settings.creditSystemEnabled || !isAuthenticated) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCredits();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isLow = credits <= 5;
  const isEmpty = credits === 0;

  return (
    <div className="flex items-center gap-2">
      {/* Credit Display */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
        isUnlimited 
          ? 'bg-primary/10 border-primary/30'
          : isEmpty 
            ? 'bg-destructive/10 border-destructive/30' 
            : isLow 
              ? 'bg-neon-yellow/10 border-neon-yellow/30'
              : 'bg-neon-green/10 border-neon-green/30'
      }`}>
        {isUnlimited ? (
          <Infinity className="w-4 h-4 text-primary" />
        ) : (
          <Coins className={`w-4 h-4 ${
            isEmpty ? 'text-destructive' : isLow ? 'text-neon-yellow' : 'text-neon-green'
          }`} />
        )}
        
        <span className={`font-semibold text-sm ${
          isUnlimited 
            ? 'text-primary'
            : isEmpty ? 'text-destructive' : isLow ? 'text-neon-yellow' : 'text-neon-green'
        }`}>
          {isUnlimited ? '∞' : credits}
        </span>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          title="Refresh credits"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Logout Button */}
      <Button
        onClick={logout}
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CreditDisplay;