"use client";
import { useState } from "react";
import { 
  Menu, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Shield, 
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { getUserName, userProfile, signOut } = useAuth();
  const [notifications] = useState(3); // Simulando notificações

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 lg:px-6 bg-[#10101a]/95 backdrop-blur-sm border-b border-[#23232b] shadow-lg">
      {/* Menu Mobile */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-[#23232b] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-[#23232b] transition-all duration-300 hover:scale-105 active:scale-95">
          <Bell size={18} className="text-gray-400" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {notifications > 9 ? '9+' : notifications}
            </span>
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">
            {getUserName().split(' ')[0]}
          </span>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#23232b] transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-blue-500/20">
                  {getInitials(getUserName())}
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-[#18181b] border border-[#23232b] shadow-xl"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-[#23232b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                  {getInitials(getUserName())}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{getUserName()}</p>
                  <p className="text-gray-400 text-xs">{userProfile?.email}</p>
                  {userProfile?.role && (
                    <div className="mt-1">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border font-medium ${
                        userProfile.role === 'master_admin' 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                          : userProfile.role === 'admin'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : userProfile.role === 'consultant'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        <Shield size={10} />
                        {userProfile.role === 'master_admin' ? 'Master Admin' 
                         : userProfile.role === 'admin' ? 'Admin'
                         : userProfile.role === 'consultant' ? 'Consultor'
                         : 'Visualização'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#23232b] cursor-pointer">
                <User size={16} />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#23232b] cursor-pointer">
                <Settings size={16} />
                <span>Configurações</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#23232b]" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 