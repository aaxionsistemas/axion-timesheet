export interface Demand {
  id: string;
  title: string;
  description: string;
  client: string;
  status: DemandStatus;
  priority: DemandPriority;
  assigned_to: string; // consultor
  assigned_to_name?: string; // nome do consultor para exibição
  estimated_hours?: number;
  total_logged_hours: number;
  created_by: string; // admin que criou
  created_by_name?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  tags?: string[];
}

export interface DemandTimeEntry {
  id: string;
  demand_id: string;
  consultant_id: string;
  consultant_name?: string;
  hours: number;
  description: string;
  date: string; // data do apontamento
  created_at: string;
  updated_at: string;
}

export interface CreateDemandData {
  title: string;
  description: string;
  client: string;
  status: DemandStatus;
  priority: DemandPriority;
  assigned_to: string;
  estimated_hours?: number;
  due_date?: string;
  tags?: string[];
}

export interface CreateTimeEntryData {
  demand_id: string;
  hours: number;
  description: string;
  date: string;
}

export interface DemandStats {
  total_demands: number;
  active_demands: number;
  completed_demands: number;
  overdue_demands: number;
  total_hours_logged: number;
  my_active_demands: number; // para consultores
  my_pending_hours: number; // para consultores
}

export interface DemandFilters {
  status?: DemandStatus[];
  priority?: DemandPriority[];
  assigned_to?: string[];
  client?: string;
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
  tags?: string[];
}

export type DemandStatus = 
  | "pendente"
  | "em_andamento"
  | "aguardando_feedback"
  | "em_revisao"
  | "concluida"
  | "cancelada";

export type DemandPriority = "baixa" | "media" | "alta" | "urgente";

export type UserRole = "admin" | "consultant";

export interface DemandUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
} 