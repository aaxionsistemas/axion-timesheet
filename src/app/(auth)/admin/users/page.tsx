"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  // MoreVertical,
  FolderOpen,
  Eye,
  Crown
} from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { User as UserType, UserWithConsultant, UserRole } from "@/types/admin";
import UserFormModal from "@/components/UserFormModal";
import { UserService } from "@/lib/adminService";
import { ToastProvider, useToast } from "@/components/ui/toast-provider";

// Mock data - será substituído pelo serviço real
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "João Nunes",
    email: "joao.nunes@axionsistemas.com",
    role: "master_admin",
    phone: "(11) 99999-9999",
    is_active: true,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Maria Silva",
    email: "maria@axionsistemas.com.br",
    role: "admin",
    phone: "(11) 88888-8888",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Pedro Santos",
    email: "pedro@axionsistemas.com.br",
    role: "consultant",
    phone: "(11) 77777-7777",
    is_active: true,
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@axionsistemas.com.br",
    role: "consultant",
    phone: "(11) 66666-6666",
    is_active: false,
    created_at: "2024-02-01T09:15:00Z",
    updated_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "5",
    name: "Carlos Viewer",
    email: "carlos@cliente.com.br",
    role: "view",
    phone: "(11) 55555-5555",
    is_active: true,
    created_at: "2024-02-10T16:20:00Z",
    updated_at: "2024-02-10T16:20:00Z",
  },
];

function UsersPageContent() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserWithConsultant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithConsultant | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  // const [isLoading, setIsLoading] = useState(true);

  // Carregar usuários do Supabase
  const loadUsers = async () => {
    try {
      // setIsLoading(true);
      const data = await UserService.getUsersWithConsultantInfo();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Em caso de erro, usar dados mock como fallback
      setUsers(mockUsers);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.is_active) ||
                         (filterStatus === "inactive" && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'master_admin':
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Crown size={12} className="mr-1" />
            Master Admin
          </Badge>
        );
      case 'admin':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <Shield size={12} className="mr-1" />
            Admin
          </Badge>
        );
      case 'consultant':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <User size={12} className="mr-1" />
            Consultor
          </Badge>
        );
      case 'view':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <Eye size={12} className="mr-1" />
            Visualização
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <User size={12} className="mr-1" />
            Usuário
          </Badge>
        );
    }
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

  const handleNewUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserWithConsultant) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    // Recarregar dados dos usuários após criação/edição
    loadUsers();
    
    addToast({
      type: 'success',
      title: modalMode === 'create' ? 'Usuário criado!' : 'Usuário atualizado!',
      description: modalMode === 'create' 
        ? 'O usuário foi criado com sucesso.' 
        : 'As informações do usuário foram atualizadas.',
      duration: 4000
    });
  };

  const handleDeleteUser = async (user: UserWithConsultant) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário "${user.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await UserService.deleteUser(user.id);
      
      addToast({
        type: 'success',
        title: 'Usuário deletado!',
        description: `O usuário "${user.name}" foi removido com sucesso.`,
        duration: 4000
      });

      // Recarregar lista
      loadUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      
      addToast({
        type: 'error',
        title: 'Erro ao deletar usuário',
        description: 'Não foi possível deletar o usuário. Tente novamente.',
        duration: 5000
      });
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-blue-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold axion-gradient bg-clip-text text-transparent">
              Gestão de Usuários
            </h2>
          </div>
          
          <button 
            onClick={handleNewUser}
            className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-h-[44px] sm:min-h-0"
          >
            <UserPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Novo Usuário</span>
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
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <Users className="text-blue-400" size={20} />
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
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
                <div className="p-3 bg-green-400/10 rounded-lg">
                  <User className="text-green-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Admins</p>
                  <p className="text-2xl font-bold text-red-400">
                    {users.filter(u => u.role === "admin").length}
                  </p>
                </div>
                <div className="p-3 bg-red-400/10 rounded-lg">
                  <Shield className="text-red-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Consultores</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {users.filter(u => u.role === "consultant").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <User className="text-blue-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#23232b] border-[#23232b] text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 lg:col-span-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
                  className="flex h-10 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600"
                >
                  <option value="all">Todos os Perfis</option>
                  <option value="view">Visualização</option>
                  <option value="consultant">Consultor</option>
                  <option value="admin">Admin</option>
                  <option value="master_admin">Master Admin</option>
                </select>
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

        {/* Users Table */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <FolderOpen className="text-blue-400" size={20} />
                <span className="font-medium text-white text-base sm:text-lg">
                  Usuários ({filteredUsers.length})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-gray-400 border-b border-[#23232b]">
                    <th className="py-2 px-2 text-left font-normal">Usuário</th>
                    <th className="py-2 px-2 text-left font-normal">Perfil</th>
                    <th className="py-2 px-2 text-left font-normal">Status</th>
                    <th className="py-2 px-2 text-left font-normal">Contato</th>
                    <th className="py-2 px-2 text-left font-normal">Criado em</th>
                    <th className="py-2 px-2 text-center font-normal">Ações</th>
                  </tr>
                </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#23232b] hover:bg-[#23232b]/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full axion-gradient flex items-center justify-center font-bold text-white text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-3 px-2">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail size={10} className="text-gray-400" />
                          <span className="text-gray-300">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-xs">
                            <Phone size={10} className="text-gray-400" />
                            <span className="text-gray-300">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={10} />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="h-7 w-7 p-0 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10"
                        >
                          <Edit size={12} className="text-blue-400" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="h-7 w-7 p-0 border-red-500/50 hover:border-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={12} className="text-red-400" />
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

        {/* Modal de Usuário */}
        <UserFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          user={selectedUser}
          mode={modalMode}
        />
      </div>
    </main>
  );
}

export default function UsersPage() {
  return (
    <ToastProvider>
      <UsersPageContent />
    </ToastProvider>
  );
}
