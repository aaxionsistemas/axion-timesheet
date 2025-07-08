"use client";
import React from "react";
import { Demand, DemandTimeEntry, UserRole } from "@/types/demands";
import { Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface DemandsStatsProps {
  demands: Demand[];
  timeEntries: DemandTimeEntry[];
  userRole: UserRole;
  userId?: string;
}

export default function DemandsStats({ 
  demands, 
  timeEntries, 
  userRole, 
  userId 
}: DemandsStatsProps) {
  // Filtrar demandas baseado no role
  const relevantDemands = userRole === "admin" 
    ? demands 
    : demands.filter(demand => demand.assigned_to === userId);

  // Calcular estatísticas
  const totalDemands = relevantDemands.length;
  const activeDemands = relevantDemands.filter(d => 
    ["pendente", "em_andamento", "aguardando_feedback", "em_revisao"].includes(d.status)
  ).length;
  const completedDemands = relevantDemands.filter(d => d.status === "concluida").length;
  const overdueDemands = relevantDemands.filter(d => {
    if (!d.due_date || d.status === "concluida" || d.status === "cancelada") return false;
    return new Date(d.due_date) < new Date();
  }).length;

  // Calcular horas
  const totalHours = relevantDemands.reduce((sum, demand) => sum + demand.total_logged_hours, 0);
  const thisWeekEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    return entryDate >= weekStart && (userRole === "admin" || entry.consultant_id === userId);
  });
  const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const stats = [
    {
      title: userRole === "admin" ? "Total de Demandas" : "Minhas Demandas",
      value: totalDemands.toString(),
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: userRole === "admin" ? "demandas no sistema" : "demandas atribuídas",
    },
    {
      title: "Em Andamento",
      value: activeDemands.toString(),
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "demandas ativas",
    },
    {
      title: "Concluídas",
      value: completedDemands.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "demandas finalizadas",
    },
    {
      title: overdueDemands > 0 ? "Atrasadas" : "Total de Horas",
      value: overdueDemands > 0 ? overdueDemands.toString() : `${totalHours.toFixed(1)}h`,
      icon: overdueDemands > 0 ? AlertTriangle : Clock,
      color: overdueDemands > 0 ? "text-red-500" : "text-primary",
      bgColor: overdueDemands > 0 ? "bg-red-500/10" : "bg-primary/10",
      description: overdueDemands > 0 ? "demandas em atraso" : "horas apontadas",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.title === "Atrasadas" && overdueDemands > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                )}
              </div>
              <p className="text-sm font-medium text-foreground/70 truncate">{stat.title}</p>
              <p className="text-xs text-foreground/50 truncate">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Card extra para consultores - horas da semana */}
      {userRole === "consultant" && (
        <div className="bg-[#18181b] rounded-xl p-4 shadow-lg border border-[#27272a] hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10 flex-shrink-0">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-foreground">{thisWeekHours.toFixed(1)}h</p>
              <p className="text-sm font-medium text-foreground/70 truncate">Esta Semana</p>
              <p className="text-xs text-foreground/50 truncate">horas apontadas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 