"use client";
import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Consultant, CreateConsultantData, UpdateConsultantData } from "@/types/admin";
import { ConsultantService } from "@/lib/adminService";
import CurrencyInput from "@/components/ui/currency-input";

interface ConsultantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  consultant?: Consultant | null;
  mode: 'create' | 'edit';
}

export default function ConsultantFormModal({
  isOpen,
  onClose,
  onSuccess,
  consultant,
  mode
}: ConsultantFormModalProps) {
  const [formData, setFormData] = useState<CreateConsultantData>({
    name: consultant?.name || '',
    email: consultant?.email || '',
    hourly_rate: consultant?.hourly_rate || 0,
    pix_key: consultant?.pix_key || '',
    bank: consultant?.bank || '',
    is_active: consultant?.is_active ?? true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (consultant) {
      setFormData({
        name: consultant.name || '',
        email: consultant.email || '',
        hourly_rate: consultant.hourly_rate || 0,
        pix_key: consultant.pix_key || '',
        bank: consultant.bank || '',
        is_active: consultant.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        hourly_rate: 0,
        pix_key: '',
        bank: '',
        is_active: true,
      });
    }
    setError(null);
  }, [consultant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        await ConsultantService.createConsultant(formData);
      } else if (consultant) {
        const updateData: UpdateConsultantData = {
          id: consultant.id,
          ...formData,
        };
        await ConsultantService.updateConsultant(updateData);
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        hourly_rate: 0,
        pix_key: '',
        bank: '',
        is_active: true,
      });
    } catch (error) {
      console.error('Erro ao salvar consultor:', error);
      setError('Erro ao salvar consultor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateConsultantData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Consultor' : 'Editar Consultor'}
      size="md"
    >
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hourly_rate" className="text-sm font-medium">Valor por Hora *</Label>
                <div className="mt-1">
                  <CurrencyInput
                    id="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={(value) => handleChange('hourly_rate', value)}
                    className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pix_key" className="text-sm font-medium">Chave PIX</Label>
                <Input
                  id="pix_key"
                  type="text"
                  value={formData.pix_key}
                  onChange={(e) => handleChange('pix_key', e.target.value)}
                  className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                  placeholder="CPF, email, telefone ou chave aleatória"
                />
              </div>

              <div>
                <Label htmlFor="bank" className="text-sm font-medium">Banco</Label>
                <Input
                  id="bank"
                  type="text"
                  value={formData.bank}
                  onChange={(e) => handleChange('bank', e.target.value)}
                  className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                  placeholder="Nome do banco"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-[#23232b] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                />
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Consultor ativo
                </Label>
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
                  mode === 'create' ? 'Criar Consultor' : 'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
