"use client";
import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { UserWithConsultant, CreateUserData, CreateUserWithConsultantData, UpdateUserData, UserRole } from "@/types/admin";
import { UserService } from "@/lib/adminService";
import CurrencyInput from "@/components/ui/currency-input";
import PhoneInputMasked from "@/components/ui/phone-input-masked";
import PixInput from "@/components/ui/pix-input";
import { useToast } from "@/components/ui/toast-provider";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserWithConsultant | null;
  mode: 'create' | 'edit';
  forceConsultant?: boolean; // Força criação apenas de consultor
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  user,
  mode,
  forceConsultant = false
}: UserFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<CreateUserData & { hourly_rate?: number; pix_key?: string; bank?: string }>({
    name: '',
    email: '',
    role: forceConsultant ? 'consultant' : 'view',
    phone: '',
    // Campos específicos do consultor
    hourly_rate: 0,
    pix_key: '',
    bank: '',
  });

  // Atualizar dados do form quando user muda
  useEffect(() => {
    if (user && mode === 'edit') {
      const consultantData = user.consultant;
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'view',
        phone: user.phone || '',
        // Dados do consultor se existirem
        hourly_rate: consultantData?.hourly_rate || 0,
        pix_key: consultantData?.pix_key || '',
        bank: consultantData?.bank || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: forceConsultant ? 'consultant' : 'view',
        phone: '',
        hourly_rate: 0,
        pix_key: '',
        bank: '',
      });
    }
  }, [user, mode, forceConsultant]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        if (formData.role === 'consultant') {
          // Criar usuário com dados de consultor
          const consultantData: CreateUserWithConsultantData = {
            name: formData.name,
            email: formData.email,
            role: 'consultant',
            phone: formData.phone,
            hourly_rate: formData.hourly_rate || 0,
            pix_key: formData.pix_key,
            bank: formData.bank,
          };
          await UserService.createUserWithConsultant(consultantData);
        } else {
          // Criar usuário normal
          const userData: CreateUserData = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
          };
          await UserService.createUser(userData);
        }
      } else if (user) {
        if (formData.role === 'consultant') {
          // Atualizar usuário consultor
          await UserService.updateUserWithConsultant(
            user.id,
            {
              name: formData.name,
              email: formData.email,
              role: 'consultant',
              phone: formData.phone,
            },
            {
              hourly_rate: formData.hourly_rate || 0,
              pix_key: formData.pix_key,
              bank: formData.bank,
            }
          );
        } else {
          // Atualizar usuário normal
          const updateData: UpdateUserData = {
            id: user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
          };
          await UserService.updateUser(updateData);
        }
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'view',
        phone: '',
        hourly_rate: 0,
        pix_key: '',
        bank: '',
      });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setError('Erro ao salvar usuário. Tente novamente.');
      
      addToast({
        type: 'error',
        title: 'Erro ao salvar usuário',
        description: 'Não foi possível salvar o usuário. Verifique os dados e tente novamente.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
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
                <Label htmlFor="role" className="text-sm font-medium">Perfil *</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-[#23232b] border border-[#23232b] rounded-md text-white h-11 text-base mt-1 focus:border-blue-500 focus:outline-none"
                  required
                  disabled={forceConsultant}
                >
                  {!forceConsultant && <option value="view">Usuário de Visualização</option>}
                  <option value="consultant">Consultor</option>
                  {!forceConsultant && <option value="admin">Administrador</option>}
                  {!forceConsultant && <option value="master_admin">Master Admin</option>}
                </select>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                <div className="mt-1">
                  <PhoneInputMasked
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(value) => handleChange('phone', value)}
                    className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Campos específicos para consultores */}
              {formData.role === 'consultant' && (
                <>
                  <div className="border-t border-[#333] pt-4">
                    <h3 className="text-sm font-medium text-white mb-3">Dados do Consultor</h3>
                  </div>

                  <div>
                    <Label htmlFor="hourly_rate" className="text-sm font-medium">Valor por Hora *</Label>
                    <div className="mt-1">
                      <CurrencyInput
                        id="hourly_rate"
                        value={formData.hourly_rate || 0}
                        onChange={(value) => handleChange('hourly_rate', value)}
                        className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>

                  <div>
                    <PixInput
                      id="pix_key"
                      value={formData.pix_key || ''}
                      onChange={(value) => handleChange('pix_key', value)}
                      className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bank" className="text-sm font-medium">Banco</Label>
                    <Input
                      id="bank"
                      type="text"
                      value={formData.bank || ''}
                      onChange={(e) => handleChange('bank', e.target.value)}
                      className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                      placeholder="Nome do banco"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active_consultant"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-blue-600 bg-[#23232b] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <Label htmlFor="is_active_consultant" className="text-sm font-medium">
                      Consultor ativo
                    </Label>
                  </div>
                </>
              )}
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
                  mode === 'create' ? 
                    (formData.role === 'consultant' ? 'Criar Consultor' : 'Criar Usuário') : 
                    'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}


