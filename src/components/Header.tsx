"use client";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { getUserName, userProfile } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between h-20 px-4 md:px-8 bg-[#10101a] border-b border-[#23232b]">
      <button className="md:hidden p-2 rounded hover:bg-axion-gradient transition-all">
        <Menu size={24} className="text-foreground" />
      </button>
      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground/80">
            Olá, {getUserName().split(' ')[0]}!
            {userProfile?.role === 'admin' && (
              <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                Admin
              </span>
            )}
          </span>
          <div className="w-9 h-9 rounded-full bg-axion-gradient flex items-center justify-center font-bold text-white shadow-lg">
            {getInitials(getUserName())}
          </div>
        </div>
      </div>
    </header>
  );
} 