import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";
import HackerLoader from "@/components/HackerLoader";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { login } = useAuth();
  const { settings } = useSettings();
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
          description: "Welcome to the platform",
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
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-neon-green/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] bg-neon-cyan/10 rounded-full blur-[80px]" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-green)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-green)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Lock Card */}
      <div className="relative w-full max-w-sm">
        {/* Animated border glow */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink rounded-2xl opacity-60 animate-gradient-shift bg-[length:200%_auto]" />
        
        <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          {/* Lock icon with glow */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-neon-green/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green/40 flex items-center justify-center">
                <Lock className="w-8 h-8 text-neon-green" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green bg-clip-text text-transparent mb-1">
              {settings.headerName1 || "SHUBH"} {settings.headerName2 || "OSINT"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter password to continue
            </p>
          </div>

          {/* Password Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              placeholder="Enter password..."
              className="h-12 bg-background/80 border-neon-green/30 text-foreground text-center text-base placeholder:text-muted-foreground/50 focus:border-neon-green rounded-xl"
              disabled={isLoading}
              autoFocus
            />

            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-neon-green to-neon-cyan text-background hover:shadow-[0_0_25px_hsl(var(--neon-green)/0.5)] transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "UNLOCK ACCESS"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/5">
            <Shield className="w-3.5 h-3.5 text-neon-green/60" />
            <p className="text-[11px] text-muted-foreground/60">
              Protected Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
