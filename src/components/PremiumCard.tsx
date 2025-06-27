import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PremiumCardProps {
  icon: ReactNode;
  badge?: string;
  title: string;
  description: string;
  info?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function PremiumCard({
  icon,
  badge,
  title,
  description,
  info,
  actionLabel,
  onAction,
  className = "",
}: PremiumCardProps) {
  return (
    <Card className={`bg-[#18181b] border border-[#23232b] shadow-lg flex flex-col h-full ${className}`}>
      <CardContent className="p-6 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-[#23232b] p-2 flex items-center justify-center">{icon}</span>
          {badge && (
            <span className="bg-[#23232b] text-xs px-2 py-1 rounded-full ml-auto text-muted-foreground">{badge}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm flex-1">{description}</p>
        <div className="flex items-center justify-between mt-4">
          {info && <span className="text-axionBlue font-bold text-sm">{info}</span>}
          {actionLabel && (
            <Button variant="outline" className="border-axionBlue text-axionBlue hover:bg-axionBlue/10" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 