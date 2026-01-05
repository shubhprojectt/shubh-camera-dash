import { useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";

interface PasswordProtectionProps {
  children: ReactNode;
}

const PasswordProtection = ({ children }: PasswordProtectionProps) => {
  const { settings } = useSettings();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  const handleUnlock = () => {
    if (password === settings.sitePassword) {
      setIsUnlocked(true);
      // Set session flag so Page2 knows user came through main page
      sessionStorage.setItem("site_unlocked", "true");
      toast({
        title: "Access Granted",
        description: "Welcome to SHUBH OSINT",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Wrong password! Try again.",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  // If password protection is disabled, show children directly
  if (!settings.sitePasswordEnabled) {
    return <>{children}</>;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03]" />

      {/* Lock Dialog */}
      <div className="relative w-full max-w-xs">
        {/* Outer glow border (no blur) */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink rounded-xl opacity-70 animate-pulse" />

        <div className="relative bg-background border border-neon-green/50 rounded-xl p-4 space-y-3">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green to-neon-pink rounded-full opacity-35" />
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-neon-green/30 via-neon-cyan/20 to-neon-pink/30 flex items-center justify-center border border-neon-green/50">
                <Lock className="w-5 h-5 text-neon-green" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h1 className="text-lg font-display font-bold">
              <span className="text-neon-green">DARK</span>{" "}
              <span className="text-neon-pink">OSINT</span>
            </h1>
            <p className="text-neon-pink/80 text-[10px]">
              Password Ke Liye Telegram Msg Kare Id= @xyzd4rkhu
            </p>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password enter karein..."
              className="bg-background border border-neon-cyan/50 rounded-lg h-9 text-sm text-center text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:ring-offset-0"
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />

            {/* Unlock Button */}
            <Button
              onClick={handleUnlock}
              className="w-full h-9 rounded-lg text-sm font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink text-background hover:opacity-90 transition-all shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] active:scale-95"
            >
              UNLOCK
            </Button>
          </div>

          {/* Footer hint */}
          <p className="text-center text-[10px] text-muted-foreground">
            🔐 Secured by SHUBH OSINT
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
