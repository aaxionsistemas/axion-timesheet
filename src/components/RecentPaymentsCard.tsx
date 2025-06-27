import { DollarSign, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const payments = [
  { value: 2400, date: "10/06/2024", status: "Pago" },
  { value: 2200, date: "10/05/2024", status: "Pago" },
  { value: 2100, date: "10/04/2024", status: "Pago" },
];

export default function RecentPaymentsCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-axionBlue" size={20} />
          <span className="font-medium text-white text-base">Recebimentos Recentes</span>
        </div>
        <div className="space-y-3">
          {payments.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
              <span className="text-axionPurple font-bold text-base">R$ {p.value.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarCheck className="text-axionBlue" size={14} /> {p.date}
              </span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-green-700/10 text-green-400">{p.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 