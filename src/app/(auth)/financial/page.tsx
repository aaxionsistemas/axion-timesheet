"use client";
import React, { useState } from "react";
import { 
  FinancialOverview, 
  ConsultantFinancialData,
  TimeEntryApproval,
  ApprovalAction,
  UserRole 
} from "@/types/financial";
import FinancialOverviewAdmin from "@/components/FinancialOverviewAdmin";
import ApprovalsManager from "@/components/ApprovalsManager";
import ConsultantFinancialView from "@/components/ConsultantFinancialView";
import { Button } from "@/components/ui/button";
import { BarChart3, Users } from "lucide-react";

// Mock data - Em produção virá da API/banco de dados
const mockFinancialOverview: FinancialOverview = {
  total_revenue: 450000,
  total_costs: 280000,
  total_profit: 170000,
  profit_margin_percentage: 37.8,
  pending_approvals_amount: 15600,
  pending_payments_amount: 28900,
  monthly_revenue: [
    { month: "Jul/24", revenue: 62000, costs: 38000, profit: 24000 },
    { month: "Ago/24", revenue: 71000, costs: 42000, profit: 29000 },
    { month: "Set/24", revenue: 68000, costs: 41000, profit: 27000 },
    { month: "Out/24", revenue: 75000, costs: 46000, profit: 29000 },
    { month: "Nov/24", revenue: 82000, costs: 52000, profit: 30000 },
    { month: "Dez/24", revenue: 89000, costs: 55000, profit: 34000 },
  ],
  top_projects: [
    {
      project_id: "1",
      project_name: "Sistema E-commerce",
      client_name: "TechCorp",
      total_estimated_hours: 200,
      total_logged_hours: 180,
      total_approved_hours: 165,
      total_pending_hours: 15,
      estimated_revenue: 50000,
      actual_revenue: 45000,
      estimated_cost: 28000,
      actual_cost: 26000,
      profit_margin: 42.2,
      completion_percentage: 90,
      average_hourly_rate: 250,
      consultants_involved: [],
    },
    {
      project_id: "2",
      project_name: "App Mobile",
      client_name: "StartupXYZ",
      total_estimated_hours: 150,
      total_logged_hours: 140,
      total_approved_hours: 140,
      total_pending_hours: 0,
      estimated_revenue: 37500,
      actual_revenue: 35000,
      estimated_cost: 21000,
      actual_cost: 21000,
      profit_margin: 40.0,
      completion_percentage: 100,
      average_hourly_rate: 250,
      consultants_involved: [],
    },
  ],
  consultants_summary: [
    {
      consultant_id: "1",
      consultant_name: "João Silva",
      hourly_rate: 120,
      hours_logged: 165,
      hours_approved: 150,
      hours_pending: 15,
      total_earned: 18000,
      total_pending: 1800,
    },
    {
      consultant_id: "2",
      consultant_name: "Maria Santos",
      hourly_rate: 150,
      hours_logged: 140,
      hours_approved: 135,
      hours_pending: 5,
      total_earned: 20250,
      total_pending: 750,
    },
    {
      consultant_id: "3",
      consultant_name: "Pedro Costa",
      hourly_rate: 100,
      hours_logged: 120,
      hours_approved: 120,
      hours_pending: 0,
      total_earned: 12000,
      total_pending: 0,
    },
  ],
};

const mockApprovals: TimeEntryApproval[] = [
  {
    id: "1",
    time_entry_id: "te1",
    demand_id: "d1",
    demand_title: "Desenvolvimento Landing Page",
    consultant_id: "1",
    consultant_name: "João Silva",
    consultant_hourly_rate: 120,
    hours: 8,
    description: "Desenvolvimento da página inicial e componentes React",
    date: "2024-01-25",
    status: "pending",
    total_amount: 960,
    created_at: "2024-01-25T18:00:00Z",
    updated_at: "2024-01-25T18:00:00Z",
  },
  {
    id: "2",
    time_entry_id: "te2",
    demand_id: "d1",
    demand_title: "Desenvolvimento Landing Page",
    consultant_id: "1",
    consultant_name: "João Silva",
    consultant_hourly_rate: 120,
    hours: 6.5,
    description: "Implementação responsiva e otimizações",
    date: "2024-01-24",
    status: "pending",
    total_amount: 780,
    created_at: "2024-01-24T17:30:00Z",
    updated_at: "2024-01-24T17:30:00Z",
  },
  {
    id: "3",
    time_entry_id: "te3",
    demand_id: "d2",
    demand_title: "Integração API Pagamento",
    consultant_id: "2",
    consultant_name: "Maria Santos",
    consultant_hourly_rate: 150,
    hours: 5,
    description: "Configuração inicial do Stripe e webhooks",
    date: "2024-01-25",
    status: "pending",
    total_amount: 750,
    created_at: "2024-01-25T16:00:00Z",
    updated_at: "2024-01-25T16:00:00Z",
  },
  {
    id: "4",
    time_entry_id: "te4",
    demand_id: "d3",
    demand_title: "Auditoria Performance",
    consultant_id: "1",
    consultant_name: "João Silva",
    consultant_hourly_rate: 120,
    hours: 18,
    description: "Análise completa de performance e relatório de otimizações",
    date: "2024-01-20",
    status: "approved",
    total_amount: 2160,
    approved_by: "admin",
    approved_at: "2024-01-22T10:00:00Z",
    created_at: "2024-01-20T16:45:00Z",
    updated_at: "2024-01-22T10:00:00Z",
  },
];

const mockConsultantData: ConsultantFinancialData = {
  consultant_id: "1",
  consultant_name: "João Silva",
  hourly_rate: 120,
  current_month_hours: 45.5,
  current_month_earnings: 5460,
  pending_approval_hours: 14.5,
  pending_approval_amount: 1740,
  last_payment_date: "2024-12-15",
  last_payment_amount: 4800,
  next_payment_date: "2025-01-31",
  next_payment_amount: 5460,
  total_year_hours: 385,
  total_year_earnings: 46200,
  monthly_history: [
    { month: "Jul/24", hours: 40, earnings: 4800, projects_count: 3 },
    { month: "Ago/24", hours: 38, earnings: 4560, projects_count: 2 },
    { month: "Set/24", hours: 42, earnings: 5040, projects_count: 4 },
    { month: "Out/24", hours: 45, earnings: 5400, projects_count: 3 },
    { month: "Nov/24", hours: 39, earnings: 4680, projects_count: 2 },
    { month: "Dez/24", hours: 45.5, earnings: 5460, projects_count: 3 },
  ],
  recent_approvals: mockApprovals.filter(a => a.consultant_id === "1"),
  recent_payments: [
    {
      id: "p1",
      consultant_id: "1",
      consultant_name: "João Silva",
      period_start: "2024-11-01",
      period_end: "2024-11-30",
      approved_entries: [],
      total_hours: 39,
      total_amount: 4680,
      status: "paid",
      payment_date: "2024-12-15",
      payment_method: "PIX",
      created_at: "2024-12-01T10:00:00Z",
      updated_at: "2024-12-15T14:30:00Z",
    },
    {
      id: "p2",
      consultant_id: "1",
      consultant_name: "João Silva",
      period_start: "2024-10-01",
      period_end: "2024-10-31",
      approved_entries: [],
      total_hours: 45,
      total_amount: 5400,
      status: "paid",
      payment_date: "2024-11-15",
      payment_method: "PIX",
      created_at: "2024-11-01T10:00:00Z",
      updated_at: "2024-11-15T14:30:00Z",
    },
  ],
};

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "approvals">("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Mock current user - Em produção vem do contexto de autenticação
  const [currentUser] = useState<{ role: UserRole; id: string }>({
    role: "admin", // Altere para "consultant" para ver a visão do consultor
    id: "1"
  });

  const handleApproveEntries = async (action: ApprovalAction) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Approval action:", action);
      
      // Aqui você implementaria a lógica real de aprovação
      // Atualizar estado dos apontamentos, etc.
      
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Visão do Consultor
  if (currentUser.role === "consultant") {
    return (
      <main className="min-h-screen bg-background p-6">
        <ConsultantFinancialView data={mockConsultantData} />
      </main>
    );
  }

  // Visão do Administrador
  return (
    <main className="min-h-screen bg-background p-6">
      {/* Header com tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold axion-gradient bg-clip-text text-transparent">
            Financeiro
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "overview" ? "default" : "outline"}
              onClick={() => setActiveTab("overview")}
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "approvals" ? "default" : "outline"}
              onClick={() => setActiveTab("approvals")}
              size="sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Aprovações
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === "overview" && (
        <FinancialOverviewAdmin data={mockFinancialOverview} />
      )}

      {activeTab === "approvals" && (
        <ApprovalsManager
          approvals={mockApprovals}
          onApproveEntries={handleApproveEntries}
          isLoading={isLoading}
        />
      )}
    </main>
  );
} 