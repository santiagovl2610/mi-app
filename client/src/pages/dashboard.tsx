import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatusIndicator } from "@/components/status-indicator";
import { StatsCard } from "@/components/stats-card";
import { MessageLog } from "@/components/message-log";
import { ConfigPanel } from "@/components/config-panel";
import { MessageSquareText, Send, Inbox, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Message, BotConfig, MessageStats } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: connectionStatus } = useQuery<{ connected: boolean; phoneNumber?: string }>({
    queryKey: ["/api/status"],
    refetchInterval: 30000
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 5000
  });

  const { data: stats, isLoading: statsLoading } = useQuery<MessageStats>({
    queryKey: ["/api/stats"]
  });

  const { data: config, isLoading: configLoading } = useQuery<BotConfig>({
    queryKey: ["/api/config"]
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (updates: Partial<BotConfig>) => {
      const response = await apiRequest("PATCH", "/api/config", updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      toast({
        title: "Configuration saved",
        description: "Your bot settings have been updated."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-md">
              <SiWhatsapp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold" data-testid="text-app-title">WhatsApp Bot</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Auto-reply dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusIndicator
              connected={connectionStatus?.connected ?? false}
              label={connectionStatus?.connected ? "Connected" : "Disconnected"}
            />
            {connectionStatus?.phoneNumber && (
              <span className="text-sm font-mono text-muted-foreground hidden md:block" data-testid="text-phone-number">
                {connectionStatus.phoneNumber.replace("whatsapp:", "")}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Received (24h)"
            value={statsLoading ? "-" : (stats?.totalReceived24h ?? 0)}
            icon={Inbox}
            testId="stats-received-24h"
          />
          <StatsCard
            title="Sent (24h)"
            value={statsLoading ? "-" : (stats?.totalSent24h ?? 0)}
            icon={Send}
            testId="stats-sent-24h"
          />
          <StatsCard
            title="Received (7d)"
            value={statsLoading ? "-" : (stats?.totalReceived7d ?? 0)}
            icon={MessageSquareText}
            testId="stats-received-7d"
          />
          <StatsCard
            title="Sent (7d)"
            value={statsLoading ? "-" : (stats?.totalSent7d ?? 0)}
            icon={Clock}
            testId="stats-sent-7d"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MessageLog
              messages={messages ?? []}
              isLoading={messagesLoading}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ConfigPanel
              config={config}
              isLoading={configLoading}
              onSave={(updates) => updateConfigMutation.mutate(updates)}
              isSaving={updateConfigMutation.isPending}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <StatusIndicator
              connected={connectionStatus?.connected ?? false}
            />
            <span>Twilio API</span>
          </div>
          <span>WhatsApp Bot Dashboard</span>
        </div>
      </footer>
    </div>
  );
}
