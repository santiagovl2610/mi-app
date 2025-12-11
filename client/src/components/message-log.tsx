import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageRow } from "./message-row";
import { MessageSquare, Inbox } from "lucide-react";
import type { Message } from "@shared/schema";

interface MessageLogProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageLog({ messages, isLoading }: MessageLogProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-accent rounded-full mb-4">
              <Inbox className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2" data-testid="text-empty-state">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Messages will appear here when someone sends a message to your WhatsApp bot.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Message Log
        </CardTitle>
        <span className="text-sm text-muted-foreground">{messages.length} messages</span>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
