import { ProjectService } from './projectService';

export interface WeeklyHoursData {
  semana: string;
  horas: number;
}

export interface MonthlyRevenueData {
  mes: string;
  receita: number;
}

export interface ConsultantHoursData {
  nome: string;
  horas: number;
}

export class ChartService {
  // Dados de horas trabalhadas por semana (consultor específico)
  static async getWeeklyHours(consultantName?: string): Promise<WeeklyHoursData[]> {
    try {
      const projects = await ProjectService.getProjects();
      
      // Filtrar por consultor se especificado
      const filteredProjects = consultantName 
        ? projects.filter(p => p.consultor === consultantName)
        : projects;

      // Por enquanto, vamos simular dados semanais baseados nos projetos
      // Futuramente isso virá da tabela project_time_entries
      const currentDate = new Date();
      const weeklyData: WeeklyHoursData[] = [];
      
      // Gerar dados das últimas 4 semanas
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - (i * 7 + 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1}-${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
        
        // Simular horas baseado nos projetos ativos
        const activeProjects = filteredProjects.filter(p => 
          p.status === 'em_andamento' && 
          p.start_date && new Date(p.start_date) <= weekEnd
        );
        
        const weekHours = activeProjects.reduce((sum, project) => {
          // Distribuir horas trabalhadas ao longo das semanas
          const totalWeeks = Math.max(1, Math.ceil((project.worked_hours || 0) / 10));
          return sum + Math.floor((project.worked_hours || 0) / totalWeeks);
        }, 0);
        
        weeklyData.push({
          semana: weekLabel,
          horas: Math.max(0, weekHours)
        });
      }
      
      return weeklyData;
    } catch (error) {
      console.error('Erro ao buscar dados semanais:', error);
      // Retornar dados vazios em caso de erro
      return [
        { semana: "Sem 1", horas: 0 },
        { semana: "Sem 2", horas: 0 },
        { semana: "Sem 3", horas: 0 },
        { semana: "Sem 4", horas: 0 }
      ];
    }
  }

  // Dados de receita mensal
  static async getMonthlyRevenue(consultantName?: string): Promise<MonthlyRevenueData[]> {
    try {
      const projects = await ProjectService.getProjects();
      
      // Filtrar por consultor se especificado
      const filteredProjects = consultantName 
        ? projects.filter(p => p.consultor === consultantName)
        : projects;

      // Gerar dados dos últimos 6 meses
      const monthlyData: MonthlyRevenueData[] = [];
      const currentDate = new Date();
      
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        
        const monthLabel = monthNames[month.getMonth()];
        
        // Calcular receita do mês baseado nos projetos
        const monthRevenue = filteredProjects.reduce((sum, project) => {
          if (!project.start_date) return sum;
          
          const projectStart = new Date(project.start_date);
          const projectMonth = projectStart.getMonth();
          const projectYear = projectStart.getFullYear();
          
          // Se o projeto foi criado/iniciado neste mês
          if (projectMonth === month.getMonth() && projectYear === month.getFullYear()) {
            const hourlyRate = consultantName 
              ? (project.valor_hora_consultor || 0)
              : (project.valor_hora_canal || 0);
            return sum + ((project.worked_hours || 0) * hourlyRate);
          }
          
          return sum;
        }, 0);
        
        monthlyData.push({
          mes: monthLabel,
          receita: Math.max(0, Math.round(monthRevenue))
        });
      }
      
      return monthlyData;
    } catch (error) {
      console.error('Erro ao buscar dados mensais:', error);
      // Retornar dados vazios em caso de erro
      return [
        { mes: "Jan", receita: 0 },
        { mes: "Fev", receita: 0 },
        { mes: "Mar", receita: 0 },
        { mes: "Abr", receita: 0 },
        { mes: "Mai", receita: 0 },
        { mes: "Jun", receita: 0 }
      ];
    }
  }

  // Dados de horas por consultor
  static async getConsultantHours(): Promise<ConsultantHoursData[]> {
    try {
      const projects = await ProjectService.getProjects();
      
      // Agrupar horas por consultor
      const consultantHours: Record<string, number> = {};
      
      projects.forEach(project => {
        if (project.consultor && project.worked_hours) {
          if (!consultantHours[project.consultor]) {
            consultantHours[project.consultor] = 0;
          }
          consultantHours[project.consultor] += project.worked_hours;
        }
      });
      
      // Converter para array e ordenar
      const consultantData = Object.entries(consultantHours)
        .map(([nome, horas]) => ({
          nome: nome.split(' ')[0], // Usar apenas primeiro nome
          horas: Math.round(horas)
        }))
        .sort((a, b) => b.horas - a.horas)
        .slice(0, 5); // Top 5 consultores
      
      // Se não há dados, retornar array vazio
      if (consultantData.length === 0) {
        return [];
      }
      
      return consultantData;
    } catch (error) {
      console.error('Erro ao buscar dados de consultores:', error);
      // Retornar array vazio em caso de erro
      return [];
    }
  }

  // Dados de receita global mensal (para admin)
  static async getGlobalMonthlyRevenue(): Promise<MonthlyRevenueData[]> {
    return this.getMonthlyRevenue(); // Sem filtro de consultor
  }
}
