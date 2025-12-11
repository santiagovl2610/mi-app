import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  connected: boolean;
  label?: string;
  className?: string;
}

export function StatusIndicator({ connected, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "bg-status-online" : "bg-status-busy"
        )}
        data-testid={`status-indicator-${connected ? "connected" : "disconnected"}`}
      />
      {label && (
        <span className="text-sm text-muted-foreground" data-testid="text-status-label">
          {label || (connected ? "Connected" : "Disconnected")}
        </span>
      )}
    </div>
  );
}
