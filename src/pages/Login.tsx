import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Fingerprint, Zap, Database, Wifi, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [glitchText, setGlitchText] = useState("SHUBH OSINT");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const originalText = "SHUBH OSINT";
    let interval: NodeJS.Timeout;

    const startGlitch = () => {
      let iterations = 0;
      interval = setInterval(() => {
        setGlitchText(
          originalText
            .split("")
            .map((char, index) => {
              if (index < iterations) return char;
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join("")
        );
        iterations += 1 / 3;
        if (iterations >= originalText.length) {
          clearInterval(interval);
          setGlitchText(originalText);
        }
      }, 50);
    };

    startGlitch();
    const repeatInterval = setInterval(startGlitch, 5000);
    return () => {
      clearInterval(interval);
      clearInterval(repeatInterval);
    };
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
          description: "System authenticated successfully",
        });
        navigate("/");
      } else {
        toast({
          title: "Access Denied",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium cyber grid background */}
      <div className="absolute inset-0 cyber-grid-glow opacity-20" />
      
      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-neon-purple/20 rounded-full blur-[120px] animate-glow-breathe" />
        <div className="absolute bottom-[15%] right-[10%] w-96 h-96 bg-neon-cyan/15 rounded-full blur-[140px] animate-glow-breathe" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-pink/10 rounded-full blur-[160px] animate-glow-breathe" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[25%] right-[25%] w-48 h-48 bg-neon-green/20 rounded-full blur-[90px] animate-glow-breathe" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 scanline opacity-40 pointer-events-none" />

      {/* Floating status indicators */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-neon-green/70 text-xs font-semibold animate-pulse">
        <Wifi className="w-3.5 h-3.5" />
        <span>SECURE CONNECTION</span>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-2 text-neon-cyan/70 text-xs font-semibold animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Database className="w-3.5 h-3.5" />
        <span>ENCRYPTED</span>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-sm z-10">
        {/* Premium animated rainbow border */}
        <div className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink via-neon-green to-neon-purple bg-[length:400%_100%] animate-gradient-shift opacity-90" />
        <div className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink via-neon-green to-neon-purple bg-[length:400%_100%] animate-gradient-shift blur-2xl opacity-50" />
        
        <div className="relative glass-card-premium rounded-3xl p-8 border-0">
          {/* Premium corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20">
            <div className="absolute top-5 left-5 w-10 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
            <div className="absolute top-5 left-5 w-[2px] h-10 bg-gradient-to-b from-neon-cyan to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-5 right-5 w-10 h-[2px] bg-gradient-to-l from-neon-pink to-transparent" />
            <div className="absolute top-5 right-5 w-[2px] h-10 bg-gradient-to-b from-neon-pink to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 w-20 h-20">
            <div className="absolute bottom-5 left-5 w-10 h-[2px] bg-gradient-to-r from-neon-green to-transparent" />
            <div className="absolute bottom-5 left-5 w-[2px] h-10 bg-gradient-to-t from-neon-green to-transparent" />
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20">
            <div className="absolute bottom-5 right-5 w-10 h-[2px] bg-gradient-to-l from-neon-purple to-transparent" />
            <div className="absolute bottom-5 right-5 w-[2px] h-10 bg-gradient-to-t from-neon-purple to-transparent" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            {/* Premium fingerprint icon */}
            <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/40 via-neon-cyan/30 to-neon-pink/40 rounded-full blur-2xl animate-glow-breathe" />
              <div className="absolute inset-3 bg-gradient-to-br from-neon-purple/25 to-neon-cyan/25 rounded-full border-2 border-neon-cyan/40 animate-border-dance" />
              <Fingerprint className="w-14 h-14 text-neon-cyan relative z-10 animate-pulse" />
            </div>
            
            {/* Glitch title */}
            <h1 className="text-3xl font-black tracking-wider mb-3 font-display">
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                {glitchText}
              </span>
            </h1>
            
            {/* Subtitle with terminal effect */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Terminal className="w-4 h-4" />
              <span className="font-semibold tracking-wide">AUTHENTICATION REQUIRED</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password input with premium glow */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-xl opacity-0 group-focus-within:opacity-80 blur-sm transition-opacity duration-300" />
              <div className="relative flex items-center glass-card rounded-xl border border-neon-purple/40 group-focus-within:border-transparent overflow-hidden">
                <div className="pl-4 pr-2">
                  <Zap className="h-5 w-5 text-neon-purple/70 group-focus-within:text-neon-cyan transition-colors duration-300" />
                </div>
                <Input
                  type="password"
                  placeholder="• • • • • • • •"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.toUpperCase())}
                  className="border-0 bg-transparent h-14 text-lg font-semibold tracking-[0.3em] placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Premium submit button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="relative w-full h-14 bg-transparent border-0 overflow-hidden group btn-neon rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-95 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[2px] bg-background/85 group-hover:bg-background/75 transition-colors rounded-[10px]" />
              <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-bold tracking-wider">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                      AUTHENTICATE
                    </span>
                    <Zap className="w-5 h-5 text-neon-cyan" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Premium status info */}
          <div className="mt-8 pt-6 border-t border-muted/30 space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-semibold">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-neon-green animate-ping opacity-60" />
              </div>
              <span>Multi-device access enabled</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-semibold">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
              </div>
              <span>Credits deducted per search</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-semibold">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-purple" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-neon-purple animate-ping opacity-60" style={{ animationDelay: '1s' }} />
              </div>
              <span>256-bit encryption active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground/40 text-[10px] font-semibold tracking-[0.2em]">
        SHUBH OSINT v2.0 • SECURE ACCESS PORTAL
      </div>
    </div>
  );
};

export default Login;