import { AlertTriangle, Folder, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  { name: "API Integração", client: "FinanCorp", status: "Atrasado", reason: "Prazo estourado" },
  { name: "Implantação ERP", client: "Tech Solutions", status: "Horas estouradas", reason: "Horas acima do previsto" },
];

export default function ProjectsAtRiskCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-yellow-400" size={20} />
          <span className="font-medium text-white text-base">Projetos em Risco</span>
        </div>
        <div className="space-y-3">
          {projects.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Folder className="text-axionPurple" size={16} />
                <span className="text-white font-medium text-sm">{p.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2"><User size={12} className="text-axionBlue" />{p.client}</span>
              </div>
              <span className={`text-xs rounded-full px-2 py-0.5 ${p.status === "Atrasado" ? "bg-yellow-600/10 text-yellow-400" : "bg-red-700/10 text-red-400"}`}>{p.status}</span>
              <span className="text-xs text-muted-foreground ml-2">{p.reason}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 