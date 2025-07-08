"use client";
import React, { useState } from "react";
import { TimeEntryApproval, ApprovalAction, ApprovalBatch } from "@/types/financial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Search } from "lucide-react";

interface ApprovalsManagerProps {
  approvals: TimeEntryApproval[];
  onApproveEntries: (action: ApprovalAction) => void;
  isLoading?: boolean;
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

export default function ApprovalsManager({
  approvals,
  onApproveEntries,
  isLoading = false
}: ApprovalsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Filtrar aprovações
  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      approval.consultant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.demand_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || approval.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Agrupar por consultor
  const approvalsByConsultant = filteredApprovals.reduce((groups, approval) => {
    const key = approval.consultant_id;
    if (!groups[key]) {
      groups[key] = {
        consultant_id: approval.consultant_id,
        consultant_name: approval.consultant_name,
        period_start: "",
        period_end: "",
        entries: [],
        total_hours: 0,
        total_amount: 0,
      };
    }
    groups[key].entries.push(approval);
    groups[key].total_hours += approval.hours;
    groups[key].total_amount += approval.total_amount;
    return groups;
  }, {} as Record<string, ApprovalBatch>);

  const batches = Object.values(approvalsByConsultant);

  // Handlers
  const handleSelectEntry = (entryId: string) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAll = (entries: TimeEntryApproval[]) => {
    const entryIds = entries.map(e => e.id);
    const allSelected = entryIds.every(id => selectedEntries.includes(id));
    
    if (allSelected) {
      setSelectedEntries(prev => prev.filter(id => !entryIds.includes(id)));
    } else {
      setSelectedEntries(prev => [...new Set([...prev, ...entryIds])]);
    }
  };

  const handleApprove = () => {
    if (selectedEntries.length === 0) return;
    
    onApproveEntries({
      entry_ids: selectedEntries,
      action: "approve"
    });
    
    setSelectedEntries([]);
  };

  const handleReject = () => {
    if (selectedEntries.length === 0) return;
    
    onApproveEntries({
      entry_ids: selectedEntries,
      action: "reject",
      reason: rejectionReason
    });
    
    setSelectedEntries([]);
    setRejectionReason("");
    setShowRejectModal(false);
  };

  const selectedTotal = filteredApprovals
    .filter(a => selectedEntries.includes(a.id))
    .reduce((sum, a) => sum + a.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header e filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold axion-gradient bg-clip-text text-transparent">
          Aprovações de Apontamentos
        </h2>
        
        {selectedEntries.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground/70">
              {selectedEntries.length} selecionados • {formatCurrency(selectedTotal)}
            </span>
            <Button size="sm" onClick={handleApprove} disabled={isLoading}>
              <Check className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowRejectModal(true)}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-1" />
              Rejeitar
            </Button>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-[#18181b] rounded-xl p-4 shadow-lg border border-[#27272a]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-4 h-4" />
            <Input
              placeholder="Buscar por consultor, demanda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
              <option value="paid">Pagos</option>
            </select>
          </div>
          <div className="text-sm text-foreground/70 flex items-center">
            {filteredApprovals.length} apontamentos encontrados
          </div>
        </div>
      </div>

      {/* Lista de aprovações agrupadas por consultor */}
      {batches.length === 0 ? (
        <div className="bg-[#18181b] rounded-xl p-8 shadow-lg border border-[#27272a] text-center">
          <Clock className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <p className="text-foreground/60">
            Nenhum apontamento encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <div 
              key={batch.consultant_id}
              className="bg-[#18181b] rounded-xl p-6 shadow-lg border border-[#27272a]"
            >
              {/* Header do consultor */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={batch.entries.every(e => selectedEntries.includes(e.id))}
                    onChange={() => handleSelectAll(batch.entries)}
                    className="w-4 h-4 text-primary bg-[#27272a] border-border rounded focus:ring-primary"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{batch.consultant_name}</h3>
                    <p className="text-sm text-foreground/60">
                      {batch.entries.length} apontamentos • {batch.total_hours.toFixed(1)}h
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">
                    {formatCurrency(batch.total_amount)}
                  </p>
                  <p className="text-sm text-foreground/60">valor total</p>
                </div>
              </div>

              {/* Lista de apontamentos */}
              <div className="space-y-2">
                {batch.entries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="flex items-center gap-4 p-3 bg-[#27272a] rounded-lg hover:bg-[#2a2a2d] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={() => handleSelectEntry(entry.id)}
                      className="w-4 h-4 text-primary bg-[#18181b] border-border rounded focus:ring-primary"
                    />
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-medium text-foreground text-sm">{entry.demand_title}</p>
                        <p className="text-xs text-foreground/60">{formatDate(entry.date)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-foreground">{entry.hours}h</p>
                        <p className="text-xs text-foreground/60">
                          {formatCurrency(entry.consultant_hourly_rate)}/h
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-foreground line-clamp-2">{entry.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={statusColors[entry.status]}>
                          {statusLabels[entry.status]}
                        </Badge>
                        <p className="font-semibold text-foreground">
                          {formatCurrency(entry.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de rejeição */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-xl p-6 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Rejeitar Apontamentos
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              Informe o motivo da rejeição para {selectedEntries.length} apontamento(s).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Motivo da rejeição..."
              rows={3}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowRejectModal(false)}
                size="sm"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isLoading}
                size="sm"
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 