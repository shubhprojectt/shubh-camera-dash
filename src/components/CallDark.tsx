import { useState } from "react";
import { Phone, Loader2, CheckCircle, XCircle, PhoneCall } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

const CallDark = () => {
  const { settings } = useSettings();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  // Rate limiting - store last call time per number
  const [lastCallTime, setLastCallTime] = useState<Record<string, number>>({});

  const handleCall = async () => {
    const cleanNumber = phoneNumber.trim().replace(/\s+/g, "");
    
    if (!cleanNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phoneRegex.test(cleanNumber)) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid phone number with country code",
        variant: "destructive",
      });
      return;
    }

    // Check if calls are enabled
    if (!settings.callDarkEnabled) {
      toast({
        title: "Calls Disabled",
        description: "Call feature is currently disabled by admin",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting - 60 seconds between calls to same number
    const now = Date.now();
    const lastCall = lastCallTime[cleanNumber];
    if (lastCall && now - lastCall < 60000) {
      const remainingSeconds = Math.ceil((60000 - (now - lastCall)) / 1000);
      toast({
        title: "Rate Limited",
        description: `Please wait ${remainingSeconds} seconds before calling this number again`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("call-dark", {
        body: { phoneNumber: cleanNumber },
      });

      if (error) throw error;

      if (data?.success) {
        setResult("success");
        setLastCallTime((prev) => ({ ...prev, [cleanNumber]: now }));
        toast({
          title: "✅ Call Initiated",
          description: "Call bhej di gayi hai. Aapko thodi der me automated call aayegi.",
        });
      } else {
        setResult("error");
        toast({
          title: "❌ Call Failed",
          description: data?.error || "Call bhejne me problem aayi. Kripya baad me try karein.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Call error:", err);
      setResult("error");
      toast({
        title: "❌ Error",
        description: "Call bhejne me problem aayi. Kripya baad me try karein.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <div className="rounded-xl border-2 border-neon-red/40 bg-gradient-to-br from-card/90 to-card/70 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-neon-red/10 border-b border-neon-red/20">
          <PhoneCall className="w-5 h-5 text-neon-red animate-pulse" />
          <span className="text-sm font-bold text-neon-red uppercase tracking-wider">
            CALL DARK - Automated Call System
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-mono">
              Phone Number (with country code)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-red/60" />
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="pl-10 bg-background/80 border-neon-red/30 text-foreground placeholder:text-muted-foreground/50 focus:border-neon-red h-12 text-sm font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleCall()}
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleCall}
                disabled={loading || !settings.callDarkEnabled}
                className={cn(
                  "h-12 px-6 font-bold rounded-lg",
                  "bg-gradient-to-r from-neon-red to-neon-orange text-white",
                  "hover:from-neon-red/90 hover:to-neon-orange/90",
                  "disabled:opacity-50"
                )}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5 mr-2" />
                    Call Aayega
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result Message */}
          {result === "success" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-neon-green/10 border border-neon-green/30">
              <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-neon-green">✅ Call bhej di gayi hai</p>
                <p className="text-xs text-neon-green/70">Aapko thodi der me automated call aayegi.</p>
              </div>
            </div>
          )}

          {result === "error" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-neon-red/10 border border-neon-red/30">
              <XCircle className="w-6 h-6 text-neon-red flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-neon-red">❌ Call bhejne me problem aayi</p>
                <p className="text-xs text-neon-red/70">Kripya baad me try karein.</p>
              </div>
            </div>
          )}

          {/* Disabled Message */}
          {!settings.callDarkEnabled && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-neon-yellow/10 border border-neon-yellow/30">
              <XCircle className="w-6 h-6 text-neon-yellow flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-neon-yellow">⚠️ Calls Currently Disabled</p>
                <p className="text-xs text-neon-yellow/70">Admin ne call feature disable kiya hai.</p>
              </div>
            </div>
          )}

          {/* Consent Text */}
          <p className="text-[10px] text-muted-foreground/60 text-center font-mono">
            Submit karne par aap automated call send karne ke liye agree karte hain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallDark;
