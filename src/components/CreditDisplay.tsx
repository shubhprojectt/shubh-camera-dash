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
    <div className="flex items-center gap-3">
      {/* Credit Display */}
      <div className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
        isEmpty 
          ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
          : isLow 
            ? 'bg-neon-yellow/10 border-neon-yellow/50 shadow-[0_0_15px_hsl(var(--neon-yellow)/0.2)]'
            : 'bg-neon-green/10 border-neon-green/50 shadow-[0_0_15px_hsl(var(--neon-green)/0.2)]'
      }`}>
        <Coins className={`w-5 h-5 ${
          isEmpty ? 'text-red-500' : isLow ? 'text-neon-yellow' : 'text-neon-green'
        }`} />
        
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-lg ${
            isEmpty ? 'text-red-500' : isLow ? 'text-neon-yellow' : 'text-neon-green'
          }`}>
            {credits}
          </span>
          <span className="text-[10px] text-gray-400 -mt-1">credits</span>
        </div>

        {/* Progress bar */}
        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden ml-2">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isEmpty ? 'bg-red-500' : isLow ? 'bg-neon-yellow' : 'bg-neon-green'
            }`}
            style={{ width: `${creditPercentage}%` }}
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="ml-1 p-1 hover:bg-white/10 rounded transition-colors"
          title="Refresh credits"
        >
          <RefreshCw className={`w-3 h-3 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Logout Button */}
      <Button
        onClick={logout}
        variant="outline"
        size="sm"
        className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
      >
        <LogOut className="w-4 h-4" />
      </Button>

      {/* Credits Finished Warning */}
      {isEmpty && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-red-400 text-sm whitespace-nowrap">
          Credits Finished! Contact admin for more.
        </div>
      )}
    </div>
  );
};

export default CreditDisplay;