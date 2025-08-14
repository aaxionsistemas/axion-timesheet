import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,

  Edit,
  Trash2,
  Clock,
  User,
  Calendar,
  CheckSquare,
  AlertCircle,
  Flag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import TaskForm from '@/components/TaskForm';
import { ProjectTask, TaskStatus, TaskPriority } from '@/types/project';

interface ProjectTasksProps {
  projectId: string;
  consultant: string;
}

// Mock data para tasks
const mockTasks: ProjectTask[] = [
  {
    id: 'task_001',
    project_id: 'proj_001',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Configurar Docker, banco de dados e dependências iniciais do projeto',
    status: 'concluida',
    priority: 'alta',
    assigned_to: 'Ana Silva',
    estimated_hours: 8,
    worked_hours: 6.5,
    due_date: '2024-01-20',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-20T17:30:00Z',
    completed_at: '2024-01-20T17:30:00Z'
  },
  {
    id: 'task_002',
    project_id: 'proj_001',
    title: 'Desenvolver API de autenticação',
    description: 'Implementar sistema de login, registro e autenticação JWT',
    status: 'em_andamento',
    priority: 'alta',
    assigned_to: 'Ana Silva',
    estimated_hours: 16,
    worked_hours: 12,
    due_date: '2024-01-25',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-22T14:20:00Z'
  },
  {
    id: 'task_003',
    project_id: 'proj_001',
    title: 'Interface de agendamento',
    description: 'Criar telas de agendamento de consultas para pacientes',
    status: 'pendente',
    priority: 'media',
    assigned_to: 'Ana Silva',
    estimated_hours: 24,
    worked_hours: 0,
    due_date: '2024-02-05',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 'task_004',
    project_id: 'proj_001',
    title: 'Testes automatizados',
    description: 'Implementar suite de testes unitários e integração',
    status: 'pendente',
    priority: 'baixa',
    estimated_hours: 20,
    worked_hours: 0,
    due_date: '2024-02-15',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  }
];

const statusLabels: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  em_revisao: 'Em Revisão',
  concluida: 'Concluída',
  cancelada: 'Cancelada'
};

const statusColors: Record<TaskStatus, string> = {
  pendente: 'bg-gray-500/10 text-gray-400',
  em_andamento: 'bg-blue-500/10 text-blue-400',
  em_revisao: 'bg-yellow-500/10 text-yellow-400',
  concluida: 'bg-green-500/10 text-green-400',
  cancelada: 'bg-red-500/10 text-red-400'
};

const priorityLabels: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente'
};

const priorityColors: Record<TaskPriority, string> = {
  baixa: 'bg-gray-500/10 text-gray-400',
  media: 'bg-blue-500/10 text-blue-400',
  alta: 'bg-orange-500/10 text-orange-400',
  urgente: 'bg-red-500/10 text-red-400'
};

export default function ProjectTasks({ projectId, consultant }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = (taskData: Partial<ProjectTask>) => {
    const now = new Date().toISOString();
    const newTask: ProjectTask = {
      id: `task_${crypto.randomUUID()}`,
      project_id: projectId,
      title: taskData.title || '',
      description: taskData.description,
      status: taskData.status || 'pendente',
      priority: taskData.priority || 'media',
      assigned_to: taskData.assigned_to || consultant,
      estimated_hours: taskData.estimated_hours,
      worked_hours: 0,
      due_date: taskData.due_date,
      created_at: now,
      updated_at: now
    };

    setTasks([...tasks, newTask]);
    setIsCreateModalOpen(false);
  };

  const handleEditTask = (taskData: Partial<ProjectTask>) => {
    if (!selectedTask) return;

    const updatedTask = {
      ...selectedTask,
      ...taskData,
      updated_at: new Date().toISOString(),
      ...(taskData.status === 'concluida' && !selectedTask.completed_at ? 
          { completed_at: new Date().toISOString() } : {})
    };

    setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const getProgressPercentage = (task: ProjectTask) => {
    if (!task.estimated_hours) return 0;
    return Math.min((task.worked_hours || 0) / task.estimated_hours * 100, 100);
  };

  const isOverdue = (task: ProjectTask) => {
    if (!task.due_date || task.status === 'concluida') return false;
    return new Date(task.due_date) < new Date();
  };

  // Estatísticas das tasks
  const stats = {
    total: tasks.length,
    pendente: tasks.filter(t => t.status === 'pendente').length,
    em_andamento: tasks.filter(t => t.status === 'em_andamento').length,
    concluida: tasks.filter(t => t.status === 'concluida').length,
    atrasadas: tasks.filter(t => isOverdue(t)).length
  };

  return (
    <div className="space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Tasks do Projeto</h2>
          <p className="text-sm sm:text-base text-gray-400">Gerenciar tarefas e acompanhar progresso</p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-h-[44px] w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>Nova Task</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-gray-400">Total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">{stats.pendente}</p>
            <p className="text-sm text-gray-400">Pendentes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.em_andamento}</p>
            <p className="text-sm text-gray-400">Em Andamento</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.concluida}</p>
            <p className="text-sm text-gray-400">Concluídas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.atrasadas}</p>
            <p className="text-sm text-gray-400">Atrasadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Responsivos */}
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Buscar tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-[#23232b] border-[#23232b] text-white rounded-xl focus:ring-blue-400 text-base w-full"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
          className="h-11 px-3 bg-[#23232b] border border-[#23232b] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-base w-full"
        >
          <option value="">Todos os status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
          className="h-11 px-3 bg-[#23232b] border border-[#23232b] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-base w-full"
        >
          <option value="">Todas as prioridades</option>
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        
        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] h-11 px-4 rounded-xl transition-all duration-300 text-sm font-medium touch-manipulation w-full"
        >
          <Filter size={16} />
          <span>Limpar Filtros</span>
        </button>
      </div>

      {/* Lista de Tasks */}
      {filteredTasks.length === 0 ? (
        <Card className="bg-[#18181b] border border-[#23232b]">
          <CardContent className="p-8 text-center">
            <CheckSquare className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">Nenhuma task encontrada</p>
            <p className="text-gray-500 text-sm mt-1">
              {tasks.length === 0 ? 'Clique em "Nova Task" para começar' : 'Tente ajustar os filtros'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="bg-[#18181b] border border-[#23232b] hover:border-[#2a2a2a] transition-all">
              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Header da task */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">{task.title}</h4>
                      {task.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    {isOverdue(task) && (
                      <AlertCircle className="text-red-400 flex-shrink-0 ml-2" size={16} />
                    )}
                  </div>

                  {/* Status e Prioridade */}
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[task.status]}>
                      {statusLabels[task.status]}
                    </Badge>
                    <Badge className={priorityColors[task.priority]}>
                      <Flag size={12} className="mr-1" />
                      {priorityLabels[task.priority]}
                    </Badge>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User size={14} />
                      <span>{task.assigned_to || 'Não atribuído'}</span>
                    </div>
                    
                    {task.due_date && (
                      <div className={`flex items-center gap-2 ${isOverdue(task) ? 'text-red-400' : 'text-gray-400'}`}>
                        <Calendar size={14} />
                        <span>Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    
                    {task.estimated_hours && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={14} />
                        <span>{task.worked_hours || 0}h / {task.estimated_hours}h</span>
                      </div>
                    )}
                  </div>

                  {/* Barra de progresso */}
                  {task.estimated_hours && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progresso</span>
                        <span className="text-blue-400">{getProgressPercentage(task).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(task)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center gap-1 pt-2 border-t border-[#23232b]">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 rounded-lg transition-all duration-300"
                      title="Editar task"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-300"
                      title="Excluir task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          defaultConsultant={consultant}
        />
      </Modal>

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Editar Task"
        size="lg"
      >
        {selectedTask && (
          <TaskForm
            onSubmit={handleEditTask}
            initialData={selectedTask}
            defaultConsultant={consultant}
          />
        )}
      </Modal>
    </div>
  );
} 