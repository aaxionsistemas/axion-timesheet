import { supabase } from './supabaseClient';
import { Project, CreateProjectData, UpdateProjectData, ProjectStatus } from '@/types/project';

// Interface para dados vindos do banco
interface DatabaseProject {
  id: string;
  canal?: string;
  cliente: string;
  descricao?: string;
  description?: string;
  status: ProjectStatus;
  produto?: string;
  valor_hora_canal?: number;
  valor_hora_consultor?: number;
  consultor?: string;
  estimated_hours?: number;
  worked_hours?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  name?: string;
}

// Mapear dados do banco para o tipo Project da aplicação
function mapDatabaseToProject(dbProject: DatabaseProject): Project {
  return {
    id: dbProject.id,
    canal: dbProject.canal || '',
    cliente: dbProject.cliente || '',
    descricao: dbProject.descricao || dbProject.description || '',
    status: dbProject.status,
    produto: dbProject.produto || '',
    valor_hora_canal: dbProject.valor_hora_canal || 0,
    valor_hora_consultor: dbProject.valor_hora_consultor || 0,
    consultor: dbProject.consultor || '',
    estimated_hours: dbProject.estimated_hours || 0,
    worked_hours: dbProject.worked_hours || 0,
    start_date: dbProject.start_date,
    end_date: dbProject.end_date,
    created_at: dbProject.created_at,
    updated_at: dbProject.updated_at,
    notes: dbProject.notes,
    attachments: [] // Será carregado separadamente se necessário
  };
}

// Mapear dados da aplicação para o formato do banco
function mapProjectToDatabase(project: CreateProjectData | Omit<UpdateProjectData, 'id'>) {
  return {
    // Campos principais do novo schema
    cliente: project.cliente,
    descricao: project.descricao,
    status: project.status,
    produto: project.produto,
    valor_hora_canal: project.valor_hora_canal,
    valor_hora_consultor: project.valor_hora_consultor,
    consultor: project.consultor,
    estimated_hours: project.estimated_hours,
    start_date: project.start_date,
    end_date: project.end_date,
    notes: project.notes,
    canal: project.canal,
    // Campos opcionais compatíveis
    name: project.cliente,
    description: project.descricao
  };
}

export class ProjectService {
  // Listar todos os projetos
  static async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        throw new Error(`Erro ao buscar projetos: ${error.message}`);
      }

      return data?.map(mapDatabaseToProject) || [];
    } catch (error) {
      console.error('Erro no serviço de projetos:', error);
      throw error;
    }
  }

  // Buscar projeto por ID
  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Projeto não encontrado
        }
        console.error('Erro ao buscar projeto:', error);
        throw new Error(`Erro ao buscar projeto: ${error.message}`);
      }

      return data ? mapDatabaseToProject(data) : null;
    } catch (error) {
      console.error('Erro no serviço de projeto:', error);
      throw error;
    }
  }

  // Criar novo projeto
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const dbData = mapProjectToDatabase(projectData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        throw new Error(`Erro ao criar projeto: ${error.message}`);
      }

      return mapDatabaseToProject(data);
    } catch (error) {
      console.error('Erro no serviço de criação de projeto:', error);
      throw error;
    }
  }

  // Atualizar projeto
  static async updateProject(projectData: UpdateProjectData): Promise<Project> {
    try {
      const { id, ...updateData } = projectData;
      const dbData = mapProjectToDatabase(updateData);

      const { data, error } = await supabase
        .from('projects')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar projeto:', error);
        throw new Error(`Erro ao atualizar projeto: ${error.message}`);
      }

      return mapDatabaseToProject(data);
    } catch (error) {
      console.error('Erro no serviço de atualização de projeto:', error);
      throw error;
    }
  }

  // Deletar projeto
  static async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar projeto:', error);
        throw new Error(`Erro ao deletar projeto: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no serviço de deleção de projeto:', error);
      throw error;
    }
  }

  // Atualizar horas trabalhadas
  static async updateWorkedHours(id: string, hours: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ worked_hours: hours })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar horas:', error);
        throw new Error(`Erro ao atualizar horas: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no serviço de atualização de horas:', error);
      throw error;
    }
  }

  // Buscar projetos por status
  static async getProjectsByStatus(status: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar projetos por status:', error);
        throw new Error(`Erro ao buscar projetos por status: ${error.message}`);
      }

      return data?.map(mapDatabaseToProject) || [];
    } catch (error) {
      console.error('Erro no serviço de projetos por status:', error);
      throw error;
    }
  }

  // Buscar estatísticas dos projetos
  static async getProjectStats() {
    try {
      const { data, error } = await supabase
        .from('project_stats')
        .select('*');

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de estatísticas:', error);
      throw error;
    }
  }
}
