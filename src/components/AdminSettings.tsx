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
          className="h-8 w-8 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-all"
        >
          <Settings className="h-4 w-4 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-lg">
            Tab Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Tab Size Control */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Tab Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tabSizes.map((size) => {
                const IconComponent = size.icon;
                const isActive = settings.tabSize === size.value;
                return (
                  <button
                    key={size.value}
                    onClick={() => updateSettings({ tabSize: size.value })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                      isActive
                        ? "border-primary bg-primary/15 text-primary shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground bg-background/50"
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
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Preview
            </label>
            <div className="p-4 rounded-xl border border-border bg-background/50">
              <div className={cn(
                "flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 text-primary mx-auto",
                settings.tabSize === "small" && "w-24 h-14 text-[9px]",
                settings.tabSize === "medium" && "w-28 h-16 text-[10px]",
                settings.tabSize === "large" && "w-32 h-20 text-xs"
              )}>
                <Settings className={cn(
                  settings.tabSize === "small" && "w-4 h-4",
                  settings.tabSize === "medium" && "w-5 h-5",
                  settings.tabSize === "large" && "w-6 h-6"
                )} />
                <span className="font-semibold uppercase">Sample</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;