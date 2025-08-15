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
async function mapDatabaseToProject(dbProject: DatabaseProject): Promise<Project> {
  // Buscar consultores do projeto na nova tabela
  const { data: consultants, error: consultantsError } = await supabase
    .from('project_consultants')
    .select('consultant_id, consultant_name, hourly_rate')
    .eq('project_id', dbProject.id);

  if (consultantsError) {
    console.error('Erro ao buscar consultores do projeto:', consultantsError);
  }

  // Buscar nome do canal se for um ID
  let canalName = dbProject.canal || '';
  if (dbProject.canal && dbProject.canal.includes('-')) { // Se parece com UUID
    const { data: canal } = await supabase
      .from('canals')
      .select('name')
      .eq('id', dbProject.canal)
      .single();
    canalName = canal?.name || dbProject.canal;
  }

  // Buscar nome do cliente se for um ID
  let clienteName = dbProject.cliente || '';
  if (dbProject.cliente && dbProject.cliente.includes('-')) { // Se parece com UUID
    const { data: client } = await supabase
      .from('clients')
      .select('name, company')
      .eq('id', dbProject.cliente)
      .single();
    clienteName = client?.company || client?.name || dbProject.cliente;
  }

  const project = {
    id: dbProject.id,
    canal: dbProject.canal || '', // Manter ID original para formulários
    cliente: dbProject.cliente || '', // Manter ID original para formulários
    canal_name: canalName, // Nome para exibição
    cliente_name: clienteName, // Nome para exibição
    descricao: dbProject.descricao || dbProject.description || '',
    status: dbProject.status,
    produto: dbProject.produto || '',
    valor_hora_canal: dbProject.valor_hora_canal || 0,
    valor_hora_consultor: dbProject.valor_hora_consultor || 0,
    consultor: dbProject.consultor || '',
    consultants: consultants || [],
    estimated_hours: dbProject.estimated_hours || 0,
    worked_hours: dbProject.worked_hours || 0,
    start_date: dbProject.start_date,
    end_date: dbProject.end_date,
    created_at: dbProject.created_at,
    updated_at: dbProject.updated_at,
    notes: dbProject.notes,
    attachments: [] // Será carregado separadamente se necessário
  };
  
  return project;
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

      if (!data) return [];
      
      // Mapear projetos com seus consultores
      const projects = await Promise.all(data.map(mapDatabaseToProject));
      return projects;
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

      return data ? await mapDatabaseToProject(data) : null;
    } catch (error) {
      console.error('Erro no serviço de projeto:', error);
      throw error;
    }
  }

  // Criar novo projeto
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const dbData = mapProjectToDatabase(projectData);
      
      // 1. Criar o projeto
      const { data, error } = await supabase
        .from('projects')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        throw new Error(`Erro ao criar projeto: ${error.message}`);
      }

      // 2. Salvar consultores na tabela project_consultants
      if (projectData.consultants && projectData.consultants.length > 0) {
        const consultantsData = projectData.consultants.map(consultant => ({
          project_id: data.id,
          consultant_id: consultant.consultant_id,
          consultant_name: consultant.consultant_name || '',
          consultant_email: '', // Buscar depois se necessário
          hourly_rate: consultant.hourly_rate
        }));

        const { error: consultantsError } = await supabase
          .from('project_consultants')
          .insert(consultantsData);

        if (consultantsError) {
          console.error('Erro ao salvar consultores:', consultantsError);
          // Não falhamos o projeto por isso, apenas logamos
        }
      }

      return await mapDatabaseToProject(data);
    } catch (error) {
      console.error('Erro no serviço de criação de projeto:', error);
      throw error;
    }
  }

  // Atualizar projeto
  static async updateProject(projectData: UpdateProjectData): Promise<Project> {
    try {
      const { id, consultants, ...updateData } = projectData;
      const dbData = mapProjectToDatabase(updateData);

      // 1. Atualizar o projeto
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

      // 2. Atualizar consultores se fornecidos
      if (consultants !== undefined) {

        
        // Remover consultores antigos
        const { error: deleteError } = await supabase
          .from('project_consultants')
          .delete()
          .eq('project_id', id);
          
        if (deleteError) {
          console.error('Erro ao remover consultores antigos:', deleteError);
        }

        // Adicionar novos consultores
        if (consultants.length > 0) {
          const consultantsData = consultants.map(consultant => ({
            project_id: id,
            consultant_id: consultant.consultant_id,
            consultant_name: consultant.consultant_name || '',
            consultant_email: '',
            hourly_rate: consultant.hourly_rate
          }));

          const { error: consultantsError } = await supabase
            .from('project_consultants')
            .insert(consultantsData);

          if (consultantsError) {
            console.error('Erro ao atualizar consultores:', consultantsError);
          }
        }
      }

      return await mapDatabaseToProject(data);
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
