"use client";
import React, { useState } from "react";
import { Demand, UserRole } from "@/types/demands";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DemandsListProps {
  demands: Demand[];
  userRole: UserRole;
  onCreateDemand?: () => void;
  onEditDemand?: (demand: Demand) => void;
  onAddTimeEntry?: (demandId: string) => void;
  onViewTimeEntries?: (demandId: string) => void;
  isLoading?: boolean;
}

const statusColors = {
  pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  em_andamento: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  aguardando_feedback: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  em_revisao: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  concluida: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelada: "bg-red-500/10 text-red-500 border-red-500/20",
};

const priorityColors = {
  baixa: "bg-green-500/10 text-green-500 border-green-500/20",
  media: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  alta: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgente: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels = {
  pendente: "Pendente",
  em_andamento: "Em Andamento",
  aguardando_feedback: "Aguardando Feedback",
  em_revisao: "Em Revisão",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export default function DemandsList({
  demands,
  userRole,
  onCreateDemand,
  onEditDemand,
  onAddTimeEntry,
  onViewTimeEntries,
  isLoading = false,
}: DemandsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = 
      demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || demand.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || demand.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definida";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !["concluida", "cancelada"].includes(statusFilter);
  };

  if (isLoading) {
    return (
      <div className="bg-[#18181b] rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#27272a] rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[#27272a] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold axion-gradient bg-clip-text text-transparent">
          {userRole === "admin" ? "Gerenciar Demandas" : "Minhas Demandas"}
        </h2>
        {userRole === "admin" && onCreateDemand && (
          <Button onClick={onCreateDemand}>
            Nova Demanda
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[#18181b] rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Buscar demandas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos os status</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas as prioridades</option>
              {Object.entries(priorityLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-foreground/70 flex items-center">
            {filteredDemands.length} de {demands.length} demandas
          </div>
        </div>
      </div>

      {/* Demands List */}
      {filteredDemands.length === 0 ? (
        <div className="bg-[#18181b] rounded-xl p-8 shadow-lg text-center">
          <p className="text-foreground/60">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Nenhuma demanda encontrada com os filtros aplicados."
              : userRole === "admin"
              ? "Nenhuma demanda criada ainda. Crie a primeira demanda!"
              : "Nenhuma demanda atribuída para você ainda."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDemands.map((demand) => (
            <div
              key={demand.id}
              className={`bg-[#18181b] rounded-xl p-4 shadow-lg border transition-all hover:shadow-xl ${
                isOverdue(demand.due_date) ? "border-red-500/30" : "border-transparent"
              }`}
            >
              {/* Header com título e badges */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-foreground line-clamp-2 flex-1">
                  {demand.title}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <Badge className={`${statusColors[demand.status]} text-xs px-2 py-1`}>
                    {statusLabels[demand.status]}
                  </Badge>
                </div>
              </div>

              {/* Prioridade e cliente */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge className={`${priorityColors[demand.priority]} text-xs`}>
                  {priorityLabels[demand.priority]}
                </Badge>
                <span className="text-xs text-foreground/60 truncate">
                  {demand.client}
                </span>
              </div>

              {/* Descrição */}
              <p className="text-foreground/70 text-xs line-clamp-2 mb-3">
                {demand.description}
              </p>

              {/* Informações principais */}
              <div className="space-y-2 mb-3">
                {userRole === "admin" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/60">Consultor:</span>
                    <span className="text-foreground truncate ml-2">
                      {demand.assigned_to_name || "Não atribuído"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Entrega:</span>
                  <span className={`${isOverdue(demand.due_date) ? "text-red-400" : "text-foreground"} ml-2`}>
                    {formatDate(demand.due_date)}
                    {isOverdue(demand.due_date) && " ⚠️"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Horas:</span>
                  <span className="text-foreground ml-2">
                    {demand.total_logged_hours}h
                    {demand.estimated_hours && ` / ${demand.estimated_hours}h`}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {demand.tags && demand.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {demand.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                  {demand.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{demand.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {userRole === "consultant" && onAddTimeEntry && (
                  <Button
                    size="sm"
                    onClick={() => onAddTimeEntry(demand.id)}
                    disabled={demand.status === "concluida" || demand.status === "cancelada"}
                    className="flex-1 text-xs"
                  >
                    Apontar
                  </Button>
                )}
                
                {onViewTimeEntries && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewTimeEntries(demand.id)}
                    className="flex-1 text-xs"
                  >
                    Ver Horas
                  </Button>
                )}
                
                {userRole === "admin" && onEditDemand && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditDemand(demand)}
                    className="flex-1 text-xs"
                  >
                    Editar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 