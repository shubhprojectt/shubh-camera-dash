import { useAuth } from "@/contexts/AuthContext";
import { Coins, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreditDisplay = () => {
  const { credits, totalCredits, logout, refreshCredits, isAuthenticated } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isAuthenticated) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCredits();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const creditPercentage = totalCredits > 0 ? (credits / totalCredits) * 100 : 0;
  const isLow = credits <= 5;
  const isEmpty = credits === 0;

  return (
    <div className="flex items-center gap-2">
      {/* Simple Credit Display */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
        isEmpty 
          ? 'bg-red-500/10 border-red-500/50' 
          : isLow 
            ? 'bg-neon-yellow/10 border-neon-yellow/50'
            : 'bg-neon-green/10 border-neon-green/50'
      }`}>
        <Coins className={`w-4 h-4 ${
          isEmpty ? 'text-red-500' : isLow ? 'text-neon-yellow' : 'text-neon-green'
        }`} />
        
        <span className={`font-mono font-bold text-base ${
          isEmpty ? 'text-red-500' : isLow ? 'text-neon-yellow' : 'text-neon-green'
        }`}>
          {credits}
        </span>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="p-0.5 hover:bg-white/10 rounded transition-colors"
          title="Refresh credits"
        >
          <RefreshCw className={`w-3 h-3 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Logout Button */}
      <Button
        onClick={logout}
        variant="outline"
        size="icon"
        className="h-8 w-8 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CreditDisplay;