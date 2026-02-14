import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Shield, Sparkles } from "lucide-react";
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

  if (showLoader || isLoading) {
    return <HackerLoader />;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Optimized Background - Static gradients for performance */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        
        {/* Static accent orbs - no animations */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-cyan-400/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[150px]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,51,153,0.4) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,51,153,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-[270px]">
        {/* Card glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-cyan-400 to-pink-500 rounded-2xl opacity-40 blur-xl" />
        
        {/* Animated border */}
        <div className="absolute -inset-[2px] rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-400 via-pink-500 to-cyan-400 animate-rainbow-border"
            style={{ backgroundSize: '300% 100%' }}
          />
        </div>
        
        <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          {/* Icon with glow */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute -inset-3 bg-pink-500/20 rounded-xl blur-xl" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/20 to-cyan-400/20 border-2 border-pink-500/40 flex items-center justify-center">
                <Lock className="w-5 h-5 text-pink-400" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-cyan-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-base font-display font-black tracking-wide">
              <span className="bg-gradient-to-r from-pink-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                {settings.headerName1 || "SHUBH"} {settings.headerName2 || "OSINT"}
              </span>
            </h1>
            <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">
              Enter password to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              placeholder="••••••••"
              className="h-10 bg-background/60 border-2 border-pink-500/20 text-foreground text-center text-sm placeholder:text-muted-foreground/30 focus:border-pink-500/60 focus:bg-background/80 rounded-lg transition-all"
              disabled={isLoading}
              autoFocus
            />

            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-10 rounded-lg text-xs font-black tracking-wider bg-gradient-to-r from-pink-500 via-cyan-400 to-pink-500 text-background hover:shadow-[0_0_25px_rgba(255,51,153,0.5)] transition-all duration-300 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  UNLOCK ACCESS
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/5">
            <div className="w-1 h-1 rounded-full bg-pink-400" />
            <p className="text-[9px] text-muted-foreground/50 font-medium tracking-wide">
              Protected Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
