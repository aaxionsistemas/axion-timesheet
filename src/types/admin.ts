// Tipos para sistema de administração

export type UserRole = "view" | "consultant" | "admin" | "master_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithConsultant extends User {
  consultant?: {
    hourly_rate: number;
    pix_key?: string;
    bank?: string;
    specialty?: string;
    hire_date?: string;
    skills?: string[];
    bio?: string;
  };
}

export interface Consultant {
  id: string;
  user_id?: string; // Referência para a tabela users
  name: string;
  email: string;
  hourly_rate: number;
  specialty?: string;
  hire_date?: string;
  skills?: string[];
  bio?: string;
  pix_key?: string;
  bank?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Canal {
  id: string;
  name: string;
  description?: string;
  type: CanalType;
  contact_person?: string;
  contact_emails: string[]; // Array de emails
  contact_phone?: string;
  data_apontamento?: number; // Dia do mês para apontamento (1-31)
  data_faturamento?: number; // Dia do mês para faturamento (1-31)
  data_pagamento?: number; // Dia do mês para pagamento (1-31)
  valor_hora: number; // Valor por hora
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CanalType = "direto" | "parceiro" | "indicacao" | "marketing";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  contact_person?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos para criação
export interface CreateUserData {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface CreateUserWithConsultantData extends CreateUserData {
  role: "consultant";
  // Dados específicos do consultor
  hourly_rate: number;
  pix_key?: string;
  bank?: string;
}

export interface CreateConsultantData {
  name: string;
  email: string;
  hourly_rate: number;
  pix_key?: string;
  bank?: string;
  is_active?: boolean;
}

export interface CreateCanalData {
  name: string;
  description?: string;
  type: CanalType;
  contact_person?: string;
  contact_emails: string[];
  contact_phone?: string;
  data_apontamento?: string; // String no frontend (será convertida para number no backend)
  data_faturamento?: string; // String no frontend (será convertida para number no backend)
  data_pagamento?: string; // String no frontend (será convertida para number no backend)
  valor_hora: number;
}

export interface CreateClientData {
  name?: string;
  email?: string;
  phone?: string;
  company: string;
  contact_person?: string;
  is_active?: boolean;
}

// Tipos para atualização
export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
  is_active?: boolean;
}

export interface UpdateConsultantData extends Partial<CreateConsultantData> {
  id: string;
  is_active?: boolean;
}

export interface UpdateCanalData extends Partial<CreateCanalData> {
  id: string;
  is_active?: boolean;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
  is_active?: boolean;
}

// Estatísticas
export interface AdminStats {
  total_users: number;
  active_users: number;
  total_consultants: number;
  active_consultants: number;
  total_canals: number;
  active_canals: number;
  total_clients: number;
  active_clients: number;
}
