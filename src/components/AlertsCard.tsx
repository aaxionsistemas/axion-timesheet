import { Info, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const alerts = [
  {
    type: "info",
    message: "Você tem 2 projetos com horas não lançadas esta semana.",
  },
  {
    type: "warning",
    message: "Projeto 'API Integração' está próximo do limite de horas.",
  },
];

export default function AlertsCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-axionPurple" size={24} />
          <span className="font-bold text-white text-lg">Alertas & Dicas</span>
        </div>
        <ul className="space-y-3">
          {alerts.map((alert, idx) => (
            <li key={idx} className={`flex items-center gap-2 text-sm ${alert.type === "warning" ? "text-yellow-400" : "text-axionBlue"}`}>
              {alert.type === "warning" ? (
                <AlertCircle className="text-yellow-400" size={18} />
              ) : (
                <Info className="text-axionBlue" size={18} />
              )}
              {alert.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 