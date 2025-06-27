import { Folder, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  name: string;
  client: string;
  hoursWorked: number;
  hoursTotal: number;
  status: "Em andamento" | "Aguardando" | "Concluído";
}

const projects: Project[] = [
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

export default function ActiveProjectsCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="text-axionBlue" size={20} />
          <span className="font-medium text-white text-base">Projetos Ativos</span>
        </div>
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#23232b] rounded-lg p-4 transition-all hover:bg-[#23232b]/80">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{proj.name}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ml-2 ${
                    proj.status === "Em andamento"
                      ? "bg-axionBlue/10 text-axionBlue"
                      : proj.status === "Aguardando"
                      ? "bg-yellow-600/10 text-yellow-400"
                      : "bg-green-700/10 text-green-400"
                  }`}>{proj.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <User className="inline-block" size={12} /> {proj.client}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="text-axionPurple" size={12} />
                  <span className="text-xs text-muted-foreground">
                    {proj.hoursWorked}h / {proj.hoursTotal}h
                  </span>
                  <div className="flex-1 h-1.5 bg-[#18181b] rounded ml-2">
                    <div
                      className="h-1.5 rounded bg-axionBlue transition-all"
                      style={{ width: `${(proj.hoursWorked / proj.hoursTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-axionBlue text-axionBlue hover:bg-axionBlue/10 mt-4 md:mt-0 md:ml-4 text-xs px-3 py-1" size="sm">
                Detalhes
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 