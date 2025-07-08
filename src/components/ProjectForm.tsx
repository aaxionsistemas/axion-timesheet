

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomDatePicker from "@/components/ui/datepicker";
import FileUploadArea from "@/components/FileUploadArea";
import { CreateProjectData, ProjectStatus, ProjectAttachment } from "@/types/project";

const statusLabels: Record<ProjectStatus, string> = {
  planejamento: "Planejamento",
  em_andamento: "Em Andamento",
  pausado: "Pausado",
  aguardando_cliente: "Aguardando Cliente",
  concluido: "Concluído",
  cancelado: "Cancelado"
};

interface ProjectFormProps {
  onSubmit: (data: CreateProjectData) => void;
  initialData?: Partial<CreateProjectData>;
  isLoading?: boolean;
}

export default function ProjectForm({ onSubmit, initialData, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    canal: initialData?.canal || "",
    cliente: initialData?.cliente || "",
    descricao: initialData?.descricao || "",
    status: initialData?.status || "planejamento",
    produto: initialData?.produto || "",
    valor_hora_canal: initialData?.valor_hora_canal || 0,
    valor_hora_consultor: initialData?.valor_hora_consultor || 0,
    consultor: initialData?.consultor || "",
    estimated_hours: initialData?.estimated_hours || 0,
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date || "",
    notes: initialData?.notes || "",
    attachments: initialData?.attachments || [],
  });

  const handleChange = (field: keyof CreateProjectData, value: string | number | ProjectStatus | Date | ProjectAttachment[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label htmlFor="canal" className="text-sm font-medium">Canal *</Label>
          <Input
            id="canal"
            value={formData.canal}
            onChange={(e) => handleChange("canal", e.target.value)}
            placeholder="Digite o canal"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div>
          <Label htmlFor="cliente" className="text-sm font-medium">Cliente *</Label>
          <Input
            id="cliente"
            value={formData.cliente}
            onChange={(e) => handleChange("cliente", e.target.value)}
            placeholder="Nome do cliente"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="descricao" className="text-sm font-medium">Descrição</Label>
          <textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            placeholder="Descrição do projeto"
            rows={3}
            className="w-full px-3 py-3 bg-[#23232b] border border-[#23232b] text-white text-base rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-600 resize-vertical placeholder:text-gray-400 mt-1"
          />
        </div>

        <div>
          <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value as ProjectStatus)}
            required
            className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base shadow-sm transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="produto" className="text-sm font-medium">Produto *</Label>
          <Input
            id="produto"
            value={formData.produto}
            onChange={(e) => handleChange("produto", e.target.value)}
            placeholder="Nome do produto"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div>
          <Label htmlFor="valor_hora_canal" className="text-sm font-medium">Valor Hora Canal (R$) *</Label>
          <Input
            id="valor_hora_canal"
            type="number"
            min="0"
            step="0.01"
            value={formData.valor_hora_canal}
            onChange={(e) => handleChange("valor_hora_canal", parseFloat(e.target.value) || 0)}
            placeholder="150.00"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div>
          <Label htmlFor="valor_hora_consultor" className="text-sm font-medium">Valor Hora Consultor (R$) *</Label>
          <Input
            id="valor_hora_consultor"
            type="number"
            min="0"
            step="0.01"
            value={formData.valor_hora_consultor}
            onChange={(e) => handleChange("valor_hora_consultor", parseFloat(e.target.value) || 0)}
            placeholder="120.00"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div>
          <Label htmlFor="consultor" className="text-sm font-medium">Consultor *</Label>
          <Input
            id="consultor"
            value={formData.consultor}
            onChange={(e) => handleChange("consultor", e.target.value)}
            placeholder="Nome do consultor"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div>
          <Label htmlFor="estimated_hours" className="text-sm font-medium">Horas Estimadas</Label>
          <Input
            id="estimated_hours"
            type="number"
            min="0"
            step="0.5"
            value={formData.estimated_hours}
            onChange={(e) => handleChange("estimated_hours", parseFloat(e.target.value) || 0)}
            placeholder="40"
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        <div>
          <Label htmlFor="start_date" className="text-sm font-medium">Data de Início</Label>
          <div className="mt-1">
            <CustomDatePicker
              selected={formData.start_date ? new Date(formData.start_date) : null}
              onChange={(date) => handleChange("start_date", date ? date.toISOString().split('T')[0] : "")}
              placeholder="Selecione a data de início"
              className="bg-[#23232b] border-[#23232b] text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="end_date" className="text-sm font-medium">Data de Fim</Label>
          <div className="mt-1">
            <CustomDatePicker
              selected={formData.end_date ? new Date(formData.end_date) : null}
              onChange={(date) => handleChange("end_date", date ? date.toISOString().split('T')[0] : "")}
              placeholder="Selecione a data de fim"
              minDate={formData.start_date ? new Date(formData.start_date) : undefined}
              className="bg-[#23232b] border-[#23232b] text-white"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notas</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Notas adicionais sobre o projeto"
            rows={3}
            className="w-full px-3 py-3 bg-[#23232b] border border-[#23232b] text-white text-base rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-600 resize-vertical placeholder:text-gray-400 mt-1"
          />
        </div>

        {/* Seção de Anexos */}
        <div className="lg:col-span-2">
          <FileUploadArea 
            attachments={formData.attachments || []}
            onAttachmentsChange={(attachments) => handleChange("attachments", attachments)}
            compact={true}
            showTitle={true}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-[#23232b] mt-6">
        <button 
          type="submit" 
          disabled={isLoading} 
          className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-6 py-3 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#23232b] touch-manipulation min-h-[44px] sm:min-h-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Salvando...
            </>
          ) : (
            "Salvar Projeto"
          )}
        </button>
      </div>
    </form>
  );
}
