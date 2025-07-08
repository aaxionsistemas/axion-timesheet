"use client";
import React, { useState } from "react";
import { CreateDemandData, DemandStatus, DemandPriority, DemandUser } from "@/types/demands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface DemandFormProps {
  onSubmit: (data: CreateDemandData) => void;
  onCancel: () => void;
  consultants: DemandUser[];
  isLoading?: boolean;
  initialData?: Partial<CreateDemandData>;
}

const statusOptions: { value: DemandStatus; label: string; color: string }[] = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-500" },
  { value: "em_andamento", label: "Em Andamento", color: "bg-blue-500" },
  { value: "aguardando_feedback", label: "Aguardando Feedback", color: "bg-orange-500" },
  { value: "em_revisao", label: "Em Revisão", color: "bg-purple-500" },
  { value: "concluida", label: "Concluída", color: "bg-green-500" },
  { value: "cancelada", label: "Cancelada", color: "bg-red-500" },
];

const priorityOptions: { value: DemandPriority; label: string; color: string }[] = [
  { value: "baixa", label: "Baixa", color: "bg-green-500" },
  { value: "media", label: "Média", color: "bg-yellow-500" },
  { value: "alta", label: "Alta", color: "bg-orange-500" },
  { value: "urgente", label: "Urgente", color: "bg-red-500" },
];

export default function DemandForm({
  onSubmit,
  onCancel,
  consultants,
  isLoading = false,
  initialData
}: DemandFormProps) {
  const [formData, setFormData] = useState<CreateDemandData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    client: initialData?.client || "",
    status: initialData?.status || "pendente",
    priority: initialData?.priority || "media",
    assigned_to: initialData?.assigned_to || "",
    estimated_hours: initialData?.estimated_hours || undefined,
    due_date: initialData?.due_date || "",
    tags: initialData?.tags || [],
  });

  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="title">Título da Demanda *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título da demanda"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Descrição *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva detalhadamente a demanda"
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <Label htmlFor="client">Cliente *</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Nome do cliente"
              required
            />
          </div>

          <div>
            <Label htmlFor="assigned_to">Consultor *</Label>
            <select
              id="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione um consultor</option>
              {consultants.map((consultant) => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as DemandStatus }))}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as DemandPriority }))}
              className="w-full px-3 py-2 bg-[#27272a] border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="estimated_hours">Horas Estimadas</Label>
            <Input
              id="estimated_hours"
              type="number"
              min="0"
              step="0.5"
              value={formData.estimated_hours || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                estimated_hours: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              placeholder="Ex: 8.5"
            />
          </div>

          <div>
            <Label htmlFor="due_date">Data de Entrega</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Adicionar tag"
              />
              <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-xs hover:text-red-400"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar Demanda"}
          </Button>
        </div>
      </form>
    </div>
  );
} 