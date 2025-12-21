import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Key, Shield } from "lucide-react";
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
          title: "Login Successful",
          description: "Welcome! Your credits are now active.",
        });
        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid password",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green rounded-2xl blur opacity-30 animate-pulse" />
        
        <div className="relative bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-neon-cyan/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-cyan rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-pink rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-pink rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-cyan rounded-br-2xl" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 border border-neon-cyan/30 mb-4">
              <Shield className="w-10 h-10 text-neon-cyan" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-neon-cyan">SHUBH</span>
              <span className="text-neon-pink">OSINT</span>
            </h1>
            <p className="text-gray-400 text-sm">Enter your access password to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-neon-cyan/60" />
              </div>
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                className="pl-12 h-14 bg-black/50 border-neon-cyan/30 text-white text-lg font-mono tracking-widest placeholder:text-gray-500 focus:border-neon-cyan focus:ring-neon-cyan/20"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-14 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 border border-neon-cyan text-neon-cyan hover:from-neon-cyan/30 hover:to-neon-pink/30 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300 text-lg font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  AUTHENTICATE
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span>One password = One device</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
              <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
              <span>Credits are deducted per search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;