import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(password);

      if (result.success) {
        toast({
          title: "Access Granted",
          description: "Welcome to SHUBH OSINT",
        });
        navigate("/");
      } else {
        toast({
          title: "Access Denied",
          description: result.error || "Wrong password! Try again.",
          variant: "destructive"
        });
        setPassword("");
      }
    } catch (err) {
      toast({
        title: "System Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03]" />

      {/* Lock Dialog */}
      <div className="relative w-full max-w-xs">
        {/* Outer glow border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink rounded-xl opacity-70 blur-[2px] animate-pulse" />

        <div className="relative bg-background border border-neon-green/50 rounded-xl p-4 space-y-3">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green to-neon-pink rounded-full blur-lg opacity-40" />
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
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              placeholder="Password enter karein..."
              className="bg-background border border-neon-cyan/50 rounded-lg h-9 text-sm text-center text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:ring-offset-0"
              disabled={isLoading}
              autoFocus
            />

            {/* Unlock Button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-9 rounded-lg text-sm font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink text-background hover:opacity-90 transition-all shadow-[0_0_15px_hsl(var(--neon-green)/0.4)] active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "UNLOCK"
              )}
            </Button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-[10px] text-muted-foreground">
            🔐 Secured by SHUBH OSINT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
