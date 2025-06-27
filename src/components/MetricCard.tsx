import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
}

export default function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl p-6 bg-axion-card text-white shadow-lg flex items-center gap-4 transition-all hover:scale-[1.03] cursor-pointer">
      {Icon && (
        <span className="p-3 rounded-full bg-[#23232b]/60">
          <Icon size={28} className="text-axionBlue" />
        </span>
      )}
      <div>
        <span className="block text-sm opacity-80">{title}</span>
        <span className="text-3xl font-bold mt-2 block">{value}</span>
      </div>
    </div>
  );
} 