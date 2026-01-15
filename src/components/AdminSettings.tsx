import { useState } from "react";
import { Settings, X, Minimize2, Maximize2, Square } from "lucide-react";
import { Button } from "./ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

const AdminSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const tabSizes = [
    { value: "small", label: "Small", icon: Minimize2 },
    { value: "medium", label: "Medium", icon: Square },
    { value: "large", label: "Large", icon: Maximize2 },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
        >
          <Settings className="h-4 w-4 text-neon-cyan" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-neon-green/30">
        <DialogHeader>
          <DialogTitle className="text-neon-green font-display">
            Tab Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Tab Size Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Tab Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tabSizes.map((size) => {
                const IconComponent = size.icon;
                const isActive = settings.tabSize === size.value;
                return (
                  <button
                    key={size.value}
                    onClick={() => updateSettings({ tabSize: size.value })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-all",
                      isActive
                        ? "border-neon-green bg-neon-green/20 text-neon-green shadow-[0_0_10px_hsl(var(--neon-green)/0.3)]"
                        : "border-muted-foreground/30 hover:border-neon-green/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <IconComponent className={cn(
                      "transition-all",
                      size.value === "small" && "w-4 h-4",
                      size.value === "medium" && "w-5 h-5",
                      size.value === "large" && "w-6 h-6"
                    )} />
                    <span className="text-xs font-medium">{size.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Preview
            </label>
            <div className="p-3 rounded-lg border border-muted-foreground/20 bg-card/50">
              <div className={cn(
                "flex items-center justify-center gap-2 rounded-lg border border-neon-green/50 bg-neon-green/10 text-neon-green mx-auto",
                settings.tabSize === "small" && "w-20 h-11 text-[7px]",
                settings.tabSize === "medium" && "w-24 h-14 text-[8px]",
                settings.tabSize === "large" && "w-28 h-17 text-[9px]"
              )}>
                <Settings className={cn(
                  settings.tabSize === "small" && "w-3.5 h-3.5",
                  settings.tabSize === "medium" && "w-4 h-4",
                  settings.tabSize === "large" && "w-5 h-5"
                )} />
                <span className="font-bold uppercase">Sample</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;