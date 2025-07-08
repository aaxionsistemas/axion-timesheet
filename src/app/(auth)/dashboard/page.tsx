"use client";
import React from "react";
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

const userRole = "admin"; // Troque para "consultor" para testar a visão do consultor

function DashboardConsultor() {
  return (
    <main className="min-h-screen bg-background p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Meu Painel</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard icon={<Clock className="text-axionBlue" size={24} />} value="52h" label="Horas no mês" />
        <SummaryCard icon={<DollarSign className="text-axionPurple" size={24} />} value="R$ 2.400" label="Receita" />
        <SummaryCard icon={<CalendarCheck className="text-axionBlue" size={24} />} value="10/07" label="Próximo Pagamento" />
        <SummaryCard icon={<Folder className="text-axionPurple" size={24} />} value="3" label="Projetos Ativos" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ProjectsEndingSoonCard />
        <RecentPaymentsCard />
      </div>
      <ActiveProjectsTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <WorkedHoursChart />
        <ConsultantRevenueChart />
      </div>
      {/* Espaço para futuros cards ou gráficos */}
    </main>
  );
}

function DashboardAdmin() {
  return (
    <main className="min-h-screen bg-background p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard icon={<DollarSign className="text-axionBlue" size={24} />} value="R$ 45.900" label="Receita Total" />
        <SummaryCard icon={<Folder className="text-axionPurple" size={24} />} value="12" label="Projetos Ativos" />
        <SummaryCard icon={<Users className="text-axionBlue" size={24} />} value="8" label="Consultores Ativos" />
        <SummaryCard icon={<User className="text-axionPurple" size={24} />} value="5" label="Clientes Ativos" />
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