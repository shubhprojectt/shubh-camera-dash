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
      {/* Animated cyber grid background - smaller grid */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(hsl(var(--neon-cyan) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-neon-cyan/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-pink/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[30%] w-40 h-40 bg-neon-green/25 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 scanline opacity-50" />

      {/* Floating status indicators */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-neon-green/60 text-xs font-mono animate-pulse">
        <Wifi className="w-3 h-3" />
        <span>SECURE CONNECTION</span>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-2 text-neon-cyan/60 text-xs font-mono animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Database className="w-3 h-3" />
        <span>ENCRYPTED</span>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-sm z-10">
        {/* Animated rainbow border */}
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink via-neon-green to-neon-purple bg-[length:400%_100%] animate-gradient-shift opacity-80" />
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan via-neon-pink via-neon-green to-neon-purple bg-[length:400%_100%] animate-gradient-shift blur-xl opacity-40" />
        
        <div className="relative bg-background/95 backdrop-blur-2xl rounded-3xl p-8 border border-neon-purple/20">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="absolute top-4 left-4 w-8 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
            <div className="absolute top-4 left-4 w-[2px] h-8 bg-gradient-to-b from-neon-cyan to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="absolute top-4 right-4 w-8 h-[2px] bg-gradient-to-l from-neon-pink to-transparent" />
            <div className="absolute top-4 right-4 w-[2px] h-8 bg-gradient-to-b from-neon-pink to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16">
            <div className="absolute bottom-4 left-4 w-8 h-[2px] bg-gradient-to-r from-neon-green to-transparent" />
            <div className="absolute bottom-4 left-4 w-[2px] h-8 bg-gradient-to-t from-neon-green to-transparent" />
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <div className="absolute bottom-4 right-4 w-8 h-[2px] bg-gradient-to-l from-neon-purple to-transparent" />
            <div className="absolute bottom-4 right-4 w-[2px] h-8 bg-gradient-to-t from-neon-purple to-transparent" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            {/* Fingerprint icon with glow */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-neon-cyan/20 to-neon-pink/30 rounded-full blur-xl animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-full border border-neon-cyan/30" />
              <Fingerprint className="w-12 h-12 text-neon-cyan relative z-10 animate-pulse" />
            </div>
            
            {/* Glitch title */}
            <h1 className="text-2xl font-bold tracking-wider mb-2 font-display">
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                {glitchText}
              </span>
            </h1>
            
            {/* Subtitle with terminal effect */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Terminal className="w-3 h-3" />
              <span className="font-mono">AUTHENTICATION REQUIRED</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password input with glow */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-xl opacity-0 group-focus-within:opacity-70 blur transition-opacity duration-300" />
              <div className="relative flex items-center bg-background/80 rounded-xl border border-neon-purple/30 group-focus-within:border-transparent overflow-hidden">
                <div className="pl-4 pr-2">
                  <Zap className="h-5 w-5 text-neon-purple/60 group-focus-within:text-neon-cyan transition-colors" />
                </div>
                <Input
                  type="password"
                  placeholder="• • • • • • • •"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.toUpperCase())}
                  className="border-0 bg-transparent h-14 text-lg font-mono tracking-[0.3em] placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="relative w-full h-14 bg-transparent border-0 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[2px] bg-background/90 group-hover:bg-background/80 transition-colors rounded-[10px]" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-bold tracking-wider">
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

          {/* Status info */}
          <div className="mt-8 pt-6 border-t border-muted/20 space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-mono">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-neon-green" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-green animate-ping opacity-75" />
              </div>
              <span>Multi-device access enabled</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-mono">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-cyan animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
              </div>
              <span>Credits deducted per search</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-mono">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-neon-purple" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-purple animate-ping opacity-75" style={{ animationDelay: '1s' }} />
              </div>
              <span>256-bit encryption active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground/30 text-[10px] font-mono tracking-widest">
        SHUBH OSINT v2.0 • SECURE ACCESS PORTAL
      </div>
    </div>
  );
};

export default Login;