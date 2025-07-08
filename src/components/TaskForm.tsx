import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomDatePicker from '@/components/ui/datepicker';
import { ProjectTask, TaskStatus, TaskPriority } from '@/types/project';

interface TaskFormProps {
  onSubmit: (data: Partial<ProjectTask>) => void;
  initialData?: Partial<ProjectTask>;
  defaultConsultant?: string;
  isLoading?: boolean;
}

const statusLabels: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  em_revisao: 'Em Revisão',
  concluida: 'Concluída',
  cancelada: 'Cancelada'
};

const priorityLabels: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente'
};

// Lista de consultores disponíveis (em um sistema real, viria da API)
const availableConsultants = [
  'Ana Silva',
  'Carlos Santos',
  'Maria Oliveira',
  'João Pedro',
  'Fernanda Costa',
  'Roberto Lima'
];

export default function TaskForm({ onSubmit, initialData, defaultConsultant, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectTask>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pendente',
    priority: initialData?.priority || 'media',
    assigned_to: initialData?.assigned_to || defaultConsultant || '',
    estimated_hours: initialData?.estimated_hours || 0,
    worked_hours: initialData?.worked_hours || 0,
    due_date: initialData?.due_date || '',
  });

  const handleChange = (field: keyof ProjectTask, value: string | number | TaskStatus | TaskPriority) => {
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
        {/* Título */}
        <div className="lg:col-span-2">
          <Label htmlFor="title" className="text-sm font-medium">Título da Task *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Digite o título da task"
            required
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        {/* Descrição */}
        <div className="lg:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descreva a task em detalhes"
            rows={3}
            className="w-full px-3 py-3 bg-[#23232b] border border-[#23232b] text-white text-base rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-600 resize-vertical placeholder:text-gray-400 mt-1"
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
            required
            className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base shadow-sm transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Prioridade */}
        <div>
          <Label htmlFor="priority" className="text-sm font-medium">Prioridade *</Label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
            required
            className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base shadow-sm transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Consultor Responsável */}
        <div>
          <Label htmlFor="assigned_to" className="text-sm font-medium">Consultor Responsável</Label>
          <select
            id="assigned_to"
            value={formData.assigned_to}
            onChange={(e) => handleChange('assigned_to', e.target.value)}
            className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base shadow-sm transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            <option value="">Selecione um consultor</option>
            {availableConsultants.map((consultant) => (
              <option key={consultant} value={consultant}>{consultant}</option>
            ))}
          </select>
        </div>

        {/* Horas Estimadas */}
        <div>
          <Label htmlFor="estimated_hours" className="text-sm font-medium">Horas Estimadas</Label>
          <Input
            id="estimated_hours"
            type="number"
            min="0"
            step="0.5"
            value={formData.estimated_hours}
            onChange={(e) => handleChange('estimated_hours', parseFloat(e.target.value) || 0)}
            placeholder="8"
            className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
          />
        </div>

        {/* Horas Trabalhadas - só mostrar se estiver editando */}
        {initialData && (
          <div>
            <Label htmlFor="worked_hours" className="text-sm font-medium">Horas Trabalhadas</Label>
            <Input
              id="worked_hours"
              type="number"
              min="0"
              step="0.5"
              value={formData.worked_hours}
              onChange={(e) => handleChange('worked_hours', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
            />
          </div>
        )}

        {/* Data de Prazo */}
        <div>
          <Label htmlFor="due_date" className="text-sm font-medium">Data de Prazo</Label>
          <div className="mt-1">
            <CustomDatePicker
              selected={formData.due_date ? new Date(formData.due_date) : null}
              onChange={(date) => handleChange('due_date', date ? date.toISOString().split('T')[0] : '')}
              placeholder="Selecione o prazo"
              minDate={new Date()}
              className="bg-[#23232b] border-[#23232b] text-white"
            />
          </div>
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
            initialData ? "Atualizar Task" : "Criar Task"
          )}
        </button>
      </div>
    </form>
  );
} 