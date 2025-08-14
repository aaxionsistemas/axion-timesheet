"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { User, CreateUserData, UpdateUserData, UserRole } from "@/types/admin";
import { UserService } from "@/lib/adminService";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
  mode: 'create' | 'edit';
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  user,
  mode
}: UserFormModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'consultant',
    phone: user?.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        await UserService.createUser(formData);
      } else if (user) {
        const updateData: UpdateUserData = {
          id: user.id,
          ...formData,
        };
        await UserService.updateUser(updateData);
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'consultant',
        phone: '',
      });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setError('Erro ao salvar usuário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateUserData, value: string) => {
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground/80">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-[#27272a] border-[#333] focus:border-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-[#27272a] border-[#333] focus:border-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-foreground/80">Perfil</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value as UserRole)}
              className="w-full px-3 py-2 bg-[#27272a] border border-[#333] rounded-md text-white focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="consultant">Consultor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <Label htmlFor="phone" className="text-foreground/80">Telefone (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="bg-[#27272a] border-[#333] focus:border-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-axion-gradient hover:bg-axion-gradient/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


