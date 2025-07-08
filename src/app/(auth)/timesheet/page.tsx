"use client";
import React, { useState } from "react";
import { 
  Demand, 
  DemandTimeEntry, 
  CreateDemandData, 
  CreateTimeEntryData, 
  DemandUser 
} from "@/types/demands";
import Modal from "@/components/ui/modal";
import DemandForm from "@/components/DemandForm";
import TimeEntryForm from "@/components/TimeEntryForm";
import DemandsList from "@/components/DemandsList";
import TimeEntriesView from "@/components/TimeEntriesView";
import DemandsStats from "@/components/DemandsStats";

// Mock data - In production, this would come from your API/database
const mockConsultants: DemandUser[] = [
  { id: "1", name: "João Silva", email: "joao.nunes@axionsistemas.com", role: "admin" },
  { id: "2", name: "Maria Santos", email: "maria@exemplo.com", role: "consultant" },
  { id: "3", name: "Pedro Costa", email: "pedro@exemplo.com", role: "consultant" },
];

const mockDemands: Demand[] = [
  {
    id: "1",
    title: "Desenvolvimento de Landing Page",
    description: "Criar landing page responsiva para campanha de marketing Q1 com foco em conversão e otimização SEO.",
    client: "TechCorp",
    status: "em_andamento",
    priority: "alta",
    assigned_to: "1",
    assigned_to_name: "João Silva",
    estimated_hours: 40,
    total_logged_hours: 24.5,
    created_by: "admin",
    created_by_name: "Admin",
    due_date: "2024-02-15",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-25T15:30:00Z",
    tags: ["frontend", "marketing", "urgente"],
  },
  {
    id: "2",
    title: "Integração API de Pagamento",
    description: "Implementar sistema de pagamento com Stripe e webhook para notificações automáticas.",
    client: "E-commerce Plus",
    status: "pendente",
    priority: "media",
    assigned_to: "2",
    assigned_to_name: "Maria Santos",
    estimated_hours: 20,
    total_logged_hours: 0,
    created_by: "admin",
    created_by_name: "Admin",
    due_date: "2024-02-28",
    created_at: "2024-01-22T09:00:00Z",
    updated_at: "2024-01-22T09:00:00Z",
    tags: ["backend", "api", "pagamento"],
  },
  {
    id: "3",
    title: "Auditoria de Performance",
    description: "Análise completa de performance do sistema e propostas de otimização para reduzir tempo de carregamento.",
    client: "StartupXYZ",
    status: "concluida",
    priority: "baixa",
    assigned_to: "1",
    assigned_to_name: "João Silva",
    estimated_hours: 16,
    total_logged_hours: 18,
    created_by: "admin",
    created_by_name: "Admin",
    due_date: "2024-01-30",
    created_at: "2024-01-15T14:00:00Z",
    updated_at: "2024-01-30T16:45:00Z",
    completed_at: "2024-01-30T16:45:00Z",
    tags: ["performance", "auditoria"],
  },
];

const mockTimeEntries: DemandTimeEntry[] = [
  {
    id: "1",
    demand_id: "1",
    consultant_id: "1",
    consultant_name: "João Silva",
    hours: 8,
    description: "Configuração inicial do projeto e estrutura de componentes React",
    date: "2024-01-23",
    created_at: "2024-01-23T18:00:00Z",
    updated_at: "2024-01-23T18:00:00Z",
  },
  {
    id: "2",
    demand_id: "1",
    consultant_id: "1",
    consultant_name: "João Silva",
    hours: 6.5,
    description: "Desenvolvimento da seção hero e implementação do design responsivo",
    date: "2024-01-24",
    created_at: "2024-01-24T17:30:00Z",
    updated_at: "2024-01-24T17:30:00Z",
  },
  {
    id: "3",
    demand_id: "1",
    consultant_id: "1",
    consultant_name: "João Silva",
    hours: 10,
    description: "Integração com formulários de contato e otimização SEO básica",
    date: "2024-01-25",
    created_at: "2024-01-25T19:15:00Z",
    updated_at: "2024-01-25T19:15:00Z",
  },
  {
    id: "4",
    demand_id: "3",
    consultant_id: "1",
    consultant_name: "João Silva",
    hours: 18,
    description: "Análise completa de performance, identificação de gargalos e implementação de otimizações",
    date: "2024-01-30",
    created_at: "2024-01-30T16:45:00Z",
    updated_at: "2024-01-30T16:45:00Z",
  },
];

export default function DemandsPage() {
  // Estado principal
  const [demands, setDemands] = useState<Demand[]>(mockDemands);
  const [timeEntries, setTimeEntries] = useState<DemandTimeEntry[]>(mockTimeEntries);
  const [consultants] = useState<DemandUser[]>(mockConsultants);
  const [currentUser] = useState<DemandUser>({ 
    id: "admin", 
    name: "Administrador", 
    email: "admin@exemplo.com", 
    role: "admin" // Change to "consultant" to test consultant view
  });

  // Estados de modal e formulários
  const [showDemandForm, setShowDemandForm] = useState(false);
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [showTimeEntriesView, setShowTimeEntriesView] = useState(false);
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
  const [selectedDemandId, setSelectedDemandId] = useState<string>("");
  const [selectedDemandTitle, setSelectedDemandTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar demandas baseado no role do usuário
  const filteredDemands = currentUser.role === "admin" 
    ? demands 
    : demands.filter(demand => demand.assigned_to === currentUser.id);

  // Handlers para demandas
  const handleCreateDemand = () => {
    setEditingDemand(null);
    setShowDemandForm(true);
  };

  const handleEditDemand = (demand: Demand) => {
    setEditingDemand(demand);
    setShowDemandForm(true);
  };

  const handleSubmitDemand = async (data: CreateDemandData) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingDemand) {
        // Atualizar demanda existente
        setDemands(prev => prev.map(demand => 
          demand.id === editingDemand.id 
            ? {
                ...demand,
                ...data,
                assigned_to_name: consultants.find(c => c.id === data.assigned_to)?.name,
                updated_at: new Date().toISOString(),
              }
            : demand
        ));
      } else {
        // Criar nova demanda
        const newDemand: Demand = {
          id: Date.now().toString(),
          ...data,
          assigned_to_name: consultants.find(c => c.id === data.assigned_to)?.name,
          total_logged_hours: 0,
          created_by: currentUser.id,
          created_by_name: currentUser.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setDemands(prev => [newDemand, ...prev]);
      }
      
      setShowDemandForm(false);
      setEditingDemand(null);
    } catch (error) {
      console.error("Erro ao salvar demanda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para apontamentos de horas
  const handleAddTimeEntry = (demandId: string) => {
    const demand = demands.find(d => d.id === demandId);
    if (demand) {
      setSelectedDemandId(demandId);
      setSelectedDemandTitle(demand.title);
      setShowTimeEntryForm(true);
    }
  };

  const handleSubmitTimeEntry = async (data: CreateTimeEntryData) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTimeEntry: DemandTimeEntry = {
        id: Date.now().toString(),
        ...data,
        consultant_id: currentUser.id,
        consultant_name: currentUser.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTimeEntries(prev => [newTimeEntry, ...prev]);

      // Atualizar total de horas na demanda
      setDemands(prev => prev.map(demand => 
        demand.id === data.demand_id
          ? { 
              ...demand, 
              total_logged_hours: demand.total_logged_hours + data.hours,
              updated_at: new Date().toISOString(),
            }
          : demand
      ));

      setShowTimeEntryForm(false);
      setSelectedDemandId("");
      setSelectedDemandTitle("");
    } catch (error) {
      console.error("Erro ao salvar apontamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para visualizar apontamentos
  const handleViewTimeEntries = (demandId: string) => {
    const demand = demands.find(d => d.id === demandId);
    if (demand) {
      setSelectedDemandId(demandId);
      setSelectedDemandTitle(demand.title);
      setShowTimeEntriesView(true);
    }
  };

  // Handler para deletar apontamento (admin only)
  const handleDeleteTimeEntry = async (entryId: string) => {
    if (currentUser.role !== "admin") return;
    
    setIsLoading(true);
    try {
      const entry = timeEntries.find(e => e.id === entryId);
      if (!entry) return;

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      setTimeEntries(prev => prev.filter(e => e.id !== entryId));

      // Atualizar total de horas na demanda
      setDemands(prev => prev.map(demand => 
        demand.id === entry.demand_id
          ? { 
              ...demand, 
              total_logged_hours: Math.max(0, demand.total_logged_hours - entry.hours),
              updated_at: new Date().toISOString(),
            }
          : demand
      ));
    } catch (error) {
      console.error("Erro ao deletar apontamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obter apontamentos da demanda selecionada
  const selectedDemandTimeEntries = timeEntries.filter(
    entry => entry.demand_id === selectedDemandId
  );

  return (
    <main className="min-h-screen bg-background p-6">
      {/* Estatísticas */}
      <DemandsStats
        demands={demands}
        timeEntries={timeEntries}
        userRole={currentUser.role}
        userId={currentUser.id}
      />

      {/* Lista de demandas */}
      <DemandsList
        demands={filteredDemands}
        userRole={currentUser.role}
        onCreateDemand={currentUser.role === "admin" ? handleCreateDemand : undefined}
        onEditDemand={currentUser.role === "admin" ? handleEditDemand : undefined}
        onAddTimeEntry={currentUser.role === "consultant" ? handleAddTimeEntry : undefined}
        onViewTimeEntries={handleViewTimeEntries}
        isLoading={false}
      />

      {/* Modal de formulário de demanda */}
      <Modal 
        isOpen={showDemandForm} 
        onClose={() => setShowDemandForm(false)}
        title={editingDemand ? "Editar Demanda" : "Nova Demanda"}
        size="lg"
      >
        <DemandForm
          onSubmit={handleSubmitDemand}
          onCancel={() => setShowDemandForm(false)}
          consultants={consultants}
          isLoading={isLoading}
          initialData={editingDemand || undefined}
        />
      </Modal>

      {/* Modal de apontamento de horas */}
      <Modal 
        isOpen={showTimeEntryForm} 
        onClose={() => setShowTimeEntryForm(false)}
        title="Apontar Horas"
        size="sm"
      >
        <TimeEntryForm
          demandId={selectedDemandId}
          demandTitle={selectedDemandTitle}
          onSubmit={handleSubmitTimeEntry}
          onCancel={() => setShowTimeEntryForm(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Modal de visualização de apontamentos */}
      {showTimeEntriesView && (
        <TimeEntriesView
          demandTitle={selectedDemandTitle}
          timeEntries={selectedDemandTimeEntries}
          userRole={currentUser.role}
          onClose={() => setShowTimeEntriesView(false)}
          onDeleteEntry={currentUser.role === "admin" ? handleDeleteTimeEntry : undefined}
          isLoading={isLoading}
        />
      )}
    </main>
  );
} 