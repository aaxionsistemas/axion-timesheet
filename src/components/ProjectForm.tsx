

import React, { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomDatePicker from "@/components/ui/datepicker";
import FileUploadArea from "@/components/FileUploadArea";
import CurrencyInput from "@/components/ui/currency-input";
import MultiConsultantSelect from "@/components/ui/multi-consultant-select";
import { CreateProjectData, ProjectStatus, ProjectAttachment, ProjectConsultant } from "@/types/project";
import { CanalService, ConsultantService, ClientService } from "@/lib/adminService";
import { Canal, Consultant, Client } from "@/types/admin";

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
  // Estados para listas do banco
  const [canals, setCanals] = useState<Canal[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateProjectData>({
    canal: "",
    cliente: "",
    descricao: "",
    status: "planejamento",
    produto: "",
    valor_hora_canal: 0,
    valor_hora_consultor: 0,
    consultor: "",
    consultants: [],
    estimated_hours: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    notes: "",
    attachments: [],
  });

  // Atualizar formData quando initialData mudar (para modo de edição)
  useEffect(() => {
    if (initialData) {

      setFormData({
        canal: initialData.canal || "",
        cliente: initialData.cliente || "",
        descricao: initialData.descricao || "",
        status: initialData.status || "planejamento",
        produto: initialData.produto || "",
        valor_hora_canal: initialData.valor_hora_canal || 0,
        valor_hora_consultor: initialData.valor_hora_consultor || 0,
        consultor: initialData.consultor || "",
        consultants: initialData.consultants || [],
        estimated_hours: initialData.estimated_hours || 0,
        start_date: initialData.start_date || new Date().toISOString().split('T')[0],
        end_date: initialData.end_date || "",
        notes: initialData.notes || "",
        attachments: initialData.attachments || [],
      });
    } else {
      // Reset form para modo de criação
      setFormData({
        canal: "",
        cliente: "",
        descricao: "",
        status: "planejamento",
        produto: "",
        valor_hora_canal: 0,
        valor_hora_consultor: 0,
        consultor: "",
        consultants: [],
        estimated_hours: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        notes: "",
        attachments: [],
      });
    }
  }, [initialData]);

  // Carregar dados do banco
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        
        const [canalsData, consultantsData, clientsData] = await Promise.all([
          CanalService.getCanals(),
          ConsultantService.getConsultants(),
          ClientService.getClients()
        ]);

        setCanals(canalsData.filter(canal => canal.is_active));
        setConsultants(consultantsData.filter(consultant => consultant.is_active));
        setClients(clientsData.filter(client => client.is_active));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Função para preencher valor hora automaticamente
  const handleCanalChange = (canalId: string) => {
    const selectedCanal = canals.find(canal => canal.id === canalId);
    if (selectedCanal) {
      setFormData(prev => ({
        ...prev,
        canal: canalId,
        valor_hora_canal: selectedCanal.valor_hora || 0
      }));
    } else {
      handleChange('canal', canalId);
    }
  };

  // const handleConsultorChange = (consultorId: string) => {
  //   const selectedConsultant = consultants.find(consultant => consultant.id === consultorId);
  //   if (selectedConsultant) {
  //     setFormData(prev => ({
  //       ...prev,
  //       consultor: consultorId,
  //       valor_hora_consultor: selectedConsultant.hourly_rate || 0
  //     }));
  //   } else {
  //     handleChange('consultor', consultorId);
  //   }
  // };

  const handleChange = (field: keyof CreateProjectData, value: string | number | ProjectStatus | Date | ProjectAttachment[] | ProjectConsultant[]) => {
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
          <select
            id="canal"
            value={formData.canal}
            onChange={(e) => handleCanalChange(e.target.value)}
            required
            disabled={isLoadingData}
            className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            <option value="">
              {isLoadingData ? "Carregando canais..." : "Selecione um canal"}
            </option>
            {canals.map((canal) => (
              <option key={canal.id} value={canal.id}>
                {canal.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="cliente" className="text-sm font-medium">Cliente *</Label>
          <select
            id="cliente"
            value={formData.cliente}
            onChange={(e) => handleChange("cliente", e.target.value)}
            required
            disabled={isLoadingData}
            className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
          >
            <option value="">
              {isLoadingData ? "Carregando clientes..." : "Selecione um cliente"}
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company || client.name}
              </option>
            ))}
          </select>
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

        <div className="lg:col-span-2">
          <MultiConsultantSelect
            consultants={formData.consultants}
            availableConsultants={consultants}
            onChange={(consultants) => handleChange('consultants', consultants)}
            isLoading={isLoadingData}
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
          <Label htmlFor="valor_hora_canal" className="text-sm font-medium">Valor Hora Canal *</Label>
          <div className="mt-1">
            <CurrencyInput
              id="valor_hora_canal"
              value={formData.valor_hora_canal}
              onChange={(value) => handleChange("valor_hora_canal", value)}
              className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
              placeholder="R$ 0,00"
            />
          </div>
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
