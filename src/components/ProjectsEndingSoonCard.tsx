import { Clock, Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  { name: "Implantação ERP", hoursLeft: 5, status: "Em andamento" },
  { name: "API Integração", hoursLeft: 2, status: "Em andamento" },
];

export default function ProjectsEndingSoonCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-axionPurple" size={20} />
          <span className="font-medium text-white text-base">Projetos Próximos do Fim</span>
        </div>
        <div className="space-y-3">
          {projects.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Folder className="text-axionBlue" size={16} />
                <span className="text-white font-medium text-sm">{p.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">Faltam <span className="text-axionPurple font-bold">{p.hoursLeft}h</span></span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-axionBlue/10 text-axionBlue">{p.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 