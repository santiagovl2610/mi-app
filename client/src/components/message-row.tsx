import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Message } from "@shared/schema";

interface MessageRowProps {
  message: Message;
}

export function MessageRow({ message }: MessageRowProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getStatusBadge = () => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      received: { variant: "secondary", label: "Received" },
      sent: { variant: "default", label: "Sent" },
      pending: { variant: "outline", label: "Pending" },
      failed: { variant: "destructive", label: "Failed" }
    };
    const config = variants[message.status] || variants.received;
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  const getDirectionBadge = () => {
    return message.direction === "inbound" ? (
      <Badge variant="outline" className="text-xs">Inbound</Badge>
    ) : (
      <Badge variant="outline" className="text-xs">Outbound</Badge>
    );
  };

  const truncatePhone = (phone: string) => {
    return phone.replace("whatsapp:", "").slice(-10);
  };

  return (
    <div
      className={cn(
        "border-b border-border hover-elevate active-elevate-2 cursor-pointer transition-colors",
        expanded && "bg-accent/30"
      )}
      onClick={() => setExpanded(!expanded)}
      data-testid={`message-row-${message.id}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-shrink-0 text-sm text-muted-foreground w-20">
          <div>{formatTime(message.timestamp)}</div>
          <div className="text-xs">{formatDate(message.timestamp)}</div>
        </div>
        
        <div className="flex-shrink-0 w-28">
          <p className="text-sm font-mono truncate" title={message.from}>
            {truncatePhone(message.from)}
          </p>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono truncate" data-testid={`message-preview-${message.id}`}>
            {message.body}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {getDirectionBadge()}
          {getStatusBadge()}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pl-12 space-y-2">
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="text-sm font-mono whitespace-pre-wrap break-words" data-testid={`message-full-${message.id}`}>
              {message.body}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>From: <span className="font-mono">{message.from}</span></span>
            <span>To: <span className="font-mono">{message.to}</span></span>
            {message.twilioMessageSid && (
              <span>SID: <span className="font-mono">{message.twilioMessageSid}</span></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
