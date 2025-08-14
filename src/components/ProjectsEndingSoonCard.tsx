import { Clock, Folder, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DashboardService } from "@/lib/dashboardService";

interface ProjectEndingSoon {
  id: string;
  name: string;
  client: string;
  endDate: string;
  daysLeft: number;
}

export default function ProjectsEndingSoonCard() {
  const [projects, setProjects] = useState<ProjectEndingSoon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectsEndingSoon();
  }, []);

  const loadProjectsEndingSoon = async () => {
    try {
      setLoading(true);
      const projectsData = await DashboardService.getProjectsEndingSoon();
      setProjects(projectsData);
    } catch (error) {
      console.error('Erro ao carregar projetos terminando em breve:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-axionPurple" size={20} />
            <span className="font-medium text-white text-base">Projetos Próximos do Fim</span>
          </div>
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-axionPurple" size={20} />
          <span className="font-medium text-white text-base">Projetos Próximos do Fim</span>
        </div>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-4 text-gray-500">Nenhum projeto terminando em breve</div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Folder className="text-axionBlue" size={16} />
                  <div>
                    <span className="text-white font-medium text-sm">{p.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User size={12} className="text-axionBlue" />
                      {p.client}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    Faltam <span className="text-axionPurple font-bold">{p.daysLeft} dias</span>
                  </span>
                  <div className="text-xs text-gray-400">{formatDate(p.endDate)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 