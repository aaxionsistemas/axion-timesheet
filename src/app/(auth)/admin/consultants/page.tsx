"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserCog, 
  UserPlus, 
  Search, 
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Star,
  // MoreVertical,
  // Briefcase,
  FolderOpen
} from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Consultant } from "@/types/admin";
import ConsultantFormModal from "@/components/ConsultantFormModal";
import UserFormModal from "@/components/UserFormModal";
import { ConsultantService } from "@/lib/adminService";
import { ToastProvider, useToast } from "@/components/ui/toast-provider";

// Mock data - será substituído pelo serviço real
const mockConsultants: Consultant[] = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria@axionsistemas.com.br",
    hourly_rate: 180.00,
    pix_key: "maria@axionsistemas.com.br",
    bank: "Banco do Brasil",
    is_active: true,
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Pedro Costa",
    email: "pedro@axionsistemas.com.br",
    hourly_rate: 200.00,
    pix_key: "11999999999",
    bank: "Itaú",
    is_active: true,
    created_at: "2024-02-01T09:15:00Z",
    updated_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "3",
    name: "Ana Silva",
    email: "ana@axionsistemas.com.br",
    hourly_rate: 150.00,
    pix_key: "ana.silva@pix.com",
    bank: "Nubank",
    is_active: false,
    created_at: "2023-12-15T16:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
];

function ConsultantsPageContent() {
  const { addToast } = useToast();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  // const [isLoading, setIsLoading] = useState(true);
  
  // Estados para o modal de criação de usuário consultor
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Carregar consultores do Supabase
  const loadConsultants = async () => {
    try {
      // setIsLoading(true);
      const data = await ConsultantService.getConsultants();
      setConsultants(data);
    } catch (error) {
      console.error('Erro ao carregar consultores:', error);
      // Em caso de erro, usar dados mock como fallback
      setConsultants(mockConsultants);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConsultants();
  }, []);

  const filteredConsultants = consultants.filter(consultant => {
    // Filtro de busca por nome ou email
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && consultant.is_active) ||
                         (filterStatus === "inactive" && !consultant.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateConsultant = () => {
    // Usar o modal de usuário para criar consultor
    setIsUserModalOpen(true);
  };

  const handleEditConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultant(null);
  };

  const handleDeleteConsultant = async (consultant: Consultant) => {
    if (window.confirm(`Tem certeza que deseja excluir o consultor ${consultant.name}?`)) {
      try {
        await ConsultantService.deleteConsultant(consultant.id);
        // Recarregar a lista após exclusão
        loadConsultants();
      } catch (error) {
        console.error('Erro ao excluir consultor:', error);
        alert('Erro ao excluir consultor. Tente novamente.');
      }
    }
  };

  const handleSuccess = () => {
    // Recarregar a lista de consultores após criar/editar
    loadConsultants();
  };

  const handleUserModalSuccess = () => {
    // Recarregar dados dos consultores após criação de usuário consultor
    loadConsultants();
    
    addToast({
      type: 'success',
      title: 'Consultor criado!',
      description: 'O usuário consultor foi criado com sucesso.',
      duration: 4000
    });
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        Ativo
      </Badge>
    ) : (
      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
        Inativo
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const averageRate = consultants.reduce((sum, c) => sum + c.hourly_rate, 0) / consultants.length;

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-blue-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold axion-gradient bg-clip-text text-transparent">
              Gestão de Consultores
            </h2>
          </div>
          
          <button 
            onClick={handleCreateConsultant}
            className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-h-[44px] sm:min-h-0"
          >
            <UserPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Novo Consultor</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total</p>
                  <p className="text-2xl font-bold text-white">{consultants.length}</p>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <UserCog className="text-blue-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Ativos</p>
                  <p className="text-2xl font-bold text-green-400">
                    {consultants.filter(c => c.is_active).length}
                  </p>
                </div>
                <div className="p-3 bg-green-400/10 rounded-lg">
                  <Star className="text-green-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Valor/Hora Médio</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(averageRate)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-400/10 rounded-lg">
                  <DollarSign className="text-yellow-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Com PIX</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {consultants.filter(c => c.pix_key).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <DollarSign className="text-purple-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Buscar consultores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#23232b] border-[#23232b] text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "active" | "inactive" | "all")}
                  className="flex h-10 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultants Table */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <FolderOpen className="text-blue-400" size={20} />
                <span className="font-medium text-white text-base sm:text-lg">
                  Consultores ({filteredConsultants.length})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-gray-400 border-b border-[#23232b]">
                    <th className="py-2 px-2 text-left font-normal">Consultor</th>
                    <th className="py-2 px-2 text-left font-normal">Valor/Hora</th>
                    <th className="py-2 px-2 text-left font-normal">PIX</th>
                    <th className="py-2 px-2 text-left font-normal">Banco</th>
                    <th className="py-2 px-2 text-left font-normal">Status</th>
                    <th className="py-2 px-2 text-left font-normal">Criado em</th>
                    <th className="py-2 px-2 text-center font-normal">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultants.map((consultant) => (
                    <tr key={consultant.id} className="border-b border-[#23232b] hover:bg-[#23232b]/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full axion-gradient flex items-center justify-center text-xs font-bold text-white">
                            {consultant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{consultant.name}</p>
                            <p className="text-xs text-gray-400">{consultant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2 font-medium text-green-400 text-sm">
                          <DollarSign size={14} />
                          {formatCurrency(consultant.hourly_rate)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-300 text-sm">{consultant.pix_key || 'Não informado'}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-300 text-sm">{consultant.bank || 'Não informado'}</span>
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(consultant.is_active)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar size={12} className="text-gray-500" />
                          {formatDate(consultant.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditConsultant(consultant)}
                            className="h-7 w-7 p-0 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit size={14} className="text-blue-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteConsultant(consultant)}
                            className="h-7 w-7 p-0 border-red-500/50 hover:border-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </Button>
                        </div>
                      </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConsultantFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        consultant={selectedConsultant}
        mode={modalMode}
      />

      {/* Modal de criação de usuário consultor */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        onSuccess={handleUserModalSuccess}
        user={null}
        mode="create"
        forceConsultant={true}
      />
    </main>
  );
}

export default function ConsultantsPage() {
  return (
    <ToastProvider>
      <ConsultantsPageContent />
    </ToastProvider>
  );
}
