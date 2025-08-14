"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  User,
  MoreVertical,
  TrendingUp,
  DollarSign,
  FolderOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Canal, CanalType } from "@/types/admin";
import { CanalService } from "@/lib/adminService";
import CanalFormModal from "@/components/CanalFormModal";

export default function CanalsPage() {
  const [canals, setCanals] = useState<Canal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<CanalType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCanal, setSelectedCanal] = useState<Canal | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadCanals();
  }, []);

  const loadCanals = async () => {
    try {
      setIsLoading(true);
      const data = await CanalService.getCanals();
      setCanals(data);
    } catch (error) {
      console.error('Erro ao carregar canais:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCanal = () => {
    setSelectedCanal(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEditCanal = (canal: Canal) => {
    setSelectedCanal(canal);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteCanal = async (canalId: string) => {
    if (confirm('Tem certeza que deseja excluir este canal?')) {
      try {
        await CanalService.deleteCanal(canalId);
        await loadCanals();
      } catch (error) {
        console.error('Erro ao excluir canal:', error);
        alert('Erro ao excluir canal');
      }
    }
  };

  const handleFormSuccess = async () => {
    await loadCanals();
  };

  const filteredCanals = canals.filter(canal => {
    const matchesSearch = canal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         canal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         canal.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || canal.type === filterType;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && canal.is_active) ||
                         (filterStatus === "inactive" && !canal.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: CanalType) => {
    const typeConfig = {
      direto: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Direto" },
      parceiro: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Parceiro" },
      indicacao: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Indicação" },
      marketing: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Marketing" },
    };

    const config = typeConfig[type];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
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

  const averageValorHora = canals.length > 0 ? canals.reduce((sum, c) => sum + c.valor_hora, 0) / canals.length : 0;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <FolderOpen className="text-blue-400" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold axion-gradient bg-clip-text text-transparent">
            Gestão de Canais
          </h2>
        </div>
        
        <button 
          onClick={handleCreateCanal}
          className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-h-[44px] sm:min-h-0"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Novo Canal</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Total</p>
                <p className="text-2xl font-bold text-white">{canals.length}</p>
              </div>
              <Activity className="text-blue-400" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Ativos</p>
                <p className="text-2xl font-bold text-green-400">
                  {canals.filter(c => c.is_active).length}
                </p>
              </div>
              <TrendingUp className="text-green-400" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Parceiros</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {canals.filter(c => c.type === "parceiro").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-400/10 rounded-lg">
                <User className="text-yellow-400" size={20} />
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
                placeholder="Buscar canais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#23232b] border-[#23232b] text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:col-span-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as CanalType | "all")}
                className="flex h-10 w-full rounded-md border border-[#23232b] bg-[#23232b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600"
              >
                <option value="all">Todos os Tipos</option>
                <option value="direto">Direto</option>
                <option value="parceiro">Parceiro</option>
                <option value="indicacao">Indicação</option>
                <option value="marketing">Marketing</option>
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

      {/* Canals Table */}
      <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="text-blue-400" size={20} />
              <span className="font-medium text-white text-base sm:text-lg">
                Canais ({filteredCanals.length})
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-gray-400 border-b border-[#23232b]">
                  <th className="py-2 px-2 text-left font-normal">Canal</th>
                  <th className="py-2 px-2 text-left font-normal">Tipo</th>
                  <th className="py-2 px-2 text-left font-normal">Valor/Hora</th>
                  <th className="py-2 px-2 text-left font-normal">Status</th>
                  <th className="py-2 px-2 text-left font-normal">Contatos</th>
                  <th className="py-2 px-2 text-left font-normal">Datas</th>
                  <th className="py-2 px-2 text-center font-normal">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-foreground/60">Carregando canais...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCanals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="text-foreground/60">
                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Nenhum canal encontrado</p>
                        <p className="text-sm">Crie seu primeiro canal clicando no botão "Novo Canal"</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCanals.map((canal) => (
                    <tr key={canal.id} className="border-b border-[#23232b] hover:bg-[#23232b]/30 transition-colors">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-white text-sm">{canal.name}</p>
                          {canal.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{canal.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {getTypeBadge(canal.type)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1 font-medium text-green-400 text-sm">
                          <DollarSign size={12} />
                          R$ {canal.valor_hora?.toFixed(2) || '0,00'}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(canal.is_active)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-1">
                          {canal.contact_person && (
                            <div className="flex items-center gap-1 text-xs">
                              <User size={10} className="text-gray-400" />
                              <span className="text-gray-300 truncate">{canal.contact_person}</span>
                            </div>
                          )}
                          {canal.contact_emails && canal.contact_emails.length > 0 && (
                            <div className="space-y-1">
                              {canal.contact_emails.slice(0, 1).map((email, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs">
                                  <Mail size={10} className="text-gray-400" />
                                  <span className="text-gray-300 truncate">{email}</span>
                                </div>
                              ))}
                              {canal.contact_emails.length > 1 && (
                                <span className="text-xs text-gray-500">
                                  +{canal.contact_emails.length - 1} mais
                                </span>
                              )}
                            </div>
                          )}
                          {canal.contact_phone && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone size={10} className="text-gray-400" />
                              <span className="text-gray-300">{canal.contact_phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-1 text-xs text-gray-400">
                          {canal.data_apontamento && (
                            <div>Apontamento: {formatDate(canal.data_apontamento)}</div>
                          )}
                          {canal.data_faturamento && (
                            <div>Faturamento: {formatDate(canal.data_faturamento)}</div>
                          )}
                          {canal.data_pagamento && (
                            <div>Pagamento: {formatDate(canal.data_pagamento)}</div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCanal(canal)}
                            className="h-7 w-7 p-0 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10"
                          >
                            <Edit size={12} className="text-blue-400" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCanal(canal.id)}
                            className="h-7 w-7 p-0 border-red-500/50 hover:border-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 size={12} className="text-red-400" />
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

      {/* Modal de Formulário */}
      <CanalFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        canal={selectedCanal}
        mode={formMode}
      />
    </div>
  );
}
