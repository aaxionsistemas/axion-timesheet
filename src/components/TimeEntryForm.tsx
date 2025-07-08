"use client";
import React, { useState } from "react";
import { CreateTimeEntryData } from "@/types/demands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeEntryFormProps {
  demandId: string;
  demandTitle: string;
  onSubmit: (data: CreateTimeEntryData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TimeEntryForm({
  demandId,
  demandTitle,
  onSubmit,
  onCancel,
  isLoading = false,
}: TimeEntryFormProps) {
  const [formData, setFormData] = useState<CreateTimeEntryData>({
    demand_id: demandId,
    hours: 0,
    description: "",
    date: new Date().toISOString().split('T')[0], // today's date
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const quickHours = [0.5, 1, 1.5, 2, 4, 8];

  return (
    <div className="p-6">
      <p className="text-sm text-foreground/70 mb-6 truncate">
        <strong>Demanda:</strong> {demandTitle}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Data do Trabalho *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <Label htmlFor="hours">Horas Trabalhadas *</Label>
          <Input
            id="hours"
            type="number"
            min="0.1"
            max="24"
            step="0.1"
            value={formData.hours || ""}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              hours: parseFloat(e.target.value) || 0 
            }))}
            placeholder="Ex: 2.5"
            required
          />
          
          {/* Botões de horas rápidas */}
          <div className="mt-2">
            <p className="text-xs text-foreground/60 mb-2">Valores rápidos:</p>
            <div className="grid grid-cols-3 gap-2">
              {quickHours.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hours }))}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    formData.hours === hours
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-[#27272a] border-border hover:border-primary/50"
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição do Trabalho *</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o que foi realizado..."
            required
            rows={3}
            className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <p className="text-xs text-foreground/60 mt-1">
            Seja específico sobre as atividades realizadas
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || !formData.hours || !formData.description.trim()} size="sm">
            {isLoading ? "Salvando..." : "Apontar Horas"}
          </Button>
        </div>
      </form>
    </div>
  );
} 