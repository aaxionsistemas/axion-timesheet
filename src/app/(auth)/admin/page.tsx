"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  Building, 
  UserCog,
  Settings,
  Shield,
  Activity
} from "lucide-react";
import Link from "next/link";
import { AdminStatsService } from "@/lib/adminService";
import { AdminStats } from "@/types/admin";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    active_users: 0,
    total_consultants: 0,
    active_consultants: 0,
    total_canals: 0,
    active_canals: 0,
    total_clients: 0,
    active_clients: 0,
  });
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await AdminStatsService.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Manter valores padrão em caso de erro
    } finally {
      // setIsLoading(false);
    }
  };

  const adminSections = [
    {
      title: "Usuários",
      description: "Gerenciar usuários do sistema",
      icon: Users,
      href: "/admin/users",
      stats: `${stats.active_users}/${stats.total_users} ativos`,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Consultores",
      description: "Gerenciar consultores e especialistas",
      icon: UserCog,
      href: "/admin/consultants",
      stats: `${stats.active_consultants}/${stats.total_consultants} ativos`,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Canais",
      description: "Gerenciar canais de venda",
      icon: Activity,
      href: "/admin/canals",
      stats: `${stats.active_canals}/${stats.total_canals} ativos`,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      title: "Clientes",
      description: "Gerenciar base de clientes",
      icon: Building,
      href: "/admin/clients",
      stats: `${stats.active_clients}/${stats.total_clients} ativos`,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold axion-gradient bg-clip-text text-transparent">
              Administração
            </h2>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total de Usuários</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.total_users}</p>
                  <p className="text-xs text-foreground/50">{stats.active_users} ativos</p>
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
                  <p className="text-sm text-foreground/60">Consultores</p>
                  <p className="text-2xl font-bold text-green-400">{stats.total_consultants}</p>
                  <p className="text-xs text-foreground/50">{stats.active_consultants} ativos</p>
                </div>
                <div className="p-3 bg-green-400/10 rounded-lg">
                  <UserCog className="text-green-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Canais</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.total_canals}</p>
                  <p className="text-xs text-foreground/50">{stats.active_canals} ativos</p>
                </div>
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <Activity className="text-purple-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Clientes</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.total_clients}</p>
                  <p className="text-xs text-foreground/50">{stats.active_clients} ativos</p>
                </div>
                <div className="p-3 bg-orange-400/10 rounded-lg">
                  <Building className="text-orange-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.href} className="bg-[#18181b] border border-[#23232b] shadow-lg hover:border-[#333] transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.bgColor}`}>
                        <Icon className={section.color} size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {section.title}
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground/70">
                      {section.stats}
                    </div>
                    <Link 
                      href={section.href}
                      className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-3 py-2 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-xs"
                    >
                      Gerenciar
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Settings className="text-blue-400" size={20} />
              <span className="font-medium text-white text-base sm:text-lg">
                Ações Rápidas
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/admin/users" className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 py-3 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                <UserCheck size={16} className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">Novo Usuário</span>
              </Link>
              <Link href="/admin/consultants" className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 py-3 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                <UserCog size={16} className="text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">Novo Consultor</span>
              </Link>
              <Link href="/admin/canals" className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 py-3 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                <Activity size={16} className="text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">Novo Canal</span>
              </Link>
              <Link href="/admin/clients" className="group flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 py-3 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                <Building size={16} className="text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">Novo Cliente</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
