import { Project, ProjectStatus, ProjectPriority } from "@/types/project";

export const statusLabels: Record<ProjectStatus, string> = {
  planejamento: "Planejamento",
  em_andamento: "Em Andamento",
  pausado: "Pausado",
  aguardando_cliente: "Aguardando Cliente",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const priorityLabels: Record<ProjectPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export const statusColors: Record<ProjectStatus, string> = {
  planejamento: "bg-blue-500/10 text-blue-400",
  em_andamento: "bg-green-500/10 text-green-400",
  pausado: "bg-yellow-500/10 text-yellow-400",
  aguardando_cliente: "bg-orange-500/10 text-orange-400",
  concluido: "bg-purple-500/10 text-purple-400",
  cancelado: "bg-red-500/10 text-red-400",
};

export const priorityColors: Record<ProjectPriority, string> = {
  baixa: "bg-gray-500/10 text-gray-400",
  media: "bg-yellow-500/10 text-yellow-400",
  alta: "bg-orange-500/10 text-orange-400",
  urgente: "bg-red-500/10 text-red-400",
};

export function calculateProjectProgress(project: Project): number {
  if (!project.estimated_hours || project.estimated_hours === 0) return 0;
  return Math.min(((project.worked_hours || 0) / project.estimated_hours) * 100, 100);
}

export function calculateProjectRevenue(project: Project): number {
  return (project.worked_hours || 0) * project.valor_hora_consultor;
}

export function isProjectAtRisk(project: Project): boolean {
  const progress = calculateProjectProgress(project);
  const now = new Date();
  const endDate = project.end_date ? new Date(project.end_date) : null;
  
  // Projeto em risco se:
  // 1. Horas trabalhadas excedem 90% das estimadas mas não está concluído
  // 2. Data de fim passou e projeto não está concluído
  // 3. Horas trabalhadas excedem 110% das estimadas
  
  if (progress > 110) return true;
  if (endDate && endDate < now && project.status !== "concluido") return true;
  if (progress > 90 && project.status !== "concluido") return true;
  
  return false;
}

export function isProjectEndingSoon(project: Project): boolean {
  if (!project.end_date || project.status === "concluido") return false;
  
  const now = new Date();
  const endDate = new Date(project.end_date);
  const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysUntilEnd <= 7 && daysUntilEnd >= 0;
}

export function getRemainingHours(project: Project): number {
  const estimated = project.estimated_hours || 0;
  const worked = project.worked_hours || 0;
  return Math.max(estimated - worked, 0);
}

export function getEstimatedBudget(project: Project): number {
  const estimated = project.estimated_hours || 0;
  return estimated * project.valor_hora_consultor;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)}h`;
}

export function getDaysUntilDeadline(project: Project): number | null {
  if (!project.end_date) return null;
  
  const now = new Date();
  const endDate = new Date(project.end_date);
  return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateProjectProfit(project: Project): number {
  const workedHours = project.worked_hours || 0;
  const revenue = workedHours * project.valor_hora_canal;
  const cost = workedHours * project.valor_hora_consultor;
  return revenue - cost;
}

export function calculateEstimatedProjectProfit(project: Project): number {
  const estimatedHours = project.estimated_hours || 0;
  const estimatedRevenue = estimatedHours * project.valor_hora_canal;
  const estimatedCost = estimatedHours * project.valor_hora_consultor;
  return estimatedRevenue - estimatedCost;
} 