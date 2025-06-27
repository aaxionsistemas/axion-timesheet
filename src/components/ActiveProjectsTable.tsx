import { Folder, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    name: "Implantação ERP",
    client: "Tech Solutions",
    hoursWorked: 32,
    hoursTotal: 40,
    status: "Em andamento",
  },
  {
    name: "API Integração",
    client: "FinanCorp",
    hoursWorked: 18,
    hoursTotal: 20,
    status: "Aguardando",
  },
  {
    name: "Dashboard Analytics",
    client: "DataX",
    hoursWorked: 40,
    hoursTotal: 40,
    status: "Concluído",
  },
];

export default function ActiveProjectsTable() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="text-axionBlue" size={20} />
          <span className="font-medium text-white text-base">Projetos Ativos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-[#23232b]">
                <th className="py-2 px-2 text-left font-normal">Projeto</th>
                <th className="py-2 px-2 text-left font-normal">Cliente</th>
                <th className="py-2 px-2 text-left font-normal">Status</th>
                <th className="py-2 px-2 text-left font-normal">Horas</th>
                <th className="py-2 px-2 text-left font-normal">Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr key={idx} className="border-b border-[#23232b] hover:bg-[#23232b]/60 transition-all">
                  <td className="py-2 px-2 font-medium text-white">{proj.name}</td>
                  <td className="py-2 px-2 flex items-center gap-1"><User size={14} className="text-axionBlue" /> {proj.client}</td>
                  <td className="py-2 px-2">
                    <span className={`text-xs rounded-full px-2 py-0.5 ${
                      proj.status === "Em andamento"
                        ? "bg-axionBlue/10 text-axionBlue"
                        : proj.status === "Aguardando"
                        ? "bg-yellow-600/10 text-yellow-400"
                        : "bg-green-700/10 text-green-400"
                    }`}>{proj.status}</span>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <Clock className="text-axionPurple" size={12} />
                      <span>{proj.hoursWorked}h / {proj.hoursTotal}h</span>
                      <div className="flex-1 h-1.5 bg-[#18181b] rounded ml-2 min-w-[60px]">
                        <div
                          className="h-1.5 rounded bg-axionBlue transition-all"
                          style={{ width: `${(proj.hoursWorked / proj.hoursTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <Button variant="outline" className="border-axionBlue text-axionBlue hover:bg-axionBlue/10 text-xs px-3 py-1" size="sm">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 