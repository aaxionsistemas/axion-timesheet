'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  FolderOpen,
  CheckSquare,
  Paperclip,
  Info,
  Calendar,
  User,
  DollarSign,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import ProjectTasks from '@/components/ProjectTasks';
import AttachmentModal from '@/components/AttachmentModal';
import { Project, ProjectAttachment } from '@/types/project';
import { statusLabels, statusColors, formatCurrency } from '@/lib/projectUtils';

// Mock data - substitua pela busca real do projeto
const mockProject: Project = {
  id: 'proj_001',
  canal: 'Telemedicina',
  cliente: 'Hospital São Lucas',
  descricao: 'Desenvolvimento de plataforma completa de telemedicina com agendamento, consultas online e prontuário eletrônico.',
  status: 'em_andamento',
  produto: 'Sistema Web + Mobile',
  valor_hora_canal: 180.00,
  valor_hora_consultor: 120.00,
  consultor: 'Ana Silva',
  estimated_hours: 120,
  worked_hours: 45,
  start_date: '2024-01-15',
  end_date: '2024-04-30',
  created_at: '2024-01-10T10:00:00Z',
  updated_at: '2024-01-20T14:30:00Z',
  notes: 'Projeto crítico com deadline apertado. Cliente muito engajado e responsivo.',
  attachments: [
    {
      id: 'att_001',
      project_id: 'proj_001',
      name: 'Briefing_Telemedicina.pdf',
      file_url: '/uploads/briefing.pdf',
      file_size: 2547896,
      mime_type: 'application/pdf',
      uploaded_at: '2024-01-10T10:00:00Z'
    }
  ]
};

type TabType = 'overview' | 'tasks' | 'attachments';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project] = useState<Project>(mockProject);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Info },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'attachments', label: 'Anexos', icon: Paperclip }
  ];

  const progressPercentage = project.estimated_hours 
    ? Math.min((project.worked_hours || 0) / project.estimated_hours * 100, 100)
    : 0;

  const revenue = (project.worked_hours || 0) * project.valor_hora_canal;
  const cost = (project.worked_hours || 0) * project.valor_hora_consultor;
  const profit = revenue - cost;

  const handleUpdateAttachments = (attachments: ProjectAttachment[]) => {
    // Atualizar anexos do projeto
    console.log('Anexos atualizados:', attachments);
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#23232b] rounded-lg transition-all duration-300 w-fit"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FolderOpen className="text-blue-400 flex-shrink-0" size={20} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{project.cliente}</h1>
            <p className="text-sm sm:text-base text-gray-400 truncate">{project.canal} • {project.produto}</p>
          </div>
        </div>
        
        <Badge className={`${statusColors[project.status]} flex-shrink-0 text-xs sm:text-sm`}>
          {statusLabels[project.status]}
        </Badge>
      </div>

      {/* Tabs Responsivas */}
      <div className="border-b border-[#23232b] mb-4 sm:mb-6">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 py-3 px-2 sm:px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Progresso</p>
                    <p className="text-2xl font-bold text-white">{progressPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">{project.worked_hours}h / {project.estimated_hours}h</p>
                  </div>
                  <BarChart3 className="text-blue-400" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Receita</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(revenue)}</p>
                    <p className="text-xs text-gray-500">R$ {project.valor_hora_canal}/h</p>
                  </div>
                  <DollarSign className="text-green-400" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Custo</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(cost)}</p>
                    <p className="text-xs text-gray-500">R$ {project.valor_hora_consultor}/h</p>
                  </div>
                  <TrendingUp className="text-orange-400" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Lucro</p>
                    <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(profit)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profit >= 0 ? '+' : ''}{((profit / revenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${profit >= 0 ? 'bg-green-400/20' : 'bg-red-400/20'}`}>
                    <DollarSign className={profit >= 0 ? 'text-green-400' : 'text-red-400'} size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Detalhadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Informações do Projeto</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-blue-400" size={16} />
                    <div>
                      <p className="text-gray-400 text-sm">Consultor</p>
                      <p className="text-white">{project.consultor}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-400" size={16} />
                    <div>
                      <p className="text-gray-400 text-sm">Período</p>
                      <p className="text-white">
                        {project.start_date} até {project.end_date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-400" size={16} />
                    <div>
                      <p className="text-gray-400 text-sm">Horas Restantes</p>
                      <p className="text-white">
                        {Math.max((project.estimated_hours || 0) - (project.worked_hours || 0), 0)}h
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Descrição</h3>
                <p className="text-gray-300 leading-relaxed">
                  {project.descricao}
                </p>
                
                {project.notes && (
                  <>
                    <h4 className="text-md font-semibold text-white mt-4 mb-2">Notas</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {project.notes}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Barra de Progresso Visual */}
          <Card className="bg-[#18181b] border border-[#23232b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Progresso do Projeto</h3>
                <span className="text-blue-400 font-medium">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{project.worked_hours}h trabalhadas</span>
                <span>{project.estimated_hours}h estimadas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <ProjectTasks projectId={projectId} consultant={project.consultor} />
      )}

      {activeTab === 'attachments' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Responsivo */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Anexos do Projeto</h3>
            <button
              onClick={() => setIsAttachmentModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 touch-manipulation min-h-[44px] w-full sm:w-auto"
            >
              <Paperclip size={16} />
              <span>Gerenciar Anexos</span>
            </button>
          </div>

          {project.attachments && project.attachments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {project.attachments.map((attachment) => (
                <Card key={attachment.id} className="bg-[#18181b] border border-[#23232b] hover:border-[#2a2a2a] transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 text-xl flex-shrink-0">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{attachment.name}</p>
                        <p className="text-gray-400 text-xs">
                          {(attachment.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(attachment.uploaded_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-[#18181b] border border-[#23232b]">
              <CardContent className="p-6 sm:p-8 text-center">
                <Paperclip className="mx-auto text-gray-500 mb-4" size={40} />
                <p className="text-gray-400 text-sm sm:text-base">Nenhum anexo encontrado</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Clique em &quot;Gerenciar Anexos&quot; para adicionar arquivos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal de Anexos */}
      <Modal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        title="Gerenciar Anexos"
        size="lg"
      >
        <AttachmentModal
          project={project}
          onUpdate={handleUpdateAttachments}
        />
      </Modal>
    </main>
  );
} 