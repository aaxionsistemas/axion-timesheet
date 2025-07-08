"use client";
import React from "react";
import { FinancialOverview } from "@/types/financial";
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface FinancialOverviewAdminProps {
  data: FinancialOverview;
}

export default function FinancialOverviewAdmin({ data }: FinancialOverviewAdminProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const stats = [
    {
      title: "Receita Total",
      value: formatCurrency(data.total_revenue),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Custos Totais",
      value: formatCurrency(data.total_costs),
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      change: "+8.2%",
      changeType: "negative" as const,
    },
    {
      title: "Lucro Total",
      value: formatCurrency(data.total_profit),
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+15.8%",
      changeType: "positive" as const,
    },
    {
      title: "Margem de Lucro",
      value: `${data.profit_margin_percentage.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "+2.3%",
      changeType: "positive" as const,
    },
    {
      title: "Pendente Aprovação",
      value: formatCurrency(data.pending_approvals_amount),
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      change: "-5.1%",
      changeType: "positive" as const,
    },
    {
      title: "Pendente Pagamento",
      value: formatCurrency(data.pending_payments_amount),
      icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: "+3.7%",
      changeType: "negative" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#18181b] rounded-xl p-4 shadow-lg border border-[#27272a] hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <span className={`text-xs font-medium ${
                    stat.changeType === "positive" ? "text-green-400" : "text-red-400"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/70 truncate">{stat.title}</p>
                <p className="text-xs text-foreground/50">vs mês anterior</p>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Top projetos e consultores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projetos */}
        <div className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a]">
          <h3 className="text-lg font-semibold mb-4 axion-gradient bg-clip-text text-transparent">
            Projetos Mais Lucrativos
          </h3>
          <div className="space-y-3">
            {data.top_projects.slice(0, 5).map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#27272a] rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{project.project_name}</p>
                  <p className="text-xs text-foreground/60">{project.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(project.actual_revenue - project.actual_cost)}
                  </p>
                  <p className="text-xs text-green-400">
                    {project.profit_margin.toFixed(1)}% margem
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Consultores */}
        <div className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a]">
          <h3 className="text-lg font-semibold mb-4 axion-gradient bg-clip-text text-transparent">
            Consultores Mais Ativos
          </h3>
          <div className="space-y-3">
            {data.consultants_summary.slice(0, 5).map((consultant, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#27272a] rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{consultant.consultant_name}</p>
                  <p className="text-xs text-foreground/60">
                    {consultant.hours_logged}h logged | {formatCurrency(consultant.hourly_rate)}/h
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(consultant.total_earned)}
                  </p>
                  <p className="text-xs text-yellow-400">
                    {formatCurrency(consultant.total_pending)} pendente
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 