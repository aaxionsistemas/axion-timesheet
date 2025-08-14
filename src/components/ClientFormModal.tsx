"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Client, CreateClientData, UpdateClientData } from "@/types/admin";
import { ClientService } from "@/lib/adminService";
import { Plus, X } from "lucide-react";
import PhoneInput from "@/components/ui/phone-input";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: Client | null;
  mode: 'create' | 'edit';
}

interface ContactPerson {
  name: string;
  email: string;
}

export default function ClientFormModal({
  isOpen,
  onClose,
  onSuccess,
  client,
  mode
}: ClientFormModalProps) {
  const [formData, setFormData] = useState<CreateClientData>({
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    contact_person: client?.contact_person || '',
    is_active: client?.is_active ?? true,
  });
  
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
    { name: client?.contact_person || '', email: client?.email || '' }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Usar o primeiro contato como principal e empresa como nome
      const primaryContact = contactPersons[0];
      
      const dataToSubmit = {
        ...formData,
        name: formData.company || '', // Usar empresa como nome
        contact_person: primaryContact?.name || '',
        email: primaryContact?.email || '',
      };

      if (mode === 'create') {
        // Criar cliente
        const newClient = await ClientService.createClient(dataToSubmit);
        
        // Criar todos os contatos
        for (let i = 0; i < contactPersons.length; i++) {
          const contact = contactPersons[i];
          if (contact.name && contact.email) {
            await ClientService.createClientContact(newClient.id, {
              name: contact.name,
              email: contact.email,
              is_primary: i === 0 // Primeiro contato é o principal
            });
          }
        }
      } else if (client) {
        const updateData: UpdateClientData = {
          id: client.id,
          ...dataToSubmit,
        };
        await ClientService.updateClient(updateData);
        
        // Para edição, você pode implementar lógica para atualizar contatos
        // Por agora, vamos manter simples
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        email: '',
        phone: '',
        company: '',
        contact_person: '',
        is_active: true,
      });
      setContactPersons([{ name: '', email: '' }]);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setError('Erro ao salvar cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateClientData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addContactPerson = () => {
    setContactPersons(prev => [...prev, { name: '', email: '' }]);
  };

  const removeContactPerson = (index: number) => {
    setContactPersons(prev => prev.filter((_, i) => i !== index));
  };

  const updateContactPerson = (index: number, field: 'name' | 'email', value: string) => {
    setContactPersons(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
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
                  <Label htmlFor="company" className="text-sm font-medium">Empresa *</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="bg-[#23232b] border-[#23232b] text-white h-11 text-base mt-1"
                    placeholder="Nome da empresa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                  <div className="mt-1">
                    <PhoneInput
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(value) => handleChange('phone', value)}
                      className="bg-[#23232b] border-[#23232b] text-white h-11 text-base"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Pessoas de Contato *</Label>
                    <button
                      type="button"
                      onClick={addContactPerson}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xs font-medium"
                    >
                      <Plus size={12} />
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {contactPersons.map((contact, index) => (
                      <div key={index} className="p-3 border border-[#2a2a2a] rounded-lg bg-[#1a1a1a] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">
                            Contato {index + 1}
                          </span>
                          {contactPersons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContactPerson(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="text"
                            value={contact.name}
                            onChange={(e) => updateContactPerson(index, 'name', e.target.value)}
                            className="bg-[#23232b] border-[#23232b] text-white h-10 text-sm"
                            placeholder="Nome da pessoa"
                            required={index === 0}
                          />
                          <Input
                            type="email"
                            value={contact.email}
                            onChange={(e) => updateContactPerson(index, 'email', e.target.value)}
                            className="bg-[#23232b] border-[#23232b] text-white h-10 text-sm"
                            placeholder="email@exemplo.com"
                            required={index === 0}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
                    Cliente ativo
                  </Label>
                </div>
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
                  mode === 'create' ? 'Criar Cliente' : 'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
