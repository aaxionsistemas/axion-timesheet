"use client";

import React, { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import Modal from "@/components/ui/modal";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ProjectStats from "@/components/ProjectStats";
import AttachmentModal from "@/components/AttachmentModal";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Project, CreateProjectData, ProjectAttachment } from "@/types/project";

// Dados mockados para demonstração
const mockProjects: Project[] = [
  {
    id: "1",
    canal: "Direto",
    cliente: "Tech Solutions Ltda",
    descricao: "Implantação de sistema ERP completo para gestão empresarial",
    status: "em_andamento",
    produto: "ERP Enterprise",
    valor_hora_canal: 200,
    valor_hora_consultor: 150,
    consultor: "João Silva",
    estimated_hours: 120,
    worked_hours: 85,
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    notes: "Cliente muito exigente, atenção aos detalhes",
    attachments: [
      {
        id: "att1",
        project_id: "1",
        name: "Proposta_Comercial.pdf",
        file_url: "/uploads/proposta1.pdf",
        file_size: 2048000,
        mime_type: "application/pdf",
        uploaded_at: "2024-01-15T00:00:00Z"
      }
    ]
  },
  {
    id: "2",
    canal: "Parceiro",
    cliente: "FinanCorp",
    descricao: "Desenvolvimento de API para integração com bancos",
    status: "aguardando_cliente",
    produto: "API Banking",
    valor_hora_canal: 220,
    valor_hora_consultor: 180,
    consultor: "Maria Santos",
    estimated_hours: 80,
    worked_hours: 75,
    start_date: "2024-02-01",
    end_date: "2024-02-28",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-25T00:00:00Z",
    attachments: []
  },
  {
    id: "3",
    canal: "Direto",
    cliente: "DataX Analytics",
    descricao: "Painel de controle com relatórios e gráficos",
    status: "concluido",
    produto: "Dashboard BI",
    valor_hora_canal: 180,
    valor_hora_consultor: 140,
    consultor: "Pedro Costa",
    estimated_hours: 60,
    worked_hours: 60,
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-31T00:00:00Z",
    attachments: [
      {
        id: "att2",
        project_id: "3",
        name: "Especificacao_Tecnica.docx",
        file_url: "/uploads/spec.docx",
        file_size: 1024000,
        mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploaded_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "att3",
        project_id: "3",
        name: "Manual_Usuario.pdf",
        file_url: "/uploads/manual.pdf",
        file_size: 3072000,
        mime_type: "application/pdf",
        uploaded_at: "2024-01-31T00:00:00Z"
      }
    ]
  },
  {
    id: "4",
    canal: "Parceiro",
    cliente: "Loja Virtual SA",
    descricao: "E-commerce completo com painel administrativo",
    status: "planejamento",
    produto: "E-commerce Platform",
    valor_hora_canal: 250,
    valor_hora_consultor: 160,
    consultor: "Ana Oliveira",
    estimated_hours: 200,
    worked_hours: 45,
    start_date: "2024-03-01",
    end_date: "2024-05-31",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-28T00:00:00Z",
    attachments: []
  },
  {
    id: "5",
    canal: "Direto",
    cliente: "HealthTech Medical",
    descricao: "Sistema de gestão hospitalar com prontuário eletrônico",
    status: "em_andamento",
    produto: "Sistema Hospitalar",
    valor_hora_canal: 300,
    valor_hora_consultor: 220,
    consultor: "Dr. Carlos Mendes",
    estimated_hours: 300,
    worked_hours: 120,
    start_date: "2024-02-10",
    end_date: "2024-06-30",
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-28T00:00:00Z",
    notes: "Projeto crítico - Compliance LGPD obrigatório",
    attachments: [
      {
        id: "att4",
        project_id: "5",
        name: "LGPD_Compliance.pdf",
        file_url: "/uploads/lgpd.pdf",
        file_size: 1536000,
        mime_type: "application/pdf",
        uploaded_at: "2024-02-10T00:00:00Z"
      },
      {
        id: "att5",
        project_id: "5",
        name: "Arquitetura_Sistema.pptx",
        file_url: "/uploads/arquitetura.pptx",
        file_size: 5120000,
        mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        uploaded_at: "2024-02-15T00:00:00Z"
      }
    ]
  },
  {
    id: "6",
    canal: "Parceiro",
    cliente: "EduTech Solutions",
    descricao: "Plataforma de ensino à distância com gamificação",
    status: "pausado",
    produto: "LMS Gamificado",
    valor_hora_canal: 180,
    valor_hora_consultor: 130,
    consultor: "Sofia Rodriguez",
    estimated_hours: 150,
    worked_hours: 90,
    start_date: "2024-01-20",
    end_date: "2024-04-20",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-02-25T00:00:00Z",
    notes: "Projeto pausado - aguardando definições de gamificação do cliente",
    attachments: [
      {
        id: "att6",
        project_id: "6",
        name: "Wireframes_v2.fig",
        file_url: "/uploads/wireframes.fig",
        file_size: 2560000,
        mime_type: "application/octet-stream",
        uploaded_at: "2024-01-25T00:00:00Z"
      }
    ]
  }
];

function ProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Modal de visualização removido - agora usa página de detalhes
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleCreateProject = async (data: CreateProjectData) => {
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject: Project = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      worked_hours: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    setIsCreateModalOpen(false);
    setIsLoading(false);
    
    addToast({
      type: 'success',
      title: 'Projeto criado!',
      message: `O projeto para ${data.cliente} foi criado com sucesso.`
    });
  };

  const handleEditProject = async (data: CreateProjectData) => {
    if (!selectedProject) return;
    
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedProject: Project = {
      ...selectedProject,
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setIsEditModalOpen(false);
    setSelectedProject(null);
    setIsLoading(false);
    
    addToast({
      type: 'success',
      title: 'Projeto atualizado!',
      message: `As alterações do projeto ${selectedProject.cliente} foram salvas.`
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const deletedProject = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setIsLoading(false);
    
    addToast({
      type: 'success',
      title: 'Projeto excluído!',
      message: `O projeto ${deletedProject?.cliente || ''} foi removido com sucesso.`
    });
  };

  // Navegação para detalhes agora é feita diretamente no ProjectList

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleAttachmentClick = (project: Project) => {
    setSelectedProject(project);
    setIsAttachmentModalOpen(true);
  };

  const handleUpdateAttachments = (attachments: ProjectAttachment[]) => {
    if (!selectedProject) return;
    
    const updatedProject = { ...selectedProject, attachments };
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    
    addToast({
      type: 'success',
      title: 'Anexos atualizados!',
      message: 'Os arquivos do projeto foram atualizados com sucesso.'
    });
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-blue-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold axion-gradient bg-clip-text text-transparent">
              Projetos
            </h2>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-h-[44px] sm:min-h-0"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Novo Projeto</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

      <ProjectStats projects={projects} />

      <ProjectList
        projects={projects}
        onEdit={handleEditClick}
        onDelete={handleDeleteProject}
        onAttachment={handleAttachmentClick}
        isLoading={isLoading}
      />

      {/* Modal de Criação */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Projeto"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          isLoading={isLoading}
        />
      </Modal>

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        title="Editar Projeto"
        size="lg"
      >
        {selectedProject && (
          <ProjectForm
            onSubmit={handleEditProject}
            initialData={selectedProject}
            isLoading={isLoading}
          />
        )}
      </Modal>

      {/* Modal de visualização removido - agora usa página de detalhes dedicada */}

      {/* Modal de Anexos */}
      <Modal
        isOpen={isAttachmentModalOpen}
        onClose={() => {
          setIsAttachmentModalOpen(false);
          setSelectedProject(null);
        }}
        title="Gerenciar Anexos"
        size="lg"
      >
        {selectedProject && (
          <AttachmentModal
            project={selectedProject}
            onUpdate={handleUpdateAttachments}
          />
        )}
      </Modal>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <ToastProvider>
      <ProjectsPageContent />
    </ToastProvider>
  );
} 