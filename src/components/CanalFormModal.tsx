"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Canal, CreateCanalData, UpdateCanalData, CanalType } from "@/types/admin";
import { CanalService } from "@/lib/adminService";
import { Plus, X } from "lucide-react";
import CurrencyInput from "@/components/ui/currency-input";
import PhoneInput from "@/components/ui/phone-input";
import DayInput from "@/components/ui/day-input";

interface CanalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  canal?: Canal | null;
  mode: 'create' | 'edit';
}

export default function CanalFormModal({
  isOpen,
  onClose,
  onSuccess,
  canal,
  mode
}: CanalFormModalProps) {
  const [formData, setFormData] = useState<CreateCanalData>({
    name: '',
    description: '',
    type: 'direto',
    contact_person: '',
    contact_emails: [''],
    contact_phone: '',
    data_apontamento: '',
    data_faturamento: '',
    data_pagamento: '',
    valor_hora: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar formData quando o canal mudar (para modo de edição)
  useEffect(() => {
    if (canal) {

      setFormData({
        name: canal.name || '',
        description: canal.description || '',
        type: canal.type || 'direto',
        contact_person: canal.contact_person || '',
        contact_emails: canal.contact_emails || [''],
        contact_phone: canal.contact_phone || '',
        data_apontamento: canal.data_apontamento ? canal.data_apontamento.toString() : '',
        data_faturamento: canal.data_faturamento ? canal.data_faturamento.toString() : '',
        data_pagamento: canal.data_pagamento ? canal.data_pagamento.toString() : '',
        valor_hora: canal.valor_hora || 0,
      });
    } else {
      // Reset form para modo de criação
      setFormData({
        name: '',
        description: '',
        type: 'direto',
        contact_person: '',
        contact_emails: [''],
        contact_phone: '',
        data_apontamento: '',
        data_faturamento: '',
        data_pagamento: '',
        valor_hora: 0,
      });
    }
  }, [canal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Filtrar emails vazios
      const filteredEmails = formData.contact_emails.filter(email => email.trim() !== '');
      
      const dataToSubmit = {
        ...formData,
        contact_emails: filteredEmails,
      };

      if (mode === 'create') {

        await CanalService.createCanal(dataToSubmit);
      } else if (canal) {
        const updateData: UpdateCanalData = {
          id: canal.id,
          ...dataToSubmit,
        };

        await CanalService.updateCanal(updateData);
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'direto',
        contact_person: '',
        contact_emails: [''],
        contact_phone: '',
        data_apontamento: '',
        data_faturamento: '',
        data_pagamento: '',
        valor_hora: 0,
      });
    } catch (error) {
      console.error('Erro ao salvar canal:', error);
      setError('Erro ao salvar canal. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateCanalData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      contact_emails: [...prev.contact_emails, '']
    }));
  };

  const removeEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contact_emails: prev.contact_emails.filter((_, i) => i !== index)
    }));
  };

  const updateEmail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_emails: prev.contact_emails.map((email, i) => i === index ? value : email)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Canal' : 'Editar Canal'}
      size="lg"
    >
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Nome do Canal *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                placeholder="Digite o nome do canal"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium">Tipo do Canal *</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as CanalType)}
                className="flex h-11 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-base shadow-sm transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 mt-1"
                required
              >
                <option value="direto">Direto</option>
                <option value="parceiro">Parceiro</option>
                <option value="indicacao">Indicação</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            <div>
              <Label htmlFor="contact_person" className="text-sm font-medium">Pessoa de Contato</Label>
              <Input
                id="contact_person"
                type="text"
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                placeholder="Nome do contato"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone" className="text-sm font-medium">Telefone</Label>
              <div className="mt-1">
                <PhoneInput
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(value) => handleChange('contact_phone', value)}
                  className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>



            <div>
              <Label htmlFor="valor_hora" className="text-sm font-medium">Valor por Hora *</Label>
              <div className="mt-1">
                <CurrencyInput
                  id="valor_hora"
                  value={formData.valor_hora}
                  onChange={(value) => handleChange('valor_hora', value)}
                  className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-3 bg-[#23232b] border border-[#23232b] text-white text-base rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-600 resize-vertical placeholder:text-gray-400 mt-1"
                rows={3}
                placeholder="Descrição do canal..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Emails de Contato</Label>
                <button
                  type="button"
                  onClick={addEmail}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xs font-medium"
                >
                  <Plus size={12} />
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.contact_emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                      placeholder="email@exemplo.com"
                    />
                    {formData.contact_emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="flex items-center justify-center bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-2 py-2 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-11"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DayInput
              id="data_apontamento"
              label="Dia do Apontamento"
              value={formData.data_apontamento}
              onChange={(value) => handleChange('data_apontamento', value)}
              className="bg-[#23232b] border-[#23232b] text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-600"
            />

            <DayInput
              id="data_faturamento"
              label="Dia do Faturamento"
              value={formData.data_faturamento}
              onChange={(value) => handleChange('data_faturamento', value)}
              className="bg-[#23232b] border-[#23232b] text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-600"
            />

            <DayInput
              id="data_pagamento"
              label="Dia do Pagamento"
              value={formData.data_pagamento}
              onChange={(value) => handleChange('data_pagamento', value)}
              className="bg-[#23232b] border-[#23232b] text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-600"
            />
          </div>
        </div>

          </div>
          <div className="flex-shrink-0 p-6 border-t border-[#333] bg-[#18181b]">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-6 py-3 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#23232b] touch-manipulation min-h-[44px] sm:min-h-0 w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-6 py-3 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#23232b] touch-manipulation min-h-[44px] sm:min-h-0 w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  mode === 'create' ? 'Criar Canal' : 'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
