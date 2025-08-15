"use client";
import React, { useState } from "react";
import { Label } from "./label";
import { Button } from "./button";
import CurrencyInput from "./currency-input";
import { Plus, X } from "lucide-react";
import { ProjectConsultant } from "@/types/project";
import { Consultant } from "@/types/admin";

interface MultiConsultantSelectProps {
  consultants: ProjectConsultant[];
  availableConsultants: Consultant[];
  onChange: (consultants: ProjectConsultant[]) => void;
  isLoading?: boolean;
  className?: string;
}

export default function MultiConsultantSelect({
  consultants,
  availableConsultants,
  onChange,
  isLoading = false,
  className = ""
}: MultiConsultantSelectProps) {

  const [newConsultantId, setNewConsultantId] = useState("");

  const addConsultant = () => {
    if (!newConsultantId) return;
    
    const selectedConsultant = availableConsultants.find(c => c.id === newConsultantId);
    if (!selectedConsultant) return;

    // Verificar se já foi adicionado
    if (consultants.some(c => c.consultant_id === newConsultantId)) {
      return;
    }

    const newProjectConsultant: ProjectConsultant = {
      consultant_id: selectedConsultant.id,
      consultant_name: selectedConsultant.name,
      hourly_rate: selectedConsultant.hourly_rate || 0
    };

    onChange([...consultants, newProjectConsultant]);
    setNewConsultantId("");
  };

  const removeConsultant = (consultantId: string) => {
    onChange(consultants.filter(c => c.consultant_id !== consultantId));
  };

  const updateHourlyRate = (consultantId: string, hourlyRate: number) => {
    onChange(
      consultants.map(c => 
        c.consultant_id === consultantId 
          ? { ...c, hourly_rate: hourlyRate }
          : c
      )
    );
  };

  const getAvailableConsultants = () => {
    const usedIds = consultants.map(c => c.consultant_id);
    return availableConsultants.filter(c => !usedIds.includes(c.id));
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">Consultores *</Label>
      
      {/* Lista de consultores selecionados */}
      <div className="space-y-3 mt-2">
        {consultants.map((consultant, index) => (
          <div key={consultant.consultant_id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                {consultant.consultant_name}
              </p>
            </div>
            
            <div className="w-32">
              <CurrencyInput
                value={consultant.hourly_rate}
                onChange={(value) => updateHourlyRate(consultant.consultant_id, value)}
                className="bg-[#23232b] border-[#23232b] text-white h-8 text-sm"
                placeholder="R$ 0,00"
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeConsultant(consultant.consultant_id)}
              className="h-8 w-8 p-0 border-red-500/50 hover:border-red-500 hover:bg-red-500/10"
            >
              <X size={12} className="text-red-400" />
            </Button>
          </div>
        ))}
      </div>

      {/* Adicionar novo consultor */}
      <div className="flex items-end gap-2 mt-3">
        <div className="flex-1">
          <Label className="text-xs text-gray-400">Adicionar consultor</Label>
          <select
            value={newConsultantId}
            onChange={(e) => setNewConsultantId(e.target.value)}
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            <option value="">
              {isLoading ? "Carregando..." : "Selecione um consultor"}
            </option>
            {getAvailableConsultants().map((consultant) => (
              <option key={consultant.id} value={consultant.id}>
                {consultant.name}
              </option>
            ))}
          </select>
        </div>
        
        <Button
          type="button"
          onClick={addConsultant}
          disabled={!newConsultantId || isLoading}
          className="h-10 px-3 bg-[#23232b] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-gray-600"
        >
          <Plus size={16} />
        </Button>
      </div>

      {consultants.length === 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Adicione pelo menos um consultor ao projeto
        </p>
      )}
    </div>
  );
}
