export interface ProjectConsultant {
  consultant_id: string;
  consultant_name?: string;
  hourly_rate: number;
}

export interface Project {
  id: string;
  canal: string; // ID do canal para formulários
  cliente: string; // ID do cliente para formulários
  canal_name?: string; // Nome do canal para exibição
  cliente_name?: string; // Nome do cliente para exibição
  descricao?: string;
  status: ProjectStatus;
  produto: string;
  valor_hora_canal: number;
  valor_hora_consultor: number; // Mantido para compatibilidade, mas será deprecated
  consultor: string; // Mantido para compatibilidade, mas será deprecated
  consultants: ProjectConsultant[]; // Novo campo para múltiplos consultores
  estimated_hours?: number;
  worked_hours?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  attachments?: ProjectAttachment[];
  notes?: string;
}

export interface ProjectAttachment {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface ProjectTeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  hourly_rate?: number;
  assigned_at: string;
}

export interface ProjectTimeEntry {
  id: string;
  project_id: string;
  user_id: string;
  description: string;
  hours: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string; // consultor
  estimated_hours?: number;
  worked_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type TaskStatus = 
  | "pendente"
  | "em_andamento"
  | "em_revisao"
  | "concluida"
  | "cancelada";

export type TaskPriority = "baixa" | "media" | "alta" | "urgente";

export type ProjectStatus = 
  | "planejamento"
  | "em_andamento" 
  | "pausado"
  | "aguardando_cliente"
  | "concluido"
  | "cancelado";

export type ProjectPriority = "baixa" | "media" | "alta" | "urgente";

export interface CreateProjectData {
  canal: string;
  cliente: string;
  descricao?: string;
  status: ProjectStatus;
  produto: string;
  valor_hora_canal: number;
  valor_hora_consultor: number; // Mantido para compatibilidade
  consultor: string; // Mantido para compatibilidade
  consultants: ProjectConsultant[]; // Novo campo para múltiplos consultores
  estimated_hours?: number;
  start_date?: string;
  end_date?: string;
  notes?: string;
  attachments?: ProjectAttachment[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  client?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_hours: number;
  total_revenue: number;
  total_profit: number;
  projects_at_risk: number;
  projects_ending_soon: number;
} 