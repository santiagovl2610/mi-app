import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  testId?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, className, testId }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate" data-testid={`${testId}-title`}>
              {title}
            </p>
            <p className="text-3xl font-bold mt-1" data-testid={`${testId}-value`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1" data-testid={`${testId}-subtitle`}>
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-2 bg-accent rounded-md flex-shrink-0">
              <Icon className="h-4 w-4 text-accent-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
