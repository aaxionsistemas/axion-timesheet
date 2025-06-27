import { AlertTriangle, DollarSign, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const latePayments = [
  { name: "Bruno Lima", value: 2200, date: "05/07/2024", daysLate: 3 },
  { name: "Eduardo Ramos", value: 2100, date: "03/07/2024", daysLate: 5 },
];

export default function LatePaymentsCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-yellow-400" size={20} />
          <span className="font-medium text-white text-base">Pagamentos Atrasados</span>
        </div>
        <div className="space-y-3">
          {latePayments.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <User className="text-axionBlue" size={16} />
                <span className="text-white font-medium text-sm">{p.name}</span>
              </div>
              <span className="text-axionPurple font-bold text-base">R$ {p.value.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">{p.date}</span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-yellow-600/10 text-yellow-400">{p.daysLate} dias de atraso</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 