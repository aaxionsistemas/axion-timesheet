import { ProjectService } from './projectService';
import { ProjectStatus } from '@/types/project';

export interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  totalHours: number;
  activeConsultants: number;
  activeClients: number;
  projectsAtRisk: number;
  projectsEndingSoon: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  client: string;
  hoursWorked: number;
  hoursTotal: number;
  status: string;
  progress: number;
}

export class DashboardService {
  // Buscar estatísticas gerais do dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const projects = await ProjectService.getProjects();
      
      const activeProjects = projects.filter(p => 
        p.status === 'em_andamento' || p.status === 'planejamento'
      );
      
      const totalRevenue = projects.reduce((sum, project) => {
        const revenue = (project.worked_hours || 0) * (project.valor_hora_canal || 0);
        return sum + revenue;
      }, 0);
      
      const totalHours = projects.reduce((sum, project) => 
        sum + (project.worked_hours || 0), 0
      );
      
      // Contar consultores únicos
      const uniqueConsultants = new Set(
        projects.map(p => p.consultor).filter(Boolean)
      );
      
      // Contar clientes únicos
      const uniqueClients = new Set(
        projects.map(p => p.cliente).filter(Boolean)
      );
      
      // Projetos em risco (horas estouradas ou prazo vencido)
      const today = new Date();
      const projectsAtRisk = projects.filter(project => {
        const isOverBudget = (project.worked_hours || 0) > (project.estimated_hours || 0) * 1.1;
        const isOverdue = project.end_date && 
          new Date(project.end_date) < today && 
          project.status !== 'concluido';
        return isOverBudget || isOverdue;
      }).length;
      
      // Projetos terminando em breve (próximos 7 dias)
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      const projectsEndingSoon = projects.filter(project => {
        if (!project.end_date || project.status === 'concluido') return false;
        const endDate = new Date(project.end_date);
        return endDate >= today && endDate <= nextWeek;
      }).length;
      
      return {
        totalRevenue,
        activeProjects: activeProjects.length,
        totalHours,
        activeConsultants: uniqueConsultants.size,
        activeClients: uniqueClients.size,
        projectsAtRisk,
        projectsEndingSoon
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  }

  // Buscar projetos ativos para a tabela
  static async getActiveProjects(): Promise<ProjectSummary[]> {
    try {
      const projects = await ProjectService.getProjects();
      
      return projects
        .filter(p => p.status === 'em_andamento' || p.status === 'planejamento' || p.status === 'aguardando_cliente')
        .map(project => ({
          id: project.id,
          name: project.descricao || project.cliente,
          client: project.cliente,
          hoursWorked: project.worked_hours || 0,
          hoursTotal: project.estimated_hours || 0,
          status: this.translateStatus(project.status),
          progress: project.estimated_hours ? 
            ((project.worked_hours || 0) / project.estimated_hours) * 100 : 0
        }));
    } catch (error) {
      console.error('Erro ao buscar projetos ativos:', error);
      throw error;
    }
  }

  // Buscar projetos em risco
  static async getProjectsAtRisk(): Promise<Array<{
    id: string;
    name: string;
    client: string;
    status: string;
    reason: string;
  }>> {
    try {
      const projects = await ProjectService.getProjects();
      const today = new Date();
      
      return projects
        .filter(project => {
          const isOverBudget = (project.worked_hours || 0) > (project.estimated_hours || 0) * 1.1;
          const isOverdue = project.end_date && 
            new Date(project.end_date) < today && 
            project.status !== 'concluido';
          return isOverBudget || isOverdue;
        })
        .map(project => {
          const isOverdue = project.end_date && 
            new Date(project.end_date) < new Date() && 
            project.status !== 'concluido';
          
          return {
            id: project.id,
            name: project.descricao || project.cliente,
            client: project.cliente,
            status: isOverdue ? 'Atrasado' : 'Horas estouradas',
            reason: isOverdue ? 'Prazo estourado' : 'Horas acima do previsto'
          };
        });
    } catch (error) {
      console.error('Erro ao buscar projetos em risco:', error);
      throw error;
    }
  }

  // Buscar projetos terminando em breve
  static async getProjectsEndingSoon(): Promise<Array<{
    id: string;
    name: string;
    client: string;
    endDate: string;
    daysLeft: number;
  }>> {
    try {
      const projects = await ProjectService.getProjects();
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      return projects
        .filter(project => {
          if (!project.end_date || project.status === 'concluido') return false;
          const endDate = new Date(project.end_date);
          return endDate >= today && endDate <= nextWeek;
        })
        .map(project => {
          const endDate = new Date(project.end_date!);
          const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: project.id,
            name: project.descricao || project.cliente,
            client: project.cliente,
            endDate: project.end_date!,
            daysLeft
          };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft);
    } catch (error) {
      console.error('Erro ao buscar projetos terminando em breve:', error);
      throw error;
    }
  }

  // Buscar estatísticas do consultor específico
  static async getConsultantStats(consultantName: string): Promise<{
    monthlyHours: number;
    monthlyRevenue: number;
    activeProjects: number;
    nextPaymentDate: string;
  }> {
    try {
      const projects = await ProjectService.getProjects();
      const consultantProjects = projects.filter(p => p.consultor === consultantName);
      
      // Por enquanto, usamos dados dos projetos (futuramente virá de time_entries)
      const monthlyHours = consultantProjects.reduce((sum, project) => {
        if (project.status === 'em_andamento') {
          return sum + (project.worked_hours || 0);
        }
        return sum;
      }, 0);
      
      const monthlyRevenue = consultantProjects.reduce((sum, project) => {
        if (project.status === 'em_andamento') {
          const revenue = (project.worked_hours || 0) * (project.valor_hora_consultor || 0);
          return sum + revenue;
        }
        return sum;
      }, 0);
      
      const activeProjects = consultantProjects.filter(p => 
        p.status === 'em_andamento' || p.status === 'planejamento'
      ).length;
      
      // Data do próximo pagamento (exemplo: dia 10 do próximo mês)
      const nextPayment = new Date();
      nextPayment.setMonth(nextPayment.getMonth() + 1);
      nextPayment.setDate(10);
      
      return {
        monthlyHours,
        monthlyRevenue,
        activeProjects,
        nextPaymentDate: nextPayment.toLocaleDateString('pt-BR')
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do consultor:', error);
      throw error;
    }
  }

  // Traduzir status para português
  private static translateStatus(status: ProjectStatus): string {
    const statusMap: Record<ProjectStatus, string> = {
      'planejamento': 'Planejamento',
      'em_andamento': 'Em andamento',
      'pausado': 'Pausado',
      'aguardando_cliente': 'Aguardando',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    
    return statusMap[status] || status;
  }
}
