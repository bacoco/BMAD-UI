import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DeviceSelectorProps {
  selectedDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  className?: string;
}

const devices = [
  { type: 'desktop' as DeviceType, icon: Monitor, label: 'Desktop' },
  { type: 'tablet' as DeviceType, icon: Tablet, label: 'Tablet' },
  { type: 'mobile' as DeviceType, icon: Smartphone, label: 'Mobile' }
];

export function DeviceSelector({ selectedDevice, onDeviceChange, className }: DeviceSelectorProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-muted rounded-lg", className)}>
      {devices.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant={selectedDevice === type ? "default" : "ghost"}
          size="sm"
          onClick={() => onDeviceChange(type)}
          className={cn(
            "h-8 px-3 transition-all duration-200",
            selectedDevice === type 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "hover:bg-background"
          )}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}