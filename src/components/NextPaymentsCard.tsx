import { CalendarCheck, DollarSign, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const payments = [
  { name: "Ana Souza", value: 3200, date: "15/07/2024", status: "Aguardando" },
  { name: "Bruno Lima", value: 2800, date: "18/07/2024", status: "Aprovado" },
  { name: "Carlos Silva", value: 2500, date: "20/07/2024", status: "Aguardando" },
];

export default function NextPaymentsCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-axionBlue" size={20} />
          <span className="font-medium text-white text-base">Próximos Pagamentos</span>
        </div>
        <div className="space-y-3">
          {payments.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <User className="text-axionBlue" size={16} />
                <span className="text-white font-medium text-sm">{p.name}</span>
              </div>
              <span className="text-axionPurple font-bold text-base">R$ {p.value.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarCheck className="text-axionBlue" size={14} /> {p.date}
              </span>
              <span className={`text-xs rounded-full px-2 py-0.5 ${p.status === "Aprovado" ? "bg-green-700/10 text-green-400" : "bg-yellow-600/10 text-yellow-400"}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 