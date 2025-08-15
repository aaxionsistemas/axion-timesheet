"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  Users,
  FolderOpen
} from "lucide-react";
// Imports não utilizados comentados
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Client } from "@/types/admin";
import ClientFormModal from "@/components/ClientFormModal";
import { ClientService } from "@/lib/adminService";

// Mock data - será substituído pelo serviço real
const mockClients: Client[] = [
  {
    id: "1",
    name: "Tech Solutions Ltda",
    email: "contato@techsolutions.com.br",
    phone: "11999999999",
    company: "Tech Solutions Ltda",
    contact_person: "Roberto Silva",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "FinanCorp Soluções Financeiras",
    email: "admin@financorp.com.br",
    phone: "11888888888",
    company: "FinanCorp Soluções Financeiras",
    contact_person: "Ana Paula Costa",
    is_active: true,
    created_at: "2024-02-01T14:30:00Z",
    updated_at: "2024-02-01T14:30:00Z",
  },
  {
    id: "3",
    name: "DataX Analytics Ltda",
    email: "contato@datax.com.br",
    phone: "11777777777",
    company: "DataX Analytics Ltda",
    contact_person: "Carlos Mendes",
    is_active: true,
    created_at: "2024-01-01T09:15:00Z",
    updated_at: "2024-01-31T16:00:00Z",
  },
  {
    id: "4",
    name: "StartupX Tecnologia",
    email: "founder@startupx.com.br",
    phone: "11666666666",
    company: "StartupX Tecnologia",
    contact_person: "Marina Oliveira",
    is_active: false,
    created_at: "2023-12-15T11:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar clientes do Supabase
  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await ClientService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      // Em caso de erro, usar dados mock como fallback
      setClients(mockClients);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && client.is_active) ||
                         (filterStatus === "inactive" && !client.is_active);
    
    return matchesSearch && matchesStatus;
  });

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

  const handleCreateClient = () => {
    setSelectedClient(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleSuccess = () => {
    // Recarregar a lista de clientes após criar/editar
    loadClients();
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-blue-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold axion-gradient bg-clip-text text-transparent">
              Gestão de Clientes
            </h2>
          </div>
          
          <button 
            onClick={handleCreateClient}
            className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-h-[44px] sm:min-h-0"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Novo Cliente</span>
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
                  <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <Building className="text-blue-400" size={20} />
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
                    {clients.filter(c => c.is_active).length}
                  </p>
                </div>
                <div className="p-3 bg-green-400/10 rounded-lg">
                  <Users className="text-green-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Com Empresa</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {clients.filter(c => c.company).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <Building className="text-purple-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Com Contato</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {clients.filter(c => c.contact_person).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-400/10 rounded-lg">
                  <Users className="text-orange-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#23232b] border-[#23232b] text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 lg:col-span-1">
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

        {/* Clients Table */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <FolderOpen className="text-blue-400" size={20} />
                <span className="font-medium text-white text-base sm:text-lg">
                  Clientes ({filteredClients.length})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-gray-400 border-b border-[#23232b]">
                    <th className="py-2 px-2 text-left font-normal">Empresa</th>
                    <th className="py-2 px-2 text-left font-normal">Status</th>
                    <th className="py-2 px-2 text-left font-normal">Contato</th>
                    <th className="py-2 px-2 text-left font-normal">Criado em</th>
                    <th className="py-2 px-2 text-center font-normal">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                          Carregando clientes...
                        </div>
                      </td>
                    </tr>
                  ) : filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        Nenhum cliente encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-[#23232b] hover:bg-[#23232b]/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full axion-gradient flex items-center justify-center text-xs font-bold text-white">
                            {(client.company || client.name || '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{client.company || client.name}</p>
                            <p className="text-xs text-gray-400">{client.contact_person}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(client.is_active)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2 text-xs">
                              <Mail size={12} className="text-gray-400" />
                              <span className="text-gray-300">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-xs">
                              <Phone size={12} className="text-gray-400" />
                              <span className="text-gray-300">{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar size={12} className="text-gray-500" />
                          {formatDate(client.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                            className="h-7 w-7 p-0 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit size={14} className="text-blue-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-red-500/50 hover:border-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        client={selectedClient}
        mode={modalMode}
      />
    </main>
  );
}
