"use client";

import React, { useState, useEffect } from "react";
import { Plus, FolderOpen } from "lucide-react";
import Modal from "@/components/ui/modal";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ProjectStats from "@/components/ProjectStats";
import AttachmentModal from "@/components/AttachmentModal";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Project, CreateProjectData, ProjectAttachment } from "@/types/project";
import { ProjectService } from "@/lib/projectService";

function ProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Modal de visualização removido - agora usa página de detalhes
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { addToast } = useToast();

  // Carregar projetos ao montar o componente
  useEffect(() => {
    loadProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProjects = async () => {
    try {
      setIsInitialLoading(true);
      const projectsData = await ProjectService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      addToast({
        type: 'error',
        title: 'Erro ao carregar projetos',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao carregar projetos'
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleCreateProject = async (data: CreateProjectData) => {
    setIsLoading(true);
    
    try {
      const newProject = await ProjectService.createProject(data);
      setProjects(prev => [...prev, newProject]);
      setIsCreateModalOpen(false);
      
      addToast({
        type: 'success',
        title: 'Projeto criado!',
        message: `O projeto para ${data.cliente} foi criado com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      addToast({
        type: 'error',
        title: 'Erro ao criar projeto',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao criar projeto'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async (data: CreateProjectData) => {
    if (!selectedProject) return;
    
    setIsLoading(true);
    
    try {
      const updatedProject = await ProjectService.updateProject({
        id: selectedProject.id,
        ...data
      });
      
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
      setIsEditModalOpen(false);
      setSelectedProject(null);
      
      addToast({
        type: 'success',
        title: 'Projeto atualizado!',
        message: `As alterações do projeto ${selectedProject.cliente} foram salvas.`
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      addToast({
        type: 'error',
        title: 'Erro ao atualizar projeto',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar projeto'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    setIsLoading(true);
    
    try {
      const deletedProject = projects.find(p => p.id === projectId);
      await ProjectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      addToast({
        type: 'success',
        title: 'Projeto excluído!',
        message: `O projeto ${deletedProject?.cliente || ''} foi removido com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      addToast({
        type: 'error',
        title: 'Erro ao excluir projeto',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao excluir projeto'
      });
    } finally {
      setIsLoading(false);
    }
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

      {isInitialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Carregando projetos...</div>
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={handleEditClick}
          onDelete={handleDeleteProject}
          onAttachment={handleAttachmentClick}
          isLoading={isLoading}
        />
      )}

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