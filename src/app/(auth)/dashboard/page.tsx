"use client";
import React from "react";
import MetricCard from "../../../components/MetricCard";
import { Clock, Folder, DollarSign, CalendarCheck } from "lucide-react";
import PremiumCard from "@/components/PremiumCard";
import ActiveProjectsCard from "@/components/ActiveProjectsCard";
import NextPaymentCard from "@/components/NextPaymentCard";
import WorkedHoursChart from "@/components/WorkedHoursChart";
import PendingHoursCard from "@/components/PendingHoursCard";
import AlertsCard from "@/components/AlertsCard";
import { FileText, FileStack, Server, Sparkles, BarChart2, Globe2, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
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

// Dados mockados para admin
const adminData = {
  receita: 12500,
  despesas: 3200,
  saldo: 9300,
  projetosAtivos: 5,
  clientesAtivos: 3,
  horasTrabalhadas: 120,
  automacao: 98,
  templates: 18,
  integracoes: 12,
  documentos: 245,
  graficoReceita: [
    { mes: "Jan", receita: 800 },
    { mes: "Fev", receita: 1200 },
    { mes: "Mar", receita: 1500 },
    { mes: "Abr", receita: 2000 },
    { mes: "Mai", receita: 2500 },
    { mes: "Jun", receita: 4500 },
  ],
  graficoHoras: [
    { projeto: "Projeto A", horas: 40 },
    { projeto: "Projeto B", horas: 30 },
    { projeto: "Projeto C", horas: 50 },
  ],
};

// Dados mockados para consultor
const consultorData = {
  projetosAtivos: 2,
  horasTrabalhadas: 38,
  tarefasConcluidas: 12,
  receitaPessoal: 3200,
  graficoHoras: [
    { projeto: "Projeto A", horas: 20 },
    { projeto: "Projeto B", horas: 18 },
  ],
  graficoProgresso: [
    { name: "Concluído", value: 70 },
    { name: "Restante", value: 30 },
  ],
};

const COLORS = ["#3B82F6", "#A855F7", "#60A5FA"];

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