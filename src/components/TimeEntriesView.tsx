"use client";
import React, { useState } from "react";
import { DemandTimeEntry, UserRole } from "@/types/demands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeEntriesViewProps {
  demandTitle: string;
  timeEntries: DemandTimeEntry[];
  userRole: UserRole;
  onClose: () => void;
  onDeleteEntry?: (entryId: string) => void;
  isLoading?: boolean;
}

export default function TimeEntriesView({
  demandTitle,
  timeEntries,
  userRole,
  onClose,
  onDeleteEntry,
  isLoading = false,
}: TimeEntriesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || entry.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Agrupar entradas por data
  const entriesByDate = filteredEntries.reduce((groups, entry) => {
    const date = entry.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, DemandTimeEntry[]>);

  const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#18181b] rounded-xl p-6 shadow-lg max-w-4xl w-full mx-4 max-h-[90vh]">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#27272a] rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-[#27272a] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#18181b] rounded-xl p-6 shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold axion-gradient bg-clip-text text-transparent">
              Apontamentos de Horas
            </h3>
            <p className="text-foreground/70 text-sm mt-1 truncate">
              {demandTitle}
            </p>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            Fechar
          </Button>
        </div>

        {/* Filters and Stats */}
        <div className="bg-[#27272a] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                Buscar na descrição
              </label>
              <Input
                placeholder="Filtrar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                Filtrar por data
              </label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-2xl font-bold text-foreground">
                {totalHours.toFixed(1)}h
              </p>
              <p className="text-sm text-foreground/60">
                Total ({filteredEntries.length} apontamentos)
              </p>
            </div>
          </div>
        </div>

        {/* Time Entries */}
        <div className="flex-1 overflow-y-auto">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                {searchTerm || dateFilter
                  ? "Nenhum apontamento encontrado com os filtros aplicados."
                  : "Nenhum apontamento registrado ainda."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-medium text-foreground">
                      {formatDate(date)}
                    </h4>
                    <p className="text-sm text-foreground/60">
                      {entriesByDate[date].reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)}h
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {entriesByDate[date].map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-[#27272a] rounded-lg p-4 hover:bg-[#2a2a2d] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-primary">
                                {entry.hours}h
                              </span>
                              <span className="text-sm text-foreground/60">
                                {formatTime(entry.created_at)}
                              </span>
                              {userRole === "admin" && entry.consultant_name && (
                                <span className="text-sm text-foreground/60">
                                  por {entry.consultant_name}
                                </span>
                              )}
                            </div>
                            <p className="text-foreground/80 text-sm">
                              {entry.description}
                            </p>
                          </div>
                          
                          {userRole === "admin" && onDeleteEntry && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDeleteEntry(entry.id)}
                              className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                            >
                              Excluir
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredEntries.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {filteredEntries.length}
                </p>
                <p className="text-sm text-foreground/60">Apontamentos</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {totalHours.toFixed(1)}h
                </p>
                <p className="text-sm text-foreground/60">Total de Horas</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {(totalHours / filteredEntries.length).toFixed(1)}h
                </p>
                <p className="text-sm text-foreground/60">Média por Apontamento</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 