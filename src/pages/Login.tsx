import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import HackerLoader from "@/components/HackerLoader";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Show loader animation for 2.5 seconds before showing login form
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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

  // Show hacker loader first OR during login
  if (showLoader || isLoading) {
    return <HackerLoader />;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-3 animate-fade-in">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03]" />

      {/* Lock Dialog */}
      <div className="relative w-full max-w-[280px]">
        {/* Outer glow border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink rounded-2xl opacity-60 blur-[2px]" />

        <div className="relative bg-background border border-neon-green/50 rounded-2xl p-3 space-y-2">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green to-neon-pink rounded-full blur-lg opacity-40" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-neon-green/30 via-neon-cyan/20 to-neon-pink/30 flex items-center justify-center border border-neon-green/50">
                <Lock className="w-4 h-4 text-neon-green" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h1 className="text-base font-display font-bold leading-none">
              <span className="text-neon-green">DARK</span>{" "}
              <span className="text-neon-pink">OSINT</span>
            </h1>
            <p className="text-neon-pink/80 text-[9px] leading-snug">
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
              className="bg-background border border-neon-cyan/50 rounded-lg h-8 text-[13px] text-center text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:ring-offset-0"
              disabled={isLoading}
              autoFocus
            />

            {/* Unlock Button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`w-full h-8 rounded-lg text-[13px] font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink text-background transition-all active:scale-95 ${isLoading ? 'animate-pulse shadow-[0_0_20px_hsl(var(--neon-green)/0.55),0_0_40px_hsl(var(--neon-cyan)/0.35)]' : 'hover:opacity-90 shadow-[0_0_12px_hsl(var(--neon-green)/0.35)]'}`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_10px_hsl(var(--neon-cyan))]" />
              ) : (
                "UNLOCK"
              )}
            </Button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-[9px] text-muted-foreground">
            🔐 Secured by SHUBH OSINT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
