

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, 
  User, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Search,
  TrendingUp,
  Paperclip,
  DollarSign
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectFilters } from "@/types/project";
import { 
  statusLabels, 
  statusColors,
  formatCurrency
} from "@/lib/projectUtils";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAttachment?: (project: Project) => void;
  isLoading?: boolean;
}

const renderConsultants = (project: Project, maxVisible: number = 2) => {
  // Usar o novo array de consultants se existir, senão usar o campo antigo
  const consultants = project.consultants?.length > 0 
    ? project.consultants 
    : project.consultor 
      ? [{ consultant_id: '', consultant_name: project.consultor, hourly_rate: project.valor_hora_consultor }]
      : [];

  if (consultants.length === 0) {
    return <span className="text-gray-400 text-sm">Nenhum consultor</span>;
  }

  const visible = consultants.slice(0, maxVisible);
  const remaining = consultants.length - maxVisible;

  return (
    <div className="space-y-1">
      {visible.map((consultant, index) => (
        <div key={`${consultant.consultant_id}-${index}`} className="text-white text-sm">
          {consultant.consultant_name}
        </div>
      ))}
      {remaining > 0 && (
        <div className="text-gray-400 text-xs">
          +{remaining} mais
        </div>
      )}
    </div>
  );
};

const getConsultantHourlyRates = (project: Project) => {
  // Usar o novo array de consultants se existir, senão usar o campo antigo
  const consultants = project.consultants?.length > 0 
    ? project.consultants 
    : project.consultor 
      ? [{ consultant_id: '', consultant_name: project.consultor, hourly_rate: project.valor_hora_consultor }]
      : [];

  if (consultants.length === 0) {
    return { min: 0, max: 0, display: formatCurrency(0) };
  }

  const rates = consultants.map(c => c.hourly_rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);

  // Se todos têm o mesmo valor, mostrar apenas um
  if (min === max) {
    return { min, max, display: formatCurrency(max) };
  }

  // Se valores diferentes, mostrar formato "menor / maior"
  return { min, max, display: `${formatCurrency(min)} / ${formatCurrency(max)}` };
};

export default function ProjectList({ projects, onEdit, onDelete, onAttachment, isLoading }: ProjectListProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredProjects = projects.filter(project => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!(project.canal_name || project.canal).toLowerCase().includes(search) && 
          !(project.cliente_name || project.cliente).toLowerCase().includes(search) &&
          !project.produto.toLowerCase().includes(search) &&
          !project.consultor.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(project.status)) return false;
    }
    
    return true;
  });

  const handleFilterChange = (key: keyof ProjectFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  if (isLoading) {
    return (
      <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-[#23232b] rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-[#23232b] rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-blue-400" size={20} />
            <span className="font-medium text-white text-base sm:text-lg">
              Projetos ({filteredProjects.length})
            </span>
          </div>
          
          {/* Botões de visualização - apenas em desktop */}
          <div className="hidden md:flex items-center bg-[#23232b] rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 touch-manipulation ${
                viewMode === 'table' 
                  ? 'bg-[#18181b] text-white border border-gray-600' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Tabela
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 touch-manipulation ${
                viewMode === 'cards' 
                  ? 'bg-[#18181b] text-white border border-gray-600' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Filtros responsivos */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar projetos..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 h-11 bg-[#23232b] border-[#23232b] text-white rounded-xl focus:ring-blue-400 text-base"
            />
          </div>
          
          <select
            value={filters.status?.[0] || ''}
            onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value] : [])}
            className="h-11 px-3 bg-[#23232b] border border-[#23232b] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-base"
          >
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <button
            onClick={() => setFilters({})}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] h-11 px-4 rounded-xl transition-all duration-300 text-sm font-medium touch-manipulation"
          >
            <Filter size={16} />
            <span>Limpar</span>
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">Nenhum projeto encontrado</p>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
            {viewMode === 'table' && (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#23232b]">
                                             <th className="py-3 px-4 text-left font-medium">Canal</th>
                       <th className="py-3 px-4 text-left font-medium">Cliente</th>
                       <th className="py-3 px-4 text-left font-medium">Descrição</th>
                       <th className="py-3 px-4 text-left font-medium">Status</th>
                       <th className="py-3 px-4 text-left font-medium">Produto</th>
                       <th className="py-3 px-4 text-left font-medium">Valor Hora Canal</th>
                       <th className="py-3 px-4 text-left font-medium">Valor Hora Consultor</th>
                       <th className="py-3 px-4 text-left font-medium">Consultores</th>
                       <th className="py-3 px-4 text-left font-medium">Anexos</th>
                       <th className="py-3 px-4 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b border-[#23232b] hover:bg-[#23232b]/60 transition-all">
                        <td className="py-3 px-4">
                                                     <div className="flex items-center gap-2">
                             <FolderOpen className="text-blue-400" size={16} />
                             <span className="font-medium text-white">{project.canal_name || project.canal}</span>
                           </div>
                        </td>
                        
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-blue-400" />
                            <span className="text-white">{project.cliente_name || project.cliente}</span>
                          </div>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className="text-gray-300 text-sm">
                            {project.descricao ? 
                              (project.descricao.length > 50 ? 
                                `${project.descricao.substring(0, 50)}...` : 
                                project.descricao
                              ) : 
                              '-'
                            }
                          </span>
                        </td>
                        
                        <td className="py-3 px-4">
                          <Badge className={statusColors[project.status]}>
                            {statusLabels[project.status]}
                          </Badge>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className="text-white">{project.produto}</span>
                        </td>
                        
                                                 <td className="py-3 px-4">
                           <div className="flex items-center gap-1">
                             <DollarSign size={14} className="text-green-400" />
                             <span className="text-white">{formatCurrency(project.valor_hora_canal)}</span>
                           </div>
                         </td>
                         
                         <td className="py-3 px-4">
                           <div className="flex items-center gap-1">
                             <TrendingUp size={14} className="text-green-400" />
                             <span className="text-white">{getConsultantHourlyRates(project).display}</span>
                           </div>
                         </td>
                         
                         <td className="py-3 px-4">
                           {renderConsultants(project, 3)}
                         </td>
                        
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onAttachment?.(project)}
                            className="flex items-center gap-1 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300"
                            title="Gerenciar anexos"
                          >
                            <Paperclip size={16} />
                            {project.attachments && project.attachments.length > 0 && (
                              <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                                {project.attachments.length}
                              </span>
                            )}
                          </button>
                        </td>
                        
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleProjectClick(project)}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 rounded-lg transition-all duration-300"
                              title="Ver detalhes do projeto"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => onEdit(project)}
                              className="p-2 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 rounded-lg transition-all duration-300"
                              title="Editar projeto"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(project.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-300"
                              title="Excluir projeto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cards Mobile (sempre visível no mobile, ou quando modo cards está ativo) */}
            <div className={`${viewMode === 'table' ? 'md:hidden' : ''} grid grid-cols-1 ${viewMode === 'cards' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-3 sm:gap-4`}>
              {filteredProjects.map((project) => (
                <Card key={project.id} className="bg-[#23232b] border border-[#2a2a2a] hover:border-blue-500/50 transition-all">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header do card */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FolderOpen className="text-blue-400 flex-shrink-0" size={16} />
                                                     <div className="min-w-0 flex-1">
                             <h3 className="font-medium text-white text-sm truncate">{project.canal_name || project.canal}</h3>
                             <p className="text-xs text-gray-400 truncate">{project.cliente_name || project.cliente}</p>
                           </div>
                        </div>
                        <Badge className={`${statusColors[project.status]} text-xs flex-shrink-0`}>
                          {statusLabels[project.status]}
                        </Badge>
                      </div>

                      {/* Produto e Consultor */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Produto:</span>
                          <span className="text-white font-medium truncate ml-2">{project.produto}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 text-sm">Consultores:</span>
                          {renderConsultants(project, 2)}
                        </div>
                      </div>

                                             {/* Valores */}
                       <div className="grid grid-cols-2 gap-3 text-sm">
                         <div>
                           <div className="text-gray-400 text-xs">Valor/h Canal</div>
                           <div className="text-green-400 font-medium">{formatCurrency(project.valor_hora_canal)}</div>
                         </div>
                         <div>
                           <div className="text-gray-400 text-xs">Valor/h Consultor</div>
                           <div className="text-green-400 font-medium">{getConsultantHourlyRates(project).display}</div>
                         </div>
                       </div>

                      {/* Progresso */}
                      {project.estimated_hours && project.worked_hours && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Progresso</span>
                            <span className="text-gray-300">
                              {project.worked_hours}h / {project.estimated_hours}h
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ 
                                width: `${Math.min((project.worked_hours / project.estimated_hours) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Descrição */}
                      {project.descricao && (
                        <div className="text-xs text-gray-400">
                          {project.descricao.length > 120 ? 
                            `${project.descricao.substring(0, 120)}...` : 
                            project.descricao
                          }
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
                        <button
                          onClick={() => onAttachment?.(project)}
                          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 px-3 py-2.5 rounded-lg transition-all duration-300 touch-manipulation"
                          title="Anexos"
                        >
                          <Paperclip size={14} />
                          {project.attachments && project.attachments.length > 0 && (
                            <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                              {project.attachments.length}
                            </span>
                          )}
                        </button>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProjectClick(project)}
                            className="p-2.5 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 rounded-lg transition-all duration-300 touch-manipulation"
                            title="Ver detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => onEdit(project)}
                            className="p-2.5 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 rounded-lg transition-all duration-300 touch-manipulation"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(project.id)}
                            className="p-2.5 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-300 touch-manipulation"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
