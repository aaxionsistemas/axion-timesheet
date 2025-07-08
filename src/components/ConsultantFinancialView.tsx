"use client";
import React from "react";
import { ConsultantFinancialData } from "@/types/financial";
import { DollarSign, Clock, TrendingUp, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConsultantFinancialViewProps {
  data: ConsultantFinancialData;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  paid: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const statusLabels = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  paid: "Pago",
};

export default function ConsultantFinancialView({ data }: ConsultantFinancialViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const stats = [
    {
      title: "Valor Hora",
      value: formatCurrency(data.hourly_rate),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      subtitle: "taxa atual",
    },
    {
      title: "Este Mês",
      value: `${data.current_month_hours}h`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      subtitle: formatCurrency(data.current_month_earnings),
    },
    {
      title: "Pendente Aprovação",
      value: `${data.pending_approval_hours}h`,
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      subtitle: formatCurrency(data.pending_approval_amount),
    },
    {
      title: "Total Ano",
      value: `${data.total_year_hours}h`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      subtitle: formatCurrency(data.total_year_earnings),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold axion-gradient bg-clip-text text-transparent">
            Meu Financeiro
          </h2>
          <p className="text-foreground/70">
            Acompanhe seus ganhos e aprovações
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground/70 truncate">{stat.title}</p>
                <p className="text-xs text-foreground/50">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Próximo pagamento */}
      {data.next_payment_date && (
        <div className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a] border-l-4 border-l-green-500">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Próximo Pagamento</h3>
              <p className="text-foreground/70">
                {formatCurrency(data.next_payment_amount || 0)} em {formatDate(data.next_payment_date)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Histórico mensal e aprovações recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico Mensal */}
        <div className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a]">
          <h3 className="text-lg font-semibold mb-4 axion-gradient bg-clip-text text-transparent">
            Histórico Mensal (Últimos 6 meses)
          </h3>
          <div className="space-y-3">
            {data.monthly_history.slice(-6).map((month, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm text-foreground/60">
                  {month.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {month.hours}h
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(month.earnings)}
                    </span>
                  </div>
                  <div className="w-full bg-[#27272a] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((month.hours / Math.max(...data.monthly_history.map(m => m.hours), 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-foreground/50 mt-1">
                    {month.projects_count} projetos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aprovações Recentes */}
        <div className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a]">
          <h3 className="text-lg font-semibold mb-4 axion-gradient bg-clip-text text-transparent">
            Aprovações Recentes
          </h3>
          <div className="space-y-3">
            {data.recent_approvals.slice(0, 5).map((approval, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#27272a] rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {approval.demand_title}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {formatDate(approval.date)} • {approval.hours}h
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[approval.status]}>
                    {statusLabels[approval.status]}
                  </Badge>
                  <p className="font-semibold text-foreground text-sm">
                    {formatCurrency(approval.total_amount)}
                  </p>
                </div>
              </div>
            ))}
            {data.recent_approvals.length === 0 && (
              <p className="text-foreground/60 text-center py-8">
                Nenhuma aprovação recente
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Últimos pagamentos */}
      <div className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a]">
        <h3 className="text-lg font-semibold mb-4 axion-gradient bg-clip-text text-transparent">
          Histórico de Pagamentos
        </h3>
        <div className="space-y-3">
          {data.recent_payments.slice(0, 5).map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#27272a] rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="font-medium text-foreground">
                    Pagamento {formatDate(payment.payment_date)}
                  </p>
                </div>
                <p className="text-sm text-foreground/60">
                  Período: {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
                </p>
                <p className="text-sm text-foreground/60">
                  {payment.total_hours}h trabalhadas • {payment.approved_entries.length} apontamentos
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">
                  {formatCurrency(payment.total_amount)}
                </p>
                <p className="text-xs text-green-400">
                  {payment.payment_method || "PIX"}
                </p>
              </div>
            </div>
          ))}
          {data.recent_payments.length === 0 && (
            <p className="text-foreground/60 text-center py-8">
              Nenhum pagamento registrado ainda
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 