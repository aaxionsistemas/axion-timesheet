import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  PlayCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/types/project';
import { formatCurrency } from '@/lib/projectUtils';

interface ProjectStatsProps {
  projects: Project[];
}

export default function ProjectStats({ projects }: ProjectStatsProps) {
  const stats = React.useMemo(() => {
    const total = projects.length;
    const concluidos = projects.filter(p => p.status === 'concluido').length;
    const emAndamento = projects.filter(p => p.status === 'em_andamento').length;
    const pausados = projects.filter(p => p.status === 'pausado').length;
    const planejamento = projects.filter(p => p.status === 'planejamento').length;
    
    const totalHorasEstimadas = projects.reduce((acc, p) => acc + (p.estimated_hours || 0), 0);
    const totalHorasTrabalhadas = projects.reduce((acc, p) => acc + (p.worked_hours || 0), 0);
    
    const faturamentoPotencial = projects.reduce((acc, p) => {
      return acc + (p.valor_hora_canal * (p.estimated_hours || 0));
    }, 0);
    
    const faturamentoRealizado = projects.reduce((acc, p) => {
      return acc + (p.valor_hora_canal * (p.worked_hours || 0));
    }, 0);

    const custoRealizado = projects.reduce((acc, p) => {
      return acc + (p.valor_hora_consultor * (p.worked_hours || 0));
    }, 0);

    const lucroTotal = faturamentoRealizado - custoRealizado;
    
    return {
      total,
      concluidos,
      emAndamento,
      pausados,
      planejamento,
      totalHorasEstimadas,
      totalHorasTrabalhadas,
      faturamentoPotencial,
      faturamentoRealizado,
      custoRealizado,
      lucroTotal,
      percentualConclusao: total > 0 ? (concluidos / total) * 100 : 0,
      percentualHoras: totalHorasEstimadas > 0 ? (totalHorasTrabalhadas / totalHorasEstimadas) * 100 : 0
    };
  }, [projects]);

  const statCards = [
    {
      title: "Total de Projetos",
      value: stats.total,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
      subtitle: `${stats.concluidos} concluídos (${stats.percentualConclusao.toFixed(1)}%)`
    },
    {
      title: "Em Andamento",
      value: stats.emAndamento,
      icon: PlayCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
      subtitle: `${stats.pausados} pausados`
    },
    {
      title: "Lucro Total",
      value: formatCurrency(stats.lucroTotal),
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/20",
      subtitle: `Receita: ${formatCurrency(stats.faturamentoRealizado)} - Custo: ${formatCurrency(stats.custoRealizado)}`
    },
    {
      title: "Horas Trabalhadas",
      value: `${stats.totalHorasTrabalhadas}h`,
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-400/20",
      subtitle: `de ${stats.totalHorasEstimadas}h estimadas (${stats.percentualHoras.toFixed(1)}%)`
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-[#18181b] border border-[#23232b] shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm font-medium truncate">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{stat.subtitle}</p>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`${stat.color}`} size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 