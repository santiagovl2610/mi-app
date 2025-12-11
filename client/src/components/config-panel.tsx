import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { BotConfig } from "@shared/schema";

interface ConfigPanelProps {
  config: BotConfig | undefined;
  isLoading: boolean;
  onSave: (config: Partial<BotConfig>) => void;
  isSaving: boolean;
}

export function ConfigPanel({ config, isLoading, onSave, isSaving }: ConfigPanelProps) {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplyMessage, setAutoReplyMessage] = useState("");
  const [responseDelay, setResponseDelay] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (config) {
      setAutoReplyEnabled(config.autoReplyEnabled);
      setAutoReplyMessage(config.autoReplyMessage);
      setResponseDelay(parseInt(config.responseDelaySeconds) || 0);
      setHasChanges(false);
    }
  }, [config]);

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({
      autoReplyEnabled,
      autoReplyMessage,
      responseDelaySeconds: responseDelay.toString()
    });
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Bot Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Bot Configuration
        </CardTitle>
        <CardDescription>
          Configure how your bot responds to incoming messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-reply-toggle" className="text-sm font-medium">
              Auto-Reply
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically respond to incoming messages
            </p>
          </div>
          <Switch
            id="auto-reply-toggle"
            checked={autoReplyEnabled}
            onCheckedChange={(checked) => {
              setAutoReplyEnabled(checked);
              handleChange();
            }}
            data-testid="switch-auto-reply"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reply-message" className="text-sm font-medium">
            Reply Message
          </Label>
          <Textarea
            id="reply-message"
            placeholder="Enter your auto-reply message..."
            value={autoReplyMessage}
            onChange={(e) => {
              setAutoReplyMessage(e.target.value);
              handleChange();
            }}
            className="min-h-24 font-mono text-sm resize-none"
            data-testid="textarea-reply-message"
          />
          <p className="text-xs text-muted-foreground">
            {autoReplyMessage.length} characters
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Response Delay
            </Label>
            <span className="text-sm text-muted-foreground font-mono">
              {responseDelay}s
            </span>
          </div>
          <Slider
            value={[responseDelay]}
            onValueChange={([value]) => {
              setResponseDelay(value);
              handleChange();
            }}
            max={30}
            step={1}
            className="w-full"
            data-testid="slider-response-delay"
          />
          <p className="text-xs text-muted-foreground">
            Add a delay before sending the auto-reply (0-30 seconds)
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full"
          data-testid="button-save-config"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
