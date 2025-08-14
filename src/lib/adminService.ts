import { supabase } from './supabaseClient';
import { 
  User, 
  Consultant, 
  Canal, 
  Client, 
  CreateUserData, 
  CreateConsultantData, 
  CreateCanalData, 
  CreateClientData,
  UpdateUserData,
  UpdateConsultantData,
  UpdateCanalData,
  UpdateClientData,
  AdminStats
} from '@/types/admin';

// ===============================
// SERVIÇOS DE USUÁRIOS
// ===============================

export class UserService {
  // Listar todos os usuários
  static async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Criar novo usuário
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async updateUser(userData: UpdateUserData): Promise<User> {
    try {
      const { id, ...updateData } = userData;
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Deletar usuário
  static async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

// ===============================
// SERVIÇOS DE CONSULTORES
// ===============================

export class ConsultantService {
  // Listar todos os consultores
  static async getConsultants(): Promise<Consultant[]> {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar consultores:', error);
      throw error;
    }
  }

  // Criar novo consultor
  static async createConsultant(consultantData: CreateConsultantData): Promise<Consultant> {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar consultor:', error);
      throw error;
    }
  }



  // Atualizar consultor
  static async updateConsultant(consultantData: UpdateConsultantData): Promise<Consultant> {
    try {
      const { id, ...updateData } = consultantData;
      
      const { data, error } = await supabase
        .from('consultants')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar consultor:', error);
      throw error;
    }
  }

  // Deletar consultor
  static async deleteConsultant(consultantId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', consultantId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar consultor:', error);
      throw error;
    }
  }
}

// ===============================
// SERVIÇOS DE CANAIS
// ===============================

export class CanalService {
  // Listar todos os canais
  static async getCanals(): Promise<Canal[]> {
    try {
      const { data, error } = await supabase
        .from('canals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear dados do banco para o tipo Canal
      return data?.map(canal => ({
        ...canal,
        contact_emails: canal.contact_emails || [],
        valor_hora: canal.valor_hora || 0,
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar canais:', error);
      throw error;
    }
  }

  // Criar novo canal
  static async createCanal(canalData: CreateCanalData): Promise<Canal> {
    try {
      const { data, error } = await supabase
        .from('canals')
        .insert([canalData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar canal:', error);
      throw error;
    }
  }

  // Atualizar canal
  static async updateCanal(canalData: UpdateCanalData): Promise<Canal> {
    try {
      const { id, ...updateData } = canalData;
      
      const { data, error } = await supabase
        .from('canals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
      throw error;
    }
  }

  // Deletar canal
  static async deleteCanal(canalId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('canals')
        .delete()
        .eq('id', canalId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar canal:', error);
      throw error;
    }
  }
}

// ===============================
// SERVIÇOS DE CLIENTES
// ===============================

export class ClientService {
  // Listar todos os clientes
  static async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Criar novo cliente
  static async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Criar contato para cliente
  static async createClientContact(clientId: string, contactData: { name: string; email: string; is_primary?: boolean }) {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .insert([{
          client_id: clientId,
          name: contactData.name,
          email: contactData.email,
          is_primary: contactData.is_primary || false
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar contato do cliente:', error);
      throw error;
    }
  }

  // Buscar contatos de um cliente
  static async getClientContacts(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar contatos do cliente:', error);
      throw error;
    }
  }

  // Atualizar cliente
  static async updateClient(clientData: UpdateClientData): Promise<Client> {
    try {
      const { id, ...updateData } = clientData;
      
      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  // Deletar cliente
  static async deleteClient(clientId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }
}

// ===============================
// SERVIÇOS DE ESTATÍSTICAS
// ===============================

export class AdminStatsService {
  // Buscar estatísticas gerais calculadas dinamicamente
  static async getAdminStats(): Promise<AdminStats> {
    try {
      // Buscar estatísticas de usuários (assumindo que existe uma tabela users)
      const { data: usersData } = await supabase
        .from('users')
        .select('id, is_active');

      // Buscar estatísticas de consultores
      const { data: consultantsData } = await supabase
        .from('consultants')
        .select('id, is_active');

      // Buscar estatísticas de canais (assumindo que existe uma tabela canals)
      const { data: canalsData } = await supabase
        .from('canals')
        .select('id, is_active');

      // Buscar estatísticas de clientes
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, is_active');

      // Calcular estatísticas
      const stats: AdminStats = {
        total_users: usersData?.length || 0,
        active_users: usersData?.filter(u => u.is_active).length || 0,
        total_consultants: consultantsData?.length || 0,
        active_consultants: consultantsData?.filter(c => c.is_active).length || 0,
        total_canals: canalsData?.length || 0,
        active_canals: canalsData?.filter(c => c.is_active).length || 0,
        total_clients: clientsData?.length || 0,
        active_clients: clientsData?.filter(c => c.is_active).length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      
      // Retornar estatísticas padrão em caso de erro
      return {
        total_users: 0,
        active_users: 0,
        total_consultants: 0,
        active_consultants: 0,
        total_canals: 0,
        active_canals: 0,
        total_clients: 0,
        active_clients: 0,
      };
    }
  }
}
