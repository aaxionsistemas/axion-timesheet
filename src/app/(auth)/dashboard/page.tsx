"use client";
import React, { useState, useEffect } from "react";
import { Clock, Folder, DollarSign, CalendarCheck, User, Users } from "lucide-react";
import WorkedHoursChart from "@/components/WorkedHoursChart";
import PendingHoursCard from "@/components/PendingHoursCard";
import ConsultantRevenueChart from "@/components/ConsultantRevenueChart";
import SummaryCard from "@/components/SummaryCard";
import ActiveProjectsTable from "@/components/ActiveProjectsTable";
import AdminRevenueChart from "@/components/AdminRevenueChart";
import ConsultantHoursBarChart from "@/components/ConsultantHoursBarChart";
import NextPaymentsCard from "@/components/NextPaymentsCard";
import ProjectsAtRiskCard from "@/components/ProjectsAtRiskCard";
import ProjectsEndingSoonCard from "@/components/ProjectsEndingSoonCard";
import RecentPaymentsCard from "@/components/RecentPaymentsCard";
import LatePaymentsCard from "@/components/LatePaymentsCard";
import AdminAlertsCard from "@/components/AdminAlertsCard";
import { DashboardService, DashboardStats } from "@/lib/dashboardService";

const userRole = "admin"; // Troque para "consultor" para testar a visão do consultor

function DashboardConsultor() {
  const [consultantStats, setConsultantStats] = useState({
    monthlyHours: 0,
    monthlyRevenue: 0,
    activeProjects: 0,
    nextPaymentDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultantStats();
  }, []);

  const loadConsultantStats = async () => {
    try {
      setLoading(true);
      // Por enquanto, usando um consultor exemplo. Futuramente virá do contexto de autenticação
      const stats = await DashboardService.getConsultantStats('João Silva');
      setConsultantStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas do consultor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 space-y-8">
        <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Meu Painel</h2>
        <div className="text-center py-12 text-gray-500">Carregando dados...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Meu Painel</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          icon={<Clock className="text-axionBlue" size={24} />} 
          value={`${consultantStats.monthlyHours}h`} 
          label="Horas no mês" 
        />
        <SummaryCard 
          icon={<DollarSign className="text-axionPurple" size={24} />} 
          value={`R$ ${consultantStats.monthlyRevenue.toLocaleString('pt-BR')}`} 
          label="Receita" 
        />
        <SummaryCard 
          icon={<CalendarCheck className="text-axionBlue" size={24} />} 
          value={consultantStats.nextPaymentDate} 
          label="Próximo Pagamento" 
        />
        <SummaryCard 
          icon={<Folder className="text-axionPurple" size={24} />} 
          value={consultantStats.activeProjects.toString()} 
          label="Projetos Ativos" 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ProjectsEndingSoonCard />
        <RecentPaymentsCard />
      </div>
      <ActiveProjectsTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <WorkedHoursChart consultantName="João Silva" />
        <ConsultantRevenueChart consultantName="João Silva" />
      </div>
      {/* Espaço para futuros cards ou gráficos */}
    </main>
  );
}

function DashboardAdmin() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeProjects: 0,
    totalHours: 0,
    activeConsultants: 0,
    activeClients: 0,
    projectsAtRisk: 0,
    projectsEndingSoon: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await DashboardService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 space-y-8">
        <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Visão Geral</h2>
        <div className="text-center py-12 text-gray-500">Carregando dados...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          icon={<DollarSign className="text-axionBlue" size={24} />} 
          value={`R$ ${dashboardStats.totalRevenue.toLocaleString('pt-BR')}`} 
          label="Receita Total" 
        />
        <SummaryCard 
          icon={<Folder className="text-axionPurple" size={24} />} 
          value={dashboardStats.activeProjects.toString()} 
          label="Projetos Ativos" 
        />
        <SummaryCard 
          icon={<Users className="text-axionBlue" size={24} />} 
          value={dashboardStats.activeConsultants.toString()} 
          label="Consultores Ativos" 
        />
        <SummaryCard 
          icon={<User className="text-axionPurple" size={24} />} 
          value={dashboardStats.activeClients.toString()} 
          label="Clientes Ativos" 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AdminRevenueChart />
        <ConsultantHoursBarChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <NextPaymentsCard />
        <ProjectsAtRiskCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PendingHoursCard />
        <LatePaymentsCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AdminAlertsCard />
        {/* Espaço para futuros cards ou gráficos */}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return userRole === "admin" ? <DashboardAdmin /> : <DashboardConsultor />;
} 