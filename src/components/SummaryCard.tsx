import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

export default function SummaryCard({ icon, value, label, className = "" }: SummaryCardProps) {
  return (
    <Card className={`bg-[#18181b] border border-[#23232b] shadow-lg flex flex-row items-center gap-4 px-6 py-4 transition-all hover:scale-[1.01] hover:shadow-xl ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#23232b]">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-tight">{value}</span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>
    </Card>
  );
} 